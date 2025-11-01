/**
 * Campaign Routes
 * Endpoints for managing campaigns
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const waClient = require('../waClient');
const CampaignExecutor = require('../services/campaignExecutor');
const { Campaign, Recipient, CampaignRecipient, WhatsAppSession } = require('../models');
const { jwtAuth } = require('../middlewares/jwtAuth');
const { Op } = require('sequelize');

// Apply JWT authentication to all routes
router.use(jwtAuth);

// Initialize campaign executor
const campaignExecutor = new CampaignExecutor(waClient);

/**
 * POST /api/campaigns/create
 * Create a new campaign
 */
router.post('/create', async (req, res) => {
    try {
        const { name, messageTemplate, recipientIds, sessionId, scheduledAt, delaySeconds } = req.body;

        if (!name || !messageTemplate || !recipientIds || !Array.isArray(recipientIds)) {
            return res.status(400).json({
                success: false,
                error: 'Name, messageTemplate, and recipientIds array are required'
            });
        }

        // Get user's session
        const session = await WhatsAppSession.findOne({
            where: {
                id: sessionId || null,
                user_id: req.userId,
                is_active: true
            }
        });

        if (!session) {
            return res.status(400).json({
                success: false,
                error: 'No active WhatsApp session found'
            });
        }

        // Create campaign
        const campaign = await Campaign.create({
            session_id: session.id,
            user_id: req.userId,
            name,
            message_template: messageTemplate,
            status: scheduledAt ? 'scheduled' : 'draft',
            total_recipients: recipientIds.length,
            delay_seconds: delaySeconds || 5,
            scheduled_at: scheduledAt || null
        });

        // Link recipients to campaign
        for (const recipientId of recipientIds) {
            await CampaignRecipient.create({
                campaign_id: campaign.id,
                recipient_id: recipientId,
                status: 'pending'
            });
        }

        logger.info(`✅ Campaign created: ${name} by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Campaign created successfully',
            data: {
                id: campaign.id,
                name: campaign.name,
                status: campaign.status,
                totalRecipients: campaign.total_recipients,
                scheduledAt: campaign.scheduled_at
            }
        });
    } catch (error) {
        logger.error('Error creating campaign:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create campaign',
            message: error.message
        });
    }
});

/**
 * GET /api/campaigns/list
 * List all campaigns for current user
 */
router.get('/list', async (req, res) => {
    try {
        const campaigns = await Campaign.findAll({
            where: { user_id: req.userId },
            include: [
                {
                    model: Recipient,
                    as: 'recipients',
                    through: { attributes: ['status', 'sent_at'] }
                },
                {
                    model: WhatsAppSession,
                    as: 'session',
                    attributes: ['id', 'name', 'client_id']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: campaigns.map(c => ({
                id: c.id,
                name: c.name,
                status: c.status,
                totalRecipients: c.total_recipients,
                sentCount: c.sent_count,
                deliveredCount: c.delivered_count,
                readCount: c.read_count,
                failedCount: c.failed_count,
                session: c.session,
                scheduledAt: c.scheduled_at,
                createdAt: c.created_at
            }))
        });
    } catch (error) {
        logger.error('Error listing campaigns:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list campaigns',
            message: error.message
        });
    }
});

/**
 * GET /api/campaigns/:id
 * Get campaign by ID (with ownership check)
 */
router.get('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            },
            include: [
                {
                    model: Recipient,
                    as: 'recipients',
                    through: {
                        as: 'campaignRecipient',
                        attributes: ['status', 'sent_at', 'delivered_at', 'error_message']
                    }
                },
                {
                    model: WhatsAppSession,
                    as: 'session'
                }
            ]
        });

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: 'Campaign not found or access denied'
            });
        }

        res.json({
            success: true,
            data: campaign
        });
    } catch (error) {
        logger.error('Error getting campaign:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get campaign',
            message: error.message
        });
    }
});

/**
 * PUT /api/campaigns/:id/status
 * Update campaign status (with ownership check)
 */
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['draft', 'scheduled', 'running', 'completed', 'paused', 'failed'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const campaign = await Campaign.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            }
        });

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: 'Campaign not found or access denied'
            });
        }

        await campaign.update({ status });

        logger.info(`Campaign ${req.params.id} status updated to ${status} by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Campaign status updated successfully'
        });
    } catch (error) {
        logger.error('Error updating campaign status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update campaign status',
            message: error.message
        });
    }
});

/**
 * DELETE /api/campaigns/:id
 * Delete campaign (with ownership check)
 */
router.delete('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            }
        });

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: 'Campaign not found or access denied'
            });
        }

        await campaign.destroy();

        logger.info(`Campaign ${req.params.id} deleted by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting campaign:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete campaign',
            message: error.message
        });
    }
});

/**
 * POST /api/campaigns/:id/execute
 * Execute campaign immediately (with ownership check)
 */
router.post('/:id/execute', async (req, res) => {
    try {
        const campaignId = req.params.id;
        
        // Check if campaign exists and user owns it
        const campaign = await Campaign.findOne({
            where: {
                id: campaignId,
                user_id: req.userId
            }
        });

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: 'Campaign not found or access denied'
            });
        }

        // Update status to running
        await campaign.update({
            status: 'running',
            started_at: new Date()
        });

        // Execute campaign
        logger.info(`Executing campaign ${campaignId} via API request by user ${req.user.email}`);
        const result = await campaignExecutor.executeNow(campaignId);

        if (result.success) {
            res.json({
                success: true,
                message: 'Campaign executed successfully',
                data: result
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Campaign execution failed',
                message: result.error
            });
        }
    } catch (error) {
        logger.error('Error executing campaign:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to execute campaign',
            message: error.message
        });
    }
});

module.exports = router;
