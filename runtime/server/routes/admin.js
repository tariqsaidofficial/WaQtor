/**
 * Admin Routes
 * Dashboard and system management endpoints
 */

const express = require('express');
const router = express.Router();
const { User, WhatsAppSession, Message, Campaign, Recipient, Group } = require('../models');
const { jwtAuth } = require('../middlewares/jwtAuth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Apply JWT authentication and admin check
router.use(jwtAuth);
router.use((req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }
    next();
});

/**
 * GET /api/admin/stats
 * Get system statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = {
            users: {
                total: await User.count(),
                active: await User.count({ where: { is_active: true } }),
                admins: await User.count({ where: { role: 'admin' } }),
                byRole: await User.findAll({
                    attributes: [
                        'role',
                        [require('sequelize').fn('COUNT', 'id'), 'count']
                    ],
                    group: ['role']
                })
            },
            sessions: {
                total: await WhatsAppSession.count(),
                active: await WhatsAppSession.count({ where: { is_active: true } }),
                ready: await WhatsAppSession.count({ where: { is_ready: true } })
            },
            messages: {
                total: await Message.count(),
                today: await Message.count({
                    where: {
                        created_at: {
                            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                }),
                thisWeek: await Message.count({
                    where: {
                        created_at: {
                            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        }
                    }
                }),
                byStatus: await Message.findAll({
                    attributes: [
                        'status',
                        [require('sequelize').fn('COUNT', 'id'), 'count']
                    ],
                    group: ['status']
                })
            },
            campaigns: {
                total: await Campaign.count(),
                running: await Campaign.count({ where: { status: 'running' } }),
                completed: await Campaign.count({ where: { status: 'completed' } }),
                byStatus: await Campaign.findAll({
                    attributes: [
                        'status',
                        [require('sequelize').fn('COUNT', 'id'), 'count']
                    ],
                    group: ['status']
                })
            },
            recipients: {
                total: await Recipient.count(),
                active: await Recipient.count({ where: { is_active: true } })
            },
            groups: {
                total: await Group.count()
            }
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error getting admin stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get statistics',
            message: error.message
        });
    }
});

/**
 * GET /api/admin/users
 * List all users
 */
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 50, search = '', role = '' } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (role) {
            where.role = role;
        }

        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: WhatsAppSession,
                    as: 'sessions',
                    attributes: ['id', 'client_id', 'is_active', 'is_ready']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                users: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        logger.error('Error listing users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list users',
            message: error.message
        });
    }
});

/**
 * PUT /api/admin/users/:id
 * Update user (admin only)
 */
router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const { name, role, is_active } = req.body;

        await user.update({
            name: name || user.name,
            role: role || user.role,
            is_active: is_active !== undefined ? is_active : user.is_active
        });

        logger.info(`✅ User ${user.email} updated by admin ${req.user.email}`);

        res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                is_active: user.is_active
            }
        });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update user',
            message: error.message
        });
    }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user (admin only)
 */
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Prevent self-deletion
        if (user.id === req.userId) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete your own account'
            });
        }

        await user.destroy();

        logger.info(`✅ User ${user.email} deleted by admin ${req.user.email}`);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user',
            message: error.message
        });
    }
});

/**
 * GET /api/admin/activity
 * Get recent activity logs
 */
router.get('/activity', async (req, res) => {
    try {
        const { limit = 100 } = req.query;

        // Get recent messages
        const recentMessages = await Message.findAll({
            limit: parseInt(limit),
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        // Get recent campaigns
        const recentCampaigns = await Campaign.findAll({
            limit: 50,
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        // Get recent user logins
        const recentLogins = await User.findAll({
            where: {
                last_login_at: { [Op.not]: null }
            },
            order: [['last_login_at', 'DESC']],
            limit: 50,
            attributes: ['id', 'name', 'email', 'last_login_at']
        });

        res.json({
            success: true,
            data: {
                recentMessages: recentMessages.slice(0, 20),
                recentCampaigns: recentCampaigns.slice(0, 10),
                recentLogins: recentLogins.slice(0, 10)
            }
        });
    } catch (error) {
        logger.error('Error getting activity:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get activity',
            message: error.message
        });
    }
});

/**
 * GET /api/admin/database
 * Get database monitoring info
 */
router.get('/database', async (req, res) => {
    try {
        const db = require('../models');
        
        // Get table sizes
        const tables = await db.sequelize.query(
            `SELECT 
                schemaname,
                tablename,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
                pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY size_bytes DESC`,
            { type: db.sequelize.QueryTypes.SELECT }
        );

        // Get database size
        const dbSize = await db.sequelize.query(
            `SELECT pg_size_pretty(pg_database_size(current_database())) as size`,
            { type: db.sequelize.QueryTypes.SELECT }
        );

        // Get connection info
        const connections = await db.sequelize.query(
            `SELECT count(*) as total FROM pg_stat_activity WHERE datname = current_database()`,
            { type: db.sequelize.QueryTypes.SELECT }
        );

        res.json({
            success: true,
            data: {
                databaseSize: dbSize[0].size,
                tables: tables,
                connections: connections[0].total,
                version: await db.sequelize.query('SELECT version()', { 
                    type: db.sequelize.QueryTypes.SELECT 
                })
            }
        });
    } catch (error) {
        logger.error('Error getting database info:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get database info',
            message: error.message
        });
    }
});

/**
 * POST /api/admin/cleanup
 * Run database cleanup tasks
 */
router.post('/cleanup', async (req, res) => {
    try {
        const { days = 30 } = req.body;
        
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        
        // Delete old messages
        const deletedMessages = await Message.destroy({
            where: {
                created_at: { [Op.lt]: cutoffDate },
                status: 'sent'
            }
        });

        logger.info(`✅ Cleanup: ${deletedMessages} old messages deleted by admin ${req.user.email}`);

        res.json({
            success: true,
            message: 'Cleanup completed',
            data: {
                deletedMessages,
                cutoffDate
            }
        });
    } catch (error) {
        logger.error('Error running cleanup:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to run cleanup',
            message: error.message
        });
    }
});

module.exports = router;
