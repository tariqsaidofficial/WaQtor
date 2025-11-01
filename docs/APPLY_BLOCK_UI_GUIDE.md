# 🚀 دليل تطبيق Block UI على الصفحات المتبقية

## 📋 الصفحات المطلوب حمايتها

- [ ] SmartBot
- [ ] Webhooks  
- [ ] Admin Statistics
- [ ] Admin Logs
- [ ] Settings (نقل إلى Admin Section)

## 1️⃣ SmartBot Page

### الموقع الحالي
```
dashboard/src/app/(main)/smartbot/page.tsx
```

### التطبيق

إذا كان الملف موجود، قم بتحديثه:

```tsx
'use client';

import SmartBot from '../../SmartBot'; // أو المسار الصحيح
import ProtectedPage from '../../../components/BlockUI/ProtectedPage';

export default function SmartBotPage() {
    return (
        <ProtectedPage featureName="SmartBot">
            <SmartBot />
        </ProtectedPage>
    );
}
```

إذا لم يكن موجود، أنشئه في المسار المذكور.

## 2️⃣ Webhooks Page

### الموقع الحالي
```
dashboard/src/app/(main)/webhooks/page.tsx
```

### التطبيق

```tsx
'use client';

import Webhooks from '../../Webhooks'; // أو المسار الصحيح
import ProtectedPage from '../../../components/BlockUI/ProtectedPage';

export default function WebhooksPage() {
    return (
        <ProtectedPage featureName="Webhooks">
            <Webhooks />
        </ProtectedPage>
    );
}
```

## 3️⃣ Admin Statistics

### الموقع الجديد
```
dashboard/src/app/(main)/admin/statistics/page.tsx
```

### التطبيق

```tsx
'use client';

import AdminStatistics from '../../../AdminStatistics'; // أو المسار الصحيح
import ProtectedPage from '../../../../components/BlockUI/ProtectedPage';

export default function AdminStatisticsPage() {
    return (
        <ProtectedPage featureName="Admin Statistics">
            <AdminStatistics />
        </ProtectedPage>
    );
}
```

## 4️⃣ Admin Logs

### الموقع الجديد
```
dashboard/src/app/(main)/admin/logs/page.tsx
```

### التطبيق

```tsx
'use client';

import AdminLogs from '../../../AdminLogs'; // أو المسار الصحيح
import ProtectedPage from '../../../../components/BlockUI/ProtectedPage';

export default function AdminLogsPage() {
    return (
        <ProtectedPage featureName="Admin Logs">
            <AdminLogs />
        </ProtectedPage>
    );
}
```

## 5️⃣ Settings (نقل إلى Admin)

### من
```
dashboard/src/app/(main)/settings/page.tsx
```

### إلى
```
dashboard/src/app/(main)/admin/settings/page.tsx
```

### التطبيق

```tsx
'use client';

import Settings from '../../../Settings'; // أو المسار الصحيح
import ProtectedPage from '../../../../components/BlockUI/ProtectedPage';

export default function AdminSettingsPage() {
    return (
        <ProtectedPage featureName="Admin Settings">
            <Settings />
        </ProtectedPage>
    );
}
```

### تحديث Navigation

في ملف الـ Sidebar/Navigation، قم بتحديث رابط Settings:

```tsx
// من
{ label: 'Settings', icon: 'pi pi-cog', to: '/settings' }

// إلى
{ label: 'Settings', icon: 'pi pi-cog', to: '/admin/settings' }
```

## 🔧 خطوات التطبيق

### 1. تحديث Backend

تأكد من إضافة الـ Features في script الأكواد الافتراضية:

```javascript
// runtime/server/scripts/create-default-access-codes.js

const FEATURES = [
    'Campaigns',
    'Reports',
    'Interactive Messages',
    'SmartBot',           // ✅ موجود
    'Webhooks',           // ✅ موجود
    'Admin Statistics',   // ✅ موجود
    'Admin Logs',         // ✅ موجود
    'Admin Settings'      // ⚠️ أضف هذا
];
```

### 2. إنشاء الأكواد

```bash
node runtime/server/scripts/create-default-access-codes.js
```

### 3. تطبيق على كل صفحة

اتبع الأمثلة أعلاه لكل صفحة.

### 4. اختبار

لكل صفحة:
1. افتح الصفحة
2. يجب أن ترى Block UI
3. أدخل الكود: `330022`
4. يجب أن تُفتح الصفحة

## 📝 Template سريع

استخدم هذا Template لأي صفحة جديدة:

```tsx
'use client';

import YourComponent from 'path/to/component';
import ProtectedPage from 'path/to/BlockUI/ProtectedPage';

export default function YourPage() {
    return (
        <ProtectedPage featureName="Your Feature Name">
            <YourComponent />
        </ProtectedPage>
    );
}
```

## ⚠️ ملاحظات مهمة

### Feature Names
يجب أن تكون **متطابقة تماماً** في:
- Frontend (ProtectedPage)
- Backend (create-default-access-codes.js)
- Database (feature_subscriptions table)

### Case Sensitive
الأسماء حساسة لحالة الأحرف:
- ✅ "SmartBot"
- ❌ "smartbot"
- ❌ "Smartbot"

### Spaces
انتبه للمسافات:
- ✅ "Admin Statistics"
- ❌ "AdminStatistics"
- ❌ "Admin  Statistics" (مسافتين)

## 🎯 Checklist

بعد تطبيق كل صفحة، تأكد من:

- [ ] الملف في المسار الصحيح
- [ ] import ProtectedPage صحيح
- [ ] featureName مطابق للـ Backend
- [ ] Component الأصلي يعمل داخل ProtectedPage
- [ ] الكود 330022 يفتح الصفحة
- [ ] Loading state يظهر بشكل صحيح
- [ ] Block UI يظهر للمستخدمين غير المشتركين

## 🔍 التحقق

### Frontend
```bash
# تأكد من عدم وجود أخطاء
npm run dev
```

### Backend
```bash
# تحقق من الـ logs
tail -f runtime/server/logs/combined.log
```

### Database
```sql
-- تحقق من الأكواد
SELECT * FROM access_codes;

-- تحقق من الاشتراكات
SELECT * FROM feature_subscriptions;

-- تحقق من الـ logs
SELECT * FROM feature_access_logs ORDER BY "createdAt" DESC LIMIT 10;
```

## 🐛 مشاكل شائعة

### المشكلة: Component لا يظهر
**الحل**: تأكد من المسار الصحيح للـ import

### المشكلة: الكود لا يعمل
**الحل**: تأكد من Feature Name متطابق

### المشكلة: Loading لا ينتهي
**الحل**: تحقق من:
1. Backend يعمل
2. Token موجود في localStorage
3. API endpoint صحيح

### المشكلة: "Please login first"
**الحل**: تأكد من تسجيل الدخول أولاً

## 📊 Progress Tracking

استخدم هذا الجدول لتتبع التقدم:

| Feature | Status | Tested | Notes |
|---------|--------|--------|-------|
| SmartBot | 🔄 | ⬜ | |
| Webhooks | 🔄 | ⬜ | |
| Admin Statistics | 🔄 | ⬜ | |
| Admin Logs | 🔄 | ⬜ | |
| Admin Settings | 🔄 | ⬜ | Move from /settings |

Legend:
- 🔄 In Progress
- ✅ Completed
- ⬜ Not Tested
- ✔️ Tested & Working

## 🎉 بعد الانتهاء

1. اختبر جميع الصفحات
2. تأكد من Analytics تعمل
3. راجع الـ Access Logs
4. وثّق أي تغييرات إضافية
5. Update IMPLEMENTATION_PLAN.md

---

**الكود الافتراضي**: `330022`  
**Type**: Lifetime  
**Max Uses**: Unlimited
