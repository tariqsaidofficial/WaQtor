/**
 * Comprehensive Database Test
 * Test all models and relationships
 */

const db = require('../models');
const { User, WhatsAppSession, Message, Campaign, Recipient, CampaignRecipient } = db;

async function runTests() {
    console.log('🧪 Starting Database Tests...\n');

    try {
        // Test 1: Create User
        console.log('📝 Test 1: Creating test user...');
        const user = await User.create({
            email: 'test@example.com',
            password_hash: await User.hashPassword('password123'),
            name: 'Test User',
            role: 'user'
        });
        console.log('✅ User created:', user.email);

        // Test 2: Create WhatsApp Session
        console.log('\n📝 Test 2: Creating WhatsApp session...');
        const session = await WhatsAppSession.create({
            user_id: user.id,
            client_id: 'test-session-1',
            name: 'Test Session',
            is_active: true
        });
        console.log('✅ Session created:', session.client_id);

        // Test 3: Create Recipients
        console.log('\n📝 Test 3: Creating recipients...');
        const recipient1 = await Recipient.create({
            user_id: user.id,
            phone: '966501234567',
            name: 'Recipient 1',
            email: 'recipient1@example.com'
        });
        const recipient2 = await Recipient.create({
            user_id: user.id,
            phone: '966507654321',
            name: 'Recipient 2',
            custom_fields: { company: 'Test Corp', position: 'Manager' }
        });
        console.log('✅ Recipients created:', recipient1.phone, recipient2.phone);

        // Test 4: Create Campaign
        console.log('\n📝 Test 4: Creating campaign...');
        const campaign = await Campaign.create({
            session_id: session.id,
            user_id: user.id,
            name: 'Test Campaign',
            message_template: 'Hello {{name}}, this is a test message!',
            status: 'draft',
            total_recipients: 2
        });
        console.log('✅ Campaign created:', campaign.name);

        // Test 5: Link Recipients to Campaign
        console.log('\n📝 Test 5: Linking recipients to campaign...');
        await CampaignRecipient.create({
            campaign_id: campaign.id,
            recipient_id: recipient1.id,
            status: 'pending'
        });
        await CampaignRecipient.create({
            campaign_id: campaign.id,
            recipient_id: recipient2.id,
            status: 'pending'
        });
        console.log('✅ Recipients linked to campaign');

        // Test 6: Create Messages
        console.log('\n📝 Test 6: Creating messages...');
        const message1 = await Message.create({
            session_id: session.id,
            user_id: user.id,
            to_phone: recipient1.phone,
            body: 'Test message 1',
            status: 'sent',
            ack_code: 1
        });
        const message2 = await Message.create({
            session_id: session.id,
            user_id: user.id,
            to_phone: recipient2.phone,
            body: 'Test message 2',
            status: 'delivered',
            ack_code: 2
        });
        console.log('✅ Messages created:', message1.id, message2.id);

        // Test 7: Query with Relationships
        console.log('\n📝 Test 7: Testing relationships...');
        
        // Get user with sessions
        const userWithSessions = await User.findByPk(user.id, {
            include: ['sessions']
        });
        console.log('✅ User has', userWithSessions.sessions.length, 'session(s)');

        // Get campaign with recipients
        const campaignWithRecipients = await Campaign.findByPk(campaign.id, {
            include: ['recipients']
        });
        console.log('✅ Campaign has', campaignWithRecipients.recipients.length, 'recipient(s)');

        // Get session with messages
        const sessionWithMessages = await WhatsAppSession.findByPk(session.id, {
            include: ['messages']
        });
        console.log('✅ Session has', sessionWithMessages.messages.length, 'message(s)');

        // Test 8: Update Operations
        console.log('\n📝 Test 8: Testing updates...');
        await campaign.update({
            status: 'running',
            sent_count: 2,
            started_at: new Date()
        });
        console.log('✅ Campaign updated to running');

        await message1.update({
            status: 'read',
            ack_code: 3,
            read_at: new Date()
        });
        console.log('✅ Message updated to read');

        // Test 9: Complex Queries
        console.log('\n📝 Test 9: Testing complex queries...');
        
        // Get all messages for a user
        const userMessages = await Message.findAll({
            where: { user_id: user.id },
            include: ['session']
        });
        console.log('✅ Found', userMessages.length, 'messages for user');

        // Get all campaigns for a user
        const userCampaigns = await Campaign.findAll({
            where: { user_id: user.id },
            include: ['session', 'recipients']
        });
        console.log('✅ Found', userCampaigns.length, 'campaign(s) for user');

        // Test 10: Statistics
        console.log('\n📝 Test 10: Testing statistics...');
        const { Op } = require('sequelize');
        
        const sentMessages = await Message.count({
            where: {
                user_id: user.id,
                status: { [Op.in]: ['sent', 'delivered', 'read'] }
            }
        });
        console.log('✅ User has', sentMessages, 'sent message(s)');

        const activeRecipients = await Recipient.count({
            where: {
                user_id: user.id,
                is_active: true
            }
        });
        console.log('✅ User has', activeRecipients, 'active recipient(s)');

        // Test 11: Cleanup (Delete)
        console.log('\n📝 Test 11: Testing cascade delete...');
        await user.destroy();
        console.log('✅ User deleted (cascade should delete all related data)');

        // Verify cascade
        const remainingSessions = await WhatsAppSession.count({ where: { user_id: user.id } });
        const remainingMessages = await Message.count({ where: { user_id: user.id } });
        const remainingCampaigns = await Campaign.count({ where: { user_id: user.id } });
        const remainingRecipients = await Recipient.count({ where: { user_id: user.id } });

        console.log('✅ Remaining sessions:', remainingSessions, '(should be 0)');
        console.log('✅ Remaining messages:', remainingMessages, '(should be 0)');
        console.log('✅ Remaining campaigns:', remainingCampaigns, '(should be 0)');
        console.log('✅ Remaining recipients:', remainingRecipients, '(should be 0)');

        console.log('\n🎉 All tests passed successfully!');
        return true;

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        return false;
    }
}

// Run tests
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
