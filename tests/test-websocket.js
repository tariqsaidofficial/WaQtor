/**
 * WebSocket Test Client for WaQtor
 * Node.js script to test WebSocket functionality
 */

const WebSocket = require('ws');

// Configuration
const WS_URL = 'ws://localhost:8080/ws';
const API_KEY = 'waqtor_default_key_change_me';

// Connect to WaQtor WebSocket
console.log('🔌 Connecting to WaQtor WebSocket...');
const ws = new WebSocket(`${WS_URL}?apiKey=${API_KEY}`);

// Connection opened
ws.on('open', () => {
  console.log('✅ Connected to WaQtor WebSocket\n');
  
  // Send ping
  console.log('📤 Sending: ping');
  ws.send(JSON.stringify({ type: 'ping' }));
  
  // Get session state
  setTimeout(() => {
    console.log('📤 Sending: get_state');
    ws.send(JSON.stringify({ type: 'get_state' }));
  }, 1000);
  
  // Get QR code
  setTimeout(() => {
    console.log('📤 Sending: get_qr');
    ws.send(JSON.stringify({ type: 'get_qr' }));
  }, 2000);
  
  // Subscribe to all events
  setTimeout(() => {
    console.log('📤 Sending: subscribe to all events');
    ws.send(JSON.stringify({ 
      type: 'subscribe', 
      events: ['all'] 
    }));
  }, 3000);
});

// Message received
ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    console.log('\n📨 Received:', message.type);
    
    // Handle specific events
    switch (message.type) {
      case 'pong':
        console.log('🏓 Pong received! Timestamp:', message.timestamp);
        break;
        
      case 'session_state':
        console.log('📊 Session State:');
        console.log('   Status:', message.data.status);
        console.log('   Ready:', message.data.ready);
        console.log('   Authenticated:', message.data.authenticated);
        console.log('   Has QR:', message.data.hasQR);
        console.log('   Uptime:', message.data.uptime, 'seconds');
        console.log('   Messages Sent:', message.data.stats.messagesSent);
        console.log('   Messages Received:', message.data.stats.messagesReceived);
        if (message.data.info) {
          console.log('   Push Name:', message.data.info.pushname);
          console.log('   Platform:', message.data.info.platform);
        }
        break;
        
      case 'qr_code':
        if (message.data.qr) {
          console.log('📱 QR Code received!');
          console.log('   Length:', message.data.qr.length, 'characters');
          console.log('   Preview:', message.data.qr.substring(0, 50) + '...');
          console.log('\n   ℹ️  Use WebSocket test page to display QR as image');
        } else {
          console.log('📱 No QR code available (already authenticated)');
        }
        break;
        
      case 'session_update':
        console.log('🔄 Session Update:');
        console.log('   Status changed to:', message.data.status);
        console.log('   Ready:', message.data.ready);
        break;
        
      case 'message':
        console.log('💬 Message Event:');
        console.log('   From:', message.data.from);
        console.log('   Body:', message.data.body);
        break;
        
      case 'campaign':
        console.log('📢 Campaign Event:');
        console.log('   Campaign:', message.data.name);
        console.log('   Status:', message.data.status);
        break;
        
      case 'subscribed':
        console.log('✅ Subscribed to events:', message.events.join(', '));
        break;
        
      default:
        console.log('   Data:', JSON.stringify(message, null, 2));
    }
  } catch (e) {
    console.error('❌ Error parsing message:', e.message);
  }
});

// Error occurred
ws.on('error', (error) => {
  console.error('\n❌ WebSocket error:', error.message);
});

// Connection closed
ws.on('close', (code, reason) => {
  console.log('\n🔌 Connection closed');
  console.log('   Code:', code);
  console.log('   Reason:', reason || 'No reason provided');
  process.exit(0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Closing connection...');
  ws.close();
  process.exit(0);
});

console.log('\n💡 Press Ctrl+C to exit\n');
