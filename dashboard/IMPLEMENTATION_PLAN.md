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

### **المرحلة 3️⃣: إنشاء صفحة About**

#### **المطلوب:**
- [ ] إنشاء `/app/(main)/about/page.tsx`
- [ ] معلومات عن النظام (WaQtor)
- [ ] Documentation links
- [ ] FAQ section
- [ ] تعليمات الاستخدام
- [ ] معلومات الإصدار
- [ ] روابط الدعم

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

## 🏗️ **المرحلة 8️⃣: Architecture Evolution - من Monolith إلى Modular Microkernel**

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

**جاهز للبدء! 🚀**
