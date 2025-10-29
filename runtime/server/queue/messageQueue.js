/**
 * Message Queue Manager
 * Handles bulk message sending with Bull Queue
 */

const Queue = require('bull');
const logger = require('../utils/logger');

// Redis configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
};

// Create message queue
const messageQueue = new Queue('message-queue', {
    redis: redisConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 200      // Keep last 200 failed jobs
    }
});

// Queue event listeners
messageQueue.on('error', (error) => {
    logger.error('Queue error:', error);
});

messageQueue.on('waiting', (jobId) => {
    logger.debug(`Job ${jobId} is waiting`);
});

messageQueue.on('active', (job) => {
    logger.info(`Job ${job.id} started processing`);
});

messageQueue.on('completed', (job, result) => {
    logger.info(`Job ${job.id} completed:`, result);
});

messageQueue.on('failed', (job, error) => {
    logger.error(`Job ${job.id} failed:`, error.message);
});

messageQueue.on('progress', (job, progress) => {
    logger.debug(`Job ${job.id} progress: ${progress}%`);
});

/**
 * Add bulk message job to queue
 * @param {Array} recipients - Array of {phone, message, variables}
 * @param {Object} options - Job options
 * @returns {Promise<Job>}
 */
async function addBulkMessageJob(recipients, options = {}) {
    const job = await messageQueue.add('send-bulk', {
        recipients,
        timestamp: Date.now(),
        ...options
    }, {
        priority: options.priority || 5,
        delay: options.delay || 0
    });

    logger.info(`Bulk message job created: ${job.id} with ${recipients.length} recipients`);
    return job;
}

/**
 * Add single message job to queue
 * @param {String} phone - Phone number
 * @param {String} message - Message text
 * @param {Object} options - Job options
 * @returns {Promise<Job>}
 */
async function addSingleMessageJob(phone, message, options = {}) {
    const job = await messageQueue.add('send-single', {
        phone,
        message,
        timestamp: Date.now(),
        ...options
    }, {
        priority: options.priority || 5,
        delay: options.delay || 0
    });

    logger.info(`Single message job created: ${job.id} for ${phone}`);
    return job;
}

/**
 * Get job by ID
 * @param {String} jobId - Job ID
 * @returns {Promise<Job>}
 */
async function getJob(jobId) {
    return await messageQueue.getJob(jobId);
}

/**
 * Get job status
 * @param {String} jobId - Job ID
 * @returns {Promise<Object>}
 */
async function getJobStatus(jobId) {
    const job = await messageQueue.getJob(jobId);
    if (!job) {
        return { status: 'not_found' };
    }

    const state = await job.getState();
    const progress = job.progress();
    const failedReason = job.failedReason;

    return {
        id: job.id,
        status: state,
        progress,
        data: job.data,
        failedReason,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
        returnvalue: job.returnvalue
    };
}

/**
 * Get queue statistics
 * @returns {Promise<Object>}
 */
async function getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
        messageQueue.getWaitingCount(),
        messageQueue.getActiveCount(),
        messageQueue.getCompletedCount(),
        messageQueue.getFailedCount(),
        messageQueue.getDelayedCount()
    ]);

    return {
        waiting,
        active,
        completed,
        failed,
        delayed,
        total: waiting + active + completed + failed + delayed
    };
}

/**
 * Get recent jobs
 * @param {Number} limit - Number of jobs to return
 * @returns {Promise<Array>}
 */
async function getRecentJobs(limit = 50) {
    const [completed, failed, active, waiting] = await Promise.all([
        messageQueue.getCompleted(0, limit),
        messageQueue.getFailed(0, limit),
        messageQueue.getActive(0, limit),
        messageQueue.getWaiting(0, limit)
    ]);

    const jobs = [...completed, ...failed, ...active, ...waiting]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);

    return Promise.all(jobs.map(async (job) => {
        const state = await job.getState();
        return {
            id: job.id,
            status: state,
            data: job.data,
            progress: job.progress(),
            processedOn: job.processedOn,
            finishedOn: job.finishedOn,
            failedReason: job.failedReason
        };
    }));
}

/**
 * Clean old jobs
 * @param {Number} grace - Grace period in milliseconds
 * @returns {Promise<void>}
 */
async function cleanOldJobs(grace = 24 * 60 * 60 * 1000) {
    await messageQueue.clean(grace, 'completed');
    await messageQueue.clean(grace, 'failed');
    logger.info('Old jobs cleaned');
}

/**
 * Pause queue
 * @returns {Promise<void>}
 */
async function pauseQueue() {
    await messageQueue.pause();
    logger.info('Queue paused');
}

/**
 * Resume queue
 * @returns {Promise<void>}
 */
async function resumeQueue() {
    await messageQueue.resume();
    logger.info('Queue resumed');
}

/**
 * Close queue connection
 * @returns {Promise<void>}
 */
async function closeQueue() {
    await messageQueue.close();
    logger.info('Queue closed');
}

module.exports = {
    messageQueue,
    addBulkMessageJob,
    addSingleMessageJob,
    getJob,
    getJobStatus,
    getQueueStats,
    getRecentJobs,
    cleanOldJobs,
    pauseQueue,
    resumeQueue,
    closeQueue
};
