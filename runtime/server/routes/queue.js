/**
 * Queue Management Routes
 * API endpoints for queue monitoring and management
 */

const express = require('express');
const router = express.Router();
const {
    getJob,
    getJobStatus,
    getQueueStats,
    getRecentJobs,
    cleanOldJobs,
    pauseQueue,
    resumeQueue
} = require('../queue/messageQueue');
const logger = require('../utils/logger');

/**
 * GET /api/queue/stats
 * Get queue statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await getQueueStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error getting queue stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get queue statistics',
            message: error.message
        });
    }
});

/**
 * GET /api/queue/jobs
 * Get recent jobs
 */
router.get('/jobs', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const jobs = await getRecentJobs(limit);
        
        res.json({
            success: true,
            data: {
                jobs,
                count: jobs.length
            }
        });
    } catch (error) {
        logger.error('Error getting recent jobs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get recent jobs',
            message: error.message
        });
    }
});

/**
 * GET /api/queue/jobs/:jobId
 * Get job by ID
 */
router.get('/jobs/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const status = await getJobStatus(jobId);
        
        if (status.status === 'not_found') {
            return res.status(404).json({
                success: false,
                error: 'Job not found'
            });
        }
        
        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        logger.error('Error getting job status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get job status',
            message: error.message
        });
    }
});

/**
 * POST /api/queue/pause
 * Pause queue processing
 */
router.post('/pause', async (req, res) => {
    try {
        await pauseQueue();
        
        res.json({
            success: true,
            message: 'Queue paused successfully'
        });
    } catch (error) {
        logger.error('Error pausing queue:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to pause queue',
            message: error.message
        });
    }
});

/**
 * POST /api/queue/resume
 * Resume queue processing
 */
router.post('/resume', async (req, res) => {
    try {
        await resumeQueue();
        
        res.json({
            success: true,
            message: 'Queue resumed successfully'
        });
    } catch (error) {
        logger.error('Error resuming queue:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to resume queue',
            message: error.message
        });
    }
});

/**
 * POST /api/queue/clean
 * Clean old completed/failed jobs
 */
router.post('/clean', async (req, res) => {
    try {
        const grace = parseInt(req.body.grace) || 24 * 60 * 60 * 1000; // 24 hours default
        await cleanOldJobs(grace);
        
        res.json({
            success: true,
            message: 'Old jobs cleaned successfully'
        });
    } catch (error) {
        logger.error('Error cleaning jobs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clean jobs',
            message: error.message
        });
    }
});

/**
 * GET /api/queue/health
 * Check queue health
 */
router.get('/health', async (req, res) => {
    try {
        const stats = await getQueueStats();
        const isHealthy = stats.active < 100 && stats.failed < 50;
        
        res.json({
            success: true,
            healthy: isHealthy,
            data: stats
        });
    } catch (error) {
        logger.error('Error checking queue health:', error);
        res.status(500).json({
            success: false,
            healthy: false,
            error: 'Failed to check queue health',
            message: error.message
        });
    }
});

module.exports = router;
