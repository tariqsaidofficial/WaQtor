#!/usr/bin/env node

/**
 * Create SuperAdmin User
 * Creates a superadmin account with full permissions
 */

const readline = require('readline');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import database configuration
const { sequelize } = require('./runtime/server/config/database');
const { DataTypes } = require('sequelize');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

async function createSuperAdmin() {
    try {
        console.log('='.repeat(80));
        console.log('🔐 Create SuperAdmin Account');
        console.log('='.repeat(80));
        
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL database');
        console.log('   Database:', process.env.DB_NAME || 'waqtor_dev');
        console.log('   Host:', process.env.DB_HOST || 'localhost');
        console.log('   Port:', process.env.DB_PORT || 5432);
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            where: { email: 'info@dxbmark.com' } 
        });
        
        if (existingUser) {
            console.log('\n⚠️  User already exists!');
            console.log('Email:', existingUser.email);
            console.log('Name:', existingUser.name);
            console.log('Role:', existingUser.role);
            console.log('Created:', existingUser.created_at);
            
            rl.question('\nDo you want to update the password? (yes/no): ', async (answer) => {
                if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                    rl.question('Enter new password: ', async (password) => {
                        if (!password || password.length < 6) {
                            console.log('❌ Password must be at least 6 characters');
                            rl.close();
                            process.exit(1);
                        }
                        
                        const salt = await bcrypt.genSalt(10);
                        const password_hash = await bcrypt.hash(password, salt);
                        
                        await existingUser.update({ 
                            password_hash,
                            name: 'Tariq Said',
                            role: 'admin',
                            is_active: true
                        });
                        
                        console.log('\n✅ SuperAdmin password updated successfully!');
                        console.log('Email:', existingUser.email);
                        console.log('Name:', existingUser.name);
                        console.log('Role:', existingUser.role);
                        
                        rl.close();
                        process.exit(0);
                    });
                } else {
                    console.log('❌ Operation cancelled');
                    rl.close();
                    process.exit(0);
                }
            });
        } else {
            // Create new user
            rl.question('\nEnter password for info@dxbmark.com: ', async (password) => {
                if (!password || password.length < 6) {
                    console.log('❌ Password must be at least 6 characters');
                    rl.close();
                    process.exit(1);
                }
                
                console.log('\n🔄 Creating SuperAdmin account...');
                
                const salt = await bcrypt.genSalt(10);
                const password_hash = await bcrypt.hash(password, salt);
                
                const user = await User.create({
                    email: 'info@dxbmark.com',
                    name: 'Tariq Said',
                    password_hash,
                    role: 'admin',
                    is_active: true
                });
                
                console.log('\n✅ SuperAdmin account created successfully!');
                console.log('='.repeat(80));
                console.log('Account Details:');
                console.log('  - ID:', user.id);
                console.log('  - Email:', user.email);
                console.log('  - Name:', user.name);
                console.log('  - Role:', user.role);
                console.log('  - Active:', user.is_active);
                console.log('  - Created:', user.created_at);
                console.log('='.repeat(80));
                console.log('\n🎉 You can now login with:');
                console.log('  Email: info@dxbmark.com');
                console.log('  Password: [the password you entered]');
                console.log('='.repeat(80));
                
                rl.close();
                process.exit(0);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        rl.close();
        process.exit(1);
    }
}

// Run
createSuperAdmin();
