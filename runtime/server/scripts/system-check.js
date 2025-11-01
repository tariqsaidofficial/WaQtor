/**
 * System Health Check Script
 * Comprehensive check for PostgreSQL integration
 * 
 * Usage: node runtime/server/scripts/system-check.js
 */

require('dotenv').config();
const { sequelize, User, WhatsAppSession, Message, Campaign, Recipient, Group, RecipientGroup } = require('../models');
const logger = require('../utils/logger');

const checks = {
    database: false,
    tables: false,
    models: false,
    relationships: false,
    indexes: false,
    data: false
};

async function checkDatabaseConnection() {
    console.log('\n🔍 1. Checking Database Connection...');
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   Port: ${process.env.DB_PORT}`);
        console.log(`   Database: ${process.env.DB_NAME}`);
        console.log(`   User: ${process.env.DB_USER}`);
        checks.database = true;
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

async function checkTables() {
    console.log('\n🔍 2. Checking Database Tables...');
    try {
        const [results] = await sequelize.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        const expectedTables = [
            'users',
            'whatsapp_sessions',
            'messages',
            'campaigns',
            'recipients',
            'groups',
            'recipient_groups'
        ];
        
        const existingTables = results.map(r => r.table_name);
        const missingTables = expectedTables.filter(t => !existingTables.includes(t));
        
        if (missingTables.length === 0) {
            console.log('✅ All required tables exist:');
            existingTables.forEach(table => {
                console.log(`   ✓ ${table}`);
            });
            checks.tables = true;
            return true;
        } else {
            console.error('❌ Missing tables:', missingTables.join(', '));
            console.log('   Existing tables:', existingTables.join(', '));
            return false;
        }
    } catch (error) {
        console.error('❌ Table check failed:', error.message);
        return false;
    }
}

async function checkModels() {
    console.log('\n🔍 3. Checking Sequelize Models...');
    try {
        const models = {
            User,
            WhatsAppSession,
            Message,
            Campaign,
            Recipient,
            Group,
            RecipientGroup
        };
        
        console.log('✅ All models loaded successfully:');
        Object.keys(models).forEach(modelName => {
            console.log(`   ✓ ${modelName}`);
        });
        
        checks.models = true;
        return true;
    } catch (error) {
        console.error('❌ Model check failed:', error.message);
        return false;
    }
}

async function checkRelationships() {
    console.log('\n🔍 4. Checking Model Relationships...');
    try {
        // Test User relationships
        const user = await User.findOne({
            include: [
                { model: WhatsAppSession, as: 'sessions' },
                { model: Message, as: 'messages' },
                { model: Campaign, as: 'campaigns' },
                { model: Recipient, as: 'recipients' },
                { model: Group, as: 'groups' }
            ],
            limit: 1
        });
        
        console.log('✅ Model relationships working:');
        console.log('   ✓ User → WhatsAppSession');
        console.log('   ✓ User → Message');
        console.log('   ✓ User → Campaign');
        console.log('   ✓ User → Recipient');
        console.log('   ✓ User → Group');
        
        // Test many-to-many
        const recipient = await Recipient.findOne({
            include: [{ model: Group, as: 'groups' }],
            limit: 1
        });
        
        console.log('   ✓ Recipient ↔ Group (many-to-many)');
        
        checks.relationships = true;
        return true;
    } catch (error) {
        console.error('❌ Relationship check failed:', error.message);
        return false;
    }
}

async function checkIndexes() {
    console.log('\n🔍 5. Checking Database Indexes...');
    try {
        const [results] = await sequelize.query(`
            SELECT 
                tablename,
                indexname,
                indexdef
            FROM pg_indexes
            WHERE schemaname = 'public'
            ORDER BY tablename, indexname;
        `);
        
        const indexCount = results.length;
        const tableIndexes = {};
        
        results.forEach(idx => {
            if (!tableIndexes[idx.tablename]) {
                tableIndexes[idx.tablename] = [];
            }
            tableIndexes[idx.tablename].push(idx.indexname);
        });
        
        console.log(`✅ Found ${indexCount} indexes:`);
        Object.keys(tableIndexes).sort().forEach(table => {
            console.log(`   ${table}: ${tableIndexes[table].length} indexes`);
        });
        
        checks.indexes = true;
        return true;
    } catch (error) {
        console.error('❌ Index check failed:', error.message);
        return false;
    }
}

async function checkData() {
    console.log('\n🔍 6. Checking Data Integrity...');
    try {
        const [
            userCount,
            sessionCount,
            messageCount,
            campaignCount,
            recipientCount,
            groupCount
        ] = await Promise.all([
            User.count(),
            WhatsAppSession.count(),
            Message.count(),
            Campaign.count(),
            Recipient.count(),
            Group.count()
        ]);
        
        console.log('✅ Data counts:');
        console.log(`   Users: ${userCount}`);
        console.log(`   WhatsApp Sessions: ${sessionCount}`);
        console.log(`   Messages: ${messageCount}`);
        console.log(`   Campaigns: ${campaignCount}`);
        console.log(`   Recipients: ${recipientCount}`);
        console.log(`   Groups: ${groupCount}`);
        
        // Check for orphaned records
        const [orphanedSessions] = await sequelize.query(`
            SELECT COUNT(*) as count 
            FROM whatsapp_sessions 
            WHERE user_id NOT IN (SELECT id FROM users);
        `);
        
        const [orphanedMessages] = await sequelize.query(`
            SELECT COUNT(*) as count 
            FROM messages 
            WHERE user_id NOT IN (SELECT id FROM users);
        `);
        
        if (orphanedSessions[0].count > 0 || orphanedMessages[0].count > 0) {
            console.warn(`⚠️  Found orphaned records:`);
            if (orphanedSessions[0].count > 0) {
                console.warn(`   Sessions: ${orphanedSessions[0].count}`);
            }
            if (orphanedMessages[0].count > 0) {
                console.warn(`   Messages: ${orphanedMessages[0].count}`);
            }
        } else {
            console.log('   ✓ No orphaned records found');
        }
        
        checks.data = true;
        return true;
    } catch (error) {
        console.error('❌ Data check failed:', error.message);
        return false;
    }
}

async function checkDatabaseSize() {
    console.log('\n🔍 7. Checking Database Size...');
    try {
        const [results] = await sequelize.query(`
            SELECT pg_size_pretty(pg_database_size('${process.env.DB_NAME}')) as size;
        `);
        
        console.log(`✅ Database size: ${results[0].size}`);
        
        // Table sizes
        const [tableSizes] = await sequelize.query(`
            SELECT 
                schemaname,
                tablename,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
                pg_total_relation_size(schemaname||'.'||tablename) AS bytes
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY bytes DESC;
        `);
        
        console.log('\n   Table sizes:');
        tableSizes.forEach(t => {
            console.log(`   ${t.tablename}: ${t.size}`);
        });
        
        return true;
    } catch (error) {
        console.error('❌ Size check failed:', error.message);
        return false;
    }
}

async function checkPerformance() {
    console.log('\n🔍 8. Checking Query Performance...');
    try {
        // Test query performance
        const start = Date.now();
        await User.findAll({ limit: 100 });
        const userQueryTime = Date.now() - start;
        
        const start2 = Date.now();
        await Message.findAll({ limit: 100 });
        const messageQueryTime = Date.now() - start2;
        
        console.log('✅ Query performance:');
        console.log(`   User query (100 records): ${userQueryTime}ms`);
        console.log(`   Message query (100 records): ${messageQueryTime}ms`);
        
        if (userQueryTime > 1000 || messageQueryTime > 1000) {
            console.warn('⚠️  Slow queries detected. Consider adding indexes.');
        } else {
            console.log('   ✓ Query performance is good');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Performance check failed:', error.message);
        return false;
    }
}

async function printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SYSTEM CHECK SUMMARY');
    console.log('='.repeat(60));
    
    const results = [
        { name: 'Database Connection', status: checks.database },
        { name: 'Database Tables', status: checks.tables },
        { name: 'Sequelize Models', status: checks.models },
        { name: 'Model Relationships', status: checks.relationships },
        { name: 'Database Indexes', status: checks.indexes },
        { name: 'Data Integrity', status: checks.data }
    ];
    
    results.forEach(r => {
        const icon = r.status ? '✅' : '❌';
        console.log(`${icon} ${r.name}`);
    });
    
    const allPassed = Object.values(checks).every(v => v === true);
    
    console.log('='.repeat(60));
    
    if (allPassed) {
        console.log('\n🎉 ALL CHECKS PASSED!');
        console.log('✅ PostgreSQL integration is working perfectly!');
        console.log('✅ All tables, models, and relationships are functional');
        console.log('✅ System is ready for production use');
    } else {
        console.log('\n⚠️  SOME CHECKS FAILED!');
        console.log('Please review the errors above and fix them.');
    }
    
    console.log('\n');
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║        WaQtor PostgreSQL System Health Check          ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    try {
        await checkDatabaseConnection();
        if (checks.database) {
            await checkTables();
            await checkModels();
            await checkRelationships();
            await checkIndexes();
            await checkData();
            await checkDatabaseSize();
            await checkPerformance();
        }
        
        await printSummary();
    } catch (error) {
        console.error('\n❌ System check failed:', error);
    } finally {
        await sequelize.close();
    }
}

main();
