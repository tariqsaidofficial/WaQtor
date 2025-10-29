# 🔌 WebSocket Testing Guide

> How to test WaQtor's WebSocket real-time functionality

---

## 🎯 Quick Start

### Method 1: Using the Web Test Client (Recommended)

1. **Start WaQtor Server:**
   ```bash
   cd /Users/sunmarke/Downloads/Waqtor-main
   npm start
   ```

2. **Open WebSocket Test Page:**
   ```bash
   open docs/websocket-test.html
   ```
   Or navigate to: `file:///Users/sunmarke/Downloads/Waqtor-main/docs/websocket-test.html`

3. **Connect:**
   - Enter API Key: `waqtor_default_key_change_me`
   - Click "Connect"
   - You should see "✅ Connected successfully!"

4. **Test Commands:**
   - Click "Ping" to test connection
   - Click "Get State" to get current session state
   - Click "Get QR Code" to get WhatsApp QR code

---

### Method 2: Using cURL (WebSocket Endpoint Info)

```bash
# Get WebSocket connection information
curl http://localhost:8080/api/session/websocket/info \
  -H "X-API-Key: waqtor_default_key_change_me" | jq
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "endpoint": "/ws",
    "url": "ws://localhost:8080/ws",
    "authentication": "Required - use ?apiKey= query param",
    "clients": 0,
    "clientsInfo": [],
    "events": [
      "session_update",
      "qr_code",
      "message",
      "campaign"
    ]
  }
}
```

---

### Method 3: Using Node.js WebSocket Client

Create a file `test-websocket.js`:

```javascript
const WebSocket = require('ws');

// Connect to WaQtor WebSocket
const ws = new WebSocket('ws://localhost:8080/ws?apiKey=waqtor_default_key_change_me');

ws.on('open', () => {
  console.log('✅ Connected to WaQtor WebSocket');
  
  // Send ping
  ws.send(JSON.stringify({ type: 'ping' }));
  
  // Get session state
  ws.send(JSON.stringify({ type: 'get_state' }));
  
  // Get QR code
  ws.send(JSON.stringify({ type: 'get_qr' }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('📨 Received:', JSON.stringify(message, null, 2));
  
  // Handle specific events
  switch (message.type) {
    case 'qr_code':
      console.log('📱 QR Code received!');
      console.log('QR:', message.data.qr);
      break;
    case 'session_state':
      console.log('📊 Session State:', message.data);
      break;
    case 'pong':
      console.log('🏓 Pong received!');
      break;
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error);
});

ws.on('close', () => {
  console.log('🔌 Connection closed');
});
```

Run it:
```bash
node test-websocket.js
```

---

## 📡 WebSocket Events

### Client → Server (Commands)

#### 1. Ping
```json
{ "type": "ping" }
```
**Response:** `{ "type": "pong", "timestamp": 1730123456789 }`

#### 2. Get Session State
```json
{ "type": "get_state" }
```
**Response:**
```json
{
  "type": "session_state",
  "data": {
    "status": "disconnected",
    "ready": false,
    "authenticated": false,
    "hasQR": false,
    "info": null,
    "uptime": 0,
    "stats": {
      "messagesSent": 0,
      "messagesReceived": 0
    }
  }
}
```

#### 3. Get QR Code
```json
{ "type": "get_qr" }
```
**Response:**
```json
{
  "type": "qr_code",
  "data": {
    "qr": "2@abc123def456..."
  }
}
```

#### 4. Subscribe to Events
```json
{
  "type": "subscribe",
  "events": ["all"]
}
```
**Response:**
```json
{
  "type": "subscribed",
  "events": ["all"]
}
```

---

### Server → Client (Broadcasts)

#### 1. Session Update
Sent automatically when session state changes:
```json
{
  "type": "session_update",
  "data": {
    "status": "ready",
    "ready": true,
    "authenticated": true,
    "hasQR": false,
    "info": {
      "pushname": "DXBMark Bot",
      "platform": "android",
      "phoneMasked": "***1234"
    },
    "uptime": 3600,
    "stats": {
      "messagesSent": 10,
      "messagesReceived": 5
    }
  }
}
```

#### 2. QR Code Broadcast
Sent when new QR code is generated:
```json
{
  "type": "qr_code",
  "data": {
    "qr": "2@abc123def456..."
  }
}
```

#### 3. Message Event
Sent when a message is received/sent:
```json
{
  "type": "message",
  "data": {
    "from": "971501234567@c.us",
    "to": "971507654321@c.us",
    "body": "Hello!",
    "timestamp": 1730123456,
    "type": "chat",
    "hasMedia": false
  }
}
```

#### 4. Campaign Event
Sent when a campaign is executed:
```json
{
  "type": "campaign",
  "data": {
    "id": 1,
    "name": "Black Friday",
    "status": "completed",
    "results": {
      "total": 100,
      "sent": 98,
      "failed": 2
    }
  }
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Connection Test

**Steps:**
1. Open `docs/websocket-test.html`
2. Click "Connect"
3. Verify "✅ Connected successfully!" message
4. Click "Ping"
5. Verify "PONG" response

**Expected Result:** Connection established, ping/pong working

---

### Scenario 2: Session State Monitoring

**Steps:**
1. Connect to WebSocket
2. Click "Get State"
3. Observe "Session State" section update
4. If WhatsApp is disconnected, you'll see:
   - Status: disconnected
   - Ready: ❌ No
   - Authenticated: ❌ No

**Expected Result:** Current session state displayed

---

### Scenario 3: QR Code Display

**Steps:**
1. Connect to WebSocket
2. If WhatsApp is not authenticated, QR will auto-broadcast
3. Or click "Get QR Code"
4. QR code should appear in "QR Code" section
5. Scan with WhatsApp mobile app

**Expected Result:** 
- QR code displayed as image (using QRCode.js)
- Or fallback to text format if library fails
- After scanning, session state updates to "ready"

---

### Scenario 4: Real-time Updates

**Steps:**
1. Keep WebSocket connected
2. Scan QR code with WhatsApp
3. Watch for automatic session_update broadcasts
4. Status should change from "disconnected" → "authenticated" → "ready"

**Expected Result:** Session state updates in real-time without manual refresh

---

## 🔍 Troubleshooting

### Issue: Cannot Connect to WebSocket

**Check:**
```bash
# 1. Is server running?
curl http://localhost:8080/health

# 2. Is WebSocket endpoint available?
curl http://localhost:8080/api/session/websocket/info \
  -H "X-API-Key: waqtor_default_key_change_me"

# 3. Check server logs
# Look for: "WebSocket bridge initialized on path /ws"
```

**Solution:** Make sure server is started with `npm start`

---

### Issue: Invalid API Key Error

**Error in browser console:**
```
WebSocket connection closed with code 1008: Invalid API key
```

**Solution:** 
1. Check API key in `.env` file
2. Use default key: `waqtor_default_key_change_me`
3. Or check database: `SELECT * FROM api_keys;`

---

### Issue: No QR Code Displayed

**Check:**
```bash
# Get session state
curl http://localhost:8080/api/session/state \
  -H "X-API-Key: waqtor_default_key_change_me" | jq
```

**Possible Reasons:**
1. WhatsApp already authenticated (no QR needed)
2. QR not yet generated (wait a few seconds)
3. Session in error state

**Solution:**
1. If authenticated, logout first:
   ```bash
   curl -X POST http://localhost:8080/api/status/logout \
     -H "X-API-Key: waqtor_default_key_change_me"
   ```
2. Restart server
3. QR should generate within 10-15 seconds

---

### Issue: QR Code Library Not Loading

**Error in browser console:**
```
QRCode is not defined
```

**Solution:**
The page uses CDN: `https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js`

**Workaround:**
1. Check internet connection
2. Or it will fallback to text display automatically

---

## 📊 Expected WebSocket Flow

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Connect: ws://localhost:8080/ws?apiKey=xxx
       ▼
┌─────────────────────┐
│  WebSocket Server   │
│   (Port 8080)       │
└──────┬──────────────┘
       │
       │ 2. Validate API Key
       │ 3. Send initial session_state
       │
       ▼
┌─────────────────────┐
│  Session Monitor    │
│  (Monitoring WA)    │
└──────┬──────────────┘
       │
       │ 4. WhatsApp Events
       │    - QR generated
       │    - Authenticated
       │    - Ready
       │    - Messages
       │
       ▼
┌─────────────────────┐
│  Broadcast to All   │
│  Connected Clients  │
└─────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] WebSocket endpoint `/ws` is available
- [ ] Can connect with valid API key
- [ ] Ping/Pong works
- [ ] Session state can be retrieved
- [ ] QR code is displayed (if not authenticated)
- [ ] Real-time updates work (QR → authenticated → ready)
- [ ] Messages appear in log
- [ ] Connection remains stable (no disconnects)

---

## 🎯 Next Steps

After successful WebSocket testing:

1. **Build React Dashboard**
   - Use WebSocket for real-time updates
   - Display QR code
   - Show session status
   - Monitor messages

2. **Implement Features**
   - Auto-reconnect on disconnect
   - Error handling and retry
   - Multiple client support
   - Message history

3. **Production Setup**
   - Use WSS (secure WebSocket) with HTTPS
   - Implement proper authentication
   - Add rate limiting
   - Set up monitoring/alerts

---

**Testing Status:** ✅ Ready for Testing  
**Last Updated:** October 28, 2025  
**WaQtor Version:** 1.0.4
