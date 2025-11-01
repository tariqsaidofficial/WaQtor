/**
 * WhatsApp Client Configuration
 * Wrapper for whatsapp-web.js
 */

const { Client, LocalAuth } = require('../../index');
const qrcode = require('qrcode-terminal');
const logger = require('./utils/logger');
const path = require('path');
const BrowserProcessManager = require('./utils/browserProcessManager');

class WhatsAppClient {
    constructor() {
        this.client = null;
        this.isReady = false;
        this.sessionPath = path.join(__dirname, 'session');
        this.browserManager = new BrowserProcessManager(this.sessionPath);
        this.isInitializing = false;
    }

    /**
     * Clean up lock files and orphaned processes before initialization
     */
    async cleanupBeforeInit() {
        try {
            logger.info('Performing pre-initialization cleanup...');
            
            // Use the comprehensive browser process manager
            const success = await this.browserManager.fullCleanup();
            
            if (!success) {
                logger.warn('Full cleanup had issues, attempting emergency cleanup...');
                await this.browserManager.emergencyCleanup();
            }
            
            return true;
        } catch (error) {
            logger.error('Error during pre-initialization cleanup:', error.message);
            return false;
        }
    }

    /**
     * Initialize WhatsApp Client with robust error handling
     */
    async initialize() {
        // Prevent multiple simultaneous initializations
        if (this.isInitializing) {
            logger.warn('Initialization already in progress, waiting...');
            // Wait for current initialization to complete
            while (this.isInitializing) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            return this.client;
        }

        this.isInitializing = true;

        try {
            // Step 1: Comprehensive cleanup before initialization
            await this.cleanupBeforeInit();
            
            // Step 2: Create client instance
            this.client = new Client({
                authStrategy: new LocalAuth({
                    dataPath: this.sessionPath
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

            // Step 3: Setup event handlers
            this.setupEventHandlers();
            
            // Step 4: Initialize with timeout
            logger.info('Initializing WhatsApp client...');
            await this.client.initialize();
            
            logger.info('✅ WhatsApp client initialized successfully');
            return this.client;
        } catch (error) {
            logger.error('Failed to initialize WhatsApp client:', error);
            
            // If initialization fails due to browser lock, try emergency cleanup
            if (error.message && error.message.includes('browser is already running')) {
                logger.error('Browser lock detected! Attempting emergency cleanup...');
                await this.browserManager.emergencyCleanup();
                
                // Optionally, you could retry initialization here
                logger.info('Emergency cleanup completed. Please restart the server.');
            }
            
            throw error;
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Setup Event Handlers
     */
    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            logger.info('QR Code received. Scan with WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        this.client.on('authenticated', () => {
            logger.info('✅ WhatsApp authenticated successfully');
        });

        this.client.on('auth_failure', (msg) => {
            logger.error('❌ Authentication failure:', msg);
        });

        this.client.on('ready', () => {
            this.isReady = true;
            logger.info('✅ WhatsApp client is ready');
        });

        this.client.on('message', async (message) => {
            logger.info(`📩 New message from ${message.from}: ${message.body}`);
            
            // Handle interactive bot responses
            if (message.body && message.from.endsWith('@c.us')) {
                try {
                    const interactiveBotService = require('./services/interactiveBotService');
                    await interactiveBotService.handleTextResponse(this.client, message);
                } catch (error) {
                    logger.error('Error handling interactive response:', error);
                }
            }
        });

        this.client.on('disconnected', (reason) => {
            this.isReady = false;
            logger.warn('⚠️ WhatsApp client disconnected:', reason);
        });
    }

    /**
     * Get Client Instance
     */
    getClient() {
        if (!this.isReady) {
            throw new Error('WhatsApp client is not ready');
        }
        return this.client;
    }

    /**
     * Check if Client is Ready
     */
    isClientReady() {
        return this.isReady;
    }

    /**
     * Destroy Client with comprehensive cleanup
     */
    async destroy() {
        try {
            if (this.client) {
                logger.info('Destroying WhatsApp client...');
                await this.client.destroy();
                this.isReady = false;
                logger.info('WhatsApp client destroyed');
            }
            
            // Perform cleanup after destroy
            logger.info('Performing post-destroy cleanup...');
            await this.browserManager.fullCleanup();
            
        } catch (error) {
            logger.error('Error during client destruction:', error);
            
            // Force cleanup even if destroy fails
            logger.warn('Forcing emergency cleanup...');
            await this.browserManager.emergencyCleanup();
        }
    }
}

// Singleton instance
const waClientInstance = new WhatsAppClient();

module.exports = waClientInstance;
