/**
 * Database Manager Script
 * Easy CLI tool to manage database
 * 
 * Usage:
 *   node runtime/server/scripts/db-manager.js list-users
 *   node runtime/server/scripts/db-manager.js create-admin email@test.com password123 "Admin Name"
 *   node runtime/server/scripts/db-manager.js update-role email@test.com admin
 *   node runtime/server/scripts/db-manager.js delete-user email@test.com
 *   node runtime/server/scripts/db-manager.js show-stats
 */

require('dotenv').config();
const { User, WhatsAppSession, Message, Campaign, Recipient, Group } = require('../models');
const { sequelize } = require('../models');

const commands = {
    'list-users': listUsers,
    'create-admin': createAdmin,
    'create-user': createUser,
    'update-role': updateRole,
    'delete-user': deleteUser,
    'show-stats': showStats,
    'reset-password': resetPassword,
    'activate-user': activateUser,
    'deactivate-user': deactivateUser,
    'show-user': showUser,
};

async function listUsers() {
    const users = await User.findAll({
        attributes: ['id', 'email', 'name', 'role', 'is_active', 'created_at', 'last_login_at'],
        order: [['created_at', 'DESC']]
    });

    console.log('\n📋 Users List:\n');
    console.table(users.map(u => ({
        Email: u.email,
        Name: u.name,
        Role: u.role,
        Active: u.is_active ? '✅' : '❌',
        Created: u.created_at.toISOString().split('T')[0],
        'Last Login': u.last_login_at ? u.last_login_at.toISOString().split('T')[0] : 'Never'
    })));
}

async function createAdmin(email, password, name) {
    if (!email || !password || !name) {
        console.error('❌ Usage: create-admin <email> <password> <name>');
        return;
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
        console.error('❌ User already exists');
        return;
    }

    const password_hash = await User.hashPassword(password);
    const user = await User.create({
        email,
        password_hash,
        name,
        role: 'admin',
        is_active: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('👤 Name:', name);
    console.log('🔑 Password:', password);
    console.log('👑 Role: admin');
}

async function createUser(email, password, name, role = 'user') {
    if (!email || !password || !name) {
        console.error('❌ Usage: create-user <email> <password> <name> [role]');
        return;
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
        console.error('❌ User already exists');
        return;
    }

    const password_hash = await User.hashPassword(password);
    const user = await User.create({
        email,
        password_hash,
        name,
        role: role || 'user',
        is_active: true
    });

    console.log('✅ User created successfully!');
    console.log('📧 Email:', email);
    console.log('👤 Name:', name);
    console.log('🎭 Role:', role || 'user');
}

async function updateRole(email, newRole) {
    if (!email || !newRole) {
        console.error('❌ Usage: update-role <email> <admin|user|viewer>');
        return;
    }

    if (!['admin', 'user', 'viewer'].includes(newRole)) {
        console.error('❌ Role must be: admin, user, or viewer');
        return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        console.error('❌ User not found');
        return;
    }

    await user.update({ role: newRole });
    console.log(`✅ User role updated to: ${newRole}`);
}

async function deleteUser(email) {
    if (!email) {
        console.error('❌ Usage: delete-user <email>');
        return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        console.error('❌ User not found');
        return;
    }

    // Delete user's data
    await WhatsAppSession.destroy({ where: { user_id: user.id } });
    await Message.destroy({ where: { user_id: user.id } });
    await Campaign.destroy({ where: { user_id: user.id } });
    await Recipient.destroy({ where: { user_id: user.id } });
    await Group.destroy({ where: { user_id: user.id } });
    
    await user.destroy();
    console.log('✅ User and all associated data deleted');
}

async function showStats() {
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

    const usersByRole = await User.findAll({
        attributes: [
            'role',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['role']
    });

    console.log('\n📊 Database Statistics:\n');
    console.log('👥 Total Users:', userCount);
    console.log('📱 WhatsApp Sessions:', sessionCount);
    console.log('💬 Messages:', messageCount);
    console.log('📢 Campaigns:', campaignCount);
    console.log('📇 Recipients:', recipientCount);
    console.log('👨‍👩‍👧‍👦 Groups:', groupCount);
    
    console.log('\n👥 Users by Role:');
    usersByRole.forEach(r => {
        console.log(`  ${r.role}: ${r.dataValues.count}`);
    });
}

async function resetPassword(email, newPassword) {
    if (!email || !newPassword) {
        console.error('❌ Usage: reset-password <email> <new-password>');
        return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        console.error('❌ User not found');
        return;
    }

    const password_hash = await User.hashPassword(newPassword);
    await user.update({ password_hash });
    
    console.log('✅ Password reset successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 New Password:', newPassword);
}

async function activateUser(email) {
    if (!email) {
        console.error('❌ Usage: activate-user <email>');
        return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        console.error('❌ User not found');
        return;
    }

    await user.update({ is_active: true });
    console.log('✅ User activated');
}

async function deactivateUser(email) {
    if (!email) {
        console.error('❌ Usage: deactivate-user <email>');
        return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        console.error('❌ User not found');
        return;
    }

    await user.update({ is_active: false });
    console.log('✅ User deactivated');
}

async function showUser(email) {
    if (!email) {
        console.error('❌ Usage: show-user <email>');
        return;
    }

    const user = await User.findOne({ 
        where: { email },
        include: [
            { model: WhatsAppSession, as: 'sessions' },
            { model: Campaign, as: 'campaigns' }
        ]
    });

    if (!user) {
        console.error('❌ User not found');
        return;
    }

    console.log('\n👤 User Details:\n');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🎭 Role:', user.role);
    console.log('✅ Active:', user.is_active ? 'Yes' : 'No');
    console.log('📅 Created:', user.created_at);
    console.log('🕐 Last Login:', user.last_login_at || 'Never');
    console.log('📱 WhatsApp Sessions:', user.sessions?.length || 0);
    console.log('📢 Campaigns:', user.campaigns?.length || 0);
}

async function main() {
    const command = process.argv[2];
    const args = process.argv.slice(3);

    if (!command || !commands[command]) {
        console.log('\n🗄️  WaQtor Database Manager\n');
        console.log('Available commands:');
        console.log('  list-users                                    - List all users');
        console.log('  create-admin <email> <password> <name>       - Create admin user');
        console.log('  create-user <email> <password> <name> [role] - Create regular user');
        console.log('  update-role <email> <role>                   - Update user role');
        console.log('  delete-user <email>                          - Delete user and data');
        console.log('  show-stats                                   - Show database statistics');
        console.log('  reset-password <email> <new-password>        - Reset user password');
        console.log('  activate-user <email>                        - Activate user');
        console.log('  deactivate-user <email>                      - Deactivate user');
        console.log('  show-user <email>                            - Show user details');
        console.log('');
        process.exit(1);
    }

    try {
        await commands[command](...args);
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

main();
