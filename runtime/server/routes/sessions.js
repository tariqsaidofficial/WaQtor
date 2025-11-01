/**
 * Sessions Management Routes
 * Handle multiple WhatsApp sessions
 */

const express = require('express');
const router = express.Router();
const clientManager = require('../managers/WhatsAppClientManager');
const { jwtAuth } = require('../middlewares/jwtAuth');
const { WhatsAppSession } = require('../models');
const logger = require('../utils/logger');

// Apply JWT authentication to all routes
router.use(jwtAuth);

/**
 * GET /api/sessions
 * Get all sessions for current user
 */
router.get('/', async (req, res) => {
    try {
        // Get sessions from database for current user
        const dbSessions = await WhatsAppSession.findAll({
            where: { user_id: req.userId },
            order: [['created_at', 'DESC']]
        });
        
        // Get runtime status from clientManager
        const runtimeSessions = clientManager.getAllClients();
        
        // Merge database and runtime data
        const sessions = dbSessions.map(dbSession => {
            const runtime = runtimeSessions.find(r => r.clientId === dbSession.client_id);
            return {
                id: dbSession.id,
                clientId: dbSession.client_id,
                name: dbSession.name,
                phoneNumber: dbSession.phone_number,
                isActive: dbSession.is_active,
                isReady: runtime ? runtime.isReady : false,
                hasQR: runtime ? runtime.hasQR : false,
                info: runtime ? runtime.info : dbSession.session_data,
                createdAt: dbSession.created_at,
                lastActiveAt: dbSession.last_active_at
            };
        });
        
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
 * Create a new session for current user
 */
router.post('/', async (req, res) => {
    try {
        const { clientId, name } = req.body;

        if (!clientId) {
            return res.status(400).json({
                success: false,
                error: 'clientId is required'
            });
        }

        // Check if clientId already exists
        const existingSession = await WhatsAppSession.findOne({
            where: { client_id: clientId }
        });

        if (existingSession) {
            return res.status(400).json({
                success: false,
                error: 'Session with this clientId already exists'
            });
        }

        // Create session in database
        const dbSession = await WhatsAppSession.create({
            user_id: req.userId,
            client_id: clientId,
            name: name || clientId,
            is_active: true,
            is_ready: false
        });

        // Create runtime client
        const result = await clientManager.createClient(clientId, {
            userId: req.userId,
            name: name || clientId
        });

        logger.info(`✅ Session created: ${clientId} for user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Session created successfully',
            data: {
                id: dbSession.id,
                clientId: dbSession.client_id,
                name: dbSession.name,
                status: result.status,
                createdAt: dbSession.created_at
            }
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
 * Destroy a session (only if owned by current user)
 */
router.delete('/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        
        // Check ownership
        const dbSession = await WhatsAppSession.findOne({
            where: { 
                client_id: clientId,
                user_id: req.userId
            }
        });

        if (!dbSession) {
            return res.status(404).json({
                success: false,
                error: 'Session not found or access denied'
            });
        }

        // Destroy runtime client
        try {
            await clientManager.destroyClient(clientId);
        } catch (err) {
            logger.warn(`Runtime client ${clientId} not found, continuing with DB deletion`);
        }

        // Delete from database
        await dbSession.destroy();

        logger.info(`✅ Session destroyed: ${clientId} by user ${req.user.email}`);

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
