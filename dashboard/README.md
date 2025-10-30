# 🎯 WaQtor Dashboard v2.2.0

Modern, real-time dashboard for WaQtor WhatsApp automation platform with advanced settings and full branding customization.

## 📋 Overview

The WaQtor Dashboard provides a beautiful, responsive interface for managing WhatsApp campaigns, SmartBot automation, monitoring session status, and complete appearance customization through an intuitive UI.

## ✨ Features

### 🔄 Real-time Features
- **WebSocket Connection** - Live session monitoring and QR code updates (50-100x faster!)
- **Live Statistics** - Messages sent/received update instantly
- **Session Management** - Visual QR code scanning and connection status
- **Platform Recognition** - Clear platform names (WhatsApp Business, etc.)
- **Date & Timezone Display** - Automatic timezone detection

### 🤖 SmartBot System
- **AI-Powered Auto-Replies** - Intelligent response matching
- **Bilingual Support** - Arabic & English language detection
- **Smart Matching** - Fuzzy search with 80% accuracy threshold
- **Response Variations** - Multiple reply options for natural conversation
- **Profanity Filter** - Built-in content moderation
- **Typing Indicator** - Realistic human-like delays
- **Reply History** - Track all automated responses

### 📊 Reports & Analytics
- **Real-time Charts** - Message statistics with Chart.js
- **Date Range Filtering** - Custom period analysis
- **Performance Metrics** - Response rates, success rates, avg response time
- **Export to CSV** - Download reports for external analysis
- **Interactive Visualizations** - Line charts, bar charts, pie charts

### 📨 Campaign Management
- **Bulk Messaging** - Send to multiple contacts
- **CSV Import** - Upload contact lists
- **Message Templates** - Save and reuse templates
- **Scheduling** - Schedule campaigns for later
- **Progress Tracking** - Real-time campaign status

### 🎨 Advanced Settings (NEW in v2.2.0)
- **Complete Appearance Customization** - Full branding control
- **Theme Switcher** - Light/Dark themes (Lara Teal)
- **Scale Control** - Adjust UI size (12-16px)
- **Branding Settings**:
  - App Name customization
  - Browser Tab Title
  - Logo Upload (PNG/SVG)
  - Logo Text with show/hide toggle
  - Favicon Upload
  - Footer Text customization
  - Show/Hide Footer toggle
- **API Key Management** - Generate, save, and manage API keys
- **Session Controls** - Logout, restart, and delete sessions
- **Real-time Updates** - Changes apply instantly across the dashboard
- **Auto-Save** - All settings saved to localStorage

### 🎯 Interactive Messages
- **Button Messages** - Send messages with interactive buttons
- **List Messages** - Send selection lists
- **Quick Replies** - Pre-defined response options

### 📱 UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Built with PrimeReact components
- **Icon Fixes** - All PrimeReact icons display correctly
- **Button Consistency** - Unified button styles and sizes
- **Compact Layout** - All settings visible without scrolling

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 13 | React Framework with SSR |
| **UI Library** | PrimeReact | Enterprise UI components |
| **State Management** | Zustand | Lightweight global state |
| **Data Fetching** | React Query + Axios | API communication |
| **WebSocket** | Native WebSocket API | Real-time updates |
| **Styling** | PrimeFlex + SASS | CSS utilities |
| **Language** | TypeScript | Type-safe development |

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Waqtor backend server running

### Steps

1. **Navigate to dashboard directory**
```bash
cd dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Install additional required packages**
```bash
npm install zustand react-query axios react-qr-code
```

4. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and set your configuration:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_API_KEY=your_api_key_here
```

## 🚀 Running the Dashboard

### Development Mode
```bash
npm run dev
```

The dashboard will be available at: `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── app/                           # Next.js app directory
│   │   ├── (main)/                    # Main layout group
│   │   │   ├── campaigns/             # Campaign management pages
│   │   │   ├── interactive/           # Interactive messages pages
│   │   │   ├── reports/               # Reports & analytics pages
│   │   │   ├── settings/              # Settings pages
│   │   │   ├── smartbot/              # SmartBot management pages
│   │   │   ├── page.tsx               # Dashboard home page
│   │   │   └── layout.tsx             # Main layout wrapper
│   │   ├── globals.css                # Global styles
│   │   └── layout.tsx                 # Root layout
│   ├── components/
│   │   ├── layout/                    # Layout components
│   │   │   ├── AppFooter.tsx          # Footer with branding
│   │   │   ├── AppMenu.tsx            # Sidebar navigation
│   │   │   ├── AppTopbar.tsx          # Header with logo & user menu
│   │   │   └── context/               # Layout context
│   │   ├── Settings/                  # Settings components
│   │   │   ├── AppearanceSettings.tsx # Theme & branding settings
│   │   │   ├── APIKeyCard.tsx         # API key management
│   │   │   └── SessionControls.tsx    # Session control buttons
│   │   ├── smartbot/                  # SmartBot components
│   │   │   ├── RuleList.tsx           # Auto-reply rules list
│   │   │   ├── EditorDialog.tsx       # Rule editor dialog
│   │   │   └── ReplyHistory.tsx       # Reply history viewer
│   │   ├── QRStatusCard.tsx           # QR code display
│   │   ├── SessionStatsCard.tsx       # Session statistics
│   │   └── QuickActionsCard.tsx       # Quick action buttons
│   ├── contexts/                      # React contexts
│   │   └── SessionContext.tsx         # Session state management
│   ├── hooks/                         # Custom React hooks
│   │   ├── useWebSocket.js            # WebSocket connection
│   │   └── useErrorHandler.js         # Error handling
│   ├── store/                         # State management
│   │   └── useAppStore.js             # Zustand global store
│   ├── utils/                         # Utility functions
│   │   └── errorHandler.js            # Error handling utilities
│   └── types/                         # TypeScript type definitions
│       ├── demo.d.ts                  # Demo types
│       ├── layout.d.ts                # Layout types
│       └── index.d.ts                 # General types
├── public/
│   ├── layout/
│   │   └── images/                    # Logo and branding images
│   ├── themes/                        # PrimeReact theme files
│   │   ├── lara-light-teal/          # Light theme
│   │   └── lara-dark-teal/           # Dark theme
│   └── favicon.ico                    # Site favicon
├── .env                               # Environment variables
├── .env.example                       # Example environment variables
├── package.json                       # Dependencies
├── next.config.js                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
├── IMPLEMENTATION_PLAN.md             # Development roadmap
└── README.md                          # This file
```

## 🔌 API Integration

The dashboard communicates with the Waqtor backend through:

### REST API Endpoints
- `/api/session/state` - Get current session state
- `/api/session/qr` - Get QR code
- `/api/messages/send-text` - Send text message
- `/api/campaigns/*` - Campaign management
- `/api/status/*` - System status

### WebSocket Events
- `session_update` - Session state changes
- `qr_code` - New QR code generated
- `message` - New message events
- `campaign` - Campaign events

---

**Built with ❤️ by the Waqtor Team**
