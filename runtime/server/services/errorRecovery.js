/**
 * Error Recovery Strategies
 * Automatic error recovery mechanisms
 */

const logger = require('../utils/logger');
const errorLogger = require('../utils/errorLogger');

class ErrorRecovery {
    constructor() {
        this.recoveryStrategies = new Map();
        this.maxRetries = 3;
        this.retryDelay = 1000;
    }

    /**
     * Register recovery strategy for error code
     */
    registerStrategy(errorCode, strategy) {
        this.recoveryStrategies.set(errorCode, strategy);
        logger.info(`Recovery strategy registered for ${errorCode}`);
    }

    /**
     * Attempt to recover from error
     */
    async recover(error, context = {}) {
        const strategy = this.recoveryStrategies.get(error.code);
        
        if (!strategy) {
            logger.warn(`No recovery strategy for error code: ${error.code}`);
            return false;
        }

        logger.info(`Attempting recovery for error: ${error.code}`);

        try {
            const result = await this.retryWithBackoff(
                () => strategy(error, context),
                this.maxRetries
            );

            logger.info(`Recovery successful for error: ${error.code}`);
            
            await errorLogger.logError(error, {
                ...context,
                recovered: true,
                recoveryResult: result
            });

            return result;
        } catch (recoveryError) {
            logger.error(`Recovery failed for error: ${error.code}`, recoveryError);
            
            await errorLogger.logError(error, {
                ...context,
                recovered: false,
                recoveryError: recoveryError.message
            });

            return false;
        }
    }

    /**
     * Retry with exponential backoff
     */
    async retryWithBackoff(fn, maxRetries) {
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (i < maxRetries - 1) {
                    const delay = this.retryDelay * Math.pow(2, i);
                    logger.info(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;
    }

    /**
     * Check if error is recoverable
     */
    isRecoverable(error) {
        return this.recoveryStrategies.has(error.code);
    }

    /**
     * Get registered strategies
     */
    getStrategies() {
        return Array.from(this.recoveryStrategies.keys());
    }
}

// Singleton instance
const errorRecovery = new ErrorRecovery();

// Register default recovery strategies

// WhatsApp disconnection recovery
errorRecovery.registerStrategy('WHATSAPP_DISCONNECTED', async (error, context) => {
    const { waClient } = context;
    
    if (!waClient) {
        throw new Error('WhatsApp client not available');
    }

    // Attempt to reconnect
    logger.info('Attempting to reconnect WhatsApp...');
    await waClient.initialize();
    
    return { reconnected: true };
});

// Rate limit recovery
errorRecovery.registerStrategy('RATE_LIMIT', async (error, context) => {
    const { retryAfter = 60 } = context;
    
    logger.info(`Rate limited. Waiting ${retryAfter} seconds...`);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    
    return { waitedFor: retryAfter };
});

// Network error recovery
errorRecovery.registerStrategy('NETWORK_ERROR', async () => {
    // Wait for network to stabilize
    logger.info('Network error detected. Waiting for connection...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return { networkRestored: true };
});

module.exports = errorRecovery;
