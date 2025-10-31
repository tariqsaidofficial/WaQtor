# 📋 خطة التنفيذ الشاملة - WaQtor Dashboard

## 🎯 **نظرة عامة:**

تم فحص الملفات الموجودة وتحليل المطلوب. الخطة مقسمة إلى **7 مراحل** منظمة.

---

## 🔒 **الأمان والخصوصية:**

### ✅ **End-to-End Encryption (E2E)**
- **الحالة:** ✅ **مدعوم بالكامل**
- **التفاصيل:** WaQtor مبني على whatsapp-web.js v1.34.1 الذي يستخدم بروتوكول WhatsApp الرسمي
- **الميزة:** جميع الرسائل مشفرة من طرف لطرف تلقائياً عبر WhatsApp
- **المصدر:** Landing page - "Your messages are secured with WhatsApp's end-to-end encryption protocol"

### 🔄 **GDPR Compliance (قيد التطوير)**
- **الحالة:** 🔄 **Partially Implemented**
- **موجود حالياً:**
  - ✅ Privacy Policy link (في Landing page)
  - ✅ Data stored locally (SQLite)
  - ✅ No third-party data sharing
- **مطلوب إضافته:**
  - ❌ Privacy Policy صفحة كاملة
  - ❌ Terms of Service صفحة
  - ❌ Cookie Consent Banner
  - ❌ Data Export functionality (تصدير البيانات)
  - ❌ Right to be Forgotten (حذف البيانات)
  - ❌ Data Retention Policies
  - ❌ User Consent Management
  - ❌ Audit Logs للبيانات الحساسة

---

## 📊 **الملفات الموجودة حالياً:**

### ✅ **الصفحات الرئيسية:**
```
/app/(main)/
├── dashboard/          ✅ موجودة (Prime Dashboard)
├── campaigns/          ✅ موجودة
├── messages/           ✅ موجودة
├── smartbot/           ✅ موجودة
├── interactive/        ✅ موجودة
├── reports/            ✅ موجودة
└── settings/           ✅ موجودة
```

### ✅ **صفحات Full-Page:**
```
/app/(full-page)/
├── auth/
│   ├── login/          ✅ موجودة
│   ├── access/         ✅ موجودة
│   └── error/          ✅ موجودة
├── landing/            ✅ موجودة
└── pages/
    └── notfound/       ✅ موجودة
```

### ✅ **UI Components:**
```
/app/(main)/uikit/
├── button/             ✅ موجودة
├── charts/             ✅ موجودة
├── file/               ✅ موجودة
├── formlayout/         ✅ موجودة
├── input/              ✅ موجودة
├── message/            ✅ موجودة
└── table/              ✅ موجودة
```


## 🚀 **المراحل المطلوبة:**

---

### **المراحل المكتملة (1-7):** ✅

#### **المرحلة 1: تحديثات Topbar** ✅
- تحسين Avatar System (Label + Circle, Image + Circle, Gravatar, Badge)
- Profile dropdown مع Quick Actions
- **الملفات:** `/components/layout/AppTopbar.tsx`, `/_topbar.scss`

#### **المرحلة 2: صفحة Profile** ✅
- عرض وتعديل معلومات المستخدم، تغيير كلمة المرور
- **الملفات:** `/app/(main)/profile/page.tsx`, `/components/profile/ProfileCard.tsx`

#### **المرحلة 3: صفحة About** ✅
- معلومات التطبيق، الإصدار، الفريق
- **الملفات:** `/app/(main)/about/page.tsx`

#### **المرحلة 4: نظام BlockUI** ✅
- تطبيق BlockUI على Campaigns, Messages, SmartBot
- **الملفات:** `/app/(main)/{campaigns,messages,smartbot}/page.tsx`

#### **المرحلة 5: Tag "New"** ✅
- إضافة Tag للصفحات الجديدة في Sidebar
- **الملفات:** `/components/layout/AppMenu.tsx`

#### **المرحلة 6: ScrollTop** ✅
- زر ScrollTop في Layout الرئيسي
- **الملفات:** `/app/(main)/layout.tsx`

#### **المرحلة 7: تحسين UI Components** ✅
- صفحات Badge, Tag, Chip, Avatar في UIKit
- **الملفات:** `/app/(main)/uikit/{badge,tag,chip,avatar}/page.tsx`

---

## 🎨 **التصميم الموحد:**

### **الألوان:**
```scss
$primary: #0f766e;        // WhatsApp green
$success: #16a34a;        // Green
$warning: #f59e0b;        // Orange
$danger: #ef4444;         // Red
$info: #3b82f6;           // Blue
```

### **المسافات:**
```scss
$spacing-xs: 0.25rem;     // 4px
$spacing-sm: 0.5rem;      // 8px
$spacing-md: 1rem;        // 16px
$spacing-lg: 1.5rem;      // 24px
$spacing-xl: 2rem;        // 32px
```

### **Border Radius:**
```scss
$border-radius-sm: 6px;
$border-radius-md: 12px;
$border-radius-lg: 16px;
```

---

## 📝 **LocalStorage Keys:**

```typescript
// User Settings
user_name: string
user_avatar: string
user_email: string
user_phone: string

// Branding
app_logo: string
app_logo_text: string
app_show_logo_text: boolean

// Subscriptions
subscription_status: boolean
subscription_expiry: string
access_codes: string[]

// UI Preferences
theme: string
compact_mode: boolean
sidebar_collapsed: boolean
```

---

## 🔄 **ترتيب التنفيذ المقترح:**

```
1. ✅ المرحلة 1: تحسين Topbar Avatar (30 دقيقة)
2. 📝 المرحلة 6: إضافة ScrollTop (15 دقيقة)
3. 📝 المرحلة 5: إضافة Tag "New" (20 دقيقة)
4. 📝 المرحلة 4: نظام BlockUI (45 دقيقة)
5. 📝 المرحلة 3: صفحة About (60 دقيقة)
6. 📝 المرحلة 2: صفحة Profile (60 دقيقة)
7. 📝 المرحلة 7: تحسين UI Components (90 دقيقة)
```

**إجمالي الوقت المقدر:** ~5 ساعات

---

## ✅ **Checklist النهائي:**

### **Topbar:**
- [ ] تحريك Menu Toggle
- [ ] Avatar مع Label/Image
- [ ] Badge للإشعارات
- [ ] Gravatar support

### **Sidebar:**
- [ ] إضافة Profile
- [ ] إضافة About
- [ ] Tag "New" على الصفحات الجديدة

### **Protected Pages:**
- [ ] BlockUI على Campaigns
- [ ] BlockUI على Reports
- [ ] BlockUI على Interactive
- [ ] OTP Dialog
- [ ] Subscription check

### **Global:**
- [ ] ScrollTop component
- [ ] Unified theme colors
- [ ] LocalStorage integration

### **UI Components:**
- [ ] Badge page
- [ ] Tag page
- [ ] Chip page
- [ ] Avatar page

---

## **المرحلة 6: Notification System** 🔔 ✅

**الميزات المكتملة:**
- ✅ Backend API (GET, POST, PATCH, DELETE, count)
- ✅ WebSocket real-time notifications
- ✅ Frontend Components (Bell, Dropdown, Item, Page)
- ✅ Mark as read (single/all), Delete, Filter, Pagination
- ✅ Auto-refresh (30s polling) + WebSocket fallback
- ✅ NotificationContext + Global state management

**الملفات:**
- `/components/Notifications/` - NotificationBell, Dropdown, Item, Center
- `/app/(main)/notifications/page.tsx`
- `/api/notifications/` - route.ts, [id]/route.ts, count/route.ts
- `/contexts/NotificationContext.tsx`
- `/runtime/server/routes/notifications.js`

---

## **المرحلة 8: Webhook Dispatcher** 🪝 ✅

**الميزات المكتملة:**
- ✅ HMAC SHA-256 Signature System (timing-safe)
- ✅ Webhook Manager (register, dispatch, retry, logs, stats)
- ✅ Event Integration (8 events: message_received, message_sent, campaign_executed, campaign_completed, client_connected, client_disconnected, smartbot_reply, session_qr)
- ✅ API Routes (CRUD, test, logs, statistics)
- ✅ Settings Page UI (create/edit/delete, event selection, secret generation, retry config)
- ✅ Retry mechanism with exponential backoff (3 attempts)

**الملفات:**
- `/runtime/server/webhooks/` - WebhookManager.js, signature.js, eventIntegration.js
- `/runtime/server/routes/webhooks.js`
- `/app/(main)/settings/webhooks/page.tsx`

**Status**: 🎉 Production Ready!

---

### **📡 Webhook Events:**

```typescript
type WebhookEvent = 
  | 'message_received'
  | 'message_sent'
  | 'campaign_executed'
  | 'campaign_completed'
  | 'client_connected'
  | 'client_disconnected'
  | 'smartbot_reply'
  | 'session_qr';

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: any;
}
```

---

### **🔒 HMAC Signature (Security):**

#### **Server-Side (Signing):**

```typescript
// server/webhooks/signature.ts
import crypto from 'crypto';

export function generateSignature(payload: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  return 'sha256=' + hmac.digest('hex');
}

export function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

#### **Client-Side (Verification):**

```typescript
// Your webhook endpoint
app.post('/webhooks/waqtor', (req, res) => {
  const signature = req.headers['x-waqtor-signature'];
  const rawBody = JSON.stringify(req.body);
  
  const secret = process.env.WEBHOOK_SECRET;
  const expectedSig = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  
  if (signature !== expectedSig) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook
  console.log('Webhook received:', req.body);
  res.status(200).json({ received: true });
});
```

---

### **🔧 Backend Implementation:**

#### **1. Webhook Manager:**

```typescript
// server/webhooks/WebhookManager.ts
import axios from 'axios';
import { EventBus } from '@waqtor/core';
import { generateSignature } from './signature';

interface WebhookConfig {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  enabled: boolean;
  retryAttempts: number;
  retryDelay: number;
}

export class WebhookManager {
  private webhooks: Map<string, WebhookConfig> = new Map();
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Message received
    this.eventBus.on('message.received', (data) => {
      this.dispatch('message_received', data);
    });

    // Message sent
    this.eventBus.on('message.sent', (data) => {
      this.dispatch('message_sent', data);
    });

    // Campaign executed
    this.eventBus.on('campaign.progress', (data) => {
      this.dispatch('campaign_executed', data);
    });

    // Campaign completed
    this.eventBus.on('campaign.completed', (data) => {
      this.dispatch('campaign_completed', data);
    });

    // Client connected
    this.eventBus.on('session.status', (data) => {
      if (data.status === 'ready') {
        this.dispatch('client_connected', data);
      } else if (data.status === 'disconnected') {
        this.dispatch('client_disconnected', data);
      }
    });

    // SmartBot reply
    this.eventBus.on('smartbot.reply', (data) => {
      this.dispatch('smartbot_reply', data);
    });

    // Session QR
    this.eventBus.on('session.qr', (data) => {
      this.dispatch('session_qr', data);
    });
  }

  async dispatch(event: WebhookEvent, data: any) {
    const webhooks = Array.from(this.webhooks.values())
      .filter(wh => wh.enabled && wh.events.includes(event));

    for (const webhook of webhooks) {
      await this.sendWebhook(webhook, event, data);
    }
  }

  private async sendWebhook(
    webhook: WebhookConfig,
    event: WebhookEvent,
    data: any,
    attempt: number = 1
  ) {
    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data
    };

    const rawBody = JSON.stringify(payload);
    const signature = generateSignature(rawBody, webhook.secret);

    try {
      const response = await axios.post(webhook.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Waqtor-Signature': signature,
          'X-Waqtor-Event': event,
          'User-Agent': 'WaQtor-Webhook/2.2.0'
        },
        timeout: 10000
      });

      // Log success
      await this.logWebhook(webhook.id, event, 'success', response.status);
    } catch (error: any) {
      console.error(`Webhook failed (attempt ${attempt}):`, error.message);

      // Retry with exponential backoff
      if (attempt < webhook.retryAttempts) {
        const delay = webhook.retryDelay * Math.pow(2, attempt - 1);
        setTimeout(() => {
          this.sendWebhook(webhook, event, data, attempt + 1);
        }, delay);
      } else {
        // Log failure
        await this.logWebhook(webhook.id, event, 'failed', error.response?.status);
      }
    }
  }

  private async logWebhook(
    webhookId: string,
    event: string,
    status: 'success' | 'failed',
    statusCode?: number
  ) {
    // Save to database or file
    console.log(`Webhook Log: ${webhookId} - ${event} - ${status} - ${statusCode}`);
  }

  // CRUD operations
  addWebhook(config: WebhookConfig) {
    this.webhooks.set(config.id, config);
  }

  removeWebhook(id: string) {
    this.webhooks.delete(id);
  }

  updateWebhook(id: string, updates: Partial<WebhookConfig>) {
    const webhook = this.webhooks.get(id);
    if (webhook) {
      this.webhooks.set(id, { ...webhook, ...updates });
    }
  }

  getWebhook(id: string): WebhookConfig | undefined {
    return this.webhooks.get(id);
  }

  getAllWebhooks(): WebhookConfig[] {
    return Array.from(this.webhooks.values());
  }
}
```

#### **2. API Routes:**

```typescript
// server/api/webhooks.ts
import express from 'express';
import { WebhookManager } from '../webhooks/WebhookManager';

const router = express.Router();

// Get all webhooks
router.get('/webhooks', (req, res) => {
  const webhooks = webhookManager.getAllWebhooks();
  res.json({ webhooks });
});

// Create webhook
router.post('/webhooks', (req, res) => {
  const { url, events, secret } = req.body;
  
  const webhook = {
    id: generateId(),
    url,
    events,
    secret: secret || generateSecret(),
    enabled: true,
    retryAttempts: 3,
    retryDelay: 1000
  };
  
  webhookManager.addWebhook(webhook);
  res.status(201).json({ webhook });
});

// Update webhook
router.patch('/webhooks/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  webhookManager.updateWebhook(id, updates);
  res.json({ success: true });
});

// Delete webhook
router.delete('/webhooks/:id', (req, res) => {
  const { id } = req.params;
  webhookManager.removeWebhook(id);
  res.json({ success: true });
});

// Test webhook
router.post('/webhooks/:id/test', async (req, res) => {
  const { id } = req.params;
  const webhook = webhookManager.getWebhook(id);
  
  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }
  
  // Send test payload
  await webhookManager.dispatch('message_received', {
    from: 'test@c.us',
    body: 'Test message',
    timestamp: new Date().toISOString()
  });
  
  res.json({ success: true, message: 'Test webhook sent' });
});

export default router;
```

---

### **💻 Dashboard Implementation:**

#### **1. Webhook Settings Page:**

```typescript
// dashboard/src/app/(main)/settings/webhooks/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { InputSwitch } from 'primereact/inputswitch';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const WEBHOOK_EVENTS = [
  { label: 'Message Received', value: 'message_received' },
  { label: 'Message Sent', value: 'message_sent' },
  { label: 'Campaign Executed', value: 'campaign_executed' },
  { label: 'Campaign Completed', value: 'campaign_completed' },
  { label: 'Client Connected', value: 'client_connected' },
  { label: 'Client Disconnected', value: 'client_disconnected' },
  { label: 'SmartBot Reply', value: 'smartbot_reply' },
  { label: 'Session QR', value: 'session_qr' }
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const [formData, setFormData] = useState({
    url: '',
    events: [],
    secret: '',
    enabled: true
  });

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const response = await axios.get('/api/webhooks');
      setWebhooks(response.data.webhooks);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingWebhook) {
        await axios.patch(`/api/webhooks/${editingWebhook.id}`, formData);
      } else {
        await axios.post('/api/webhooks', formData);
      }
      
      setShowDialog(false);
      loadWebhooks();
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Webhook saved successfully'
      });
    } catch (error) {
      console.error('Failed to save webhook:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/webhooks/${id}`);
      loadWebhooks();
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  const handleTest = async (id: string) => {
    try {
      await axios.post(`/api/webhooks/${id}/test`);
      toast.current.show({
        severity: 'info',
        summary: 'Test Sent',
        detail: 'Test webhook has been dispatched'
      });
    } catch (error) {
      console.error('Failed to test webhook:', error);
    }
  };

  const actionTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          size="small"
          onClick={() => {
            setEditingWebhook(rowData);
            setFormData(rowData);
            setShowDialog(true);
          }}
        />
        <Button
          icon="pi pi-send"
          size="small"
          severity="info"
          onClick={() => handleTest(rowData.id)}
        />
        <Button
          icon="pi pi-trash"
          size="small"
          severity="danger"
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Card title="Webhooks Management">
          <div className="mb-3">
            <Button
              label="Add Webhook"
              icon="pi pi-plus"
              onClick={() => {
                setEditingWebhook(null);
                setFormData({ url: '', events: [], secret: '', enabled: true });
                setShowDialog(true);
              }}
            />
          </div>

          <DataTable value={webhooks} paginator rows={10}>
            <Column field="url" header="URL" />
            <Column
              field="events"
              header="Events"
              body={(rowData) => rowData.events.join(', ')}
            />
            <Column
              field="enabled"
              header="Status"
              body={(rowData) => (
                <span className={`badge ${rowData.enabled ? 'badge-success' : 'badge-danger'}`}>
                  {rowData.enabled ? 'Enabled' : 'Disabled'}
                </span>
              )}
            />
            <Column header="Actions" body={actionTemplate} />
          </DataTable>
        </Card>
      </div>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={editingWebhook ? 'Edit Webhook' : 'Add Webhook'}
        style={{ width: '600px' }}
      >
        <div className="flex flex-column gap-3">
          <div>
            <label>Webhook URL</label>
            <InputText
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full"
              placeholder="https://yourapp.com/webhooks/waqtor"
            />
          </div>

          <div>
            <label>Events</label>
            <MultiSelect
              value={formData.events}
              onChange={(e) => setFormData({ ...formData, events: e.value })}
              options={WEBHOOK_EVENTS}
              className="w-full"
              placeholder="Select events"
            />
          </div>

          <div>
            <label>Secret Key</label>
            <InputText
              value={formData.secret}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              className="w-full"
              placeholder="Leave empty to auto-generate"
            />
          </div>

          <div className="flex align-items-center gap-2">
            <label>Enabled</label>
            <InputSwitch
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.value })}
            />
          </div>

          <div className="flex justify-content-end gap-2">
            <Button label="Cancel" severity="secondary" onClick={() => setShowDialog(false)} />
            <Button label="Save" onClick={handleSave} />
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
}
```

---

### **📝 Example Usage:**

#### **cURL Test:**

```bash
# Test webhook endpoint
curl -X POST https://yourapp.com/webhooks/waqtor \
  -H "X-Waqtor-Signature: sha256=abc123..." \
  -H "X-Waqtor-Event: message_received" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_received",
    "timestamp": "2025-10-30T19:30:00Z",
    "data": {
      "from": "9715...@c.us",
      "body": "Hi",
      "messageId": "msg_123",
      "isGroup": false
    }
  }'
```

#### **Node.js Webhook Receiver:**

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = 'your_secret_here';

app.post('/webhooks/waqtor', (req, res) => {
  // Verify signature
  const signature = req.headers['x-waqtor-signature'];
  const rawBody = JSON.stringify(req.body);
  
  const expectedSig = 'sha256=' + crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  
  if (signature !== expectedSig) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook
  const { event, data } = req.body;
  
  switch (event) {
    case 'message_received':
      console.log('New message from:', data.from);
      console.log('Message body:', data.body);
      break;
      
    case 'campaign_completed':
      console.log('Campaign completed:', data.campaignId);
      console.log('Total sent:', data.totalSent);
      break;
      
    default:
      console.log('Unknown event:', event);
  }
  
  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook receiver running on port 3000');
});
```

---

### **📊 Webhook Logs & Monitoring:**

```typescript
// Dashboard component for webhook logs
interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failed';
  statusCode: number;
  timestamp: Date;
  responseTime: number;
}

export function WebhookLogs() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);

  return (
    <Card title="Webhook Logs">
      <DataTable value={logs} paginator rows={20}>
        <Column field="timestamp" header="Time" />
        <Column field="event" header="Event" />
        <Column field="status" header="Status" />
        <Column field="statusCode" header="Status Code" />
        <Column field="responseTime" header="Response Time (ms)" />
      </DataTable>
    </Card>
  );
}
```

---

### **🔧 Configuration (.env):**

```bash
# Webhook settings
WEBHOOK_SECRET=your_super_secret_key_here
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_RETRY_DELAY=1000
WEBHOOK_TIMEOUT=10000
```

---

### **📝 الملفات المطلوبة:**

```
📁 packages/server/src/webhooks/
├── WebhookManager.ts          # Webhook dispatcher
├── signature.ts               # HMAC signature utilities
└── types.ts                   # TypeScript definitions

📁 packages/server/src/api/
└── webhooks.ts                # Webhook CRUD API

📁 dashboard/src/app/(main)/settings/webhooks/
├── page.tsx                   # Webhooks management page
└── logs/
    └── page.tsx               # Webhook logs page

📁 documentation/
└── WEBHOOKS.md                # Webhook documentation
```

---

---

## 🤖 **المرحلة 9: SmartBot AI Engine v2** ✅

**الميزات المكتملة:**
- ✅ Semantic Matching (Embeddings: MiniLM/MPNet)
- ✅ Confidence scoring
- ✅ Template expansion مع متغيرات ديناميكية
- ✅ Learning loop مع مراجعة بشرية
- ✅ Database Schema (smartbot_rules, smartbot_embeddings, smartbot_history, smartbot_suggestions)

**الملفات:**
- `/runtime/server/ai/` - SemanticMatcher.js, EmbeddingService.js
- `/runtime/server/database/smartbot.db`

---

## 🏗️ **المرحلة 10: Architecture Evolution** ✅

**الميزات المكتملة:**
- ✅ Modular Microkernel Architecture
- ✅ Backward Compatibility
- ✅ Plugin System
- ✅ Event-driven Architecture

**الملفات:**
- `/runtime/server/core/` - EventBus.js, PluginManager.js

---

---
- إرسال/استقبال الرسائل
- إدارة الحملات (Campaign Engine)
- Storage abstraction

// ❌ لا يعرف شيئاً عن:
- Express.js
- Next.js
- HTTP/REST
- WebSocket
- UI/Frontend
```

#### **2. @waqtor/server** (طبقة الـ API)
```typescript
// ✅ المسؤوليات:
- REST API endpoints
- WebSocket server
- Webhooks
- Authentication & Authorization
- Rate limiting
- CORS handling

// ❌ لا يحتوي على:
- UI components
- Frontend logic
- Direct WhatsApp logic (يستهلك core فقط)
```

#### **3. Dashboard** (الواجهة الأمامية)
```typescript
// ✅ المسؤوليات:
- UI/UX
- User interactions
- Data visualization
- Real-time updates

// ❌ لا يعرف شيئاً عن:
- WhatsApp internals
- Puppeteer
- Session management
- (يستهلك REST/WS فقط)
```

---

### **📡 واجهة الأحداث والأوامر (Contracts):**

#### **Events** (يُبثّها `@waqtor/core`):
```typescript
type CoreEvents =
  | { 
      type: 'session.qr'; 
      data: { qr: string; timestamp: string } 
    }
  | { 
      type: 'session.status'; 
      data: { 
        status: 'ready' | 'disconnected' | 'auth_failure' | 'connecting'; 
        timestamp: string;
        clientInfo?: {
          platform: string;
          phoneNumber: string;
          name: string;
        }
      } 
    }
  | { 
      type: 'message.received'; 
      data: { 
        from: string; 
        body: string; 
        timestamp: string;
        messageId: string;
        isGroup: boolean;
      } 
    }
  | { 
      type: 'message.sent'; 
      data: { 
        to: string; 
        messageId: string; 
        timestamp: string;
        status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
      } 
    }
  | { 
      type: 'campaign.progress'; 
      data: { 
        campaignId: string; 
        sent: number; 
        total: number; 
        failed: number;
        status: 'running' | 'paused' | 'completed' | 'failed';
      } 
    }
  | {
      type: 'smartbot.reply';
      data: {
        to: string;
        trigger: string;
        response: string;
        timestamp: string;
      }
    };
```

#### **Commands** (يستقبلها `@waqtor/core`):
```typescript
interface CoreCommands {
  // Message Commands
  sendText(params: {
    chatId: string;
    text: string;
    options?: {
      quotedMessageId?: string;
      mentionedIds?: string[];
    };
  }): Promise<{ messageId: string; timestamp: string }>;

  sendMedia(params: {
    chatId: string;
    media: string | Buffer;
    type: 'image' | 'video' | 'audio' | 'document';
    caption?: string;
    filename?: string;
  }): Promise<{ messageId: string; timestamp: string }>;

  // Campaign Commands
  createCampaign(params: {
    name: string;
    recipients: string[];
    template: string;
    variables?: Record<string, any>;
    scheduleAt?: Date;
  }): Promise<{ campaignId: string }>;

  controlCampaign(params: {
    campaignId: string;
    action: 'pause' | 'resume' | 'cancel';
  }): Promise<{ status: string }>;

  // Session Commands
  getSessionState(): Promise<{
    status: 'ready' | 'disconnected' | 'connecting';
    clientInfo?: ClientInfo;
  }>;

  logout(): Promise<void>;
  
  restartSession(): Promise<void>;
}
```

---

### **🔌 Plugin System (اختياري):**

```typescript
// @waqtor/core/src/plugins/interface.ts
interface WaqtorPlugin {
  name: string;
  version: string;
  
  // Lifecycle hooks
  onLoad?(core: WaqtorCore): void;
  onMessage?(message: Message): void | Promise<void>;
  onSessionChange?(status: SessionStatus): void;
  
  // Custom commands
  commands?: Record<string, PluginCommand>;
}

// Example: SmartBot Plugin
class SmartBotPlugin implements WaqtorPlugin {
  name = 'smartbot';
  version = '1.0.0';
  
  async onMessage(message: Message) {
    const reply = await this.matchRule(message.body);
    if (reply) {
      await message.reply(reply);
    }
  }
  
  private async matchRule(text: string): Promise<string | null> {
    // Smart matching logic
  }
}
```

---

### **📚 SDK Examples:**

#### **Node.js SDK (@waqtor/sdk):**
```typescript
import { WaqtorClient } from '@waqtor/sdk';

const client = new WaqtorClient({
  apiUrl: 'http://localhost:8080',
  apiKey: 'your_api_key_here'
});

// Send message
await client.messages.send({
  to: '966501234567@c.us',
  text: 'Hello from Waqtor SDK!'
});

// Listen to events
client.on('message.received', (data) => {
  console.log('New message:', data);
});

// Create campaign
const campaign = await client.campaigns.create({
  name: 'New Year Sale',
  recipients: ['966501234567@c.us', '966501234568@c.us'],
  template: 'Happy New Year! Get {{discount}}% off!',
  variables: { discount: 50 }
});
```

#### **Python SDK (waqtor):**
```python
from waqtor import WaqtorClient

client = WaqtorClient(
    api_url='http://localhost:8080',
    api_key='your_api_key_here'
)

# Send message
client.messages.send(
    to='966501234567@c.us',
    text='Hello from Waqtor Python SDK!'
)

# Listen to events
@client.on('message.received')
def on_message(data):
    print(f"New message: {data}")

# Create campaign
campaign = client.campaigns.create(
    name='New Year Sale',
    recipients=['966501234567@c.us', '966501234568@c.us'],
    template='Happy New Year! Get {{discount}}% off!',
    variables={'discount': 50}
)
```

---

### **🔄 Migration Path (خطة الانتقال):**

#### **Phase 1: Refactor Core** (4-6 أسابيع)
- [ ] استخراج `@waqtor/core` من الكود الحالي
- [ ] تطبيق EventBus pattern
- [ ] تعريف Contracts (Events + Commands)
- [ ] Unit tests للـ core
- [ ] Documentation

#### **Phase 2: Isolate Server** (2-3 أسابيع)
- [ ] نقل REST API إلى `@waqtor/server`
- [ ] Dependency Injection للـ core
- [ ] WebSocket refactoring
- [ ] Integration tests
- [ ] API versioning (v1, v2)

#### **Phase 3: Build SDKs** (3-4 أسابيع)
- [ ] تطوير `@waqtor/sdk` (Node.js)
- [ ] تطوير `waqtor` (Python)
- [ ] TypeScript definitions
- [ ] SDK documentation
- [ ] Example projects

#### **Phase 4: Dashboard Migration** (1-2 أسابيع)
- [ ] استخدام SDK بدلاً من Axios مباشرة
- [ ] تحديث WebSocket client
- [ ] Testing & validation
- [ ] Performance optimization

#### **Phase 5: Multi-Instance Support** (2-3 أسابيع)
- [ ] Instance Manager
- [ ] Database per instance
- [ ] Load balancing
- [ ] Monitoring & health checks

---

### **📊 Benefits (الفوائد):**

#### **1. Maintainability (سهولة الصيانة)**
- ✅ كل package له مسؤولية واحدة
- ✅ تحديثات معزولة (update core بدون تأثير على server)
- ✅ Testing أسهل (unit tests per package)

#### **2. Scalability (قابلية التوسع)**
- ✅ Multi-instance support
- ✅ Horizontal scaling
- ✅ Plugin system للميزات الإضافية

#### **3. Developer Experience**
- ✅ SDK رسمي للمطورين
- ✅ TypeScript support كامل
- ✅ Documentation واضحة
- ✅ Examples جاهزة

#### **4. Backward Compatibility**
- ✅ الـ API الحالي يبقى كما هو
- ✅ Dashboard يعمل بدون تغييرات
- ✅ Migration تدريجية (phased approach)

---

### **🧪 Testing Strategy:**

```typescript
// @waqtor/core tests
describe('SessionManager', () => {
  it('should emit qr event on initialization', async () => {
    const manager = new SessionManager();
    const qrPromise = new Promise(resolve => {
      manager.on('session.qr', resolve);
    });
    
    await manager.initialize();
    const qrData = await qrPromise;
    
    expect(qrData).toHaveProperty('qr');
  });
});

// @waqtor/server tests
describe('POST /api/messages/send-text', () => {
  it('should send message and return messageId', async () => {
    const response = await request(app)
      .post('/api/messages/send-text')
      .set('X-API-Key', 'test_key')
      .send({
        chatId: '966501234567@c.us',
        text: 'Test message'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('messageId');
  });
});

// @waqtor/sdk tests
describe('WaqtorClient', () => {
  it('should send message via SDK', async () => {
    const client = new WaqtorClient({ apiKey: 'test' });
    const result = await client.messages.send({
      to: '966501234567@c.us',
      text: 'SDK test'
    });
    
    expect(result).toHaveProperty('messageId');
  });
});
```

---

### **📝 الملفات المطلوبة:**

```
📁 packages/core/
├── src/
│   ├── engine/
│   │   ├── WhatsAppClient.ts
│   │   ├── SessionManager.ts
│   │   └── EventBus.ts
│   ├── campaigns/
│   │   ├── CampaignEngine.ts
│   │   └── CampaignScheduler.ts
│   ├── storage/
│   │   ├── StorageAdapter.ts
│   │   ├── SQLiteAdapter.ts
│   │   └── MemoryAdapter.ts
│   ├── plugins/
│   │   ├── PluginInterface.ts
│   │   └── PluginManager.ts
│   ├── types/
│   │   ├── events.ts
│   │   └── commands.ts
│   └── index.ts
├── tests/
├── package.json
└── README.md

📁 packages/server/
├── src/
│   ├── api/
│   │   ├── messages.ts
│   │   ├── campaigns.ts
│   │   ├── status.ts
│   │   └── webhooks.ts
│   ├── ws/
│   │   └── websocket.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   └── cors.ts
│   ├── bootstrap.ts
│   └── index.ts
├── tests/
├── package.json
└── README.md

📁 packages/sdk-node/
├── src/
│   ├── client.ts
│   ├── resources/
│   │   ├── messages.ts
│   │   ├── campaigns.ts
│   │   └── status.ts
│   ├── types.ts
│   └── index.ts
├── tests/
├── examples/
├── package.json
└── README.md

📁 packages/sdk-py/
├── waqtor/
│   ├── __init__.py
│   ├── client.py
│   ├── resources/
│   │   ├── messages.py
│   │   ├── campaigns.py
│   │   └── status.py
│   └── types.py
├── tests/
├── examples/
├── setup.py
└── README.md
```

---

### **⏱️ Timeline (الجدول الزمني):**

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1** | 4-6 weeks | `@waqtor/core` package |
| **Phase 2** | 2-3 weeks | `@waqtor/server` package |
| **Phase 3** | 3-4 weeks | SDKs (Node + Python) |
| **Phase 4** | 1-2 weeks | Dashboard migration |
| **Phase 5** | 2-3 weeks | Multi-instance support |
| **Total** | **12-18 weeks** | Full modular architecture |

---

### **🎯 Success Metrics:**

- ✅ **Code Coverage**: > 80% for all packages
- ✅ **API Compatibility**: 100% backward compatible
- ✅ **Performance**: No regression in response times
- ✅ **Bundle Size**: Core < 500KB, SDK < 100KB
- ✅ **Documentation**: 100% API coverage
- ✅ **Developer Adoption**: 10+ community projects using SDK

---

## 🗺️ **خطة التنفيذ العملية (Incremental Roadmap)**

### **Phase A: التهيئة المعمارية (4-6 أسابيع)**

#### **الأهداف:**
- ✅ إنشاء `packages/core` مع Events/Commands كواجهات رسمية
- ✅ نقل WhatsAppClient/SessionManager إلى core
- ✅ جعل server يحقن core عبر DI

#### **المهام:**

**Week 1-2: Core Package Setup**
- [ ] إنشاء `packages/core` directory structure
- [ ] تعريف Event interfaces (`session.qr`, `message.received`, etc.)
- [ ] تعريف Command interfaces (`sendText`, `createCampaign`, etc.)
- [ ] إنشاء EventBus class
- [ ] Unit tests للـ EventBus

**Week 3-4: Migration**
- [ ] نقل WhatsAppClient من `runtime/server` إلى `packages/core`
- [ ] نقل SessionManager إلى core
- [ ] تحديث imports في server
- [ ] Integration tests

**Week 5-6: Dependency Injection**
- [ ] إنشاء `bootstrap.ts` في server
- [ ] تطبيق DI pattern
- [ ] Refactor server routes لاستخدام injected core
- [ ] Documentation update

**Deliverables:**
```
packages/core/
├── src/
│   ├── engine/
│   │   ├── WhatsAppClient.ts
│   │   ├── SessionManager.ts
│   │   └── EventBus.ts
│   ├── types/
│   │   ├── events.ts
│   │   └── commands.ts
│   └── index.ts
└── package.json

packages/server/
├── src/
│   ├── bootstrap.ts          # DI setup
│   └── index.ts
```

---

### **Phase B: WebSocket 2.0 (2-3 أسابيع)**

#### **الأهداف:**
- ✅ تنفيذ Namespaces (`/status`, `/campaigns`, `/smartbot`)
- ✅ Heartbeat + Auto-reconnect + Backpressure
- ✅ تحديث Dashboard hooks

#### **المهام:**

**Week 1: Server Implementation**
- [ ] إنشاء `packages/server/src/ws/` directory
- [ ] تطبيق `/status` namespace
- [ ] تطبيق `/campaigns` namespace مع backpressure
- [ ] تطبيق `/smartbot` namespace
- [ ] Heartbeat mechanism (ping/pong every 15s)
- [ ] WebSocket authentication middleware

**Week 2: Client Implementation**
- [ ] إنشاء `useWebSocket` base hook
- [ ] إنشاء `useStatusWebSocket` hook
- [ ] إنشاء `useCampaignsWebSocket` hook
- [ ] إنشاء `useSmartBotWebSocket` hook
- [ ] Auto-reconnect مع exponential backoff

**Week 3: Testing & Integration**
- [ ] WebSocket connection tests
- [ ] Namespace isolation tests
- [ ] Backpressure tests
- [ ] Dashboard integration
- [ ] Performance testing

**Deliverables:**
```
packages/server/src/ws/
├── index.ts
├── namespaces/
│   ├── status.ts
│   ├── campaigns.ts
│   └── smartbot.ts
└── utils/
    ├── backpressure.ts
    └── heartbeat.ts

dashboard/src/hooks/
├── useWebSocket.ts
├── useStatusWebSocket.ts
├── useCampaignsWebSocket.ts
└── useSmartBotWebSocket.ts
```

---

### **Phase C: Webhooks (2-3 أسابيع)**

#### **الأهداف:**
- ✅ مسار `/api/webhooks/*` مع HMAC signature
- ✅ نموذج إدارة Webhooks في Settings
- ✅ Test delivery + logs

#### **المهام:**

**Week 1: Backend**
- [ ] إنشاء WebhookManager class
- [ ] تطبيق HMAC signature (sha256)
- [ ] API routes (CRUD + test)
- [ ] Retry mechanism مع exponential backoff
- [ ] Webhook logging

**Week 2: Dashboard**
- [ ] صفحة Webhooks management
- [ ] Add/Edit/Delete webhooks
- [ ] Test webhook button
- [ ] Webhook logs viewer
- [ ] MultiSelect للأحداث

**Week 3: Testing & Documentation**
- [ ] Integration tests
- [ ] cURL examples
- [ ] Node.js receiver example
- [ ] Python receiver example
- [ ] WEBHOOKS.md documentation

**Deliverables:**
```
packages/server/src/webhooks/
├── WebhookManager.ts
├── signature.ts
└── types.ts

packages/server/src/api/
└── webhooks.ts

dashboard/src/app/(main)/settings/webhooks/
├── page.tsx
└── logs/page.tsx

documentation/
└── WEBHOOKS.md
```

---

### **Phase D: SmartBot v2 (3-4 أسابيع)**

#### **الأهداف:**
- ✅ طبقة Embeddings + تخزين متجهي
- ✅ Migration لجداول embeddings/history
- ✅ Test Bench في الواجهة

#### **المهام:**

**Week 1: Embedding Service**
- [ ] تثبيت `@xenova/transformers`
- [ ] إنشاء EmbeddingService class
- [ ] تطبيق cosine similarity
- [ ] Benchmark performance

**Week 2: Database Migration**
- [ ] إنشاء جداول جديدة (embeddings, history, suggestions)
- [ ] Migration script من JSON إلى SQLite
- [ ] Data validation

**Week 3: SmartBot Engine v2**
- [ ] تطبيق Pipeline (8 steps)
- [ ] TemplateEngine class
- [ ] SafetyLayer class
- [ ] Integration مع EventBus

**Week 4: Dashboard**
- [ ] Enhanced rule management
- [ ] "Generate Embedding" button
- [ ] Test Bench (Top-3 matches + confidence)
- [ ] Auto-Improve suggestions page

**Deliverables:**
```
packages/server/src/smartbot/
├── EmbeddingService.ts
├── SmartBotEngineV2.ts
├── TemplateEngine.ts
├── SafetyLayer.ts
└── LanguageDetector.ts

database/migrations/
└── 003_smartbot_v2.sql

dashboard/src/app/(main)/smartbot/
├── page.tsx (enhanced)
└── suggestions/
    └── page.tsx
```

---

### **Phase E: SDK (3-4 أسابيع)**

#### **الأهداف:**
- ✅ `@waqtor/sdk` (Node.js) يغلف REST/WS/Webhooks
- ✅ Python SDK بنفس العقود

#### **المهام:**

**Week 1-2: Node.js SDK**
- [ ] إنشاء `packages/sdk-node`
- [ ] WaqtorClient class
- [ ] Resources (messages, campaigns, status)
- [ ] WebSocket client wrapper
- [ ] TypeScript definitions
- [ ] Unit tests

**Week 3: Python SDK**
- [ ] إنشاء `packages/sdk-py`
- [ ] WaqtorClient class (Python)
- [ ] Resources implementation
- [ ] Type hints
- [ ] Unit tests

**Week 4: Documentation & Examples**
- [ ] SDK documentation
- [ ] Example projects (basic-bot, campaign-scheduler)
- [ ] API reference
- [ ] Publish to npm/PyPI

**Deliverables:**
```
packages/sdk-node/
├── src/
│   ├── client.ts
│   ├── resources/
│   │   ├── messages.ts
│   │   ├── campaigns.ts
│   │   └── status.ts
│   └── index.ts
├── examples/
└── README.md

packages/sdk-py/
├── waqtor/
│   ├── __init__.py
│   ├── client.py
│   └── resources/
├── examples/
└── README.md
```

---

## 📊 **Timeline Summary:**

| Phase | Duration | Start | End | Status |
|-------|----------|-------|-----|--------|
| **Phase A** | 4-6 weeks | Week 1 | Week 6 | 🔵 Planned |
| **Phase B** | 2-3 weeks | Week 7 | Week 9 | 🔵 Planned |
| **Phase C** | 2-3 weeks | Week 10 | Week 12 | 🔵 Planned |
| **Phase D** | 3-4 weeks | Week 13 | Week 16 | 🔵 Planned |
| **Phase E** | 3-4 weeks | Week 17 | Week 20 | 🔵 Planned |
| **Total** | **14-20 weeks** | - | - | **~4-5 months** |

---

## 📝 **Design Contracts (للـ README العام)**

### **Event Names:**

```typescript
// Session Events
- 'session.qr'              // QR code generated
- 'session.status'          // Status changed (ready/disconnected/connecting)
- 'session.stats'           // Statistics updated

// Message Events
- 'message.received'        // Incoming message
- 'message.sent'            // Outgoing message sent
- 'message.delivered'       // Message delivered
- 'message.read'            // Message read

// Campaign Events
- 'campaign.progress'       // Campaign execution progress
- 'campaign.completed'      // Campaign finished
- 'campaign.paused'         // Campaign paused
- 'campaign.failed'         // Campaign failed

// SmartBot Events
- 'smartbot.reply'          // Auto-reply sent
- 'smartbot.rule-updated'   // Rule created/updated/deleted
```

### **REST → Commands:**

```typescript
// Message Commands
POST /api/messages/send-text
POST /api/messages/send-media
POST /api/messages/send-button
POST /api/messages/send-list

// Campaign Commands
POST /api/campaigns/create
POST /api/campaigns/:id/execute
POST /api/campaigns/:id/pause
POST /api/campaigns/:id/resume
POST /api/campaigns/:id/cancel
GET  /api/campaigns/:id/status

// Session Commands
GET  /api/session/state
POST /api/session/logout
POST /api/session/restart

// SmartBot Commands
GET  /api/smartbot/rules
POST /api/smartbot/rules
PUT  /api/smartbot/rules/:id
DELETE /api/smartbot/rules/:id
POST /api/smartbot/test

// Webhook Commands
GET  /api/webhooks
POST /api/webhooks
PATCH /api/webhooks/:id
DELETE /api/webhooks/:id
POST /api/webhooks/:id/test
```

---

## 🔄 **Data Flow (للـ README الخاص بالـ Dashboard)**

### **WebSocket Data Flow:**

```
Backend Events
    ↓
WebSocket Namespaces
    ├─ /status    → session.qr, session.status, session.stats
    ├─ /campaigns → campaign.progress, campaign.completed
    └─ /smartbot  → message.received, smartbot.reply
    ↓
Dashboard Hooks
    ├─ useStatusWebSocket()
    ├─ useCampaignsWebSocket()
    └─ useSmartBotWebSocket()
    ↓
Zustand Store
    ├─ setQrCode()
    ├─ setSessionStatus()
    ├─ updateCampaignProgress()
    └─ addSmartBotReply()
    ↓
React Components
    ├─ QRStatusCard
    ├─ SessionStatsCard
    ├─ CampaignList
    └─ SmartBotHistory
```

### **REST Data Flow:**

```
User Action
    ↓
React Component
    ↓
React Query Mutation
    ├─ useMutation('sendMessage')
    ├─ useMutation('createCampaign')
    └─ useMutation('executeCommand')
    ↓
REST API
    ├─ POST /api/messages/send-text
    ├─ POST /api/campaigns/create
    └─ POST /api/campaigns/:id/execute
    ↓
Backend Processing
    ↓
Event Emitted
    ↓
WebSocket Broadcast
    ↓
Dashboard Update (real-time)
```

### **Cache Strategy:**

```typescript
// React Query Cache
- Stale Time: 30 seconds (most queries)
- Cache Time: 5 minutes
- Retry: 3 attempts with exponential backoff
- Refetch on Window Focus: Enabled for critical data

// Zustand Store (UI State)
- Theme, scale, sidebar visibility
- Branding (logo, app name, footer)
- Persisted to localStorage

// WebSocket (Real-time)
- In-memory cache
- No persistence
- Auto-reconnect on disconnect
```

---

## 🔧 **المرحلة 9️⃣: WebSocket & Notification Enhancements** 📊 **PLANNED**

### **🎯 الأهداف:**
- 🗄️ نقل Notifications من In-Memory إلى Database
- 🛡️ إضافة Rate Limiting للـ WebSocket
- 📦 إضافة Compression للرسائل الكبيرة
- 💓 Heartbeat قوي وإنهاء الاتصالات الميتة
- 🛡️ Backpressure وحماية الذاكرة

---

### **📋 المهام:**

#### **0. تحسينات Native WebSocket (ws)** 🚀

**الحالة الحالية:**
```javascript
// /runtime/server/services/websocketBridge.js
// WebSocket بدون heartbeat قوي أو backpressure
```

**المطلوب:**
- ✅ Heartbeat قوي مع ping/pong
- ✅ إنهاء الاتصالات الميتة تلقائياً
- ✅ Backpressure handling
- ✅ حماية من رسائل ضخمة
- ✅ Compression تلقائي للرسائل الكبيرة

---

##### **0.1 Heartbeat قوي وإنهاء الاتصالات الميتة** 💓

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js

class WebSocketBridge {
    constructor(server, sessionMonitor) {
        this.server = server;
        this.sessionMonitor = sessionMonitor;
        this.apiKey = process.env.API_KEY;
        this.clients = new Set();  // تعقب يدوي للعملاء
        this.healthInterval = null;
    }

    initialize() {
        try {
            this.wss = new WebSocket.Server({ 
                server: this.server,
                path: '/ws',
                clientTracking: false,           // ✅ نمسك إحنا الـ clients
                perMessageDeflate: {
                    threshold: 1024,              // ✅ ضغط للرسائل > 1KB فقط
                    zlibDeflateOptions: {
                        level: 6,                 // توازن بين السرعة والضغط
                    },
                    zlibInflateOptions: {
                        chunkSize: 10 * 1024
                    },
                    clientNoContextTakeover: true,
                    serverNoContextTakeover: true,
                    serverMaxWindowBits: 10,
                    concurrencyLimit: 10,
                },
                maxPayload: 1024 * 1024,         // ✅ 1MB حماية من رسائل ضخمة
            });

            this.setupEventHandlers();
            this.setupHealthCheck();
            
            // Connect to session monitor
            if (this.sessionMonitor) {
                this.sessionMonitor.setWebSocketBroadcast(
                    this.broadcast.bind(this)
                );
            }

            logger.info('WebSocket bridge initialized with heartbeat & compression');
        } catch (error) {
            logger.error('Failed to initialize WebSocket bridge:', error);
            throw error;
        }
    }

    setupEventHandlers() {
        this.wss.on('connection', (ws, req) => {
            // ✅ تعقب حالة الاتصال
            ws.isAlive = true;
            ws.ip = req.socket.remoteAddress;
            ws.connectedAt = Date.now();

            logger.info(`WebSocket client connected from ${ws.ip}`);

            // Authentication check
            const apiKey = this.extractApiKey(req);
            if (!this.validateApiKey(apiKey)) {
                logger.warn('WebSocket connection rejected: Invalid API key');
                ws.close(1008, 'Invalid API key');
                return;
            }

            // ✅ Add to clients set
            this.clients.add(ws);
            ws.isAuthenticated = true;

            // ✅ Pong handler - تحديث حالة الاتصال
            ws.on('pong', () => { 
                ws.isAlive = true;
                logger.debug(`Pong received from ${ws.ip}`);
            });

            // Send initial session state
            this.sendSessionState(ws);
            this.sendQRCode(ws);

            // Handle messages from client
            ws.on('message', (message) => {
                this.handleClientMessage(ws, message);
            });

            // Handle client disconnect
            ws.on('close', (code, reason) => {
                this.clients.delete(ws);
                const duration = Date.now() - ws.connectedAt;
                logger.info(`WebSocket client disconnected: ${ws.ip} (code: ${code}, duration: ${Math.round(duration/1000)}s)`);
            });

            // Handle errors
            ws.on('error', (error) => {
                logger.error('WebSocket client error:', error);
                this.clients.delete(ws);
            });
        });

        this.wss.on('error', (error) => {
            logger.error('WebSocket server error:', error);
        });
    }

    /**
     * ✅ Setup health check - فحص الصحة كل 30 ثانية
     */
    setupHealthCheck() {
        this.healthInterval = setInterval(() => {
            let alive = 0;
            let dead = 0;

            for (const ws of this.clients) {
                // ✅ إذا لم يرد على آخر ping، اقطع الاتصال
                if (ws.isAlive === false) {
                    logger.warn(`Terminating dead connection from ${ws.ip}`);
                    try { 
                        ws.terminate(); 
                    } catch (err) {
                        logger.error('Error terminating connection:', err);
                    }
                    this.clients.delete(ws);
                    dead++;
                    continue;
                }

                // ✅ ارسل ping جديد
                ws.isAlive = false;
                try { 
                    ws.ping();
                    alive++;
                } catch (err) {
                    logger.error('Error sending ping:', err);
                    this.clients.delete(ws);
                    dead++;
                }
            }

            if (alive > 0 || dead > 0) {
                logger.debug(`Health check: ${alive} alive, ${dead} dead connections cleaned`);
            }
        }, 30000); // كل 30 ثانية

        logger.info('WebSocket health check started (30s interval)');
    }

    // ... rest of the methods
}
```

---

##### **0.2 Backpressure وحماية الذاكرة** 🛡️

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js

class WebSocketBridge {
    /**
     * ✅ Safe send - لا تبعث لو الـ buffer مزدحم
     */
    safeSend(ws, data) {
        // Check if connection is open
        if (ws.readyState !== WebSocket.OPEN) {
            logger.debug('Cannot send: WebSocket not open');
            return false;
        }

        // ✅ Check backpressure - لو الـ buffer > 512KB، لا ترسل
        if (ws.bufferedAmount > 512 * 1024) {
            logger.warn(`Backpressure detected: ${ws.bufferedAmount} bytes buffered for ${ws.ip}`);
            return false;
        }

        try {
            const message = typeof data === 'string' ? data : JSON.stringify(data);
            ws.send(message);
            return true;
        } catch (error) {
            logger.error('Error sending message:', error);
            return false;
        }
    }

    /**
     * ✅ Send message to a specific client (with backpressure)
     */
    send(ws, data) {
        const message = {
            type: data.type || 'message',
            data: data.data || data,
            timestamp: Date.now()
        };

        return this.safeSend(ws, message);
    }

    /**
     * ✅ Broadcast message to all connected clients (with backpressure)
     */
    broadcast(type, data) {
        const message = {
            type,
            data,
            timestamp: Date.now()
        };

        let sent = 0;
        let skipped = 0;

        for (const client of this.clients) {
            if (!client.isAuthenticated) {
                continue;
            }

            // Check subscriptions
            if (client.subscriptions && 
                !client.subscriptions.includes('all') && 
                !client.subscriptions.includes(type)) {
                continue;
            }

            // ✅ Use safeSend with backpressure check
            if (this.safeSend(client, message)) {
                sent++;
            } else {
                skipped++;
            }
        }

        if (sent > 0) {
            logger.debug(`Broadcast sent to ${sent} clients: ${type} (${skipped} skipped due to backpressure)`);
        }

        return { sent, skipped };
    }

    /**
     * ✅ Broadcast with priority (for critical messages)
     */
    broadcastPriority(type, data) {
        const message = {
            type,
            data,
            timestamp: Date.now(),
            priority: 'high'
        };

        let sent = 0;

        for (const client of this.clients) {
            if (!client.isAuthenticated) continue;

            // ✅ For priority messages, send even if buffer is slightly full
            if (client.readyState === WebSocket.OPEN) {
                // Allow up to 1MB for priority messages
                if (client.bufferedAmount < 1024 * 1024) {
                    try {
                        client.send(JSON.stringify(message));
                        sent++;
                    } catch (error) {
                        logger.error('Error sending priority message:', error);
                    }
                }
            }
        }

        logger.info(`Priority broadcast sent to ${sent} clients: ${type}`);
        return sent;
    }

    /**
     * ✅ Get buffer statistics
     */
    getBufferStats() {
        const stats = {
            clients: this.clients.size,
            totalBuffered: 0,
            maxBuffered: 0,
            avgBuffered: 0,
            overloaded: 0
        };

        for (const client of this.clients) {
            const buffered = client.bufferedAmount;
            stats.totalBuffered += buffered;
            stats.maxBuffered = Math.max(stats.maxBuffered, buffered);
            
            if (buffered > 512 * 1024) {
                stats.overloaded++;
            }
        }

        if (stats.clients > 0) {
            stats.avgBuffered = Math.round(stats.totalBuffered / stats.clients);
        }

        return stats;
    }

    /**
     * ✅ Cleanup on shutdown
     */
    shutdown() {
        // Clear health check interval
        if (this.healthInterval) {
            clearInterval(this.healthInterval);
            this.healthInterval = null;
        }

        // Close all connections gracefully
        for (const client of this.clients) {
            try {
                client.close(1000, 'Server shutting down');
            } catch (error) {
                logger.error('Error closing client connection:', error);
            }
        }

        this.clients.clear();

        // Close WebSocket server
        if (this.wss) {
            this.wss.close(() => {
                logger.info('WebSocket server closed');
            });
        }
    }
}

module.exports = WebSocketBridge;
```

---

##### **0.3 Monitoring & Statistics** 📊

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js

class WebSocketBridge {
    /**
     * ✅ Get detailed connection statistics
     */
    getDetailedStats() {
        const stats = {
            connections: {
                total: this.clients.size,
                authenticated: 0,
                alive: 0,
                dead: 0
            },
            buffer: this.getBufferStats(),
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };

        for (const client of this.clients) {
            if (client.isAuthenticated) stats.connections.authenticated++;
            if (client.isAlive) stats.connections.alive++;
            else stats.connections.dead++;
        }

        return stats;
    }

    /**
     * ✅ Log statistics periodically
     */
    startStatsLogging(intervalMs = 60000) {
        setInterval(() => {
            const stats = this.getDetailedStats();
            logger.info('WebSocket Statistics:', {
                clients: stats.connections.total,
                authenticated: stats.connections.authenticated,
                alive: stats.connections.alive,
                avgBuffer: `${Math.round(stats.buffer.avgBuffered / 1024)}KB`,
                maxBuffer: `${Math.round(stats.buffer.maxBuffered / 1024)}KB`,
                overloaded: stats.buffer.overloaded
            });
        }, intervalMs);
    }
}
```

---

##### **0.4 Configuration** ⚙️

**Environment Variables:**

```bash
# .env

# WebSocket Settings
WEBSOCKET_MAX_PAYLOAD=1048576              # 1MB
WEBSOCKET_COMPRESSION_THRESHOLD=1024       # 1KB
WEBSOCKET_BACKPRESSURE_LIMIT=524288        # 512KB
WEBSOCKET_HEALTH_CHECK_INTERVAL=30000      # 30s
WEBSOCKET_STATS_LOG_INTERVAL=60000         # 60s

# Compression Settings
WEBSOCKET_COMPRESSION_LEVEL=6              # 1-9 (6 = balanced)
```

---

##### **0.5 Testing** 🧪

**Test Heartbeat:**

```javascript
// tests/websocket-heartbeat.test.js
const WebSocket = require('ws');

describe('WebSocket Heartbeat', () => {
    it('should terminate dead connections after 30s', (done) => {
        const ws = new WebSocket('ws://localhost:8080/ws?apiKey=test');
        
        ws.on('open', () => {
            // Don't respond to pings
            ws.on('ping', () => {
                // Ignore ping - simulate dead connection
            });
        });

        ws.on('close', (code) => {
            expect(code).toBe(1006); // Abnormal closure
            done();
        });

        // Should be terminated after 30s
    }, 35000);
});
```

**Test Backpressure:**

```javascript
// tests/websocket-backpressure.test.js
describe('WebSocket Backpressure', () => {
    it('should skip messages when buffer is full', (done) => {
        const ws = new WebSocket('ws://localhost:8080/ws?apiKey=test');
        
        ws.on('open', () => {
            // Pause reading to fill buffer
            ws.pause();
            
            // Try to send many messages
            for (let i = 0; i < 1000; i++) {
                // Some messages should be skipped
            }
            
            done();
        });
    });
});
```

---

##### **0.6 Benefits** ✨

**الفوائد:**

1. **✅ Stability (الاستقرار)**
   - إنهاء الاتصالات الميتة تلقائياً
   - لا تراكم للـ zombie connections
   - Memory leak prevention

2. **✅ Performance (الأداء)**
   - Compression تلقائي للرسائل > 1KB
   - Backpressure handling يمنع تجميد السيرفر
   - Buffer overflow protection

3. **✅ Reliability (الموثوقية)**
   - Heartbeat كل 30 ثانية
   - Dead connection detection
   - Graceful shutdown

4. **✅ Monitoring (المراقبة)**
   - Buffer statistics
   - Connection health tracking
   - Detailed logging

---

##### **0.7 Topics/Rooms خفيفة (بدل Namespaces)** 📢

**المشكلة:**
- حالياً broadcast عام لجميع العملاء
- لا يوجد تصنيف للأحداث

**الحل:**
- ✅ Topics خفيفة بدون Socket.io
- ✅ Subscribe/Unsubscribe ديناميكي
- ✅ Publish لـ topic محدد فقط

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js

class WebSocketBridge {
    constructor(server, sessionMonitor) {
        // ... existing code
        this.topics = new Map(); // topic => Set<ws>
    }

    /**
     * ✅ Subscribe client to a topic
     */
    subscribe(ws, topic) {
        if (!this.topics.has(topic)) {
            this.topics.set(topic, new Set());
        }
        
        this.topics.get(topic).add(ws);
        logger.debug(`Client ${ws.ip} subscribed to topic: ${topic}`);

        // Auto-unsubscribe on close
        ws.on('close', () => {
            this.topics.get(topic)?.delete(ws);
            logger.debug(`Client ${ws.ip} unsubscribed from topic: ${topic}`);
        });
    }

    /**
     * ✅ Unsubscribe client from a topic
     */
    unsubscribe(ws, topic) {
        const subscribers = this.topics.get(topic);
        if (subscribers) {
            subscribers.delete(ws);
            logger.debug(`Client ${ws.ip} unsubscribed from topic: ${topic}`);
        }
    }

    /**
     * ✅ Publish message to a specific topic
     */
    publish(topic, payload) {
        const subscribers = this.topics.get(topic);
        if (!subscribers || subscribers.size === 0) {
            logger.debug(`No subscribers for topic: ${topic}`);
            return { sent: 0, skipped: 0 };
        }

        const message = {
            topic,
            data: payload,
            timestamp: Date.now()
        };

        let sent = 0;
        let skipped = 0;

        for (const ws of subscribers) {
            if (this.safeSend(ws, message)) {
                sent++;
            } else {
                skipped++;
            }
        }

        logger.debug(`Published to topic '${topic}': ${sent} sent, ${skipped} skipped`);
        return { sent, skipped };
    }

    /**
     * ✅ Get topic statistics
     */
    getTopicStats() {
        const stats = {};
        for (const [topic, subscribers] of this.topics.entries()) {
            stats[topic] = subscribers.size;
        }
        return stats;
    }

    /**
     * ✅ Handle subscribe message from client
     */
    handleClientMessage(ws, message) {
        try {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'subscribe':
                    // Subscribe to topics
                    if (Array.isArray(data.topics)) {
                        data.topics.forEach(topic => this.subscribe(ws, topic));
                        this.send(ws, { 
                            type: 'subscribed', 
                            topics: data.topics 
                        });
                    }
                    break;

                case 'unsubscribe':
                    // Unsubscribe from topics
                    if (Array.isArray(data.topics)) {
                        data.topics.forEach(topic => this.unsubscribe(ws, topic));
                        this.send(ws, { 
                            type: 'unsubscribed', 
                            topics: data.topics 
                        });
                    }
                    break;

                // ... existing cases
            }
        } catch (error) {
            logger.error('Error handling WebSocket message:', error);
        }
    }
}
```

**Usage Examples:**

```javascript
// Publish QR code to 'session' topic
websocketBridge.publish('session', { 
    type: 'qr', 
    qr: qrCode 
});

// Publish notification to 'notifications' topic
websocketBridge.publish('notifications', { 
    type: 'new', 
    notification: notificationData 
});

// Publish campaign progress to 'campaigns' topic
websocketBridge.publish('campaigns', { 
    type: 'progress', 
    campaignId: id,
    progress: 50 
});
```

**Frontend Subscription:**

```javascript
// dashboard/src/hooks/useWebSocket.js

// Subscribe to topics on connect
ws.onopen = () => {
    ws.send(JSON.stringify({
        type: 'subscribe',
        topics: ['session', 'notifications', 'campaigns']
    }));
};

// Handle topic messages
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.topic) {
        // Handle by topic
        switch (data.topic) {
            case 'session':
                handleSessionUpdate(data.data);
                break;
            case 'notifications':
                handleNotification(data.data);
                break;
            case 'campaigns':
                handleCampaignUpdate(data.data);
                break;
        }
    }
};
```

---

##### **0.8 Reconnect محسّن مع Jitter** 🔄

**التحسينات:**
- ✅ Exponential backoff مع jitter
- ✅ حد أقصى 30 ثانية
- ✅ Reset على الاتصال الناجح

**Implementation:**

```javascript
// /dashboard/src/hooks/useWebSocket.js

export function useWebSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    /**
     * ✅ Calculate next reconnect delay with jitter
     */
    const getReconnectDelay = useCallback((attempts) => {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (max)
        const base = Math.min(1000 * Math.pow(2, attempts), 30000);
        
        // Add random jitter (0-1000ms) to avoid thundering herd
        const jitter = Math.floor(Math.random() * 1000);
        
        return base + jitter;
    }, []);

    /**
     * ✅ Schedule reconnection
     */
    const scheduleReconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        const delay = getReconnectDelay(reconnectAttempts);
        console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1})`);

        reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
        }, delay);
    }, [reconnectAttempts, getReconnectDelay]);

    const connect = useCallback(() => {
        try {
            const wsUrl = getWebSocketUrl();
            const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
            const fullUrl = apiKey ? `${wsUrl}?apiKey=${apiKey}` : wsUrl;

            const ws = new WebSocket(fullUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('✅ WebSocket connected');
                setIsConnected(true);
                setReconnectAttempts(0); // ✅ Reset attempts on successful connection

                // Subscribe to topics
                ws.send(JSON.stringify({
                    type: 'subscribe',
                    topics: ['session', 'notifications', 'campaigns']
                }));
            };

            ws.onmessage = (event) => {
                // ... existing message handling
            };

            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                setIsConnected(false);
            };

            ws.onclose = (event) => {
                console.warn('⚠️ WebSocket disconnected:', event.code, event.reason);
                setIsConnected(false);
                
                // ✅ Schedule reconnect with backoff
                scheduleReconnect();
            };
        } catch (err) {
            console.error('❌ Failed to create WebSocket:', err);
            scheduleReconnect();
        }
    }, [scheduleReconnect]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    return {
        isConnected,
        reconnectAttempts,
        // ... other returns
    };
}
```

---

##### **0.9 Message Validation مع Zod** ✅

**المشكلة:**
- لا يوجد validation للرسائل الواردة
- خطر من رسائل malformed

**الحل:**
- ✅ Zod schema validation
- ✅ Type-safe message handling
- ✅ Reject invalid messages

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js
const { z } = require('zod');

// ✅ Define message schemas
const SubscribeSchema = z.object({
    type: z.literal('subscribe'),
    topics: z.array(z.string()).min(1)
});

const UnsubscribeSchema = z.object({
    type: z.literal('unsubscribe'),
    topics: z.array(z.string()).min(1)
});

const PingSchema = z.object({
    type: z.literal('ping')
});

const GetStateSchema = z.object({
    type: z.literal('get_state')
});

// ✅ Union of all valid message types
const IncomingMessageSchema = z.discriminatedUnion('type', [
    SubscribeSchema,
    UnsubscribeSchema,
    PingSchema,
    GetStateSchema
]);

class WebSocketBridge {
    /**
     * ✅ Handle incoming message with validation
     */
    handleClientMessage(ws, rawMessage) {
        // Parse JSON
        let message;
        try {
            message = JSON.parse(rawMessage);
        } catch (error) {
            logger.warn(`Invalid JSON from ${ws.ip}`);
            this.send(ws, { 
                type: 'error', 
                message: 'Invalid JSON format' 
            });
            return;
        }

        // ✅ Validate with Zod
        const result = IncomingMessageSchema.safeParse(message);
        
        if (!result.success) {
            logger.warn(`Invalid message schema from ${ws.ip}:`, result.error.errors);
            this.send(ws, { 
                type: 'error', 
                message: 'Invalid message format',
                errors: result.error.errors 
            });
            return;
        }

        // ✅ Handle validated message
        const validatedMessage = result.data;

        switch (validatedMessage.type) {
            case 'subscribe':
                validatedMessage.topics.forEach(topic => this.subscribe(ws, topic));
                this.send(ws, { 
                    type: 'subscribed', 
                    topics: validatedMessage.topics 
                });
                break;

            case 'unsubscribe':
                validatedMessage.topics.forEach(topic => this.unsubscribe(ws, topic));
                this.send(ws, { 
                    type: 'unsubscribed', 
                    topics: validatedMessage.topics 
                });
                break;

            case 'ping':
                this.send(ws, { type: 'pong', timestamp: Date.now() });
                break;

            case 'get_state':
                this.sendSessionState(ws);
                break;

            default:
                // TypeScript will ensure this is never reached
                break;
        }
    }
}
```

**Dependencies:**

```json
// package.json
{
  "dependencies": {
    "zod": "^3.22.4"
  }
}
```

---

##### **0.10 Metrics Endpoint** 📊

**Implementation:**

```javascript
// /runtime/server/index.js

// ✅ Metrics object
const metrics = {
    connections: 0,
    disconnections: 0,
    messages: 0,
    errors: 0,
    broadcasts: 0,
    lastQR: null,
    startTime: Date.now()
};

// ✅ Track events
websocketBridge.on('connection', () => {
    metrics.connections++;
});

websocketBridge.on('disconnect', () => {
    metrics.disconnections++;
});

websocketBridge.on('message', () => {
    metrics.messages++;
});

websocketBridge.on('error', () => {
    metrics.errors++;
});

websocketBridge.on('broadcast', (topic) => {
    metrics.broadcasts++;
    if (topic === 'session' || topic === 'qr') {
        metrics.lastQR = new Date().toISOString();
    }
});

// ✅ Metrics endpoint
app.get('/api/metrics', authenticateApiKey, (req, res) => {
    const stats = websocketBridge.getDetailedStats();
    const topicStats = websocketBridge.getTopicStats();
    
    res.json({
        metrics: {
            ...metrics,
            uptime: Math.floor((Date.now() - metrics.startTime) / 1000),
            uptimeFormatted: formatUptime(Date.now() - metrics.startTime)
        },
        websocket: {
            clients: stats.connections.total,
            authenticated: stats.connections.authenticated,
            alive: stats.connections.alive,
            dead: stats.connections.dead
        },
        topics: topicStats,
        buffer: stats.buffer,
        timestamp: new Date().toISOString()
    });
});

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}
```

**Update WebSocketBridge to emit events:**

```javascript
// /runtime/server/services/websocketBridge.js
const EventEmitter = require('events');

class WebSocketBridge extends EventEmitter {
    setupEventHandlers() {
        this.wss.on('connection', (ws, req) => {
            // ... existing code
            this.emit('connection'); // ✅ Emit event
        });

        ws.on('close', () => {
            // ... existing code
            this.emit('disconnect'); // ✅ Emit event
        });

        ws.on('message', (message) => {
            this.emit('message'); // ✅ Emit event
            this.handleClientMessage(ws, message);
        });

        ws.on('error', (error) => {
            this.emit('error', error); // ✅ Emit event
        });
    }

    publish(topic, payload) {
        // ... existing code
        this.emit('broadcast', topic); // ✅ Emit event
        return { sent, skipped };
    }
}
```

**Access Metrics:**

```bash
# Get metrics
curl -H "X-API-Key: your-key" http://localhost:8080/api/metrics

# Response:
{
  "metrics": {
    "connections": 150,
    "disconnections": 145,
    "messages": 5234,
    "errors": 2,
    "broadcasts": 1523,
    "lastQR": "2025-10-31T08:15:30.123Z",
    "uptime": 86400,
    "uptimeFormatted": "1d 0h"
  },
  "websocket": {
    "clients": 5,
    "authenticated": 5,
    "alive": 5,
    "dead": 0
  },
  "topics": {
    "session": 5,
    "notifications": 3,
    "campaigns": 2
  },
  "buffer": {
    "clients": 5,
    "totalBuffered": 2048,
    "maxBuffered": 512,
    "avgBuffered": 410,
    "overloaded": 0
  },
  "timestamp": "2025-10-31T08:19:00.000Z"
}
```

---

##### **0.11 Summary** 📝

**التحسينات المُضافة:**

1. **✅ Topics/Rooms** - Subscribe/Publish خفيف
2. **✅ Reconnect محسّن** - Exponential backoff + jitter
3. **✅ Message Validation** - Zod schema validation
4. **✅ Metrics Endpoint** - HTTP endpoint للمراقبة

**الفوائد:**

- 🎯 **Targeted Broadcasting** - إرسال للمشتركين فقط
- 🔄 **Smart Reconnection** - تجنب thundering herd
- ✅ **Type Safety** - Zod validation
- 📊 **Observability** - Metrics endpoint

---

##### **0.12 الجانب الأمني - Native WebSocket Security** 🔒

**المشكلة:**
- WebSocket لا يطبق CORS تلقائياً
- لا يوجد حماية من replay attacks
- لا يوجد IP whitelisting
- Rate limiting بسيط جداً

**الحل:**
- ✅ HMAC Authentication مع timestamp
- ✅ Origin validation
- ✅ IP whitelisting
- ✅ Token bucket rate limiting
- ✅ Message size limits

---

###### **0.12.1 HMAC Authentication + Timestamp + IP** 🔐

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js
const crypto = require('crypto');

class WebSocketBridge {
    constructor(server, sessionMonitor) {
        // ... existing code
        this.serverSecret = process.env.SERVER_SECRET || 'change-me-in-production';
        this.allowedIPs = process.env.ALLOWED_IPS ? 
            process.env.ALLOWED_IPS.split(',') : [];
    }

    /**
     * ✅ Generate HMAC signature
     */
    generateHMAC(data, secret) {
        return crypto.createHmac('sha256', secret)
            .update(data)
            .digest('hex');
    }

    /**
     * ✅ Validate handshake with HMAC + timestamp + IP
     */
    validateHandshake(reqUrl, ip) {
        try {
            const url = new URL(reqUrl, 'http://placeholder');
            const apiKey = url.searchParams.get('apiKey');
            const ts = url.searchParams.get('ts');
            const sig = url.searchParams.get('sig');

            // ✅ Check required parameters
            if (!apiKey || !ts || !sig) {
                logger.warn(`Missing auth parameters from ${ip}`);
                return false;
            }

            // ✅ Check timestamp (reject if older than 60 seconds)
            const timestamp = Number(ts);
            const now = Date.now();
            const age = Math.abs(now - timestamp);
            
            if (age > 60_000) {
                logger.warn(`Expired timestamp from ${ip}: ${age}ms old`);
                return false;
            }

            // ✅ Check IP whitelist (if configured)
            if (this.allowedIPs.length > 0 && !this.allowedIPs.includes(ip)) {
                logger.warn(`IP not whitelisted: ${ip}`);
                return false;
            }

            // ✅ Verify HMAC signature
            const data = apiKey + ts + ip;
            const expectedSig = this.generateHMAC(data, this.serverSecret);
            
            // Use timing-safe comparison
            const sigBuffer = Buffer.from(sig, 'hex');
            const expectedBuffer = Buffer.from(expectedSig, 'hex');
            
            if (sigBuffer.length !== expectedBuffer.length) {
                logger.warn(`Invalid signature length from ${ip}`);
                return false;
            }

            const isValid = crypto.timingSafeEqual(sigBuffer, expectedBuffer);
            
            if (!isValid) {
                logger.warn(`Invalid signature from ${ip}`);
                return false;
            }

            // ✅ Verify API key
            if (apiKey !== process.env.API_KEY) {
                logger.warn(`Invalid API key from ${ip}`);
                return false;
            }

            logger.info(`✅ Valid handshake from ${ip}`);
            return { apiKey, ip, timestamp };
        } catch (error) {
            logger.error('Error validating handshake:', error);
            return false;
        }
    }

    setupEventHandlers() {
        this.wss.on('connection', (ws, req) => {
            const ip = req.socket.remoteAddress;
            
            // ✅ Validate handshake
            const auth = this.validateHandshake(req.url, ip);
            if (!auth) {
                logger.warn(`Unauthorized connection attempt from ${ip}`);
                try {
                    ws.close(1008, 'Unauthorized');
                } catch (error) {
                    logger.error('Error closing unauthorized connection:', error);
                }
                return;
            }

            // ✅ Store authenticated user info
            ws.user = {
                apiKey: auth.apiKey,
                ip: auth.ip,
                authenticatedAt: auth.timestamp
            };
            ws.isAuthenticated = true;
            ws.isAlive = true;
            ws.ip = ip;
            ws.connectedAt = Date.now();

            logger.info(`✅ Authenticated connection from ${ip}`);

            // ... rest of connection handling
        });
    }
}
```

**Frontend - Generate Signature:**

```javascript
// /dashboard/src/hooks/useWebSocket.js
import CryptoJS from 'crypto-js';

function generateSignature(apiKey, timestamp, serverSecret) {
    const data = apiKey + timestamp;
    return CryptoJS.HmacSHA256(data, serverSecret).toString();
}

function getWebSocketUrl() {
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const serverSecret = process.env.NEXT_PUBLIC_SERVER_SECRET;
    
    // ✅ Generate timestamp
    const timestamp = Date.now();
    
    // ✅ Generate signature (client IP will be added by server)
    // Note: In production, get IP from server first or use server-side auth
    const signature = generateSignature(apiKey, timestamp, serverSecret);
    
    return `${baseUrl}/ws?apiKey=${apiKey}&ts=${timestamp}&sig=${signature}`;
}
```

**Dependencies:**

```json
// Frontend package.json
{
  "dependencies": {
    "crypto-js": "^4.2.0"
  }
}
```

---

###### **0.12.2 Origin Validation (CORS للـ WebSocket)** 🌐

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js

class WebSocketBridge {
    constructor(server, sessionMonitor) {
        // ... existing code
        this.allowedOrigins = process.env.ALLOWED_ORIGINS ? 
            process.env.ALLOWED_ORIGINS.split(',') : [
                'http://localhost:3000',
                'http://localhost:3001',
                'https://dashboard.yourdomain.com'
            ];
    }

    /**
     * ✅ Check if origin is allowed
     */
    isAllowedOrigin(origin) {
        if (!origin) {
            logger.warn('No origin header provided');
            return false;
        }

        // Allow all origins in development
        if (process.env.NODE_ENV === 'development') {
            return true;
        }

        return this.allowedOrigins.includes(origin);
    }

    initialize() {
        try {
            this.wss = new WebSocket.Server({ 
                server: this.server,
                path: '/ws',
                clientTracking: false,
                perMessageDeflate: {
                    threshold: 1024,
                    zlibDeflateOptions: { level: 6 },
                    zlibInflateOptions: { chunkSize: 10 * 1024 },
                    clientNoContextTakeover: true,
                    serverNoContextTakeover: true,
                    serverMaxWindowBits: 10,
                    concurrencyLimit: 10,
                },
                maxPayload: 1024 * 1024,
                
                // ✅ Verify client before upgrade
                verifyClient: (info, callback) => {
                    const origin = info.req.headers.origin;
                    const ip = info.req.socket.remoteAddress;

                    // ✅ Check origin
                    if (!this.isAllowedOrigin(origin)) {
                        logger.warn(`Origin not allowed: ${origin} from ${ip}`);
                        callback(false, 403, 'Origin not allowed');
                        return;
                    }

                    // ✅ Pre-validate handshake (optional early check)
                    const auth = this.validateHandshake(info.req.url, ip);
                    if (!auth) {
                        logger.warn(`Invalid handshake from ${ip}`);
                        callback(false, 401, 'Unauthorized');
                        return;
                    }

                    callback(true);
                }
            });

            this.setupEventHandlers();
            this.setupHealthCheck();
            
            logger.info('WebSocket bridge initialized with security features');
        } catch (error) {
            logger.error('Failed to initialize WebSocket bridge:', error);
            throw error;
        }
    }
}
```

---

###### **0.12.3 Token Bucket Rate Limiting** 🪣

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js

class WebSocketBridge {
    constructor(server, sessionMonitor) {
        // ... existing code
        this.rateLimitBuckets = new Map(); // ip => { tokens, lastRefill }
        this.rateLimitConfig = {
            capacity: 60,        // 60 tokens
            refillRate: 1,       // 1 token per interval
            refillInterval: 1000 // 1 second
        };
    }

    /**
     * ✅ Token bucket rate limiting
     */
    isRateLimitAllowed(ip, cost = 1) {
        const now = Date.now();
        const config = this.rateLimitConfig;
        
        // Get or create bucket
        let bucket = this.rateLimitBuckets.get(ip);
        if (!bucket) {
            bucket = {
                tokens: config.capacity,
                lastRefill: now
            };
            this.rateLimitBuckets.set(ip, bucket);
        }

        // ✅ Refill tokens based on elapsed time
        const elapsed = now - bucket.lastRefill;
        const refillCount = Math.floor(elapsed / config.refillInterval) * config.refillRate;
        
        if (refillCount > 0) {
            bucket.tokens = Math.min(config.capacity, bucket.tokens + refillCount);
            bucket.lastRefill = now;
        }

        // ✅ Check if enough tokens
        if (bucket.tokens < cost) {
            logger.warn(`Rate limit exceeded for ${ip}: ${bucket.tokens} tokens remaining`);
            return false;
        }

        // ✅ Consume tokens
        bucket.tokens -= cost;
        this.rateLimitBuckets.set(ip, bucket);
        
        return true;
    }

    /**
     * ✅ Clean up old buckets (call periodically)
     */
    cleanupRateLimitBuckets() {
        const now = Date.now();
        const maxAge = 5 * 60 * 1000; // 5 minutes

        for (const [ip, bucket] of this.rateLimitBuckets.entries()) {
            if (now - bucket.lastRefill > maxAge) {
                this.rateLimitBuckets.delete(ip);
            }
        }

        logger.debug(`Rate limit buckets cleaned: ${this.rateLimitBuckets.size} active`);
    }

    setupEventHandlers() {
        this.wss.on('connection', (ws, req) => {
            // ... existing auth code

            // Handle messages with rate limiting
            ws.on('message', (rawMessage) => {
                // ✅ Check rate limit
                if (!this.isRateLimitAllowed(ws.ip)) {
                    logger.warn(`Rate limit exceeded for ${ws.ip}, ignoring message`);
                    
                    // Send warning to client
                    this.send(ws, {
                        type: 'rate_limit_warning',
                        message: 'Too many messages, please slow down'
                    });
                    
                    // Optional: close connection after repeated violations
                    ws.rateLimitViolations = (ws.rateLimitViolations || 0) + 1;
                    if (ws.rateLimitViolations >= 5) {
                        logger.error(`Closing connection from ${ws.ip} due to repeated rate limit violations`);
                        try {
                            ws.close(1008, 'Rate limit exceeded');
                        } catch (error) {
                            logger.error('Error closing connection:', error);
                        }
                    }
                    
                    return;
                }

                // ✅ Reset violation counter on successful message
                ws.rateLimitViolations = 0;

                // Handle message
                this.handleClientMessage(ws, rawMessage);
            });

            // ... rest of connection handling
        });
    }

    setupHealthCheck() {
        this.healthInterval = setInterval(() => {
            // ... existing health check code

            // ✅ Cleanup rate limit buckets
            this.cleanupRateLimitBuckets();
        }, 30000);
    }
}
```

---

###### **0.12.4 Message Size & Type Limits** 📏

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js

class WebSocketBridge {
    constructor(server, sessionMonitor) {
        // ... existing code
        this.messageLimits = {
            maxSize: 10 * 1024,      // 10KB per message
            maxLength: 1000,          // 1000 characters for string fields
            allowedTypes: ['subscribe', 'unsubscribe', 'ping', 'get_state']
        };
    }

    /**
     * ✅ Validate message size and content
     */
    validateMessageSecurity(rawMessage, ws) {
        // ✅ Check message size
        const size = Buffer.byteLength(rawMessage);
        if (size > this.messageLimits.maxSize) {
            logger.warn(`Message too large from ${ws.ip}: ${size} bytes`);
            this.send(ws, {
                type: 'error',
                message: `Message too large: ${size} bytes (max: ${this.messageLimits.maxSize})`
            });
            return false;
        }

        // ✅ Parse JSON
        let message;
        try {
            message = JSON.parse(rawMessage);
        } catch (error) {
            logger.warn(`Invalid JSON from ${ws.ip}`);
            this.send(ws, {
                type: 'error',
                message: 'Invalid JSON format'
            });
            return false;
        }

        // ✅ Check message type
        if (!message.type || !this.messageLimits.allowedTypes.includes(message.type)) {
            logger.warn(`Invalid message type from ${ws.ip}: ${message.type}`);
            this.send(ws, {
                type: 'error',
                message: `Invalid message type: ${message.type}`
            });
            return false;
        }

        // ✅ Check string field lengths
        for (const [key, value] of Object.entries(message)) {
            if (typeof value === 'string' && value.length > this.messageLimits.maxLength) {
                logger.warn(`Field too long from ${ws.ip}: ${key} = ${value.length} chars`);
                this.send(ws, {
                    type: 'error',
                    message: `Field '${key}' too long: ${value.length} chars (max: ${this.messageLimits.maxLength})`
                });
                return false;
            }
        }

        return message;
    }

    handleClientMessage(ws, rawMessage) {
        // ✅ Validate security first
        const message = this.validateMessageSecurity(rawMessage, ws);
        if (!message) return;

        // ✅ Then validate with Zod
        const result = IncomingMessageSchema.safeParse(message);
        if (!result.success) {
            logger.warn(`Invalid message schema from ${ws.ip}:`, result.error.errors);
            this.send(ws, {
                type: 'error',
                message: 'Invalid message format',
                errors: result.error.errors
            });
            return;
        }

        // ✅ Handle validated message
        const validatedMessage = result.data;
        // ... existing message handling
    }
}
```

---

###### **0.12.5 Security Configuration** ⚙️

**Environment Variables:**

```bash
# .env

# Security Settings
SERVER_SECRET=your-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:3000,https://dashboard.yourdomain.com
ALLOWED_IPS=                                    # Empty = allow all, or comma-separated IPs

# Rate Limiting
RATE_LIMIT_CAPACITY=60                          # 60 tokens
RATE_LIMIT_REFILL_RATE=1                        # 1 token per interval
RATE_LIMIT_REFILL_INTERVAL=1000                 # 1 second
RATE_LIMIT_MAX_VIOLATIONS=5                     # Close after 5 violations

# Message Limits
MESSAGE_MAX_SIZE=10240                          # 10KB
MESSAGE_MAX_STRING_LENGTH=1000                  # 1000 chars
MESSAGE_ALLOWED_TYPES=subscribe,unsubscribe,ping,get_state

# Handshake
HANDSHAKE_MAX_AGE=60000                         # 60 seconds
```

---

###### **0.12.6 Security Monitoring** 📊

**Add to Metrics:**

```javascript
// /runtime/server/index.js

const securityMetrics = {
    unauthorizedAttempts: 0,
    rateLimitViolations: 0,
    invalidOrigins: 0,
    expiredHandshakes: 0,
    invalidSignatures: 0,
    oversizedMessages: 0
};

// Track security events
websocketBridge.on('unauthorized', () => {
    securityMetrics.unauthorizedAttempts++;
});

websocketBridge.on('rate_limit_violation', () => {
    securityMetrics.rateLimitViolations++;
});

websocketBridge.on('invalid_origin', () => {
    securityMetrics.invalidOrigins++;
});

// Add to metrics endpoint
app.get('/api/metrics', authenticateApiKey, (req, res) => {
    res.json({
        // ... existing metrics
        security: securityMetrics,
        // ...
    });
});
```

**Emit Security Events:**

```javascript
// /runtime/server/services/websocketBridge.js

class WebSocketBridge extends EventEmitter {
    validateHandshake(reqUrl, ip) {
        // ... validation code
        
        if (!apiKey || !ts || !sig) {
            this.emit('unauthorized', { reason: 'missing_params', ip });
            return false;
        }

        if (age > 60_000) {
            this.emit('unauthorized', { reason: 'expired_timestamp', ip, age });
            return false;
        }

        if (!isValid) {
            this.emit('unauthorized', { reason: 'invalid_signature', ip });
            return false;
        }

        return { apiKey, ip, timestamp };
    }

    isRateLimitAllowed(ip, cost = 1) {
        // ... rate limit code
        
        if (bucket.tokens < cost) {
            this.emit('rate_limit_violation', { ip, tokens: bucket.tokens });
            return false;
        }

        return true;
    }
}
```

---

###### **0.12.7 Security Summary** 📝

**الحماية المُطبّقة:**

1. **✅ HMAC Authentication**
   - Signature verification
   - Timestamp validation (60s window)
   - IP binding
   - Timing-safe comparison

2. **✅ Origin Validation**
   - Whitelist-based
   - Pre-upgrade verification
   - Development mode bypass

3. **✅ IP Whitelisting**
   - Optional configuration
   - Logged violations

4. **✅ Token Bucket Rate Limiting**
   - 60 messages per minute per IP
   - Auto-refill
   - Violation tracking
   - Auto-disconnect after 5 violations

5. **✅ Message Validation**
   - Size limits (10KB)
   - Type whitelist
   - String length limits
   - Zod schema validation

6. **✅ Security Monitoring**
   - Event tracking
   - Metrics endpoint
   - Detailed logging

**الفوائد:**

- 🔒 **Strong Authentication** - HMAC + timestamp + IP
- 🌐 **Origin Protection** - CORS-like for WebSocket
- 🛡️ **DDoS Protection** - Rate limiting per IP
- ✅ **Input Validation** - Multiple layers
- 📊 **Security Observability** - Metrics & logs

---

##### **0.13 Auto-Reconnect الرسمي (RFC 6455 Compliant)** 🔄

**🎯 الهدف:**
- تطبيق قواعد البروتوكول الرسمي RFC 6455 تماماً
- Auto-reconnect ذكي (backoff + jitter)
- Heartbeat صارم يكتشف الاتصالات الميتة
- واجهة برمجية نظيفة وسهلة الصيانة

---

###### **0.13.1 Server-Side Implementation (RFC 6455)** 🖥️

**التهيئة الصحيحة وفق دليل `ws` الرسمي:**

```javascript
// /runtime/server/services/websocketBridge.js
import { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';

export class WebSocketBridge extends EventEmitter {
    constructor(server, sessionMonitor) {
        super();
        this.server = server;
        this.sessionMonitor = sessionMonitor;
        this.clients = new Set();
        this.heartbeatInterval = null;
    }

    /**
     * ✅ Initialize WebSocket Server (RFC 6455 Compliant)
     */
    initialize() {
        this.wss = new WebSocketServer({
            server: this.server,
            path: '/ws',
            
            // ✅ Compression (RFC 7692)
            perMessageDeflate: {
                threshold: 1024,              // Compress messages > 1KB
                zlibDeflateOptions: {
                    level: 6,                 // Balanced compression
                },
                zlibInflateOptions: {
                    chunkSize: 10 * 1024
                },
                clientNoContextTakeover: true,
                serverNoContextTakeover: true,
                serverMaxWindowBits: 10,
                concurrencyLimit: 10,
            },
            
            // ✅ Security limits
            maxPayload: 1024 * 1024,          // 1 MB max message size
            clientTracking: true,             // Track clients automatically
            
            // ✅ Verify client before upgrade
            verifyClient: (info, callback) => {
                const origin = info.req.headers.origin;
                const ip = info.req.socket.remoteAddress;

                // Check origin
                if (!this.isAllowedOrigin(origin)) {
                    logger.warn(`Origin not allowed: ${origin} from ${ip}`);
                    callback(false, 403, 'Origin not allowed');
                    return;
                }

                // Validate handshake
                const auth = this.validateHandshake(info.req.url, ip);
                if (!auth) {
                    logger.warn(`Invalid handshake from ${ip}`);
                    callback(false, 401, 'Unauthorized');
                    return;
                }

                callback(true);
            }
        });

        this.setupEvents();
        this.startHeartbeat();
        
        logger.info('✅ WebSocket Server initialized (RFC 6455 compliant)');
    }

    /**
     * ✅ Setup connection events
     */
    setupEvents() {
        this.wss.on('connection', (ws, req) => {
            // ✅ Initialize connection state
            ws.isAlive = true;
            ws.ip = req.socket.remoteAddress;
            ws.connectedAt = Date.now();
            ws.subscriptions = [];

            logger.info(`✅ Client connected: ${ws.ip}`);

            // ✅ Pong handler - mark as alive
            ws.on('pong', () => {
                ws.isAlive = true;
                logger.debug(`💓 Pong received from ${ws.ip}`);
            });

            // ✅ Add to clients set
            this.clients.add(ws);
            this.emit('connection');

            // ✅ Send welcome message
            this.safeSend(ws, {
                type: 'welcome',
                message: 'Connected successfully',
                timestamp: Date.now(),
                server: 'WaQtor WebSocket Server v1.0'
            });

            // ✅ Handle incoming messages
            ws.on('message', (data) => {
                this.handleMessage(ws, data);
            });

            // ✅ Handle close
            ws.on('close', (code, reason) => {
                this.clients.delete(ws);
                const duration = Date.now() - ws.connectedAt;
                logger.info(`❌ Client disconnected: ${ws.ip} (code: ${code}, duration: ${Math.round(duration/1000)}s)`);
                this.emit('disconnect');
            });

            // ✅ Handle errors
            ws.on('error', (error) => {
                logger.error(`⚠️ WebSocket error from ${ws.ip}:`, error);
                this.emit('error', error);
            });
        });

        this.wss.on('error', (error) => {
            logger.error('❌ WebSocket Server error:', error);
        });
    }

    /**
     * ✅ Handle incoming messages
     */
    handleMessage(ws, raw) {
        try {
            const msg = JSON.parse(raw);
            this.emit('message');

            switch (msg.type) {
                case 'ping':
                    // Client-initiated ping
                    this.safeSend(ws, {
                        type: 'pong',
                        timestamp: Date.now()
                    });
                    break;

                case 'subscribe':
                    // Subscribe to events
                    ws.subscriptions = msg.events || ['all'];
                    this.safeSend(ws, {
                        type: 'subscribed',
                        events: ws.subscriptions
                    });
                    logger.info(`📡 Client ${ws.ip} subscribed to: ${ws.subscriptions.join(', ')}`);
                    break;

                case 'unsubscribe':
                    // Unsubscribe from events
                    ws.subscriptions = [];
                    this.safeSend(ws, {
                        type: 'unsubscribed'
                    });
                    logger.info(`📡 Client ${ws.ip} unsubscribed from all events`);
                    break;

                case 'get_state':
                    // Send current session state
                    this.sendSessionState(ws);
                    break;

                default:
                    logger.warn(`⚠️ Unknown message type from ${ws.ip}: ${msg.type}`);
                    this.safeSend(ws, {
                        type: 'error',
                        message: `Unknown message type: ${msg.type}`
                    });
                    break;
            }
        } catch (error) {
            logger.error(`❌ Error handling message from ${ws.ip}:`, error);
            this.safeSend(ws, {
                type: 'error',
                message: 'Invalid message format'
            });
        }
    }

    /**
     * ✅ Safe send with backpressure check
     */
    safeSend(ws, data) {
        if (ws.readyState !== ws.OPEN) {
            return false;
        }

        // ✅ Check backpressure (512KB limit)
        if (ws.bufferedAmount > 512 * 1024) {
            logger.warn(`⚠️ Backpressure detected for ${ws.ip}: ${ws.bufferedAmount} bytes buffered`);
            return false;
        }

        try {
            ws.send(JSON.stringify(data));
            return true;
        } catch (error) {
            logger.error(`❌ Error sending to ${ws.ip}:`, error);
            return false;
        }
    }

    /**
     * ✅ Start heartbeat (ping/pong every 30s)
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            let alive = 0;
            let dead = 0;

            for (const ws of this.clients) {
                // ✅ Terminate dead connections
                if (!ws.isAlive) {
                    logger.warn(`💀 Terminating dead connection: ${ws.ip}`);
                    try {
                        ws.terminate();
                    } catch (error) {
                        logger.error('Error terminating connection:', error);
                    }
                    this.clients.delete(ws);
                    dead++;
                    continue;
                }

                // ✅ Send ping
                ws.isAlive = false;
                try {
                    ws.ping();
                    alive++;
                } catch (error) {
                    logger.error(`Error sending ping to ${ws.ip}:`, error);
                    this.clients.delete(ws);
                    dead++;
                }
            }

            if (alive > 0 || dead > 0) {
                logger.debug(`💓 Heartbeat: ${alive} alive, ${dead} dead (cleaned)`);
            }
        }, 30000); // Every 30 seconds

        logger.info('✅ Heartbeat started (30s interval)');
    }

    /**
     * ✅ Broadcast to all connected clients
     */
    broadcast(type, payload) {
        const data = JSON.stringify({ type, payload, timestamp: Date.now() });
        let sent = 0;
        let skipped = 0;

        for (const ws of this.clients) {
            // Check if client is subscribed to this event
            if (ws.subscriptions.length > 0 && 
                !ws.subscriptions.includes('all') && 
                !ws.subscriptions.includes(type)) {
                continue;
            }

            if (ws.readyState === ws.OPEN) {
                // Check backpressure
                if (ws.bufferedAmount < 512 * 1024) {
                    try {
                        ws.send(data);
                        sent++;
                    } catch (error) {
                        logger.error('Error broadcasting:', error);
                        skipped++;
                    }
                } else {
                    skipped++;
                }
            }
        }

        if (sent > 0) {
            logger.debug(`📡 Broadcast '${type}': ${sent} sent, ${skipped} skipped`);
        }

        this.emit('broadcast', type);
        return { sent, skipped };
    }

    /**
     * ✅ Get client count
     */
    getClientCount() {
        return this.clients.size;
    }

    /**
     * ✅ Get detailed stats
     */
    getStats() {
        let authenticated = 0;
        let alive = 0;
        let totalBuffered = 0;

        for (const ws of this.clients) {
            if (ws.isAuthenticated) authenticated++;
            if (ws.isAlive) alive++;
            totalBuffered += ws.bufferedAmount;
        }

        return {
            total: this.clients.size,
            authenticated,
            alive,
            dead: this.clients.size - alive,
            avgBuffered: this.clients.size > 0 ? Math.round(totalBuffered / this.clients.size) : 0
        };
    }

    /**
     * ✅ Shutdown gracefully
     */
    shutdown() {
        logger.info('🛑 Shutting down WebSocket Server...');

        // Clear heartbeat
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        // Close all connections
        for (const ws of this.clients) {
            try {
                ws.close(1000, 'Server shutting down');
            } catch (error) {
                logger.error('Error closing connection:', error);
            }
        }

        this.clients.clear();

        // Close server
        if (this.wss) {
            this.wss.close(() => {
                logger.info('✅ WebSocket Server closed');
            });
        }
    }
}
```

---

###### **0.13.2 Client-Side Auto-Reconnect (RFC 6455)** 🔄

**Implementation:**

```javascript
// /dashboard/src/hooks/useWebSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ✅ RFC 6455 Compliant WebSocket Hook with Auto-Reconnect
 */
export function useWebSocket() {
    const wsRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const attemptsRef = useRef(0);
    const reconnectTimeoutRef = useRef(null);

    /**
     * ✅ Calculate reconnect delay (Exponential Backoff + Jitter)
     */
    const getReconnectDelay = useCallback(() => {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (max)
        const base = Math.min(1000 * Math.pow(2, attemptsRef.current), 30000);
        
        // Add random jitter (0-1000ms) to avoid thundering herd
        const jitter = Math.floor(Math.random() * 1000);
        
        return base + jitter;
    }, []);

    /**
     * ✅ Connect to WebSocket
     */
    const connect = useCallback(() => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
            const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
            const url = `${baseUrl}/ws?apiKey=${apiKey}`;

            console.log(`🔌 Connecting to WebSocket... (attempt ${attemptsRef.current + 1})`);

            const ws = new WebSocket(url);
            wsRef.current = ws;

            // ✅ Connection opened
            ws.onopen = () => {
                console.log('✅ WebSocket connected');
                setConnected(true);
                setReconnecting(false);
                attemptsRef.current = 0; // Reset attempts on successful connection

                // Subscribe to all events
                ws.send(JSON.stringify({
                    type: 'subscribe',
                    events: ['all']
                }));
            };

            // ✅ Message received
            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    
                    // Dispatch custom event for each message type
                    window.dispatchEvent(
                        new CustomEvent(`ws:${msg.type}`, { 
                            detail: msg 
                        })
                    );

                    // Log important messages
                    if (msg.type !== 'pong') {
                        console.log(`📨 WebSocket message:`, msg.type, msg);
                    }
                } catch (error) {
                    console.error('❌ Error parsing WebSocket message:', error);
                }
            };

            // ✅ Connection closed
            ws.onclose = (event) => {
                console.warn(`⚠️ WebSocket closed: code=${event.code}, reason=${event.reason}`);
                setConnected(false);
                
                // Auto-reconnect (unless closed intentionally with code 1000)
                if (event.code !== 1000) {
                    reconnect();
                }
            };

            // ✅ Connection error
            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                setConnected(false);
                ws.close();
            };
        } catch (error) {
            console.error('❌ Failed to create WebSocket:', error);
            reconnect();
        }
    }, []);

    /**
     * ✅ Reconnect with exponential backoff
     */
    const reconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        attemptsRef.current++;
        const delay = getReconnectDelay();
        
        console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${attemptsRef.current})`);
        setReconnecting(true);

        reconnectTimeoutRef.current = setTimeout(() => {
            connect();
        }, delay);
    }, [connect, getReconnectDelay]);

    /**
     * ✅ Send message
     */
    const send = useCallback((type, data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type, ...data }));
            return true;
        }
        console.warn('⚠️ Cannot send: WebSocket not connected');
        return false;
    }, []);

    /**
     * ✅ Subscribe to message type
     */
    const subscribe = useCallback((type, handler) => {
        const eventHandler = (event) => handler(event.detail);
        window.addEventListener(`ws:${type}`, eventHandler);
        
        return () => {
            window.removeEventListener(`ws:${type}`, eventHandler);
        };
    }, []);

    /**
     * ✅ Initialize connection
     */
    useEffect(() => {
        connect();

        return () => {
            // Cleanup
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close(1000, 'Component unmounted');
            }
        };
    }, [connect]);

    return {
        connected,
        reconnecting,
        attempts: attemptsRef.current,
        send,
        subscribe,
        ws: wsRef.current
    };
}
```

**Usage Example:**

```javascript
// /dashboard/src/components/Dashboard.jsx
import { useWebSocket } from '@/hooks/useWebSocket';
import { useEffect } from 'react';

export function Dashboard() {
    const { connected, reconnecting, attempts, subscribe } = useWebSocket();

    useEffect(() => {
        // Subscribe to session updates
        const unsubscribe = subscribe('session_update', (data) => {
            console.log('Session update:', data);
            // Update UI
        });

        return unsubscribe;
    }, [subscribe]);

    return (
        <div>
            <div className="connection-status">
                {connected && <span className="badge badge-success">🟢 Connected</span>}
                {reconnecting && <span className="badge badge-warning">🟡 Reconnecting... (attempt {attempts})</span>}
                {!connected && !reconnecting && <span className="badge badge-danger">🔴 Disconnected</span>}
            </div>
            {/* Rest of dashboard */}
        </div>
    );
}
```

---

###### **0.13.3 Testing Auto-Reconnect** 🧪

**Test Procedure:**

1. **Start Server:**
   ```bash
   npm run dev
   ```

2. **Open Dashboard:**
   - Navigate to `http://localhost:3000`
   - Check console: `✅ WebSocket connected`

3. **Stop Server:**
   ```bash
   Ctrl + C
   ```

4. **Observe Reconnection:**
   - Console shows: `🔄 Reconnecting in 1000ms... (attempt 1)`
   - Then: `🔄 Reconnecting in 2000ms... (attempt 2)`
   - Then: `🔄 Reconnecting in 4000ms... (attempt 3)`
   - Max delay: 30 seconds

5. **Restart Server:**
   ```bash
   npm run dev
   ```

6. **Verify Auto-Reconnect:**
   - Console shows: `✅ WebSocket connected`
   - Attempts reset to 0

**Expected Behavior:**

| Time | Client | Server |
|------|--------|--------|
| 0s | Connected ✅ | Client connected ✅ |
| 10s | Server stopped 🛑 | - |
| 11s | Reconnecting (1s delay) | - |
| 13s | Reconnecting (2s delay) | - |
| 17s | Reconnecting (4s delay) | - |
| 25s | Reconnecting (8s delay) | - |
| 30s | Server restarted ✅ | - |
| 31s | Connected ✅ | Client connected ✅ |

---

###### **0.13.4 RFC 6455 Compliance Summary** ✅

**Protocol Compliance:**

1. **✅ WebSocket Handshake (RFC 6455 §4)**
   - HTTP/1.1 Upgrade
   - Sec-WebSocket-Key validation
   - Sec-WebSocket-Accept response

2. **✅ Frame Format (RFC 6455 §5)**
   - Binary and text frames
   - Fragmentation support
   - Control frames (ping/pong/close)

3. **✅ Compression (RFC 7692)**
   - Per-message deflate
   - Context takeover control
   - Compression threshold

4. **✅ Connection Management**
   - Heartbeat (ping/pong)
   - Dead connection detection
   - Graceful shutdown
   - Auto-reconnect with backoff

5. **✅ Error Handling**
   - Close codes (1000, 1008, etc.)
   - Error events
   - Timeout handling

**Benefits:**

- 🚀 **Maximum Performance** - No overhead, pure WebSocket
- 🔄 **Reliable Reconnection** - Exponential backoff + jitter
- 💓 **Health Monitoring** - Ping/pong every 30s
- 🛡️ **Production Ready** - RFC 6455 compliant
- 📊 **Observable** - Detailed logging and metrics

---

##### **0.14 WebSocket Monitoring Dashboard** 📊

**🎯 الهدف:**
- لوحة مراقبة احترافية مصغّرة للـ WebSocket
- مراقبة في الوقت الحقيقي بدون مكتبات ثقيلة
- دمج مع Dashboard الموجودة
- عرض Metrics مباشرة من المتصفح

**المميزات:**
- ✅ عدد الاتصالات الحالية
- ✅ زمن آخر Ping لكل عميل
- ✅ استهلاك الذاكرة والـ uptime
- ✅ عدد الرسائل المرسلة والمستلمة
- ✅ آخر الأخطاء إن وجدت
- ✅ تحديث تلقائي كل ثانيتين

---

###### **0.14.1 Backend - Data Collection** 📈

**Implementation:**

```javascript
// /runtime/server/services/websocketBridge.js
import os from 'os';
import process from 'process';
import { EventEmitter } from 'events';

export class WebSocketBridge extends EventEmitter {
    constructor(server, sessionMonitor) {
        super();
        this.server = server;
        this.sessionMonitor = sessionMonitor;
        this.clients = new Set();
        this.heartbeatInterval = null;
        
        // ✅ Statistics tracking
        this.stats = {
            connections: 0,
            disconnections: 0,
            messages: 0,
            broadcasts: 0,
            errors: 0,
            lastError: null,
            lastBroadcast: null,
            startTime: Date.now()
        };
    }

    setupEvents() {
        this.wss.on('connection', (ws, req) => {
            // ✅ Initialize connection state
            ws.isAlive = true;
            ws.ip = req.socket.remoteAddress;
            ws.connectedAt = Date.now();
            ws.lastPing = Date.now();
            ws.subscriptions = [];

            // ✅ Increment connection counter
            this.stats.connections++;

            logger.info(`✅ Client connected: ${ws.ip} (total: ${this.clients.size + 1})`);

            // ✅ Pong handler - mark as alive and update last ping
            ws.on('pong', () => {
                ws.isAlive = true;
                ws.lastPing = Date.now();
                logger.debug(`💓 Pong received from ${ws.ip}`);
            });

            // ✅ Add to clients set
            this.clients.add(ws);
            this.emit('connection');

            // ✅ Send welcome message
            this.safeSend(ws, {
                type: 'welcome',
                message: 'Connected successfully',
                timestamp: Date.now(),
                server: 'WaQtor WebSocket Server v1.0'
            });

            // ✅ Handle incoming messages
            ws.on('message', (data) => {
                this.stats.messages++;
                this.handleMessage(ws, data);
            });

            // ✅ Handle close
            ws.on('close', (code, reason) => {
                this.clients.delete(ws);
                this.stats.disconnections++;
                const duration = Date.now() - ws.connectedAt;
                logger.info(`❌ Client disconnected: ${ws.ip} (code: ${code}, duration: ${Math.round(duration/1000)}s, total: ${this.clients.size})`);
                this.emit('disconnect');
            });

            // ✅ Handle errors
            ws.on('error', (error) => {
                this.logError(error, ws.ip);
                this.emit('error', error);
            });
        });

        this.wss.on('error', (error) => {
            this.logError(error, 'server');
        });
    }

    broadcast(type, payload) {
        // ✅ Track broadcast
        this.stats.broadcasts++;
        this.stats.lastBroadcast = new Date().toISOString();

        const data = JSON.stringify({ type, payload, timestamp: Date.now() });
        let sent = 0;
        let skipped = 0;

        for (const ws of this.clients) {
            // Check if client is subscribed to this event
            if (ws.subscriptions.length > 0 && 
                !ws.subscriptions.includes('all') && 
                !ws.subscriptions.includes(type)) {
                continue;
            }

            if (ws.readyState === ws.OPEN) {
                // Check backpressure
                if (ws.bufferedAmount < 512 * 1024) {
                    try {
                        ws.send(data);
                        sent++;
                    } catch (error) {
                        this.logError(error, 'broadcast');
                        skipped++;
                    }
                } else {
                    skipped++;
                }
            }
        }

        if (sent > 0) {
            logger.debug(`📡 Broadcast '${type}': ${sent} sent, ${skipped} skipped`);
        }

        this.emit('broadcast', type);
        return { sent, skipped };
    }

    /**
     * ✅ Log error with tracking
     */
    logError(err, source = 'unknown') {
        this.stats.errors++;
        this.stats.lastError = {
            time: new Date().toISOString(),
            message: err.message || String(err),
            source,
            stack: err.stack ? err.stack.split('\n').slice(0, 3).join('\n') : null
        };
        logger.error(`[WS ERROR from ${source}]:`, err);
    }

    /**
     * ✅ Get comprehensive metrics
     */
    getMetrics() {
        const now = Date.now();
        const clients = [];
        let totalBuffered = 0;
        let aliveCount = 0;

        // ✅ Collect per-client metrics
        for (const ws of this.clients) {
            const lastPingAge = ws.lastPing ? now - ws.lastPing : null;
            const connectedDuration = now - ws.connectedAt;
            
            clients.push({
                ip: ws.ip,
                connected: Math.round(connectedDuration / 1000), // seconds
                lastPing: lastPingAge ? Math.round(lastPingAge / 1000) : null, // seconds
                isAlive: ws.isAlive,
                buffered: Math.round(ws.bufferedAmount / 1024), // KB
                subscriptions: ws.subscriptions
            });

            totalBuffered += ws.bufferedAmount;
            if (ws.isAlive) aliveCount++;
        }

        // ✅ System metrics
        const memUsage = process.memoryUsage();
        const uptime = process.uptime();

        return {
            // Server info
            server: {
                uptime: Math.round(uptime),
                uptimeFormatted: this.formatUptime(uptime * 1000),
                startTime: new Date(now - uptime * 1000).toISOString(),
                timestamp: new Date().toISOString()
            },

            // Connection stats
            connections: {
                current: this.clients.size,
                total: this.stats.connections,
                disconnections: this.stats.disconnections,
                alive: aliveCount,
                dead: this.clients.size - aliveCount
            },

            // Message stats
            messages: {
                received: this.stats.messages,
                broadcasts: this.stats.broadcasts,
                lastBroadcast: this.stats.lastBroadcast
            },

            // Error stats
            errors: {
                total: this.stats.errors,
                last: this.stats.lastError
            },

            // System resources
            system: {
                memory: {
                    rss: Math.round(memUsage.rss / 1024 / 1024), // MB
                    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
                    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
                    external: Math.round(memUsage.external / 1024 / 1024) // MB
                },
                cpu: {
                    loadAvg: os.loadavg().map(l => l.toFixed(2)),
                    cores: os.cpus().length
                }
            },

            // Buffer stats
            buffer: {
                total: Math.round(totalBuffered / 1024), // KB
                average: this.clients.size > 0 ? Math.round(totalBuffered / this.clients.size / 1024) : 0 // KB
            },

            // Client details
            clients: clients.sort((a, b) => b.connected - a.connected) // Sort by connection time
        };
    }

    /**
     * ✅ Format uptime
     */
    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
}
```

---

###### **0.14.2 Backend - Monitoring Endpoint** 🔌

**Implementation:**

```javascript
// /runtime/server/index.js

// ✅ WebSocket Monitoring Endpoint
app.get('/api/ws-monitor', (req, res) => {
    try {
        const metrics = websocketBridge.getMetrics();
        res.json(metrics);
    } catch (error) {
        logger.error('Error fetching WebSocket metrics:', error);
        res.status(500).json({ 
            error: 'Failed to fetch metrics',
            message: error.message 
        });
    }
});

// ✅ Serve static files for monitoring dashboard
app.use(express.static('runtime/server/public'));
```

---

###### **0.14.3 Frontend - Monitoring Dashboard** 🎨

**Create File: `/runtime/server/public/ws-monitor.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Monitor - WaQtor</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #e2e8f0;
            padding: 2rem;
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        h1 {
            color: #38bdf8;
            font-size: 2rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .subtitle {
            color: #94a3b8;
            margin-bottom: 2rem;
            font-size: 0.9rem;
        }

        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: bold;
            margin-left: 1rem;
        }

        .status-online {
            background: #10b981;
            color: white;
        }

        .status-offline {
            background: #ef4444;
            color: white;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .card {
            background: rgba(30, 41, 59, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(56, 189, 248, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(56, 189, 248, 0.2);
        }

        .card-title {
            color: #38bdf8;
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .card-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #f8fafc;
            line-height: 1;
        }

        .card-label {
            color: #94a3b8;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }

        .metric-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .metric-row:last-child {
            border-bottom: none;
        }

        .metric-key {
            color: #94a3b8;
            font-size: 0.875rem;
        }

        .metric-value {
            color: #f8fafc;
            font-weight: 600;
            font-size: 0.875rem;
        }

        .clients-table {
            width: 100%;
            margin-top: 1rem;
        }

        .clients-table th {
            text-align: left;
            padding: 0.75rem;
            background: rgba(56, 189, 248, 0.1);
            color: #38bdf8;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .clients-table td {
            padding: 0.75rem;
            border-bottom: 1px solid rgba(148, 163, 184, 0.1);
            font-size: 0.875rem;
        }

        .clients-table tr:hover {
            background: rgba(56, 189, 248, 0.05);
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .badge-success {
            background: #10b981;
            color: white;
        }

        .badge-danger {
            background: #ef4444;
            color: white;
        }

        .badge-warning {
            background: #f59e0b;
            color: white;
        }

        .error-card {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .error-message {
            color: #fca5a5;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            font-family: 'Courier New', monospace;
        }

        .loading {
            text-align: center;
            padding: 3rem;
            color: #94a3b8;
        }

        .refresh-indicator {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: rgba(56, 189, 248, 0.2);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.75rem;
            color: #38bdf8;
            backdrop-filter: blur(10px);
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .pulse {
            animation: pulse 2s ease-in-out infinite;
        }
    </style>
</head>
<body>
    <div class="refresh-indicator pulse">🔄 Auto-refresh: 2s</div>
    
    <div class="container">
        <h1>
            📊 WebSocket Monitor
            <span class="status-badge status-online" id="status">Online</span>
        </h1>
        <p class="subtitle">Real-time monitoring dashboard for WaQtor WebSocket Server</p>

        <div id="metrics" class="loading">
            <p>Loading metrics...</p>
        </div>
    </div>

    <script>
        let lastUpdate = null;

        async function fetchMetrics() {
            try {
                const res = await fetch('/api/ws-monitor');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                
                const data = await res.json();
                lastUpdate = new Date();
                render(data);
                updateStatus(true);
            } catch (error) {
                console.error('Error fetching metrics:', error);
                updateStatus(false);
                document.getElementById('metrics').innerHTML = `
                    <div class="card error-card">
                        <div class="card-title">❌ Error</div>
                        <div class="error-message">Failed to fetch metrics: ${error.message}</div>
                    </div>
                `;
            }
        }

        function updateStatus(online) {
            const badge = document.getElementById('status');
            if (online) {
                badge.textContent = 'Online';
                badge.className = 'status-badge status-online';
            } else {
                badge.textContent = 'Offline';
                badge.className = 'status-badge status-offline';
            }
        }

        function render(data) {
            const html = `
                <!-- Overview Cards -->
                <div class="grid">
                    <div class="card">
                        <div class="card-title">👥 Active Connections</div>
                        <div class="card-value">${data.connections.current}</div>
                        <div class="card-label">
                            ${data.connections.alive} alive, ${data.connections.dead} dead
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-title">📨 Messages</div>
                        <div class="card-value">${data.messages.received.toLocaleString()}</div>
                        <div class="card-label">
                            ${data.messages.broadcasts.toLocaleString()} broadcasts
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-title">⏱️ Uptime</div>
                        <div class="card-value" style="font-size: 1.5rem">${data.server.uptimeFormatted}</div>
                        <div class="card-label">
                            Started: ${new Date(data.server.startTime).toLocaleString()}
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-title">💾 Memory</div>
                        <div class="card-value">${data.system.memory.rss} MB</div>
                        <div class="card-label">
                            Heap: ${data.system.memory.heapUsed}/${data.system.memory.heapTotal} MB
                        </div>
                    </div>
                </div>

                <!-- Detailed Stats -->
                <div class="grid">
                    <div class="card">
                        <div class="card-title">📊 Connection Stats</div>
                        <div class="metric-row">
                            <span class="metric-key">Total Connections</span>
                            <span class="metric-value">${data.connections.total}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-key">Total Disconnections</span>
                            <span class="metric-value">${data.connections.disconnections}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-key">Current Active</span>
                            <span class="metric-value">${data.connections.current}</span>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-title">🖥️ System Resources</div>
                        <div class="metric-row">
                            <span class="metric-key">CPU Load (1m)</span>
                            <span class="metric-value">${data.system.cpu.loadAvg[0]}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-key">CPU Cores</span>
                            <span class="metric-value">${data.system.cpu.cores}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-key">Buffer Total</span>
                            <span class="metric-value">${data.buffer.total} KB</span>
                        </div>
                    </div>

                    ${data.errors.last ? `
                    <div class="card error-card">
                        <div class="card-title">⚠️ Last Error</div>
                        <div class="metric-row">
                            <span class="metric-key">Time</span>
                            <span class="metric-value">${new Date(data.errors.last.time).toLocaleString()}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-key">Source</span>
                            <span class="metric-value">${data.errors.last.source}</span>
                        </div>
                        <div class="error-message">${data.errors.last.message}</div>
                    </div>
                    ` : ''}
                </div>

                <!-- Connected Clients -->
                ${data.clients.length > 0 ? `
                <div class="card">
                    <div class="card-title">👤 Connected Clients (${data.clients.length})</div>
                    <table class="clients-table">
                        <thead>
                            <tr>
                                <th>IP Address</th>
                                <th>Connected</th>
                                <th>Last Ping</th>
                                <th>Status</th>
                                <th>Buffer</th>
                                <th>Subscriptions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.clients.map(client => `
                                <tr>
                                    <td>${client.ip}</td>
                                    <td>${client.connected}s</td>
                                    <td>${client.lastPing ? client.lastPing + 's ago' : 'N/A'}</td>
                                    <td>
                                        <span class="badge ${client.isAlive ? 'badge-success' : 'badge-danger'}">
                                            ${client.isAlive ? '✓ Alive' : '✗ Dead'}
                                        </span>
                                    </td>
                                    <td>${client.buffered} KB</td>
                                    <td>${client.subscriptions.join(', ') || 'none'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}
            `;

            document.getElementById('metrics').innerHTML = html;
        }

        // Auto-refresh every 2 seconds
        setInterval(fetchMetrics, 2000);
        fetchMetrics();
    </script>
</body>
</html>
```

---

###### **0.14.4 Access & Usage** 🚀

**Access URLs:**

1. **JSON API:**
   ```
   http://localhost:8080/api/ws-monitor
   ```

2. **Dashboard:**
   ```
   http://localhost:8080/ws-monitor.html
   ```

**Response Example:**

```json
{
  "server": {
    "uptime": 3600,
    "uptimeFormatted": "1h 0m 0s",
    "startTime": "2025-10-31T04:35:00.000Z",
    "timestamp": "2025-10-31T05:35:00.000Z"
  },
  "connections": {
    "current": 5,
    "total": 150,
    "disconnections": 145,
    "alive": 5,
    "dead": 0
  },
  "messages": {
    "received": 5234,
    "broadcasts": 1523,
    "lastBroadcast": "2025-10-31T05:34:58.123Z"
  },
  "errors": {
    "total": 2,
    "last": {
      "time": "2025-10-31T05:30:00.000Z",
      "message": "Connection timeout",
      "source": "192.168.1.100"
    }
  },
  "system": {
    "memory": {
      "rss": 128,
      "heapUsed": 64,
      "heapTotal": 96,
      "external": 8
    },
    "cpu": {
      "loadAvg": ["0.52", "0.48", "0.45"],
      "cores": 8
    }
  },
  "buffer": {
    "total": 10,
    "average": 2
  },
  "clients": [
    {
      "ip": "192.168.1.100",
      "connected": 120,
      "lastPing": 5,
      "isAlive": true,
      "buffered": 2,
      "subscriptions": ["all"]
    }
  ]
}
```

---

###### **0.14.5 Future Enhancements** 🔮

**Optional Extensions:**

1. **Graphs & Charts:**
   ```javascript
   // Add Chart.js or Recharts
   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
   
   // Create real-time line chart for connections
   const ctx = document.getElementById('connectionsChart');
   const chart = new Chart(ctx, {
       type: 'line',
       data: { /* ... */ }
   });
   ```

2. **Alerts & Notifications:**
   ```javascript
   // Alert on high error rate
   if (data.errors.total > threshold) {
       showNotification('High error rate detected!');
   }
   ```

3. **Log Snapshots:**
   ```javascript
   // Save metrics every 5 minutes
   setInterval(() => {
       const metrics = websocketBridge.getMetrics();
       fs.appendFileSync(
           'runtime/logs/ws-metrics.log',
           JSON.stringify(metrics) + '\n'
       );
   }, 5 * 60 * 1000);
   ```

4. **Authentication:**
   ```javascript
   // Protect monitoring endpoint
   app.get('/api/ws-monitor', authenticateApiKey, (req, res) => {
       // ...
   });
   ```

---

###### **0.14.6 Benefits** ✨

**الفوائد:**

1. **✅ Real-Time Monitoring**
   - تحديث تلقائي كل ثانيتين
   - عرض مباشر للاتصالات الحية
   - تتبع الأخطاء فوراً

2. **✅ Zero Dependencies**
   - بدون مكتبات خارجية ثقيلة
   - HTML/CSS/JS خام فقط
   - سريع وخفيف

3. **✅ Production Ready**
   - يعمل محلياً وعلى السيرفر
   - لا يؤثر على الأداء
   - بيانات من الذاكرة مباشرة

4. **✅ Comprehensive Metrics**
   - اتصالات (current, total, alive, dead)
   - رسائل (received, broadcasts)
   - نظام (memory, CPU, uptime)
   - عملاء (IP, ping, buffer, subscriptions)
   - أخطاء (total, last error details)

5. **✅ Beautiful UI**
   - تصميم احترافي مع gradients
   - Responsive design
   - Dark theme
   - Real-time updates
   - Status badges

---

#### **1. Database للـ Notifications** 🗄️

**الحالة الحالية:**
```javascript
// /runtime/server/routes/notifications.js
let notifications = [];  // ❌ In-memory (يُفقد عند إعادة التشغيل)
```

**المطلوب:**
- ✅ إنشاء جدول `notifications` في SQLite
- ✅ Migration من in-memory إلى database
- ✅ CRUD operations عبر database
- ✅ Indexing للأداء (userId, read, createdAt)
- ✅ Auto-cleanup للإشعارات القديمة (>30 يوم)

**الملفات المطلوبة:**
```
/runtime/server/
├── database/
│   ├── schema/
│   │   └── notifications.sql          ← جديد
│   └── models/
│       └── Notification.js             ← جديد
└── routes/
    └── notifications.js                ← تحديث
```

**Schema المقترح:**
```sql
-- notifications.sql
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('info', 'success', 'warning', 'error')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    icon TEXT,
    link TEXT,
    read INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes للأداء
CREATE INDEX idx_notifications_userId ON notifications(userId);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_createdAt ON notifications(createdAt);
CREATE INDEX idx_notifications_userId_read ON notifications(userId, read);
```

**Model المقترح:**
```javascript
// Notification.js
class NotificationModel {
    constructor(db) {
        this.db = db;
    }

    async create(notification) {
        const query = `
            INSERT INTO notifications (id, userId, type, title, message, icon, link, read, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await this.db.run(query, [
            notification.id,
            notification.userId,
            notification.type,
            notification.title,
            notification.message,
            notification.icon || null,
            notification.link || null,
            notification.read ? 1 : 0,
            notification.createdAt
        ]);
        return notification;
    }

    async findByUserId(userId, filter = 'all', limit = 50) {
        let query = `SELECT * FROM notifications WHERE userId = ?`;
        const params = [userId];

        if (filter === 'unread') {
            query += ` AND read = 0`;
        }

        query += ` ORDER BY createdAt DESC LIMIT ?`;
        params.push(limit);

        return await this.db.all(query, params);
    }

    async getUnreadCount(userId) {
        const query = `SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND read = 0`;
        const result = await this.db.get(query, [userId]);
        return result.count;
    }

    async markAsRead(id) {
        const query = `UPDATE notifications SET read = 1, updatedAt = ? WHERE id = ?`;
        await this.db.run(query, [new Date().toISOString(), id]);
    }

    async markAllAsRead(userId) {
        const query = `UPDATE notifications SET read = 1, updatedAt = ? WHERE userId = ? AND read = 0`;
        await this.db.run(query, [new Date().toISOString(), userId]);
    }

    async delete(id) {
        const query = `DELETE FROM notifications WHERE id = ?`;
        await this.db.run(query, [id]);
    }

    async cleanup(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const query = `DELETE FROM notifications WHERE createdAt < ?`;
        const result = await this.db.run(query, [cutoffDate.toISOString()]);
        return result.changes;
    }
}

module.exports = NotificationModel;
```

**Migration Plan:**
```javascript
// 1. Create table
// 2. Migrate existing in-memory data (if any)
// 3. Update routes to use model
// 4. Test CRUD operations
// 5. Setup auto-cleanup cron job
```

---

#### **2. Rate Limiting للـ WebSocket** 🛡️

**المشكلة:**
- حالياً لا يوجد حماية من spam messages
- Client يمكنه إرسال unlimited messages

**المطلوب:**
- ✅ Rate limiting per client
- ✅ Configurable limits (messages/second)
- ✅ Auto-disconnect على التجاوز
- ✅ Whitelist للـ trusted clients

**الملفات المطلوبة:**
```
/runtime/server/
├── middleware/
│   └── websocketRateLimit.js          ← جديد
└── services/
    └── websocketBridge.js              ← تحديث
```

**Implementation المقترح:**
```javascript
// websocketRateLimit.js
class WebSocketRateLimit {
    constructor(options = {}) {
        this.maxMessages = options.maxMessages || 10;  // 10 messages
        this.windowMs = options.windowMs || 1000;      // per second
        this.whitelist = new Set(options.whitelist || []);
        this.clients = new Map();
    }

    check(clientId) {
        // Skip whitelist
        if (this.whitelist.has(clientId)) {
            return { allowed: true };
        }

        const now = Date.now();
        const clientData = this.clients.get(clientId) || {
            messages: [],
            violations: 0
        };

        // Remove old messages outside window
        clientData.messages = clientData.messages.filter(
            timestamp => now - timestamp < this.windowMs
        );

        // Check limit
        if (clientData.messages.length >= this.maxMessages) {
            clientData.violations++;
            this.clients.set(clientId, clientData);
            
            return {
                allowed: false,
                violations: clientData.violations,
                retryAfter: this.windowMs - (now - clientData.messages[0])
            };
        }

        // Add message
        clientData.messages.push(now);
        this.clients.set(clientId, clientData);

        return { allowed: true };
    }

    reset(clientId) {
        this.clients.delete(clientId);
    }

    addToWhitelist(clientId) {
        this.whitelist.add(clientId);
    }

    removeFromWhitelist(clientId) {
        this.whitelist.delete(clientId);
    }
}

module.exports = WebSocketRateLimit;
```

**Integration في WebSocketBridge:**
```javascript
// websocketBridge.js
const WebSocketRateLimit = require('../middleware/websocketRateLimit');

class WebSocketBridge {
    constructor(server, sessionMonitor) {
        // ... existing code
        this.rateLimit = new WebSocketRateLimit({
            maxMessages: 10,    // 10 messages
            windowMs: 1000,     // per second
            whitelist: []       // trusted clients
        });
    }

    handleClientMessage(ws, message) {
        // Rate limiting check
        const clientId = ws.clientId || ws._socket.remoteAddress;
        const rateLimitResult = this.rateLimit.check(clientId);

        if (!rateLimitResult.allowed) {
            logger.warn(`Rate limit exceeded for client ${clientId}`, {
                violations: rateLimitResult.violations
            });

            // Send warning
            this.send(ws, {
                type: 'rate_limit_exceeded',
                message: 'Too many messages. Please slow down.',
                retryAfter: rateLimitResult.retryAfter
            });

            // Auto-disconnect after 3 violations
            if (rateLimitResult.violations >= 3) {
                logger.error(`Client ${clientId} disconnected due to rate limit violations`);
                ws.close(1008, 'Rate limit exceeded');
                this.rateLimit.reset(clientId);
            }

            return;
        }

        // ... existing message handling
    }
}
```

**Configuration:**
```javascript
// .env
WEBSOCKET_RATE_LIMIT_MAX_MESSAGES=10
WEBSOCKET_RATE_LIMIT_WINDOW_MS=1000
WEBSOCKET_RATE_LIMIT_MAX_VIOLATIONS=3
```

---

#### **3. Compression للرسائل الكبيرة** 📦

**المشكلة:**
- رسائل كبيرة (مثل campaign data) تستهلك bandwidth
- لا يوجد compression حالياً

**المطلوب:**
- ✅ Auto-compression للرسائل > 1KB
- ✅ Support لـ gzip/deflate
- ✅ Client-side decompression
- ✅ Fallback للرسائل الصغيرة

**الملفات المطلوبة:**
```
/runtime/server/
└── services/
    └── websocketBridge.js              ← تحديث

/dashboard/src/
└── hooks/
    └── useWebSocket.js                 ← تحديث
```

**Backend Implementation:**
```javascript
// websocketBridge.js
const zlib = require('zlib');
const { promisify } = require('util');
const gzip = promisify(zlib.gzip);

class WebSocketBridge {
    constructor(server, sessionMonitor) {
        // ... existing code
        this.compressionThreshold = 1024; // 1KB
        this.compressionEnabled = process.env.WEBSOCKET_COMPRESSION === 'true';
    }

    async send(ws, data) {
        if (ws.readyState !== WebSocket.OPEN) return;

        const message = JSON.stringify(data);
        const messageSize = Buffer.byteLength(message);

        // Compress if enabled and message is large
        if (this.compressionEnabled && messageSize > this.compressionThreshold) {
            try {
                const compressed = await gzip(message);
                
                // Send compressed with metadata
                ws.send(JSON.stringify({
                    compressed: true,
                    data: compressed.toString('base64'),
                    originalSize: messageSize,
                    compressedSize: compressed.length
                }));

                logger.debug(`Compressed message: ${messageSize}B → ${compressed.length}B (${Math.round((1 - compressed.length/messageSize) * 100)}% reduction)`);
            } catch (error) {
                logger.error('Compression failed, sending uncompressed:', error);
                ws.send(message);
            }
        } else {
            ws.send(message);
        }
    }

    async broadcast(type, data) {
        const message = {
            type,
            data,
            timestamp: Date.now()
        };

        let sent = 0;
        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN && client.isAuthenticated) {
                if (!client.subscriptions || 
                    client.subscriptions.includes('all') || 
                    client.subscriptions.includes(type)) {
                    await this.send(client, message);
                    sent++;
                }
            }
        }

        if (sent > 0) {
            logger.debug(`Broadcast sent to ${sent} clients: ${type}`);
        }
    }
}
```

**Frontend Implementation:**
```javascript
// useWebSocket.js
import pako from 'pako';  // npm install pako

ws.onmessage = async (event) => {
    try {
        const rawData = JSON.parse(event.data);

        // Check if compressed
        if (rawData.compressed) {
            // Decompress
            const compressedData = Uint8Array.from(atob(rawData.data), c => c.charCodeAt(0));
            const decompressed = pako.ungzip(compressedData, { to: 'string' });
            const data = JSON.parse(decompressed);

            console.log(`📦 Decompressed: ${rawData.compressedSize}B → ${rawData.originalSize}B`);
            
            // Handle decompressed data
            handleMessage(data);
        } else {
            // Handle normal data
            handleMessage(rawData);
        }
    } catch (err) {
        console.error('❌ Error parsing WebSocket message:', err);
    }
};
```

**Configuration:**
```javascript
// .env
WEBSOCKET_COMPRESSION=true
WEBSOCKET_COMPRESSION_THRESHOLD=1024
```

**Dependencies:**
```json
// Backend: Built-in zlib
// Frontend: 
{
  "dependencies": {
    "pako": "^2.1.0"  // gzip/deflate for browser
  }
}
```

---

### **📊 Performance Metrics:**

**Before:**
```
- Notifications: In-memory (lost on restart)
- WebSocket: No rate limiting
- Messages: No compression
- Average message size: 2-5KB
- Bandwidth usage: High for large campaigns
```

**After:**
```
- Notifications: SQLite (persistent + indexed)
- WebSocket: 10 msg/sec limit
- Messages: Auto-compress >1KB
- Average message size: 0.5-2KB (60% reduction)
- Bandwidth usage: Reduced by ~40-60%
```

---

### **🔄 Migration Plan:**

**Phase 1: Database (Week 1)**
1. Create schema
2. Create model
3. Update routes
4. Test CRUD
5. Setup cleanup cron

**Phase 2: Rate Limiting (Week 1)**
1. Create middleware
2. Integrate in WebSocketBridge
3. Test limits
4. Monitor violations

**Phase 3: Compression (Week 2)**
1. Backend implementation
2. Frontend implementation
3. Test compression ratio
4. Monitor performance

**Phase 4: Testing & Deployment (Week 2)**
1. Integration testing
2. Load testing
3. Documentation
4. Production deployment

---

### **✅ Success Criteria:**

- ✅ Notifications persist across restarts
- ✅ Database queries < 50ms
- ✅ Rate limiting blocks spam
- ✅ Compression reduces bandwidth by >40%
- ✅ No breaking changes to existing features
- ✅ Full backward compatibility

---

### **📝 Notes:**

**Database Choice:**
- SQLite: ✅ مُوصى به (خفيف، سريع، لا يحتاج server)
- PostgreSQL: للمشاريع الكبيرة جداً

**Rate Limiting:**
- Default: 10 msg/sec
- Configurable per environment
- Whitelist للـ admin clients

**Compression:**
- Auto-enabled for messages >1KB
- Uses gzip (best compression ratio)
- Fallback to uncompressed on error

---

**Status:** 📋 **PLANNED** - Ready for implementation!

---

**جاهز للبدء! 🚀**
