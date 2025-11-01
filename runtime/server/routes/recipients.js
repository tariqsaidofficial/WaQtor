/**
 * Recipient Routes
 * Endpoints for managing recipients/contacts
 */

const express = require('express');
const router = express.Router();
const { Recipient, Group, RecipientGroup } = require('../models');
const { jwtAuth } = require('../middlewares/jwtAuth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Apply JWT authentication to all routes
router.use(jwtAuth);

/**
 * GET /api/recipients
 * List all recipients for current user (with pagination and search)
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 50, search = '', tag = '' } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause
        const where = { user_id: req.userId };
        
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { company: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (tag) {
            where.tags = { [Op.contains]: [tag] };
        }

        const { count, rows } = await Recipient.findAndCountAll({
            where,
            include: [{
                model: Group,
                as: 'groups',
                attributes: ['id', 'name', 'color', 'icon'],
                through: { attributes: [] }
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                recipients: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        logger.error('Error listing recipients:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list recipients',
            message: error.message
        });
    }
});

/**
 * POST /api/recipients
 * Create a new recipient
 */
router.post('/', async (req, res) => {
    try {
        const { phone, name, email, company, tags, custom_fields, notes } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required'
            });
        }

        // Check if recipient already exists
        const existing = await Recipient.findOne({
            where: {
                user_id: req.userId,
                phone
            }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Recipient with this phone number already exists'
            });
        }

        const recipient = await Recipient.create({
            user_id: req.userId,
            phone,
            name,
            email,
            company,
            tags: tags || [],
            custom_fields: custom_fields || {},
            notes
        });

        logger.info(`✅ Recipient created: ${phone} by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Recipient created successfully',
            data: recipient
        });
    } catch (error) {
        logger.error('Error creating recipient:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create recipient',
            message: error.message
        });
    }
});

/**
 * GET /api/recipients/:id
 * Get recipient details
 */
router.get('/:id', async (req, res) => {
    try {
        const recipient = await Recipient.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            },
            include: [{
                model: Group,
                as: 'groups',
                through: { attributes: ['created_at'] }
            }]
        });

        if (!recipient) {
            return res.status(404).json({
                success: false,
                error: 'Recipient not found or access denied'
            });
        }

        res.json({
            success: true,
            data: recipient
        });
    } catch (error) {
        logger.error('Error getting recipient:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get recipient',
            message: error.message
        });
    }
});

/**
 * PUT /api/recipients/:id
 * Update recipient
 */
router.put('/:id', async (req, res) => {
    try {
        const recipient = await Recipient.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            }
        });

        if (!recipient) {
            return res.status(404).json({
                success: false,
                error: 'Recipient not found or access denied'
            });
        }

        const { phone, name, email, company, tags, custom_fields, notes, is_active } = req.body;

        await recipient.update({
            phone: phone || recipient.phone,
            name: name !== undefined ? name : recipient.name,
            email: email !== undefined ? email : recipient.email,
            company: company !== undefined ? company : recipient.company,
            tags: tags !== undefined ? tags : recipient.tags,
            custom_fields: custom_fields !== undefined ? custom_fields : recipient.custom_fields,
            notes: notes !== undefined ? notes : recipient.notes,
            is_active: is_active !== undefined ? is_active : recipient.is_active
        });

        logger.info(`✅ Recipient updated: ${recipient.phone} by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Recipient updated successfully',
            data: recipient
        });
    } catch (error) {
        logger.error('Error updating recipient:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update recipient',
            message: error.message
        });
    }
});

/**
 * DELETE /api/recipients/:id
 * Delete recipient
 */
router.delete('/:id', async (req, res) => {
    try {
        const recipient = await Recipient.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            }
        });

        if (!recipient) {
            return res.status(404).json({
                success: false,
                error: 'Recipient not found or access denied'
            });
        }

        await recipient.destroy();

        logger.info(`✅ Recipient deleted: ${recipient.phone} by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Recipient deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting recipient:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete recipient',
            message: error.message
        });
    }
});

/**
 * POST /api/recipients/bulk
 * Bulk create recipients
 */
router.post('/bulk', async (req, res) => {
    try {
        const { recipients } = req.body;

        if (!Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Recipients array is required'
            });
        }

        const results = {
            created: 0,
            skipped: 0,
            errors: []
        };

        for (const recipientData of recipients) {
            try {
                if (!recipientData.phone) {
                    results.skipped++;
                    results.errors.push({ phone: 'N/A', error: 'Phone number required' });
                    continue;
                }

                // Check if exists
                const existing = await Recipient.findOne({
                    where: {
                        user_id: req.userId,
                        phone: recipientData.phone
                    }
                });

                if (existing) {
                    results.skipped++;
                    continue;
                }

                await Recipient.create({
                    user_id: req.userId,
                    phone: recipientData.phone,
                    name: recipientData.name,
                    email: recipientData.email,
                    company: recipientData.company,
                    tags: recipientData.tags || [],
                    custom_fields: recipientData.custom_fields || {}
                });

                results.created++;
            } catch (error) {
                results.errors.push({
                    phone: recipientData.phone,
                    error: error.message
                });
            }
        }

        logger.info(`✅ Bulk import: ${results.created} created, ${results.skipped} skipped by user ${req.user.email}`);

        res.json({
            success: true,
            message: 'Bulk import completed',
            data: results
        });
    } catch (error) {
        logger.error('Error bulk creating recipients:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to bulk create recipients',
            message: error.message
        });
    }
});

/**
 * DELETE /api/recipients/bulk
 * Bulk delete recipients
 */
router.delete('/bulk', async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'IDs array is required'
            });
        }

        const deleted = await Recipient.destroy({
            where: {
                id: { [Op.in]: ids },
                user_id: req.userId
            }
        });

        logger.info(`✅ Bulk delete: ${deleted} recipients deleted by user ${req.user.email}`);

        res.json({
            success: true,
            message: `${deleted} recipients deleted successfully`,
            data: { deleted }
        });
    } catch (error) {
        logger.error('Error bulk deleting recipients:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to bulk delete recipients',
            message: error.message
        });
    }
});

/**
 * GET /api/recipients/export
 * Export recipients to CSV
 */
router.get('/export/csv', async (req, res) => {
    try {
        const recipients = await Recipient.findAll({
            where: { user_id: req.userId },
            order: [['created_at', 'DESC']]
        });

        // Create CSV
        const csv = [
            'Phone,Name,Email,Company,Tags,Notes,Active',
            ...recipients.map(r => 
                `${r.phone},"${r.name || ''}","${r.email || ''}","${r.company || ''}","${(r.tags || []).join(';')}","${r.notes || ''}",${r.is_active}`
            )
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=recipients-${Date.now()}.csv`);
        res.send(csv);

        logger.info(`✅ Recipients exported: ${recipients.length} by user ${req.user.email}`);
    } catch (error) {
        logger.error('Error exporting recipients:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export recipients',
            message: error.message
        });
    }
});

module.exports = router;
