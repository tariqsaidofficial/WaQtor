/**
 * Authentication Middleware
 * API Key authentication
 */

const db = require('../db/db');
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

        // First, check against environment variable (simple auth for development/testing)
        const envApiKey = process.env.API_KEY;
        if (envApiKey && apiKey === envApiKey) {
            req.apiKey = { key: apiKey, name: 'default', is_active: true };
            return next();
        }

        // If not matched with env, check database
        const validKey = await db.verifyApiKey(apiKey);

        if (!validKey) {
            logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 10)}...`);
            return res.status(403).json({
                success: false,
                error: 'Invalid API key'
            });
        }

        // Attach key info to request
        req.apiKey = validKey;
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
