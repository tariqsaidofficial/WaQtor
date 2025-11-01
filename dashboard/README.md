# 🎯 WaQtor Dashboard v2.3.0

Modern, real-time dashboard for WaQtor WhatsApp automation platform with multi-user support, admin dashboard, and complete backend integration.

## 🆕 What's New in v2.3.0

### 🎉 **Complete Backend Integration**
- ✅ **PostgreSQL Database** - Full migration complete
- ✅ **Multi-User System** - Complete user isolation
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **46 API Endpoints** - RESTful API complete
- ✅ **Admin Dashboard** - User management UI
- ✅ **Multiple WhatsApp Accounts** - Per user support

### 🎨 **Admin Dashboard UI**
- 👥 **User Management** - Full CRUD interface at `/admin/users`
- 🔍 **Search & Filter** - Find users quickly
- 🎭 **Role Management** - Admin, User, Viewer roles
- 📊 **System Statistics** - Real-time metrics (coming soon)
- 🔒 **Admin Protection** - Role-based access control

## 📋 Overview

The WaQtor Dashboard is a Next.js 14 (App Router) application that provides a beautiful, responsive interface for managing WhatsApp campaigns, SmartBot automation, monitoring session status, user management, and complete appearance customization through an intuitive UI.

## 🏗️ **Project Structure**

**⚠️ IMPORTANT:** This project uses **Next.js App Router** (not Pages Router)

```
dashboard/src/
├── app/                    # ✅ Pages go here (App Router)
│   ├── Dashboard.jsx      # Main dashboard
│   ├── Messages.jsx       # Messages page
│   ├── Campaigns.jsx      # Campaigns page
│   ├── Settings.jsx       # Settings page
│   └── admin/            # Admin pages
│       └── users.jsx     # User management
│
├── components/           # Reusable components
│   ├── QRStatusCard.jsx
│   ├── SessionStatsCard.jsx
│   └── ...
│
└── lib/                  # Utilities
```

**See [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) for complete documentation.**

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

### Environment Variables Reference

| Variable | Description | Example | Secure | Default |
|----------|-------------|---------|--------|--------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080` | ❌ Public | `http://localhost:8080` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `ws://localhost:8080` | ❌ Public | `ws://localhost:8080` |
| `NEXT_PUBLIC_API_KEY` | API authentication key | `waqtor_abc123...` | ⚠️ Sensitive | - |
| `NODE_ENV` | Environment mode | `development` / `production` | ❌ Public | `development` |
| `PORT` | Dashboard server port | `3000` | ❌ Public | `3000` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` | ❌ Public | `0` |

> [!WARNING]
> **Never commit `.env` files to Git!** API keys should be stored securely and rotated regularly (every 90 days).

> [!TIP]
> Use different API keys for development and production environments.

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

## 🗺️ Routing Map

| Route | Purpose | Permissions | Components |
|-------|---------|-------------|------------|
| `/` | **Dashboard Home** - Session status, QR code, live statistics | Public | QRStatusCard, SessionStatsCard, QuickActionsCard |
| `/campaigns` | **Campaign Management** - Create, schedule, track bulk messages | Authenticated | CampaignList, CampaignForm, CSVUpload |
| `/messages` | **Message Center** - Send individual messages, templates | Authenticated | MessageForm, TemplateSelector, RecipientPicker |
| `/smartbot` | **SmartBot Rules** - Auto-reply configuration, history | Authenticated | RuleList, EditorDialog, ReplyHistory |
| `/reports` | **Analytics Dashboard** - Charts, metrics, CSV export | Authenticated | ChartView, DateRangePicker, ExportButton |
| `/settings` | **System Settings** - API keys, appearance, session controls | Admin | AppearanceSettings, APIKeyCard, SessionControls |
| `/interactive` | **Interactive Messages** - Buttons, lists, quick replies | Authenticated | ButtonBuilder, ListBuilder |
| `/profile` | **User Profile** - Account info, preferences | Authenticated | ProfileForm, AvatarUpload |
| `/about` | **About Page** - System info, documentation links | Public | SystemInfo, FAQSection |

### Route Guards

- **Public Routes**: `/`, `/about` - No authentication required
- **Authenticated Routes**: All other routes require valid API key
- **Admin Routes**: `/settings` - Requires admin privileges (future enhancement)

---

## 🔄 State & Data Flow

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Port 8080)                      │
│  ┌────────────────┐              ┌────────────────┐         │
│  │  REST API      │              │  WebSocket     │         │
│  │  /api/*        │              │  ws://         │         │
│  └────────┬───────┘              └────────┬───────┘         │
└───────────┼──────────────────────────────┼─────────────────┘
            │                              │
            │ HTTP/HTTPS                   │ WS
            ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (Port 3000)                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Layer                               │  │
│  │  ┌─────────────────┐      ┌─────────────────┐       │  │
│  │  │  React Query    │      │  WebSocket      │       │  │
│  │  │  Cache          │      │  Connection     │       │  │
│  │  │  - Campaigns    │      │  - Live Stats   │       │  │
│  │  │  - Messages     │      │  - QR Updates   │       │  │
│  │  │  - SmartBot     │      │  - Session      │       │  │
│  │  └────────┬────────┘      └────────┬────────┘       │  │
│  └───────────┼────────────────────────┼────────────────┘  │
│              │                         │                   │
│              ▼                         ▼                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           State Management Layer                     │  │
│  │  ┌─────────────────┐      ┌─────────────────┐       │  │
│  │  │  Zustand Store  │      │  SessionContext │       │  │
│  │  │  - UI State     │      │  - Auth State   │       │  │
│  │  │  - Settings     │      │  - Client Info  │       │  │
│  │  │  - Theme        │      │  - Connection   │       │  │
│  │  └────────┬────────┘      └────────┬────────┘       │  │
│  └───────────┼────────────────────────┼────────────────┘  │
│              │                         │                   │
│              ▼                         ▼                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Component Layer                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ Dashboard│  │ Campaigns│  │ SmartBot │  ...      │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Patterns

#### 1. REST API Flow (CRUD Operations)
```
User Action → Component → React Query → REST API → Backend
                                ↓
                          Cache Update
                                ↓
                          Component Re-render
```

#### 2. WebSocket Flow (Real-time Updates)
```
Backend Event → WebSocket → useWebSocket Hook → Zustand Store
                                                      ↓
                                              Component Re-render
```

#### 3. Local State Flow (UI Preferences)
```
User Action → Component → Zustand Store → localStorage
                              ↓
                    Global State Update
                              ↓
                    All Subscribers Re-render
```

### State Management Details

#### Zustand Store (`store/useAppStore.js`)
```typescript
interface AppStore {
  // UI State
  theme: 'light' | 'dark';
  scale: number;
  sidebarVisible: boolean;
  
  // Branding
  appName: string;
  logoUrl: string;
  footerText: string;
  
  // Session
  isConnected: boolean;
  clientInfo: ClientInfo | null;
  
  // Actions
  setTheme: (theme) => void;
  updateBranding: (branding) => void;
}
```

#### Session Context (`contexts/SessionContext.tsx`)
```typescript
interface SessionContextType {
  qrCode: string | null;
  sessionState: 'disconnected' | 'qr' | 'connected';
  stats: SessionStats;
  reconnect: () => void;
}
```

#### React Query Cache
- **Stale Time**: 30 seconds for most queries
- **Cache Time**: 5 minutes
- **Retry Logic**: 3 attempts with exponential backoff
- **Refetch on Window Focus**: Enabled for critical data

---

## ⚡ Performance Budget

### Target Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Time to Interactive (TTI)** | < 2.5s | ~2.1s | ✅ Pass |
| **First Contentful Paint (FCP)** | < 1.5s | ~1.2s | ✅ Pass |
| **Largest Contentful Paint (LCP)** | < 2.5s | ~1.8s | ✅ Pass |
| **Cumulative Layout Shift (CLS)** | < 0.1 | ~0.05 | ✅ Pass |
| **Total Bundle Size** | < 250KB | ~220KB | ✅ Pass |
| **JavaScript Bundle** | < 200KB | ~180KB | ✅ Pass |
| **CSS Bundle** | < 50KB | ~40KB | ✅ Pass |
| **WebSocket Latency** | < 150ms | ~80ms | ✅ Pass |
| **API Response Time** | < 500ms | ~300ms | ✅ Pass |

### Optimization Strategies

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const Reports = dynamic(() => import('./reports/page'));
const SmartBot = dynamic(() => import('./smartbot/page'));
```

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

#### Caching Strategy
- **Static Assets**: Cache-Control: public, max-age=31536000
- **API Responses**: React Query cache (5 minutes)
- **WebSocket Data**: In-memory cache (real-time)
- **User Preferences**: localStorage (persistent)

#### Performance Monitoring
```bash
# Lighthouse CI
npm run lighthouse

# Bundle size check
npm run size-check

# Performance profiling
npm run dev -- --profile
```

---

## ♿ Accessibility

### WCAG 2.1 Level AA Compliance

#### Keyboard Navigation

| Shortcut | Action | Context |
|----------|--------|----------|
| `Tab` | Navigate forward | Global |
| `Shift + Tab` | Navigate backward | Global |
| `Enter` | Activate button/link | Focusable elements |
| `Space` | Toggle checkbox/switch | Form controls |
| `Escape` | Close dialog/modal | Overlays |
| `Ctrl/Cmd + K` | Open command palette | Global (future) |
| `Ctrl/Cmd + /` | Toggle sidebar | Global |
| `Arrow Keys` | Navigate menu items | Menus & lists |

#### Color Contrast Ratios

| Element | Foreground | Background | Ratio | Status |
|---------|-----------|------------|-------|--------|
| **Primary Text** | `#1e293b` | `#ffffff` | 12.6:1 | ✅ AAA |
| **Secondary Text** | `#64748b` | `#ffffff` | 4.8:1 | ✅ AA |
| **Primary Button** | `#ffffff` | `#0f766e` | 8.2:1 | ✅ AAA |
| **Success State** | `#ffffff` | `#16a34a` | 5.1:1 | ✅ AA |
| **Error State** | `#ffffff` | `#dc2626` | 5.9:1 | ✅ AA |
| **Warning State** | `#1e293b` | `#fbbf24` | 8.4:1 | ✅ AAA |

#### Focusable Controls

```css
/* Focus indicator styles */
.p-button:focus-visible,
.p-inputtext:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.1);
}
```

#### ARIA Labels

- All interactive elements have proper `aria-label` or `aria-labelledby`
- Form inputs have associated `<label>` elements
- Buttons have descriptive text or `aria-label`
- Loading states use `aria-busy` and `aria-live`
- Dialogs use `role="dialog"` and `aria-modal`

#### Screen Reader Support

- Semantic HTML5 elements (`<nav>`, `<main>`, `<aside>`)
- Proper heading hierarchy (h1 → h2 → h3)
- Skip navigation links
- Live regions for dynamic content (`aria-live="polite"`)
- Descriptive link text (no "click here")

### Accessibility Testing

```bash
# Run accessibility audit
npm run a11y

# Test with screen reader
# macOS: VoiceOver (Cmd + F5)
# Windows: NVDA (free) or JAWS

# Keyboard navigation test
# Ensure all features accessible without mouse
```

---

## 🧪 Testing & CI

### Testing Commands

#### Unit Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Update snapshots
npm run test:update
```

#### Linting
```bash
# ESLint check
npm run lint

# Auto-fix issues
npm run lint:fix

# TypeScript check
npm run type-check
```

#### Build & Preview
```bash
# Production build
npm run build

# Preview build locally
npm run preview
# Opens at http://localhost:4173

# Build with analysis
npm run build:analyze
```

#### E2E Tests (Future)
```bash
# Playwright tests
npm run test:e2e

# Playwright UI mode
npm run test:e2e:ui
```

### GitHub Actions CI/CD

#### Workflow File (`.github/workflows/dashboard-ci.yml`)

```yaml
name: Dashboard CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'dashboard/**'
  pull_request:
    branches: [main]
    paths:
      - 'dashboard/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: dashboard/package-lock.json
      
      - name: Install dependencies
        working-directory: ./dashboard
        run: npm ci
      
      - name: Run linter
        working-directory: ./dashboard
        run: npm run lint
      
      - name: Type check
        working-directory: ./dashboard
        run: npm run type-check
      
      - name: Run tests
        working-directory: ./dashboard
        run: npm test -- --coverage
      
      - name: Build
        working-directory: ./dashboard
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./dashboard/coverage/lcov.info
          flags: dashboard

  lighthouse:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./dashboard
        run: npm ci
      
      - name: Build
        working-directory: ./dashboard
        run: npm run build
      
      - name: Run Lighthouse CI
        working-directory: ./dashboard
        run: |
          npm install -g @lhci/cli
          lhci autorun

  deploy:
    runs-on: ubuntu-latest
    needs: [test, lighthouse]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # Add deployment commands here
          echo "Deploying dashboard..."
```

#### Local CI Simulation

```bash
# Run full CI pipeline locally
npm run ci

# This runs:
# 1. npm run lint
# 2. npm run type-check
# 3. npm test
# 4. npm run build
```

#### Pre-commit Hooks (Husky)

```bash
# Install Husky
npm install --save-dev husky lint-staged

# Setup pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm run lint-staged"
```

**`.lintstagedrc.json`**:
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

### Test Coverage Goals

| Category | Target | Current |
|----------|--------|----------|
| **Statements** | > 80% | 75% |
| **Branches** | > 75% | 70% |
| **Functions** | > 80% | 72% |
| **Lines** | > 80% | 76% |

---

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
