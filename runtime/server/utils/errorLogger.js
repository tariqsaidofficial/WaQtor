/**
 * Enhanced Error Logger
 * Advanced error logging and tracking
 */

const logger = require('./logger');
const fs = require('fs').promises;
const path = require('path');

class ErrorLogger {
    constructor() {
        this.errorLogPath = path.join(__dirname, '../../logs/errors.json');
        this.maxErrorsInMemory = 100;
        this.errorHistory = [];
    }

    /**
     * Log error with context
     */
    async logError(error, context = {}) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            message: error.message,
            code: error.code || 'UNKNOWN',
            statusCode: error.statusCode || 500,
            stack: error.stack,
            context: {
                ...context,
                environment: process.env.NODE_ENV,
                nodeVersion: process.version,
                platform: process.platform
            }
        };

        // Add to memory history
        this.errorHistory.unshift(errorEntry);
        if (this.errorHistory.length > this.maxErrorsInMemory) {
            this.errorHistory.pop();
        }

        // Log to Winston
        logger.error('Error occurred:', errorEntry);

        // Persist to file
        await this.persistError(errorEntry);

        // Send to monitoring service (if configured)
        await this.sendToMonitoring(errorEntry);

        return errorEntry;
    }

    /**
     * Persist error to JSON file
     */
    async persistError(errorEntry) {
        try {
            // Read existing errors
            let errors = [];
            try {
                const data = await fs.readFile(this.errorLogPath, 'utf8');
                errors = JSON.parse(data);
            } catch (err) {
                // File doesn't exist yet
                errors = [];
            }

            // Add new error
            errors.unshift(errorEntry);

            // Keep only last 1000 errors
            if (errors.length > 1000) {
                errors = errors.slice(0, 1000);
            }

            // Ensure directory exists
            const dir = path.dirname(this.errorLogPath);
            await fs.mkdir(dir, { recursive: true });

            // Write back
            await fs.writeFile(
                this.errorLogPath,
                JSON.stringify(errors, null, 2),
                'utf8'
            );
        } catch (err) {
            logger.error('Failed to persist error:', err);
        }
    }

    /**
     * Send error to monitoring service (Sentry, LogRocket, etc.)
     */
    async sendToMonitoring() {
        // Future implementation: Sentry, LogRocket, DataDog, etc.
        if (process.env.SENTRY_DSN) {
            // Sentry.captureException(errorEntry);
        }
    }

    /**
     * Get error statistics
     */
    async getErrorStats(timeRange = 'day') {
        try {
            const data = await fs.readFile(this.errorLogPath, 'utf8');
            const errors = JSON.parse(data);

            const now = new Date();
            let startTime;

            switch (timeRange) {
            case 'hour':
                startTime = new Date(now - 60 * 60 * 1000);
                break;
            case 'day':
                startTime = new Date(now - 24 * 60 * 60 * 1000);
                break;
            case 'week':
                startTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            default:
                startTime = new Date(now - 24 * 60 * 60 * 1000);
            }

            const recentErrors = errors.filter(e => 
                new Date(e.timestamp) >= startTime
            );

            // Count by error code
            const byCode = recentErrors.reduce((acc, error) => {
                acc[error.code] = (acc[error.code] || 0) + 1;
                return acc;
            }, {});

            // Count by status code
            const byStatusCode = recentErrors.reduce((acc, error) => {
                acc[error.statusCode] = (acc[error.statusCode] || 0) + 1;
                return acc;
            }, {});

            return {
                timeRange,
                startTime: startTime.toISOString(),
                endTime: now.toISOString(),
                total: recentErrors.length,
                byCode,
                byStatusCode,
                recent: recentErrors.slice(0, 10)
            };
        } catch (err) {
            logger.error('Failed to get error stats:', err);
            return {
                total: 0,
                byCode: {},
                byStatusCode: {},
                recent: []
            };
        }
    }

    /**
     * Clear error history
     */
    async clearHistory() {
        try {
            await fs.writeFile(this.errorLogPath, JSON.stringify([], null, 2));
            this.errorHistory = [];
            logger.info('Error history cleared');
            return true;
        } catch (err) {
            logger.error('Failed to clear error history:', err);
            return false;
        }
    }

    /**
     * Get recent errors from memory
     */
    getRecentErrors(limit = 10) {
        return this.errorHistory.slice(0, limit);
    }
}

// Singleton instance
const errorLogger = new ErrorLogger();

module.exports = errorLogger;
