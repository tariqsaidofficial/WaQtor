#!/usr/bin/env node

/**
 * Create Default Access Codes
 * Creates the default access code 330022 for all premium features
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const db = require('../models');
const { getDefaultAccessCode } = require('../config/secrets');

// Get encrypted default code
const DEFAULT_CODE = getDefaultAccessCode();

const FEATURES = [
    'Campaigns',
    'Reports',
    'Interactive Messages',
    'SmartBot',
    'Webhooks',
    'Admin Statistics',
    'Admin Logs'
];

async function createDefaultAccessCodes() {
    try {
        console.log('🔐 Creating default access codes...\n');

        // Initialize database
        await db.initialize();

        const codeHash = db.AccessCode.hashCode(DEFAULT_CODE);

        for (const featureName of FEATURES) {
            // Check if code already exists for this feature
            const existing = await db.AccessCode.findOne({
                where: {
                    codeHash,
                    featureName
                }
            });

            if (existing) {
                console.log(`⏭️  Code already exists for: ${featureName}`);
                continue;
            }

            // Create access code
            await db.AccessCode.create({
                featureName,
                codeHash,
                subscriptionType: 'lifetime',
                durationDays: null, // Lifetime
                maxUses: null, // Unlimited uses
                expiresAt: null, // Never expires
                isActive: true,
                metadata: {
                    isDefault: true,
                    createdBy: 'system'
                }
            });

            console.log(`✅ Created access code for: ${featureName}`);
        }

        console.log('\n🎉 Default access codes created successfully!');
        console.log(`\n📝 Default Access Code: ${DEFAULT_CODE}`);
        console.log('   - Type: Lifetime');
        console.log('   - Max Uses: Unlimited');
        console.log('   - Expires: Never');
        console.log(`   - Features: ${FEATURES.length}`);

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating access codes:', error);
        process.exit(1);
    }
}

// Run the script
createDefaultAccessCodes();
