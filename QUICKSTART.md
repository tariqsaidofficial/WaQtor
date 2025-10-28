# 🚀 Waqtor - Quick Start Guide

## ⚡ Super Quick Start (60 seconds)

### Step 1: Configure Your Environment (30 seconds)

```bash
# Copy environment file
cp runtime/config/.env.example runtime/config/.env

# Edit it (use nano, vim, or any text editor)
nano runtime/config/.env
```

**Set these two values:**
```bash
API_KEY=your_secure_key_here          # Change this!
TEST_PHONE_NUMBER=966501234567        # Your phone with country code
```

### Step 2: Start the Server (30 seconds)

**Option A: Using Docker (Recommended)**
```bash
npm run docker:build && npm run docker:run
npm run docker:logs    # View logs and QR code
```

**Option B: Using Node.js**
```bash
npm install           # First time only
npm run dev           # Development mode with auto-reload
```

### Step 3: Scan QR Code

1. Look for QR code in the terminal/logs
2. Open WhatsApp on your phone
3. Go to: **Settings → Linked Devices → Link a device**
4. Scan the QR code

✅ **Done! Your API is running on http://localhost:8080**

---

## 🧪 Test Your Setup

### 1. Check Server Health

```bash
curl http://localhost:8080/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-09T...",
  "service": "Waqtor API",
  "version": "1.34.1"
}
```

### 2. Check Test Configuration

```bash
curl -X GET http://localhost:8080/api/test/info \
  -H "X-API-Key: your_api_key_here"
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "configured": true,
    "message": "Test phone number is configured...",
    "phoneNumberMasked": "***1234"
  }
}
```

### 3. Send Yourself a Test Message

```bash
curl -X POST http://localhost:8080/api/test/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{"message": "Hello from Waqtor! 🚀 This is a test message."}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Test message sent successfully",
  "data": {
    "id": "...",
    "timestamp": 1234567890,
    "to": "TEST_PHONE_NUMBER (hidden for security)"
  }
}
```

✅ **Check your WhatsApp - you should receive the message!**

---

## 🔧 Automated Health Check

Run the automated health check script:

```bash
# Make it executable (first time only)
chmod +x health-check.sh

# Run the health check
./health-check.sh

# Or with custom API key
API_KEY=your_key ./health-check.sh
```

---

## 📡 Common API Examples

### Send a Text Message

```bash
curl -X POST http://localhost:8080/api/messages/send-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "chatId": "966501234567@c.us",
    "text": "Hello! This is a message from Waqtor."
  }'
```

### Send an Image

```bash
curl -X POST http://localhost:8080/api/messages/send-media \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "chatId": "966501234567@c.us",
    "media": "https://example.com/image.jpg",
    "caption": "Check out this image!"
  }'
```

### Create a Campaign

```bash
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "Welcome Campaign",
    "recipients": ["966501234567@c.us", "966501234568@c.us"],
    "message": "Welcome to our service!",
    "scheduleAt": "2025-01-10T10:00:00Z"
  }'
```

### List All Campaigns

```bash
curl -X GET http://localhost:8080/api/campaigns/list \
  -H "X-API-Key: your_api_key_here"
```

### Get Client Status

```bash
curl -X GET http://localhost:8080/api/status/client \
  -H "X-API-Key: your_api_key_here"
```

---

## 🐳 Docker Commands

```bash
# Build the image
npm run docker:build

# Start containers
npm run docker:run

# View logs (includes QR code)
npm run docker:logs

# Stop containers
npm run docker:stop

# Restart containers
npm run docker:stop && npm run docker:run
```

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run single test file
npm run test-single tests/quick-test.js

# Generate documentation
npm run generate-docs

# Interactive shell
npm run shell
```

---

## ❌ Troubleshooting

### Server won't start

**Problem:** Port 8080 already in use  
**Solution:** Change `PORT` in `.env` or kill the process using port 8080

```bash
# Find process on port 8080
lsof -ti:8080

# Kill it (macOS/Linux)
kill -9 $(lsof -ti:8080)

# Or change port in .env
PORT=3000
```

### QR code not appearing

**Problem:** Client initialization failed  
**Solutions:**
1. Check logs: `npm run docker:logs` or look at terminal output
2. Make sure Chrome/Chromium is installed
3. Check Puppeteer logs in `runtime/logs/`
4. Try deleting session: `rm -rf runtime/server/session/*`

### API returns 401 Unauthorized

**Problem:** API key is incorrect or missing  
**Solutions:**
1. Check your `.env` file has `API_KEY` set
2. Make sure you're sending `X-API-Key` header
3. Verify the API key matches between `.env` and your request

### Test endpoint returns "TEST_PHONE_NUMBER not configured"

**Problem:** Test phone number not set in `.env`  
**Solution:** Add your phone number to `.env`:

```bash
TEST_PHONE_NUMBER=966501234567  # Your country code + number
```

### Messages not sending

**Possible causes:**
1. WhatsApp not connected → Scan QR code again
2. Wrong phone number format → Use `countrycode + number@c.us`
3. Number not on WhatsApp → Verify the number exists on WhatsApp
4. Rate limiting → Wait and try again

**Debug steps:**
```bash
# Check client status
curl http://localhost:8080/api/status/client -H "X-API-Key: your_key"

# Check logs
npm run docker:logs
# or
tail -f runtime/logs/app.log
```

---

## 📚 Next Steps

1. ✅ **Read the full documentation:** `README.md`
2. ✅ **Explore API endpoints:** `runtime/README.md`
3. ✅ **Review architecture:** `ARCHITECTURE_IMPLEMENTATION.md`
4. ✅ **Check security guidelines:** `SECURITY.md`
5. ✅ **Learn to contribute:** `CONTRIBUTING.md`

---

## 🆘 Getting Help

- **Issues:** https://github.com/tariqsaidofficial/Waqtor/issues
- **Documentation:** See `documentation/` folder
- **Examples:** See `tests/` folder

---

## ✅ Checklist

Before going to production, make sure:

- [ ] Changed default API key in `.env`
- [ ] Added test phone number to `.env`
- [ ] Tested all major endpoints
- [ ] Reviewed security settings
- [ ] Set up HTTPS (in production)
- [ ] Configured backups for SQLite database
- [ ] Set up monitoring and logging
- [ ] Reviewed rate limiting settings

---

**🎉 You're all set! Happy coding with Waqtor!**

*Need more help? Check `FINAL_SUMMARY.md` for comprehensive information.*
