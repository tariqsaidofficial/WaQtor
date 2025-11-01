#!/usr/bin/env node

/**
 * Check Users in Database
 * Verifies users are saved correctly in PostgreSQL
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import database configuration
const { sequelize } = require('./runtime/server/config/database');
const { DataTypes } = require('sequelize');

// User Model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'user', 'viewer'),
        defaultValue: 'user',
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_login_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

async function checkUsers() {
    try {
        console.log('='.repeat(80));
        console.log('🔍 Checking Users in PostgreSQL Database');
        console.log('='.repeat(80));
        
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL database');
        console.log('   Database:', process.env.DB_NAME || 'waqtor_dev');
        console.log('   Host:', process.env.DB_HOST || 'localhost');
        console.log('   Port:', process.env.DB_PORT || 5432);
        console.log('');
        
        // Get all users
        const users = await User.findAll({
            attributes: ['id', 'email', 'name', 'role', 'is_active', 'created_at', 'last_login_at'],
            order: [['created_at', 'DESC']]
        });
        
        if (users.length === 0) {
            console.log('⚠️  No users found in database');
            console.log('');
            console.log('To create a SuperAdmin account, run:');
            console.log('  node create_superadmin.js');
            console.log('='.repeat(80));
            process.exit(0);
        }
        
        console.log(`📊 Found ${users.length} user(s) in database:`);
        console.log('='.repeat(80));
        
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. ${user.name || 'No Name'}`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Active: ${user.is_active ? '✅ Yes' : '❌ No'}`);
            console.log(`   Created: ${user.created_at}`);
            console.log(`   Last Login: ${user.last_login_at || 'Never'}`);
        });
        
        console.log('\n' + '='.repeat(80));
        console.log('📈 Summary:');
        console.log(`   Total Users: ${users.length}`);
        console.log(`   Admins: ${users.filter(u => u.role === 'admin').length}`);
        console.log(`   Regular Users: ${users.filter(u => u.role === 'user').length}`);
        console.log(`   Viewers: ${users.filter(u => u.role === 'viewer').length}`);
        console.log(`   Active: ${users.filter(u => u.is_active).length}`);
        console.log(`   Inactive: ${users.filter(u => !u.is_active).length}`);
        console.log('='.repeat(80));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run
checkUsers();
