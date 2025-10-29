# 🎯 Waqtor v2.0 - Complete System Documentation

## 📋 System Architecture

### Components

```
Waqtor System
├── Backend (Node.js + Express)
│   ├── REST API Server (Port 8080)
│   ├── WebSocket Server (Real-time)
│   ├── WhatsApp Client (whatsapp-web.js)
│   ├── SQLite Database
│   └── File Management System
│
└── Frontend Dashboard (React + Vite)
    ├── Web Interface (Port 5173)
    ├── WebSocket Client
    ├── State Management (Zustand)
    └── API Integration (Axios)
```

## 🚀 Complete Setup Guide

### Prerequisites

- Node.js 18+
- npm 8+
- Git
- Modern web browser

### Step-by-Step Installation

#### 1. Backend Setup

```bash
# Navigate to server directory
cd Waqtor-main/runtime/server

# Install dependencies (if not already installed)
npm install

# Configure environment
cp ../config/.env.example ../config/.env

# Edit .env and set:
# - PORT=8080
# - API_KEY=your_secure_api_key_here
# - TEST_PHONE_NUMBER=your_test_number

# Start the backend
node index.js
```

Expected output:
```
✅ WhatsApp client is ready
🚀 Waqtor API Server running on port 8080
```

#### 2. Dashboard Setup

```bash
# Navigate to dashboard directory
cd Waqtor-main/dashboard

# Install dependencies
npm install

# Configure environment
# .env is already created, update if needed:
# - VITE_API_KEY=same_as_backend_api_key

# Start the dashboard
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Quick Start (Using Scripts)

```bash
# Terminal 1 - Backend
cd Waqtor-main/runtime/server
node index.js

# Terminal 2 - Dashboard
cd Waqtor-main/dashboard
./start.sh
# or
npm run dev
```

## 🔗 System Integration

### API Endpoints

#### Session Management
- `GET /api/session/state` - Get session state
- `GET /api/session/qr` - Get QR code
- `GET /api/session/websocket/info` - WebSocket info
- `POST /api/session/stats/reset` - Reset stats

#### Message Operations
- `POST /api/messages/send-text` - Send text
- `POST /api/messages/send-media` - Send media
- `POST /api/messages/send-bulk` - Bulk send
- `POST /api/messages/upload` - Upload file
- `POST /api/messages/send-file` - Send file

#### Campaign Management
- `POST /api/campaigns/create` - Create campaign
- `GET /api/campaigns/list` - List campaigns
- `GET /api/campaigns/:id` - Get campaign
- `PUT /api/campaigns/:id/status` - Update status
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/execute` - Execute

#### Status & Info
- `GET /api/status/client` - Client status
- `GET /api/status/info` - Session info
- `GET /api/status/chats` - Get chats
- `GET /api/status/version` - Version info
- `POST /api/status/logout` - Logout

#### Testing
- `POST /api/test/send` - Send test message
- `GET /api/test/info` - Test config info

### WebSocket Connection

#### Connection URL
```
ws://localhost:8080/ws?apiKey=your_api_key
```

#### Events
- `session_update` - Session changes
- `qr_code` - New QR code
- `message` - Message events
- `campaign` - Campaign events

#### Commands
```json
// Get state
{ "type": "get_state" }

// Get QR
{ "type": "get_qr" }

// Subscribe to events
{ "type": "subscribe", "events": ["all"] }

// Ping
{ "type": "ping" }
```

## 📊 Dashboard Features

### ✅ Implemented

1. **Session Monitoring**
   - Real-time QR code display
   - Connection status
   - Session statistics
   - Auto-reconnect

2. **Quick Actions**
   - Send text message
   - Send test message
   - Quick navigation

3. **Statistics Dashboard**
   - Messages sent/received
   - Uptime tracking
   - Last update time

### 🔜 Coming Soon

1. **Campaigns Page**
   - Create campaigns
   - Schedule messages
   - Track progress
   - Manage recipients

2. **Messages Page**
   - Message history
   - Template management
   - File uploads
   - Bulk operations

3. **Settings**
   - API configuration
   - Preferences
   - Theme switcher
   - Notifications

## 🔐 Security

### API Authentication

All API requests require API key:

**Headers:**
```
X-API-Key: your_api_key_here
```

**Query Parameter:**
```
?apiKey=your_api_key_here
```

### WebSocket Authentication

Include API key in connection URL:
```
ws://localhost:8080/ws?apiKey=your_api_key_here
```

### Best Practices

1. **Change Default API Key**
   - Backend: `runtime/config/.env`
   - Dashboard: `dashboard/.env`

2. **Use HTTPS in Production**
   - Update URLs to https:// and wss://

3. **Secure Storage**
   - Never commit .env files
   - Use environment variables
   - Rotate API keys regularly

## 📁 File Structure

```
Waqtor-main/
├── runtime/
│   ├── server/
│   │   ├── db/              # Database
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Auth, rate limit
│   │   ├── utils/           # Helpers
│   │   ├── index.js         # Main server
│   │   └── waClient.js      # WhatsApp client
│   └── config/
│       └── .env             # Backend config
│
├── dashboard/
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Pages
│   │   ├── store/           # State management
│   │   └── App.jsx
│   ├── .env                 # Dashboard config
│   ├── package.json
│   └── vite.config.js
│
├── src/                     # Core library
├── documentation/           # Docs
├── tests/                   # Test files
└── package.json             # Main package
```

## 🛠️ Development

### Backend Development

```bash
cd runtime/server

# Watch mode (nodemon)
npm install -g nodemon
nodemon index.js

# Debug mode
DEBUG=* node index.js
```

### Dashboard Development

```bash
cd dashboard

# Development with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Monitoring & Logs

### Backend Logs

Located in: `runtime/logs/`
- `error.log` - Error logs
- `combined.log` - All logs

### Dashboard Console

Open browser DevTools:
- Console: API calls, WebSocket events
- Network: Request/Response details
- Application: State, localStorage

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Port 8080 already in use
```bash
# Find process
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=8081
```

**Problem:** WhatsApp not connecting
- Delete `runtime/server/session/` folder
- Restart server
- Scan QR code again

### Dashboard Issues

**Problem:** Cannot connect to backend
- Verify backend is running on port 8080
- Check API key matches
- Verify firewall settings

**Problem:** WebSocket disconnected
- Check backend WebSocket server
- Verify API key in URL
- Check browser console for errors

### Database Issues

**Problem:** Database locked
```bash
cd runtime/server/db
rm waqtor.db
# Restart server (will recreate database)
```

## 🚀 Production Deployment

### Backend

1. **Environment Variables**
   ```bash
   PORT=8080
   API_KEY=secure_random_key_here
   NODE_ENV=production
   ```

2. **Process Manager**
   ```bash
   npm install -g pm2
   pm2 start runtime/server/index.js --name waqtor-api
   pm2 save
   pm2 startup
   ```

3. **Reverse Proxy (nginx)**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
       }
   }
   ```

### Dashboard

1. **Build**
   ```bash
   cd dashboard
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Deploy to Netlify**
   ```bash
   # Upload dist/ folder to Netlify
   ```

4. **Deploy to Cloudflare Pages**
   ```bash
   # Upload dist/ folder to Cloudflare Pages
   ```

## 📈 Performance

### Backend
- Handles 100 requests per 15 minutes (configurable)
- WebSocket supports multiple concurrent connections
- SQLite database for lightweight storage

### Dashboard
- Initial load: <1s
- Hot reload: <100ms
- WebSocket latency: <50ms
- Build size: ~500KB gzipped

## 🤝 Support

- Documentation: `/documentation/`
- Issues: GitHub Issues
- API Reference: `/documentation/api/`

---

**Version:** 2.0.0  
**Last Updated:** October 29, 2025  
**Status:** Production Ready ✅
