# 👥 المرحلة 11: Multiple Accounts Support

**الحالة:** 📋 **TODO - جاهز للتنفيذ**  
**الأولوية:** 🔴 **عالية جداً**  
**الصعوبة:** ⚠️ **متوسطة - يحتاج refactoring**

---

## 🎯 الهدف

دعم تشغيل **أكثر من حساب WhatsApp** في نفس الوقت على نفس السيرفر.

---

## 📊 الوضع الحالي

### ✅ المشروع الأصلي (`/src`) - يدعم Multiple Accounts

```javascript
// من /src/authStrategies/LocalAuth.js - السطر 10-26
class LocalAuth extends BaseAuthStrategy {
    /**
     * @param {object} options - options
     * @param {string} options.clientId - Client id to distinguish instances 
     *                                     if you are using multiple
     * @param {string} options.dataPath - Change the default path for saving session files
     */
    constructor({ clientId, dataPath, rmMaxRetries }={}) {
        super();
        
        this.dataPath = path.resolve(dataPath || './.wwebjs_auth/');
        this.clientId = clientId;  // ✅ دعم clientId
        this.rmMaxRetries = rmMaxRetries ?? 4;
    }
    
    async beforeBrowserInitialized() {
        const sessionDirName = this.clientId 
            ? `session-${this.clientId}`   // ✅ مجلد منفصل لكل client
            : 'session';
        const dirPath = path.join(this.dataPath, sessionDirName);
        
        fs.mkdirSync(dirPath, { recursive: true });
        this.client.options.puppeteer = {
            ...puppeteerOpts,
            userDataDir: dirPath  // ✅ كل client له userDataDir خاص
        };
    }
}
```

**الاستخدام (من wwebjs.dev docs):**

```javascript
const { Client, LocalAuth } = require('whatsapp-web.js');

// Client 1
const client1 = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" })
});

// Client 2
const client2 = new Client({
    authStrategy: new LocalAuth({ clientId: "client-two" })
});

// Initialize both
await client1.initialize();
await client2.initialize();
```

**✅ النتيجة:** المشروع الأصلي يدعم Multiple Accounts بشكل كامل!

---

### ❌ المشروع الحالي (`/runtime`) - لا يدعم

```javascript
// من /runtime/server/waClient.js - السطر 11-16
class WhatsAppClient {
    constructor() {
        this.client = null;
        this.isReady = false;
        this.sessionPath = path.join(__dirname, 'session');  // ❌ مسار واحد فقط
    }
}

// السطر 153-156
// Singleton instance ❌
const waClientInstance = new WhatsAppClient();
module.exports = waClientInstance;
```

**المشاكل:**
- ❌ يستخدم **Singleton Pattern** - instance واحد فقط
- ❌ لا يوجد `clientId` parameter
- ❌ `sessionPath` واحد لجميع الحسابات
- ❌ لا يمكن تشغيل أكثر من حساب

---

## 🏗️ التصميم المقترح

### Architecture Diagram:

```
┌─────────────────────────────────────────────────────────┐
│         WhatsAppClientManager (Singleton)               │
├─────────────────────────────────────────────────────────┤
│  clients: Map<clientId, WhatsAppClient>                 │
│                                                          │
│  Methods:                                                │
│  - createClient(clientId, config): Promise<WAClient>    │
│  - getClient(clientId): WhatsAppClient                  │
│  - getAllClients(): WhatsAppClient[]                    │
│  - getClientIds(): string[]                             │
│  - destroyClient(clientId): Promise<void>               │
│  - destroyAll(): Promise<void>                          │
│  - getStatus(clientId): StatusObject                    │
│  - getAllStatus(): StatusObject[]                       │
└─────────────────────────────────────────────────────────┘
                    │
                    ├──► WhatsAppClient (account-1)
                    │    ├─► Puppeteer Instance 1
                    │    ├─► Session: /sessions/session-account-1/
                    │    └─► Event Handlers
                    │
                    ├──► WhatsAppClient (account-2)
                    │    ├─► Puppeteer Instance 2
                    │    ├─► Session: /sessions/session-account-2/
                    │    └─► Event Handlers
                    │
                    └──► WhatsAppClient (account-N)
                         ├─► Puppeteer Instance N
                         ├─► Session: /sessions/session-account-N/
                         └─► Event Handlers
```

---

## 📝 الملفات المطلوب إنشاؤها/تعديلها

### 1. `/runtime/server/managers/WhatsAppClientManager.js` (NEW)

```javascript
const { Client, LocalAuth } = require('../../../index');
const qrcode = require('qrcode-terminal');
const logger = require('../utils/logger');
const path = require('path');

/**
 * WhatsApp Client Wrapper
 * Manages a single WhatsApp client instance
 */
class WhatsAppClient {
    constructor(clientId, config = {}) {
        this.clientId = clientId;
        this.client = null;
        this.isReady = false;
        this.sessionPath = path.join(__dirname, '../sessions');
        this.config = config;
        this.qrCode = null;
    }

    /**
     * Initialize WhatsApp Client
     */
    async initialize() {
        try {
            this.client = new Client({
                authStrategy: new LocalAuth({
                    clientId: this.clientId,
                    dataPath: this.sessionPath
                }),
                puppeteer: {
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--single-process',
                        '--disable-gpu'
                    ]
                }
            });

            this.setupEventHandlers();
            await this.client.initialize();
            
            logger.info(`[${this.clientId}] ✅ Client initialized successfully`);
            return this.client;
        } catch (error) {
            logger.error(`[${this.clientId}] Failed to initialize:`, error);
            throw error;
        }
    }

    /**
     * Setup Event Handlers
     */
    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            this.qrCode = qr;
            logger.info(`[${this.clientId}] QR Code received`);
            console.log(`\n[${this.clientId}] Scan this QR code:`);
            qrcode.generate(qr, { small: true });
        });

        this.client.on('authenticated', () => {
            logger.info(`[${this.clientId}] ✅ Authenticated successfully`);
        });

        this.client.on('auth_failure', (msg) => {
            logger.error(`[${this.clientId}] ❌ Authentication failure:`, msg);
        });

        this.client.on('ready', () => {
            this.isReady = true;
            this.qrCode = null;
            logger.info(`[${this.clientId}] ✅ Client is ready`);
        });

        this.client.on('message', async (message) => {
            logger.info(`[${this.clientId}] 📩 New message from ${message.from}`);
        });

        this.client.on('disconnected', (reason) => {
            this.isReady = false;
            logger.warn(`[${this.clientId}] ⚠️ Disconnected:`, reason);
        });
    }

    /**
     * Get Client Instance
     */
    getClient() {
        if (!this.isReady) {
            throw new Error(`[${this.clientId}] Client is not ready`);
        }
        return this.client;
    }

    /**
     * Get Client Status
     */
    getStatus() {
        return {
            clientId: this.clientId,
            isReady: this.isReady,
            hasQR: !!this.qrCode,
            qrCode: this.qrCode
        };
    }

    /**
     * Destroy Client
     */
    async destroy() {
        if (this.client) {
            await this.client.destroy();
            this.isReady = false;
            logger.info(`[${this.clientId}] Client destroyed`);
        }
    }
}

/**
 * WhatsApp Client Manager
 * Manages multiple WhatsApp client instances
 */
class WhatsAppClientManager {
    constructor() {
        this.clients = new Map();
        logger.info('WhatsAppClientManager initialized');
    }

    /**
     * Create new WhatsApp client
     * @param {string} clientId - Unique identifier for the client
     * @param {object} config - Configuration options
     * @returns {Promise<WhatsAppClient>}
     */
    async createClient(clientId, config = {}) {
        if (this.clients.has(clientId)) {
            logger.warn(`Client ${clientId} already exists`);
            return this.clients.get(clientId);
        }

        logger.info(`Creating new client: ${clientId}`);
        
        const waClient = new WhatsAppClient(clientId, config);
        await waClient.initialize();
        this.clients.set(clientId, waClient);
        
        logger.info(`✅ Client ${clientId} created successfully`);
        return waClient;
    }

    /**
     * Get client by ID
     * @param {string} clientId
     * @returns {WhatsAppClient}
     */
    getClient(clientId) {
        const client = this.clients.get(clientId);
        if (!client) {
            throw new Error(`Client ${clientId} not found`);
        }
        return client;
    }

    /**
     * Get all clients
     * @returns {WhatsAppClient[]}
     */
    getAllClients() {
        return Array.from(this.clients.values());
    }

    /**
     * Get all client IDs
     * @returns {string[]}
     */
    getClientIds() {
        return Array.from(this.clients.keys());
    }

    /**
     * Check if client exists
     * @param {string} clientId
     * @returns {boolean}
     */
    hasClient(clientId) {
        return this.clients.has(clientId);
    }

    /**
     * Destroy specific client
     * @param {string} clientId
     */
    async destroyClient(clientId) {
        const client = this.clients.get(clientId);
        if (client) {
            await client.destroy();
            this.clients.delete(clientId);
            logger.info(`Client ${clientId} destroyed and removed`);
        } else {
            logger.warn(`Client ${clientId} not found`);
        }
    }

    /**
     * Destroy all clients
     */
    async destroyAll() {
        logger.info('Destroying all clients...');
        for (const [clientId, client] of this.clients) {
            await client.destroy();
        }
        this.clients.clear();
        logger.info('All clients destroyed');
    }

    /**
     * Get status of specific client
     * @param {string} clientId
     * @returns {object}
     */
    getStatus(clientId) {
        const client = this.clients.get(clientId);
        if (!client) {
            return {
                clientId,
                exists: false,
                isReady: false,
                hasQR: false
            };
        }
        return {
            ...client.getStatus(),
            exists: true
        };
    }

    /**
     * Get status of all clients
     * @returns {object[]}
     */
    getAllStatus() {
        return Array.from(this.clients.entries()).map(([id, client]) => ({
            clientId: id,
            isReady: client.isReady,
            hasQR: !!client.qrCode,
            exists: true
        }));
    }

    /**
     * Get total number of clients
     * @returns {number}
     */
    getClientCount() {
        return this.clients.size;
    }

    /**
     * Get number of ready clients
     * @returns {number}
     */
    getReadyClientCount() {
        return Array.from(this.clients.values()).filter(c => c.isReady).length;
    }
}

// Export Singleton Manager
const manager = new WhatsAppClientManager();
module.exports = manager;
```

---

### 2. `/runtime/server/routes/session.js` (NEW)

```javascript
const express = require('express');
const router = express.Router();
const waClientManager = require('../managers/WhatsAppClientManager');
const logger = require('../utils/logger');

/**
 * Create new WhatsApp session
 * POST /api/session/create
 * Body: { clientId: string, config?: object }
 */
router.post('/create', async (req, res) => {
    try {
        const { clientId, config } = req.body;
        
        if (!clientId) {
            return res.status(400).json({ 
                success: false, 
                error: 'clientId is required' 
            });
        }

        // Check if client already exists
        if (waClientManager.hasClient(clientId)) {
            return res.status(409).json({
                success: false,
                error: `Client ${clientId} already exists`
            });
        }

        const client = await waClientManager.createClient(clientId, config);
        
        res.json({
            success: true,
            message: `Session ${clientId} created successfully`,
            clientId,
            status: client.getStatus()
        });
    } catch (error) {
        logger.error('Error creating session:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Get all sessions
 * GET /api/session/list
 */
router.get('/list', (req, res) => {
    try {
        const sessions = waClientManager.getAllStatus();
        res.json({
            success: true,
            count: sessions.length,
            sessions
        });
    } catch (error) {
        logger.error('Error listing sessions:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Get session status
 * GET /api/session/:clientId/status
 */
router.get('/:clientId/status', (req, res) => {
    try {
        const { clientId } = req.params;
        const status = waClientManager.getStatus(clientId);
        
        res.json({
            success: true,
            status
        });
    } catch (error) {
        logger.error('Error getting session status:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Get QR code for session
 * GET /api/session/:clientId/qr
 */
router.get('/:clientId/qr', (req, res) => {
    try {
        const { clientId } = req.params;
        const client = waClientManager.getClient(clientId);
        const status = client.getStatus();
        
        if (!status.hasQR) {
            return res.status(404).json({
                success: false,
                error: 'No QR code available. Client may already be authenticated.'
            });
        }
        
        res.json({
            success: true,
            clientId,
            qrCode: status.qrCode
        });
    } catch (error) {
        logger.error('Error getting QR code:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Destroy session
 * DELETE /api/session/:clientId
 */
router.delete('/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        
        if (!waClientManager.hasClient(clientId)) {
            return res.status(404).json({
                success: false,
                error: `Client ${clientId} not found`
            });
        }
        
        await waClientManager.destroyClient(clientId);
        
        res.json({
            success: true,
            message: `Session ${clientId} destroyed successfully`
        });
    } catch (error) {
        logger.error('Error destroying session:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * Get manager statistics
 * GET /api/session/stats
 */
router.get('/stats', (req, res) => {
    try {
        const stats = {
            totalClients: waClientManager.getClientCount(),
            readyClients: waClientManager.getReadyClientCount(),
            clientIds: waClientManager.getClientIds()
        };
        
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        logger.error('Error getting stats:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;
```

---

### 3. تعديل `/runtime/server/waClient.js`

```javascript
/**
 * WhatsApp Client Configuration
 * Now uses WhatsAppClientManager for multiple accounts support
 */

const WhatsAppClientManager = require('./managers/WhatsAppClientManager');

// Export the manager instance
module.exports = WhatsAppClientManager;

// For backward compatibility, create a default client on first use
let defaultClientInitialized = false;

const ensureDefaultClient = async () => {
    if (!defaultClientInitialized) {
        await WhatsAppClientManager.createClient('default');
        defaultClientInitialized = true;
    }
};

// Export helper for backward compatibility
module.exports.getDefaultClient = async () => {
    await ensureDefaultClient();
    return WhatsAppClientManager.getClient('default');
};
```

---

### 4. تعديل `/runtime/server/index.js`

```javascript
// Add session routes
const sessionRoutes = require('./routes/session');
app.use('/api/session', sessionRoutes);

// Initialize default client on startup (optional)
const waClientManager = require('./waClient');
waClientManager.createClient('default').catch(err => {
    logger.error('Failed to create default client:', err);
});
```

---

### 5. تعديل Routes لدعم `clientId`

**مثال: `/runtime/server/routes/message.js`**

```javascript
const waClientManager = require('../waClient');

router.post('/send-text', async (req, res) => {
    const { clientId = 'default', phone, message } = req.body;
    
    try {
        // Get specific client
        const waClient = waClientManager.getClient(clientId);
        const client = waClient.getClient();
        
        // Send message
        const chatId = phone.includes('@') ? phone : `${phone}@c.us`;
        await client.sendMessage(chatId, message);
        
        res.json({ 
            success: true,
            clientId,
            message: 'Message sent successfully'
        });
    } catch (error) {
        logger.error(`[${clientId}] Error sending message:`, error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});
```

---

## 📋 خطوات التنفيذ

### Phase 1: Core Infrastructure (يوم 1-2)
- [ ] **Step 1.1:** إنشاء `/managers/WhatsAppClientManager.js`
- [ ] **Step 1.2:** إنشاء `/routes/session.js`
- [ ] **Step 1.3:** تعديل `waClient.js` للاستخدام Manager
- [ ] **Step 1.4:** تعديل `index.js` لإضافة session routes
- [ ] **Step 1.5:** اختبار إنشاء client واحد

### Phase 2: Routes Integration (يوم 3-4)
- [ ] **Step 2.1:** تعديل `/routes/message.js` لدعم `clientId`
- [ ] **Step 2.2:** تعديل `/routes/campaign.js` لدعم `clientId`
- [ ] **Step 2.3:** تعديل `/routes/contact.js` لدعم `clientId`
- [ ] **Step 2.4:** اختبار إرسال رسائل من clients مختلفة

### Phase 3: Services Integration (يوم 5)
- [ ] **Step 3.1:** تعديل `enhancedWAClientHandler.js`
- [ ] **Step 3.2:** تعديل `websocketBridge.js` لدعم multiple clients
- [ ] **Step 3.3:** تعديل `sessionMonitor.js`

### Phase 4: Dashboard UI (يوم 6-7)
- [ ] **Step 4.1:** إنشاء `/dashboard/src/app/Sessions.jsx`
- [ ] **Step 4.2:** إضافة session selector في Messages page
- [ ] **Step 4.3:** إضافة session selector في Campaigns page
- [ ] **Step 4.4:** إضافة QR code display dialog

### Phase 5: Testing (يوم 8)
- [ ] **Step 5.1:** اختبار مع 2 accounts
- [ ] **Step 5.2:** اختبار مع 5 accounts
- [ ] **Step 5.3:** اختبار concurrent messages
- [ ] **Step 5.4:** اختبار session persistence
- [ ] **Step 5.5:** اختبار auto-reconnect

---

## 🧪 الاختبار

### Test Case 1: Create Multiple Sessions

```bash
# Create account-1
curl -X POST http://localhost:3001/api/session/create \
  -H "Content-Type: application/json" \
  -d '{"clientId": "account-1"}'

# Create account-2
curl -X POST http://localhost:3001/api/session/create \
  -H "Content-Type: application/json" \
  -d '{"clientId": "account-2"}'

# List all sessions
curl http://localhost:3001/api/session/list

# Expected output:
# {
#   "success": true,
#   "count": 2,
#   "sessions": [
#     { "clientId": "account-1", "isReady": true, "hasQR": false, "exists": true },
#     { "clientId": "account-2", "isReady": true, "hasQR": false, "exists": true }
#   ]
# }
```

### Test Case 2: Send Messages from Different Accounts

```bash
# Send from account-1
curl -X POST http://localhost:3001/api/message/send-text \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "account-1",
    "phone": "966501234567@c.us",
    "message": "Hello from account 1"
  }'

# Send from account-2
curl -X POST http://localhost:3001/api/message/send-text \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "account-2",
    "phone": "966501234567@c.us",
    "message": "Hello from account 2"
  }'
```

### Test Case 3: Session Management

```bash
# Get status
curl http://localhost:3001/api/session/account-1/status

# Get QR code (if not authenticated)
curl http://localhost:3001/api/session/account-1/qr

# Delete session
curl -X DELETE http://localhost:3001/api/session/account-1

# Get stats
curl http://localhost:3001/api/session/stats
```

---

## ⚠️ ملاحظات مهمة

### Resource Usage:
- كل client يحتاج **Puppeteer instance منفصل**
- كل instance يستهلك **~200-300MB RAM**
- كل instance يحتاج **~1 CPU core**
- **يُنصح بـ max 5-10 accounts** على سيرفر واحد

### Session Storage:
- كل account له مجلد منفصل: `/sessions/session-{clientId}/`
- Session files تُحفظ تلقائياً
- يمكن نقل sessions بين servers

### Error Handling:
- إذا فشل client واحد، الباقي يستمر
- Auto-reconnect لكل client بشكل مستقل
- Graceful shutdown لجميع clients

### Security:
- يجب إضافة authentication للـ session APIs
- يجب تقييد عدد accounts لكل user
- يجب مراقبة resource usage

---

## 🎯 Success Criteria

- ✅ يمكن إنشاء multiple accounts
- ✅ كل account يعمل بشكل مستقل
- ✅ يمكن إرسال رسائل من accounts مختلفة
- ✅ Session persistence يعمل
- ✅ Auto-reconnect يعمل لكل account
- ✅ UI في Dashboard لإدارة accounts
- ✅ No memory leaks
- ✅ No performance degradation

---

**آخر تحديث:** 2025-11-01  
**المسؤول:** Development Team
