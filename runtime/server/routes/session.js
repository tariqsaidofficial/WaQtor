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

/**
 * Initialize routes with services
 */
function initializeRoutes(monitor, wsbridge) {
    sessionMonitor = monitor;
    websocketBridge = wsbridge;
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

module.exports = {
    router,
    initializeRoutes
};
