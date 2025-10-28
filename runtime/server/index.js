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

const waClient = require('./waClient');
const logger = require('./utils/logger');
const { rateLimiter } = require('./middlewares/limiter');
const { apiKeyAuth } = require('./middlewares/auth');

// Routes
const messageRoutes = require('./routes/message');
const campaignRoutes = require('./routes/campaign');
const statusRoutes = require('./routes/status');
const testRoutes = require('./routes/test');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../config/.env') });

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

// Rate limiting
app.use('/api/', rateLimiter);

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
                delete: 'DELETE /api/campaigns/:id'
            },
            status: {
                client: 'GET /api/status/client',
                info: 'GET /api/status/info',
                logout: 'POST /api/status/logout',
                chats: 'GET /api/status/chats'
            }
        },
        authentication: 'All /api/* endpoints require X-API-Key header',
        documentation: 'See runtime/README.md for full API documentation'
    });
});

// API Routes (with authentication)
app.use('/api/messages', apiKeyAuth, messageRoutes);
app.use('/api/campaigns', apiKeyAuth, campaignRoutes);
app.use('/api/status', apiKeyAuth, statusRoutes);
app.use('/api/test', apiKeyAuth, testRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start Server
async function startServer() {
    try {
        // Initialize WhatsApp Client
        logger.info('Initializing WhatsApp Client...');
        await waClient.initialize();
        
        // Start Express Server
        app.listen(PORT, () => {
            logger.info(`🚀 Waqtor Server running on port ${PORT}`);
            logger.info(`📱 WhatsApp Client initialized and ready`);
            logger.info(`🌐 API available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful Shutdown
process.on('SIGINT', async () => {
    logger.info('Shutting down gracefully...');
    await waClient.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Shutting down gracefully...');
    await waClient.destroy();
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;
