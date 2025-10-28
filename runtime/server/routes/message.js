/**
 * Message Routes
 * Endpoints for sending messages
 */

const express = require('express');
const router = express.Router();
const waClient = require('../waClient');
const logger = require('../utils/logger');
const { validateMessage } = require('../utils/validator');
const { MessageMedia } = require('../../../index');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
        const { phone, message } = req.body;
        const client = waClient.getClient();

        // Format phone number (add @c.us if not present)
        const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;

        // Send message
        const sentMessage = await client.sendMessage(chatId, message);

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
 * Send bulk messages
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

        const client = waClient.getClient();
        const results = [];

        for (const recipient of recipients) {
            try {
                const chatId = recipient.phone.includes('@c.us') 
                    ? recipient.phone 
                    : `${recipient.phone}@c.us`;

                const sentMessage = await client.sendMessage(chatId, recipient.message);
                
                results.push({
                    phone: recipient.phone,
                    success: true,
                    messageId: sentMessage.id._serialized
                });

                // Delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                results.push({
                    phone: recipient.phone,
                    success: false,
                    error: error.message
                });
            }
        }

        logger.info(`Bulk message sent to ${recipients.length} recipients`);

        res.json({
            success: true,
            message: 'Bulk messages processed',
            data: {
                total: recipients.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                results
            }
        });
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
