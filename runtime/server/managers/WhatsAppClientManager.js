/**
 * WhatsApp Client Manager
 * Manages multiple WhatsApp client instances
 */

const { Client, LocalAuth } = require('../../../index');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

class WhatsAppClientManager {
    constructor() {
        // Map of clientId => { client, isReady, config, events }
        this.clients = new Map();
        this.basePath = path.join(__dirname, '../sessions');
        
        // Ensure sessions directory exists
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
        
        logger.info('📱 WhatsAppClientManager initialized');
    }

    /**
     * Create a new WhatsApp client
     * @param {string} clientId - Unique identifier for the client
     * @param {object} config - Client configuration
     * @returns {Promise<object>} Client instance info
     */
    async createClient(clientId, config = {}) {
        try {
            // Validate clientId
            if (!clientId || typeof clientId !== 'string') {
                throw new Error('Invalid clientId');
            }

            // Check if client already exists
            if (this.clients.has(clientId)) {
                throw new Error(`Client ${clientId} already exists`);
            }

            logger.info(`📱 Creating new client: ${clientId}`);

            // Create session directory for this client
            const sessionPath = path.join(this.basePath, clientId);
            if (!fs.existsSync(sessionPath)) {
                fs.mkdirSync(sessionPath, { recursive: true });
            }

            // Clean up lock files
            this.cleanupLockFiles(sessionPath);

            // Create client instance
            const client = new Client({
                authStrategy: new LocalAuth({
                    clientId: clientId,
                    dataPath: sessionPath
                }),
                puppeteer: {
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--single-process',
                        '--disable-gpu',
                        '--disable-features=IsolateOrigins,site-per-process',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor'
                    ]
                }
            });

            // Store client info
            const clientInfo = {
                client,
                isReady: false,
                config: {
                    ...config,
                    createdAt: new Date().toISOString()
                },
                sessionPath,
                qr: null,
                info: null
            };

            this.clients.set(clientId, clientInfo);

            // Setup event handlers
            this.setupEventHandlers(clientId, client);

            // Initialize client
            await client.initialize();

            logger.info(`✅ Client ${clientId} created successfully`);

            return {
                clientId,
                status: 'initializing',
                createdAt: clientInfo.config.createdAt
            };

        } catch (error) {
            logger.error(`❌ Failed to create client ${clientId}:`, error);
            // Cleanup on failure
            this.clients.delete(clientId);
            throw error;
        }
    }

    /**
     * Setup event handlers for a client
     * @param {string} clientId 
     * @param {Client} client 
     */
    setupEventHandlers(clientId, client) {
        const clientInfo = this.clients.get(clientId);

        client.on('qr', (qr) => {
            logger.info(`📱 [${clientId}] QR Code received`);
            clientInfo.qr = qr;
            this.emit('qr', { clientId, qr });
        });

        client.on('authenticated', () => {
            logger.info(`✅ [${clientId}] Authenticated successfully`);
            this.emit('authenticated', { clientId });
        });

        client.on('auth_failure', (msg) => {
            logger.error(`❌ [${clientId}] Authentication failure:`, msg);
            this.emit('auth_failure', { clientId, message: msg });
        });

        client.on('ready', async () => {
            clientInfo.isReady = true;
            clientInfo.qr = null;
            
            // Get client info
            try {
                const info = client.info;
                clientInfo.info = {
                    phone: info.wid.user,
                    pushname: info.pushname,
                    platform: info.platform
                };
            } catch (error) {
                logger.warn(`⚠️ [${clientId}] Could not get client info:`, error.message);
            }

            logger.info(`✅ [${clientId}] Client is ready`);
            this.emit('ready', { clientId, info: clientInfo.info });
        });

        client.on('message', async (message) => {
            logger.info(`📩 [${clientId}] New message from ${message.from}`);
            this.emit('message', { clientId, message });
        });

        client.on('message_ack', (message, ack) => {
            this.emit('message_ack', { clientId, message, ack });
        });

        client.on('disconnected', (reason) => {
            clientInfo.isReady = false;
            logger.warn(`⚠️ [${clientId}] Disconnected:`, reason);
            this.emit('disconnected', { clientId, reason });
        });
    }

    /**
     * Get a client instance
     * @param {string} clientId 
     * @returns {Client} Client instance
     */
    getClient(clientId) {
        const clientInfo = this.clients.get(clientId);
        if (!clientInfo) {
            throw new Error(`Client ${clientId} not found`);
        }
        if (!clientInfo.isReady) {
            throw new Error(`Client ${clientId} is not ready`);
        }
        return clientInfo.client;
    }

    /**
     * Get client info
     * @param {string} clientId 
     * @returns {object} Client information
     */
    getClientInfo(clientId) {
        const clientInfo = this.clients.get(clientId);
        if (!clientInfo) {
            return null;
        }

        return {
            clientId,
            isReady: clientInfo.isReady,
            qr: clientInfo.qr,
            info: clientInfo.info,
            config: clientInfo.config
        };
    }

    /**
     * Get all clients
     * @returns {Array} List of all clients
     */
    getAllClients() {
        const clients = [];
        this.clients.forEach((clientInfo, clientId) => {
            clients.push({
                clientId,
                isReady: clientInfo.isReady,
                hasQR: !!clientInfo.qr,
                info: clientInfo.info,
                createdAt: clientInfo.config.createdAt
            });
        });
        return clients;
    }

    /**
     * Destroy a client
     * @param {string} clientId 
     */
    async destroyClient(clientId) {
        const clientInfo = this.clients.get(clientId);
        if (!clientInfo) {
            throw new Error(`Client ${clientId} not found`);
        }

        try {
            logger.info(`🗑️ Destroying client: ${clientId}`);
            
            if (clientInfo.client) {
                await clientInfo.client.destroy();
            }

            this.clients.delete(clientId);
            
            logger.info(`✅ Client ${clientId} destroyed`);
            this.emit('destroyed', { clientId });

        } catch (error) {
            logger.error(`❌ Failed to destroy client ${clientId}:`, error);
            throw error;
        }
    }

    /**
     * Restart a client
     * @param {string} clientId 
     */
    async restartClient(clientId) {
        const clientInfo = this.clients.get(clientId);
        if (!clientInfo) {
            throw new Error(`Client ${clientId} not found`);
        }

        logger.info(`🔄 Restarting client: ${clientId}`);

        const config = clientInfo.config;
        await this.destroyClient(clientId);
        await this.createClient(clientId, config);
    }

    /**
     * Clean up lock files
     * @param {string} sessionPath 
     */
    cleanupLockFiles(sessionPath) {
        try {
            const lockPaths = [
                path.join(sessionPath, 'SingletonLock'),
                path.join(sessionPath, 'SingletonCookie'),
                path.join(sessionPath, 'SingletonSocket')
            ];
            
            lockPaths.forEach(lockPath => {
                if (fs.existsSync(lockPath)) {
                    fs.unlinkSync(lockPath);
                    logger.info(`Removed lock file: ${lockPath}`);
                }
            });
        } catch (error) {
            logger.warn('Error cleaning lock files:', error.message);
        }
    }

    /**
     * Event emitter (to be connected to WebSocket bridge)
     */
    emit(event, data) {
        // This will be connected to WebSocket bridge
        if (this.eventHandler) {
            this.eventHandler(event, data);
        }
    }

    /**
     * Set event handler
     * @param {Function} handler 
     */
    setEventHandler(handler) {
        this.eventHandler = handler;
    }

    /**
     * Destroy all clients
     */
    async destroyAll() {
        logger.info('🗑️ Destroying all clients...');
        const promises = [];
        this.clients.forEach((_, clientId) => {
            promises.push(this.destroyClient(clientId));
        });
        await Promise.all(promises);
        logger.info('✅ All clients destroyed');
    }
}

// Singleton instance
const clientManager = new WhatsAppClientManager();

module.exports = clientManager;
