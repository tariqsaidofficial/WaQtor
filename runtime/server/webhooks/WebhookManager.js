/**
 * Webhook Manager
 * Handles webhook dispatching with retry mechanism and HMAC signing
 */

const axios = require('axios');
const { generateSignature } = require('./signature');
const logger = require('../utils/logger');

class WebhookManager {
    constructor() {
        this.webhooks = new Map();
        this.logs = [];
        this.maxLogs = 1000; // Keep last 1000 webhook attempts
    }

    /**
     * Register a webhook
     */
    registerWebhook(config) {
        const webhook = {
            id: config.id || this.generateId(),
            url: config.url,
            events: config.events || [],
            secret: config.secret,
            enabled: config.enabled !== false,
            retryAttempts: config.retryAttempts || 3,
            retryDelay: config.retryDelay || 1000, // ms
            createdAt: new Date().toISOString(),
        };

        this.webhooks.set(webhook.id, webhook);
        logger.info(`Webhook registered: ${webhook.id} -> ${webhook.url}`);
        return webhook;
    }

    /**
     * Unregister a webhook
     */
    unregisterWebhook(id) {
        const deleted = this.webhooks.delete(id);
        if (deleted) {
            logger.info(`Webhook unregistered: ${id}`);
        }
        return deleted;
    }

    /**
     * Update webhook configuration
     */
    updateWebhook(id, updates) {
        const webhook = this.webhooks.get(id);
        if (!webhook) {
            return null;
        }

        Object.assign(webhook, updates);
        this.webhooks.set(id, webhook);
        logger.info(`Webhook updated: ${id}`);
        return webhook;
    }

    /**
     * Get all webhooks
     */
    getAllWebhooks() {
        return Array.from(this.webhooks.values());
    }

    /**
     * Get webhook by ID
     */
    getWebhook(id) {
        return this.webhooks.get(id);
    }

    /**
     * Dispatch event to all subscribed webhooks
     */
    async dispatch(event, data) {
        const webhooksToNotify = Array.from(this.webhooks.values()).filter(
            webhook => webhook.enabled && webhook.events.includes(event)
        );

        if (webhooksToNotify.length === 0) {
            return;
        }

        logger.info(`Dispatching webhook event: ${event} to ${webhooksToNotify.length} endpoints`);

        const promises = webhooksToNotify.map(webhook =>
            this.sendWebhook(webhook, event, data)
        );

        await Promise.allSettled(promises);
    }

    /**
     * Send webhook with retry mechanism
     */
    async sendWebhook(webhook, event, data, attempt = 1) {
        const payload = {
            event,
            timestamp: new Date().toISOString(),
            data,
        };

        const payloadString = JSON.stringify(payload);
        const signature = generateSignature(payloadString, webhook.secret);

        const logEntry = {
            id: this.generateId(),
            webhookId: webhook.id,
            event,
            url: webhook.url,
            attempt,
            timestamp: new Date().toISOString(),
            status: 'pending',
        };

        try {
            const startTime = Date.now();
            
            const response = await axios.post(webhook.url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-WaQtor-Signature': signature,
                    'X-WaQtor-Event': event,
                    'User-Agent': 'WaQtor-Webhook/1.0',
                },
                timeout: 10000, // 10 seconds
            });

            const duration = Date.now() - startTime;

            logEntry.status = 'success';
            logEntry.statusCode = response.status;
            logEntry.duration = duration;
            logEntry.response = response.data;

            logger.info(`Webhook sent successfully: ${webhook.url} (${duration}ms)`);
        } catch (error) {
            logEntry.status = 'failed';
            logEntry.statusCode = error.response?.status;
            logEntry.error = error.message;

            logger.error(`Webhook failed: ${webhook.url} - ${error.message}`);

            // Retry logic
            if (attempt < webhook.retryAttempts) {
                const delay = webhook.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
                logger.info(`Retrying webhook in ${delay}ms (attempt ${attempt + 1}/${webhook.retryAttempts})`);
                
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.sendWebhook(webhook, event, data, attempt + 1);
            } else {
                logEntry.status = 'failed_final';
                logger.error(`Webhook failed after ${attempt} attempts: ${webhook.url}`);
            }
        }

        // Store log
        this.addLog(logEntry);
    }

    /**
     * Add log entry
     */
    addLog(logEntry) {
        this.logs.unshift(logEntry);
        
        // Keep only last N logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }
    }

    /**
     * Get webhook logs
     */
    getLogs(filters = {}) {
        let logs = [...this.logs];

        if (filters.webhookId) {
            logs = logs.filter(log => log.webhookId === filters.webhookId);
        }

        if (filters.event) {
            logs = logs.filter(log => log.event === filters.event);
        }

        if (filters.status) {
            logs = logs.filter(log => log.status === filters.status);
        }

        if (filters.limit) {
            logs = logs.slice(0, filters.limit);
        }

        return logs;
    }

    /**
     * Get webhook statistics
     */
    getStats(webhookId = null) {
        const logs = webhookId 
            ? this.logs.filter(log => log.webhookId === webhookId)
            : this.logs;

        const total = logs.length;
        const success = logs.filter(log => log.status === 'success').length;
        const failed = logs.filter(log => log.status === 'failed_final').length;
        const pending = logs.filter(log => log.status === 'pending').length;

        const avgDuration = logs
            .filter(log => log.duration)
            .reduce((sum, log) => sum + log.duration, 0) / (success || 1);

        return {
            total,
            success,
            failed,
            pending,
            successRate: total > 0 ? (success / total * 100).toFixed(2) : 0,
            avgDuration: Math.round(avgDuration),
        };
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Clear all logs
     */
    clearLogs() {
        this.logs = [];
        logger.info('Webhook logs cleared');
    }
}

// Singleton instance
const webhookManager = new WebhookManager();

module.exports = webhookManager;
