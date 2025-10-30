<div align="center">
    <br />
    <h1>🚀 WaQtor</h1>
    <h3>Smart Automation Engine for WhatsApp</h3>
    <p><strong>"A new vector for intelligent communication."</strong></p>
    <br />
    <p>
        <a href="https://github.com/tariqsaidofficial/WaQtor"><img src="https://img.shields.io/badge/WaQtor-v2.1.0-blue.svg" alt="WaQtor v2.1.0" /></a>
        <a href="https://www.npmjs.com/package/waqtor"><img src="https://img.shields.io/npm/v/waqtor.svg?color=blue" alt="npm version" /></a>
        <a href="https://github.com/tariqsaidofficial/WaQtor/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License" /></a>
        <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen" alt="Node" /></a>
        <a href="https://github.com/tariqsaidofficial/WaQtor/actions"><img src="https://img.shields.io/github/workflow/status/tariqsaidofficial/WaQtor/Publish%20to%20npm?label=build" alt="Build Status" /></a>
    </p>
    <br />
</div>

---

## 🆕 What's New in v2.1.0

**October 30, 2025** - Major Dashboard & Feature-Complete Release!

### ✨ Enhanced Dashboard (Phase 3)
- 💻 **Modern React Dashboard** - Built with Next.js 14 + PrimeReact
- 📡 **Real-time WebSocket Updates** - Live statistics without refresh (50-100x faster!)
- 🔲 **Enhanced QR Code Display** - With client info and session details
- 📊 **Live Statistics** - Messages sent/received update instantly
- 📅 **Date & Timezone Display** - Automatic timezone detection
- 📱 **Platform Recognition** - Clear platform names (WhatsApp Business, etc.)
- ⚡ **Dynamic Counters** - No manual refresh needed
- 🎯 **Zustand State Management** - Efficient real-time state
- 📱 **Fully Responsive** - Works perfectly on all devices

### 🤖 SmartBot System (NEW!)
- 🧠 **AI-Powered Auto-Replies** - Intelligent response matching
- 🌍 **Bilingual Support** - Arabic & English language detection
- 🔍 **Smart Matching** - Fuzzy search with 80% accuracy threshold
- 🎭 **Response Variations** - Multiple reply options for natural conversation
- 🚫 **Profanity Filter** - Built-in content moderation
- ⌨️ **Typing Indicator** - Realistic human-like delays
- 📊 **Reply History** - Track all automated responses
- 🛡️ **Anti-Ban Protection** - Random delays and smart throttling

### 📊 Reports & Analytics (NEW!)
- 📈 **Real-time Charts** - Message statistics with Chart.js
- 📅 **Date Range Filtering** - Custom period analysis
- 📊 **Performance Metrics** - Response rates, success rates, avg response time
- 📥 **Export to CSV** - Download reports for external analysis
- 🎨 **Interactive Visualizations** - Line charts, bar charts, pie charts
- 🔄 **Live Data Integration** - Direct connection to smartbot-history.json

### ⚙️ Settings & Configuration (NEW!)
- 🔑 **API Key Management** - Show/hide, copy, generate new keys
- 🎨 **Appearance Settings** - 8 themes, dark mode, compact mode
- 🌍 **Localization** - Date format, timezone, language selection
- 💻 **System Information** - Real-time server status, IP, version, uptime
- 🧩 **Logging Controls** - Enable/disable logging, debug mode
- ⚙️ **Session Management** - Restart, logout, clear session data

### 💬 Interactive Menu System (NEW!)
- 1️⃣ **Number-based Menus** - Simple 1, 2, 3 selection system
- 🌍 **Language Selection** - English/Arabic choice
- 🛒 **Product Catalogs** - Organized product listings
- 🤝 **Service Menus** - Support, Sales, Information routing
- ✅ **Confirmation Dialogs** - Yes/No decision flows
- 💾 **Conversation State** - Persistent user journey tracking

### 📁 File Management System
- 🖼️ **Images arrive as media** with preview (not documents)
- 📁 **Smart organization** - Files in `uploads/YYYY-MM-DD/` folders  
- 📏 **Custom size limits** - Different per file type
- 🗑️ **Auto cleanup** - Files deleted after 30 days
- 👁️ **File preview** - In web interface
- 🧪 **100% tested** - All features verified

**[📖 See full changelog](CHANGELOG.md) • [📚 Documentation](DOCS.md) • [🎨 Dashboard Guide](dashboard/README.md)**

---

## 🎯 About

**WaQtor v1.0.4** is a **smart automation framework** that empowers developers and teams to build scalable communication systems over WhatsApp.

Built on top of [**whatsapp-web.js v1.34.1**](https://github.com/pedroslopez/whatsapp-web.js) by [Pedro S. Lopez](https://github.com/pedroslopez), WaQtor extends the core library with enterprise-grade features including REST API, campaign management, and database integration.

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

## 📋 Version Information

**Current Version:** v2.1.0  
**npm Package:** [waqtor](https://www.npmjs.com/package/waqtor)  
**Latest Release:** [v2.1.0](https://github.com/tariqsaidofficial/WaQtor/releases/tag/v2.1.0)

WaQtor follows [Semantic Versioning](https://semver.org/) (SemVer) for clear version management.

### Built On

- **Base Library:** [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) v1.34.1
- **Original Author:** [Pedro S. Lopez](https://github.com/pedroslopez)
- **Last Upstream Sync:** October 28, 2025

### What's New in WaQtor v2.1.0

**Major Features:**
- ⚡ **Real-time WebSocket Updates** - Message counters update instantly without page refresh
- 🔧 **AuthStore Fix** - Retry logic for stable WhatsApp Web connection
- 📊 **Client Info Display** - Phone number, name, and platform shown in dashboard
- 🌍 **Timezone Support** - Automatic timezone detection and display
- 🔄 **Dynamic Statistics** - All counters update in real-time via WebSocket
- 📱 **Platform Mapping** - Clear platform names (smba → WhatsApp Business Android)
- 🐛 **Hydration Fix** - Resolved UTC vs local timezone mismatch
- 📚 **Comprehensive Docs** - 4 new detailed documentation files

**Performance:**
- 🚀 50-100x faster UI updates (real-time vs manual refresh)
- ⚡ < 100ms update latency
- 🔄 Automatic WebSocket reconnection

**Technical Improvements:**
- Added retry logic for AuthStore initialization
- Enhanced WebSocket broadcast system
- Improved data mapping between backend and frontend
- Better error handling and validation
- Production-ready WebSocket implementation

### What's New in WaQtor v1.0.3

**Bug Fixes:**
- 🐛 **npm README Display** - Fixed README not appearing on npm package page
- 📄 **Package Metadata** - Added explicit `readme` field to package.json
- 🔧 **npm Publishing** - Ensured proper README display on npmjs.com

**Package Info:**
- **Size:** 113.8 kB (compressed) / 493.3 kB (unpacked)
- **Files:** 73
- **npm:** [waqtor@1.0.3](https://www.npmjs.com/package/waqtor)

### WaQtor v1.0.1 - Package Optimization

**Bug Fixes:**
- 🐛 Fixed npm package size (reduced from 76.6 MB to 489.4 kB)
- 🔒 Removed session files from published package
- 📦 Optimized package contents for cleaner installation

### WaQtor v1.0.0 - Initial Release

The first stable release of WaQtor, featuring:

- ✨ **Full whatsapp-web.js v1.34.1 compatibility**
- 🚀 **REST API Layer** - Express.js-based HTTP endpoints
- 📊 **Campaign Management** - Create, track, and execute messaging campaigns
- 🗄️ **SQLite Integration** - Persistent storage for campaigns and logs
- 🐳 **Docker Support** - Production-ready containerization
- 🔒 **API Authentication** - Secure API key-based access control
- ⚡ **Rate Limiting** - Protect against API abuse
- 📝 **Comprehensive Logging** - Winston-based logging system
- 🏥 **Health Checks** - System monitoring endpoints

### Versioning Strategy

For detailed information about our versioning approach, see [VERSIONING.md](VERSIONING.md).

Quick reference:
- **MAJOR** (1.x.x): Breaking changes
- **MINOR** (x.1.x): New features (backward-compatible)
- **PATCH** (x.x.1): Bug fixes and security patches

---

## 🧱 Core Architecture

The WaQtor engine follows a modular, full-stack design that connects all layers seamlessly:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js 14 Dashboard (Port 3000)                │  │
│  │  ├─ Pages: Dashboard, Messages, Campaigns        │  │
│  │  ├─ SmartBot: Rules, History, Editor             │  │
│  │  ├─ Reports: Charts, Analytics, Export           │  │
│  │  ├─ Settings: API Keys, Appearance, System       │  │
│  │  ├─ Interactive: Menu System, Language Selection │  │
│  │  └─ Real-time: WebSocket, Live Updates           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────┐
│                    Backend Layer                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Express.js REST API (Port 8080)                 │  │
│  │  ├─ Routes: /api/messages, /api/campaigns        │  │
│  │  ├─ SmartBot: /api/smartbot (rules, history)     │  │
│  │  ├─ Reports: /api/reports (analytics)            │  │
│  │  ├─ Interactive: /api/interactive (menus)        │  │
│  │  ├─ Auth: API Key validation, Rate limiting      │  │
│  │  └─ WebSocket: Real-time session updates         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                  WhatsApp Layer                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  whatsapp-web.js v1.34.1                         │  │
│  │  ├─ Puppeteer: Chrome automation                 │  │
│  │  ├─ Session: LocalAuth strategy                  │  │
│  │  ├─ Events: message, qr, ready, disconnected     │  │
│  │  └─ SmartBot: Auto-reply message handler         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  SQLite Database                                  │  │
│  │  ├─ campaigns.db: Campaign tracking              │  │
│  │  └─ messages.db: Delivery logs                   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  JSON Storage                                     │  │
│  │  ├─ smartbot-rules.json: Auto-reply rules        │  │
│  │  ├─ smartbot-history.json: Reply history         │  │
│  │  └─ interactive-conversations.json: Menu state   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                Docker Environment                        │
│  ├─ Isolated runtime with persistent volumes           │
│  ├─ Session files: /runtime/server/session/            │
│  ├─ Uploads: /uploads/YYYY-MM-DD/                      │
│  └─ Auto-cleanup: 30-day retention policy              │
└─────────────────────────────────────────────────────────┘
```

### Layer Breakdown

#### 🎨 **Frontend Layer** (`/dashboard`)
- **Framework:** Next.js 14 with App Router
- **UI Library:** PrimeReact (Enterprise-grade components)
- **State:** Zustand for global state, React Context for session
- **Styling:** SCSS modules with WhatsApp-inspired theme (#0f766e)
- **Real-time:** WebSocket client for live updates
- **Features:**
  - 📊 Dashboard with live statistics
  - 💬 Messages page with templates & recipients
  - 📢 Campaigns with CSV upload
  - 🤖 SmartBot management interface
  - 📈 Reports with interactive charts
  - ⚙️ Settings with 6 configuration sections
  - 💬 Interactive menu system

#### ⚙️ **Backend Layer** (`/runtime/server`)
- **Framework:** Express.js with middleware stack
- **Authentication:** API Key-based with rate limiting
- **WebSocket:** Socket.io for real-time updates
- **Services:**
  - `smartbotService.js` - Auto-reply logic
  - `interactiveBotService.js` - Menu conversations
  - `sessionMonitor.js` - Connection tracking
  - `websocketBridge.js` - Real-time broadcasting
- **Utils:**
  - `languageDetector.js` - Arabic/English detection
  - `profanityFilter.js` - Content moderation
  - `smartMatcher.js` - Fuzzy search matching
  - `responseVariations.js` - Natural replies

#### 📱 **WhatsApp Layer**
- **Library:** whatsapp-web.js v1.34.1
- **Browser:** Puppeteer with Chrome
- **Auth:** LocalAuth with persistent sessions
- **Features:** All WhatsApp Web capabilities

#### 💾 **Data Layer**
- **SQLite:** Campaign and message tracking
- **JSON Files:** SmartBot rules, history, conversations
- **File Storage:** Organized uploads with auto-cleanup

#### 🐳 **Docker Layer**
- **Isolation:** Containerized runtime
- **Volumes:** Persistent session and upload storage
- **Security:** Session files never committed to Git

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

### Feature Documentation
- 🤖 **[SmartBot Guide](./documentation/SMARTBOT_BACKEND_IMPLEMENTATION.md)** - Auto-reply system
- 📊 **[Reports Feature](./documentation/REPORTS_FEATURE.md)** - Analytics and charts
- ⚙️ **[Settings Feature](./documentation/SETTINGS_FEATURE.md)** - Configuration options
- 💬 **[Interactive Menus](./INTERACTIVE_BUTTONS_FEATURE.md)** - Menu system guide
- 🌍 **[Language Detection](./documentation/SMARTBOT_LANGUAGE_AWARE.md)** - Bilingual support
- 🚫 **[Profanity Filter](./documentation/SMARTBOT_PROFANITY_FILTER.md)** - Content moderation
- 🎭 **[Response Variations](./documentation/SMARTBOT_PROFESSIONAL_RESPONSES.md)** - Natural replies

### Dashboard Documentation
- 🎨 **[Dashboard Overview](./dashboard/README.md)** - Frontend architecture
- 📱 **[Messages Page](./dashboard/MESSAGES_SELECTION_FIX.md)** - Send messages guide
- 🎯 **[UI Improvements](./dashboard/UI_IMPROVEMENTS.md)** - Design system
- 🔧 **[Settings Page](./dashboard/SETTINGS_IMPROVEMENTS.md)** - Configuration UI
- 📊 **[Session Context](./dashboard/SESSION_CONTEXT_IMPLEMENTATION.md)** - State management

### External Links
- [GitHub Repository][gitHub]
- [Official Guide][guide] ([source][guide-source])
- [API Documentation][documentation] ([source][documentation-source])
- [Issues & Support][issues]

---

## 📚 Documentation

### Git Workflow & Development Guide

- **[📖 Complete Git Workflow Guide](documentation/GIT_WORKFLOW.md)** - دليل شامل لإدارة Git وسير العمل
- **[⚡ Quick Reference](documentation/GIT_QUICK_REFERENCE.md)** - مرجع سريع للأوامر الأكثر استخداماً

### Project Documentation

For more detailed documentation, visit the `documentation/` folder:
- [Getting Started](documentation/GETTING_STARTED.md)
- [Architecture Implementation](documentation/ARCHITECTURE_IMPLEMENTATION.md)
- [Testing Guide](documentation/TESTING_GUIDE.md)
- [Campaign Guide](documentation/CAMPAIGN_GUIDE.md)

---

## ⚡ Installation

### Via npm (Recommended)

Install WaQtor from npm registry:

```bash
# Using npm
npm install waqtor

# Using yarn
yarn add waqtor

# Using pnpm
pnpm add waqtor
```

### From GitHub

Clone and install from source:

```bash
git clone https://github.com/tariqsaidofficial/WaQtor.git
cd WaQtor
npm install
```

### Verify Installation

```bash
# Check installed version
npm list waqtor

# Or check package info
npm info waqtor
```

> [!NOTE]
> **Node `v18` or higher is required.**  
> Current npm package size: **489.4 kB** (unpacked)  
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

#### 📡 Backend Features
- **REST API:** Send text, images, PDFs, and templates
- **Campaign Management:** Create, schedule, and track bulk messaging campaigns
- **SmartBot System:** AI-powered auto-replies with language detection
- **Interactive Menus:** Number-based conversation flows
- **Reports & Analytics:** Real-time statistics with chart visualizations
- **Docker-first:** One-command deployment with persistent volumes
- **Session Security:** Session files generated only at runtime, never committed
- **SQLite Tracking:** Logs every campaign and message delivery
- **Rate Limiting:** Built-in protection against API abuse
- **Personal Testing:** Secure endpoint for testing with your own phone number

#### 🎨 Dashboard Features
- **Modern UI:** Next.js 14 + PrimeReact enterprise components
- **Real-time Updates:** WebSocket-powered live statistics (50-100x faster)
- **SmartBot Management:** Visual rule editor with reply history
- **Reports Dashboard:** Interactive charts with date filtering
- **Settings Panel:** 6 configuration sections (API Keys, Appearance, System Info)
- **Interactive System:** Menu builder for customer conversations
- **Message Templates:** Pre-built templates with variable support
- **CSV Upload:** Bulk recipient import for campaigns
- **Responsive Design:** Works on desktop, tablet, and mobile
- **WhatsApp Theme:** Consistent #0f766e color scheme throughout

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

## 📦 npm Package Information

### Package Stats

- **Package Name:** [waqtor](https://www.npmjs.com/package/waqtor)
- **Current Version:** 1.0.3
- **Package Size:** 113.8 kB (compressed)
- **Unpacked Size:** 493.3 kB
- **Total Files:** 73
- **License:** Apache-2.0
- **Dependencies:** 15
- **Node Version Required:** ≥18.0.0

### Installation Methods

```bash
# Using npm
npm install waqtor

# Using yarn
yarn add waqtor

# Using pnpm
pnpm add waqtor
```

### Package Quality

- ✅ **Clean Package** - No session files or unnecessary data
- ✅ **Type Definitions** - TypeScript declarations included (index.d.ts)
- ✅ **Well Documented** - Comprehensive README and API docs
- ✅ **Actively Maintained** - Regular updates and bug fixes
- ✅ **Secure Publishing** - Published via GitHub Actions with provenance

### Version History

- **v1.0.3** (Latest) - Fixed README display on npm, added readme field to package.json
- **v1.0.1** - Package size optimization, session files removed
- **v1.0.0** - Initial release with full feature set

### Links

- 📦 [npm Package](https://www.npmjs.com/package/waqtor)
- 📊 [npm Stats](https://npm-stat.com/charts.html?package=waqtor)
- 🐛 [Report Issues](https://github.com/tariqsaidofficial/WaQtor/issues)
- 📖 [Changelog](./CHANGELOG.md)
- 🔖 [Releases](https://github.com/tariqsaidofficial/WaQtor/releases)

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

- **npm Package**: [waqtor on npm](https://www.npmjs.com/package/waqtor)
- **Technical Support**: [support@dxbmark.com](mailto:support@dxbmark.com)
- **General Inquiries**: [info@dxbmark.com](mailto:info@dxbmark.com)
- **GitHub Issues**: [Report a Bug](https://github.com/tariqsaidofficial/WaQtor/issues)
- **GitHub Discussions**: [Ask Questions](https://github.com/tariqsaidofficial/WaQtor/discussions)
- **LinkedIn**: [Tariq Said](https://linkedin.com/in/tariqsaidofficial)

### 💝 Support the Project

- ☕ [Buy Me a Coffee](https://buymeacoffee.com/tariqsaidofficial)
- 💖 [GitHub Sponsors](https://github.com/sponsors/tariqsaidofficial)
- 🌐 [DXBMark Support](https://dxbmark.com/support)

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

