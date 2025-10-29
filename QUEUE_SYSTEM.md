# 🔄 WaQtor Queue System Documentation

## 📋 Overview

WaQtor now includes a **Hybrid Queue System** powered by **Bull** and **Redis** for efficient bulk message processing.

### 🎯 Features

- ⚡ **Instant Mode**: Messages ≤10 recipients sent immediately
- 🔄 **Queue Mode**: Messages >10 recipients queued for background processing
- 📊 **Real-time Monitoring**: Bull Board dashboard for queue visualization
- 🔁 **Auto Retry**: Failed jobs automatically retry with exponential backoff
- 💾 **Persistent Storage**: Redis-backed queue survives server restarts
- 📈 **Progress Tracking**: Real-time progress updates for each job

---

## 🏗️ Architecture

```
┌─────────────┐
│  Dashboard  │
│  (Frontend) │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│         API Server                  │
│  ┌──────────────────────────────┐  │
│  │  Hybrid Mode Logic           │  │
│  │  • ≤10: Instant              │  │
│  │  • >10: Queue                │  │
│  └──────────────────────────────┘  │
│           │              │          │
│           ▼              ▼          │
│     ┌─────────┐    ┌─────────┐    │
│     │ Instant │    │  Queue  │    │
│     │  Send   │    │ Manager │    │
│     └─────────┘    └────┬────┘    │
│                          │          │
└──────────────────────────┼──────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Redis     │
                    │   (Queue)    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Worker     │
                    │  Processor   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  WhatsApp    │
                    │    Client    │
                    └──────────────┘
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Message Processing
MESSAGE_DELAY=2000          # 2 seconds between messages
MAX_RETRIES=3               # Max retry attempts
```

### Hybrid Mode Threshold

Default: **10 recipients**

To change, edit `/runtime/server/routes/message.js`:
```javascript
const INSTANT_THRESHOLD = 10; // Change this value
```

---

## 📊 WhatsApp Limits & Best Practices

### Daily Limits

| Account Type | Daily Limit | Recommended |
|--------------|-------------|-------------|
| **New Account** (< 2 weeks) | 50-100 | 20/hour max |
| **Regular Account** (1 month) | 250-500 | 50/hour max |
| **Trusted Account** (3-6 months) | 1000+ | 100/hour max |
| **Business API** | Unlimited | Pay per message |

### ⚠️ Avoid Getting Banned

1. **Delay Between Messages**: 2-3 seconds minimum
2. **Personalize Messages**: Use variables (`{name}`, `{phone}`)
3. **Avoid Spam Patterns**: Don't send identical messages
4. **Use Known Contacts**: Avoid random numbers
5. **Gradual Increase**: Start small, increase slowly

### Message Delay Calculation

```javascript
// Current: 2 seconds per message
// 100 messages = ~3.5 minutes
// 500 messages = ~17 minutes
// 1000 messages = ~34 minutes
```

---

## 🚀 Usage

### Frontend (Dashboard)

```javascript
// Automatic - no code changes needed!
// ≤10 recipients: Instant mode
// >10 recipients: Queue mode

// Response for Instant Mode
{
  success: true,
  mode: 'instant',
  data: {
    total: 5,
    successful: 5,
    failed: 0,
    results: [...]
  }
}

// Response for Queue Mode
{
  success: true,
  mode: 'queue',
  data: {
    jobId: '12345',
    total: 100,
    status: 'queued',
    estimatedTime: '~3 minutes'
  }
}
```

### Backend API

```bash
# Send bulk messages
POST /api/messages/send-bulk
{
  "recipients": [
    {"phone": "966501234567", "message": "Hello John!"},
    {"phone": "966507654321", "message": "Hello Jane!"}
  ]
}

# Get queue statistics
GET /api/queue/stats

# Get recent jobs
GET /api/queue/jobs?limit=50

# Get job status
GET /api/queue/jobs/:jobId

# Pause queue
POST /api/queue/pause

# Resume queue
POST /api/queue/resume

# Clean old jobs
POST /api/queue/clean
```

---

## 📈 Monitoring

### Bull Board Dashboard

Access the queue monitoring dashboard:

```
http://localhost:8080/admin/queues
```

**Authentication**: Requires `X-API-Key` header

### Features

- 📊 Real-time queue statistics
- 📋 Job list with status
- 🔍 Job details and logs
- ⏸️ Pause/Resume queue
- 🗑️ Clean old jobs
- 📈 Performance metrics

### Queue Statistics

```javascript
{
  waiting: 10,    // Jobs waiting to be processed
  active: 2,      // Jobs currently processing
  completed: 150, // Successfully completed jobs
  failed: 3,      // Failed jobs
  delayed: 0,     // Scheduled for later
  total: 165      // Total jobs
}
```

---

## 🔧 Installation

### 1. Install Dependencies

```bash
cd /Users/sunmarke/Downloads/Waqtor-main
npm install
```

New packages added:
- `bull@^4.16.3` - Queue management
- `ioredis@^5.4.1` - Redis client
- `@bull-board/api@^5.21.4` - Queue monitoring
- `@bull-board/express@^5.21.4` - Express adapter

### 2. Start Redis

**Using Docker:**
```bash
docker-compose up -d redis
```

**Using Homebrew (Mac):**
```bash
brew install redis
brew services start redis
```

**Using APT (Ubuntu):**
```bash
sudo apt install redis-server
sudo systemctl start redis
```

### 3. Start Server

```bash
npm start
```

---

## 🧪 Testing

### Test Instant Mode (≤10 recipients)

```bash
curl -X POST http://localhost:8080/api/messages/send-bulk \
  -H "X-API-Key: test-api-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": [
      {"phone": "966501234567", "message": "Test 1"},
      {"phone": "966507654321", "message": "Test 2"}
    ]
  }'
```

### Test Queue Mode (>10 recipients)

```bash
# Create a file with 15 recipients
curl -X POST http://localhost:8080/api/messages/send-bulk \
  -H "X-API-Key: test-api-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": [
      {"phone": "966501234567", "message": "Test 1"},
      ... (15 total)
    ]
  }'
```

### Check Queue Status

```bash
curl http://localhost:8080/api/queue/stats \
  -H "X-API-Key: test-api-key-123"
```

---

## 🐛 Troubleshooting

### Redis Connection Failed

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solution**:
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not running, start it
docker-compose up -d redis
# OR
brew services start redis
```

### Queue Not Processing

**Check**:
1. Redis is running
2. Queue processor initialized
3. Check logs: `tail -f runtime/logs/combined.log`

**Restart**:
```bash
npm restart
```

### Jobs Stuck in Active State

**Solution**:
```bash
# Clean stuck jobs
curl -X POST http://localhost:8080/api/queue/clean \
  -H "X-API-Key: test-api-key-123"
```

---

## 📚 API Reference

### Queue Service (Frontend)

```javascript
import { queueService } from '../api/services';

// Get statistics
const stats = await queueService.getStats();

// Get recent jobs
const jobs = await queueService.getJobs(50);

// Get job status
const status = await queueService.getJobStatus('job-id');

// Pause queue
await queueService.pause();

// Resume queue
await queueService.resume();

// Clean old jobs (24 hours)
await queueService.clean();

// Check health
const health = await queueService.getHealth();
```

---

## 🎯 Performance Optimization

### Recommended Settings

```javascript
// For high volume (1000+ messages/day)
MESSAGE_DELAY=2000          // 2 seconds
INSTANT_THRESHOLD=5         // Queue after 5

// For low volume (< 100 messages/day)
MESSAGE_DELAY=1000          // 1 second
INSTANT_THRESHOLD=20        // Queue after 20
```

### Redis Optimization

```bash
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

---

## 🔐 Security

### API Key Authentication

All queue endpoints require authentication:

```bash
curl http://localhost:8080/api/queue/stats \
  -H "X-API-Key: your-api-key-here"
```

### Bull Board Access

Protected by API key authentication. Access only via:
- Authenticated API requests
- Secure admin panel

---

## 📝 Changelog

### Version 2.1.0 - Queue System

- ✅ Added Bull Queue integration
- ✅ Added Redis support
- ✅ Implemented Hybrid Mode (Instant + Queue)
- ✅ Added Bull Board monitoring dashboard
- ✅ Added queue management API endpoints
- ✅ Updated frontend to handle queue responses
- ✅ Added progress tracking
- ✅ Added auto-retry mechanism
- ✅ Improved message delay (2 seconds)

---

## 🤝 Contributing

Found a bug or have a suggestion? Please open an issue!

---

## 📄 License

Apache-2.0 License - See LICENSE file for details

---

## 🙏 Credits

- **Bull**: Robust queue system for Node.js
- **Redis**: In-memory data structure store
- **Bull Board**: Beautiful queue monitoring dashboard
- **WaQtor Team**: For the amazing WhatsApp automation platform

---

**Happy Messaging! 🚀📱**
