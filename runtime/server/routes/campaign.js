/**
 * Campaign Routes
 * Endpoints for managing campaigns
 */

const express = require('express');
const router = express.Router();
const db = require('../db/db');
const logger = require('../utils/logger');
const waClient = require('../waClient');
const CampaignExecutor = require('../services/campaignExecutor');

// Initialize campaign executor
const campaignExecutor = new CampaignExecutor(waClient);

/**
 * POST /api/campaigns/create
 * Create a new campaign
 */
router.post('/create', async (req, res) => {
    try {
        const { name, message, recipients, scheduledAt } = req.body;

        if (!name || !message || !recipients) {
            return res.status(400).json({
                success: false,
                error: 'Name, message, and recipients are required'
            });
        }

        const campaign = await db.createCampaign({
            name,
            message,
            recipients: JSON.stringify(recipients),
            scheduledAt: scheduledAt || null,
            status: 'pending'
        });

        logger.info(`Campaign created: ${name}`);

        res.json({
            success: true,
            message: 'Campaign created successfully',
            data: campaign
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
 * List all campaigns
 */
router.get('/list', async (req, res) => {
    try {
        const campaigns = await db.getAllCampaigns();

        res.json({
            success: true,
            data: campaigns.map(c => ({
                ...c,
                recipients: JSON.parse(c.recipients)
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
 * Get campaign by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const campaign = await db.getCampaignById(req.params.id);

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: 'Campaign not found'
            });
        }

        res.json({
            success: true,
            data: {
                ...campaign,
                recipients: JSON.parse(campaign.recipients)
            }
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
 * Update campaign status
 */
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'running', 'completed', 'failed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        await db.updateCampaignStatus(req.params.id, status);

        logger.info(`Campaign ${req.params.id} status updated to ${status}`);

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
 * Delete campaign
 */
router.delete('/:id', async (req, res) => {
    try {
        await db.deleteCampaign(req.params.id);

        logger.info(`Campaign ${req.params.id} deleted`);

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
 * Execute campaign immediately
 */
router.post('/:id/execute', async (req, res) => {
    try {
        const campaignId = req.params.id;
        
        // Check if campaign exists
        const campaign = await db.getCampaignById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: 'Campaign not found'
            });
        }

        // Execute campaign
        logger.info(`Executing campaign ${campaignId} via API request`);
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
