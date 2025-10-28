#!/usr/bin/env node

/**
 * ⚡ Quick Test - Waqtor Quick Testing Script
 * 
 * Usage:
 * node quick-test.js
 */

const { Client, LocalAuth } = require('./index');

const client = new Client({
    puppeteer: { 
        headless: false,
        executablePath: './chrome/mac_arm-141.0.7390.122/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
    }, 
    authStrategy: new LocalAuth()
});

console.log('\n🚀 Waqtor Quick Test\n');

client.on('qr', () => {
    console.log('📱 Scan the QR Code from the browser window\n');
});

client.on('authenticated', () => {
    console.log('✅ Successfully connected!\n');
});

client.on('ready', async () => {
    console.log('═══════════════════════════════════════');
    console.log('✅ Waqtor is Ready!');
    console.log('═══════════════════════════════════════\n');
    
    // Account information
    const info = client.info;
    console.log('📊 Your Account Info:');
    console.log(`   👤 Name: ${info.pushname}`);
    console.log(`   📞 Number: ${info.wid.user}`);
    console.log(`   💻 Platform: ${info.platform}\n`);
    
    // Statistics
    const chats = await client.getChats();
    const contacts = await client.getContacts();
    
    console.log('📈 Statistics:');
    console.log(`   💬 Chats: ${chats.length}`);
    console.log(`   📇 Contacts: ${contacts.length}\n`);
    
    // Last 3 chats
    console.log('📝 Last 3 Chats:');
    chats.slice(0, 3).forEach((chat, i) => {
        console.log(`   ${i + 1}. ${chat.name}`);
        console.log(`      📌 ID: ${chat.id._serialized}`);
        console.log(`      ${chat.unreadCount > 0 ? '🔴' : '⚪'} Unread: ${chat.unreadCount}\n`);
    });
    
    console.log('═══════════════════════════════════════');
    console.log('🧪 Testing message sending...\n');
    
    // Send test message to yourself
    try {
        const myNumber = client.info.wid._serialized;
        
        await client.sendMessage(myNumber, 
            '🚀 *Waqtor Test Successful!*\n\n' +
            '✅ Application is working correctly\n' +
            `📅 ${new Date().toLocaleString('en-US')}\n\n` +
            '_Waqtor - A new vector for intelligent communication._'
        );
        
        console.log('✅ Test message sent to your account!');
        console.log('   Open WhatsApp and check the message 📱\n');
    } catch (error) {
        console.error('❌ Error:', error.message, '\n');
    }
    
    console.log('═══════════════════════════════════════');
    console.log('💡 Now you can:');
    console.log('   1. Open WhatsApp and check the message');
    console.log('   2. Send "!ping" from any chat');
    console.log('   3. Use npm run shell for manual testing');
    console.log('   4. Read TESTING.md for more examples\n');
    console.log('Press Ctrl+C to exit');
    console.log('═══════════════════════════════════════\n');
});

// Auto-reply to !ping
client.on('message', async (msg) => {
    if (msg.body === '!ping') {
        console.log('📨 Received !ping from', msg.from);
        await msg.reply('🏓 pong from Waqtor!');
        console.log('✅ Replied with pong\n');
    }
});

client.initialize();

process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down...');
    await client.destroy();
    console.log('✅ Stopped successfully\n');
    process.exit(0);
});
