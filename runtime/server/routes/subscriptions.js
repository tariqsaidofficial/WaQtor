/**
 * Subscriptions Routes
 * API endpoints for feature subscriptions and access codes
 */

const express = require('express');
const router = express.Router();
const { jwtAuth } = require('../middlewares/jwtAuth');
const subscriptionService = require('../services/subscriptionService');
const logger = require('../utils/logger');
const db = require('../models');

/**
 * Check feature access
 * GET /api/subscriptions/check/:featureName
 */
router.get('/check/:featureName', jwtAuth, async (req, res) => {
    try {
        const { featureName } = req.params;
        const userId = req.user.id;

        const result = await subscriptionService.checkFeatureAccess(userId, featureName);

        // Log the access attempt
        await subscriptionService.logAccess(
            userId,
            featureName,
            'view',
            result.hasAccess ? 'allowed' : 'blocked',
            {
                ipAddress: req.ip,
                userAgent: req.get('user-agent')
            }
        );

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        logger.error('Error checking feature access:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check feature access'
        });
    }
});

/**
 * Verify access code
 * POST /api/subscriptions/verify-code
 */
router.post('/verify-code', jwtAuth, async (req, res) => {
    try {
        const { code, featureName } = req.body;
        const userId = req.user.id;

        if (!code || !featureName) {
            return res.status(400).json({
                success: false,
                error: 'Code and feature name are required'
            });
        }

        // Validate code format (6 digits)
        if (!/^\d{6}$/.test(code)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid code format. Code must be 6 digits'
            });
        }

        const result = await subscriptionService.verifyAccessCode(userId, code, featureName);

        // Log the unlock attempt
        await subscriptionService.logAccess(
            userId,
            featureName,
            result.success ? 'unlock_success' : 'unlock_failed',
            result.success ? 'allowed' : 'blocked',
            {
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
                accessCodeUsed: result.success
            }
        );

        if (result.success) {
            res.json({
                success: true,
                message: 'Access code verified successfully',
                subscription: result.subscription
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.reason
            });
        }
    } catch (error) {
        logger.error('Error verifying access code:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify access code'
        });
    }
});

/**
 * Start trial period
 * POST /api/subscriptions/start-trial
 */
router.post('/start-trial', jwtAuth, async (req, res) => {
    try {
        const { featureName, trialDays = 7 } = req.body;
        const userId = req.user.id;

        if (!featureName) {
            return res.status(400).json({
                success: false,
                error: 'Feature name is required'
            });
        }

        const result = await subscriptionService.startTrial(userId, featureName, trialDays);

        if (result.success) {
            res.json({
                success: true,
                message: 'Trial started successfully',
                subscription: result.subscription
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.reason
            });
        }
    } catch (error) {
        logger.error('Error starting trial:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to start trial'
        });
    }
});

/**
 * Get user subscriptions
 * GET /api/subscriptions/my-subscriptions
 */
router.get('/my-subscriptions', jwtAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const subscriptions = await subscriptionService.getUserSubscriptions(userId);

        res.json({
            success: true,
            subscriptions
        });
    } catch (error) {
        logger.error('Error getting subscriptions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get subscriptions'
        });
    }
});

/**
 * Increment feature usage
 * POST /api/subscriptions/increment-usage
 */
router.post('/increment-usage', jwtAuth, async (req, res) => {
    try {
        const { featureName } = req.body;
        const userId = req.user.id;

        if (!featureName) {
            return res.status(400).json({
                success: false,
                error: 'Feature name is required'
            });
        }

        await subscriptionService.incrementUsage(userId, featureName);

        // Log usage
        await subscriptionService.logAccess(
            userId,
            featureName,
            'usage',
            'allowed',
            {
                ipAddress: req.ip,
                userAgent: req.get('user-agent')
            }
        );

        res.json({
            success: true,
            message: 'Usage incremented'
        });
    } catch (error) {
        logger.error('Error incrementing usage:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to increment usage'
        });
    }
});

/**
 * Admin: Create access code
 * POST /api/subscriptions/admin/create-code
 */
router.post('/admin/create-code', jwtAuth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }

        const {
            code,
            featureName,
            subscriptionType = 'premium',
            durationDays = null,
            maxUses = null,
            expiresAt = null
        } = req.body;

        if (!code || !featureName) {
            return res.status(400).json({
                success: false,
                error: 'Code and feature name are required'
            });
        }

        // Validate code format (6 digits)
        if (!/^\d{6}$/.test(code)) {
            return res.status(400).json({
                success: false,
                error: 'Code must be 6 digits'
            });
        }

        // Hash the code
        const codeHash = db.AccessCode.hashCode(code);

        // Check if code already exists
        const existing = await db.AccessCode.findOne({
            where: { codeHash }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Code already exists'
            });
        }

        // Create access code
        const accessCode = await db.AccessCode.create({
            featureName,
            codeHash,
            subscriptionType,
            durationDays,
            maxUses,
            expiresAt,
            createdBy: req.user.id
        });

        res.json({
            success: true,
            message: 'Access code created successfully',
            accessCode: {
                id: accessCode.id,
                featureName: accessCode.featureName,
                subscriptionType: accessCode.subscriptionType,
                durationDays: accessCode.durationDays,
                maxUses: accessCode.maxUses,
                expiresAt: accessCode.expiresAt
            }
        });
    } catch (error) {
        logger.error('Error creating access code:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create access code'
        });
    }
});

/**
 * Admin: Get all access codes
 * GET /api/subscriptions/admin/codes
 */
router.get('/admin/codes', jwtAuth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }

        const codes = await db.AccessCode.findAll({
            attributes: ['id', 'featureName', 'subscriptionType', 'durationDays', 'maxUses', 'usedCount', 'expiresAt', 'isActive', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            codes
        });
    } catch (error) {
        logger.error('Error getting access codes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get access codes'
        });
    }
});

/**
 * Admin: Get feature analytics
 * GET /api/subscriptions/admin/analytics/:featureName
 */
router.get('/admin/analytics/:featureName', jwtAuth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }

        const { featureName } = req.params;
        const { startDate, endDate } = req.query;

        const analytics = await subscriptionService.getFeatureAnalytics(
            featureName,
            startDate ? new Date(startDate) : null,
            endDate ? new Date(endDate) : null
        );

        res.json({
            success: true,
            analytics
        });
    } catch (error) {
        logger.error('Error getting analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get analytics'
        });
    }
});

module.exports = router;
