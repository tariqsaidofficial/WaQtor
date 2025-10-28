# 🚀 Waqtor - Getting Started

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **Git**
- **Docker** (optional, for containerized deployment)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tariqsaidofficial/Waqtor.git
cd Waqtor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy example environment file
cp runtime/config/.env.example runtime/config/.env

# Edit the environment file
nano runtime/config/.env
```

**Important:** Change the default API key in `.env`:
```env
API_KEY=your_secure_api_key_here
```

## 🎯 Running Waqtor

### Development Mode

```bash
npm run dev
```

This will start the server with auto-reload on code changes.

### Production Mode

```bash
npm start
```

### First Time Setup

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Scan QR Code**
   - A QR code will appear in the terminal
   - Open WhatsApp on your phone
   - Go to: Settings → Linked Devices → Link a Device
   - Scan the QR code

3. **Wait for Connection**
   - You'll see: "✅ WhatsApp client is ready"
   - The server is now ready to accept API requests

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# Build the image
npm run docker:build

# Start the containers
npm run docker:run

# View logs
npm run docker:logs
```

### Manual Docker Commands

```bash
# Build
docker build -f docker/Dockerfile -t waqtor:latest .

# Run
docker-compose -f docker/docker-compose.yml up -d

# Stop
docker-compose -f docker/docker-compose.yml down
```

## 🧪 Testing the API

### Health Check

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-28T...",
  "service": "Waqtor API",
  "version": "1.34.1"
}
```

### Send a Test Message

```bash
curl -X POST http://localhost:8080/api/messages/send-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "phone": "1234567890",
    "message": "Hello from Waqtor!"
  }'
```

### Check Client Status

```bash
curl http://localhost:8080/api/status/client \
  -H "X-API-Key: your_api_key_here"
```

## 📡 API Examples

### Using cURL

#### Send Text Message
```bash
curl -X POST http://localhost:8080/api/messages/send-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "phone": "1234567890",
    "message": "Hello!"
  }'
```

#### Send Media
```bash
curl -X POST http://localhost:8080/api/messages/send-media \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "phone": "1234567890",
    "mediaUrl": "https://example.com/image.jpg",
    "caption": "Check this out!"
  }'
```

### Using JavaScript (fetch)

```javascript
const sendMessage = async () => {
  const response = await fetch('http://localhost:8080/api/messages/send-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'your_api_key'
    },
    body: JSON.stringify({
      phone: '1234567890',
      message: 'Hello from JavaScript!'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

sendMessage();
```

### Using Python

```python
import requests

url = "http://localhost:8080/api/messages/send-text"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "your_api_key"
}
data = {
    "phone": "1234567890",
    "message": "Hello from Python!"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

## 🔒 Security Best Practices

1. **Never commit `.env` files**
   - The `.env` file contains sensitive data
   - Always use `.env.example` as a template

2. **Change default API key**
   - Generate a strong, random API key
   - Use different keys for development and production

3. **Use HTTPS in production**
   - Never expose the API over plain HTTP in production
   - Use a reverse proxy (nginx, Caddy) with SSL

4. **Keep sessions secure**
   - Session files contain authentication tokens
   - Never share or expose `runtime/server/session/` directory

5. **Regular updates**
   - Keep Waqtor and all dependencies up to date
   - Run `npm audit` regularly

## 📂 Project Structure

```
Waqtor-main/
├── runtime/               ← New runtime layer
│   ├── server/           ← Express API server
│   ├── config/           ← Configuration files
│   └── logs/             ← Application logs
├── src/                  ← Core WhatsApp library (untouched)
├── tests/                ← Test scripts
├── docker/               ← Docker configuration
├── package.json          ← Updated with new scripts
└── README.md            ← Main documentation
```

## 🆘 Troubleshooting

### Server won't start

**Problem:** Port already in use
```bash
Error: listen EADDRINUSE: address already in use :::8080
```

**Solution:** Change the port in `.env`:
```env
PORT=3000
```

### QR code not appearing

**Problem:** Puppeteer/Chromium not installed

**Solution:**
```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y chromium-browser

# Or rebuild dependencies
npm rebuild
```

### API returns 401 Unauthorized

**Problem:** Missing or invalid API key

**Solution:** Ensure you're sending the API key:
```bash
-H "X-API-Key: your_api_key_here"
```

### WhatsApp disconnects frequently

**Problem:** Session file corruption

**Solution:**
```bash
# Remove session files
rm -rf runtime/server/session/*
rm -rf .wwebjs_auth/*

# Restart server and scan QR code again
npm run dev
```

## 📚 Next Steps

1. **Read the full documentation** in `/runtime/README.md`
2. **Explore API endpoints** - Try all available endpoints
3. **Set up campaigns** - Create automated message campaigns
4. **Deploy to production** - Use Docker for production deployment
5. **Monitor logs** - Check logs for issues and usage patterns

## 💡 Tips

- **Development**: Use `npm run dev` for auto-reload
- **Testing**: Test endpoints with Postman or cURL first
- **Logging**: Check `runtime/logs/` for detailed logs
- **Database**: Use SQLite browser to inspect the database
- **Docker**: Use Docker for consistent deployments

## 🤝 Need Help?

- **Issues**: https://github.com/tariqsaidofficial/Waqtor/issues
- **Documentation**: Check `/runtime/README.md` for API docs
- **Community**: Join discussions on GitHub

---

**Happy Automating! 🎉**

Waqtor - Smart Automation Engine for WhatsApp  
Maintained by Tariq Said (DXBMark)
