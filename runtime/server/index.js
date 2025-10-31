/**
 * Waqtor Server - Main Entry Point
 * REST API Server for WhatsApp Automation
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

const waClient = require('./waClient');
const logger = require('./utils/logger');
const { rateLimiter } = require('./middlewares/limiter');
const { apiKeyAuth } = require('./middlewares/auth');
const { 
    errorHandler, 
    notFoundHandler, 
    handleUnhandledRejection, 
    handleUncaughtException 
} = require('./middleware/errorHandler');

// Bull Board for Queue Monitoring
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

// Services
const SessionMonitor = require('./services/sessionMonitor');
const WebSocketBridge = require('./services/websocketBridge');
const EnhancedWAClientHandler = require('./services/enhancedWAClientHandler');
const SmartBotService = require('./services/smartbotService');
const errorMonitor = require('./services/errorMonitor');
const EventIntegration = require('./webhooks/eventIntegration');

// Database
const db = require('./models');

// Routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const campaignRoutes = require('./routes/campaign');
const statusRoutes = require('./routes/status');
const testRoutes = require('./routes/test');
const sessionRoutes = require('./routes/session');
const sessionsRoutes = require('./routes/sessions'); // Multiple sessions management
const errorRoutes = require('./routes/errors');
const queueRoutes = require('./routes/queue');
const smartbotRoutes = require('./routes/smartbot');
const reportsRoutes = require('./routes/reports');
const interactiveRoutes = require('./routes/interactive');
const notificationRoutes = require('./routes/notifications');
const webhookRoutes = require('./routes/webhooks');

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// Initialize services
let sessionMonitor = null;
let websocketBridge = null;
let enhancedWAClientHandler = null;
let smartbotService = null;
let eventIntegration = null;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

// Rate limiting
app.use('/api/', rateLimiter);

// Setup Bull Board for Queue Monitoring
const { messageQueue } = require('./queue/messageQueue');
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullAdapter(messageQueue)],
    serverAdapter: serverAdapter,
});

// Bull Board UI (requires authentication)
app.use('/admin/queues', apiKeyAuth, serverAdapter.getRouter());

// Health check (no auth required)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Waqtor API',
        version: '1.34.1'
    });
});

// API Root - Show available endpoints
app.get('/api', (req, res) => {
    res.json({
        message: 'Waqtor REST API',
        version: '1.34.1',
        endpoints: {
            health: 'GET /health (no auth)',
            messages: {
                sendText: 'POST /api/messages/send-text',
                sendMedia: 'POST /api/messages/send-media',
                sendBulk: 'POST /api/messages/send-bulk'
            },
            campaigns: {
                create: 'POST /api/campaigns/create',
                list: 'GET /api/campaigns/list',
                get: 'GET /api/campaigns/:id',
                updateStatus: 'PUT /api/campaigns/:id/status',
                delete: 'DELETE /api/campaigns/:id',
                execute: 'POST /api/campaigns/:id/execute'
            },
            status: {
                client: 'GET /api/status/client',
                info: 'GET /api/status/info',
                logout: 'POST /api/status/logout',
                chats: 'GET /api/status/chats',
                version: 'GET /api/status/version'
            },
            session: {
                state: 'GET /api/session/state',
                qr: 'GET /api/session/qr',
                websocketInfo: 'GET /api/session/websocket/info',
                resetStats: 'POST /api/session/stats/reset'
            },
            test: {
                info: 'GET /api/test/info',
                send: 'POST /api/test/send'
            }
        },
        websocket: {
            endpoint: 'ws://localhost:' + (process.env.PORT || 8080) + '/ws',
            authentication: 'Required - use ?apiKey=YOUR_API_KEY',
            info: 'GET /api/session/websocket/info for details'
        },
        authentication: 'All /api/* endpoints require X-API-Key header',
        documentation: 'See docs/api-reference.md for full API documentation'
    });
});

// Public routes (no auth required)
app.use('/api/auth', authRoutes);

// API Routes (with authentication)
app.use('/api/messages', apiKeyAuth, messageRoutes);
app.use('/api/campaigns', apiKeyAuth, campaignRoutes);
app.use('/api/status', apiKeyAuth, statusRoutes);
app.use('/api/test', apiKeyAuth, testRoutes);
app.use('/api/session', apiKeyAuth, sessionRoutes.router);
app.use('/api/sessions', apiKeyAuth, sessionsRoutes); // Multiple sessions management
app.use('/api/errors', apiKeyAuth, errorRoutes);
app.use('/api/queue', apiKeyAuth, queueRoutes);
app.use('/api/interactive', apiKeyAuth, interactiveRoutes);
app.use('/api/smartbot', apiKeyAuth, smartbotRoutes.router);
app.use('/api/reports', apiKeyAuth, reportsRoutes);
app.use('/api/notifications', apiKeyAuth, notificationRoutes);
app.use('/api/webhooks', apiKeyAuth, webhookRoutes);

// Quick send message endpoint (for compatibility)
app.post('/api/sendMessage', apiKeyAuth, async (req, res) => {
    try {
        const { chatId, message } = req.body;
        if (!chatId || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: chatId and message'
            });
        }

        const client = waClient.getClient();
        const sentMessage = await client.sendMessage(chatId, message);

        logger.info(`Message sent to ${chatId}`);
        res.json({
            success: true,
            message: 'Message sent successfully',
            data: {
                id: sentMessage.id._serialized,
                timestamp: sentMessage.timestamp
            }
        });
    } catch (error) {
        logger.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message',
            message: error.message
        });
    }
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Setup global error handlers
handleUnhandledRejection();
handleUncaughtException();

// Start Server
async function startServer() {
    try {
        logger.info('Starting Waqtor Server...');

        // Initialize Database
        logger.info('Initializing database...');
        await db.initialize();
        
        // Initialize WhatsApp Client (legacy - single client)
        logger.info('Initializing WhatsApp client...');
        await waClient.initialize();
        
        // Initialize Client Manager (for multiple accounts support)
        logger.info('Initializing Client Manager for multiple accounts...');
        require('./managers/WhatsAppClientManager');
        logger.info('✅ Client Manager ready for multiple accounts');

        // Initialize Session Monitor
        logger.info('Initializing session monitor...');
        sessionMonitor = new SessionMonitor(waClient);
        await sessionMonitor.initialize();

        // Initialize WebSocket Bridge
        logger.info('Initializing WebSocket bridge...');
        websocketBridge = new WebSocketBridge(server, sessionMonitor);
        websocketBridge.initialize();

        // Connect WebSocket to notification routes
        notificationRoutes.setWebSocketBridge(websocketBridge);
        logger.info('WebSocket bridge connected to notification routes');

        // Initialize Enhanced WA Client Handler
        logger.info('Initializing enhanced WhatsApp client handler...');
        enhancedWAClientHandler = new EnhancedWAClientHandler();
        enhancedWAClientHandler.initialize(waClient);

        // Connect enhanced handler to WebSocket bridge
        enhancedWAClientHandler.setWebSocketBridge(websocketBridge);

        // Set enhanced handler in message routes for tracking
        messageRoutes.setEnhancedHandler(enhancedWAClientHandler);

        // Initialize session routes with services
        sessionRoutes.initializeRoutes(sessionMonitor, websocketBridge, enhancedWAClientHandler);

        // Initialize SmartBot Service
        logger.info('Initializing SmartBot service...');
        smartbotService = new SmartBotService(waClient);
        await smartbotService.initialize();
        
        // Initialize SmartBot routes storage
        await smartbotRoutes.initializeRulesStorage();
        
        // Make smartbotService available to routes
        app.set('smartbotService', smartbotService);
        logger.info('SmartBot service initialized');

        // Initialize Webhook Event Integration
        logger.info('Initializing webhook event integration...');
        eventIntegration = new EventIntegration(waClient);
        eventIntegration.initialize();
        logger.info('Webhook event integration initialized');

        // Initialize Message Queue Processor
        logger.info('Initializing message queue processor...');
        const { initializeProcessor } = require('./queue/messageProcessor');
        initializeProcessor();
        logger.info('Message queue processor initialized');

        // Start error monitoring
        logger.info('Starting error monitoring...');
        errorMonitor.start();

        // Setup error monitor alerts
        errorMonitor.on('critical', (alert) => {
            logger.error('CRITICAL ERROR RATE:', alert);
            // Future: Send alerts via email/Slack/etc.
        });

        errorMonitor.on('warning', (alert) => {
            logger.warn('HIGH ERROR RATE:', alert);
        });

        // Start HTTP Server
        server.listen(PORT, () => {
            logger.info(`🚀 Waqtor Server running on port ${PORT}`);
            logger.info(`� REST API: http://localhost:${PORT}/api`);
            logger.info(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
            logger.info(`� Health Check: http://localhost:${PORT}/health`);
            logger.info('✅ Server is ready to accept requests');
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful Shutdown
process.on('SIGINT', async () => {
    logger.info('Shutting down gracefully...');
    
    // Stop error monitoring
    if (errorMonitor) {
        errorMonitor.stop();
    }
    
    // Close WebSocket connections
    if (websocketBridge) {
        websocketBridge.shutdown();
    }
    
    // Stop enhanced handler
    if (enhancedWAClientHandler) {
        enhancedWAClientHandler.destroy();
    }
    
    // Stop SmartBot service
    if (smartbotService) {
        smartbotService.destroy();
    }
    
    // Stop session monitor
    if (sessionMonitor) {
        await sessionMonitor.destroy();
    }
    
    // Destroy WhatsApp client
    await waClient.destroy();
    
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Shutting down gracefully...');
    
    // Stop error monitoring
    if (errorMonitor) {
        errorMonitor.stop();
    }
    
    // Close WebSocket connections
    if (websocketBridge) {
        websocketBridge.shutdown();
    }
    
    // Stop enhanced handler
    if (enhancedWAClientHandler) {
        enhancedWAClientHandler.destroy();
    }
    
    // Stop SmartBot service
    if (smartbotService) {
        smartbotService.destroy();
    }
    
    // Stop session monitor
    if (sessionMonitor) {
        await sessionMonitor.destroy();
    }
    
    // Destroy WhatsApp client
    await waClient.destroy();
    
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;
