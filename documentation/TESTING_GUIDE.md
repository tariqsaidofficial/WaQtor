# 🧪 Waqtor Testing Guide

## 🎯 Quick Test Commands

### 1. Health Check (No Auth Required)
```bash
curl http://localhost:8080/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-28T...",
  "service": "Waqtor API",
  "version": "1.34.1"
}
```

---

### 2. API Endpoints List
```bash
curl http://localhost:8080/api
```

**Expected Response:**
```json
{
  "message": "Waqtor REST API",
  "version": "1.34.1",
  "endpoints": { ... }
}
```

---

### 3. Check WhatsApp Client Status
```bash
curl http://localhost:8080/api/status/client \
  -H "X-API-Key: waqtor_default_key_change_me_in_production"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "connected",
    "ready": true,
    "state": "CONNECTED"
  }
}
```

---

## 🔐 Setting Up Your Test Phone Number

### Step 1: Create `.env` file
```bash
cp runtime/config/.env.example runtime/config/.env
```

### Step 2: Edit `.env` and add your phone number
```bash
nano runtime/config/.env
```

Add your number (format: country code + number, NO spaces):
```env
# Example for Saudi Arabia
TEST_PHONE_NUMBER=966501234567

# Example for Egypt
TEST_PHONE_NUMBER=201012345678

# Example for UAE
TEST_PHONE_NUMBER=971501234567

# Your custom API key (change this!)
API_KEY=your_secure_key_here_12345
```

### Step 3: Restart the server
```bash
# Stop current server (Ctrl+C)
# Then start again
npm run dev
```

---

## 📱 Testing with Your Number

### Check if test number is configured
```bash
curl http://localhost:8080/api/test/info \
  -H "X-API-Key: your_secure_key_here_12345"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "configured": true,
    "message": "Test phone number is configured...",
    "phoneNumberMasked": "***4567"
  }
}
```

### Send a test message to your number
```bash
curl -X POST http://localhost:8080/api/test/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secure_key_here_12345" \
  -d '{
    "message": "مرحباً! هذه رسالة تجريبية من Waqtor 🚀"
  }'
```

**Response:**
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

---

## 🧪 Testing All Features

### 1. Send Message to Specific Number
```bash
curl -X POST http://localhost:8080/api/messages/send-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secure_key_here_12345" \
  -d '{
    "phone": "966501234567",
    "message": "Hello from Waqtor!"
  }'
```

### 2. Send Media
```bash
curl -X POST http://localhost:8080/api/messages/send-media \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secure_key_here_12345" \
  -d '{
    "phone": "966501234567",
    "mediaUrl": "https://example.com/image.jpg",
    "caption": "Check this image!"
  }'
```

### 3. Create Campaign
```bash
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secure_key_here_12345" \
  -d '{
    "name": "Test Campaign",
    "message": "Welcome to our service!",
    "recipients": ["966501234567", "966501234568"]
  }'
```

### 4. Get Session Info
```bash
curl http://localhost:8080/api/status/info \
  -H "X-API-Key: your_secure_key_here_12345"
```

### 5. Get All Chats
```bash
curl http://localhost:8080/api/status/chats \
  -H "X-API-Key: your_secure_key_here_12345"
```

---

## 🔒 Security Notes

### ✅ What is Safe
- ✅ `.env` file is in `.gitignore` - won't be committed
- ✅ Your `TEST_PHONE_NUMBER` stays private
- ✅ API key is only in your local `.env`

### ⚠️ Important
1. **Never commit `.env`** - It contains your private data
2. **Change default API key** - Don't use the example key
3. **Use `.env.example`** as template only

---

## 🐛 Troubleshooting

### Problem: "TEST_PHONE_NUMBER not configured"
**Solution:** Make sure you added it to `.env`:
```env
TEST_PHONE_NUMBER=966501234567
```

### Problem: "API key is required"
**Solution:** Include the header:
```bash
-H "X-API-Key: your_api_key_here"
```

### Problem: Message not sending
**Solutions:**
1. Check WhatsApp client status: `GET /api/status/client`
2. Check phone number format (no spaces, no +)
3. Check logs: `runtime/logs/combined.log`

---

## 📊 Testing Checklist

- [ ] Health check works (`/health`)
- [ ] API list shows (`/api`)
- [ ] WhatsApp client is ready (`/api/status/client`)
- [ ] Test number configured in `.env`
- [ ] Test message sent successfully
- [ ] Message to specific number works
- [ ] Campaign created successfully
- [ ] All endpoints respond correctly

---

## 🎯 Next Steps

1. **Test locally** with your number
2. **Verify** all endpoints work
3. **Check logs** for any errors
4. **Deploy** to production when ready

---

**Happy Testing! 🚀**

Waqtor - Smart Automation Engine for WhatsApp  
Maintained by Tariq Said (DXBMark)
