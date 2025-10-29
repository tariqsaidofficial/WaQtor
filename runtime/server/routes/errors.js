/**
 * Error Routes
 * API endpoints for error management and monitoring
 */

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const errorLogger = require('../utils/errorLogger');

/**
 * Get error statistics
 * GET /api/errors/stats?timeRange=day
 */
router.get('/stats', asyncHandler(async (req, res) => {
    const { timeRange = 'day' } = req.query;
    const stats = await errorLogger.getErrorStats(timeRange);

    res.json({
        success: true,
        data: stats
    });
}));

/**
 * Get recent errors
 * GET /api/errors/recent?limit=10
 */
router.get('/recent', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const errors = errorLogger.getRecentErrors(limit);

    res.json({
        success: true,
        data: {
            count: errors.length,
            errors
        }
    });
}));

/**
 * Clear error history
 * DELETE /api/errors/clear
 */
router.delete('/clear', asyncHandler(async (req, res) => {
    const success = await errorLogger.clearHistory();

    res.json({
        success,
        message: success ? 'Error history cleared' : 'Failed to clear error history'
    });
}));

/**
 * Log frontend error
 * POST /api/errors/log
 */
router.post('/log', asyncHandler(async (req, res) => {
    const { error, context } = req.body;

    await errorLogger.logError(
        {
            message: error.message,
            code: error.code,
            statusCode: error.statusCode || 0,
            stack: error.stack
        },
        {
            ...context,
            source: 'frontend',
            userAgent: req.headers['user-agent'],
            ip: req.ip
        }
    );

    res.json({
        success: true,
        message: 'Error logged successfully'
    });
}));

module.exports = router;
