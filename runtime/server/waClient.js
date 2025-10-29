/**
 * WhatsApp Client Configuration
 * Wrapper for whatsapp-web.js
 */

const { Client, LocalAuth } = require('../../index');
const qrcode = require('qrcode-terminal');
const logger = require('./utils/logger');
const path = require('path');

class WhatsAppClient {
    constructor() {
        this.client = null;
        this.isReady = false;
        this.sessionPath = path.join(__dirname, 'session');
    }

    /**
     * Clean up lock files before initialization
     */
    cleanupLockFiles() {
        try {
            const fs = require('fs');
            const lockPaths = [
                path.join(this.sessionPath, 'SingletonLock'),
                path.join(this.sessionPath, 'SingletonCookie'),
                path.join(this.sessionPath, 'SingletonSocket')
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
     * Initialize WhatsApp Client
     */
    async initialize() {
        try {
            // Clean up any existing lock files
            this.cleanupLockFiles();
            
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

            this.setupEventHandlers();
            await this.client.initialize();
            
            return this.client;
        } catch (error) {
            logger.error('Failed to initialize WhatsApp client:', error);
            throw error;
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
            // You can add auto-reply logic here
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
     * Destroy Client
     */
    async destroy() {
        if (this.client) {
            await this.client.destroy();
            this.isReady = false;
            logger.info('WhatsApp client destroyed');
        }
    }
}

// Singleton instance
const waClientInstance = new WhatsAppClient();

module.exports = waClientInstance;
