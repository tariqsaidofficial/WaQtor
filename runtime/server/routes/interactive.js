/**
 * Interactive Bot Routes
 * API endpoints for WhatsApp Interactive Messages
 */

const express = require('express');
const router = express.Router();
const interactiveBotService = require('../services/interactiveBotService');

/**
 * POST /api/interactive/demo
 * Start demo conversation with language selection
 */
router.post('/demo', async (req, res) => {
    try {
        const { chatId } = req.body;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                error: 'chatId is required'
            });
        }

        const client = req.app.get('whatsappClient');
        if (!client) {
            return res.status(503).json({
                success: false,
                error: 'WhatsApp client not initialized'
            });
        }

        const result = await interactiveBotService.startDemo(client, chatId);
        res.json(result);
    } catch (error) {
        console.error('Error starting demo:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/interactive/language
 * Send language selection
 */
router.post('/language', async (req, res) => {
    try {
        const { chatId } = req.body;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                error: 'chatId is required'
            });
        }

        const client = req.app.get('whatsappClient');
        if (!client) {
            return res.status(503).json({
                success: false,
                error: 'WhatsApp client not initialized'
            });
        }

        const result = await interactiveBotService.sendLanguageSelection(client, chatId);
        res.json(result);
    } catch (error) {
        console.error('Error sending language selection:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/interactive/products
 * Send product catalog
 */
router.post('/products', async (req, res) => {
    try {
        const { chatId, language = 'en' } = req.body;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                error: 'chatId is required'
            });
        }

        const client = req.app.get('whatsappClient');
        if (!client) {
            return res.status(503).json({
                success: false,
                error: 'WhatsApp client not initialized'
            });
        }

        const result = await interactiveBotService.sendProductCatalog(client, chatId, language);
        res.json(result);
    } catch (error) {
        console.error('Error sending product catalog:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/interactive/services
 * Send service menu
 */
router.post('/services', async (req, res) => {
    try {
        const { chatId, language = 'en' } = req.body;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                error: 'chatId is required'
            });
        }

        const client = req.app.get('whatsappClient');
        if (!client) {
            return res.status(503).json({
                success: false,
                error: 'WhatsApp client not initialized'
            });
        }

        const result = await interactiveBotService.sendServiceMenu(client, chatId, language);
        res.json(result);
    } catch (error) {
        console.error('Error sending service menu:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/interactive/confirm
 * Send confirmation buttons
 */
router.post('/confirm', async (req, res) => {
    try {
        const { chatId, message, language = 'en' } = req.body;

        if (!chatId || !message) {
            return res.status(400).json({
                success: false,
                error: 'chatId and message are required'
            });
        }

        const client = req.app.get('whatsappClient');
        if (!client) {
            return res.status(503).json({
                success: false,
                error: 'WhatsApp client not initialized'
            });
        }

        const result = await interactiveBotService.sendConfirmation(client, chatId, message, language);
        res.json(result);
    } catch (error) {
        console.error('Error sending confirmation:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/interactive/conversations
 * Get all active conversations
 */
router.get('/conversations', async (req, res) => {
    try {
        res.json({
            success: true,
            conversations: interactiveBotService.conversations
        });
    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
