#!/usr/bin/env node
/**
 * Quick WebSocket Path Test
 */

const WebSocket = require('ws');

// Use the correct API key from .env
const API_KEY = 'waqtor_default_key_change_me_in_production';

console.log('🔍 Testing WebSocket connections...\n');

// Test 1: Root path
console.log('Test 1: ws://localhost:8080 (root)');
const ws1 = new WebSocket(`ws://localhost:8080?apiKey=${API_KEY}`);

ws1.on('open', () => {
    console.log('✅ Root path: CONNECTED!\n');
    ws1.send(JSON.stringify({ type: 'ping' }));
    setTimeout(() => ws1.close(), 1500);
});

ws1.on('message', (data) => {
    console.log('📥 Root received:', data.toString());
});

ws1.on('error', (error) => {
    console.log('❌ Root error:', error.code || error.message);
});

ws1.on('close', (code, reason) => {
    console.log(`🔌 Root closed: code=${code}, reason=${reason || 'none'}\n`);
    console.log('═══════════════════════════════════════\n');
    
    // Test 2: /ws path
    setTimeout(() => {
        console.log('Test 2: ws://localhost:8080/ws');
        const ws2 = new WebSocket(`ws://localhost:8080/ws?apiKey=${API_KEY}`);
        
        ws2.on('open', () => {
            console.log('✅ /ws path: CONNECTED!\n');
            ws2.send(JSON.stringify({ type: 'get_state' }));
            setTimeout(() => ws2.close(), 1500);
        });
        
        ws2.on('message', (data) => {
            console.log('📥 /ws received:', data.toString().substring(0, 200) + '...');
        });
        
        ws2.on('error', (error) => {
            console.log('❌ /ws error:', error.code || error.message);
        });
        
        ws2.on('close', (code, reason) => {
            console.log(`\n🔌 /ws closed: code=${code}, reason=${reason || 'none'}`);
            console.log('\n✅ Tests complete!');
            process.exit(0);
        });
    }, 500);
});
