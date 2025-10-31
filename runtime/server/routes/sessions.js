/**
 * Sessions Management Routes
 * Handle multiple WhatsApp sessions
 */

const express = require('express');
const router = express.Router();
const clientManager = require('../managers/WhatsAppClientManager');
const logger = require('../utils/logger');

/**
 * GET /api/sessions
 * Get all sessions
 */
router.get('/', async (req, res) => {
    try {
        const sessions = clientManager.getAllClients();
        
        res.json({
            success: true,
            data: {
                sessions,
                total: sessions.length
            }
        });
    } catch (error) {
        logger.error('Error getting sessions:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/sessions/:clientId
 * Get specific session info
 */
router.get('/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        const sessionInfo = clientManager.getClientInfo(clientId);
        
        if (!sessionInfo) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        res.json({
            success: true,
            data: sessionInfo
        });
    } catch (error) {
        logger.error('Error getting session:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/sessions
 * Create a new session
 */
router.post('/', async (req, res) => {
    try {
        const { clientId, config } = req.body;

        if (!clientId) {
            return res.status(400).json({
                success: false,
                error: 'clientId is required'
            });
        }

        const result = await clientManager.createClient(clientId, config || {});

        res.json({
            success: true,
            message: 'Session created successfully',
            data: result
        });
    } catch (error) {
        logger.error('Error creating session:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/sessions/:clientId
 * Destroy a session
 */
router.delete('/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        
        await clientManager.destroyClient(clientId);

        res.json({
            success: true,
            message: 'Session destroyed successfully'
        });
    } catch (error) {
        logger.error('Error destroying session:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/sessions/:clientId/restart
 * Restart a session
 */
router.post('/:clientId/restart', async (req, res) => {
    try {
        const { clientId } = req.params;
        
        await clientManager.restartClient(clientId);

        res.json({
            success: true,
            message: 'Session restarted successfully'
        });
    } catch (error) {
        logger.error('Error restarting session:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/sessions/:clientId/qr
 * Get QR code for a session
 */
router.get('/:clientId/qr', async (req, res) => {
    try {
        const { clientId } = req.params;
        const sessionInfo = clientManager.getClientInfo(clientId);
        
        if (!sessionInfo) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        if (!sessionInfo.qr) {
            return res.status(404).json({
                success: false,
                error: 'QR code not available'
            });
        }

        res.json({
            success: true,
            data: {
                qr: sessionInfo.qr,
                clientId
            }
        });
    } catch (error) {
        logger.error('Error getting QR code:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
