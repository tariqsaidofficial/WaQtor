/**
 * Enhanced WhatsApp Client Event Handler
 * Wrapper layer to handle QR events without modifying src/Client.js
 */

const logger = require('../utils/logger');

class EnhancedWAClientHandler {
    constructor(waClient = null) {
        this.waClient = waClient;
        this.websocketBridge = null;
        this.qrAttempts = 0;
        this.maxQrAttempts = 5; // Changed to 5 as per requirements
        this.qrStartTime = null;
        // Track sent messages for status updates
        this.messageTracking = new Map(); // messageId -> { phone, timestamp, status }
    }

    /**
     * Initialize with waClient (if not provided in constructor)
     */
    initialize(waClient = null) {
        if (waClient) {
            this.waClient = waClient;
        }
        
        if (this.waClient) {
            this.setupEnhancedHandlers();
        }
        logger.info('🔧 Enhanced WA Client Handler initialized');
    }

    /**
     * Set WebSocket bridge reference
     */
    setWebSocketBridge(websocketBridge) {
        this.websocketBridge = websocketBridge;
        logger.info('🔗 WebSocket bridge connected to enhanced handler');
    }

    /**
     * Setup enhanced event handlers
     */
    setupEnhancedHandlers() {
        if (!this.waClient) {
            logger.error('❌ Cannot setup handlers - missing waClient');
            return;
        }

        // Try to get the actual client instance, but don't fail if not ready yet
        let client;
        try {
            client = this.waClient.getClient ? this.waClient.getClient() : this.waClient.client;
        } catch (error) {
            logger.warn('⚠️ Client not ready yet, will set up handlers when client is initialized');
            // Set up a listener for when the client becomes ready
            this.setupDeferredHandlers();
            return;
        }
        
        if (!client) {
            logger.warn('⚠️ Client not ready yet, will set up handlers when client is initialized');
            this.setupDeferredHandlers();
            return;
        }

        this.attachClientHandlers(client);
        logger.info('🎯 Enhanced event handlers set up successfully');
    }

    /**
     * Setup handlers that will be attached when client is ready
     */
    setupDeferredHandlers() {
        // Watch for client ready event on the waClient wrapper
        if (this.waClient.client) {
            // If client exists but not ready, wait for ready event
            this.waClient.client.once('ready', () => {
                logger.info('🔄 Client ready, setting up enhanced handlers...');
                this.attachClientHandlers(this.waClient.client);
            });
        }
    }

    /**
     * Attach handlers to the actual client
     */
    attachClientHandlers(client) {
        // Handle QR events with retry logic
        client.on('qr', (qr) => {
            this.handleQREvent(qr);
        });

        // Handle authentication events
        client.on('authenticated', () => {
            this.handleAuthenticated();
        });

        // Handle ready events
        client.on('ready', () => {
            this.handleReady();
        });

        // Handle disconnection
        client.on('disconnected', (reason) => {
            this.handleDisconnected(reason);
        });

        // Handle auth failure
        client.on('auth_failure', (message) => {
            this.handleAuthFailure(message);
        });

        // Handle message acknowledgment (delivery status)
        client.on('message_ack', (message, ack) => {
            this.handleMessageAck(message, ack);
        });

        // Handle message creation (sent messages)
        client.on('message_create', (message) => {
            this.handleMessageCreate(message);
        });

        logger.info('✅ Enhanced event handlers attached to client');
    }

    /**
     * Handle QR code generation with enhanced tracking
     */
    handleQREvent(qr) {
        this.qrAttempts++;
        
        if (!this.qrStartTime) {
            this.qrStartTime = Date.now();
        }

        logger.info(`📱 QR generated - Attempt ${this.qrAttempts}/${this.maxQrAttempts}`);

        // Check if max attempts reached
        if (this.qrAttempts >= this.maxQrAttempts) {
            this.handleQRMaxRetries();
            return;
        }

        // Send enhanced QR event with attempt info
        if (this.websocketBridge) {
            this.websocketBridge.broadcast({
                type: 'qr',
                data: qr,
                attempt: this.qrAttempts,
                maxAttempts: this.maxQrAttempts,
                timeRemaining: 20, // 20 seconds per QR
                timestamp: Date.now()
            });
        } else {
            logger.warn('⚠️ WebSocket bridge not available for QR broadcast');
        }
    }

    /**
     * Handle max QR retries reached
     */
    handleQRMaxRetries() {
        logger.warn('🔄 QR max retries reached');
        
        if (this.websocketBridge) {
            this.websocketBridge.broadcast({
                type: 'qr_max_retries',
                message: 'QR scan timeout after 5 attempts - Click to refresh session',
                canRetry: true,
                totalTime: Math.round((Date.now() - this.qrStartTime) / 1000),
                attempts: this.qrAttempts,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Handle successful authentication
     */
    handleAuthenticated() {
        logger.info('✅ WhatsApp authenticated successfully');
        this.resetQRAttempts();

        if (this.websocketBridge) {
            this.websocketBridge.broadcast({
                type: 'session_authenticated',
                message: 'WhatsApp session authenticated successfully',
                timestamp: Date.now()
            });
        }
    }

    /**
     * Handle client ready
     */
    handleReady() {
        logger.info('🚀 WhatsApp client is ready');
        this.resetQRAttempts();

        if (this.websocketBridge) {
            this.websocketBridge.broadcast({
                type: 'client_ready',
                message: 'WhatsApp client is ready for use',
                timestamp: Date.now()
            });
        }
    }

    /**
     * Handle disconnection
     */
    handleDisconnected(reason) {
        logger.warn('⚠️ WhatsApp client disconnected:', reason);

        if (this.websocketBridge) {
            this.websocketBridge.broadcast({
                type: 'client_disconnected',
                reason: reason,
                message: 'WhatsApp client has been disconnected',
                timestamp: Date.now()
            });
        }
    }

    /**
     * Handle authentication failure
     */
    handleAuthFailure(message) {
        logger.error('❌ WhatsApp authentication failed:', message);
        this.resetQRAttempts();

        if (this.websocketBridge) {
            this.websocketBridge.broadcast({
                type: 'auth_failure',
                message: message || 'Authentication failed',
                timestamp: Date.now()
            });
        }
    }

    /**
     * Reset QR attempt counters
     */
    resetQRAttempts() {
        this.qrAttempts = 0;
        this.qrStartTime = null;
        logger.info('🔄 QR attempt counters reset');
    }

    /**
     * Handle session refresh request
     */
    async handleSessionRefresh() {
        try {
            logger.info('🔄 Handling session refresh request');
            this.resetQRAttempts();

            if (this.waClient) {
                // Try to get the client and logout
                let client;
                try {
                    client = this.waClient.getClient ? this.waClient.getClient() : this.waClient.client;
                } catch (error) {
                    logger.warn('⚠️ Could not get client for logout, proceeding with reinitialize');
                }

                if (client && typeof client.logout === 'function') {
                    await client.logout();
                }
                
                // Wait a bit then reinitialize
                setTimeout(() => {
                    if (this.waClient && typeof this.waClient.initialize === 'function') {
                        this.waClient.initialize();
                    }
                }, 2000);
            }

            return { success: true, message: 'Session refresh initiated' };
        } catch (error) {
            logger.error('❌ Session refresh failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Track a sent message
     */
    trackMessage(messageId, phone) {
        this.messageTracking.set(messageId, {
            phone: phone,
            timestamp: Date.now(),
            status: 'sent'
        });
        
        // Auto-cleanup after 24 hours
        setTimeout(() => {
            this.messageTracking.delete(messageId);
        }, 24 * 60 * 60 * 1000);
        
        console.log('\n🔵 ========== MESSAGE TRACKING START ==========');
        console.log('📝 Tracking message:', {
            messageId: messageId,
            phone: phone,
            timestamp: new Date().toISOString(),
            totalTracked: this.messageTracking.size
        });
        console.log('🔵 ========== MESSAGE TRACKING END ==========\n');
        
        logger.info(`📝 Tracking message: ${messageId} to ${phone}`);
    }

    /**
     * Handle message acknowledgment (delivery status)
     * ACK values: 0 = pending, 1 = sent, 2 = delivered, 3 = read, 4 = played
     */
    handleMessageAck(message, ack) {
        const ackStatus = {
            '-1': 'failed',
            0: 'pending',
            1: 'sent',
            2: 'delivered',
            3: 'read',
            4: 'played'
        };

        const status = ackStatus[ack] || ackStatus[String(ack)] || 'unknown';
        const messageId = message.id._serialized;
        
        console.log('\n🟢 ========== MESSAGE ACK RECEIVED ==========');
        console.log('📨 Message ACK Details:', {
            messageId: messageId,
            status: status,
            ackCode: ack,
            to: message.to,
            from: message.from,
            timestamp: new Date().toISOString(),
            isTracked: this.messageTracking.has(messageId)
        });
        
        // Update tracking
        if (this.messageTracking.has(messageId)) {
            const tracking = this.messageTracking.get(messageId);
            const oldStatus = tracking.status;
            tracking.status = status;
            console.log('✅ Tracking Updated:', {
                phone: tracking.phone,
                oldStatus: oldStatus,
                newStatus: status
            });
        } else {
            console.log('⚠️ Message NOT in tracking map!');
            console.log('📋 Current tracking map size:', this.messageTracking.size);
        }

        // Broadcast to WebSocket clients
        const ackData = {
            messageId: messageId,
            status: status,
            ackCode: ack,
            timestamp: Date.now(),
            to: message.to,
            from: message.from
        };
        
        console.log('📡 Broadcasting to WebSocket:', { type: 'message_ack', data: ackData });
        
        if (this.websocketBridge) {
            this.websocketBridge.broadcast('message_ack', ackData);
            console.log('✅ Broadcast sent successfully');
        } else {
            console.log('❌ WebSocket bridge not available!');
        }
        
        console.log('🟢 ========== MESSAGE ACK END ==========\n');
        
        logger.info(`📨 Message ACK: ${messageId} - Status: ${status} (${ack})`);
    }

    /**
     * Handle message creation (sent messages)
     */
    handleMessageCreate(message) {
        // Only track messages sent by us
        if (message.fromMe) {
            console.log('\n🟡 ========== MESSAGE CREATE EVENT ==========');
            console.log('📤 Message Created:', {
                messageId: message.id._serialized,
                to: message.to,
                body: message.body?.substring(0, 50) + '...',
                hasMedia: message.hasMedia,
                timestamp: new Date().toISOString()
            });

            if (this.websocketBridge) {
                const broadcastData = {
                    type: 'message_sent',
                    data: {
                        messageId: message.id._serialized,
                        to: message.to,
                        body: message.body,
                        hasMedia: message.hasMedia,
                        timestamp: Date.now()
                    }
                };
                console.log('📡 Broadcasting message_sent:', broadcastData);
                this.websocketBridge.broadcast(broadcastData);
            }
            
            console.log('🟡 ========== MESSAGE CREATE END ==========\n');
            
            logger.info(`📤 Message created: ${message.id._serialized} to ${message.to}`);
        }
    }

    /**
     * Get current QR statistics
     */
    getQRStats() {
        return {
            attempts: this.qrAttempts,
            maxAttempts: this.maxQrAttempts,
            startTime: this.qrStartTime,
            isExpired: this.qrAttempts >= this.maxQrAttempts,
            timeElapsed: this.qrStartTime ? Date.now() - this.qrStartTime : 0
        };
    }

    /**
     * Destroy handler and clean up
     */
    destroy() {
        this.resetQRAttempts();
        this.waClient = null;
        this.websocketBridge = null;
        logger.info('🧹 Enhanced WA Client Handler destroyed');
    }
}

// Export the class for instantiation
module.exports = EnhancedWAClientHandler;
