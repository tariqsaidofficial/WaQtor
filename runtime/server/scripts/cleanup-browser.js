#!/usr/bin/env node

/**
 * Browser Cleanup Script
 * Kills orphaned Chrome/Chromium processes and removes lock files
 * Run this before starting the server if you encounter browser lock issues
 */

const path = require('path');
const BrowserProcessManager = require('../utils/browserProcessManager');
const logger = require('../utils/logger');

async function cleanup() {
    console.log('🧹 Starting browser cleanup...\n');
    
    const sessionPath = path.join(__dirname, '../session');
    const browserManager = new BrowserProcessManager(sessionPath);
    
    try {
        // Check if browser is running
        const isRunning = await browserManager.isBrowserRunning();
        
        if (isRunning) {
            console.log('⚠️  Found running browser processes');
        } else {
            console.log('✅ No running browser processes detected');
        }
        
        // Perform full cleanup
        console.log('\n🔧 Performing cleanup...');
        const success = await browserManager.fullCleanup();
        
        if (success) {
            console.log('\n✅ Cleanup completed successfully!');
            console.log('You can now start the server safely.\n');
            process.exit(0);
        } else {
            console.log('\n⚠️  Cleanup had some issues, trying emergency cleanup...');
            const emergencySuccess = await browserManager.emergencyCleanup();
            
            if (emergencySuccess) {
                console.log('\n✅ Emergency cleanup completed!');
                console.log('You can now start the server safely.\n');
                process.exit(0);
            } else {
                console.log('\n❌ Emergency cleanup failed!');
                console.log('You may need to manually kill Chrome processes or restart your system.\n');
                process.exit(1);
            }
        }
    } catch (error) {
        console.error('\n❌ Error during cleanup:', error.message);
        console.log('\nTry running with sudo/admin privileges or manually kill Chrome processes.\n');
        process.exit(1);
    }
}

// Run cleanup
cleanup();
