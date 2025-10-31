/**
 * Models Index
 * Initialize all database models and their relationships
 */

const { sequelize, Sequelize } = require('../config/database');
const logger = require('../utils/logger');

// Import model definitions
const UserModel = require('./User');
const WhatsAppSessionModel = require('./WhatsAppSession');
const MessageModel = require('./Message');

// Initialize models
const User = UserModel(sequelize);
const WhatsAppSession = WhatsAppSessionModel(sequelize);
const Message = MessageModel(sequelize);

// Define relationships
// User has many WhatsApp Sessions
User.hasMany(WhatsAppSession, {
    foreignKey: 'user_id',
    as: 'sessions',
    onDelete: 'CASCADE'
});
WhatsAppSession.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// WhatsApp Session has many Messages
WhatsAppSession.hasMany(Message, {
    foreignKey: 'session_id',
    as: 'messages',
    onDelete: 'CASCADE'
});
Message.belongsTo(WhatsAppSession, {
    foreignKey: 'session_id',
    as: 'session'
});

// User has many Messages
User.hasMany(Message, {
    foreignKey: 'user_id',
    as: 'messages'
});
Message.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Export models and sequelize instance
const db = {
    sequelize,
    Sequelize,
    User,
    WhatsAppSession,
    Message
};

// Initialize database
async function initializeDatabase() {
    try {
        logger.info('🔄 Initializing database...');
        
        // Test connection
        await sequelize.authenticate();
        logger.info('✅ Database connection established');
        
        // Sync models (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        logger.info('✅ Database models synchronized');
        
        return true;
    } catch (error) {
        logger.error('❌ Database initialization failed:', error);
        throw error;
    }
}

db.initialize = initializeDatabase;

module.exports = db;
