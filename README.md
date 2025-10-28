<div align="center">
    <br />
    <h1>🚀 WaQtor</h1>
    <h3>Smart Automation Engine for WhatsApp</h3>
    <p><strong>"A new vector for intelligent communication."</strong></p>
    <br />
    <p>
        <a href="https://github.com/tariqsaidofficial/WaQtor"><img src="https://img.shields.io/badge/WhatsApp_Web-2.3000.1017054665-brightgreen.svg" alt="WhatsApp_Web 2.3000.1017054665" /></a>
        <a href="https://github.com/tariqsaidofficial/WaQtor/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License" /></a>
        <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen" alt="Node" /></a>
        <a href="https://www.npmjs.com/package/waqtor"><img src="https://img.shields.io/npm/v/waqtor.svg" alt="npm" /></a>
    </p>
    <br />
</div>

## 🎯 About

**WaQtor** is a **smart automation framework** that empowers developers and teams to build scalable communication systems over WhatsApp.

It connects seamlessly through the **official WhatsApp Web browser app**, ensuring secure, real-time interactions — without requiring access to Meta's Business API.

The library launches the WhatsApp Web browser app via Puppeteer, accessing its internal functions and creating a managed instance to reduce the risk of being blocked. This gives the API client nearly all WhatsApp Web features for dynamic use in a Node.js application.

Designed for performance and simplicity, WaQtor helps you:
- 🤖 Automate message workflows and campaigns
- ⏰ Schedule and manage outbound communication
- 📊 Track message delivery, response rates, and engagement
- 🔌 Integrate WhatsApp into existing dashboards or SaaS tools

> **In essence, WaQtor acts as your intelligent bridge between automation logic and the WhatsApp Web interface — combining reliability, control, and extensibility within one open-source framework.**

> [!IMPORTANT]
> **It is not guaranteed you will not be blocked by using this method. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.**

---

## 🧱 Core Architecture

The WaQtor engine follows a modular design that connects all layers seamlessly:

```
┌──────────────────────┐
│ REST API Layer       │ ← Express.js server for endpoints
├──────────────────────┤
│ whatsapp-web.js      │ ← Connects via the official WhatsApp Web app
├──────────────────────┤
│ SQLite Database      │ ← Tracks campaigns, messages, and logs
├──────────────────────┤
│ Docker Environment   │ ← Isolated runtime + persistent volumes
└──────────────────────┘
```

- **REST API** — exposes endpoints for sending text/media, templates, and campaigns.
- **whatsapp-web.js** — handles WebSocket connection and message events.
- **SQLite** — lightweight persistence for campaigns and delivery tracking.
- **Docker** — isolates sessions, ensures reproducibility, and secures volumes.

---

## 📚 Documentation & Links

### Quick Access
- 📖 **[Quick Start Guide](./QUICKSTART.md)** - Get started in 60 seconds
- 📋 **[Complete Setup](./SETUP_SUMMARY.md)** - Detailed setup instructions
- 🧪 **[Testing Guide](./TESTING_GUIDE.md)** - How to test the application
- 🏗️ **[Architecture](./ARCHITECTURE_IMPLEMENTATION.md)** - Technical architecture details
- 📡 **[API Documentation](./runtime/README.md)** - Full API reference
- 📝 **[Final Summary](./FINAL_SUMMARY.md)** - Complete project overview
- 🔒 **[Security Guidelines](./SECURITY.md)** - Security best practices
- 🤝 **[Contributing](./CONTRIBUTING.md)** - How to contribute

### External Links
- [GitHub Repository][gitHub]
- [Official Guide][guide] ([source][guide-source])
- [API Documentation][documentation] ([source][documentation-source])
- [Issues & Support][issues]

## ⚡ Installation

Install WaQtor via npm:

```bash
npm install waqtor
```

Or clone the repository:

```bash
git clone https://github.com/tariqsaidofficial/WaQtor.git
cd WaQtor
npm install
```

> [!NOTE]
> **Node `v18` or higher is required.**  
> See the [Guide][guide] for quick upgrade instructions.

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Copy environment configuration
cp runtime/config/.env.example runtime/config/.env

# Edit .env and set your API key and test phone number
nano runtime/config/.env

# Build and run with Docker
npm run docker:build
npm run docker:run

# View logs to scan QR code
npm run docker:logs
```

Scan the QR code using **WhatsApp → Linked Devices → "Link a device"**.  
Your REST API will be available at `http://localhost:8080`.

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Copy environment configuration
cp runtime/config/.env.example runtime/config/.env

# Edit .env file
nano runtime/config/.env

# Start development server (with auto-reload)
npm run dev

# Or production mode
npm start
```

### Configure Your Environment

Edit `runtime/config/.env`:

```bash
# Change this API key for security!
API_KEY=waqtor_your_secure_key_here

# Add your phone number for testing (format: country code + number, no spaces)
# Example: 966501234567 for Saudi Arabia
TEST_PHONE_NUMBER=your_phone_number_here
```

> [!IMPORTANT]
> **Never commit your `.env` file!** It contains sensitive data and is already in `.gitignore`.

---

## 💡 Example usage

```js
const { Client } = require('whatsapp-web.js');

const client = new Client();

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();
```

Take a look at [example.js][examples] for more examples with additional use cases.  
For further details on saving and restoring sessions, explore the provided [Authentication Strategies][auth-strategies].

---

## 🚀 Features & REST API

### ✨ Core Features

- **REST API:** Send text, images, PDFs, and templates
- **Campaign Management:** Create, schedule, and track bulk messaging campaigns
- **Docker-first:** One-command deployment with persistent volumes
- **Session Security:** Session files generated only at runtime, never committed
- **SQLite Tracking:** Logs every campaign and message delivery
- **Rate Limiting:** Built-in protection against API abuse
- **Personal Testing:** Secure endpoint for testing with your own phone number

### 🔧 Quick Testing

After starting the server, test with your personal number:

```bash
# Check if test phone number is configured
curl -X GET http://localhost:8080/api/test/info \
  -H "X-API-Key: your_api_key_here"

# Send a test message to your configured number
curl -X POST http://localhost:8080/api/test/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{"message": "Hello from Waqtor! 🚀"}'
```

### 📡 REST API Overview

All endpoints require authentication via `X-API-Key` header.

#### Messages

**Send Text Message**
```bash
POST /api/messages/send-text
{
  "chatId": "966501234567@c.us",
  "text": "Hello from Waqtor!"
}
```

**Send Media (Image, Video, Document)**
```bash
POST /api/messages/send-media
{
  "chatId": "966501234567@c.us",
  "media": "https://example.com/image.jpg",
  "caption": "Check this out!"
}
```

**Send Bulk Messages**
```bash
POST /api/messages/send-bulk
{
  "recipients": ["966501234567@c.us", "966501234568@c.us"],
  "text": "Bulk message to all!"
}
```

#### Campaigns

**Create Campaign**
```bash
POST /api/campaigns/create
{
  "name": "New Year Sale",
  "recipients": ["966501234567@c.us", "966501234568@c.us"],
  "message": "Happy New Year! 50% off all items!",
  "scheduleAt": "2025-01-01T00:00:00Z"
}
```

**List All Campaigns**
```bash
GET /api/campaigns/list
```

**Get Campaign by ID**
```bash
GET /api/campaigns/:id
```

**Update Campaign Status**
```bash
PUT /api/campaigns/:id/status
{
  "status": "paused"
}
```

**Delete Campaign**
```bash
DELETE /api/campaigns/:id
```

#### Status & Client Info

**Get WhatsApp Client Status**
```bash
GET /api/status/client
```

**Get Client Info**
```bash
GET /api/status/info
```

**Get All Chats**
```bash
GET /api/status/chats
```

**Logout**
```bash
POST /api/status/logout
```

#### Test Endpoints (Personal Testing)

**Check Test Configuration**
```bash
GET /api/test/info
```

**Send Test Message**
```bash
POST /api/test/send
{
  "message": "Test message from Waqtor!"
}
```

> [!TIP]
> For complete API documentation with examples, see [runtime/README.md](./runtime/README.md).

---

## 📋 Supported features

| Feature  | Status |
| ------------- | ------------- |
| Multi Device  | ✅  |
| Send messages  | ✅  |
| Receive messages  | ✅  |
| Send media (images/audio/documents)  | ✅  |
| Send media (video)  | ✅ [(requires Google Chrome)][google-chrome]  |
| Send stickers | ✅ |
| Receive media (images/audio/video/documents)  | ✅  |
| Send contact cards | ✅ |
| Send location | ✅ |
| Send buttons | ❌  [(DEPRECATED)][deprecated-video] |
| Send lists | ❌  [(DEPRECATED)][deprecated-video] |
| Receive location | ✅ | 
| Message replies | ✅ |
| Join groups by invite  | ✅ |
| Get invite for group  | ✅ |
| Modify group info (subject, description)  | ✅  |
| Modify group settings (send messages, edit info)  | ✅  |
| Add group participants  | ✅  |
| Kick group participants  | ✅  |
| Promote/demote group participants | ✅ |
| Mention users | ✅ |
| Mention groups | ✅ |
| Mute/unmute chats | ✅ |
| Block/unblock contacts | ✅ |
| Get contact info | ✅ |
| Get profile pictures | ✅ |
| Set user status message | ✅ |
| React to messages | ✅ |
| Create polls | ✅ |
| Channels | ✅ |
| Vote in polls | 🔜 |
| Communities | 🔜 |

Something missing? Make an issue and let us know!

---

## 🎨 Design System (DXBMark Style)

**Color Palette**

- **Primary:** `#0A84FF`   **Accent:** `#00C2A8`
- **Success:** `#16A34A`  **Warning:** `#F59E0B`  **Error:** `#DC2626`
- **Neutral BG:** `#0E1116` **Text:** `#E6EAF2`

**Typography**

- Headings: **Outfit 600**
- Body: **Inter 400–500**

**Iconography**

- Lucide React (stroke 1.75 px)

**Buttons**

- Rounded-2xl, clean focus ring, soft shadows.

**Toasts (PrimeReact)**

- Positions: `top-right` and `bottom-right`
- Levels: `success`, `info`, `warn`, `error`

---

## 🔐 Session Security

- `server/session/` is ignored in `.gitignore`.
- Sessions generate only at runtime in Docker volumes.
- Forks or public deploys can enforce read-only mode via:

```bash
READONLY_FORK=true
```

- Cloudflare Workers proxy optional for secure exposure.

---

## 🧰 Cloudflare & Deployment

- Use Cloudflare Worker as reverse proxy to hide API origin.
- Enforce HTTPS, rate limiting, and IP allowlists.
- Works natively with Docker Compose or any container runtime.

---

## 🤝 Contributing

Feel free to open pull requests; we welcome contributions! However, for significant changes, it's best to open an issue beforehand. Make sure to review our [contribution guidelines][contributing] before creating a pull request. Before creating your own issue or pull request, always check to see if one already exists!

---

## 💖 Supporting the project

You can support the maintainer of this project through the links below:

- [GitHub Sponsors - Tariq Said][gitHub-sponsors]
- [Buy Me a Coffee][buy-coffee]

---

## 📈 Upcoming / TODO

- [ ] Minimal Admin Dashboard (React + PrimeReact)
- [ ] Webhooks: delivered / read / failed
- [ ] Multi-session Management
- [ ] Template Library + Variables
- [ ] Analytics & CSV Export

---


## ⚖️ Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or its affiliates. The official WhatsApp website can be found at [whatsapp.com][whatsapp]. "WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners. Also it is not guaranteed you will not be blocked by using this method. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.

---

## 🪪 License & Attribution

This project is a **Custom Implementation** built upon [whatsapp-web.js][original-repo] by Pedro S. Lopez.

**Licensed under Apache License 2.0** → see [LICENSE](./LICENSE)

**Modifications & Enhancements** © 2025 Tariq Said (DXBMark)

Retain attributions and mark major code changes clearly.

### Original License

Copyright 2019 Pedro S Lopez

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this project except in compliance with the License.  
You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software  
distributed under the License is distributed on an "AS IS" BASIS,  
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and  
limitations under the License.

---

## 📚 Credits

Created & maintained by **Tariq Said (DXBMark)**

**WaQtor** — built with precision, simplicity, and vision.

### 📧 Contact & Support

- **Technical Support**: [support@dxbmark.com](mailto:support@dxbmark.com)
- **General Inquiries**: [info@dxbmark.com](mailto:info@dxbmark.com)
- **GitHub Issues**: [Report a Bug](https://github.com/tariqsaidofficial/WaQtor/issues)

---

[guide]: https://guide.wwebjs.dev/guide
[guide-source]: https://github.com/wwebjs/wwebjs.dev/tree/main
[documentation]: https://docs.wwebjs.dev/
[documentation-source]: https://github.com/pedroslopez/whatsapp-web.js/tree/main/docs
[gitHub]: https://github.com/tariqsaidofficial/WaQtor
[original-repo]: https://github.com/pedroslopez/whatsapp-web.js
[issues]: https://github.com/tariqsaidofficial/WaQtor/issues
[examples]: https://github.com/tariqsaidofficial/WaQtor/blob/main/example.js
[auth-strategies]: https://wwebjs.dev/guide/creating-your-bot/authentication.html
[google-chrome]: https://wwebjs.dev/guide/creating-your-bot/handling-attachments.html#caveat-for-sending-videos-and-gifs
[deprecated-video]: https://www.youtube.com/watch?v=hv1R1rLeVVE
[gitHub-sponsors]: https://github.com/sponsors/tariqsaidofficial
[buy-coffee]: https://buymeacoffee.com/tariqsaid
[contributing]: https://github.com/tariqsaidofficial/WaQtor/blob/main/CODE_OF_CONDUCT.md
[whatsapp]: https://whatsapp.com

