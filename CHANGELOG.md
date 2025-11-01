# Changelog

All notable changes to WaQtor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Template library with variables
- Image compression before sending
- Cloud storage integration (S3, GCS)
- SmartBot AI v2 with Semantic Matching
- System statistics dashboard UI

## [2.3.0] - 2025-11-01

### 🎉 Complete Multi-User System with Admin Dashboard Release

#### Added - Complete Backend Migration (100%)
- 🗄️ **PostgreSQL Database** - Full migration from SQLite/JSON to PostgreSQL
  - 8 tables with complete relationships
  - User isolation and data ownership
  - Sequelize ORM integration
- 👥 **Multi-User Support** - Complete user management system
  - User registration and authentication
  - JWT-based authentication
  - Role-based access control (Admin, User, Viewer)
  - User ownership of all resources
- 📱 **Multiple WhatsApp Accounts** - Per user account support
  - WhatsAppClientManager for multi-account handling
  - Session isolation per user
  - Concurrent account management
- 🎯 **46 API Endpoints** - Complete RESTful API
  - Authentication: 6 endpoints (register, login, profile, etc.)
  - Sessions: 6 endpoints (multi-account management)
  - Messages: 4 endpoints
  - Campaigns: 6 endpoints
  - Recipients: 8 endpoints (CRUD, CSV import/export, bulk operations)
  - Groups: 9 endpoints (contact groups with many-to-many relationships)
  - Admin: 7 endpoints (user management, system stats, monitoring)
- 🔄 **Data Migration Script** - Migrate from old system
  - Backup functionality
  - Message migration
  - Campaign migration
  - Recipient migration
  - Data verification
- ✅ **24/24 Integration Tests** - All tests passing

#### Added - Admin Dashboard UI
- 👥 **User Management Page** - `/admin/users`
  - Full CRUD interface for users
  - Search and filter functionality
  - Role management (Admin, User, Viewer)
  - Status management (Active/Inactive)
  - Pagination support
  - Edit modal with form validation
  - Delete with confirmation
  - Session count per user
  - Last login tracking
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS
  - Lucide icons integration
  - Responsive design
  - Loading states
  - Error handling
  - Admin role protection

#### Backend Files Added
- `/runtime/server/models/` - Complete database models
  - `User.js` - User accounts
  - `WhatsAppSession.js` - WhatsApp sessions
  - `Message.js` - Message history
  - `Campaign.js` - Campaign data
  - `Recipient.js` - Contact list
  - `Group.js` - Contact groups
  - `RecipientGroup.js` - Many-to-many relationships
- `/runtime/server/routes/` - New API routes
  - `auth.js` - Authentication endpoints
  - `sessions.js` - Multi-session management
  - `recipients.js` - Recipient management
  - `groups.js` - Group management
  - `admin.js` - Admin dashboard API
- `/runtime/server/middlewares/jwtAuth.js` - JWT authentication
- `/runtime/server/managers/WhatsAppClientManager.js` - Multi-account manager
- `/runtime/server/scripts/migrate-data.js` - Data migration script

#### Frontend Files Added
- `/dashboard/src/app/admin/users.jsx` - User management page
- `/dashboard/src/app/admin/UserManagement.jsx` - Alternative user management component

#### Documentation Added/Updated
- `PROJECT_STRUCTURE.md` - Complete project structure documentation
  - Backend structure (`/runtime/server/`)
  - Frontend structure (`/dashboard/src/`)
  - Database schema and relationships
  - API endpoints overview
  - Environment variables guide
  - Development workflow
  - Best practices and common mistakes
  - Critical rules for file creation (Next.js App Router)
- `DATABASE_MIGRATION_STATUS.md` - Migration progress tracking
- `README.md` - Updated with v2.3.0 features
- `/dashboard/README.md` - Updated with backend integration

#### Fixed
- Message ACK status real-time updates (Phase 14)
- Port 8080 EADDRINUSE error handling
- Puppeteer browser cleanup
- Next.js App Router file structure (moved from `/pages` to `/app`)

### 🔔 Real-Time Notifications & Webhook System (from previous release)

#### Added - Notification System (Phase 6)
- 🔔 **Real-Time Notifications** - Instant updates via WebSocket
- 📊 **Notification Center** - Full-page view at `/notifications`
- 🔴 **Unread Badge** - Live count in topbar
- 🎨 **Color-Coded Types** - Success, Error, Warning, Info
- ⏱️ **Time Ago** - Relative timestamps (e.g., "5 minutes ago")
- ✅ **Mark as Read** - Single or bulk operations
- 🗑️ **Delete Notifications** - Remove unwanted notifications
- 🔄 **Auto-Refresh** - 30-second polling + WebSocket fallback
- 📱 **Responsive Design** - Works on all devices
- 🎯 **Empty States** - Beautiful UI when no notifications

#### Added - Webhook Dispatcher System (Phase 8)
- 🔒 **HMAC SHA-256 Security** - Signed payloads for verification
- 📡 **8 Webhook Events**:
  - `message_received` - When message is received
  - `message_sent` - When message is sent (ACK=3)
  - `campaign_executed` - During campaign execution
  - `campaign_completed` - When campaign completes
  - `client_connected` - WhatsApp client connected
  - `client_disconnected` - WhatsApp client disconnected
  - `smartbot_reply` - SmartBot auto-reply sent
  - `session_qr` - QR code generated
- 🔄 **Retry Mechanism** - Exponential backoff (configurable)
- 📊 **Logs & Monitoring** - Track all webhook deliveries (last 1000)
- 🎯 **Event Filtering** - Subscribe to specific events
- 🔧 **Settings UI** - Full CRUD interface at `/settings/webhooks`
- 🧪 **Test Endpoint** - Send test webhooks
- 🔑 **Secret Management** - Auto-generate or custom secrets
- ⚡ **Real-Time Dispatch** - Instant event delivery
- 📈 **Statistics** - Success rate, avg duration, failed attempts

#### Added - WebSocket Real-Time Updates
- ⚡ **Instant Notifications** - No polling delay
- 🔄 **Auto-Reconnection** - Exponential backoff (max 5 attempts)
- 🎯 **Event Subscription** - `notification:new`, `notification:count`
- 🛡️ **Fallback to Polling** - Graceful degradation
- 🔐 **API Key Authentication** - Secure WebSocket connections

#### Backend
- Created `/runtime/server/webhooks/signature.js` - HMAC signing
- Created `/runtime/server/webhooks/WebhookManager.js` - Main webhook manager
- Created `/runtime/server/webhooks/eventIntegration.js` - Event listeners
- Created `/runtime/server/routes/webhooks.js` - API endpoints
- Created `/runtime/server/routes/notifications.js` - Notification API
- Enhanced `WebSocketBridge` with notification broadcasting
- Added webhook event integration with WhatsApp client

#### Frontend
- Created `/dashboard/src/components/Notifications/` - Notification components
- Created `/dashboard/src/app/(main)/notifications/page.tsx` - Notifications page
- Created `/dashboard/src/app/(main)/settings/webhooks/page.tsx` - Webhooks settings
- Created `/dashboard/src/contexts/NotificationContext.tsx` - Global state
- Created `/dashboard/src/hooks/useNotificationWebSocket.ts` - WebSocket hook
- Added notification bell in AppTopbar
- Added webhooks menu item in sidebar

#### Documentation
- Created `NOTIFICATIONS_SETUP.md` - Complete notification system guide
- Updated `IMPLEMENTATION_PLAN.md` - Marked Phase 6 & 8 as complete
- Updated `README.md` - Added v2.3.0 release notes

#### Fixed
- Fixed EventIntegration initialization when WhatsApp client not ready
- Fixed InputSwitch TypeScript errors in webhooks page
- Improved error handling in webhook event listeners

## [2.2.0] - 2025-10-30

### 🎨 Enhanced Settings & UI Improvements Release

#### Added
- ⚙️ **Advanced Settings System** - Complete appearance customization
- 🎨 **Branding Settings**:
  - App Name customization
  - Browser Tab Title
  - Logo Upload (PNG/SVG with preview)
  - Logo Text with show/hide toggle
  - Favicon Upload (ICO/PNG)
  - Footer Text customization
  - Show/Hide Footer toggle
- 🔑 **API Key Management** - Generate, save, and manage API keys
- 📊 **Session Controls** - Logout, restart, and delete sessions
- 🌓 **Theme Switcher** - Light/Dark themes (Lara Teal)
- 📏 **Scale Control** - Adjust UI size (12-16px)
- 🔄 **Real-time Updates** - Changes apply instantly across dashboard
- 💾 **Auto-Save** - All settings saved to localStorage

#### Changed
- ✨ **Icon Fixes** - All PrimeReact icons display correctly
- 🎯 **Button Consistency** - Unified button styles and sizes
- 📱 **Responsive Layout** - Optimized for all screen sizes
- 🔲 **InputGroup Fix** - Proper alignment for input fields and buttons
- 🎨 **Focus States** - Removed distracting focus box-shadows
- 🖼️ **Header/Footer Integration** - Fully connected with settings

#### Removed
- 🗑️ **Unused CSS** - Removed custom overrides and unused theme files
- 📦 **Simplified Themes** - Only Teal Light/Dark (removed 10+ unused themes)
- ⚡ **Code Cleanup** - Removed Ripple Effect and Input Style settings

#### Technical Details
- Event system for branding updates (`branding-update`)
- localStorage integration for all settings
- Compact UI design (all settings visible without scrolling)
- TypeScript improvements in Settings components

### Package Info
- **npm Package**: [waqtor@2.2.0](https://www.npmjs.com/package/waqtor)
- **Package Size**: 14.9 MB (compressed)
- **Unpacked Size**: 24.3 MB
- **Total Files**: 415

## [2.1.0] - 2025-10-30

### 🎉 Major Dashboard & Feature-Complete Release

#### Added
- 💻 **Modern React Dashboard** - Built with Next.js 14 + PrimeReact
- 📡 **Real-time WebSocket Updates** - Live statistics (50-100x faster!)
- 🤖 **SmartBot System** - AI-powered auto-replies with bilingual support
- 📊 **Reports & Analytics** - Real-time charts with Chart.js
- 📨 **Campaign Management** - Bulk messaging with CSV import
- 🎯 **Interactive Messages** - Button and list messages
- 🔲 **Enhanced QR Code Display** - With client info and session details
- 📅 **Date & Timezone Display** - Automatic timezone detection
- 📱 **Platform Recognition** - Clear platform names (WhatsApp Business, etc.)

#### SmartBot Features
- 🧠 AI-Powered response matching with fuzzy search (80% accuracy)
- 🌍 Bilingual support (Arabic & English)
- 🎭 Response variations for natural conversation
- 🚫 Profanity filter with content moderation
- ⌨️ Typing indicator with realistic delays
- 📊 Reply history tracking
- 🛡️ Anti-ban protection

#### Reports Features
- 📈 Real-time charts (line, bar, pie)
- 📅 Date range filtering
- 📊 Performance metrics (response rates, success rates, avg time)
- 📥 Export to CSV
- 🔄 Live data integration

### Package Info
- **npm Package**: [waqtor@2.1.0](https://www.npmjs.com/package/waqtor)

## [2.0.0] - 2025-10-29

### 🎉 Major Release - File Management System

#### Added
- 🖼️ **Smart Image Handling** - Images arrive as media with preview (not documents)
- 📁 **Date-Based Organization** - Files organized in `uploads/YYYY-MM-DD/` folders
- 📏 **Custom Size Limits** - Different limits per file type (Images: 3MB, PDF: 5MB, Video: 60MB)
- 🗑️ **Auto Cleanup** - Files deleted after 30 days with 3-day warning
- 👁️ **File Preview** - Preview images/video/audio in web interface
- 🧪 **Test Suite** - 5 comprehensive test files with 100% pass rate
- 📚 **Complete Documentation** - [See documentation/](documentation/) for details

#### Changed
- Updated multer storage to use date-based folders
- Enhanced `/send-file` endpoint with proper MIME type handling
- Improved error messages and validation

#### Technical Details
For complete implementation details, see:
- [FILE_MANAGEMENT_SYSTEM.md](documentation/FILE_MANAGEMENT_SYSTEM.md)
- [IMAGE_SEND_FIX.md](documentation/IMAGE_SEND_FIX.md)
- [TESTING_GUIDE.md](tests/TESTING_GUIDE.md)

## [1.0.4] - 2025-10-28

### Fixed
- 🐛 **npm README Sync** - Ensured README is properly displayed on npm
- 🔄 **Cache Clearing** - Cleared npm cache for clean publish

### Changed
- Updated all version references to v1.0.4
- Re-published package to ensure README sync

### Package Info
- **npm Package**: [waqtor@1.0.4](https://www.npmjs.com/package/waqtor)
- **Package Size**: 114.1 kB (compressed)
- **Unpacked Size**: 494.6 kB
- **Files**: 73

## [1.0.3] - 2025-10-28

### Fixed
- 🐛 **npm README Display** - Fixed README not appearing on npm package page
- 📄 **Package Metadata** - Added explicit `readme` field to package.json

### Changed
- Updated package.json to include `readme` field pointing to README.md
- Ensured README.md is properly included in npm package

### Package Info
- **npm Package**: [waqtor@1.0.3](https://www.npmjs.com/package/waqtor)
- **Package Size**: 113.8 kB (compressed)
- **Unpacked Size**: 493.3 kB
- **Files**: 73

## [1.0.2] - 2025-10-28

### Changed
- 📝 **Documentation** - Updated README with improved formatting
- 🔧 **Version Bump** - Attempted to sync README to npm (authentication required)

### Package Info
- **npm Package**: [waqtor@1.0.2](https://www.npmjs.com/package/waqtor)

## [1.0.1] - 2025-10-28

### Fixed
- 🐛 **npm Package Size** - Reduced from 76.6 MB to 489.4 kB
- 🔒 **Security** - Removed session files from published package
- 📦 **Package Quality** - Optimized .npmignore to exclude runtime data

### Changed
- Updated .npmignore to exclude `runtime/server/session/`
- Updated .npmignore to exclude `runtime/server/db/*.db`
- Cleaned package contents for production use

### Package Info
- **npm Package**: [waqtor@1.0.1](https://www.npmjs.com/package/waqtor)
- **Package Size**: 112.7 kB (compressed), 489.4 kB (unpacked)
- **Total Files**: 73

## [1.0.0] - 2025-10-28

### Added
- ✨ **Initial Release** - First stable version of WaQtor
- 🚀 **REST API Layer** - Express.js-based HTTP endpoints
- 📊 **Campaign Management** - Create, track, and execute messaging campaigns
- 🗄️ **SQLite Integration** - Persistent storage for campaigns and logs
- 🐳 **Docker Support** - Production-ready containerization
- 🔒 **API Authentication** - Secure API key-based access control
- ⚡ **Rate Limiting** - Protection against API abuse
- 📝 **Logging System** - Winston-based comprehensive logging
- 🏥 **Health Checks** - System monitoring endpoints
- 📚 **Documentation** - Complete guides and API reference
- 🔐 **GitHub Actions** - CI/CD workflow for npm publishing

### Changed
- Rebranded to **WaQtor** - Smart Automation Engine for WhatsApp
- Complete README.md restructure with new branding
- Added Core Architecture documentation
- Added Design System (DXBMark Style)
- Added REST API specifications
- Updated all repository links to github.com/tariqsaidofficial/WaQtor
- Updated license attribution

### Original Base
- Based on [whatsapp-web.js v1.34.1](https://github.com/pedroslopez/whatsapp-web.js) by Pedro S. Lopez
- License: Apache 2.0

### Maintained By
- Tariq Said (DXBMark) - [GitHub](https://github.com/tariqsaidofficial) | [npm](https://www.npmjs.com/~tariqsaidofficial)

---

## Original Changelog (whatsapp-web.js)

For the original project's changelog, visit:
https://github.com/pedroslopez/whatsapp-web.js/releases
