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

module.exports = router;
