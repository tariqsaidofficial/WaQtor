/**
 * WebSocket Bridge Service
 * Real-time communication bridge for session state and events
 */

const WebSocket = require('ws');
const logger = require('../utils/logger');

class WebSocketBridge {
    constructor(server, sessionMonitor) {
        this.wss = null;
        this.server = server;
        this.sessionMonitor = sessionMonitor;
        this.clients = new Set();
        this.apiKey = process.env.API_KEY;
    }

    /**
     * Initialize WebSocket server
     */
    initialize() {
        try {
            this.wss = new WebSocket.Server({ 
                server: this.server,
                path: '/ws'
            });

            this.setupEventHandlers();
            
            // Connect to session monitor
            if (this.sessionMonitor) {
                this.sessionMonitor.setWebSocketBroadcast(
                    this.broadcast.bind(this)
                );
            }

            logger.info('WebSocket bridge initialized on path /ws');
        } catch (error) {
            logger.error('Failed to initialize WebSocket bridge:', error);
            throw error;
        }
    }

    /**
     * Setup WebSocket event handlers
     */
    setupEventHandlers() {
        this.wss.on('connection', (ws, req) => {
            logger.info(`WebSocket client connected from ${req.socket.remoteAddress}`);

            // Authentication check
            const apiKey = this.extractApiKey(req);
            if (!this.validateApiKey(apiKey)) {
                logger.warn('WebSocket connection rejected: Invalid API key');
                ws.close(1008, 'Invalid API key');
                return;
            }

            // Add to clients set
            this.clients.add(ws);
            
            // Mark as authenticated
            ws.isAuthenticated = true;

            // Send initial session state
            this.sendSessionState(ws);

            // Handle messages from client
            ws.on('message', (message) => {
                this.handleClientMessage(ws, message);
            });

            // Handle client disconnect
            ws.on('close', () => {
                this.clients.delete(ws);
                logger.info('WebSocket client disconnected');
            });

            // Handle errors
            ws.on('error', (error) => {
                logger.error('WebSocket client error:', error);
                this.clients.delete(ws);
            });

            // Send ping every 30 seconds to keep connection alive
            const pingInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.ping();
                } else {
                    clearInterval(pingInterval);
                }
            }, 30000);
        });

        this.wss.on('error', (error) => {
            logger.error('WebSocket server error:', error);
        });
    }

    /**
     * Extract API key from request
     */
    extractApiKey(req) {
        // Try header first
        const headerKey = req.headers['x-api-key'];
        if (headerKey) return headerKey;

        // Try query parameter
        try {
            const url = new URL(req.url, `ws://${req.headers.host}`);
            const apiKey = url.searchParams.get('apiKey');
            if (apiKey) return apiKey;
        } catch (error) {
            logger.debug('Error extracting API key from URL:', error.message);
        }

        // Fallback: try to parse query string manually
        if (req.url && req.url.includes('?')) {
            const queryString = req.url.split('?')[1];
            const params = new URLSearchParams(queryString);
            return params.get('apiKey');
        }

        return null;
    }

    /**
     * Validate API key
     */
    validateApiKey(key) {
        if (!key) return false;
        return key === this.apiKey;
    }

    /**
     * Handle incoming message from client
     */
    handleClientMessage(ws, message) {
        try {
            const data = JSON.parse(message);
            logger.debug('WebSocket message received:', data);

            switch (data.type) {
                case 'ping':
                    this.send(ws, { type: 'pong', timestamp: Date.now() });
                    break;

                case 'get_state':
                    this.sendSessionState(ws);
                    break;

                case 'get_qr':
                    this.sendQRCode(ws);
                    break;

                case 'subscribe':
                    // Subscribe to specific events
                    ws.subscriptions = data.events || ['all'];
                    this.send(ws, { 
                        type: 'subscribed', 
                        events: ws.subscriptions 
                    });
                    break;

                default:
                    this.send(ws, { 
                        type: 'error', 
                        message: 'Unknown message type' 
                    });
            }
        } catch (error) {
            logger.error('Error handling WebSocket message:', error);
            this.send(ws, { 
                type: 'error', 
                message: 'Invalid message format' 
            });
        }
    }

    /**
     * Send session state to a specific client
     */
    sendSessionState(ws) {
        if (this.sessionMonitor) {
            const state = this.sessionMonitor.getPublicState();
            this.send(ws, {
                type: 'session_state',
                data: state,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Send QR code to a specific client
     */
    sendQRCode(ws) {
        if (this.sessionMonitor) {
            const qrCode = this.sessionMonitor.getQRCode();
            this.send(ws, {
                type: 'qr_code',
                data: { qr: qrCode },
                timestamp: Date.now()
            });
        }
    }

    /**
     * Send message to a specific client
     */
    send(ws, data) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    /**
     * Broadcast message to all connected clients
     */
    broadcast(type, data) {
        const message = JSON.stringify({
            type,
            data,
            timestamp: Date.now()
        });

        let sent = 0;
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.isAuthenticated) {
                // Check if client is subscribed to this event
                if (!client.subscriptions || 
                    client.subscriptions.includes('all') || 
                    client.subscriptions.includes(type)) {
                    client.send(message);
                    sent++;
                }
            }
        });

        if (sent > 0) {
            logger.debug(`Broadcast sent to ${sent} clients: ${type}`);
        }
    }

    /**
     * Broadcast session update
     */
    broadcastSessionUpdate(state) {
        this.broadcast('session_update', state);
    }

    /**
     * Broadcast QR code
     */
    broadcastQRCode(qr) {
        this.broadcast('qr_code', { qr });
    }

    /**
     * Broadcast message event
     */
    broadcastMessage(messageData) {
        this.broadcast('message', messageData);
    }

    /**
     * Broadcast campaign event
     */
    broadcastCampaign(campaignData) {
        this.broadcast('campaign', campaignData);
    }

    /**
     * Get connected clients count
     */
    getClientCount() {
        return this.clients.size;
    }

    /**
     * Get clients info
     */
    getClientsInfo() {
        const clients = [];
        this.clients.forEach((client, index) => {
            clients.push({
                id: index + 1,
                readyState: this.getReadyStateString(client.readyState),
                authenticated: !!client.isAuthenticated,
                subscriptions: client.subscriptions || ['all']
            });
        });
        return clients;
    }

    /**
     * Get readable WebSocket state
     */
    getReadyStateString(state) {
        switch (state) {
            case WebSocket.CONNECTING: return 'CONNECTING';
            case WebSocket.OPEN: return 'OPEN';
            case WebSocket.CLOSING: return 'CLOSING';
            case WebSocket.CLOSED: return 'CLOSED';
            default: return 'UNKNOWN';
        }
    }

    /**
     * Close all connections
     */
    closeAll() {
        this.clients.forEach((client) => {
            client.close(1000, 'Server shutting down');
        });
        this.clients.clear();
        logger.info('All WebSocket connections closed');
    }

    /**
     * Shutdown WebSocket server
     */
    shutdown() {
        this.closeAll();
        if (this.wss) {
            this.wss.close(() => {
                logger.info('WebSocket server closed');
            });
        }
    }
}

module.exports = WebSocketBridge;
