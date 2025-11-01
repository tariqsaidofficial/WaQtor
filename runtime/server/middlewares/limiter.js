/**
 * Rate Limiting Middleware
 * Prevent API abuse
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

/**
 * General API Rate Limiter
 */
const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // Limit each IP to 1000 requests per minute (development)
    message: {
        success: false,
        error: 'Too many requests',
        message: 'You have exceeded the rate limit. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Too many requests',
            message: 'You have exceeded the rate limit. Please try again later.'
        });
    }
});

/**
 * Strict Rate Limiter for sensitive endpoints
 */
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit to 10 requests per hour
    message: {
        success: false,
        error: 'Too many requests',
        message: 'You have exceeded the rate limit for this endpoint.'
    }
});

module.exports = {
    rateLimiter,
    strictLimiter
};
