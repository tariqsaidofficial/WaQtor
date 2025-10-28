# 🔌 WebSocket & Session Monitoring Guide

> **Version:** 1.0.0  
> **Added in:** Waqtor 1.34.1  
> **Last Updated:** October 28, 2025

---

## 🎯 Overview

This guide covers the new real-time features added to Waqtor:

1. **📘 Documentation Layer** - Complete API reference documentation
2. **🧩 Session Monitor Service** - Real-time session state tracking
3. **🔌 WebSocket Bridge** - Live updates via WebSocket

---

## 📘 1. API Documentation

### Location

Complete API reference available at:
```
docs/api-reference.md
```

### Features

- ✅ Complete endpoint documentation
- ✅ Request/response examples
- ✅ Error handling guide
- ✅ Authentication details
- ✅ Rate limiting information
- ✅ Phone number format guide

### Quick Access

```bash
# View documentation
cat docs/api-reference.md

# Or open in browser (if using VS Code Live Server)
# Right-click docs/api-reference.md → Open with Live Server
```

---

## 🧩 2. Session Monitor Service

### What It Does

The Session Monitor continuously tracks your WhatsApp client state and stores it in the database:

- Connection status (connected/disconnected/qr)
- Authentication state
- QR code availability
- Session information (phone, name, platform)
- Message statistics (sent/received)
- Uptime tracking

### Database Storage

All session state is stored in SQLite:

```sql
-- Session state table
session_state (
    id INTEGER PRIMARY KEY,
    status TEXT,
    ready BOOLEAN,
    authenticated BOOLEAN,
    qr_code TEXT,
    phone TEXT,
    pushname TEXT,
    platform TEXT,
    uptime INTEGER,
    messages_sent INTEGER,
    messages_received INTEGER,
    last_update DATETIME
)
```

### API Endpoints

#### Get Current Session State

```bash
curl -X GET http://localhost:8080/api/session/state \
  -H "X-API-Key: your_api_key_here"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "connected",
    "ready": true,
    "authenticated": true,
    "hasQR": false,
    "info": {
      "pushname": "Tariq Said",
      "platform": "android",
      "phoneMasked": "***1583"
    },
    "uptime": 3600,
    "stats": {
      "messagesSent": 45,
      "messagesReceived": 23
    },
    "lastUpdate": "2025-10-28T12:30:00.000Z"
  }
}
```

#### Get QR Code

```bash
curl -X GET http://localhost:8080/api/session/qr \
  -H "X-API-Key: your_api_key_here"
```

**Response (when QR available):**

```json
{
  "success": true,
  "data": {
    "hasQR": true,
    "qr": "2@ABC123XYZ..."
  }
}
```

**Response (already authenticated):**

```json
{
  "success": true,
  "data": {
    "hasQR": false,
    "message": "No QR code available. Client may already be authenticated."
  }
}
```

#### Reset Statistics

```bash
curl -X POST http://localhost:8080/api/session/stats/reset \
  -H "X-API-Key: your_api_key_here"
```

---

## 🔌 3. WebSocket Bridge

### What It Does

Real-time bidirectional communication between server and clients:

- ✅ Live session state updates
- ✅ QR code broadcasting
- ✅ Message events
- ✅ Campaign notifications
- ✅ Custom event subscriptions

### Connection

**Endpoint:** `ws://localhost:8080/ws`

**Authentication:** Required via query parameter or header

```javascript
// Option 1: Query parameter (recommended for browsers)
const ws = new WebSocket('ws://localhost:8080/ws?apiKey=your_api_key_here');

// Option 2: Header (for advanced clients)
const ws = new WebSocket('ws://localhost:8080/ws', {
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
});
```

### WebSocket Events

#### Client → Server (Commands)

```javascript
// 1. Ping/Pong - Check connection
ws.send(JSON.stringify({ type: 'ping' }));
// Response: { type: 'pong', timestamp: 1234567890 }

// 2. Get current state
ws.send(JSON.stringify({ type: 'get_state' }));
// Response: { type: 'session_state', data: {...} }

// 3. Get QR code
ws.send(JSON.stringify({ type: 'get_qr' }));
// Response: { type: 'qr_code', data: { qr: '...' } }

// 4. Subscribe to specific events
ws.send(JSON.stringify({ 
  type: 'subscribe', 
  events: ['session_update', 'qr_code'] 
}));
// Response: { type: 'subscribed', events: [...] }
```

#### Server → Client (Events)

```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'session_update':
      // Session state changed
      console.log('New state:', data.data);
      break;
      
    case 'qr_code':
      // QR code received
      console.log('QR:', data.data.qr);
      break;
      
    case 'message':
      // Message event
      console.log('Message:', data.data);
      break;
      
    case 'campaign':
      // Campaign event
      console.log('Campaign:', data.data);
      break;
  }
};
```

### Connection Info API

```bash
curl -X GET http://localhost:8080/api/session/websocket/info \
  -H "X-API-Key: your_api_key_here"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "endpoint": "/ws",
    "url": "ws://localhost:8080/ws",
    "authentication": "Required - use X-API-Key header or ?apiKey= query param",
    "clients": 2,
    "clientsInfo": [
      {
        "id": 1,
        "readyState": "OPEN",
        "authenticated": true,
        "subscriptions": ["all"]
      }
    ],
    "events": [
      "session_update",
      "qr_code",
      "message",
      "campaign"
    ],
    "usage": {
      "connect": "ws://localhost:8080/ws?apiKey=YOUR_API_KEY",
      "commands": [...]
    }
  }
}
```

---

## 🧪 Testing Tools

### 1. WebSocket Test Client (HTML)

A ready-to-use HTML test client is available:

```bash
# Open in browser
open docs/websocket-test.html
# Or on Linux
xdg-open docs/websocket-test.html
```

**Features:**
- ✅ Connect/disconnect controls
- ✅ Quick command buttons
- ✅ Custom JSON message sender
- ✅ Live session state display
- ✅ QR code viewer
- ✅ Message log

### 2. Node.js Example

```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080/ws?apiKey=your_api_key_here');

ws.on('open', () => {
  console.log('✅ Connected');
  
  // Request state
  ws.send(JSON.stringify({ type: 'get_state' }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('📨 Received:', message);
  
  if (message.type === 'session_update') {
    console.log('Session status:', message.data.status);
  }
});

ws.on('error', (error) => {
  console.error('❌ Error:', error);
});

ws.on('close', () => {
  console.log('Connection closed');
});
```

### 3. Python Example

```python
import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    print(f"📨 Received: {data}")
    
    if data['type'] == 'session_update':
        print(f"Session status: {data['data']['status']}")

def on_open(ws):
    print("✅ Connected")
    ws.send(json.dumps({"type": "get_state"}))

ws = websocket.WebSocketApp(
    "ws://localhost:8080/ws?apiKey=your_api_key_here",
    on_message=on_message,
    on_open=on_open
)

ws.run_forever()
```

---

## 🎨 React Integration Example

```javascript
import { useEffect, useState } from 'react';

function SessionMonitor() {
  const [state, setState] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket(
      'ws://localhost:8080/ws?apiKey=your_api_key_here'
    );

    websocket.onopen = () => {
      console.log('Connected');
      websocket.send(JSON.stringify({ type: 'get_state' }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'session_update' || data.type === 'session_state') {
        setState(data.data);
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  if (!state) return <div>Loading...</div>;

  return (
    <div>
      <h2>Session Status</h2>
      <p>Status: {state.status}</p>
      <p>Ready: {state.ready ? '✅' : '❌'}</p>
      <p>Messages Sent: {state.stats?.messagesSent || 0}</p>
      <p>Messages Received: {state.stats?.messagesReceived || 0}</p>
    </div>
  );
}

export default SessionMonitor;
```

---

## 🔒 Security Considerations

### API Key Protection

⚠️ **IMPORTANT:** Never expose your API key in client-side code in production!

**For production:**

1. Use a backend proxy:
```javascript
// Instead of direct connection
const ws = new WebSocket('ws://localhost:8080/ws?apiKey=SECRET');

// Use backend proxy
const ws = new WebSocket('wss://your-backend.com/ws-proxy');
// Backend validates user session and connects to Waqtor
```

2. Implement session-based authentication
3. Use HTTPS/WSS in production
4. Rotate API keys regularly

### Rate Limiting

WebSocket connections are NOT rate-limited, but authenticated.

- Each connection requires valid API key
- Failed auth attempts close connection immediately
- Monitor connected clients via `/api/session/websocket/info`

---

## 🐛 Troubleshooting

### WebSocket Connection Fails

```javascript
// Error: WebSocket connection to 'ws://localhost:8080/ws' failed
```

**Solutions:**

1. Check server is running:
   ```bash
   curl http://localhost:8080/health
   ```

2. Verify API key is correct

3. Check browser console for errors

4. Test with REST API first:
   ```bash
   curl http://localhost:8080/api/session/state \
     -H "X-API-Key: your_api_key_here"
   ```

### Session State Not Updating

1. Check session monitor is initialized (server logs)
2. Verify WhatsApp client is ready
3. Request state manually:
   ```javascript
   ws.send(JSON.stringify({ type: 'get_state' }));
   ```

### QR Code Not Appearing

1. Check if already authenticated:
   ```bash
   curl http://localhost:8080/api/status/client \
     -H "X-API-Key: your_api_key_here"
   ```

2. Logout and re-authenticate:
   ```bash
   curl -X POST http://localhost:8080/api/status/logout \
     -H "X-API-Key: your_api_key_here"
   ```

3. Restart server

---

## 📊 Performance

### Database Impact

- Session state updates every 30 seconds
- Minimal database writes (single row update)
- No performance impact on message sending

### WebSocket Performance

- Supports multiple concurrent connections
- Auto-ping every 30 seconds to keep alive
- Efficient binary protocol
- Broadcast to all clients in <1ms

---

## 🚀 Next Steps

### Recommended Dashboard Features

1. **Real-time Status Card**
   - Show connection status
   - Display uptime
   - Message statistics

2. **QR Code Scanner**
   - Auto-refresh QR from WebSocket
   - Show countdown timer
   - One-click logout/re-auth

3. **Live Message Feed**
   - Show messages as they arrive
   - Filter sent/received
   - Search and export

4. **Campaign Monitor**
   - Real-time campaign progress
   - Live recipient status
   - Delivery confirmation

---

## 📚 Additional Resources

- **API Reference:** `docs/api-reference.md`
- **Quick Start:** `documentation/QUICKSTART.md`
- **Campaign Guide:** `documentation/CAMPAIGN_GUIDE.md`
- **WebSocket Test Client:** `docs/websocket-test.html`

---

## 🆘 Support

For issues or questions:

- **GitHub Issues:** [github.com/tariqsaidofficial/WaQtor/issues](https://github.com/tariqsaidofficial/WaQtor/issues)
- **Email:** info@dxbmark.com

---

**Last Updated:** October 28, 2025  
**Waqtor Version:** 1.34.1
