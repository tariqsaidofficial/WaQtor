/**
 * Subscription Service
 * Manages feature subscriptions and access verification
 */

const db = require('../models');
const logger = require('../utils/logger');

class SubscriptionService {
    /**
     * Check if user has access to a feature
     */
    async checkFeatureAccess(userId, featureName) {
        try {
            const subscription = await db.FeatureSubscription.findOne({
                where: {
                    userId,
                    featureName
                }
            });

            if (!subscription) {
                // No subscription found - check if trial is available
                return {
                    hasAccess: false,
                    status: 'no_subscription',
                    canStartTrial: true
                };
            }

            // Check subscription status
            if (subscription.status === 'active') {
                // Check expiration
                if (subscription.endDate && new Date() > subscription.endDate) {
                    await subscription.update({ status: 'expired' });
                    return {
                        hasAccess: false,
                        status: 'expired',
                        subscription
                    };
                }

                // Check usage limit
                if (subscription.usageLimit && subscription.usageCount >= subscription.usageLimit) {
                    return {
                        hasAccess: false,
                        status: 'limit_reached',
                        subscription
                    };
                }

                return {
                    hasAccess: true,
                    status: 'active',
                    subscription
                };
            }

            if (subscription.status === 'trial') {
                // Check trial expiration
                if (subscription.trialEndDate && new Date() > subscription.trialEndDate) {
                    await subscription.update({ status: 'expired' });
                    return {
                        hasAccess: false,
                        status: 'trial_expired',
                        subscription
                    };
                }

                return {
                    hasAccess: true,
                    status: 'trial',
                    subscription
                };
            }

            return {
                hasAccess: false,
                status: subscription.status,
                subscription
            };
        } catch (error) {
            logger.error('Error checking feature access:', error);
            throw error;
        }
    }

    /**
     * Verify and activate access code
     */
    async verifyAccessCode(userId, code, featureName) {
        try {
            // Verify the code
            const verification = await db.AccessCode.verifyCode(code, featureName);

            if (!verification.valid) {
                return {
                    success: false,
                    reason: verification.reason
                };
            }

            const accessCode = verification.accessCode;

            // Check if user already has an active subscription
            let subscription = await db.FeatureSubscription.findOne({
                where: {
                    userId,
                    featureName
                }
            });

            const now = new Date();
            let endDate = null;

            // Calculate end date if not lifetime
            if (accessCode.durationDays) {
                endDate = new Date();
                endDate.setDate(endDate.getDate() + accessCode.durationDays);
            }

            if (subscription) {
                // Update existing subscription
                await subscription.update({
                    status: 'active',
                    subscriptionType: accessCode.subscriptionType,
                    startDate: now,
                    endDate,
                    usageLimit: null, // Remove usage limits for premium
                    metadata: {
                        ...subscription.metadata,
                        activatedWith: 'access_code',
                        activatedAt: now
                    }
                });
            } else {
                // Create new subscription
                subscription = await db.FeatureSubscription.create({
                    userId,
                    featureName,
                    status: 'active',
                    subscriptionType: accessCode.subscriptionType,
                    startDate: now,
                    endDate,
                    metadata: {
                        activatedWith: 'access_code',
                        activatedAt: now
                    }
                });
            }

            // Increment code usage count
            await accessCode.increment('usedCount');

            // Deactivate code if max uses reached
            if (accessCode.maxUses && accessCode.usedCount + 1 >= accessCode.maxUses) {
                await accessCode.update({ isActive: false });
            }

            return {
                success: true,
                subscription
            };
        } catch (error) {
            logger.error('Error verifying access code:', error);
            throw error;
        }
    }

    /**
     * Start trial period for a feature
     */
    async startTrial(userId, featureName, trialDays = 7) {
        try {
            // Check if trial already exists
            const existing = await db.FeatureSubscription.findOne({
                where: {
                    userId,
                    featureName
                }
            });

            if (existing) {
                return {
                    success: false,
                    reason: 'Trial already used'
                };
            }

            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + trialDays);

            const subscription = await db.FeatureSubscription.create({
                userId,
                featureName,
                status: 'trial',
                subscriptionType: 'free',
                startDate: new Date(),
                trialEndDate,
                metadata: {
                    trialDays
                }
            });

            return {
                success: true,
                subscription
            };
        } catch (error) {
            logger.error('Error starting trial:', error);
            throw error;
        }
    }

    /**
     * Increment usage count for a feature
     */
    async incrementUsage(userId, featureName) {
        try {
            const subscription = await db.FeatureSubscription.findOne({
                where: {
                    userId,
                    featureName
                }
            });

            if (subscription) {
                await subscription.increment('usageCount');
            }
        } catch (error) {
            logger.error('Error incrementing usage:', error);
        }
    }

    /**
     * Log feature access attempt
     */
    async logAccess(userId, featureName, accessType, status, metadata = {}) {
        try {
            await db.FeatureAccessLog.create({
                userId,
                featureName,
                accessType,
                status,
                ipAddress: metadata.ipAddress,
                userAgent: metadata.userAgent,
                accessCodeUsed: metadata.accessCodeUsed || false,
                metadata
            });
        } catch (error) {
            logger.error('Error logging access:', error);
        }
    }

    /**
     * Get user's subscriptions
     */
    async getUserSubscriptions(userId) {
        try {
            return await db.FeatureSubscription.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            logger.error('Error getting user subscriptions:', error);
            throw error;
        }
    }

    /**
     * Get access analytics for a feature
     */
    async getFeatureAnalytics(featureName, startDate, endDate) {
        try {
            const { Op } = require('sequelize');
            
            const where = { featureName };
            if (startDate && endDate) {
                where.createdAt = {
                    [Op.between]: [startDate, endDate]
                };
            }

            const logs = await db.FeatureAccessLog.findAll({
                where,
                attributes: [
                    'accessType',
                    'status',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
                ],
                group: ['accessType', 'status']
            });

            return logs;
        } catch (error) {
            logger.error('Error getting feature analytics:', error);
            throw error;
        }
    }
}

module.exports = new SubscriptionService();
