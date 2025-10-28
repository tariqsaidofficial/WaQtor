/**
 * Test Helper Route
 * Quick testing endpoint using TEST_PHONE_NUMBER from .env
 */

const express = require('express');
const router = express.Router();
const waClient = require('../waClient');
const logger = require('../utils/logger');

/**
 * POST /api/test/send
 * Send a test message to the phone number configured in .env
 */
router.post('/send', async (req, res) => {
    try {
        const testPhone = process.env.TEST_PHONE_NUMBER;
        const { message } = req.body;

        if (!testPhone) {
            return res.status(400).json({
                success: false,
                error: 'TEST_PHONE_NUMBER not configured',
                message: 'Please set TEST_PHONE_NUMBER in your .env file'
            });
        }

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required',
                message: 'Please provide a message in the request body'
            });
        }

        const client = waClient.getClient();
        const chatId = testPhone.includes('@c.us') ? testPhone : `${testPhone}@c.us`;

        // Send message
        const sentMessage = await client.sendMessage(chatId, message);

        logger.info('Test message sent to configured test number');

        res.json({
            success: true,
            message: 'Test message sent successfully',
            data: {
                id: sentMessage.id._serialized,
                timestamp: sentMessage.timestamp,
                to: 'TEST_PHONE_NUMBER (hidden for security)'
            }
        });
    } catch (error) {
        logger.error('Error sending test message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send test message',
            message: error.message
        });
    }
});

/**
 * GET /api/test/info
 * Get test configuration info (without revealing actual phone number)
 */
router.get('/info', (req, res) => {
    const testPhone = process.env.TEST_PHONE_NUMBER;
    
    res.json({
        success: true,
        data: {
            configured: !!testPhone,
            message: testPhone 
                ? 'Test phone number is configured. Use POST /api/test/send to send a test message.'
                : 'Test phone number is NOT configured. Please set TEST_PHONE_NUMBER in your .env file.',
            phoneNumberMasked: testPhone 
                ? `***${testPhone.slice(-4)}` 
                : null
        }
    });
});

module.exports = router;
