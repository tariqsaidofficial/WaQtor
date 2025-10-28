# Waqtor Runtime

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp runtime/config/.env.example runtime/config/.env

# Edit .env and set your API key
nano runtime/config/.env
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Using Docker

```bash
# Build Docker image
npm run docker:build

# Run with Docker Compose
npm run docker:run

# View logs
npm run docker:logs

# Stop containers
npm run docker:stop
```

## 📡 API Endpoints

### Authentication
All API endpoints require an API key. Include it in the request header:
```
X-API-Key: your_api_key_here
```

### Messages

#### Send Text Message
```bash
POST /api/messages/send-text
Content-Type: application/json
X-API-Key: your_api_key

{
  "phone": "1234567890",
  "message": "Hello from Waqtor!"
}
```

#### Send Media
```bash
POST /api/messages/send-media
Content-Type: application/json
X-API-Key: your_api_key

{
  "phone": "1234567890",
  "mediaUrl": "https://example.com/image.jpg",
  "caption": "Check this out!",
  "filename": "image.jpg"
}
```

#### Send Bulk Messages
```bash
POST /api/messages/send-bulk
Content-Type: application/json
X-API-Key: your_api_key

{
  "recipients": [
    { "phone": "1234567890", "message": "Hello 1" },
    { "phone": "0987654321", "message": "Hello 2" }
  ]
}
```

### Campaigns

#### Create Campaign
```bash
POST /api/campaigns/create
Content-Type: application/json
X-API-Key: your_api_key

{
  "name": "Summer Sale",
  "message": "Get 50% off!",
  "recipients": ["1234567890", "0987654321"],
  "scheduledAt": "2025-10-30T10:00:00Z"
}
```

#### List Campaigns
```bash
GET /api/campaigns/list
X-API-Key: your_api_key
```

#### Get Campaign
```bash
GET /api/campaigns/:id
X-API-Key: your_api_key
```

#### Update Campaign Status
```bash
PUT /api/campaigns/:id/status
Content-Type: application/json
X-API-Key: your_api_key

{
  "status": "completed"
}
```

#### Delete Campaign
```bash
DELETE /api/campaigns/:id
X-API-Key: your_api_key
```

### Status

#### Check Client Status
```bash
GET /api/status/client
X-API-Key: your_api_key
```

#### Get Session Info
```bash
GET /api/status/info
X-API-Key: your_api_key
```

#### Logout
```bash
POST /api/status/logout
X-API-Key: your_api_key
```

#### Get Chats
```bash
GET /api/status/chats
X-API-Key: your_api_key
```

### Health Check (No Auth Required)
```bash
GET /health
```

## 🗄️ Database

Waqtor uses SQLite for data persistence. The database file is located at:
```
runtime/server/db/waqtor.db
```

### Tables
- `campaigns` - Campaign information
- `campaign_messages` - Individual message tracking
- `message_logs` - Message history
- `api_keys` - API key management

## 📁 Directory Structure

```
runtime/
├── server/
│   ├── index.js           # Main server file
│   ├── waClient.js        # WhatsApp client wrapper
│   ├── routes/            # API routes
│   │   ├── message.js
│   │   ├── campaign.js
│   │   └── status.js
│   ├── db/                # Database
│   │   ├── schema.sql
│   │   └── db.js
│   ├── utils/             # Utilities
│   │   ├── logger.js
│   │   └── validator.js
│   ├── middlewares/       # Express middlewares
│   │   ├── auth.js
│   │   └── limiter.js
│   └── session/           # WhatsApp session files
├── config/                # Configuration
│   ├── .env.example
│   └── default.json
└── logs/                  # Application logs
```

## 🔒 Security

- **API Keys**: All endpoints (except `/health`) require API key authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable via environment variables
- **Helmet**: Security headers enabled
- **Session Security**: Session files are never exposed

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=8080
NODE_ENV=development

# API Security
API_KEY=your_secret_key_here

# Logging
LOG_LEVEL=info

# Database
DB_PATH=./runtime/server/db/waqtor.db

# WhatsApp Session
SESSION_PATH=./runtime/server/session

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📝 Logging

Logs are stored in:
- `runtime/logs/combined.log` - All logs
- `runtime/logs/error.log` - Error logs only

Console output is also enabled in development mode.

## 🐳 Docker Deployment

### Environment Variables
Create a `.env` file in the root directory:
```env
API_KEY=your_production_api_key_here
```

### Run with Docker Compose
```bash
docker-compose -f docker/docker-compose.yml up -d
```

### Volumes
- `waqtor-sessions` - WhatsApp session data
- `waqtor-db` - SQLite database
- `waqtor-logs` - Application logs
- `waqtor-auth` - WhatsApp auth files
- `waqtor-cache` - Cache data

## 🔍 Troubleshooting

### WhatsApp Not Connecting
1. Check if QR code is displayed in logs
2. Scan QR code with WhatsApp mobile app
3. Wait for "Client is ready" message

### API Not Responding
1. Check if server is running: `curl http://localhost:8080/health`
2. Verify API key is correct
3. Check logs: `npm run docker:logs` or `runtime/logs/`

### Database Errors
1. Ensure SQLite is installed
2. Check write permissions on `runtime/server/db/`
3. Verify schema is created: check for `waqtor.db` file

## 📚 Additional Resources

- [WhatsApp Web.js Documentation](https://wwebjs.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

---

**Waqtor Runtime** - Smart Automation Engine for WhatsApp  
Maintained by Tariq Said (DXBMark)
