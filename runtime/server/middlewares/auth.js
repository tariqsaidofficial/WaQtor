/**
 * Authentication Middleware
 * API Key authentication with PostgreSQL
 */

const { ApiKey } = require('../models');
const logger = require('../utils/logger');

/**
 * API Key Authentication Middleware
 */
async function apiKeyAuth(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key'] || req.query.apiKey;

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                error: 'API key is required',
                message: 'Provide API key in X-API-Key header or apiKey query parameter'
            });
        }

        // First, check against environment variable (for development/testing)
        const envApiKey = process.env.API_KEY;
        if (envApiKey && apiKey === envApiKey) {
            req.apiKey = { key: apiKey, name: 'default', isActive: true };
            return next();
        }

        // Verify API key from PostgreSQL
        const verification = await ApiKey.verifyKey(apiKey);

        if (!verification.valid) {
            logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 10)}... - ${verification.reason}`);
            return res.status(403).json({
                success: false,
                error: verification.reason
            });
        }

        // Attach key info to request
        req.apiKey = verification.apiKey;
        req.userId = verification.apiKey.userId;
        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Authentication failed',
            message: error.message
        });
    }
}

module.exports = {
    apiKeyAuth
};
