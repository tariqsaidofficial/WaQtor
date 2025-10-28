# 📘 WaQtor API Reference

> **WaQtor Version:** 1.0.4  
> **Built on:** whatsapp-web.js v1.34.1  
> **Base URL:** `http://localhost:8080/api`  
> **Documentation Version:** 1.1.0  
> **Last Updated:** October 28, 2025

---

## 🔐 Authentication

All API endpoints (except `/health`) require authentication via API Key.

### Headers Required

```http
X-API-Key: your_api_key_here
Content-Type: application/json
```

### Example Request

```bash
curl -X GET http://localhost:8080/api/status/client \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json"
```

### Getting Your API Key

API key is configured in your `.env` file:

```env
API_KEY=your_secure_api_key_here
```

⚠️ **Security Note:** Never commit your API key to version control. Change the default key before production use.

---

## 📨 Messages

### Send Text Message

**Endpoint:** `POST /api/messages/send-text`

Send a single text message to a WhatsApp contact.

#### Request Body

```json
{
  "phone": "966501234567",
  "message": "Hello from Waqtor! 🚀"
}
```

**Alternative format with chatId:**

```json
{
  "chatId": "966501234567@c.us",
  "text": "Hello from Waqtor! 🚀"
}
```

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "true_966501234567@c.us_3EB009B1AC20EF003F6294_out",
    "timestamp": 1761652865,
    "to": "966501234567"
  }
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Phone number is required"
}
```

#### Example cURL

```bash
curl -X POST http://localhost:8080/api/messages/send-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "phone": "966501234567",
    "message": "Hello from Waqtor!"
  }'
```

---

### Send Media Message

**Endpoint:** `POST /api/messages/send-media`

Send image, video, PDF, or other media files.

#### Request Body

```json
{
  "phone": "966501234567",
  "mediaUrl": "https://example.com/image.jpg",
  "caption": "Check out this image! 📸",
  "filename": "promo.jpg"
}
```

#### Supported Media Types

- **Images:** JPG, PNG, GIF, WEBP
- **Videos:** MP4, AVI, MOV
- **Documents:** PDF, DOCX, XLSX, TXT
- **Audio:** MP3, OGG, WAV

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Media sent successfully",
  "data": {
    "id": "true_966501234567@c.us_3EB009B1AC20EF003F6295_out",
    "timestamp": 1761652900,
    "to": "966501234567"
  }
}
```

#### Example cURL

```bash
curl -X POST http://localhost:8080/api/messages/send-media \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "phone": "966501234567",
    "mediaUrl": "https://example.com/promo.jpg",
    "caption": "Special offer! 🎉"
  }'
```

---

### Send Bulk Messages

**Endpoint:** `POST /api/messages/send-bulk`

Send the same message to multiple recipients.

#### Request Body

```json
{
  "recipients": [
    "966501234567@c.us",
    "966507654321@c.us",
    "971501234567@c.us"
  ],
  "text": "Bulk message to all contacts! 📢"
}
```

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Bulk messages sent",
  "data": {
    "total": 3,
    "sent": 3,
    "failed": 0,
    "results": [
      {
        "phone": "966501234567@c.us",
        "status": "sent",
        "messageId": "..."
      }
    ]
  }
}
```

---

## 📢 Campaigns

### Create Campaign

**Endpoint:** `POST /api/campaigns/create`

Create a new messaging campaign.

#### Request Body

```json
{
  "name": "Black Friday Sale",
  "message": "🎉 Special offer! 50% off all items.",
  "recipients": [
    "966501234567@c.us",
    "966507654321@c.us"
  ],
  "scheduledAt": "2025-11-01T18:00:00Z"
}
```

**Fields:**

- `name` (required): Campaign name
- `message` (required): Message text to send
- `recipients` (required): Array of phone numbers
- `scheduledAt` (optional): ISO 8601 timestamp for scheduling

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {
    "id": 1,
    "name": "Black Friday Sale",
    "message": "🎉 Special offer! 50% off all items.",
    "recipients": ["966501234567@c.us", "966507654321@c.us"],
    "status": "pending",
    "scheduled_at": "2025-11-01T18:00:00Z",
    "created_at": "2025-10-28T12:00:00Z"
  }
}
```

#### Example cURL

```bash
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "Welcome Campaign",
    "message": "Welcome to our service! 🎉",
    "recipients": ["966501234567@c.us"]
  }'
```

---

### Execute Campaign

**Endpoint:** `POST /api/campaigns/:id/execute`

Execute a campaign immediately (send messages to all recipients).

#### URL Parameters

- `id`: Campaign ID

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Campaign executed successfully",
  "data": {
    "results": {
      "total": 2,
      "sent": 2,
      "failed": 0,
      "errors": []
    },
    "campaign": {
      "id": "1",
      "name": "Black Friday Sale",
      "status": "completed"
    }
  }
}
```

#### Example cURL

```bash
curl -X POST http://localhost:8080/api/campaigns/1/execute \
  -H "X-API-Key: your_api_key_here"
```

---

### List All Campaigns

**Endpoint:** `GET /api/campaigns/list`

Retrieve all campaigns with their current status.

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Black Friday Sale",
      "message": "🎉 Special offer!",
      "recipients": ["966501234567@c.us"],
      "status": "completed",
      "created_at": "2025-10-28T12:00:00Z",
      "completed_at": "2025-10-28T12:05:00Z"
    },
    {
      "id": 2,
      "name": "Weekly Newsletter",
      "message": "This week's updates...",
      "recipients": ["966501234567@c.us", "966507654321@c.us"],
      "status": "pending",
      "created_at": "2025-10-28T13:00:00Z"
    }
  ]
}
```

#### Example cURL

```bash
curl -X GET http://localhost:8080/api/campaigns/list \
  -H "X-API-Key: your_api_key_here"
```

---

### Get Campaign Details

**Endpoint:** `GET /api/campaigns/:id`

Get details of a specific campaign.

#### URL Parameters

- `id`: Campaign ID

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Black Friday Sale",
    "message": "🎉 Special offer!",
    "recipients": ["966501234567@c.us"],
    "status": "completed",
    "scheduled_at": null,
    "created_at": "2025-10-28T12:00:00Z",
    "updated_at": "2025-10-28T12:05:00Z",
    "completed_at": "2025-10-28T12:05:00Z"
  }
}
```

---

### Update Campaign Status

**Endpoint:** `PUT /api/campaigns/:id/status`

Update the status of a campaign.

#### Request Body

```json
{
  "status": "cancelled"
}
```

**Valid statuses:** `pending`, `running`, `completed`, `failed`, `cancelled`

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Campaign status updated",
  "data": {
    "id": 1,
    "status": "cancelled"
  }
}
```

---

### Delete Campaign

**Endpoint:** `DELETE /api/campaigns/:id`

Delete a campaign permanently.

#### URL Parameters

- `id`: Campaign ID

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

---

## 📊 Status & Information

### Check Client Status

**Endpoint:** `GET /api/status/client`

Check if WhatsApp client is connected and ready.

#### Response

**Connected (200 OK):**

```json
{
  "success": true,
  "data": {
    "status": "connected",
    "ready": true,
    "state": "CONNECTED",
    "message": "WhatsApp client is ready"
  }
}
```

**Not Connected (503 Service Unavailable):**

```json
{
  "success": false,
  "data": {
    "status": "disconnected",
    "ready": false,
    "message": "WhatsApp client is not ready. Please scan QR code."
  }
}
```

---

### Get Session Info

**Endpoint:** `GET /api/status/info`

Get information about the authenticated WhatsApp session.

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "wid": "971505121583@c.us",
    "pushname": "Tariq Said",
    "platform": "android",
    "phone": "971505121583"
  }
}
```

---

### Get All Chats

**Endpoint:** `GET /api/status/chats`

Retrieve all WhatsApp chats.

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "966501234567@c.us",
      "name": "John Doe",
      "isGroup": false,
      "unreadCount": 0
    },
    {
      "id": "120363012345678901@g.us",
      "name": "Team Group",
      "isGroup": true,
      "unreadCount": 3
    }
  ]
}
```

---

### Logout

**Endpoint:** `POST /api/status/logout`

Logout and destroy the current WhatsApp session.

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Version Information

**Endpoint:** `GET /api/status/version`

Get Waqtor version information.

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "waqtor": "1.34.1",
    "upstream": "1.34.1",
    "upstreamAuthor": "pedroslopez"
  }
}
```

---

## 🧪 Testing Endpoints

### Check Test Configuration

**Endpoint:** `GET /api/test/info`

Check if test phone number is configured in environment.

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "configured": true,
    "message": "Test phone number is configured...",
    "phoneNumberMasked": "***1583"
  }
}
```

---

### Send Test Message

**Endpoint:** `POST /api/test/send`

Send a test message to the configured test phone number.

#### Request Body

```json
{
  "message": "Hello from Waqtor! 🚀 This is a test."
}
```

#### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Test message sent successfully",
  "data": {
    "id": "true_971505121583@c.us_3EB009B1AC20EF003F6294_out",
    "timestamp": 1761652865,
    "to": "TEST_PHONE_NUMBER (hidden for security)"
  }
}
```

---

## 🏥 Health Check

### Server Health

**Endpoint:** `GET /health`

**No authentication required.**

Check if the server is running.

#### Response

**Success (200 OK):**

```json
{
  "status": "ok",
  "timestamp": "2025-10-28T12:00:00.000Z",
  "service": "Waqtor API",
  "version": "1.34.1"
}
```

---

## 📋 Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 403 | Forbidden | API key not authorized |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | WhatsApp client not ready |

---

## 🔄 Rate Limiting

To prevent abuse, all API endpoints are rate-limited:

- **Standard endpoints:** 100 requests per 15 minutes per IP
- **Strict endpoints:** 10 requests per hour per IP

When rate limit is exceeded:

```json
{
  "success": false,
  "error": "Too many requests",
  "message": "You have exceeded the rate limit. Please try again later."
}
```

---

## � WebSocket Real-time Events

WaQtor provides real-time updates via WebSocket for monitoring session status, QR codes, and incoming messages.

### Connection

**WebSocket URL:** `ws://localhost:8080`

#### Authentication

Include API key in connection URL as query parameter:

```javascript
const ws = new WebSocket('ws://localhost:8080?apiKey=your_api_key_here');

ws.onopen = () => {
  console.log('✅ Connected to WaQtor WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('📨 Event received:', data);
  
  switch(data.event) {
    case 'qr':
      console.log('📱 QR Code:', data.data.qr);
      // Display QR code to user
      break;
    case 'ready':
      console.log('✅ WhatsApp client ready!');
      break;
    case 'authenticated':
      console.log('🔐 Authentication successful');
      break;
    case 'message':
      console.log('💬 New message:', data.data);
      break;
  }
};

ws.onerror = (error) => {
  console.error('❌ WebSocket error:', error);
};

ws.onclose = () => {
  console.log('🔌 WebSocket connection closed');
};
```

### WebSocket Events

#### 🔐 Authentication Failed

Sent when API key is invalid or missing.

```json
{
  "event": "auth_failed",
  "data": {
    "error": "Invalid API key",
    "timestamp": "2025-10-28T10:30:00Z"
  }
}
```

#### 📱 QR Code Generated

Sent when a new QR code is generated for authentication.

```json
{
  "event": "qr",
  "data": {
    "qr": "2@abc123def456...",
    "timestamp": "2025-10-28T10:30:00Z"
  }
}
```

**Usage:**
- Display this QR code to user for WhatsApp scanning
- QR code string can be used with QR code libraries to generate image
- New QR codes are sent approximately every 30 seconds until authenticated

#### ✅ Client Ready

Sent when WhatsApp client is fully initialized and ready to use.

```json
{
  "event": "ready",
  "data": {
    "message": "WhatsApp client is ready",
    "info": {
      "wid": "971501234567@c.us",
      "pushname": "DXBMark Bot",
      "platform": "android"
    },
    "timestamp": "2025-10-28T10:31:00Z"
  }
}
```

#### 🔐 Authenticated

Sent when WhatsApp authentication is successful.

```json
{
  "event": "authenticated",
  "data": {
    "message": "WhatsApp authenticated successfully",
    "timestamp": "2025-10-28T10:30:45Z"
  }
}
```

#### 🔌 Disconnected

Sent when WhatsApp client is disconnected.

```json
{
  "event": "disconnected",
  "data": {
    "reason": "LOGOUT",
    "message": "WhatsApp client disconnected",
    "timestamp": "2025-10-28T12:00:00Z"
  }
}
```

**Disconnect Reasons:**
- `LOGOUT` - User logged out
- `CONFLICT` - Phone connected elsewhere
- `TIMEOUT` - Connection timeout
- `NAVIGATION` - WhatsApp navigation error

#### 💬 Message Received

Sent when a new message is received.

```json
{
  "event": "message",
  "data": {
    "id": "true_971501234567@c.us_3EB0...",
    "from": "971501234567@c.us",
    "to": "971507654321@c.us",
    "body": "Hello! This is a test message.",
    "timestamp": 1730109600,
    "fromMe": false,
    "hasMedia": false,
    "type": "chat",
    "isGroup": false
  }
}
```

**With Media:**

```json
{
  "event": "message",
  "data": {
    "id": "true_971501234567@c.us_3EB0...",
    "from": "971501234567@c.us",
    "body": "",
    "caption": "Check this out!",
    "timestamp": 1730109600,
    "fromMe": false,
    "hasMedia": true,
    "type": "image",
    "mimeType": "image/jpeg"
  }
}
```

#### 📊 Session State Change

Sent when WhatsApp session state changes.

```json
{
  "event": "state_change",
  "data": {
    "state": "CONNECTED",
    "previousState": "OPENING",
    "timestamp": "2025-10-28T10:30:50Z"
  }
}
```

**Possible States:**
- `CONFLICT` - Phone connected elsewhere
- `CONNECTED` - Successfully connected
- `DEPRECATED_VERSION` - WhatsApp Web version outdated
- `OPENING` - Initializing connection
- `PAIRING` - Waiting for QR scan
- `PROXYBLOCK` - Proxy blocked
- `SMB_TOS_BLOCK` - Business ToS violation
- `TIMEOUT` - Connection timeout
- `TOS_BLOCK` - Terms of Service violation
- `UNLAUNCHED` - Not yet launched
- `UNPAIRED` - Not paired with phone
- `UNPAIRED_IDLE` - Unpaired and idle

#### ⚡ Ping/Pong (Keep-alive)

Server sends periodic ping to keep connection alive:

```json
{
  "event": "ping",
  "timestamp": "2025-10-28T10:35:00Z"
}
```

Client should respond with:

```json
{
  "event": "pong",
  "timestamp": "2025-10-28T10:35:00Z"
}
```

### WebSocket Example - React Integration

```javascript
import { useEffect, useState } from 'react';

function WhatsAppMonitor() {
  const [qrCode, setQrCode] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8080?apiKey=${process.env.REACT_APP_API_KEY}`
    );

    ws.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data);

      switch(eventType) {
        case 'qr':
          setQrCode(data.qr);
          setIsReady(false);
          break;

        case 'ready':
          setIsReady(true);
          setQrCode(null);
          console.log('WhatsApp is ready!', data.info);
          break;

        case 'message':
          setMessages(prev => [...prev, data]);
          break;

        case 'disconnected':
          setIsReady(false);
          console.log('Disconnected:', data.reason);
          break;
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      {qrCode && (
        <div>
          <h2>Scan QR Code</h2>
          <QRCodeComponent value={qrCode} />
        </div>
      )}
      
      {isReady && (
        <div>
          <h2>✅ WhatsApp Connected</h2>
          <MessageList messages={messages} />
        </div>
      )}
    </div>
  );
}
```

### WebSocket Example - Node.js Client

```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080?apiKey=your_api_key_here');

ws.on('open', () => {
  console.log('Connected to WaQtor WebSocket');
});

ws.on('message', (data) => {
  const { event, data: eventData } = JSON.parse(data);
  
  switch(event) {
    case 'qr':
      console.log('QR Code received:', eventData.qr);
      // Save or display QR code
      break;
      
    case 'ready':
      console.log('WhatsApp ready!');
      console.log('User:', eventData.info.pushname);
      break;
      
    case 'message':
      console.log(`New message from ${eventData.from}: ${eventData.body}`);
      // Process incoming message
      break;
  }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('WebSocket closed');
  // Implement reconnection logic here
});
```

---

## �📱 Phone Number Format

Phone numbers should be in international format without `+` or spaces:

✅ **Correct:**
- `966501234567` (Saudi Arabia)
- `971501234567` (UAE)
- `201012345678` (Egypt)

❌ **Incorrect:**
- `+966 50 123 4567`
- `0501234567`

**Chat ID Format:**

When using `chatId`, append `@c.us` for individual chats:
- `966501234567@c.us`

For group chats, use `@g.us`:
- `120363012345678901@g.us`

---

## � Best Practices & Tips

### 1. ✅ Always Check Client Status First

Before sending messages, verify WhatsApp is connected:

```javascript
async function sendMessageSafely(phone, message) {
  // Check status
  const status = await fetch('http://localhost:8080/api/status/client', {
    headers: { 'X-API-Key': 'your_key' }
  }).then(r => r.json());

  if (!status.data.ready) {
    throw new Error('WhatsApp not ready. Please scan QR code.');
  }

  // Send message
  return await fetch('http://localhost:8080/api/messages/send-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'your_key'
    },
    body: JSON.stringify({ phone, message })
  }).then(r => r.json());
}
```

### 2. ⏱️ Implement Retry Logic

Handle temporary failures with exponential backoff:

```javascript
async function sendWithRetry(phone, message, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await sendMessageSafely(phone, message);
      if (result.success) return result;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff: 1s, 2s, 4s
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

### 3. 📊 Monitor Rate Limits

Track your usage to avoid rate limiting:

```javascript
class WaQtorClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.requestCount = 0;
    this.resetTime = Date.now() + 15 * 60 * 1000; // 15 minutes
  }

  async request(endpoint, options = {}) {
    // Reset counter if needed
    if (Date.now() > this.resetTime) {
      this.requestCount = 0;
      this.resetTime = Date.now() + 15 * 60 * 1000;
    }

    // Check limit (100 per 15 min)
    if (this.requestCount >= 100) {
      throw new Error('Rate limit reached. Please wait.');
    }

    this.requestCount++;

    return await fetch(`http://localhost:8080${endpoint}`, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }
}
```

### 4. 🔄 Use Bulk Endpoints for Multiple Messages

Instead of looping:

❌ **Don't do this:**
```javascript
for (const contact of contacts) {
  await sendMessage(contact.phone, message); // Slow!
}
```

✅ **Do this:**
```javascript
const recipients = contacts.map(c => ({
  phone: c.phone,
  message: personalizeMessage(message, c)
}));

await fetch('http://localhost:8080/api/messages/send-bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_key'
  },
  body: JSON.stringify({ recipients })
});
```

### 5. 🎯 Use Campaigns for Scheduled Messages

For marketing or announcements:

```javascript
// Create campaign
const campaign = await fetch('http://localhost:8080/api/campaigns/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_key'
  },
  body: JSON.stringify({
    name: 'Weekly Newsletter',
    message: 'Check out this week\'s updates! 📰',
    recipients: subscriberPhones,
    scheduledAt: '2025-11-04T09:00:00Z' // Every Monday 9 AM
  })
}).then(r => r.json());

console.log(`Campaign ${campaign.data.id} scheduled!`);
```

### 6. 🔌 Subscribe to WebSocket for Real-time Updates

Monitor connection status without polling:

```javascript
const ws = new WebSocket('ws://localhost:8080?apiKey=your_key');

ws.onmessage = ({ data }) => {
  const { event, data: eventData } = JSON.parse(data);
  
  if (event === 'disconnected') {
    // Alert user/admin
    console.error('WhatsApp disconnected!', eventData.reason);
    sendAlertEmail('WhatsApp connection lost');
  }
  
  if (event === 'ready') {
    console.log('✅ WhatsApp is online');
  }
};
```

### 7. 📝 Log Everything

Keep audit trails for debugging:

```javascript
async function sendMessageWithLogging(phone, message) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action: 'send_message',
    phone,
    message
  };

  try {
    const result = await sendMessage(phone, message);
    logEntry.success = true;
    logEntry.messageId = result.data.id;
    console.log('✅', logEntry);
    return result;
  } catch (error) {
    logEntry.success = false;
    logEntry.error = error.message;
    console.error('❌', logEntry);
    throw error;
  }
}
```

### 8. 🔒 Secure Your API Key

Never expose API keys in frontend code:

❌ **Don't:**
```javascript
// In React component - WRONG!
const apiKey = 'sk_live_1234567890';
```

✅ **Do:**
```javascript
// Use backend proxy
// Backend (Node.js/Express):
app.post('/api/send-message', async (req, res) => {
  const result = await fetch('http://localhost:8080/api/messages/send-text', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.WAQTOR_API_KEY, // Server-side only
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  });
  res.json(await result.json());
});

// Frontend:
fetch('/api/send-message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone, message })
});
```

### 9. 🧪 Test in Development First

Use the test endpoint:

```javascript
// Quick test without exposing real numbers
await fetch('http://localhost:8080/api/test/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_key'
  },
  body: JSON.stringify({
    message: 'Testing new feature...'
  })
});
```

### 10. 📊 Handle Errors Gracefully

```javascript
async function robustSendMessage(phone, message) {
  try {
    const response = await fetch('http://localhost:8080/api/messages/send-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your_key'
      },
      body: JSON.stringify({ phone, message })
    });

    const data = await response.json();

    if (!response.ok) {
      // HTTP error
      if (response.status === 401) {
        throw new Error('Invalid API key');
      } else if (response.status === 503) {
        throw new Error('WhatsApp not connected. Scan QR code.');
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    }

    if (!data.success) {
      // API returned error
      throw new Error(data.error || data.message);
    }

    return data;
  } catch (error) {
    // Network error
    if (error.name === 'TypeError') {
      throw new Error('Cannot connect to WaQtor server');
    }
    throw error;
  }
}
```

---

## �🛠️ Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

**Common Errors:**

```json
{
  "success": false,
  "error": "API key is required",
  "message": "Provide API key in X-API-Key header or apiKey query parameter"
}
```

```json
{
  "success": false,
  "error": "WhatsApp client not ready",
  "message": "Please scan QR code first"
}
```

```json
{
  "success": false,
  "error": "Phone number is required"
}
```

---

## 🆘 Support & Resources

### 📚 Documentation

- **[Quick Start Guide](../documentation/QUICKSTART.md)** - Get started in 5 minutes
- **[Campaign Management Guide](../documentation/CAMPAIGN_GUIDE.md)** - Master campaign automation
- **[Testing Guide](../documentation/TESTING_GUIDE.md)** - Test your integration
- **[WebSocket Guide](./websocket-session-guide.md)** - Real-time events implementation
- **[Architecture](../documentation/ARCHITECTURE_IMPLEMENTATION.md)** - System design and structure

### 🐛 Getting Help

For issues, questions, or feature requests:

- **GitHub Issues:** [github.com/tariqsaidofficial/WaQtor/issues](https://github.com/tariqsaidofficial/WaQtor/issues)
- **Email:** <info@dxbmark.com>
- **Repository:** [github.com/tariqsaidofficial/WaQtor](https://github.com/tariqsaidofficial/WaQtor)

### 📜 License

This project is licensed under **Apache-2.0**. See [LICENSE](../LICENSE) for details.

### 🤝 Contributing

We welcome contributions! Please see:

- **[Contributing Guide](../CONTRIBUTING.md)**
- **[Code of Conduct](../CODE_OF_CONDUCT.md)**

---

## 🎯 Quick Reference

### Most Common Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/status/client` | GET | Check WhatsApp connection |
| `/api/messages/send-text` | POST | Send text message |
| `/api/messages/send-media` | POST | Send media file |
| `/api/campaigns/create` | POST | Create new campaign |
| `/api/campaigns/:id/execute` | POST | Run campaign now |
| `/api/campaigns/list` | GET | List all campaigns |

### Environment Variables

```env
# Required
API_KEY=your_secure_api_key_here
PORT=8080

# Optional
TEST_PHONE_NUMBER=971501234567
DATABASE_PATH=./runtime/db/waqtor.db
LOG_LEVEL=info
```

### cURL Quick Examples

**Check Status:**
```bash
curl -H "X-API-Key: your_key" http://localhost:8080/api/status/client
```

**Send Message:**
```bash
curl -X POST http://localhost:8080/api/messages/send-text \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"phone":"971501234567","message":"Hello!"}'
```

**Create & Execute Campaign:**
```bash
# Create
CAMPAIGN_ID=$(curl -X POST http://localhost:8080/api/campaigns/create \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","message":"Hi!","recipients":["971501234567"]}' \
  | jq -r '.data.id')

# Execute
curl -X POST http://localhost:8080/api/campaigns/$CAMPAIGN_ID/execute \
  -H "X-API-Key: your_key"
```

---

**Document Version:** 1.1.0  
**Last Updated:** October 28, 2025  
**WaQtor Version:** 1.0.4  
**Built on:** whatsapp-web.js v1.34.1
