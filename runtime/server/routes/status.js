/**
 * Status Routes
 * Endpoints for checking system status
 */

const express = require('express');
const router = express.Router();
const waClient = require('../waClient');
const logger = require('../utils/logger');
const { WAQtorVersion, UpstreamVersion, UpstreamAuthor } = require('../../../src/util/Constants');

/**
 * GET /api/status/client
 * Get WhatsApp client status
 */
router.get('/client', async (req, res) => {
    try {
        const isReady = waClient.isClientReady();
        
        if (!isReady) {
            return res.json({
                success: true,
                data: {
                    status: 'disconnected',
                    ready: false,
                    message: 'WhatsApp client is not ready'
                }
            });
        }

        const client = waClient.getClient();
        const state = await client.getState();

        res.json({
            success: true,
            data: {
                status: 'connected',
                ready: true,
                state: state,
                message: 'WhatsApp client is ready'
            }
        });
    } catch (error) {
        logger.error('Error getting client status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get client status',
            message: error.message
        });
    }
});

/**
 * GET /api/status/info
 * Get session info
 */
router.get('/info', async (req, res) => {
    try {
        const client = waClient.getClient();
        const info = client.info;

        res.json({
            success: true,
            data: {
                wid: info.wid._serialized,
                pushname: info.pushname,
                platform: info.platform,
                phone: info.wid.user
            }
        });
    } catch (error) {
        logger.error('Error getting session info:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get session info',
            message: error.message
        });
    }
});

/**
 * POST /api/status/logout
 * Logout and destroy session
 */
router.post('/logout', async (req, res) => {
    try {
        const client = waClient.getClient();
        await client.logout();
        
        logger.info('WhatsApp client logged out');

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        logger.error('Error logging out:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to logout',
            message: error.message
        });
    }
});

/**
 * GET /api/status/chats
 * Get all chats
 */
router.get('/chats', async (req, res) => {
    try {
        const client = waClient.getClient();
        const chats = await client.getChats();

        res.json({
            success: true,
            data: {
                total: chats.length,
                chats: chats.map(chat => ({
                    id: chat.id._serialized,
                    name: chat.name,
                    isGroup: chat.isGroup,
                    unreadCount: chat.unreadCount,
                    timestamp: chat.timestamp
                }))
            }
        });
    } catch (error) {
        logger.error('Error getting chats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get chats',
            message: error.message
        });
    }
});

/**
 * GET /api/status/version
 * Get WaQtor version information
 */
router.get('/version', (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                waqtor: {
                    version: WAQtorVersion,
                    name: 'WaQtor',
                    description: 'Smart Automation Engine for WhatsApp'
                },
                upstream: {
                    version: UpstreamVersion,
                    author: UpstreamAuthor,
                    project: 'whatsapp-web.js',
                    repo: 'https://github.com/pedroslopez/whatsapp-web.js'
                },
                node: process.version,
                platform: process.platform,
                arch: process.arch
            }
        });
    } catch (error) {
        logger.error('Error getting version:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get version',
            message: error.message
        });
    }
});

module.exports = router;
