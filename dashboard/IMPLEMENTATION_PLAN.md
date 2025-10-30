# 📋 خطة التنفيذ الشاملة - WaQtor Dashboard

## 🎯 **نظرة عامة:**

تم فحص الملفات الموجودة وتحليل المطلوب. الخطة مقسمة إلى **7 مراحل** منظمة.

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

---

## 🚀 **المراحل المطلوبة:**

---

### **المرحلة 1️⃣: تحديثات Topbar** ✅ (مكتملة)

#### **المطلوب:**
- [x] تحريك زر Menu Toggle أكثر لليسار
- [x] Profile dropdown مع Avatar
- [x] Quick Actions panel
- [x] **تحسين Avatar System:**
  - [x] استخدام Label + Circle للمستخدمين بدون صورة
  - [x] استخدام Image + Circle للمستخدمين بصورة
  - [x] دعم Gravatar
  - [x] إضافة Badge للإشعارات

#### **الملفات:**
```
✅ /components/layout/AppTopbar.tsx
✅ /components/ui/layout/_topbar.scss
```

#### **الكود المطلوب:**
```typescript
// Avatar بدون صورة (Label + Circle)
<Avatar 
    label={userName.charAt(0).toUpperCase()} 
    shape="circle"
    size="large"
    style={{ backgroundColor: '#0f766e', color: '#ffffff' }}
/>

// Avatar بصورة (Image + Circle)
<Avatar 
    image={userAvatar}
    shape="circle"
    size="large"
/>

// Avatar مع Badge
<Avatar 
    label="U" 
    size="xlarge" 
    className="p-overlay-badge"
    shape="circle"
>
    <Badge value="4" severity="danger" />
</Avatar>
```

---

### **المرحلة 2️⃣: إنشاء صفحة Profile** ✅ (مكتملة)

#### **المطلوب:**
- [x] إنشاء `/app/(main)/profile/page.tsx`
- [x] تصميم صفحة Profile احترافية
- [x] إضافة Avatar مع إمكانية رفع صورة
- [x] معلومات المستخدم (الاسم، البريد، رقم الهاتف)
- [x] إعدادات الحساب
- [x] تاريخ النشاط

#### **المكونات المطلوبة:**
```typescript
- Avatar (Image/Label + Circle)
- FileUpload (لرفع الصورة)
- InputText (للمعلومات)
- Button (حفظ/إلغاء)
- Card (لتنظيم الأقسام)
- Divider (للفصل بين الأقسام)
```

#### **الملفات:**
```
📁 /app/(main)/profile/
├── page.tsx           (الصفحة الرئيسية)
└── profile.css        (التنسيقات)
```

---

### **المرحلة 3️⃣: إنشاء صفحة About** ✅

#### **المطلوب:**
- [x] إنشاء `/app/(main)/about/page.tsx`
- [x] معلومات عن النظام (WaQtor)
- [x] Documentation links
- [x] FAQ section
- [x] تعليمات الاستخدام
- [x] معلومات الإصدار
- [x] روابط الدعم

#### **الأقسام:**
```
1. About WaQtor
   - نبذة عن النظام
   - الميزات الرئيسية
   - الإصدار الحالي

2. Documentation
   - Quick Start Guide
   - API Documentation
   - User Manual

3. FAQ
   - أسئلة شائعة
   - Accordion component

4. Support
   - روابط التواصل
   - GitHub Issues
   - Email Support
```

#### **الملفات:**
```
📁 /app/(main)/about/
├── page.tsx           (الصفحة الرئيسية)
└── about.css          (التنسيقات)
```

---

### **المرحلة 4️⃣: نظام BlockUI للصفحات المحمية** ✅ (مكتملة)

#### **المطلوب:**
- [x] تطبيق BlockUI على 3 صفحات:
  - `/campaigns`
  - `/reports`
  - `/interactive`
- [x] إضافة نافذة InputOtp عند الضغط
- [x] التحقق من الكود (1234 مؤقتاً)
- [x] حفظ حالة الاشتراك في localStorage

#### **الكود:**
```typescript
// BlockUI Template
<BlockUI 
    blocked={!isSubscribed} 
    template={
        <div className="block-ui-template">
            <i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>
            <h3>Premium Feature</h3>
            <p>Subscribe or enter access code</p>
        </div>
    }
>
    {/* محتوى الصفحة */}
</BlockUI>

// InputOtp Dialog
<Dialog visible={showOtpDialog} onHide={() => setShowOtpDialog(false)}>
    <h3>Enter Access Code</h3>
    <InputOtp 
        value={otp} 
        onChange={(e) => setOtp(e.value)} 
        mask 
        length={4}
    />
    <Button 
        label="Verify" 
        onClick={verifyOtp}
    />
</Dialog>
```

#### **الملفات:**
```
📁 /components/BlockUI/
├── ProtectedPage.tsx  (مكون قابل لإعادة الاستخدام)
└── OtpDialog.tsx      (نافذة الـ OTP)
```

---

### **المرحلة 5️⃣: إضافة Tag "New" للصفحات الجديدة** ✅ (مكتملة)

#### **المطلوب:**
- [x] إضافة Tag "New" في Sidebar Menu
- [x] تطبيق على 3 صفحات:
  - Campaigns
  - Reports
  - Interactive

#### **الكود:**
```typescript
// في AppMenu.tsx
{
    label: 'Campaigns',
    icon: 'pi pi-fw pi-megaphone',
    to: '/campaigns',
    badge: 'New',
    badgeClass: 'p-badge-success'
}
```

#### **الملفات:**
```
✏️ /components/layout/AppMenu.tsx
✏️ /components/layout/AppMenuitem.tsx (إضافة دعم Badge)
```

---

### **المرحلة 6️⃣: إضافة ScrollTop للتطبيق** ✅ (مكتملة)

#### **المطلوب:**
- [x] إضافة ScrollTop component في Layout الرئيسي
- [x] يظهر عند التمرير لأسفل
- [x] تصميم متناسق مع الثيم

#### **الكود:**
```typescript
// في layout.tsx
<ScrollTop 
    threshold={400}
    icon="pi pi-arrow-up"
    className="custom-scrolltop"
/>
```

#### **الملفات:**
```
✏️ /app/(main)/layout.tsx
📁 /components/ui/layout/_scrolltop.scss
```

---

### **المرحلة 7️⃣: تحسين UI Components**

#### **المطلوب:**
- [ ] إضافة صفحة Badge في UIKit
- [ ] إضافة صفحة Tag في UIKit
- [ ] إضافة صفحة Chip في UIKit
- [ ] إضافة صفحة Avatar في UIKit
- [ ] تحسين صفحات Auth الموجودة
- [ ] تحسين صفحة Landing
- [ ] تحسين صفحة NotFound

#### **الملفات الجديدة:**
```
📁 /app/(main)/uikit/
├── badge/
│   └── page.tsx
├── tag/
│   └── page.tsx
├── chip/
│   └── page.tsx
└── avatar/
    └── page.tsx
```

---

## 📦 **المكونات المشتركة المطلوبة:**

### **1. ProtectedPage Component:**
```typescript
interface ProtectedPageProps {
    children: React.ReactNode;
    requireSubscription?: boolean;
    accessCode?: string;
}
```

### **2. OtpDialog Component:**
```typescript
interface OtpDialogProps {
    visible: boolean;
    onHide: () => void;
    onVerify: (code: string) => void;
}
```

### **3. PageHeader Component:**
```typescript
interface PageHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
    actions?: React.ReactNode;
}
```

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

## **المرحلة 6️⃣: Notification System** 🔔

### **Backend:**
- [ ] API Endpoints:
  - `GET /api/notifications` - جلب الإشعارات
  - `POST /api/notifications/mark-read/:id` - تحديد كمقروء
  - `POST /api/notifications/mark-all-read` - تحديد الكل كمقروء
  - `DELETE /api/notifications/:id` - حذف إشعار
  - `GET /api/notifications/count` - عدد غير المقروءة

- [ ] Database Schema:
  ```typescript
  interface Notification {
      id: string;
      userId: string;
      type: 'info' | 'success' | 'warning' | 'error';
      title: string;
      message: string;
      icon?: string;
      link?: string;
      read: boolean;
      createdAt: Date;
  }
  ```

- [ ] WebSocket (Optional):
  - Real-time notifications
  - Socket.io integration
  - Event: `notification:new`

### **Frontend:**
- [ ] Components:
  - `NotificationBell.tsx` - أيقونة الجرس مع Badge
  - `NotificationDropdown.tsx` - قائمة الإشعارات
  - `NotificationItem.tsx` - عنصر إشعار واحد
  - `NotificationCenter.tsx` - صفحة كاملة للإشعارات

- [ ] Features:
  - [ ] عرض عدد غير المقروءة في Badge
  - [ ] Dropdown menu عند الضغط
  - [ ] Mark as read (single/all)
  - [ ] Delete notification
  - [ ] Filter (all/unread)
  - [ ] Pagination
  - [ ] Real-time updates (WebSocket)
  - [ ] Sound notification (optional)
  - [ ] Desktop notification (optional)

- [ ] UI/UX:
  - [ ] Animation عند وصول إشعار جديد
  - [ ] Different icons per type
  - [ ] Time ago (e.g., "5 minutes ago")
  - [ ] Empty state
  - [ ] Loading state
  - [ ] Error handling

### **Integration:**
- [ ] AppTopbar.tsx:
  - Replace static Badge with real data
  - Add NotificationBell component
  
- [ ] Context/Store:
  - NotificationContext or Zustand store
  - Global state management
  
- [ ] API Integration:
  - Fetch notifications on mount
  - Poll every X seconds OR WebSocket
  - Update count in real-time

### **الملفات:**
```
📁 /components/Notifications/
├── NotificationBell.tsx
├── NotificationDropdown.tsx
├── NotificationItem.tsx
└── NotificationCenter.tsx

📁 /app/(main)/notifications/
└── page.tsx

📁 /api/notifications/
├── route.ts (GET, POST)
├── [id]/route.ts (DELETE, PATCH)
└── count/route.ts (GET)

📁 /contexts/
└── NotificationContext.tsx

📁 /hooks/
└── useNotifications.ts
```

---

## 🪝 **المرحلة 8️⃣: Webhook Dispatcher - آمن وقابل للإدارة**

### **🎯 الأهداف:**
- ✅ نظام Webhooks آمن مع HMAC Signature
- ✅ دعم أحداث متعددة (message_received, message_sent, campaign_executed, client_disconnected)
- ✅ لوحة إدارة في Settings لإدارة Webhooks
- ✅ Retry mechanism مع exponential backoff
- ✅ Webhook logs & monitoring

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

### **✅ Features:**

- ✅ **HMAC Signature**: Secure webhook verification
- ✅ **Multiple Events**: 8 supported events
- ✅ **Retry Mechanism**: Exponential backoff (3 attempts)
- ✅ **Dashboard UI**: Full CRUD interface
- ✅ **Test Endpoint**: Send test webhooks
- ✅ **Logs & Monitoring**: Track webhook deliveries
- ✅ **Enable/Disable**: Toggle webhooks on/off
- ✅ **Secret Management**: Auto-generate or custom secrets

---

## 🤖 **المرحلة 9️⃣: SmartBot AI Engine v2 - من Fuzzy إلى Semantic Matching**

### **🎯 الأهداف:**
- ✅ ترقية من Fuzzy Matching إلى Semantic Matching
- ✅ استخدام Embeddings (MiniLM/MPNet) للبحث المتجهي
- ✅ Confidence scoring لكل رد
- ✅ Template expansion مع متغيرات ديناميكية
- ✅ Learning loop مع مراجعة بشرية
- ✅ نقل التخزين من JSON إلى قاعدة بيانات علائقية

### **📊 Pipeline: Message → Language Detection → Embedding → Semantic Search → Safety → Template → Response → Learning**

### **🗄️ Database Schema:**
- `smartbot_rules` (enhanced with tone, variables, priority)
- `smartbot_embeddings` (NEW - stores 384-dim vectors)
- `smartbot_history` (migrated from JSON)
- `smartbot_suggestions` (NEW - learning loop)

### **🔧 Components:**
- EmbeddingService (Xenova transformers)
- SmartBotEngineV2 (main pipeline)
- TemplateEngine (variable expansion)
- SafetyLayer (profanity + no-reply rules)

### **💻 Dashboard Features:**
- Rule List + "Generate Embedding" button
- Test Bench (Top-3 matches + confidence)
- Auto-Improve (suggestions from unmatched queries)

---

## 🏗️ **المرحلة 10: Architecture Evolution - من Monolith إلى Modular Microkernel**

### **🎯 الأهداف:**
- ✅ تحديث المحرك بدون كسر الواجهة (Backward Compatibility)
- ✅ دعم Multi-Instance مستقبلاً
- ✅ نشر SDK رسمي (Node.js + Python)
- ✅ فصل المسؤوليات (Separation of Concerns)
- ✅ قابلية الاختبار والصيانة

---

### **📦 الهيكل المقترح (Mono-Repo):**

```
waqtor/
├─ packages/
│  ├─ core/                 # @waqtor/core  ← المحرك الأساسي
│  │  ├─ src/
│  │  │  ├─ engine/         # WhatsAppClient, SessionManager, EventBus
│  │  │  ├─ campaigns/      # CampaignEngine (الحد الأدنى)
│  │  │  ├─ storage/        # Storage adapters: sqlite | memory
│  │  │  └─ plugins/        # Plugin interfaces (اختيارية)
│  │  ├─ index.ts
│  │  └─ package.json
│  │
│  ├─ server/               # @waqtor/server ← REST + WS + Webhooks
│  │  ├─ src/
│  │  │  ├─ api/            # Routes: /messages, /campaigns, /status, /webhooks
│  │  │  ├─ ws/             # WebSocket 2.0 namespaces
│  │  │  ├─ middleware/     # Auth, Rate limiting, CORS
│  │  │  └─ bootstrap.ts    # Dependency Injection (يحقن Core)
│  │  ├─ index.ts
│  │  └─ package.json
│  │
│  ├─ sdk-node/             # @waqtor/sdk (Node.js SDK)
│  │  ├─ src/
│  │  │  ├─ client.ts       # WaqtorClient class
│  │  │  ├─ types.ts        # TypeScript definitions
│  │  │  └─ utils.ts        # Helper functions
│  │  ├─ index.ts
│  │  └─ package.json
│  │
│  └─ sdk-py/               # waqtor (Python SDK)
│     ├─ waqtor/
│     │  ├─ __init__.py
│     │  ├─ client.py       # WaqtorClient class
│     │  └─ types.py        # Type hints
│     ├─ setup.py
│     └─ README.md
│
└─ apps/
   ├─ dashboard/            # Next.js 14 (Sakai Theme)
   │  └─ (current structure)
   │
   └─ examples/
      ├─ basic-bot/
      ├─ campaign-scheduler/
      └─ webhook-handler/
```

---

### **🔒 حدود النظافة (Separation of Concerns):**

#### **1. @waqtor/core** (المحرك الأساسي)
```typescript
// ✅ المسؤوليات:
- إدارة جلسة WhatsApp (SessionManager)
- معالجة الأحداث (EventBus)
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

## 🔌 **المرحلة 9️⃣: Integration Layer - WebSocket 2.0 (Event-Driven + Namespaces)**

### **🎯 الأهداف:**
- ✅ تنظيم القنوات عبر Namespaces
- ✅ Heartbeat + Auto-Reconnect
- ✅ Backpressure handling للحملات الكثيفة
- ✅ Reliable real-time communication
- ✅ Better error handling & recovery

---

### **📡 WebSocket Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend (@waqtor/server)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Socket.io Server                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ /status    │  │ /campaigns │  │ /smartbot  │     │  │
│  │  │ namespace  │  │ namespace  │  │ namespace  │     │  │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘     │  │
│  └────────┼───────────────┼───────────────┼────────────┘  │
│           │               │               │                │
│           └───────────────┴───────────────┘                │
│                           │                                │
│                    ┌──────▼──────┐                         │
│                    │  EventBus   │                         │
│                    │  (@waqtor/  │                         │
│                    │   core)     │                         │
│                    └─────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Dashboard)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Socket.io Client (Multiple Namespaces)     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ /status    │  │ /campaigns │  │ /smartbot  │     │  │
│  │  │ client     │  │ client     │  │ client     │     │  │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘     │  │
│  └────────┼───────────────┼───────────────┼────────────┘  │
│           │               │               │                │
│           ▼               ▼               ▼                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Zustand Store / Context                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### **🔧 Server Implementation (@waqtor/server):**

#### **1. WebSocket Server Setup:**

```typescript
// ws/index.ts
import { Server } from 'socket.io';
import { EventBus } from '@waqtor/core';

export function setupWebSocket(httpServer: any, eventBus: EventBus) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.DASHBOARD_URL || 'http://localhost:3000',
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingInterval: 15000,      // Heartbeat every 15s
    pingTimeout: 10000,       // Timeout after 10s
    maxHttpBufferSize: 1e6    // 1MB max message size
  });

  // Middleware: Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (isValidToken(token)) {
      next();
    } else {
      next(new Error('Authentication failed'));
    }
  });

  // Setup namespaces
  setupStatusNamespace(io, eventBus);
  setupCampaignsNamespace(io, eventBus);
  setupSmartBotNamespace(io, eventBus);

  return io;
}
```

#### **2. Status Namespace (/status):**

```typescript
// ws/namespaces/status.ts
import { Namespace } from 'socket.io';
import { EventBus } from '@waqtor/core';

export function setupStatusNamespace(io: Server, bus: EventBus) {
  const statusNs = io.of('/status');

  statusNs.on('connection', (socket) => {
    console.log(`[/status] Client connected: ${socket.id}`);

    // Send current state immediately
    socket.emit('status', {
      status: bus.getSessionStatus(),
      timestamp: new Date().toISOString()
    });

    // Listen to core events
    const qrHandler = (event: any) => {
      socket.emit('qr', {
        qr: event.data.qr,
        timestamp: event.data.timestamp
      });
    };

    const statusHandler = (event: any) => {
      socket.emit('status', {
        status: event.data.status,
        clientInfo: event.data.clientInfo,
        timestamp: event.data.timestamp
      });
    };

    const statsHandler = (event: any) => {
      socket.emit('stats', {
        messagesSent: event.data.sent,
        messagesReceived: event.data.received,
        timestamp: event.data.timestamp
      });
    };

    // Register handlers
    bus.on('session.qr', qrHandler);
    bus.on('session.status', statusHandler);
    bus.on('session.stats', statsHandler);

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log(`[/status] Client disconnected: ${socket.id}`);
      bus.off('session.qr', qrHandler);
      bus.off('session.status', statusHandler);
      bus.off('session.stats', statsHandler);
    });

    // Heartbeat monitoring
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });
  });
}
```

#### **3. Campaigns Namespace (/campaigns):**

```typescript
// ws/namespaces/campaigns.ts
import { Namespace } from 'socket.io';
import { EventBus } from '@waqtor/core';

export function setupCampaignsNamespace(io: Server, bus: EventBus) {
  const campaignsNs = io.of('/campaigns');

  // Backpressure queue
  const messageQueue: any[] = [];
  const MAX_BROADCAST_RATE = 100; // messages per second
  let lastBroadcast = Date.now();

  campaignsNs.on('connection', (socket) => {
    console.log(`[/campaigns] Client connected: ${socket.id}`);

    // Campaign progress with backpressure
    const progressHandler = (event: any) => {
      const now = Date.now();
      const timeSinceLastBroadcast = now - lastBroadcast;

      if (timeSinceLastBroadcast < (1000 / MAX_BROADCAST_RATE)) {
        // Queue the message
        messageQueue.push({ event: 'progress', data: event.data });
      } else {
        // Broadcast immediately
        socket.emit('progress', {
          campaignId: event.data.campaignId,
          sent: event.data.sent,
          total: event.data.total,
          failed: event.data.failed,
          status: event.data.status,
          timestamp: event.data.timestamp
        });
        lastBroadcast = now;
      }
    };

    const completedHandler = (event: any) => {
      socket.emit('completed', {
        campaignId: event.data.campaignId,
        totalSent: event.data.sent,
        totalFailed: event.data.failed,
        duration: event.data.duration,
        timestamp: event.data.timestamp
      });
    };

    // Register handlers
    bus.on('campaign.progress', progressHandler);
    bus.on('campaign.completed', completedHandler);

    // Process queued messages
    const queueInterval = setInterval(() => {
      if (messageQueue.length > 0) {
        const batch = messageQueue.splice(0, 10); // Send 10 at a time
        batch.forEach(msg => socket.emit(msg.event, msg.data));
      }
    }, 100);

    // Cleanup
    socket.on('disconnect', () => {
      console.log(`[/campaigns] Client disconnected: ${socket.id}`);
      bus.off('campaign.progress', progressHandler);
      bus.off('campaign.completed', completedHandler);
      clearInterval(queueInterval);
    });
  });
}
```

#### **4. SmartBot Namespace (/smartbot):**

```typescript
// ws/namespaces/smartbot.ts
import { Namespace } from 'socket.io';
import { EventBus } from '@waqtor/core';

export function setupSmartBotNamespace(io: Server, bus: EventBus) {
  const smartbotNs = io.of('/smartbot');

  smartbotNs.on('connection', (socket) => {
    console.log(`[/smartbot] Client connected: ${socket.id}`);

    // Incoming messages
    const messageHandler = (event: any) => {
      socket.emit('incoming', {
        from: event.data.from,
        body: event.data.body,
        messageId: event.data.messageId,
        isGroup: event.data.isGroup,
        timestamp: event.data.timestamp
      });
    };

    // SmartBot replies
    const replyHandler = (event: any) => {
      socket.emit('reply', {
        to: event.data.to,
        trigger: event.data.trigger,
        response: event.data.response,
        timestamp: event.data.timestamp
      });
    };

    // Rule updates
    const ruleUpdateHandler = (event: any) => {
      socket.emit('rule-updated', {
        ruleId: event.data.ruleId,
        action: event.data.action, // 'created' | 'updated' | 'deleted'
        timestamp: event.data.timestamp
      });
    };

    // Register handlers
    bus.on('message.received', messageHandler);
    bus.on('smartbot.reply', replyHandler);
    bus.on('smartbot.rule-updated', ruleUpdateHandler);

    // Cleanup
    socket.on('disconnect', () => {
      console.log(`[/smartbot] Client disconnected: ${socket.id}`);
      bus.off('message.received', messageHandler);
      bus.off('smartbot.reply', replyHandler);
      bus.off('smartbot.rule-updated', ruleUpdateHandler);
    });
  });
}
```

---

### **💻 Client Implementation (Dashboard):**

#### **1. WebSocket Hook:**

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  namespace: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const { namespace, autoConnect = true, onConnect, onDisconnect, onError } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState<number>(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';
    const token = localStorage.getItem('api_key');

    const socket = io(`${WS_URL}${namespace}`, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log(`[${namespace}] Connected`);
      setIsConnected(true);
      onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      console.log(`[${namespace}] Disconnected:`, reason);
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      console.error(`[${namespace}] Connection error:`, error);
      onError?.(error);
    });

    // Heartbeat
    const heartbeatInterval = setInterval(() => {
      const start = Date.now();
      socket.emit('ping');
      
      socket.once('pong', () => {
        const latency = Date.now() - start;
        setLatency(latency);
      });
    }, 15000);

    // Cleanup
    return () => {
      clearInterval(heartbeatInterval);
      socket.disconnect();
    };
  }, [namespace, onConnect, onDisconnect, onError]);

  const emit = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  const on = (event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
  };

  const off = (event: string, handler?: (...args: any[]) => void) => {
    socketRef.current?.off(event, handler);
  };

  return {
    socket: socketRef.current,
    isConnected,
    latency,
    emit,
    on,
    off
  };
}
```

#### **2. Status WebSocket (Dashboard):**

```typescript
// hooks/useStatusWebSocket.ts
import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAppStore } from '@/store/useAppStore';

export function useStatusWebSocket() {
  const { setQrCode, setSessionStatus, setClientInfo, setStats } = useAppStore();

  const { isConnected, latency, on, off } = useWebSocket({
    namespace: '/status',
    onConnect: () => {
      console.log('Status WebSocket connected');
    },
    onDisconnect: () => {
      console.log('Status WebSocket disconnected');
    }
  });

  useEffect(() => {
    // QR Code updates
    const handleQr = (data: any) => {
      setQrCode(data.qr);
    };

    // Status updates
    const handleStatus = (data: any) => {
      setSessionStatus(data.status);
      if (data.clientInfo) {
        setClientInfo(data.clientInfo);
      }
    };

    // Stats updates
    const handleStats = (data: any) => {
      setStats({
        sent: data.messagesSent,
        received: data.messagesReceived
      });
    };

    // Register listeners
    on('qr', handleQr);
    on('status', handleStatus);
    on('stats', handleStats);

    // Cleanup
    return () => {
      off('qr', handleQr);
      off('status', handleStatus);
      off('stats', handleStats);
    };
  }, [on, off, setQrCode, setSessionStatus, setClientInfo, setStats]);

  return { isConnected, latency };
}
```

#### **3. Campaigns WebSocket:**

```typescript
// hooks/useCampaignsWebSocket.ts
import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useCampaignStore } from '@/store/useCampaignStore';

export function useCampaignsWebSocket() {
  const { updateCampaignProgress, markCampaignCompleted } = useCampaignStore();

  const { isConnected, on, off } = useWebSocket({
    namespace: '/campaigns'
  });

  useEffect(() => {
    const handleProgress = (data: any) => {
      updateCampaignProgress(data.campaignId, {
        sent: data.sent,
        total: data.total,
        failed: data.failed,
        status: data.status
      });
    };

    const handleCompleted = (data: any) => {
      markCampaignCompleted(data.campaignId, {
        totalSent: data.totalSent,
        totalFailed: data.totalFailed,
        duration: data.duration
      });
    };

    on('progress', handleProgress);
    on('completed', handleCompleted);

    return () => {
      off('progress', handleProgress);
      off('completed', handleCompleted);
    };
  }, [on, off, updateCampaignProgress, markCampaignCompleted]);

  return { isConnected };
}
```

#### **4. SmartBot WebSocket:**

```typescript
// hooks/useSmartBotWebSocket.ts
import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useSmartBotStore } from '@/store/useSmartBotStore';

export function useSmartBotWebSocket() {
  const { addIncomingMessage, addReply, updateRule } = useSmartBotStore();

  const { isConnected, on, off } = useWebSocket({
    namespace: '/smartbot'
  });

  useEffect(() => {
    const handleIncoming = (data: any) => {
      addIncomingMessage({
        from: data.from,
        body: data.body,
        messageId: data.messageId,
        isGroup: data.isGroup,
        timestamp: new Date(data.timestamp)
      });
    };

    const handleReply = (data: any) => {
      addReply({
        to: data.to,
        trigger: data.trigger,
        response: data.response,
        timestamp: new Date(data.timestamp)
      });
    };

    const handleRuleUpdate = (data: any) => {
      updateRule(data.ruleId, data.action);
    };

    on('incoming', handleIncoming);
    on('reply', handleReply);
    on('rule-updated', handleRuleUpdate);

    return () => {
      off('incoming', handleIncoming);
      off('reply', handleReply);
      off('rule-updated', handleRuleUpdate);
    };
  }, [on, off, addIncomingMessage, addReply, updateRule]);

  return { isConnected };
}
```

---

### **📊 Connection Status Component:**

```typescript
// components/WebSocketStatus.tsx
'use client';

import { Badge } from 'primereact/badge';
import { useStatusWebSocket } from '@/hooks/useStatusWebSocket';

export function WebSocketStatus() {
  const { isConnected, latency } = useStatusWebSocket();

  return (
    <div className="flex align-items-center gap-2">
      <i 
        className={`pi ${isConnected ? 'pi-wifi' : 'pi-wifi-slash'}`}
        style={{ color: isConnected ? '#16a34a' : '#ef4444' }}
      />
      <Badge 
        value={isConnected ? `${latency}ms` : 'Offline'} 
        severity={isConnected ? 'success' : 'danger'}
      />
    </div>
  );
}
```

---

### **🔄 Auto-Reconnect Strategy:**

```typescript
// utils/websocket-reconnect.ts
export class WebSocketReconnectManager {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = Infinity;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;

  calculateDelay(): number {
    // Exponential backoff with jitter
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );
    
    const jitter = Math.random() * 1000;
    return delay + jitter;
  }

  onReconnectAttempt() {
    this.reconnectAttempts++;
    console.log(`Reconnect attempt ${this.reconnectAttempts}`);
  }

  onReconnectSuccess() {
    this.reconnectAttempts = 0;
    console.log('Reconnected successfully');
  }

  shouldReconnect(): boolean {
    return this.reconnectAttempts < this.maxReconnectAttempts;
  }
}
```

---

### **📝 الملفات المطلوبة:**

```
📁 packages/server/src/ws/
├── index.ts                    # WebSocket server setup
├── namespaces/
│   ├── status.ts               # /status namespace
│   ├── campaigns.ts            # /campaigns namespace
│   └── smartbot.ts             # /smartbot namespace
├── middleware/
│   ├── auth.ts                 # Socket authentication
│   └── rateLimit.ts            # Rate limiting per socket
└── utils/
    ├── backpressure.ts         # Backpressure queue
    └── heartbeat.ts            # Heartbeat monitoring

📁 dashboard/src/hooks/
├── useWebSocket.ts             # Base WebSocket hook
├── useStatusWebSocket.ts       # Status namespace hook
├── useCampaignsWebSocket.ts    # Campaigns namespace hook
└── useSmartBotWebSocket.ts     # SmartBot namespace hook

📁 dashboard/src/components/
└── WebSocketStatus.tsx         # Connection status indicator

📁 dashboard/src/utils/
└── websocket-reconnect.ts      # Reconnection manager
```

---

### **⚙️ Configuration:**

```typescript
// .env (Server)
WS_PORT=8080
WS_PING_INTERVAL=15000
WS_PING_TIMEOUT=10000
WS_MAX_BUFFER_SIZE=1048576
DASHBOARD_URL=http://localhost:3000

// .env (Dashboard)
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_WS_RECONNECT_DELAY=1000
NEXT_PUBLIC_WS_MAX_RECONNECT_DELAY=30000
```

---

### **🎯 Benefits (الفوائد):**

#### **1. Organization (التنظيم)**
- ✅ Namespaces منفصلة لكل feature
- ✅ Event isolation (لا تداخل بين الأحداث)
- ✅ Easier debugging

#### **2. Performance (الأداء)**
- ✅ Backpressure handling للحملات الكثيفة
- ✅ Message queuing
- ✅ Rate limiting per namespace

#### **3. Reliability (الموثوقية)**
- ✅ Auto-reconnect مع exponential backoff
- ✅ Heartbeat monitoring
- ✅ Connection status tracking
- ✅ Error recovery

#### **4. Developer Experience**
- ✅ Type-safe events
- ✅ Reusable hooks
- ✅ Clear separation of concerns
- ✅ Easy to test

---

### **🧪 Testing:**

```typescript
// tests/ws/status.test.ts
describe('Status Namespace', () => {
  it('should emit QR code on session.qr event', (done) => {
    const client = io('http://localhost:8080/status');
    
    client.on('qr', (data) => {
      expect(data).toHaveProperty('qr');
      expect(data).toHaveProperty('timestamp');
      client.disconnect();
      done();
    });
    
    // Trigger QR event from core
    eventBus.emit('session.qr', { qr: 'test_qr', timestamp: new Date() });
  });

  it('should handle heartbeat', (done) => {
    const client = io('http://localhost:8080/status');
    
    client.emit('ping');
    client.on('pong', (data) => {
      expect(data).toHaveProperty('timestamp');
      client.disconnect();
      done();
    });
  });
});
```

---

### **📈 Monitoring:**

```typescript
// ws/monitoring.ts
export class WebSocketMonitor {
  private connections = new Map<string, number>();
  
  trackConnection(namespace: string) {
    const count = this.connections.get(namespace) || 0;
    this.connections.set(namespace, count + 1);
  }
  
  trackDisconnection(namespace: string) {
    const count = this.connections.get(namespace) || 0;
    this.connections.set(namespace, Math.max(0, count - 1));
  }
  
  getStats() {
    return {
      total: Array.from(this.connections.values()).reduce((a, b) => a + b, 0),
      byNamespace: Object.fromEntries(this.connections)
    };
  }
}
```

---

## 🔄 **Migration Guide: من WebSocket الخام إلى Socket.IO**

### **🧭 المرحلة 1: فحص الـ WebSocket الحالي**

#### **📍 الهدف:**
معرفة:
- أين يبدأ تشغيل الـ WebSocket حالياً؟
- ما الـ events المفعلة؟
- ما نوع الاتصال بين backend وDashboard؟ (`ws://` أو `wss://`)

#### **🧩 خطوات الفحص:**

**1. ابحث عن WebSocket الخام في Backend:**

```bash
grep -R "WebSocket" runtime/server
grep -R "new Server" runtime/server
grep -R "ws" runtime/server
```

**إذا ظهر:**
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
```
→ يستخدم مكتبة `ws` الخام

**2. تحقق من منطق broadcast:**

```javascript
wss.on('connection', socket => {
  socket.on('message', data => { ... })
});

// Broadcast pattern
wss.clients.forEach(client => {
  client.send(JSON.stringify({ type: 'update', data: ... }))
});
```

**3. افحص الواجهة (Dashboard):**

```javascript
// dashboard/src/hooks/useWebSocket.js
const ws = new WebSocket(import.meta.env.VITE_WS_URL);
ws.onmessage = (msg) => { ... }
```

**4. تحقق من .env:**

```bash
VITE_WS_URL=ws://localhost:8080
```

#### **📋 الملخص بعد الفحص:**
- ✅ Backend = `ws` library
- ✅ Frontend = Native `WebSocket`
- ✅ الأحداث: `qr`, `status`, `campaign_update`
- ❌ لا يوجد heartbeat أو reconnect تلقائي

---

### **🔧 المرحلة 2: تحويل النظام إلى Socket.IO**

#### **⚙️ أولاً: تثبيت المكتبات**

**Backend:**
```bash
cd runtime/server
npm install socket.io
```

**Frontend (Dashboard):**
```bash
cd dashboard
npm install socket.io-client
```

#### **🏗️ ثانياً: تعديل السيرفر (Backend)**

**✳️ قبل (WebSocket الخام):**

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'welcome', data: 'Connected' }));
  
  socket.on('message', (data) => {
    const message = JSON.parse(data);
    // Handle message
  });
});
```

**✅ بعد (Socket.IO):**

```javascript
// runtime/server/index.js
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');

const io = new Server(httpServer, {
  path: '/ws',
  cors: {
    origin: process.env.DASHBOARD_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingInterval: 15000,      // Heartbeat every 15s
  pingTimeout: 30000,       // Timeout after 30s
  transports: ['websocket', 'polling']
});

// =============== Namespaces =================
const statusNS = io.of('/status');
const campaignsNS = io.of('/campaigns');
const smartbotNS = io.of('/smartbot');

// =============== Status Namespace ===========
statusNS.on('connection', (socket) => {
  console.log('🔌 Status client connected:', socket.id);

  // بث QR جديد
  socket.emit('qr', { qrCode: 'data:image/png;base64,...' });

  // بث الحالة
  socket.emit('status', { 
    state: 'ready',
    isConnected: true,
    phoneNumber: '971...'
  });

  // بث الإحصائيات
  socket.emit('stats', {
    totalMessages: 1234,
    totalCampaigns: 56,
    activeUsers: 12
  });

  socket.on('disconnect', (reason) => {
    console.log('⚠️ Client disconnected:', reason);
  });
});

// =============== Campaigns Namespace ========
campaignsNS.on('connection', (socket) => {
  console.log('📢 Campaign socket connected:', socket.id);

  socket.on('start_campaign', (payload) => {
    console.log('Received campaign start:', payload);
    
    // Emit progress updates
    socket.emit('campaign_progress', { 
      campaignId: payload.id,
      progress: 30,
      sent: 30,
      total: 100
    });
  });

  socket.on('pause_campaign', (payload) => {
    console.log('Pausing campaign:', payload.id);
    socket.emit('campaign_paused', { campaignId: payload.id });
  });
});

// =============== SmartBot Namespace =========
smartbotNS.on('connection', (socket) => {
  console.log('🤖 SmartBot socket connected:', socket.id);

  socket.on('test_rule', (payload) => {
    // Test SmartBot rule
    socket.emit('test_result', {
      matches: [...],
      confidence: 0.85
    });
  });
});

// =============== Authentication Middleware ==
io.use((socket, next) => {
  const apiKey = socket.handshake.auth?.key;
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
});

// =============== Connection Monitoring ======
io.engine.on('connection_error', (err) => {
  console.error('❌ Connection error:', err.code, err.message);
});

setInterval(() => {
  console.log('🧩 Active connections:', {
    status: statusNS.sockets.size,
    campaigns: campaignsNS.sockets.size,
    smartbot: smartbotNS.sockets.size
  });
}, 30000);

// =============== Start Server ===============
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
```

#### **🧩 ثالثاً: تحديث WebSocket Client في Dashboard**

**✳️ قبل (WebSocket الخام):**

```javascript
// dashboard/src/hooks/useWebSocket.js
const ws = new WebSocket(import.meta.env.VITE_WS_URL);

ws.onopen = () => console.log('Connected');
ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if (data.type === 'qr') setQr(data.qrCode);
  if (data.type === 'status') setStatus(data.state);
};
ws.onerror = (err) => console.error(err);
ws.onclose = () => console.log('Disconnected');
```

**✅ بعد (Socket.IO Client):**

```typescript
// dashboard/src/hooks/useStatusWebSocket.ts
import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useStatusWebSocket() {
  const { setQrCode, setSessionStatus, setStats } = useAppStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create connection
    const socket = io(`${import.meta.env.VITE_WS_URL}/status`, {
      path: '/ws',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      auth: {
        key: import.meta.env.VITE_API_KEY
      }
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Connected to /status namespace');
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from /status:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
    });

    // Data events
    socket.on('qr', (data) => {
      console.log('📱 QR Code received');
      setQrCode(data.qrCode);
    });

    socket.on('status', (data) => {
      console.log('📊 Status update:', data.state);
      setSessionStatus(data);
    });

    socket.on('stats', (data) => {
      console.log('📈 Stats update:', data);
      setStats(data);
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}
```

**Campaigns WebSocket Hook:**

```typescript
// dashboard/src/hooks/useCampaignsWebSocket.ts
import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { useCampaignStore } from '../store/useCampaignStore';

export function useCampaignsWebSocket() {
  const { updateCampaignProgress, setCampaignStatus } = useCampaignStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_WS_URL}/campaigns`, {
      path: '/ws',
      transports: ['websocket'],
      reconnection: true,
      auth: {
        key: import.meta.env.VITE_API_KEY
      }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to /campaigns namespace');
    });

    socket.on('campaign_progress', (data) => {
      updateCampaignProgress(data.campaignId, data);
    });

    socket.on('campaign_completed', (data) => {
      setCampaignStatus(data.campaignId, 'completed');
    });

    socket.on('campaign_paused', (data) => {
      setCampaignStatus(data.campaignId, 'paused');
    });

    socket.on('campaign_failed', (data) => {
      setCampaignStatus(data.campaignId, 'failed');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Helper functions
  const startCampaign = (campaignId: string) => {
    socketRef.current?.emit('start_campaign', { id: campaignId });
  };

  const pauseCampaign = (campaignId: string) => {
    socketRef.current?.emit('pause_campaign', { id: campaignId });
  };

  return {
    socket: socketRef.current,
    startCampaign,
    pauseCampaign
  };
}
```

**Update .env:**

```bash
# Before
VITE_WS_URL=ws://localhost:8080

# After
VITE_WS_URL=http://localhost:8080
VITE_API_KEY=your_secret_api_key_here
```

**Note:** Socket.IO يستخدم `http://` وليس `ws://` لأن البروتوكول يُدار تلقائياً.

---

### **🧪 المرحلة 3: اختبار التشغيل والمراقبة**

#### **✅ 1) تشغيل السيرفر**

```bash
cd runtime/server
node index.js
```

**Expected output:**
```
🚀 Server listening on port 8080
🔌 Status client connected: abc123
📢 Campaign socket connected: def456
```

#### **✅ 2) تشغيل Dashboard**

```bash
cd dashboard
npm run dev
```

**Browser Console:**
```
✅ Connected to /status namespace
✅ Connected to /campaigns namespace
📱 QR Code received
📊 Status update: ready
```

#### **✅ 3) اختبار Auto-Reconnect**

1. أوقف السيرفر (`Ctrl+C`)
2. راقب Dashboard console:
   ```
   ⚠️ Disconnected from /status: transport close
   🔄 Trying to reconnect... attempt 1
   🔄 Trying to reconnect... attempt 2
   ```
3. شغل السيرفر مرة أخرى
4. يجب أن ترى:
   ```
   ✅ Connected to /status namespace
   ```

#### **✅ 4) اختبار مراقبة الاتصالات**

**Add to backend:**

```javascript
// Monitor connections every 10 seconds
setInterval(() => {
  const stats = {
    status: statusNS.sockets.size,
    campaigns: campaignsNS.sockets.size,
    smartbot: smartbotNS.sockets.size,
    total: io.engine.clientsCount
  };
  
  console.log('🧩 Active connections:', stats);
}, 10000);

// Log connection errors
io.engine.on('connection_error', (err) => {
  console.error('❌ Connection error:', {
    code: err.code,
    message: err.message,
    context: err.context
  });
});
```

---

### **🧠 المرحلة 4: التوسعة والتحسين**

#### **1. Custom Heartbeat:**

```javascript
// runtime/server/ws/heartbeat.js
export function setupHeartbeat(io) {
  io.on('connection', (socket) => {
    let heartbeatInterval;

    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    heartbeatInterval = setInterval(() => {
      socket.emit('heartbeat', { timestamp: Date.now() });
    }, 15000);

    socket.on('disconnect', () => {
      clearInterval(heartbeatInterval);
    });
  });
}
```

#### **2. Auth Middleware:**

```javascript
// runtime/server/middleware/wsAuth.js
export function wsAuthMiddleware(socket, next) {
  const apiKey = socket.handshake.auth?.key;
  const token = socket.handshake.auth?.token;

  // Verify API Key
  if (apiKey === process.env.API_KEY) {
    return next();
  }

  // Verify JWT Token
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  }

  next(new Error('Unauthorized'));
}

// Usage
io.use(wsAuthMiddleware);
```

#### **3. Logging & Metrics:**

```javascript
// runtime/server/utils/wsLogger.js
export class WebSocketLogger {
  constructor() {
    this.metrics = {
      connections: 0,
      disconnections: 0,
      messages: 0,
      errors: 0
    };
  }

  logConnection(namespace, socketId) {
    this.metrics.connections++;
    console.log(`[${new Date().toISOString()}] 🔌 Connection: ${namespace} - ${socketId}`);
  }

  logDisconnection(namespace, socketId, reason) {
    this.metrics.disconnections++;
    console.log(`[${new Date().toISOString()}] ⚠️ Disconnection: ${namespace} - ${socketId} - ${reason}`);
  }

  logMessage(namespace, event, data) {
    this.metrics.messages++;
    console.log(`[${new Date().toISOString()}] 📨 Message: ${namespace}/${event}`, data);
  }

  logError(error) {
    this.metrics.errors++;
    console.error(`[${new Date().toISOString()}] ❌ Error:`, error);
  }

  getMetrics() {
    return {
      ...this.metrics,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
```

#### **4. Redis Adapter (للـ Multi-Instance):**

```bash
npm install @socket.io/redis-adapter redis
```

```javascript
// runtime/server/index.js
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log('✅ Redis adapter connected');
});
```

---

### **🔒 نصائح أمنية**

#### **1. Rate Limiting:**

```javascript
import rateLimit from 'socket.io-rate-limit';

io.use(rateLimit({
  tokensPerInterval: 100,
  interval: 60000, // 1 minute
  fireImmediately: true
}));
```

#### **2. Message Validation:**

```javascript
socket.on('start_campaign', (payload) => {
  // Validate payload
  if (!payload.id || typeof payload.id !== 'string') {
    socket.emit('error', { message: 'Invalid campaign ID' });
    return;
  }

  // Sanitize input
  const sanitizedId = payload.id.trim();
  
  // Process...
});
```

#### **3. CORS Configuration:**

```javascript
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://yourdomain.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Authorization']
  }
});
```

---

### **🏁 الخلاصة**

| العنصر | قبل (WebSocket الخام) | بعد (Socket.IO) |
|--------|----------------------|-----------------|
| **اتصال ثابت** | ❌ يتطلب إعادة اتصال يدوية | ✅ Auto-reconnect |
| **Namespaces** | ❌ غير مدعوم | ✅ `/status`, `/campaigns`, `/smartbot` |
| **Heartbeat** | ❌ يدوي | ✅ تلقائي (15s) |
| **Error Handling** | ❌ محدود | ✅ شامل مع retry |
| **Scalability** | ❌ صعب | ✅ Redis adapter |
| **Authentication** | ❌ يدوي | ✅ Middleware built-in |
| **Monitoring** | ❌ محدود | ✅ Metrics + Logging |
| **Browser Support** | ⚠️ WebSocket فقط | ✅ WebSocket + Polling fallback |

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

**جاهز للبدء! 🚀**
