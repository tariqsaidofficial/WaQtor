/**
 * Message Routes
 * Endpoints for sending messages
 */

const express = require('express');
const router = express.Router();
const waClient = require('../waClient');
const logger = require('../utils/logger');
const { validateMessage } = require('../utils/validator');
const { replaceVariables } = require('../utils/variableReplacer');
const { MessageMedia } = require('../../../index');
const { Message, WhatsAppSession } = require('../models');
const { jwtAuth } = require('../middlewares/jwtAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Apply JWT authentication to all routes
router.use(jwtAuth);

// Enhanced handler reference (will be set by server)
let enhancedHandler = null;

/**
 * Helper: Save message to database
 */
async function saveMessageToDatabase(userId, sessionId, messageData) {
    try {
        const message = await Message.create({
            session_id: sessionId,
            user_id: userId,
            message_id: messageData.id,
            to_phone: messageData.to,
            from_phone: messageData.from || null,
            body: messageData.body,
            status: messageData.status || 'sent',
            ack_code: messageData.ack || 1,
            direction: 'outgoing',
            has_media: messageData.hasMedia || false,
            media_url: messageData.mediaUrl || null,
            metadata: messageData.metadata || {}
        });
        
        logger.info(`💾 Message saved to database: ${message.id}`);
        return message;
    } catch (error) {
        logger.error('Error saving message to database:', error);
        // Don't fail the request if DB save fails
        return null;
    }
}

/**
 * Helper: Get user's default session
 */
async function getUserDefaultSession(userId) {
    try {
        const session = await WhatsAppSession.findOne({
            where: { 
                user_id: userId,
                is_active: true,
                is_ready: true
            },
            order: [['created_at', 'DESC']]
        });
        return session;
    } catch (error) {
        logger.error('Error getting user session:', error);
        return null;
    }
}

// Export function to set enhanced handler
router.setEnhancedHandler = (handler) => {
    enhancedHandler = handler;
    logger.info('✅ Enhanced handler set in message routes');
};

// File size limits (in bytes)
const FILE_LIMITS = {
    IMAGE: 3 * 1024 * 1024,      // 3MB for images
    PDF: 5 * 1024 * 1024,         // 5MB for PDF
    VIDEO: 60 * 1024 * 1024,      // 60MB for videos
    DOCUMENT: 10 * 1024 * 1024,   // 10MB for other documents
    AUDIO: 16 * 1024 * 1024       // 16MB for audio
};

// Storage retention period
const RETENTION_DAYS = 30;

// Configure multer storage with date-based organization
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create date-based folder: uploads/YYYY-MM-DD/
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const uploadDir = path.join(__dirname, '../../../uploads', today);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            logger.info(`📁 Created upload directory: ${uploadDir}`);
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-originalname
        const timestamp = Date.now();
        const uniqueName = `${timestamp}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Configure multer for file uploads with dynamic size limits
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 60 * 1024 * 1024 // Max 60MB (will be validated per file type)
    },
    fileFilter: (req, file, cb) => {
        // Allow common image, document, and video formats
        const allowedTypes = /jpeg|jpg|png|gif|webp|bmp|svg|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|mp4|avi|mov|wmv|mp3|wav|ogg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        
        // Also check mimetype for extra validation
        const allowedMimetypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml',
            'application/pdf',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv',
            'audio/mpeg', 'audio/wav', 'audio/ogg'
        ];
        const mimetypeValid = allowedMimetypes.includes(file.mimetype);

        if (extname && mimetypeValid) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: images, PDF, Word, Excel, PowerPoint, videos, audio'));
        }
    }
});

/**
 * Validate file size based on file type
 */
function validateFileSize(file) {
    const mimetype = file.mimetype;
    const size = file.size;
    
    // Check size based on file type
    if (mimetype.startsWith('image/')) {
        if (size > FILE_LIMITS.IMAGE) {
            return { valid: false, message: `Image size exceeds limit. Max: ${FILE_LIMITS.IMAGE / (1024 * 1024)}MB` };
        }
    } else if (mimetype === 'application/pdf') {
        if (size > FILE_LIMITS.PDF) {
            return { valid: false, message: `PDF size exceeds limit. Max: ${FILE_LIMITS.PDF / (1024 * 1024)}MB` };
        }
    } else if (mimetype.startsWith('video/')) {
        if (size > FILE_LIMITS.VIDEO) {
            return { valid: false, message: `Video size exceeds limit. Max: ${FILE_LIMITS.VIDEO / (1024 * 1024)}MB` };
        }
    } else if (mimetype.startsWith('audio/')) {
        if (size > FILE_LIMITS.AUDIO) {
            return { valid: false, message: `Audio size exceeds limit. Max: ${FILE_LIMITS.AUDIO / (1024 * 1024)}MB` };
        }
    } else {
        // Other documents
        if (size > FILE_LIMITS.DOCUMENT) {
            return { valid: false, message: `Document size exceeds limit. Max: ${FILE_LIMITS.DOCUMENT / (1024 * 1024)}MB` };
        }
    }
    
    return { valid: true };
}

/**
 * Clean up old files (older than RETENTION_DAYS)
 * Run this periodically or on server start
 */
async function cleanupOldFiles() {
    try {
        const uploadsDir = path.join(__dirname, '../../../uploads');
        
        if (!fs.existsSync(uploadsDir)) {
            return;
        }
        
        const folders = fs.readdirSync(uploadsDir);
        const today = new Date();
        let deletedCount = 0;
        let warningFolders = [];
        
        for (const folder of folders) {
            // Skip if not a date folder (YYYY-MM-DD format)
            if (!/^\d{4}-\d{2}-\d{2}$/.test(folder)) {
                continue;
            }
            
            const folderPath = path.join(uploadsDir, folder);
            const folderDate = new Date(folder);
            const daysDiff = Math.floor((today - folderDate) / (1000 * 60 * 60 * 24));
            
            // Warning: 3 days before deletion (day 27, 28, 29)
            if (daysDiff >= RETENTION_DAYS - 3 && daysDiff < RETENTION_DAYS) {
                warningFolders.push({
                    folder,
                    daysLeft: RETENTION_DAYS - daysDiff
                });
            }
            
            // Delete folders older than retention period
            if (daysDiff >= RETENTION_DAYS) {
                const files = fs.readdirSync(folderPath);
                
                // Delete all files in folder
                for (const file of files) {
                    fs.unlinkSync(path.join(folderPath, file));
                    deletedCount++;
                }
                
                // Delete the folder itself
                fs.rmdirSync(folderPath);
                logger.info(`🗑️ Deleted old upload folder: ${folder} (${daysDiff} days old)`);
            }
        }
        
        // Log warnings for folders about to be deleted
        if (warningFolders.length > 0) {
            logger.warn('⚠️ Upload folders will be deleted soon:');
            warningFolders.forEach(({ folder, daysLeft }) => {
                logger.warn(`   - ${folder} (${daysLeft} day(s) remaining)`);
            });
        }
        
        if (deletedCount > 0) {
            logger.info(`🧹 Cleanup complete: ${deletedCount} old files deleted`);
        }
    } catch (error) {
        logger.error('Error during cleanup:', error);
    }
}

// Run cleanup on server start
cleanupOldFiles();

// Schedule cleanup to run daily at midnight
setInterval(() => {
    logger.info('🕐 Running scheduled cleanup...');
    cleanupOldFiles();
}, 24 * 60 * 60 * 1000); // Every 24 hours

/**
 * POST /api/messages/send-text
 * Send a text message
 */
router.post('/send-text', validateMessage, async (req, res) => {
    try {
        const { phone, message, ...recipientData } = req.body;
        const client = waClient.getClient();

        // Get user's session
        const session = await getUserDefaultSession(req.userId);
        if (!session) {
            return res.status(400).json({
                success: false,
                error: 'No active WhatsApp session found. Please create a session first.'
            });
        }

        // Format phone number (add @c.us if not present)
        const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;

        // Replace variables in message
        const finalMessage = replaceVariables(message, {
            phone: phone,
            ...recipientData
        });

        // Send message
        const sentMessage = await client.sendMessage(chatId, finalMessage);

        // Save to database
        await saveMessageToDatabase(req.userId, session.id, {
            id: sentMessage.id._serialized,
            to: phone,
            body: finalMessage,
            status: 'sent',
            ack: 1,
            hasMedia: false
        });

        logger.info(`Message sent to ${phone}`);

        res.json({
            success: true,
            message: 'Message sent successfully',
            data: {
                id: sentMessage.id._serialized,
                timestamp: sentMessage.timestamp,
                to: phone
            }
        });
    } catch (error) {
        logger.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message',
            message: error.message
        });
    }
});

/**
 * POST /api/messages/send-media
 * Send a media message (image, video, document)
 */
router.post('/send-media', async (req, res) => {
    try {
        const { phone, mediaUrl, caption, filename } = req.body;

        if (!phone || !mediaUrl) {
            return res.status(400).json({
                success: false,
                error: 'Phone and mediaUrl are required'
            });
        }

        const client = waClient.getClient();
        const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;

        // Create media from URL
        const media = await MessageMedia.fromUrl(mediaUrl, { filename });

        // Send media
        const sentMessage = await client.sendMessage(chatId, media, { 
            caption: caption || '' 
        });

        logger.info(`Media sent to ${phone}`);

        res.json({
            success: true,
            message: 'Media sent successfully',
            data: {
                id: sentMessage.id._serialized,
                timestamp: sentMessage.timestamp,
                to: phone
            }
        });
    } catch (error) {
        logger.error('Error sending media:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send media',
            message: error.message
        });
    }
});

/**
 * POST /api/messages/send-bulk
 * Send bulk messages (Hybrid: Instant for <=10, Queue for >10)
 */
router.post('/send-bulk', async (req, res) => {
    try {
        const { recipients } = req.body; // Array of {phone, message}

        if (!Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Recipients array is required'
            });
        }

        const INSTANT_THRESHOLD = 10;

        // HYBRID MODE: Instant for small batches, Queue for large batches
        if (recipients.length <= INSTANT_THRESHOLD) {
            // ⚡ INSTANT MODE (<=10 recipients)
            logger.info(`📤 Sending ${recipients.length} messages instantly (Instant Mode)`);
            
            const client = waClient.getClient();
            const results = [];

            for (const recipient of recipients) {
                try {
                    const chatId = recipient.phone.includes('@c.us') 
                        ? recipient.phone 
                        : `${recipient.phone}@c.us`;

                    // Replace variables in message
                    const finalMessage = replaceVariables(recipient.message, {
                        phone: recipient.phone,
                        name: recipient.name,
                        email: recipient.email,
                        company: recipient.company,
                        position: recipient.position,
                        order_id: recipient.order_id,
                        amount: recipient.amount,
                        product: recipient.product,
                        link: recipient.link,
                        custom1: recipient.custom1,
                        custom2: recipient.custom2,
                        custom3: recipient.custom3,
                        signature: recipient.signature
                    });

                    const sentMessage = await client.sendMessage(chatId, finalMessage);
                    
                    results.push({
                        phone: recipient.phone,
                        success: true,
                        messageId: sentMessage.id._serialized
                    });

                    // Delay to avoid rate limiting (2 seconds)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    results.push({
                        phone: recipient.phone,
                        success: false,
                        error: error.message
                    });
                }
            }

            logger.info(`✅ Bulk message sent instantly to ${recipients.length} recipients`);

            return res.json({
                success: true,
                message: 'Bulk messages sent instantly',
                mode: 'instant',
                data: {
                    total: recipients.length,
                    successful: results.filter(r => r.success).length,
                    failed: results.filter(r => !r.success).length,
                    results
                }
            });

        } else {
            // 🔄 QUEUE MODE (>10 recipients)
            logger.info(`📋 Queueing ${recipients.length} messages (Queue Mode)`);
            
            const { addBulkMessageJob } = require('../queue/messageQueue');
            const job = await addBulkMessageJob(recipients, {
                priority: 5
            });

            logger.info(`✅ Bulk message job created: ${job.id}`);

            return res.json({
                success: true,
                message: 'Bulk messages queued for processing',
                mode: 'queue',
                data: {
                    jobId: job.id,
                    total: recipients.length,
                    status: 'queued',
                    estimatedTime: `~${Math.ceil(recipients.length * 2 / 60)} minutes`
                }
            });
        }

    } catch (error) {
        logger.error('Error sending bulk messages:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send bulk messages',
            message: error.message
        });
    }
});

/**
 * POST /api/messages/send-bulk-with-media
 * Send bulk messages with optional media attachments
 */
router.post('/send-bulk-with-media', upload.array('attachments', 5), async (req, res) => {
    const uploadedFiles = [];
    
    try {
        const { recipients } = req.body; // Array of {phone, message} as JSON string
        const files = req.files || [];

        // Parse recipients if it's a string
        const recipientsData = typeof recipients === 'string' 
            ? JSON.parse(recipients) 
            : recipients;

        if (!Array.isArray(recipientsData) || recipientsData.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Recipients array is required'
            });
        }

        logger.info(`📤 Sending bulk messages with ${files.length} attachments to ${recipientsData.length} recipients`);

        const client = waClient.getClient();
        const results = [];

        // Process attachments if any
        let mediaObjects = [];
        if (files.length > 0) {
            for (const file of files) {
                uploadedFiles.push(file.path);
                
                // Validate file size
                const sizeValidation = validateFileSize(file);
                if (!sizeValidation.valid) {
                    // Delete uploaded files
                    uploadedFiles.forEach(fp => {
                        if (fs.existsSync(fp)) fs.unlinkSync(fp);
                    });
                    
                    return res.status(400).json({
                        success: false,
                        error: sizeValidation.message
                    });
                }
                
                // Determine if file should be sent as document
                const sendAsDocument = !file.mimetype.startsWith('image/') && 
                                      !file.mimetype.startsWith('video/') && 
                                      !file.mimetype.startsWith('audio/');
                
                const fileData = fs.readFileSync(file.path, { encoding: 'base64' });
                const media = new MessageMedia(
                    file.mimetype,
                    fileData,
                    file.originalname
                );
                
                // Store media with metadata
                mediaObjects.push({
                    media: media,
                    sendAsDocument: sendAsDocument,
                    filename: file.originalname,
                    mimetype: file.mimetype
                });
                
                logger.info(`📎 Prepared attachment: ${file.originalname} (${file.mimetype}, sendAsDocument: ${sendAsDocument})`);
            }
        }

        // Send to each recipient
        for (const recipient of recipientsData) {
            try {
                const chatId = recipient.phone.includes('@c.us') 
                    ? recipient.phone 
                    : `${recipient.phone}@c.us`;

                // Replace variables in message
                const finalMessage = replaceVariables(recipient.message, {
                    phone: recipient.phone,
                    name: recipient.name,
                    email: recipient.email,
                    company: recipient.company,
                    position: recipient.position,
                    order_id: recipient.order_id,
                    amount: recipient.amount,
                    product: recipient.product,
                    link: recipient.link,
                    custom1: recipient.custom1,
                    custom2: recipient.custom2,
                    custom3: recipient.custom3,
                    signature: recipient.signature
                });

                let sentMessage;
                
                // If there are attachments, send them WITH the message as caption
                if (mediaObjects.length > 0) {
                    // Send first attachment with the message as caption
                    const firstMedia = mediaObjects[0];
                    sentMessage = await client.sendMessage(chatId, firstMedia.media, {
                        caption: finalMessage,
                        sendMediaAsDocument: firstMedia.sendAsDocument
                    });
                    
                    logger.info(`📎 Sent message with ${firstMedia.mimetype} to ${recipient.phone} (asDocument: ${firstMedia.sendAsDocument})`);
                    
                    // Send remaining attachments if any (without caption)
                    for (let i = 1; i < mediaObjects.length; i++) {
                        const mediaObj = mediaObjects[i];
                        await client.sendMessage(chatId, mediaObj.media, {
                            sendMediaAsDocument: mediaObj.sendAsDocument
                        });
                        logger.info(`📎 Sent additional ${mediaObj.mimetype} to ${recipient.phone}`);
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay between attachments
                    }
                } else {
                    // No attachments, send text only
                    sentMessage = await client.sendMessage(chatId, finalMessage);
                }
                
                // Track message for status updates
                if (enhancedHandler && sentMessage) {
                    enhancedHandler.trackMessage(sentMessage.id._serialized, chatId);
                }
                
                results.push({
                    phone: recipient.phone,
                    success: true,
                    messageId: sentMessage.id._serialized,
                    attachmentsSent: mediaObjects.length
                });

                // Delay to avoid rate limiting (2 seconds)
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                logger.error(`Failed to send to ${recipient.phone}:`, error);
                results.push({
                    phone: recipient.phone,
                    success: false,
                    error: error.message
                });
            }
        }

        logger.info(`✅ Bulk messages with media sent to ${recipientsData.length} recipients`);

        res.json({
            success: true,
            message: 'Bulk messages with media sent successfully',
            data: {
                total: recipientsData.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                attachments: files.length,
                results
            }
        });

    } catch (error) {
        logger.error('Error sending bulk messages with media:', error);
        
        // Clean up uploaded files on error
        uploadedFiles.forEach(filePath => {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (cleanupError) {
                logger.warn(`Failed to cleanup file: ${cleanupError.message}`);
            }
        });

        res.status(500).json({
            success: false,
            error: 'Failed to send bulk messages with media',
            message: error.message
        });
    }
});

/**
 * POST /api/messages/upload
 * Upload a file
 */
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        const { originalname, mimetype, size } = req.file;

        // File info
        logger.info(`File uploaded: ${originalname} (${mimetype}, ${size} bytes)`);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                path: req.file.path
            }
        });
    } catch (error) {
        logger.error('Error uploading file:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload file',
            message: error.message
        });
    }
});

/**
 * POST /api/messages/send-file
 * Send a message with file attachment
 */
router.post('/send-file', upload.single('file'), async (req, res) => {
    let uploadedFilePath = null;
    
    try {
        const { phone, caption } = req.body;
        const file = req.file;

        if (!phone) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required'
            });
        }

        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'File is required'
            });
        }

        // Validate file size based on type
        const sizeValidation = validateFileSize(file);
        if (!sizeValidation.valid) {
            // Delete the uploaded file since it's too large
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({
                success: false,
                error: sizeValidation.message
            });
        }

        uploadedFilePath = file.path;
        
        // Verify file exists before proceeding
        if (!fs.existsSync(uploadedFilePath)) {
            logger.error(`File not found: ${uploadedFilePath}`);
            return res.status(500).json({
                success: false,
                error: 'Uploaded file not found on server'
            });
        }

        const client = waClient.getClient();
        const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;

        logger.info(`Processing file: ${file.originalname} (${file.size} bytes, ${file.mimetype})`);
        logger.info(`File path: ${uploadedFilePath}`);
        logger.info(`File exists: ${fs.existsSync(uploadedFilePath)}`);

        // Read file data as base64 - THIS MUST HAPPEN BEFORE DELETING THE FILE!
        const fileData = fs.readFileSync(uploadedFilePath, { encoding: 'base64' });
        
        // Create MessageMedia with explicit mimetype
        const media = new MessageMedia(
            file.mimetype, 
            fileData, 
            file.originalname,
            file.size
        );

        logger.info(`Created MessageMedia: filename=${media.filename}, mimetype=${media.mimetype}, size=${media.filesize}, dataLength=${media.data.length}`);
        logger.info(`Sending file to ${phone}...`);

        // Send media with caption - WAIT for this to complete!
        const sentMessage = await client.sendMessage(chatId, media, {
            caption: caption || '',
            sendMediaAsDocument: false // Force images to be sent as images, not documents
        });

        logger.info(`✅ File sent successfully to ${phone}: ${file.originalname}`);
        logger.info(`📦 File stored in: ${uploadedFilePath} (will be kept for ${RETENTION_DAYS} days)`);

        res.json({
            success: true,
            message: 'File sent successfully',
            data: {
                id: sentMessage.id._serialized,
                timestamp: sentMessage.timestamp,
                to: phone,
                filename: file.originalname,
                filesize: file.size,
                mimetype: file.mimetype,
                storedPath: uploadedFilePath
            }
        });
    } catch (error) {
        logger.error('❌ Error sending file:', error);
        logger.error('Error stack:', error.stack);
        
        // Clean up file on error only
        try {
            if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
                fs.unlinkSync(uploadedFilePath);
                logger.info(`🧹 Cleaned up temp file after error: ${uploadedFilePath}`);
            }
        } catch (cleanupError) {
            logger.warn(`Failed to cleanup temp file after error: ${cleanupError.message}`);
        }

        res.status(500).json({
            success: false,
            error: 'Failed to send file',
            message: error.message
        });
    }
});

module.exports = router;
