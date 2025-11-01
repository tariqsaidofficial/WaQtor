/**
 * Groups Routes
 * Endpoints for managing contact groups/labels
 */

const express = require('express');
const router = express.Router();
const { Group, Recipient, RecipientGroup } = require('../models');
const { jwtAuth } = require('../middlewares/jwtAuth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Apply JWT authentication to all routes
router.use(jwtAuth);

/**
 * GET /api/groups
 * List all groups for current user
 */
router.get('/', async (req, res) => {
    try {
        const { search = '' } = req.query;

        const where = { user_id: req.userId };
        
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const groups = await Group.findAll({
            where,
            include: [{
                model: Recipient,
                as: 'recipients',
                attributes: ['id', 'phone', 'name'],
                through: { attributes: [] }
            }],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: groups.map(g => ({
                ...g.toJSON(),
                recipientCount: g.recipients.length
            }))
        });
    } catch (error) {
        logger.error('Error listing groups:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list groups',
            message: error.message
        });
    }
});

/**
 * POST /api/groups
 * Create a new group
 */
router.post('/', async (req, res) => {
    try {
        const { name, description, color, icon } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Group name is required'
            });
        }

        // Check if group already exists
        const existing = await Group.findOne({
            where: {
                user_id: req.userId,
                name
            }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Group with this name already exists'
            });
        }

        const group = await Group.create({
            user_id: req.userId,
            name,
            description,
            color: color || '#3B82F6',
            icon
        });

        logger.info(`✅ Group created: ${name} by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Group created successfully',
            data: group
        });
    } catch (error) {
        logger.error('Error creating group:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create group',
            message: error.message
        });
    }
});

/**
 * GET /api/groups/:id
 * Get group details
 */
router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            },
            include: [{
                model: Recipient,
                as: 'recipients',
                through: { attributes: ['created_at'] }
            }]
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or access denied'
            });
        }

        res.json({
            success: true,
            data: group
        });
    } catch (error) {
        logger.error('Error getting group:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get group',
            message: error.message
        });
    }
});

/**
 * PUT /api/groups/:id
 * Update group
 */
router.put('/:id', async (req, res) => {
    try {
        const group = await Group.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or access denied'
            });
        }

        const { name, description, color, icon, is_active } = req.body;

        await group.update({
            name: name || group.name,
            description: description !== undefined ? description : group.description,
            color: color || group.color,
            icon: icon !== undefined ? icon : group.icon,
            is_active: is_active !== undefined ? is_active : group.is_active
        });

        logger.info(`✅ Group updated: ${group.name} by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Group updated successfully',
            data: group
        });
    } catch (error) {
        logger.error('Error updating group:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update group',
            message: error.message
        });
    }
});

/**
 * DELETE /api/groups/:id
 * Delete group
 */
router.delete('/:id', async (req, res) => {
    try {
        const group = await Group.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or access denied'
            });
        }

        await group.destroy();

        logger.info(`✅ Group deleted: ${group.name} by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Group deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting group:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete group',
            message: error.message
        });
    }
});

/**
 * GET /api/groups/:id/recipients
 * Get all recipients in a group
 */
router.get('/:id/recipients', async (req, res) => {
    try {
        const group = await Group.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            },
            include: [{
                model: Recipient,
                as: 'recipients',
                through: { attributes: ['created_at'] }
            }]
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or access denied'
            });
        }

        res.json({
            success: true,
            data: {
                group: {
                    id: group.id,
                    name: group.name,
                    color: group.color
                },
                recipients: group.recipients
            }
        });
    } catch (error) {
        logger.error('Error getting group recipients:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get group recipients',
            message: error.message
        });
    }
});

/**
 * POST /api/groups/:id/recipients
 * Add recipients to group
 */
router.post('/:id/recipients', async (req, res) => {
    try {
        const { recipientIds } = req.body;

        if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Recipient IDs array is required'
            });
        }

        // Verify group ownership
        const group = await Group.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or access denied'
            });
        }

        // Verify recipients ownership
        const recipients = await Recipient.findAll({
            where: {
                id: { [Op.in]: recipientIds },
                user_id: req.userId
            }
        });

        if (recipients.length !== recipientIds.length) {
            return res.status(400).json({
                success: false,
                error: 'Some recipients not found or access denied'
            });
        }

        // Add recipients to group
        const results = {
            added: 0,
            skipped: 0
        };

        for (const recipientId of recipientIds) {
            const [link, created] = await RecipientGroup.findOrCreate({
                where: {
                    recipient_id: recipientId,
                    group_id: group.id
                }
            });

            if (created) {
                results.added++;
            } else {
                results.skipped++;
            }
        }

        logger.info(`✅ Recipients added to group ${group.name}: ${results.added} added, ${results.skipped} skipped by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Recipients added to group',
            data: results
        });
    } catch (error) {
        logger.error('Error adding recipients to group:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add recipients to group',
            message: error.message
        });
    }
});

/**
 * DELETE /api/groups/:id/recipients/:recipientId
 * Remove recipient from group
 */
router.delete('/:id/recipients/:recipientId', async (req, res) => {
    try {
        // Verify group ownership
        const group = await Group.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or access denied'
            });
        }

        // Verify recipient ownership
        const recipient = await Recipient.findOne({
            where: {
                id: req.params.recipientId,
                user_id: req.userId
            }
        });

        if (!recipient) {
            return res.status(404).json({
                success: false,
                error: 'Recipient not found or access denied'
            });
        }

        // Remove link
        const deleted = await RecipientGroup.destroy({
            where: {
                recipient_id: recipient.id,
                group_id: group.id
            }
        });

        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                error: 'Recipient not in this group'
            });
        }

        logger.info(`✅ Recipient ${recipient.phone} removed from group ${group.name} by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Recipient removed from group'
        });
    } catch (error) {
        logger.error('Error removing recipient from group:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove recipient from group',
            message: error.message
        });
    }
});

/**
 * DELETE /api/groups/:id/recipients
 * Remove multiple recipients from group
 */
router.delete('/:id/recipients', async (req, res) => {
    try {
        const { recipientIds } = req.body;

        if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Recipient IDs array is required'
            });
        }

        // Verify group ownership
        const group = await Group.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            }
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or access denied'
            });
        }

        // Remove links
        const deleted = await RecipientGroup.destroy({
            where: {
                recipient_id: { [Op.in]: recipientIds },
                group_id: group.id
            }
        });

        logger.info(`✅ ${deleted} recipients removed from group ${group.name} by user ${req.user.email}`);

        res.json({
            success: true,
            message: `${deleted} recipients removed from group`,
            data: { removed: deleted }
        });
    } catch (error) {
        logger.error('Error removing recipients from group:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove recipients from group',
            message: error.message
        });
    }
});

module.exports = router;
