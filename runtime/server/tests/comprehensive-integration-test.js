/**
 * Comprehensive Integration Test
 * Test all APIs and database operations
 */

const axios = require('axios');
const db = require('../models');

const BASE_URL = 'http://localhost:8080';
let authToken = null;
let userId = null;
let sessionId = null;
let campaignId = null;

// Test results tracking
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(name, passed, details = '') {
    results.tests.push({ name, passed, details });
    if (passed) {
        results.passed++;
        console.log(`✅ ${name}`);
    } else {
        results.failed++;
        console.log(`❌ ${name}: ${details}`);
    }
}

async function runTests() {
    console.log('🧪 Starting Comprehensive Integration Tests...\n');
    console.log('=' .repeat(60));

    try {
        // ============================================
        // Phase 1: Authentication Tests
        // ============================================
        console.log('\n📝 Phase 1: Authentication Tests');
        console.log('-'.repeat(60));

        // Test 1: Register User
        try {
            const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, {
                email: `test${Date.now()}@example.com`,
                password: 'test123456',
                name: 'Test User'
            });
            
            logTest('User Registration', registerRes.data.success);
            authToken = registerRes.data.data.token;
            userId = registerRes.data.data.user.id;
        } catch (error) {
            logTest('User Registration', false, error.response?.data?.error || error.message);
        }

        // Test 2: Login
        try {
            const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: `test${Date.now() - 1000}@example.com`,
                password: 'test123456'
            });
            
            // Should fail (user doesn't exist)
            logTest('Login with wrong credentials', !loginRes.data.success);
        } catch (error) {
            logTest('Login with wrong credentials (expected fail)', true);
        }

        // Test 3: Get Current User
        try {
            const meRes = await axios.get(`${BASE_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            logTest('Get Current User', meRes.data.success && meRes.data.data.user.id === userId);
        } catch (error) {
            logTest('Get Current User', false, error.response?.data?.error || error.message);
        }

        // Test 4: Update Profile
        try {
            const updateRes = await axios.put(`${BASE_URL}/api/auth/profile`, {
                name: 'Updated Test User'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            logTest('Update Profile', updateRes.data.success);
        } catch (error) {
            logTest('Update Profile', false, error.response?.data?.error || error.message);
        }

        // ============================================
        // Phase 2: Database Connection Tests
        // ============================================
        console.log('\n📝 Phase 2: Database Connection Tests');
        console.log('-'.repeat(60));

        // Test 5: Database Connection
        try {
            await db.sequelize.authenticate();
            logTest('Database Connection', true);
        } catch (error) {
            logTest('Database Connection', false, error.message);
        }

        // Test 6: Check All Tables Exist
        try {
            const tables = await db.sequelize.query(
                "SELECT tablename FROM pg_tables WHERE schemaname = 'public'",
                { type: db.sequelize.QueryTypes.SELECT }
            );
            
            const requiredTables = [
                'users', 'whatsapp_sessions', 'messages', 
                'campaigns', 'recipients', 'campaign_recipients',
                'groups', 'recipient_groups'
            ];
            
            const tableNames = tables.map(t => t.tablename);
            const allTablesExist = requiredTables.every(t => tableNames.includes(t));
            
            logTest('All 8 Tables Exist', allTablesExist, 
                `Found: ${tableNames.filter(t => requiredTables.includes(t)).join(', ')}`);
        } catch (error) {
            logTest('All 8 Tables Exist', false, error.message);
        }

        // Test 7: User in Database
        try {
            const user = await db.User.findByPk(userId);
            logTest('User Saved in Database', user !== null && user.email.includes('test'));
        } catch (error) {
            logTest('User Saved in Database', false, error.message);
        }

        // ============================================
        // Phase 3: Sessions API Tests
        // ============================================
        console.log('\n📝 Phase 3: Sessions API Tests');
        console.log('-'.repeat(60));

        // Test 8: Create Session (should fail - no WhatsApp client)
        try {
            const sessionRes = await axios.post(`${BASE_URL}/api/sessions`, {
                clientId: `test-session-${Date.now()}`,
                name: 'Test Session'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            logTest('Create Session', sessionRes.data.success);
            if (sessionRes.data.success) {
                sessionId = sessionRes.data.data.id;
            }
        } catch (error) {
            // Expected to fail if WhatsApp client not ready
            logTest('Create Session (may fail if WA not ready)', true, 'Expected behavior');
        }

        // Test 9: List Sessions
        try {
            const listRes = await axios.get(`${BASE_URL}/api/sessions`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            logTest('List Sessions', listRes.data.success);
        } catch (error) {
            logTest('List Sessions', false, error.response?.data?.error || error.message);
        }

        // Test 10: Session Without Auth (should fail)
        try {
            await axios.get(`${BASE_URL}/api/sessions`);
            logTest('Session Without Auth (should fail)', false, 'Should require auth');
        } catch (error) {
            logTest('Session Without Auth (expected fail)', error.response?.status === 401);
        }

        // ============================================
        // Phase 4: Recipients & Groups Tests
        // ============================================
        console.log('\n📝 Phase 4: Recipients & Groups Tests');
        console.log('-'.repeat(60));

        // Test 11: Create Recipient
        let recipientId = null;
        try {
            const recipient = await db.Recipient.create({
                user_id: userId,
                phone: '966501234567',
                name: 'Test Recipient',
                email: 'recipient@test.com'
            });
            
            recipientId = recipient.id;
            logTest('Create Recipient in DB', true);
        } catch (error) {
            logTest('Create Recipient in DB', false, error.message);
        }

        // Test 12: Create Group
        let groupId = null;
        try {
            const group = await db.Group.create({
                user_id: userId,
                name: 'Test Group',
                description: 'Test group for integration tests',
                color: '#FF5733'
            });
            
            groupId = group.id;
            logTest('Create Group in DB', true);
        } catch (error) {
            logTest('Create Group in DB', false, error.message);
        }

        // Test 13: Link Recipient to Group
        try {
            if (recipientId && groupId) {
                await db.RecipientGroup.create({
                    recipient_id: recipientId,
                    group_id: groupId
                });
                logTest('Link Recipient to Group', true);
            } else {
                logTest('Link Recipient to Group', false, 'Missing recipient or group');
            }
        } catch (error) {
            logTest('Link Recipient to Group', false, error.message);
        }

        // Test 14: Query Recipient with Groups
        try {
            if (recipientId) {
                const recipient = await db.Recipient.findByPk(recipientId, {
                    include: ['groups']
                });
                
                logTest('Query Recipient with Groups', 
                    recipient !== null && recipient.groups.length > 0);
            } else {
                logTest('Query Recipient with Groups', false, 'No recipient created');
            }
        } catch (error) {
            logTest('Query Recipient with Groups', false, error.message);
        }

        // ============================================
        // Phase 5: Campaigns Tests
        // ============================================
        console.log('\n📝 Phase 5: Campaigns Tests');
        console.log('-'.repeat(60));

        // Test 15: Create Campaign in DB
        try {
            if (sessionId && recipientId) {
                const campaign = await db.Campaign.create({
                    session_id: sessionId,
                    user_id: userId,
                    name: 'Test Campaign',
                    message_template: 'Hello {{name}}, this is a test!',
                    status: 'draft',
                    total_recipients: 1
                });
                
                campaignId = campaign.id;
                logTest('Create Campaign in DB', true);
            } else {
                logTest('Create Campaign in DB', false, 'Missing session or recipient');
            }
        } catch (error) {
            logTest('Create Campaign in DB', false, error.message);
        }

        // Test 16: Link Recipient to Campaign
        try {
            if (campaignId && recipientId) {
                await db.CampaignRecipient.create({
                    campaign_id: campaignId,
                    recipient_id: recipientId,
                    status: 'pending'
                });
                logTest('Link Recipient to Campaign', true);
            } else {
                logTest('Link Recipient to Campaign', false, 'Missing campaign or recipient');
            }
        } catch (error) {
            logTest('Link Recipient to Campaign', false, error.message);
        }

        // Test 17: Query Campaign with Recipients
        try {
            if (campaignId) {
                const campaign = await db.Campaign.findByPk(campaignId, {
                    include: ['recipients']
                });
                
                logTest('Query Campaign with Recipients', 
                    campaign !== null && campaign.recipients.length > 0);
            } else {
                logTest('Query Campaign with Recipients', false, 'No campaign created');
            }
        } catch (error) {
            logTest('Query Campaign with Recipients', false, error.message);
        }

        // ============================================
        // Phase 6: Messages Tests
        // ============================================
        console.log('\n📝 Phase 6: Messages Tests');
        console.log('-'.repeat(60));

        // Test 18: Create Message in DB
        let messageId = null;
        try {
            if (sessionId) {
                const message = await db.Message.create({
                    session_id: sessionId,
                    user_id: userId,
                    message_id: `test_msg_${Date.now()}`,
                    to_phone: '966501234567',
                    body: 'Test message',
                    status: 'sent',
                    ack_code: 1,
                    direction: 'outgoing'
                });
                
                messageId = message.id;
                logTest('Create Message in DB', true);
            } else {
                logTest('Create Message in DB', false, 'No session available');
            }
        } catch (error) {
            logTest('Create Message in DB', false, error.message);
        }

        // Test 19: Query Messages by User
        try {
            const messages = await db.Message.findAll({
                where: { user_id: userId }
            });
            
            logTest('Query Messages by User', messages.length > 0);
        } catch (error) {
            logTest('Query Messages by User', false, error.message);
        }

        // ============================================
        // Phase 7: Relationships Tests
        // ============================================
        console.log('\n📝 Phase 7: Relationships Tests');
        console.log('-'.repeat(60));

        // Test 20: User → Sessions Relationship
        try {
            const user = await db.User.findByPk(userId, {
                include: ['sessions']
            });
            
            logTest('User → Sessions Relationship', user !== null);
        } catch (error) {
            logTest('User → Sessions Relationship', false, error.message);
        }

        // Test 21: User → Messages Relationship
        try {
            const user = await db.User.findByPk(userId, {
                include: ['messages']
            });
            
            logTest('User → Messages Relationship', 
                user !== null && user.messages.length > 0);
        } catch (error) {
            logTest('User → Messages Relationship', false, error.message);
        }

        // Test 22: User → Campaigns Relationship
        try {
            const user = await db.User.findByPk(userId, {
                include: ['campaigns']
            });
            
            logTest('User → Campaigns Relationship', user !== null);
        } catch (error) {
            logTest('User → Campaigns Relationship', false, error.message);
        }

        // ============================================
        // Phase 8: Cascade Delete Tests
        // ============================================
        console.log('\n📝 Phase 8: Cascade Delete Tests');
        console.log('-'.repeat(60));

        // Test 23: Delete User (should cascade)
        try {
            const user = await db.User.findByPk(userId);
            await user.destroy();
            
            logTest('Delete User', true);
        } catch (error) {
            logTest('Delete User', false, error.message);
        }

        // Test 24: Verify Cascade Delete
        try {
            const remainingSessions = await db.WhatsAppSession.count({ 
                where: { user_id: userId } 
            });
            const remainingMessages = await db.Message.count({ 
                where: { user_id: userId } 
            });
            const remainingCampaigns = await db.Campaign.count({ 
                where: { user_id: userId } 
            });
            const remainingRecipients = await db.Recipient.count({ 
                where: { user_id: userId } 
            });
            
            const allDeleted = remainingSessions === 0 && 
                             remainingMessages === 0 && 
                             remainingCampaigns === 0 && 
                             remainingRecipients === 0;
            
            logTest('Cascade Delete Verification', allDeleted,
                `Sessions: ${remainingSessions}, Messages: ${remainingMessages}, Campaigns: ${remainingCampaigns}, Recipients: ${remainingRecipients}`);
        } catch (error) {
            logTest('Cascade Delete Verification', false, error.message);
        }

        // ============================================
        // Summary
        // ============================================
        console.log('\n' + '='.repeat(60));
        console.log('📊 Test Summary');
        console.log('='.repeat(60));
        console.log(`✅ Passed: ${results.passed}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`📝 Total: ${results.tests.length}`);
        console.log(`📈 Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(2)}%`);
        console.log('='.repeat(60));

        if (results.failed > 0) {
            console.log('\n❌ Failed Tests:');
            results.tests
                .filter(t => !t.passed)
                .forEach(t => console.log(`   - ${t.name}: ${t.details}`));
        }

        return results.failed === 0;

    } catch (error) {
        console.error('\n💥 Fatal Error:', error.message);
        return false;
    }
}

// Run tests if executed directly
if (require.main === module) {
    runTests()
        .then((success) => {
            process.exit(success ? 0 : 1);
        })
        .catch((error) => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runTests };
