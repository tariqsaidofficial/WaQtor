#!/usr/bin/env node
/**
 * WebSocket Test Client
 * Tests WaQtor WebSocket functionality
 */

const WebSocket = require('ws');

const API_KEY = process.env.API_KEY || 'waqtor_default_key_change_me_in_production';
const WS_URL = `ws://localhost:8080/ws?apiKey=${API_KEY}`;

console.log('🔌 WaQtor WebSocket Test Client');
console.log('================================\n');
console.log(`Connecting to: ${WS_URL}\n`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
    console.log('✅ Connected successfully!\n');
    
    // Request initial state
    console.log('📤 Requesting session state...');
    ws.send(JSON.stringify({ type: 'get_state' }));
    
    // Request QR code
    setTimeout(() => {
        console.log('📤 Requesting QR code...');
        ws.send(JSON.stringify({ type: 'get_qr' }));
    }, 1000);
    
    // Send ping
    setTimeout(() => {
        console.log('📤 Sending ping...');
        ws.send(JSON.stringify({ type: 'ping' }));
    }, 2000);
});

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data);
        console.log('📥 Received:', JSON.stringify(message, null, 2));
        console.log('');
        
        // Handle specific message types
        switch (message.type) {
            case 'session_state':
            case 'session_update':
                console.log('📊 Session State:');
                console.log(`   Status: ${message.data.status}`);
                console.log(`   Ready: ${message.data.ready ? '✅' : '❌'}`);
                console.log(`   Authenticated: ${message.data.authenticated ? '✅' : '❌'}`);
                console.log(`   Has QR: ${message.data.hasQR ? '✅' : '❌'}`);
                if (message.data.info) {
                    console.log(`   Push Name: ${message.data.info.pushname}`);
                    console.log(`   Platform: ${message.data.info.platform}`);
                }
                if (message.data.stats) {
                    console.log(`   Messages Sent: ${message.data.stats.messagesSent}`);
                    console.log(`   Messages Received: ${message.data.stats.messagesReceived}`);
                }
                console.log('');
                break;
                
            case 'qr_code':
                console.log('📱 QR Code received!');
                if (message.data && message.data.qr) {
                    console.log('   Length:', message.data.qr.length);
                    console.log('   Preview:', message.data.qr.substring(0, 50) + '...');
                } else {
                    console.log('   No QR code available');
                }
                console.log('');
                break;
                
            case 'pong':
                console.log('🏓 Pong received!');
                console.log('');
                break;
        }
    } catch (error) {
        console.error('❌ Error parsing message:', error);
        console.log('Raw data:', data.toString());
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
    console.log(`\n🔌 Connection closed`);
    console.log(`   Code: ${code}`);
    console.log(`   Reason: ${reason || 'No reason provided'}`);
    process.exit(0);
});

// Close after 10 seconds
setTimeout(() => {
    console.log('\n⏰ Test complete. Closing connection...');
    ws.close();
}, 10000);

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n\n👋 Closing connection...');
    ws.close();
    process.exit(0);
});
