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
const CampaignModel = require('./Campaign');
const RecipientModel = require('./Recipient');
const CampaignRecipientModel = require('./CampaignRecipient');
const GroupModel = require('./Group');
const RecipientGroupModel = require('./RecipientGroup');
const FeatureSubscriptionModel = require('./FeatureSubscription');
const AccessCodeModel = require('./AccessCode');
const FeatureAccessLogModel = require('./FeatureAccessLog');
const ApiKeyModel = require('./ApiKey');
const RefreshTokenModel = require('./RefreshToken');

// Initialize models
const User = UserModel(sequelize);
const WhatsAppSession = WhatsAppSessionModel(sequelize);
const Message = MessageModel(sequelize);
const Campaign = CampaignModel(sequelize);
const Recipient = RecipientModel(sequelize);
const CampaignRecipient = CampaignRecipientModel(sequelize);
const Group = GroupModel(sequelize);
const RecipientGroup = RecipientGroupModel(sequelize);
const FeatureSubscription = FeatureSubscriptionModel(sequelize);
const AccessCode = AccessCodeModel(sequelize);
const FeatureAccessLog = FeatureAccessLogModel(sequelize);
const ApiKey = ApiKeyModel(sequelize);
const RefreshToken = RefreshTokenModel(sequelize);

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

// User has many Campaigns
User.hasMany(Campaign, {
    foreignKey: 'user_id',
    as: 'campaigns',
    onDelete: 'CASCADE'
});
Campaign.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// WhatsApp Session has many Campaigns
WhatsAppSession.hasMany(Campaign, {
    foreignKey: 'session_id',
    as: 'campaigns',
    onDelete: 'CASCADE'
});
Campaign.belongsTo(WhatsAppSession, {
    foreignKey: 'session_id',
    as: 'session'
});

// User has many Recipients
User.hasMany(Recipient, {
    foreignKey: 'user_id',
    as: 'recipients',
    onDelete: 'CASCADE'
});
Recipient.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Campaign and Recipient many-to-many through CampaignRecipient
Campaign.belongsToMany(Recipient, {
    through: CampaignRecipient,
    foreignKey: 'campaign_id',
    otherKey: 'recipient_id',
    as: 'recipients'
});
Recipient.belongsToMany(Campaign, {
    through: CampaignRecipient,
    foreignKey: 'recipient_id',
    otherKey: 'campaign_id',
    as: 'campaigns'
});

// Direct associations for CampaignRecipient
Campaign.hasMany(CampaignRecipient, {
    foreignKey: 'campaign_id',
    as: 'campaignRecipients'
});
CampaignRecipient.belongsTo(Campaign, {
    foreignKey: 'campaign_id',
    as: 'campaign'
});

Recipient.hasMany(CampaignRecipient, {
    foreignKey: 'recipient_id',
    as: 'campaignRecipients'
});
CampaignRecipient.belongsTo(Recipient, {
    foreignKey: 'recipient_id',
    as: 'recipient'
});

// User has many Groups
User.hasMany(Group, {
    foreignKey: 'user_id',
    as: 'groups',
    onDelete: 'CASCADE'
});
Group.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Recipient and Group many-to-many through RecipientGroup
Recipient.belongsToMany(Group, {
    through: RecipientGroup,
    foreignKey: 'recipient_id',
    otherKey: 'group_id',
    as: 'groups'
});
Group.belongsToMany(Recipient, {
    through: RecipientGroup,
    foreignKey: 'group_id',
    otherKey: 'recipient_id',
    as: 'recipients'
});

// User has many Feature Subscriptions
User.hasMany(FeatureSubscription, {
    foreignKey: 'userId',
    as: 'subscriptions',
    onDelete: 'CASCADE'
});
FeatureSubscription.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User has many Feature Access Logs
User.hasMany(FeatureAccessLog, {
    foreignKey: 'userId',
    as: 'accessLogs'
});
FeatureAccessLog.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User (admin) creates Access Codes
User.hasMany(AccessCode, {
    foreignKey: 'createdBy',
    as: 'createdAccessCodes'
});
AccessCode.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
});

// User has many API Keys
User.hasMany(ApiKey, {
    foreignKey: 'userId',
    as: 'apiKeys',
    onDelete: 'CASCADE'
});
ApiKey.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User has many Refresh Tokens
User.hasMany(RefreshToken, {
    foreignKey: 'userId',
    as: 'refreshTokens',
    onDelete: 'CASCADE'
});
RefreshToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Export models and sequelize instance
const db = {
    sequelize,
    Sequelize,
    User,
    WhatsAppSession,
    Message,
    Campaign,
    Recipient,
    CampaignRecipient,
    Group,
    RecipientGroup,
    FeatureSubscription,
    AccessCode,
    FeatureAccessLog,
    ApiKey,
    RefreshToken
};

// Initialize database
async function initializeDatabase() {
    try {
        logger.info('🔄 Initializing database...');
        
        // Test connection
        await sequelize.authenticate();
        logger.info('✅ Database connection established');
        
        // Sync models (create tables if they don't exist)
        // Use force: false to avoid altering existing tables
        await sequelize.sync({ force: false });
        logger.info('✅ Database models synchronized');
        
        return true;
    } catch (error) {
        logger.error('❌ Database initialization failed:', error);
        throw error;
    }
}

db.initialize = initializeDatabase;

module.exports = db;
