#!/usr/bin/env node
/**
 * Simple WebSocket Test Client
 * Tests WebSocket connection and basic commands
 */

const WebSocket = require('ws');

const WS_URL = 'ws://localhost:8080/ws';
const API_KEY = 'waqtor_default_key_change_me_in_production';

console.log('🔌 WaQtor WebSocket Test Client\n');
console.log(`Connecting to: ${WS_URL}`);
console.log(`API Key: ${API_KEY.substring(0, 15)}...\n`);

// Create WebSocket connection with API key in query parameter
const ws = new WebSocket(`${WS_URL}?apiKey=${API_KEY}`);

// Connection opened
ws.on('open', () => {
    console.log('✅ Connected to WebSocket server\n');
    
    // Send ping
    console.log('📤 Sending ping...');
    ws.send(JSON.stringify({ type: 'ping' }));
    
    // Request session state after 1 second
    setTimeout(() => {
        console.log('📤 Requesting session state...');
        ws.send(JSON.stringify({ type: 'get_state' }));
    }, 1000);
    
    // Subscribe to all events after 2 seconds
    setTimeout(() => {
        console.log('📤 Subscribing to all events...');
        ws.send(JSON.stringify({ 
            type: 'subscribe', 
            events: ['session_state', 'qr_code', 'message', 'campaign']
        }));
    }, 2000);
});

// Listen for messages
ws.on('message', (data) => {
    try {
        const message = JSON.parse(data);
        console.log('\n📨 Received message:');
        console.log(`Type: ${message.type}`);
        
        switch (message.type) {
        case 'pong':
            console.log(`Pong received at: ${new Date(message.timestamp).toISOString()}`);
            break;
                
        case 'session_state':
            console.log('Session State:', JSON.stringify(message.data, null, 2));
            break;
                
        case 'subscribed':
            console.log('Subscribed to events:', message.events.join(', '));
            break;
                
        case 'qr_code':
            console.log('QR Code received:', message.data.qr ? 'Yes' : 'No');
            if (message.data.qr) {
                console.log('QR Code length:', message.data.qr.length);
            }
            break;
                
        default:
            console.log('Data:', JSON.stringify(message, null, 2));
        }
    } catch (error) {
        console.error('❌ Error parsing message:', error.message);
        console.log('Raw data:', data);
    }
});

// Connection closed
ws.on('close', (code, reason) => {
    console.log(`\n❌ Connection closed: ${code} - ${reason || 'No reason provided'}`);
    process.exit(0);
});

// Connection error
ws.on('error', (error) => {
    console.error('\n❌ WebSocket error:', error.message);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\n👋 Closing connection...');
    ws.close();
    process.exit(0);
});

console.log('\n💡 Press Ctrl+C to disconnect\n');
console.log('─'.repeat(60));
