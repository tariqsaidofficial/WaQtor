/**
 * Session Routes
 * Endpoints for session monitoring and WebSocket info
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// This will be set by the main server
let sessionMonitor = null;
let websocketBridge = null;
let enhancedWAClientHandler = null;

/**
 * Initialize routes with services
 */
function initializeRoutes(monitor, wsbridge, enhancedHandler = null) {
    sessionMonitor = monitor;
    websocketBridge = wsbridge;
    enhancedWAClientHandler = enhancedHandler;
}

/**
 * GET /api/session/state
 * Get current session state
 */
router.get('/state', async (req, res) => {
    try {
        if (!sessionMonitor) {
            return res.status(503).json({
                success: false,
                error: 'Session monitor not initialized'
            });
        }

        const state = sessionMonitor.getPublicState();

        res.json({
            success: true,
            data: state
        });
    } catch (error) {
        logger.error('Error getting session state:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get session state',
            message: error.message
        });
    }
});

/**
 * GET /api/session/qr
 * Get QR code for authentication
 */
router.get('/qr', async (req, res) => {
    try {
        if (!sessionMonitor) {
            return res.status(503).json({
                success: false,
                error: 'Session monitor not initialized'
            });
        }

        const qrCode = sessionMonitor.getQRCode();

        if (!qrCode) {
            return res.json({
                success: true,
                data: {
                    hasQR: false,
                    message: 'No QR code available. Client may already be authenticated.'
                }
            });
        }

        res.json({
            success: true,
            data: {
                hasQR: true,
                qr: qrCode
            }
        });
    } catch (error) {
        logger.error('Error getting QR code:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get QR code',
            message: error.message
        });
    }
});

/**
 * GET /api/session/websocket/info
 * Get WebSocket connection information
 */
router.get('/websocket/info', async (req, res) => {
    try {
        if (!websocketBridge) {
            return res.status(503).json({
                success: false,
                error: 'WebSocket bridge not initialized'
            });
        }

        res.json({
            success: true,
            data: {
                endpoint: '/ws',
                url: `ws://localhost:${process.env.PORT || 8080}/ws`,
                authentication: 'Required - use X-API-Key header or ?apiKey= query param',
                clients: websocketBridge.getClientCount(),
                clientsInfo: websocketBridge.getClientsInfo(),
                events: [
                    'session_update',
                    'qr_code',
                    'message',
                    'campaign'
                ],
                usage: {
                    connect: `ws://localhost:${process.env.PORT || 8080}/ws?apiKey=YOUR_API_KEY`,
                    commands: [
                        { type: 'ping', description: 'Check connection' },
                        { type: 'get_state', description: 'Get current session state' },
                        { type: 'get_qr', description: 'Get QR code' },
                        { type: 'subscribe', events: ['all'], description: 'Subscribe to events' }
                    ]
                }
            }
        });
    } catch (error) {
        logger.error('Error getting WebSocket info:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get WebSocket info',
            message: error.message
        });
    }
});

/**
 * POST /api/session/stats/reset
 * Reset session statistics
 */
router.post('/stats/reset', async (req, res) => {
    try {
        if (!sessionMonitor) {
            return res.status(503).json({
                success: false,
                error: 'Session monitor not initialized'
            });
        }

        await sessionMonitor.resetStats();

        res.json({
            success: true,
            message: 'Session statistics reset successfully'
        });
    } catch (error) {
        logger.error('Error resetting statistics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reset statistics',
            message: error.message
        });
    }
});

/**
 * POST /api/session/refresh
 * Refresh WhatsApp session (logout and reinitialize)
 */
router.post('/refresh', async (req, res) => {
    try {
        if (!sessionMonitor) {
            return res.status(503).json({
                success: false,
                error: 'Session monitor not initialized'
            });
        }

        logger.info('🔄 Session refresh requested');

        // Use enhanced handler if available, fallback to direct client access
        if (enhancedWAClientHandler) {
            const result = await enhancedWAClientHandler.handleSessionRefresh();
            
            if (result.success) {
                res.json({ 
                    success: true, 
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(500).json({ 
                    success: false, 
                    error: result.error,
                    message: 'Enhanced session refresh failed'
                });
            }
            return;
        }

        // Fallback to original logic if enhanced handler not available
        const waClient = require('../waClient');
        const client = waClient.getClient();
        
        if (client) {
            logger.info('Logging out current session...');
            await client.logout();
            
            // انتظار قصير ثم إعادة التشغيل
            setTimeout(() => {
                logger.info('Reinitializing WhatsApp client...');
                waClient.initialize();
            }, 2000);
        } else {
            // إذا لم يكن هناك client، ابدأ واحد جديد
            logger.info('No active client found, initializing new session...');
            waClient.initialize();
        }

        res.json({ 
            success: true, 
            message: 'Session refresh initiated successfully',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        logger.error('Session refresh error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to refresh session',
            message: error.message
        });
    }
});

module.exports = {
    router,
    initializeRoutes
};
