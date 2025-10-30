const express = require('express');
const router = express.Router();
const webhookManager = require('../webhooks/WebhookManager');
const logger = require('../utils/logger');

// GET /api/webhooks - Get all webhooks
router.get('/', (req, res) => {
    try {
        const webhooks = webhookManager.getAllWebhooks();
        
        // Don't expose secrets in response
        const sanitized = webhooks.map(webhook => ({
            ...webhook,
            secret: webhook.secret ? '***' + webhook.secret.slice(-4) : null,
        }));

        res.json({
            success: true,
            data: sanitized,
        });
    } catch (error) {
        logger.error('Error fetching webhooks:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch webhooks',
        });
    }
});

// GET /api/webhooks/:id - Get webhook by ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const webhook = webhookManager.getWebhook(id);

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Webhook not found',
            });
        }

        // Don't expose secret
        const sanitized = {
            ...webhook,
            secret: webhook.secret ? '***' + webhook.secret.slice(-4) : null,
        };

        res.json({
            success: true,
            data: sanitized,
        });
    } catch (error) {
        logger.error('Error fetching webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch webhook',
        });
    }
});

// POST /api/webhooks - Create new webhook
router.post('/', (req, res) => {
    try {
        const { url, events, secret, enabled, retryAttempts, retryDelay } = req.body;

        // Validation
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL is required',
            });
        }

        if (!events || !Array.isArray(events) || events.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one event is required',
            });
        }

        if (!secret) {
            return res.status(400).json({
                success: false,
                error: 'Secret is required for HMAC signing',
            });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format',
            });
        }

        const webhook = webhookManager.registerWebhook({
            url,
            events,
            secret,
            enabled,
            retryAttempts,
            retryDelay,
        });

        // Don't expose secret
        const sanitized = {
            ...webhook,
            secret: '***' + webhook.secret.slice(-4),
        };

        res.status(201).json({
            success: true,
            message: 'Webhook created successfully',
            data: sanitized,
        });
    } catch (error) {
        logger.error('Error creating webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create webhook',
        });
    }
});

// PUT /api/webhooks/:id - Update webhook
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { url, events, secret, enabled, retryAttempts, retryDelay } = req.body;

        const webhook = webhookManager.getWebhook(id);
        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Webhook not found',
            });
        }

        // Validate URL if provided
        if (url) {
            try {
                new URL(url);
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid URL format',
                });
            }
        }

        const updates = {};
        if (url !== undefined) updates.url = url;
        if (events !== undefined) updates.events = events;
        if (secret !== undefined) updates.secret = secret;
        if (enabled !== undefined) updates.enabled = enabled;
        if (retryAttempts !== undefined) updates.retryAttempts = retryAttempts;
        if (retryDelay !== undefined) updates.retryDelay = retryDelay;

        const updated = webhookManager.updateWebhook(id, updates);

        // Don't expose secret
        const sanitized = {
            ...updated,
            secret: updated.secret ? '***' + updated.secret.slice(-4) : null,
        };

        res.json({
            success: true,
            message: 'Webhook updated successfully',
            data: sanitized,
        });
    } catch (error) {
        logger.error('Error updating webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update webhook',
        });
    }
});

// DELETE /api/webhooks/:id - Delete webhook
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const deleted = webhookManager.unregisterWebhook(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Webhook not found',
            });
        }

        res.json({
            success: true,
            message: 'Webhook deleted successfully',
        });
    } catch (error) {
        logger.error('Error deleting webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete webhook',
        });
    }
});

// GET /api/webhooks/:id/logs - Get webhook logs
router.get('/:id/logs', (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 50, status, event } = req.query;

        const logs = webhookManager.getLogs({
            webhookId: id,
            limit: parseInt(limit),
            status,
            event,
        });

        res.json({
            success: true,
            data: logs,
        });
    } catch (error) {
        logger.error('Error fetching webhook logs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch logs',
        });
    }
});

// GET /api/webhooks/:id/stats - Get webhook statistics
router.get('/:id/stats', (req, res) => {
    try {
        const { id } = req.params;
        const stats = webhookManager.getStats(id);

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        logger.error('Error fetching webhook stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stats',
        });
    }
});

// POST /api/webhooks/:id/test - Test webhook
router.post('/:id/test', async (req, res) => {
    try {
        const { id } = req.params;
        const webhook = webhookManager.getWebhook(id);

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Webhook not found',
            });
        }

        // Send test event
        await webhookManager.sendWebhook(webhook, 'test', {
            message: 'This is a test webhook from WaQtor',
            timestamp: new Date().toISOString(),
        });

        res.json({
            success: true,
            message: 'Test webhook sent',
        });
    } catch (error) {
        logger.error('Error testing webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to test webhook',
        });
    }
});

// GET /api/webhooks/logs/all - Get all logs
router.get('/logs/all', (req, res) => {
    try {
        const { limit = 100, status, event } = req.query;

        const logs = webhookManager.getLogs({
            limit: parseInt(limit),
            status,
            event,
        });

        res.json({
            success: true,
            data: logs,
        });
    } catch (error) {
        logger.error('Error fetching all logs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch logs',
        });
    }
});

// GET /api/webhooks/stats/all - Get overall statistics
router.get('/stats/all', (req, res) => {
    try {
        const stats = webhookManager.getStats();

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        logger.error('Error fetching overall stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stats',
        });
    }
});

module.exports = router;
module.exports.webhookManager = webhookManager;
