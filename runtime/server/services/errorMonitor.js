/**
 * Error Monitoring Service
 * Monitors application errors and provides alerts
 */

const EventEmitter = require('events');
const errorLogger = require('../utils/errorLogger');
const logger = require('../utils/logger');

class ErrorMonitor extends EventEmitter {
    constructor() {
        super();
        this.errorThresholds = {
            critical: 10,  // errors per minute
            warning: 5,    // errors per minute
            info: 2        // errors per minute
        };
        this.errorCounts = new Map();
        this.checkInterval = 60000; // 1 minute
        this.interval = null;
    }

    /**
     * Start monitoring
     */
    start() {
        logger.info('Error monitoring started');
        
        this.interval = setInterval(() => {
            this.checkErrorRates();
        }, this.checkInterval);

        return this;
    }

    /**
     * Stop monitoring
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        logger.info('Error monitoring stopped');
    }

    /**
     * Record error occurrence
     */
    recordError(errorCode) {
        const timestamp = Date.now();
        
        if (!this.errorCounts.has(errorCode)) {
            this.errorCounts.set(errorCode, []);
        }

        const counts = this.errorCounts.get(errorCode);
        counts.push(timestamp);

        // Remove old timestamps (older than 1 minute)
        const oneMinuteAgo = timestamp - 60000;
        this.errorCounts.set(
            errorCode,
            counts.filter(ts => ts > oneMinuteAgo)
        );
    }

    /**
     * Check error rates and emit alerts
     */
    async checkErrorRates() {
        const stats = await errorLogger.getErrorStats('hour');
        
        for (const [code] of Object.entries(stats.byCode)) {
            const recentCount = this.errorCounts.get(code)?.length || 0;

            if (recentCount >= this.errorThresholds.critical) {
                this.emit('critical', {
                    code,
                    count: recentCount,
                    threshold: this.errorThresholds.critical,
                    message: `Critical: ${code} occurred ${recentCount} times in the last minute`
                });
                
                logger.error('Critical error rate detected:', { code, count: recentCount });
            } else if (recentCount >= this.errorThresholds.warning) {
                this.emit('warning', {
                    code,
                    count: recentCount,
                    threshold: this.errorThresholds.warning,
                    message: `Warning: ${code} occurred ${recentCount} times in the last minute`
                });
                
                logger.warn('High error rate detected:', { code, count: recentCount });
            }
        }

        // Emit stats update
        this.emit('stats', stats);
    }

    /**
     * Get current error rates
     */
    getErrorRates() {
        const rates = {};
        
        for (const [code, timestamps] of this.errorCounts.entries()) {
            rates[code] = timestamps.length;
        }

        return rates;
    }

    /**
     * Set error thresholds
     */
    setThresholds(thresholds) {
        this.errorThresholds = { ...this.errorThresholds, ...thresholds };
        logger.info('Error thresholds updated:', this.errorThresholds);
    }
}

// Singleton instance
const errorMonitor = new ErrorMonitor();

module.exports = errorMonitor;
