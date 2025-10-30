/**
 * Event Integration for Webhook Manager
 * Connects system events to webhook dispatcher
 */

const webhookManager = require('./WebhookManager');
const logger = require('../utils/logger');

class EventIntegration {
    constructor(waClient) {
        this.waClient = waClient;
        this.initialized = false;
    }

    /**
     * Initialize event listeners
     */
    initialize() {
        if (this.initialized) {
            logger.warn('Event integration already initialized');
            return;
        }

        this.setupWhatsAppEvents();
        this.initialized = true;
        logger.info('Webhook event integration initialized');
    }

    /**
     * Setup WhatsApp client event listeners
     */
    setupWhatsAppEvents() {
        // Check if client is ready
        if (!this.waClient.isClientReady()) {
            logger.warn('WhatsApp client not ready yet, webhook listeners will be setup when client is ready');
            
            // Retry after a delay
            setTimeout(() => {
                if (this.waClient.isClientReady()) {
                    logger.info('WhatsApp client ready, setting up webhook event listeners');
                    this.setupWhatsAppEvents();
                }
            }, 5000); // Retry after 5 seconds
            
            return;
        }

        let client;
        try {
            client = this.waClient.getClient();
        } catch (error) {
            logger.error('Error getting WhatsApp client for webhooks:', error);
            return;
        }

        if (!client) {
            logger.warn('WhatsApp client not available for webhook integration');
            return;
        }

        // Message received
        client.on('message', async (message) => {
            try {
                await webhookManager.dispatch('message_received', {
                    id: message.id._serialized,
                    from: message.from,
                    to: message.to,
                    body: message.body,
                    type: message.type,
                    timestamp: message.timestamp,
                    hasMedia: message.hasMedia,
                    isForwarded: message.isForwarded,
                    fromMe: message.fromMe,
                });
            } catch (error) {
                logger.error('Error dispatching message_received webhook:', error);
            }
        });

        // Message sent (ACK)
        client.on('message_ack', async (message, ack) => {
            try {
                // Only dispatch on final delivery (ack = 3)
                if (ack === 3) {
                    await webhookManager.dispatch('message_sent', {
                        id: message.id._serialized,
                        to: message.to,
                        body: message.body,
                        ack: ack,
                        timestamp: message.timestamp,
                    });
                }
            } catch (error) {
                logger.error('Error dispatching message_sent webhook:', error);
            }
        });

        // Client ready
        client.on('ready', async () => {
            try {
                await webhookManager.dispatch('client_connected', {
                    status: 'ready',
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                logger.error('Error dispatching client_connected webhook:', error);
            }
        });

        // Client disconnected
        client.on('disconnected', async (reason) => {
            try {
                await webhookManager.dispatch('client_disconnected', {
                    status: 'disconnected',
                    reason: reason,
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                logger.error('Error dispatching client_disconnected webhook:', error);
            }
        });

        // QR Code
        client.on('qr', async (qr) => {
            try {
                await webhookManager.dispatch('session_qr', {
                    qr: qr,
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                logger.error('Error dispatching session_qr webhook:', error);
            }
        });

        logger.info('WhatsApp event listeners registered for webhooks');
    }

    /**
     * Dispatch campaign event
     */
    async dispatchCampaignEvent(eventType, data) {
        try {
            await webhookManager.dispatch(eventType, data);
        } catch (error) {
            logger.error(`Error dispatching ${eventType} webhook:`, error);
        }
    }

    /**
     * Dispatch smartbot event
     */
    async dispatchSmartbotEvent(data) {
        try {
            await webhookManager.dispatch('smartbot_reply', data);
        } catch (error) {
            logger.error('Error dispatching smartbot_reply webhook:', error);
        }
    }

    /**
     * Dispatch custom event
     */
    async dispatchCustomEvent(event, data) {
        try {
            await webhookManager.dispatch(event, data);
        } catch (error) {
            logger.error(`Error dispatching ${event} webhook:`, error);
        }
    }
}

module.exports = EventIntegration;
