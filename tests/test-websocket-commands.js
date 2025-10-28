/**
 * Test WebSocket Commands
 */

const WebSocket = require('ws');

const WS_URL = 'ws://localhost:8080/ws';
const API_KEY = 'waqtor_default_key_change_me_in_production';

let ws = null;

function connect() {
    return new Promise((resolve, reject) => {
        console.log('🔌 Connecting to WebSocket...');
        
        ws = new WebSocket(`${WS_URL}?apiKey=${API_KEY}`);

        ws.on('open', () => {
            console.log('✅ Connected!\n');
            resolve();
        });

        ws.on('message', (data) => {
            const message = JSON.parse(data);
            console.log('📨 Received:', JSON.stringify(message, null, 2), '\n');
        });

        ws.on('error', (error) => {
            console.error('❌ Error:', error.message);
            reject(error);
        });

        ws.on('close', () => {
            console.log('🔌 Connection closed');
        });
    });
}

function sendCommand(type, data = {}) {
    return new Promise((resolve) => {
        const message = { type, ...data };
        console.log('➡️  Sending:', type);
        ws.send(JSON.stringify(message));
        
        // Wait a bit for response
        setTimeout(resolve, 1000);
    });
}

async function testCommands() {
    try {
        await connect();

        console.log('\n🧪 Testing Quick Commands:\n');
        console.log('='.repeat(50));

        // Test 1: Ping
        console.log('\n1️⃣  Testing PING command...');
        await sendCommand('ping');

        // Test 2: Get State
        console.log('\n2️⃣  Testing GET_STATE command...');
        await sendCommand('get_state');

        // Test 3: Get QR
        console.log('\n3️⃣  Testing GET_QR command...');
        await sendCommand('get_qr');

        // Test 4: Subscribe
        console.log('\n4️⃣  Testing SUBSCRIBE command...');
        await sendCommand('subscribe', { events: ['all'] });

        console.log('\n' + '='.repeat(50));
        console.log('✅ All commands tested!\n');

        // Keep connection open for a bit to receive any broadcasts
        setTimeout(() => {
            ws.close();
            process.exit(0);
        }, 3000);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testCommands();
