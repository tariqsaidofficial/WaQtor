/**
 * Waqtor Test Script
 * Quick test for Waqtor features
 */

const { Client, LocalAuth } = require('./index');

const client = new Client({
    puppeteer: { 
        headless: false,
        executablePath: './chrome/mac_arm-141.0.7390.122/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
    }, 
    authStrategy: new LocalAuth()
});

console.log('🚀 Waqtor Test - Initializing...');
console.log('═══════════════════════════════════════════════════════════');

client.on('qr', () => {
    console.log('📱 QR Code:');
    console.log('   Open WhatsApp > Linked Devices > Link a Device');
    console.log('   Scan the QR Code from the browser window');
    console.log('═══════════════════════════════════════════════════════════');
});

client.on('authenticated', () => {
    console.log('✅ Successfully authenticated!');
});

client.on('ready', async () => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Waqtor is Ready!');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Get account information
    const info = client.info;
    console.log('📊 Account Information:');
    console.log(`   Name: ${info.pushname}`);
    console.log(`   Number: ${info.wid.user}`);
    console.log(`   Platform: ${info.platform}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Get contacts
    const contacts = await client.getContacts();
    console.log(`📇 Total Contacts: ${contacts.length}`);
    
    // Get chats
    const chats = await client.getChats();
    console.log(`💬 Total Chats: ${chats.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Show last 5 chats
    console.log('📝 Last 5 Chats:');
    const recentChats = chats.slice(0, 5);
    recentChats.forEach((chat, index) => {
        const lastMsg = chat.lastMessage ? chat.lastMessage.body.substring(0, 30) : 'No messages';
        console.log(`   ${index + 1}. ${chat.name}`);
        console.log(`      ID: ${chat.id._serialized}`);
        console.log(`      Last message: ${lastMsg}...`);
        console.log(`      Unread count: ${chat.unreadCount}`);
        console.log('');
    });
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🧪 Command Examples You Can Try:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n1️⃣  Send text message:');
    console.log('   const chatId = "phone_number@c.us"; // e.g: 971501234567@c.us');
    console.log('   await client.sendMessage(chatId, "Hello from Waqtor!");');
    
    console.log('\n2️⃣  Send message to yourself (for testing):');
    console.log('   const myNumber = client.info.wid._serialized;');
    console.log('   await client.sendMessage(myNumber, "Testing Waqtor 🚀");');
    
    console.log('\n3️⃣  Get chat information:');
    console.log('   const chat = await client.getChatById("chat_id");');
    console.log('   console.log(chat);');
    
    console.log('\n4️⃣  Read last messages:');
    console.log('   const chat = await client.getChatById("chat_id");');
    console.log('   const messages = await chat.fetchMessages({limit: 10});');
    console.log('   messages.forEach(msg => console.log(msg.body));');
    
    console.log('\n5️⃣  Send image:');
    console.log('   const media = MessageMedia.fromFilePath("./image.jpg");');
    console.log('   await client.sendMessage(chatId, media, {caption: "Image from Waqtor"});');
    
    console.log('\n6️⃣  Get connection state:');
    console.log('   const state = await client.getState();');
    console.log('   console.log(state);');
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('💡 Tip: Use "await" with asynchronous commands');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Simple test - send message to yourself
    console.log('🧪 Quick test: Sending message to yourself...');
    try {
        const myNumber = client.info.wid._serialized;
        await client.sendMessage(myNumber, `
🚀 *Hello from Waqtor!*

Successfully connected ✅

• Date: ${new Date().toLocaleString('en-US')}
• Version: v1.34.1
• Account: ${info.pushname}

_Waqtor - A new vector for intelligent communication._
        `.trim());
        
        console.log('✅ Test message sent to your account successfully!');
        console.log('   Check your WhatsApp 📱');
    } catch (error) {
        console.error('❌ Send error:', error.message);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('⌨️  You can now type JavaScript commands here...');
    console.log('   Example: await client.getChats()');
    console.log('═══════════════════════════════════════════════════════════\n');
});

client.on('message', async (message) => {
    console.log('📨 New message:');
    console.log(`   From: ${message.from}`);
    console.log(`   Text: ${message.body}`);
    console.log('');
    
    // Example: Auto-reply to "!ping"
    if (message.body === '!ping') {
        message.reply('🏓 pong from Waqtor!');
        console.log('✅ Replied to !ping');
    }
    
    // Example: Bot information
    if (message.body === '!info') {
        const info = client.info;
        message.reply(`
📊 *Waqtor Information*

• Name: ${info.pushname}
• Number: ${info.wid.user}
• Platform: ${info.platform}
• Version: v1.34.1

_Waqtor - Smart Automation Engine_
        `.trim());
        console.log('✅ Replied to !info');
    }
});

client.on('disconnected', (reason) => {
    console.log('❌ Disconnected:', reason);
});

// Initialize
client.initialize();

// Handle shutdown
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down Waqtor...');
    await client.destroy();
    console.log('✅ Stopped successfully');
    process.exit(0);
});
