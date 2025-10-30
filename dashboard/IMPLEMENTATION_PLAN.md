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

**جاهز للبدء! 🚀**
