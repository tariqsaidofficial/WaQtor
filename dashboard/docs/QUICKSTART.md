# 🚀 Quick Start Guide - Waqtor Dashboard

## Prerequisites Checklist

✅ Node.js 18+ installed  
✅ Waqtor backend running on port 8080  
✅ API key configured  

## Installation (3 Steps)

### 1️⃣ Navigate to Dashboard

```bash
cd /Users/sunmarke/Downloads/Waqtor-main/dashboard
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

The `.env` file is already created with default values:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_API_KEY=waqtor_default_key_change_me
```

**⚠️ Important:** Update `VITE_API_KEY` to match your backend API key!

## Running the Dashboard

### Development Mode

```bash
npm run dev
```

🌐 Open: http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

## First Time Setup

1. **Start Backend Server** (in separate terminal)
   ```bash
   cd /Users/sunmarke/Downloads/Waqtor-main/runtime/server
   node index.js
   ```

2. **Start Dashboard** (in separate terminal)
   ```bash
   cd /Users/sunmarke/Downloads/Waqtor-main/dashboard
   npm run dev
   ```

3. **Open Browser**
   - Navigate to: http://localhost:5173
   - You should see the Dashboard with QR code section

4. **Connect WhatsApp**
   - Scan the QR code with WhatsApp
   - Wait for "Connected Successfully!" message

## Features Available Now

✅ Real-time session monitoring  
✅ QR code display and scanning  
✅ Session statistics (messages sent/received, uptime)  
✅ Quick send message  
✅ Send test message  
✅ WebSocket live updates  

## Troubleshooting

### Problem: "WebSocket Disconnected"

**Solution:**
- Check if backend server is running
- Verify `VITE_WS_URL` in `.env` matches backend URL
- Check API key is correct

### Problem: "API Key Error"

**Solution:**
- Update `VITE_API_KEY` in `.env` to match backend
- Default backend key: `waqtor_default_key_change_me`

### Problem: "Cannot Connect"

**Solution:**
```bash
# Check if backend is running
curl http://localhost:8080/health

# Should return: {"status":"ok",...}
```

## Next Steps

After successful setup, you can:

1. 📱 **Send Messages** - Use the quick action buttons
2. 📊 **View Statistics** - Monitor message counts and uptime
3. 🔄 **Test Real-time Updates** - Watch status changes live
4. 📢 **Create Campaigns** (Coming Soon)

## Directory Structure

```
dashboard/
├── src/
│   ├── api/              # API client & services ✅
│   ├── components/       # React components ✅
│   ├── hooks/            # Custom hooks ✅
│   ├── pages/            # Page components ✅
│   ├── store/            # State management ✅
│   └── App.jsx
├── .env                  # Environment config ✅
└── package.json
```

## What's Working

✅ Dashboard page  
✅ QR code scanning  
✅ Session monitoring  
✅ WebSocket connection  
✅ REST API integration  
✅ Send messages  
✅ Statistics display  

## What's Coming Next

🔜 Campaigns page  
🔜 Messages history  
🔜 Contacts management  
🔜 Scheduling interface  
🔜 Analytics dashboard  

---

**Need Help?** Check the main [README.md](./README.md) or contact support.
