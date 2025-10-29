/**
 * Session Monitor Service
 * Monitors WhatsApp client session state and stores it in database
 */

const logger = require('../utils/logger');
const db = require('../db/db');

class SessionMonitor {
    constructor(waClient) {
        this.waClient = waClient;
        this.currentState = {
            status: 'disconnected',
            ready: false,
            authenticated: false,
            qrCode: null,
            info: null,
            lastUpdate: null,
            uptime: 0,
            messagesSent: 0,
            messagesReceived: 0
        };
        this.startTime = Date.now();
        this.monitorInterval = null;
        this.websocketBroadcast = null;
    }

    /**
     * Initialize session monitoring
     */
    async initialize() {
        try {
            logger.info('Initializing session monitor...');
            
            // Create session_state table if it doesn't exist
            await this.createSessionTable();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start periodic monitoring
            this.startMonitoring();
            
            logger.info('Session monitor initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize session monitor:', error);
            throw error;
        }
    }

    /**
     * Create session_state table in database
     */
    async createSessionTable() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS session_state (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                status TEXT NOT NULL,
                ready BOOLEAN DEFAULT 0,
                authenticated BOOLEAN DEFAULT 0,
                qr_code TEXT,
                phone TEXT,
                pushname TEXT,
                platform TEXT,
                uptime INTEGER DEFAULT 0,
                messages_sent INTEGER DEFAULT 0,
                messages_received INTEGER DEFAULT 0,
                last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await db.run(createTableSQL);
        
        // Insert initial state if not exists
        await db.run(`
            INSERT OR IGNORE INTO session_state (id, status, ready, authenticated)
            VALUES (1, 'disconnected', 0, 0)
        `);
    }

    /**
     * Setup WhatsApp client event listeners
     */
    setupEventListeners() {
        // Try to get client, if not ready, wait for it
        const setupListeners = () => {
            const client = this.waClient.client;

            if (!client) {
                logger.warn('WhatsApp client not initialized yet, will retry in 2s');
                setTimeout(setupListeners, 2000);
                return;
            }

            logger.info('Setting up session monitor event listeners');

            // QR Code received
            client.on('qr', (qr) => {
                this.updateState({
                    status: 'qr',
                    ready: false,
                    authenticated: false,
                    qrCode: qr
                });
                logger.info('QR code received and stored');
                
                // Broadcast QR code separately
                if (this.websocketBroadcast) {
                    this.websocketBroadcast('qr_code', { qr });
                }
            });

            // Authenticated
            client.on('authenticated', () => {
                this.updateState({
                    status: 'authenticated',
                    authenticated: true,
                    qrCode: null
                });
                logger.info('Session authenticated');
            });

            // Authentication failure
            client.on('auth_failure', (msg) => {
                this.updateState({
                    status: 'auth_failure',
                    ready: false,
                    authenticated: false,
                    qrCode: null
                });
                logger.error('Authentication failed:', msg);
            });

            // Client ready
            client.on('ready', () => {
                const info = client.info;
                
                // Map platform codes to readable names
                const platformMap = {
                    'smba': 'WhatsApp Business (Android)',
                    'smbi': 'WhatsApp Business (iOS)',
                    'web': 'WhatsApp Web',
                    'android': 'WhatsApp (Android)',
                    'iphone': 'WhatsApp (iOS)',
                    'windows': 'WhatsApp (Windows)',
                    'mac': 'WhatsApp (Mac)'
                };
                
                const platformName = platformMap[info.platform] || info.platform || 'WhatsApp';
                
                this.updateState({
                    status: 'connected',
                    ready: true,
                    authenticated: true,
                    qrCode: null,
                    info: {
                        phone: info.wid.user,
                        pushname: info.pushname,
                        platform: platformName,
                        platformRaw: info.platform  // Keep original for debugging
                    }
                });
                logger.info(`Client is ready - Platform: ${platformName} (${info.platform})`);
            });

            // Message sent
            client.on('message_create', (message) => {
                if (message.fromMe) {
                    this.currentState.messagesSent++;
                    this.updateMessageCount('sent');
                }
            });

            // Message received
            client.on('message', (message) => {
                if (!message.fromMe) {
                    this.currentState.messagesReceived++;
                    this.updateMessageCount('received');
                }
            });

            // Disconnected
            client.on('disconnected', (reason) => {
                this.updateState({
                    status: 'disconnected',
                    ready: false,
                    authenticated: false,
                    qrCode: null
                });
                logger.warn('Client disconnected:', reason);
                
                // Auto-reconnect after 3 seconds
                logger.info('Scheduling auto-reconnect in 3 seconds...');
                setTimeout(async () => {
                    try {
                        logger.info('Attempting to reinitialize WhatsApp client...');
                        await client.initialize();
                    } catch (error) {
                        logger.error('Failed to reinitialize client:', error);
                    }
                }, 3000);
            });
        };

        setupListeners();
    }

    /**
     * Update current state and persist to database
     */
    async updateState(updates) {
        try {
            // Update in-memory state
            this.currentState = {
                ...this.currentState,
                ...updates,
                lastUpdate: new Date().toISOString()
            };

            // Update uptime
            this.currentState.uptime = Math.floor((Date.now() - this.startTime) / 1000);

            // Persist to database
            await this.saveStateToDatabase();

            // Broadcast to WebSocket clients (if connected)
            if (this.websocketBroadcast) {
                this.websocketBroadcast('session_update', this.getPublicState());
            }

            logger.debug('Session state updated:', this.currentState.status);
        } catch (error) {
            logger.error('Failed to update session state:', error);
        }
    }

    /**
     * Update message count in database
     */
    async updateMessageCount(type) {
        try {
            const column = type === 'sent' ? 'messages_sent' : 'messages_received';
            await db.run(`
                UPDATE session_state 
                SET ${column} = ${column} + 1, 
                    last_update = CURRENT_TIMESTAMP
                WHERE id = 1
            `);
            
            // Update last update time
            this.currentState.lastUpdate = new Date().toISOString();
            
            // Broadcast to WebSocket clients in real-time
            if (this.websocketBroadcast) {
                this.websocketBroadcast('session_update', this.getPublicState());
                logger.debug(`Message count updated (${type}): Broadcasting to clients`);
            }
        } catch (error) {
            logger.error('Failed to update message count:', error);
        }
    }

    /**
     * Save current state to database
     */
    async saveStateToDatabase() {
        try {
            const { status, ready, authenticated, qrCode, info, uptime, messagesSent, messagesReceived } = this.currentState;

            await db.run(`
                UPDATE session_state 
                SET status = ?,
                    ready = ?,
                    authenticated = ?,
                    qr_code = ?,
                    phone = ?,
                    pushname = ?,
                    platform = ?,
                    uptime = ?,
                    messages_sent = ?,
                    messages_received = ?,
                    last_update = CURRENT_TIMESTAMP
                WHERE id = 1
            `, [
                status,
                ready ? 1 : 0,
                authenticated ? 1 : 0,
                qrCode,
                info?.phone || null,
                info?.pushname || null,
                info?.platform || null,
                uptime,
                messagesSent,
                messagesReceived
            ]);
        } catch (error) {
            logger.error('Failed to save state to database:', error);
        }
    }

    /**
     * Load state from database
     */
    async loadStateFromDatabase() {
        try {
            const state = await db.get('SELECT * FROM session_state WHERE id = 1');
            
            if (state) {
                this.currentState = {
                    status: state.status,
                    ready: !!state.ready,
                    authenticated: !!state.authenticated,
                    qrCode: state.qr_code,
                    info: state.phone ? {
                        phone: state.phone,
                        pushname: state.pushname,
                        platform: state.platform
                    } : null,
                    uptime: state.uptime || 0,
                    messagesSent: state.messages_sent || 0,
                    messagesReceived: state.messages_received || 0,
                    lastUpdate: state.last_update
                };
            }
        } catch (error) {
            logger.error('Failed to load state from database:', error);
        }
    }

    /**
     * Start periodic monitoring
     */
    startMonitoring() {
        // Update state every 30 seconds
        this.monitorInterval = setInterval(() => {
            this.updateState({});
        }, 30000);

        logger.info('Session monitoring started (30s interval)');
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
            logger.info('Session monitoring stopped');
        }
    }

    /**
     * Get current state (public version without sensitive data)
     */
    getPublicState() {
        return {
            status: this.currentState.status,
            ready: this.currentState.ready,
            authenticated: this.currentState.authenticated,
            hasQR: !!this.currentState.qrCode,
            info: this.currentState.info ? {
                pushname: this.currentState.info.pushname,
                platform: this.currentState.info.platform,
                phoneMasked: this.currentState.info.phone 
                    ? `***${this.currentState.info.phone.slice(-4)}` 
                    : null
            } : null,
            uptime: this.currentState.uptime,
            stats: {
                messagesSent: this.currentState.messagesSent,
                messagesReceived: this.currentState.messagesReceived
            },
            lastUpdate: this.currentState.lastUpdate
        };
    }

    /**
     * Get QR code (for dashboard display)
     */
    getQRCode() {
        return this.currentState.qrCode;
    }

    /**
     * Set WebSocket broadcast function
     */
    setWebSocketBroadcast(broadcastFn) {
        this.websocketBroadcast = broadcastFn;
        logger.info('WebSocket broadcast connected to session monitor');
    }

    /**
     * Get full state (admin only)
     */
    getFullState() {
        return this.currentState;
    }

    /**
     * Reset statistics
     */
    async resetStats() {
        try {
            this.currentState.messagesSent = 0;
            this.currentState.messagesReceived = 0;
            this.startTime = Date.now();
            
            await db.run(`
                UPDATE session_state 
                SET messages_sent = 0,
                    messages_received = 0,
                    uptime = 0
                WHERE id = 1
            `);
            
            logger.info('Session statistics reset');
        } catch (error) {
            logger.error('Failed to reset statistics:', error);
        }
    }

    /**
     * Cleanup
     */
    async destroy() {
        this.stopMonitoring();
        logger.info('Session monitor destroyed');
    }
}

module.exports = SessionMonitor;
