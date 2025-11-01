/**
 * Data Migration Script
 * Migrate existing data from old storage to PostgreSQL
 */

const db = require('../models');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Configuration
const OLD_DB_PATH = path.join(__dirname, '../../../db/waqtor.db');
const BACKUP_DIR = path.join(__dirname, '../../../backups');

/**
 * Create backup directory
 */
function ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        logger.info(`📁 Created backup directory: ${BACKUP_DIR}`);
    }
}

/**
 * Backup current PostgreSQL data
 */
async function backupPostgresData() {
    try {
        logger.info('📦 Creating backup of current PostgreSQL data...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_DIR, `postgres-backup-${timestamp}.json`);
        
        const data = {
            users: await db.User.findAll(),
            sessions: await db.WhatsAppSession.findAll(),
            messages: await db.Message.findAll(),
            campaigns: await db.Campaign.findAll(),
            recipients: await db.Recipient.findAll(),
            groups: await db.Group.findAll()
        };
        
        fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
        logger.info(`✅ Backup created: ${backupFile}`);
        
        return backupFile;
    } catch (error) {
        logger.error('❌ Backup failed:', error);
        throw error;
    }
}

/**
 * Check if old SQLite database exists
 */
function checkOldDatabase() {
    if (!fs.existsSync(OLD_DB_PATH)) {
        logger.warn(`⚠️ Old database not found at: ${OLD_DB_PATH}`);
        logger.info('ℹ️ If you have data to migrate, place waqtor.db in the db/ folder');
        return false;
    }
    return true;
}

/**
 * Migrate messages from old database
 * Note: This is a placeholder - actual implementation depends on old schema
 */
async function migrateMessages(userId, sessionId) {
    try {
        logger.info('📨 Migrating messages...');
        
        // Example: If you have old messages in JSON format
        const oldMessagesFile = path.join(__dirname, '../../../data/messages.json');
        
        if (!fs.existsSync(oldMessagesFile)) {
            logger.info('ℹ️ No old messages file found');
            return { migrated: 0, skipped: 0 };
        }
        
        const oldMessages = JSON.parse(fs.readFileSync(oldMessagesFile, 'utf8'));
        let migrated = 0;
        let skipped = 0;
        
        for (const msg of oldMessages) {
            try {
                // Check if message already exists
                const existing = await db.Message.findOne({
                    where: { message_id: msg.id || msg.messageId }
                });
                
                if (existing) {
                    skipped++;
                    continue;
                }
                
                await db.Message.create({
                    session_id: sessionId,
                    user_id: userId,
                    message_id: msg.id || msg.messageId,
                    to_phone: msg.to || msg.toPhone,
                    from_phone: msg.from || msg.fromPhone,
                    body: msg.body || msg.message,
                    status: msg.status || 'sent',
                    ack_code: msg.ack || 1,
                    direction: msg.direction || 'outgoing',
                    has_media: msg.hasMedia || false,
                    media_url: msg.mediaUrl || null,
                    created_at: msg.timestamp || msg.createdAt || new Date()
                });
                
                migrated++;
            } catch (error) {
                logger.error(`Error migrating message ${msg.id}:`, error.message);
                skipped++;
            }
        }
        
        logger.info(`✅ Messages migrated: ${migrated}, skipped: ${skipped}`);
        return { migrated, skipped };
        
    } catch (error) {
        logger.error('❌ Message migration failed:', error);
        return { migrated: 0, skipped: 0, error: error.message };
    }
}

/**
 * Migrate campaigns from old database
 */
async function migrateCampaigns(userId, sessionId) {
    try {
        logger.info('📋 Migrating campaigns...');
        
        const oldCampaignsFile = path.join(__dirname, '../../../data/campaigns.json');
        
        if (!fs.existsSync(oldCampaignsFile)) {
            logger.info('ℹ️ No old campaigns file found');
            return { migrated: 0, skipped: 0 };
        }
        
        const oldCampaigns = JSON.parse(fs.readFileSync(oldCampaignsFile, 'utf8'));
        let migrated = 0;
        let skipped = 0;
        
        for (const campaign of oldCampaigns) {
            try {
                // Check if campaign already exists
                const existing = await db.Campaign.findOne({
                    where: { name: campaign.name, user_id: userId }
                });
                
                if (existing) {
                    skipped++;
                    continue;
                }
                
                await db.Campaign.create({
                    session_id: sessionId,
                    user_id: userId,
                    name: campaign.name,
                    message_template: campaign.message || campaign.messageTemplate,
                    status: campaign.status || 'completed',
                    total_recipients: campaign.totalRecipients || 0,
                    sent_count: campaign.sentCount || 0,
                    delivered_count: campaign.deliveredCount || 0,
                    read_count: campaign.readCount || 0,
                    failed_count: campaign.failedCount || 0,
                    created_at: campaign.createdAt || new Date()
                });
                
                migrated++;
            } catch (error) {
                logger.error(`Error migrating campaign ${campaign.name}:`, error.message);
                skipped++;
            }
        }
        
        logger.info(`✅ Campaigns migrated: ${migrated}, skipped: ${skipped}`);
        return { migrated, skipped };
        
    } catch (error) {
        logger.error('❌ Campaign migration failed:', error);
        return { migrated: 0, skipped: 0, error: error.message };
    }
}

/**
 * Migrate recipients from old database
 */
async function migrateRecipients(userId) {
    try {
        logger.info('👥 Migrating recipients...');
        
        const oldRecipientsFile = path.join(__dirname, '../../../data/recipients.json');
        
        if (!fs.existsSync(oldRecipientsFile)) {
            logger.info('ℹ️ No old recipients file found');
            return { migrated: 0, skipped: 0 };
        }
        
        const oldRecipients = JSON.parse(fs.readFileSync(oldRecipientsFile, 'utf8'));
        let migrated = 0;
        let skipped = 0;
        
        for (const recipient of oldRecipients) {
            try {
                // Check if recipient already exists
                const existing = await db.Recipient.findOne({
                    where: { phone: recipient.phone, user_id: userId }
                });
                
                if (existing) {
                    skipped++;
                    continue;
                }
                
                await db.Recipient.create({
                    user_id: userId,
                    phone: recipient.phone,
                    name: recipient.name,
                    email: recipient.email,
                    company: recipient.company,
                    tags: recipient.tags || [],
                    custom_fields: recipient.customFields || {},
                    is_active: recipient.isActive !== false,
                    created_at: recipient.createdAt || new Date()
                });
                
                migrated++;
            } catch (error) {
                logger.error(`Error migrating recipient ${recipient.phone}:`, error.message);
                skipped++;
            }
        }
        
        logger.info(`✅ Recipients migrated: ${migrated}, skipped: ${skipped}`);
        return { migrated, skipped };
        
    } catch (error) {
        logger.error('❌ Recipient migration failed:', error);
        return { migrated: 0, skipped: 0, error: error.message };
    }
}

/**
 * Main migration function
 */
async function runMigration() {
    try {
        logger.info('🚀 Starting data migration...');
        logger.info('='.repeat(60));
        
        // Ensure backup directory exists
        ensureBackupDir();
        
        // Create backup of current data
        await backupPostgresData();
        
        // Check if old database exists
        const hasOldDb = checkOldDatabase();
        
        // Get or create default user for migration
        let user = await db.User.findOne({ where: { email: 'admin@waqtor.local' } });
        
        if (!user) {
            logger.info('👤 Creating default migration user...');
            user = await db.User.create({
                email: 'admin@waqtor.local',
                password_hash: '$2b$10$dummy.hash.for.migration.user',
                name: 'Migration User',
                role: 'admin'
            });
            logger.info('✅ Migration user created');
        }
        
        // Get or create default session
        let session = await db.WhatsAppSession.findOne({
            where: { user_id: user.id }
        });
        
        if (!session) {
            logger.info('📱 Creating default session for migration...');
            session = await db.WhatsAppSession.create({
                user_id: user.id,
                client_id: 'migration-session',
                name: 'Migration Session',
                is_active: true,
                is_ready: false
            });
            logger.info('✅ Migration session created');
        }
        
        // Run migrations
        const results = {
            messages: await migrateMessages(user.id, session.id),
            campaigns: await migrateCampaigns(user.id, session.id),
            recipients: await migrateRecipients(user.id)
        };
        
        // Summary
        logger.info('='.repeat(60));
        logger.info('📊 Migration Summary:');
        logger.info('='.repeat(60));
        logger.info(`Messages: ${results.messages.migrated} migrated, ${results.messages.skipped} skipped`);
        logger.info(`Campaigns: ${results.campaigns.migrated} migrated, ${results.campaigns.skipped} skipped`);
        logger.info(`Recipients: ${results.recipients.migrated} migrated, ${results.recipients.skipped} skipped`);
        logger.info('='.repeat(60));
        
        const totalMigrated = results.messages.migrated + 
                            results.campaigns.migrated + 
                            results.recipients.migrated;
        
        if (totalMigrated > 0) {
            logger.info(`✅ Migration completed successfully! Total: ${totalMigrated} records migrated`);
        } else {
            logger.info('ℹ️ No data to migrate or all data already exists');
        }
        
        logger.info('');
        logger.info('📝 Next steps:');
        logger.info('1. Review migrated data in PostgreSQL');
        logger.info('2. Update user credentials (email: admin@waqtor.local)');
        logger.info('3. Test all functionality');
        logger.info('4. Remove old database files if everything works');
        
        return results;
        
    } catch (error) {
        logger.error('💥 Migration failed:', error);
        throw error;
    }
}

/**
 * Verify migration
 */
async function verifyMigration() {
    try {
        logger.info('🔍 Verifying migration...');
        
        const counts = {
            users: await db.User.count(),
            sessions: await db.WhatsAppSession.count(),
            messages: await db.Message.count(),
            campaigns: await db.Campaign.count(),
            recipients: await db.Recipient.count(),
            groups: await db.Group.count()
        };
        
        logger.info('📊 Current database counts:');
        Object.entries(counts).forEach(([table, count]) => {
            logger.info(`   ${table}: ${count}`);
        });
        
        return counts;
    } catch (error) {
        logger.error('❌ Verification failed:', error);
        throw error;
    }
}

// Run migration if executed directly
if (require.main === module) {
    runMigration()
        .then(() => verifyMigration())
        .then(() => {
            logger.info('✅ All done!');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = {
    runMigration,
    verifyMigration,
    backupPostgresData
};
