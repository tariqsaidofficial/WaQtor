# 📁 WaQtor Project Structure

**Last Updated:** 2025-11-01  
**Version:** 2.3.0

---

## 🏗️ **Root Directory Structure**

```
Waqtor-main/
├── src/                          # Original WhatsApp-Web.js Library
├── runtime/                      # Backend Server (Node.js + Express)
├── dashboard/                    # Frontend Dashboard (Next.js)
├── db/                          # Database files
├── backups/                     # Data backups
├── docs/                        # Documentation
├── tests/                       # Test files
├── .env                         # Environment variables
├── package.json                 # Root dependencies
└── README.md                    # Main documentation
```

---

## 🔧 **Backend Structure (`/runtime/server/`)**

```
runtime/server/
├── index.js                     # Main server entry point
├── waClient.js                  # Legacy WhatsApp client (deprecated)
│
├── managers/                    # Service managers
│   └── WhatsAppClientManager.js # Multi-account manager
│
├── models/                      # Database models (Sequelize)
│   ├── index.js                # Database connection
│   ├── User.js                 # User model
│   ├── WhatsAppSession.js      # Session model
│   ├── Message.js              # Message model
│   ├── Campaign.js             # Campaign model
│   ├── Recipient.js            # Recipient model
│   ├── Group.js                # Group model
│   └── RecipientGroup.js       # Many-to-many relationship
│
├── routes/                      # API Routes
│   ├── auth.js                 # Authentication (6 endpoints)
│   ├── sessions.js             # Sessions management (6 endpoints)
│   ├── message.js              # Messages (4 endpoints)
│   ├── campaign.js             # Campaigns (6 endpoints)
│   ├── recipients.js           # Recipients (8 endpoints)
│   ├── groups.js               # Groups (9 endpoints)
│   ├── admin.js                # Admin dashboard (7 endpoints)
│   ├── status.js               # Status endpoints
│   ├── session.js              # Legacy session
│   ├── test.js                 # Test endpoints
│   ├── errors.js               # Error management
│   ├── queue.js                # Queue management
│   ├── smartbot.js             # SmartBot routes
│   ├── reports.js              # Reports
│   ├── interactive.js          # Interactive messages
│   ├── notifications.js        # Notifications
│   └── webhooks.js             # Webhooks
│
├── middlewares/                 # Middleware functions
│   ├── auth.js                 # API Key auth (legacy)
│   ├── jwtAuth.js              # JWT authentication
│   ├── limiter.js              # Rate limiting
│   └── errorHandler.js         # Error handling
│
├── services/                    # Business logic services
│   ├── sessionMonitor.js       # Session monitoring
│   ├── websocketBridge.js      # WebSocket bridge
│   ├── enhancedWAClientHandler.js # Enhanced client handler
│   ├── smartbotService.js      # SmartBot service
│   └── errorMonitor.js         # Error monitoring
│
├── utils/                       # Utility functions
│   └── logger.js               # Winston logger
│
├── webhooks/                    # Webhook integrations
│   └── eventIntegration.js     # Event integration
│
├── scripts/                     # Utility scripts
│   └── migrate-data.js         # Data migration script
│
└── session/                     # WhatsApp session data
    └── session-*/               # Session directories (per client)
```

---

## 🎨 **Frontend Structure (`/dashboard/`)**

### **⚠️ IMPORTANT: Next.js App Router Structure**

```
dashboard/
├── public/                      # Static files
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/
│   ├── app/                    # ✅ PAGES GO HERE (App Router)
│   │   ├── page.jsx           # Home page (/)
│   │   ├── layout.jsx         # Root layout
│   │   ├── Dashboard.jsx      # Dashboard page
│   │   ├── Messages.jsx       # Messages page
│   │   ├── Campaigns.jsx      # Campaigns page
│   │   ├── Settings.jsx       # Settings page
│   │   ├── ErrorManagement.jsx # Error management
│   │   │
│   │   └── admin/             # Admin pages
│   │       ├── users.jsx      # User management
│   │       └── stats.jsx      # System statistics (TODO)
│   │
│   ├── components/            # Reusable components
│   │   ├── ErrorBoundary.jsx
│   │   ├── ErrorFallback.jsx
│   │   ├── GlobalErrorHandler.jsx
│   │   ├── QRStatusCard.jsx
│   │   ├── QuickActionsCard.jsx
│   │   ├── SessionStatsCard.jsx
│   │   └── ToastProvider.jsx
│   │
│   ├── lib/                   # Utility libraries
│   ├── hooks/                 # Custom React hooks
│   ├── styles/                # Global styles
│   └── types/                 # TypeScript types
│
├── docs/                       # Documentation
│   ├── PHASE_11_MULTIPLE_ACCOUNTS.md
│   ├── PHASE_14_ACK_FIX.md
│   └── ...
│
├── .env                        # Environment variables
├── .env.example               # Environment template
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # Dashboard documentation
```

---

## 🚨 **CRITICAL RULES FOR FILE CREATION**

### **Backend (`/runtime/server/`)**

1. **Routes:** Always go in `/runtime/server/routes/`
2. **Models:** Always go in `/runtime/server/models/`
3. **Services:** Always go in `/runtime/server/services/`
4. **Middlewares:** Always go in `/runtime/server/middlewares/`

### **Frontend (`/dashboard/`)**

1. **Pages:** ✅ **ALWAYS** go in `/dashboard/src/app/`
2. **Components:** ✅ **ALWAYS** go in `/dashboard/src/components/`
3. **DO NOT** create `/dashboard/src/pages/` directory
4. **DO NOT** use Pages Router structure

### **Next.js App Router Conventions:**

```
src/app/
├── page.jsx              # Route: /
├── layout.jsx            # Layout for /
├── admin/
│   ├── page.jsx         # Route: /admin
│   ├── layout.jsx       # Layout for /admin/*
│   └── users/
│       └── page.jsx     # Route: /admin/users
```

**File Naming:**
- ✅ `page.jsx` - Route page
- ✅ `layout.jsx` - Layout wrapper
- ✅ `loading.jsx` - Loading state
- ✅ `error.jsx` - Error boundary
- ✅ `not-found.jsx` - 404 page

---

## 📊 **Database Structure**

### **PostgreSQL Tables:**

```sql
users                    # User accounts
whatsapp_sessions       # WhatsApp sessions
messages                # Message history
campaigns               # Campaign data
recipients              # Contact list
groups                  # Contact groups
recipient_groups        # Many-to-many relationship
```

### **Relationships:**

```
User (1) ──→ (N) WhatsAppSession
User (1) ──→ (N) Message
User (1) ──→ (N) Campaign
User (1) ──→ (N) Recipient
User (1) ──→ (N) Group

WhatsAppSession (1) ──→ (N) Message
WhatsAppSession (1) ──→ (N) Campaign

Recipient (N) ←──→ (N) Group (via recipient_groups)
```

---

## 🔌 **API Endpoints Structure**

### **Base URL:** `http://localhost:8080/api`

```
/api/auth/*              # Authentication (6 endpoints)
/api/sessions/*          # Sessions (6 endpoints) - JWT
/api/recipients/*        # Recipients (8 endpoints) - JWT
/api/groups/*            # Groups (9 endpoints) - JWT
/api/admin/*             # Admin (7 endpoints) - JWT + Admin role
/api/messages/*          # Messages (4 endpoints) - API Key
/api/campaigns/*         # Campaigns (6 endpoints) - API Key
/api/status/*            # Status - API Key
/api/test/*              # Testing - API Key
```

---

## 🎯 **Environment Variables**

### **Backend (`.env` in root):**

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/waqtor

# Server
PORT=8080
NODE_ENV=production

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# API Key (legacy)
API_KEY=your-api-key
```

### **Frontend (`/dashboard/.env`):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

---

## 📦 **Dependencies Overview**

### **Backend:**
- Express.js (Web framework)
- Sequelize (ORM)
- PostgreSQL (Database)
- whatsapp-web.js (WhatsApp client)
- Socket.io (WebSocket)
- JWT (Authentication)
- Winston (Logging)

### **Frontend:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Lucide Icons
- Axios (HTTP client)
- Socket.io-client (WebSocket)

---

## 🔄 **Data Flow**

```
┌─────────────┐
│  Dashboard  │ (Next.js)
└──────┬──────┘
       │ HTTP/WebSocket
       ↓
┌─────────────┐
│   Backend   │ (Express)
└──────┬──────┘
       │
       ├──→ PostgreSQL (Data)
       ├──→ WhatsApp-Web.js (Messages)
       └──→ Redis (Queue - optional)
```

---

## 📝 **Development Workflow**

### **Starting the Project:**

```bash
# 1. Start Backend
cd /Users/sunmarke/Downloads/Waqtor-main
npm start

# 2. Start Frontend (in new terminal)
cd /Users/sunmarke/Downloads/Waqtor-main/dashboard
npm run dev
```

### **Creating New Features:**

1. **Backend Route:**
   - Create file in `/runtime/server/routes/`
   - Register in `/runtime/server/index.js`
   - Add middleware if needed

2. **Frontend Page:**
   - Create file in `/dashboard/src/app/`
   - Follow App Router conventions
   - Use existing components

3. **Database Model:**
   - Create file in `/runtime/server/models/`
   - Define relationships
   - Run migrations if needed

---

## 🚀 **Production Deployment**

### **Backend:**
```bash
cd /Users/sunmarke/Downloads/Waqtor-main
npm run build
npm start
```

### **Frontend:**
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/dashboard
npm run build
npm start
```

---

## 📚 **Documentation Files**

```
/docs/                           # Root documentation
/dashboard/docs/                 # Frontend docs
/dashboard/IMPLEMENTATION_PLAN.md # Development plan
/DATABASE_MIGRATION_STATUS.md    # Migration status
/PROJECT_STRUCTURE.md           # This file
/README.md                      # Main readme
/dashboard/README.md            # Dashboard readme
```

---

## ⚠️ **Common Mistakes to Avoid**

1. ❌ Creating `/dashboard/src/pages/` directory
2. ❌ Using Pages Router instead of App Router
3. ❌ Mixing authentication methods (use JWT for new features)
4. ❌ Creating routes without middleware
5. ❌ Hardcoding API URLs (use env variables)
6. ❌ Not following existing naming conventions

---

## ✅ **Best Practices**

1. ✅ Always check existing structure before creating files
2. ✅ Follow Next.js App Router conventions
3. ✅ Use TypeScript types when available
4. ✅ Add proper error handling
5. ✅ Document new features
6. ✅ Test before committing
7. ✅ Use existing components when possible
8. ✅ Follow the established patterns

---

**For questions or clarifications, refer to:**
- `/dashboard/IMPLEMENTATION_PLAN.md` - Development roadmap
- `/DATABASE_MIGRATION_STATUS.md` - Database status
- `/dashboard/README.md` - Frontend guide
- `/README.md` - General overview
