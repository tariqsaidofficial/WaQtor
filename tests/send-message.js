#!/usr/bin/env node

/**
 * 📨 Send Message Example - Example for sending messages
 * 
 * Usage:
 * node send-message.js
 */

const { Client, LocalAuth } = require('./index');

const client = new Client({
    puppeteer: { 
        headless: false,
        executablePath: './chrome/mac_arm-141.0.7390.122/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
    }, 
    authStrategy: new LocalAuth()
});

// ========================================
// 🎯 Customize message and recipient here
// ========================================

// Option 1: Send to yourself (easiest for testing)
const SEND_TO_MYSELF = true;

// Option 2: Send to specific number (set SEND_TO_MYSELF to false)
const TARGET_CHAT_ID = '971561220147@c.us'; // Replace with desired number

// The message
const MESSAGE = `
🚀 *Message from Waqtor*

Hello! This is an automated message from the Waqtor automation system.

✅ System is working correctly
📅 Date: ${new Date().toLocaleString('en-US')}

_Waqtor - A new vector for intelligent communication._
`.trim();

// ========================================

console.log('\n📨 Waqtor - Send Message\n');

client.on('qr', () => {
    console.log('📱 Scan the QR Code from the browser window\n');
});

client.on('ready', async () => {
    console.log('✅ Waqtor is ready!\n');
    
    try {
        let chatId;
        
        if (SEND_TO_MYSELF) {
            chatId = client.info.wid._serialized;
            console.log('🎯 Target: Myself (for testing)');
        } else {
            chatId = TARGET_CHAT_ID;
            console.log(`🎯 Target: ${TARGET_CHAT_ID}`);
        }
        
        console.log(`📝 Message:\n${MESSAGE}\n`);
        console.log('📤 Sending...\n');
        
        await client.sendMessage(chatId, MESSAGE);
        
        console.log('✅ Sent successfully! 🎉\n');
        console.log('Open WhatsApp to verify 📱\n');
        
    } catch (error) {
        console.error('❌ Send error:', error.message, '\n');
    }
    
    console.log('🛑 Press Ctrl+C to exit\n');
});

client.initialize();

process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down...');
    await client.destroy();
    console.log('✅ Stopped successfully\n');
    process.exit(0);
});
