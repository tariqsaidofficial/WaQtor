# 🎯 Waqtor Dashboard

Modern, real-time dashboard for Waqtor WhatsApp automation platform.

## 📋 Overview

The Waqtor Dashboard provides a beautiful, responsive interface for managing WhatsApp campaigns, monitoring session status, and sending messages through an intuitive UI.

## ✨ Features

- **Real-time WebSocket Connection** - Live session monitoring and QR code updates
- **Session Management** - Visual QR code scanning and connection status
- **Campaign Management** - Create, schedule, and execute WhatsApp campaigns
- **Message Sending** - Send text, media, and bulk messages
- **Statistics Dashboard** - View message counts, uptime, and performance metrics
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Built with PrimeReact components

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
│   ├── api/                    # API configuration and services
│   │   ├── client.js          # Axios instance with interceptors
│   │   └── services.js        # API endpoint functions
│   ├── components/            # React components
│   │   ├── QRStatusCard.jsx   # WhatsApp QR code display
│   │   ├── SessionStatsCard.jsx # Session statistics
│   │   └── QuickActionsCard.jsx # Quick action buttons
│   ├── hooks/                 # Custom React hooks
│   │   └── useWebSocket.js    # WebSocket connection hook
│   ├── pages/                 # Page components
│   │   └── Dashboard.jsx      # Main dashboard page
│   ├── store/                 # State management
│   │   └── useAppStore.js     # Zustand store
│   ├── App.jsx                # Main app component
│   └── main.jsx               # App entry point
├── public/                    # Static assets
├── .env                       # Environment variables
├── .env.example               # Example environment variables
├── package.json               # Dependencies
├── vite.config.js            # Vite configuration
└── README.md                  # This file
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
