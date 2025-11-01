/**
 * Create Admin User Script
 * Run: node runtime/server/scripts/create-admin.js
 */

const bcrypt = require('bcryptjs');
const { User } = require('../models');
const logger = require('../utils/logger');

async function createAdminUser() {
    try {
        logger.info('🔧 Creating admin user...');

        // Check if admin exists
        const existingAdmin = await User.findOne({
            where: { email: 'test@admin.com' }
        });

        if (existingAdmin) {
            logger.info('✅ Admin user already exists');
            logger.info(`   Email: ${existingAdmin.email}`);
            logger.info(`   Role: ${existingAdmin.role}`);
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash('admin123', 10);

        // Create admin user
        const admin = await User.create({
            email: 'test@admin.com',
            name: 'Admin User',
            password_hash: passwordHash,
            role: 'admin',
            is_active: true
        });

        logger.info('✅ Admin user created successfully!');
        logger.info(`   Email: ${admin.email}`);
        logger.info(`   Password: admin123`);
        logger.info(`   Role: ${admin.role}`);
        logger.info(`   ID: ${admin.id}`);

        process.exit(0);
    } catch (error) {
        logger.error('❌ Failed to create admin user:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    createAdminUser();
}

module.exports = createAdminUser;
