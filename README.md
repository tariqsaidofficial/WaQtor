<div align="center">
    <br />
    <h1>🚀 WaQtor</h1>
    <h3>Smart Automation Engine for WhatsApp</h3>
    <p><strong>"A new vector for intelligent communication."</strong></p>
    <br />
    <p>
        <a href="https://github.com/tariqsaidofficial/WaQtor"><img src="https://img.shields.io/badge/WaQtor-v2.2.0-blue.svg" alt="WaQtor v2.2.0" /></a>
        <a href="https://www.npmjs.com/package/waqtor"><img src="https://img.shields.io/npm/v/waqtor.svg?color=blue" alt="npm version" /></a>
        <a href="https://github.com/tariqsaidofficial/WaQtor/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License" /></a>
        <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen" alt="Node" /></a>
        <a href="https://github.com/tariqsaidofficial/WaQtor/actions"><img src="https://img.shields.io/github/workflow/status/tariqsaidofficial/WaQtor/Publish%20to%20npm?label=build" alt="Build Status" /></a>
    </p>
    <br />
</div>

---

## 🔗 Quick Links

<div align="center">

| 🚀 [Quick Start](#-quick-start) | 📡 [API Docs](./runtime/README.md) | 🎨 [Dashboard](./dashboard/README.md) | 🪝 [Webhooks](#-upcoming--todo) | 📝 [Changelog](./CHANGELOG.md) |
|:---:|:---:|:---:|:---:|:---:|

</div>

---

## 🆕 What's New in v2.2.0

**October 30, 2025** - Enhanced Settings & UI Improvements Release!

### ⚙️ Advanced Settings System (NEW!)
- 🎨 **Complete Appearance Customization** - Full branding control
- 🔧 **API Management** - Generate, save, and manage API keys
- 📊 **Session Controls** - Logout, restart, and delete sessions
- 🎯 **Compact UI** - All settings visible without scrolling
- 🌓 **Theme Switcher** - Light/Dark themes (Lara Teal)
- 📏 **Scale Control** - Adjust UI size (12-16px)
- 🏢 **Branding Settings**:
  - App Name customization
  - Browser Tab Title
  - Logo Upload (PNG/SVG)
  - Logo Text with show/hide toggle
  - Favicon Upload
  - Footer Text customization
  - Show/Hide Footer toggle
- 🔄 **Real-time Updates** - Changes apply instantly across the dashboard
- 💾 **Auto-Save** - All settings saved to localStorage

### 🎨 UI/UX Improvements
- ✨ **Icon Fixes** - All PrimeReact icons display correctly
- 🎯 **Button Consistency** - Unified button styles and sizes
- 📱 **Responsive Layout** - Optimized for all screen sizes
- 🔲 **InputGroup Fix** - Proper alignment for input fields and buttons
- 🎨 **Focus States** - Removed distracting focus box-shadows
- 🖼️ **Header/Footer Integration** - Fully connected with settings

### 🔧 Technical Improvements
- 🗑️ **Code Cleanup** - Removed unused CSS overrides
- ⚡ **Performance** - Lighter theme files
- 🎯 **Event System** - Proper branding-update events
- 📦 **Simplified Themes** - Only Teal Light/Dark (removed 10+ unused themes)

---

## 📜 Previous Release - v2.1.0

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

## 🔄 Compatibility Matrix

| Component | Version | Status | Notes |
|-----------|---------|--------|-------|
| **Node.js** | ≥18.0.0 | ✅ Required | v20.x LTS recommended |
| **whatsapp-web.js** | 1.34.1 | ✅ Stable | Last upstream sync: Oct 28, 2025 |
| **Puppeteer** | 23.11.1 | ✅ Stable | Chrome/Chromium automation |
| **Chrome/Chromium** | 131+ | ✅ Compatible | Auto-downloaded by Puppeteer |
| **npm** | 9.0+ | ✅ Supported | Package manager |

### Update Policy

- **Security Patches**: Applied within 48 hours of disclosure
- **Minor Updates**: Monthly review cycle for dependencies
- **Major Updates**: Tested in staging before production release
- **Breaking Changes**: Announced 2 weeks in advance with migration guide

### Browser Compatibility

- **Chrome/Chromium**: Primary support (auto-managed by Puppeteer)
- **Headless Mode**: Fully supported for production deployments
- **ARM64**: Compatible with Apple Silicon and ARM servers

---

## 🔒 Security & Anti-Ban Notes

> [!WARNING]
> **WhatsApp does not officially support bots or automation.** Use WaQtor responsibly to minimize ban risks.

### Best Practices for Safe Usage

#### ⚠️ Rate Limits (Recommended)
- **Messages per hour**: Max 50-100 messages
- **Messages per day**: Max 500-1000 messages
- **Delay between messages**: 3-5 seconds minimum
- **Bulk campaigns**: Spread over 24-48 hours

#### 🛡️ Anti-Ban Strategies
1. **Use Business Accounts**: WhatsApp Business has higher tolerance
2. **Warm Up New Numbers**: Start with 10-20 messages/day, gradually increase
3. **Avoid Spam Patterns**: Vary message content, use natural delays
4. **Monitor Session Health**: Watch for warnings in dashboard
5. **Respect User Blocks**: Stop messaging users who block you
6. **Use SmartBot Wisely**: Enable typing indicators and realistic delays

#### 🚨 Disconnection Scenarios

| Scenario | Cause | Recovery |
|----------|-------|----------|
| **QR Code Expired** | Session timeout (>24h inactive) | Re-scan QR code |
| **Logged Out** | Manual logout from phone | Re-authenticate |
| **Banned** | Rate limit violation | Wait 24-48h, use different number |
| **Network Error** | Connection lost | Auto-reconnect (built-in) |
| **Chrome Crash** | Puppeteer failure | Restart server |

#### 📚 Full Security Guidelines

For comprehensive security practices, see **[SECURITY.md](./SECURITY.md)**:
- API key management
- Session file protection
- Environment variable security
- Webhook authentication

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

### Installation & Setup

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
- Sessions generate only at runtime.
- Forks or public deploys can enforce read-only mode via:

```bash
READONLY_FORK=true
```

- Cloudflare Workers proxy optional for secure exposure.

---

## 🧰 Cloudflare & Deployment

- Use Cloudflare Worker as reverse proxy to hide API origin.
- Enforce HTTPS, rate limiting, and IP allowlists.

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

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. QR Code Not Appearing

**Symptoms**: Server starts but no QR code in logs

```bash
# Enable debug logging
DEBUG=* LOG_LEVEL=debug npm start

# Check if Chrome is running
ps aux | grep chrome

# Clear session and restart
rm -rf runtime/server/session/*
npm start
```

**Causes**: Puppeteer initialization failure, Chrome not installed, session corruption

---

#### 2. "Session Already Exists" Error

**Symptoms**: Cannot scan QR, session file locked

```bash
# Safe session cleanup
npm stop
rm -rf runtime/server/session/*
npm start
```

**Prevention**: Always stop server before deleting sessions

---

#### 3. Messages Not Sending

**Symptoms**: API returns success but messages don't arrive

```bash
# Check client status
curl -H "X-API-Key: your_key" http://localhost:8080/api/status/client

# Verify phone number format
# Correct: 966501234567@c.us
# Wrong: +966 50 123 4567

# Check logs for errors
npm run logs
```

**Common Causes**: Wrong number format, client disconnected, rate limiting

---

#### 4. High Memory Usage

**Symptoms**: Chrome consuming >2GB RAM

```bash
# Clear Chrome cache
rm -rf runtime/server/session/Default/Cache/*

# Use headless mode (add to .env)
HEADLESS=true
```

**Solution**: Enable headless mode, restart daily, limit concurrent sessions

---

#### 5. "ECONNREFUSED" API Errors

**Symptoms**: Dashboard cannot connect to backend

```bash
# Check if backend is running
curl http://localhost:8080/health

# Verify ports are not blocked
lsof -i :8080
lsof -i :3000

# Check firewall settings
sudo ufw status
```

**Solution**: Ensure backend starts before dashboard, check firewall rules

---

#### 6. WebSocket Connection Failed

**Symptoms**: Dashboard shows "Connecting..." forever

```bash
# Test WebSocket endpoint
wscat -c ws://localhost:8080

# Check CORS settings in runtime/server/index.js
# Verify dashboard URL in CORS whitelist
```

**Solution**: Add dashboard URL to CORS whitelist, restart backend

---

#### 7. "Module Not Found" Errors

**Symptoms**: Import errors after npm install

```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Verify Node version
node --version  # Should be ≥18.0.0
```

---

#### 9. SmartBot Not Responding

**Symptoms**: Auto-replies not working

```bash
# Check if SmartBot is enabled in dashboard
# Verify rules in runtime/server/smartbot-rules.json

# Test rule matching
curl -X POST http://localhost:8080/api/smartbot/test \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

**Common Issues**: Rules disabled, profanity filter blocking, language mismatch

---

#### 10. Session Keeps Disconnecting

**Symptoms**: Frequent re-authentication required

```bash
# Check network stability
ping -c 10 web.whatsapp.com

# Increase timeout (add to .env)
SESSION_TIMEOUT=300000

# Monitor session health
tail -f runtime/server/logs/app.log | grep -i "disconnect"
```

**Causes**: Network instability, WhatsApp server issues, rate limiting

---

### Debug Mode

Enable comprehensive logging:

```bash
# Environment variables
DEBUG=waqtor:*,whatsapp-web.js:*
LOG_LEVEL=debug
VERBOSE=true

# Start with debug
DEBUG=* npm start 2>&1 | tee debug.log
```

### Getting Help

If issues persist:
1. Check [GitHub Issues](https://github.com/tariqsaidofficial/WaQtor/issues)
2. Search [Discussions](https://github.com/tariqsaidofficial/WaQtor/discussions)
3. Create new issue with:
   - WaQtor version
   - Node.js version
   - Error logs (last 50 lines)
   - Steps to reproduce

---

## 🛠️ Operations Runbook

### Daily Operations

#### Rotate API Keys

```bash
# Generate new key in dashboard Settings → API Keys
# Or via API
curl -X POST http://localhost:8080/api/settings/generate-key \
  -H "X-API-Key: current_key"

# Update .env file
sed -i 's/API_KEY=old_key/API_KEY=new_key/' runtime/config/.env

# Restart server
npm restart
```

**Frequency**: Every 90 days or after suspected compromise

---

#### Force Logout

```bash
# Via API
curl -X POST http://localhost:8080/api/status/logout \
  -H "X-API-Key: your_key"

# Or via dashboard: Settings → Session → Logout

# Clean session files
rm -rf runtime/server/session/*
```

**Use Cases**: Switching accounts, security incident, testing

---

#### Rebuild Session

```bash
# Stop server
npm stop

# Backup current session (optional)
cp -r runtime/server/session runtime/server/session.backup

# Clear session
rm -rf runtime/server/session/*

# Start and re-scan QR
npm start
```

**When to Use**: Persistent connection issues, corrupted session, account migration

---

#### Restart Worker

```bash
# Graceful restart
npm restart

# Or manually
npm stop
npm start
```

**Triggers**: High memory usage, slow response times, after updates

---

### File & Log Retention Policies

#### Uploaded Files

```bash
# Location: uploads/YYYY-MM-DD/
# Retention: 30 days (auto-cleanup)

# Manual cleanup (files older than 30 days)
find uploads/ -type f -mtime +30 -delete

# Check disk usage
du -sh uploads/
```

#### Application Logs

```bash
# Location: runtime/server/logs/
# Retention: 7 days (rotate daily)

# View recent logs
tail -f runtime/server/logs/app.log

# Archive old logs
tar -czf logs-$(date +%Y%m%d).tar.gz runtime/server/logs/*.log
mv logs-*.tar.gz archives/

# Clean logs older than 7 days
find runtime/server/logs/ -name "*.log" -mtime +7 -delete
```

#### Database Backups

```bash
# Backup campaigns database
cp runtime/server/campaigns.db backups/campaigns-$(date +%Y%m%d).db

# Backup messages database
cp runtime/server/messages.db backups/messages-$(date +%Y%m%d).db

# Compress backups
tar -czf backup-$(date +%Y%m%d).tar.gz backups/*.db

# Keep last 30 days of backups
find backups/ -name "*.db" -mtime +30 -delete
```

#### Session Files

```bash
# Location: runtime/server/session/
# Retention: Until manual logout
# Backup: Before major updates

# Backup session
tar -czf session-backup-$(date +%Y%m%d).tar.gz runtime/server/session/
```

---

### Monitoring Commands

#### Health Check

```bash
# Quick health check
curl http://localhost:8080/health

# Detailed status
curl -H "X-API-Key: your_key" http://localhost:8080/api/status/client
```

#### Resource Usage

```bash
# Memory usage
free -h

# Disk usage
df -h

# Process info
ps aux | grep node
```

#### Connection Status

```bash
# Check open connections
netstat -an | grep :8080

# WebSocket connections
ss -o state established '( sport = :8080 )'
```

---

### Deployment Checklist

#### Pre-Deployment

- [ ] Backup current session files
- [ ] Backup databases (campaigns.db, messages.db)
- [ ] Export SmartBot rules
- [ ] Document current API keys
- [ ] Test in staging environment
- [ ] Review CHANGELOG for breaking changes

#### Deployment

- [ ] Stop current server
- [ ] Pull latest code: `git pull origin main`
- [ ] Install dependencies: `npm install`
- [ ] Run database migrations (if any)
- [ ] Update environment variables
- [ ] Start server: `npm start`
- [ ] Verify health: `curl http://localhost:8080/health`

#### Post-Deployment

- [ ] Check logs for errors: `npm run logs`
- [ ] Test API endpoints
- [ ] Verify WebSocket connection
- [ ] Test SmartBot responses
- [ ] Monitor resource usage
- [ ] Update documentation if needed

---

## 📋 Release Checklist

### Before Publishing a New Version

#### 1. Update Version Numbers

```bash
# Update package.json version
npm version patch  # or minor, or major

# Update version in README.md badges (line 8)
# Update version in runtime/package.json
# Update version in dashboard/package.json
```

#### 2. Update CHANGELOG.md

```markdown
## [vX.X.X] - YYYY-MM-DD

### Added
- New feature descriptions

### Changed
- Modified functionality

### Fixed
- Bug fixes

### Security
- Security patches
```

#### 3. Run Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Linting
npm run lint

# Type checking
npm run type-check
```

#### 4. Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "API"

# Run with coverage
npm run test:coverage
```

#### 5. Update Documentation

- [ ] Update README.md with new features
- [ ] Update API documentation (runtime/README.md)
- [ ] Update dashboard documentation (dashboard/README.md)
- [ ] Add migration guide if breaking changes
- [ ] Update examples if API changed

#### 6. Verify README Badges

```markdown
# Check these badges are up to date:
- Version badge (line 8)
- npm version badge (line 9)
- Node version badge (line 11)
- Build status badge (line 12)
```

#### 7. Create Git Tag

```bash
# Create annotated tag
git tag -a v2.2.0 -m "Release v2.2.0: Enhanced Settings & UI Improvements"

# Push tag
git push origin v2.2.0
```

#### 8. Publish to npm

```bash
# Login to npm
npm login

# Dry run
npm publish --dry-run

# Publish
npm publish

# Verify publication
npm info waqtor
```

#### 9. Create GitHub Release

1. Go to [Releases](https://github.com/tariqsaidofficial/WaQtor/releases)
2. Click "Draft a new release"
3. Select tag: v2.2.0
4. Title: "v2.2.0 - Enhanced Settings & UI Improvements"
5. Copy content from CHANGELOG.md
6. Attach binaries if applicable
7. Publish release

#### 10. Post-Release

- [ ] Announce on GitHub Discussions
- [ ] Update project website (if applicable)
- [ ] Notify users via email/Discord (if applicable)
- [ ] Monitor for issues in first 24 hours

---

### Version Bump Guide

**Patch (x.x.1)**: Bug fixes, security patches
```bash
npm version patch
```

**Minor (x.1.x)**: New features, backward-compatible
```bash
npm version minor
```

**Major (1.x.x)**: Breaking changes
```bash
npm version major
```

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

