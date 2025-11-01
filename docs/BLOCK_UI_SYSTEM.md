# 🔐 Block UI System - Complete Documentation

## 📋 Overview

نظام حماية شامل للـ Premium Features مع Backend Integration كامل، تشفير الأكواد، وتتبع الاستخدام.

## 🏗️ Architecture

### Backend Components

#### 1. Database Models

**FeatureSubscription** (`models/FeatureSubscription.js`)
- إدارة اشتراكات المستخدمين للـ Features
- دعم أنواع مختلفة: `free`, `premium`, `enterprise`, `lifetime`
- حالات: `active`, `expired`, `trial`, `suspended`
- تتبع الاستخدام والحدود

**AccessCode** (`models/AccessCode.js`)
- تخزين أكواد الوصول المشفرة (SHA-256)
- دعم 6 أرقام
- حد أقصى للاستخدام وتاريخ انتهاء
- ربط بالـ Admin الذي أنشأ الكود

**FeatureAccessLog** (`models/FeatureAccessLog.js`)
- تسجيل جميع محاولات الوصول
- Analytics للـ Features
- تتبع IP و User Agent
- أنواع الوصول: `view`, `unlock_attempt`, `unlock_success`, `unlock_failed`, `usage`

#### 2. Services

**SubscriptionService** (`services/subscriptionService.js`)
- `checkFeatureAccess()` - التحقق من صلاحية الوصول
- `verifyAccessCode()` - التحقق من الكود وتفعيل الاشتراك
- `startTrial()` - بدء فترة تجريبية
- `incrementUsage()` - زيادة عداد الاستخدام
- `logAccess()` - تسجيل محاولات الوصول
- `getFeatureAnalytics()` - إحصائيات الاستخدام

#### 3. API Endpoints

**User Endpoints** (JWT Required)
```
GET  /api/subscriptions/check/:featureName
POST /api/subscriptions/verify-code
POST /api/subscriptions/start-trial
GET  /api/subscriptions/my-subscriptions
POST /api/subscriptions/increment-usage
```

**Admin Endpoints** (Admin Role Required)
```
POST /api/subscriptions/admin/create-code
GET  /api/subscriptions/admin/codes
GET  /api/subscriptions/admin/analytics/:featureName
```

### Frontend Components

#### 1. ProtectedPage Component

**Location**: `dashboard/src/components/BlockUI/ProtectedPage.tsx`

**Features**:
- ✅ Backend Integration كامل
- ✅ Loading state أثناء التحقق
- ✅ رسائل مخصصة حسب حالة الاشتراك
- ✅ Auto-refresh عند التفعيل

**Usage**:
```tsx
<ProtectedPage featureName="Campaigns">
    <YourComponent />
</ProtectedPage>
```

#### 2. OtpDialog Component

**Location**: `dashboard/src/components/BlockUI/OtpDialog.tsx`

**Features**:
- ✅ دعم 6 أرقام
- ✅ Async verification مع Backend
- ✅ Error handling محسّن
- ✅ Loading state

## 🔑 Access Code System

### Default Code

**Code**: `330022`
- Type: Lifetime
- Max Uses: Unlimited
- Expires: Never
- Features: All Premium Features

### Creating Default Codes

```bash
node runtime/server/scripts/create-default-access-codes.js
```

### Creating Custom Codes (Admin API)

```bash
POST /api/subscriptions/admin/create-code
Authorization: Bearer <admin_token>

{
  "code": "123456",
  "featureName": "Campaigns",
  "subscriptionType": "premium",
  "durationDays": 30,
  "maxUses": 100,
  "expiresAt": "2025-12-31"
}
```

## 🎯 Protected Features

### Currently Protected

1. ✅ **Campaigns** - `/campaigns`
2. ✅ **Reports** - `/reports`
3. ✅ **Interactive Messages** - `/interactive`

### To Be Protected

4. 🔄 **SmartBot** - `/smartbot`
5. 🔄 **Webhooks** - `/webhooks`
6. 🔄 **Admin Statistics** - `/admin/statistics`
7. 🔄 **Admin Logs** - `/admin/logs`
8. 🔄 **Settings** - Move to `/admin/settings`

## 📊 Subscription Types

### Free Tier
- Trial period: 7 days
- Usage limits
- Basic features

### Premium
- Duration-based (30/90/365 days)
- No usage limits
- All features

### Enterprise
- Custom duration
- Priority support
- Custom features

### Lifetime
- No expiration
- Unlimited usage
- All features forever

## 🔒 Security Features

### Code Encryption
- SHA-256 hashing
- No plain text storage
- Secure verification

### Access Logging
- All attempts logged
- IP tracking
- User agent tracking
- Analytics ready

### Rate Limiting
- API rate limits
- Brute force protection
- Usage tracking

## 📈 Analytics

### Feature Analytics

```bash
GET /api/subscriptions/admin/analytics/Campaigns?startDate=2025-01-01&endDate=2025-12-31
```

**Returns**:
- View count
- Unlock attempts (success/failed)
- Usage statistics
- Grouped by access type and status

### Access Logs

All access attempts are logged with:
- User ID
- Feature name
- Access type
- Status (allowed/blocked)
- IP address
- User agent
- Timestamp

## 🚀 Implementation Steps

### Step 1: Database Setup

```bash
# Database will auto-create tables on server start
npm start
```

### Step 2: Create Default Codes

```bash
node runtime/server/scripts/create-default-access-codes.js
```

### Step 3: Apply to New Pages

```tsx
// Example: SmartBot page
import ProtectedPage from '../../../components/BlockUI/ProtectedPage';

export default function SmartBotPage() {
    return (
        <ProtectedPage featureName="SmartBot">
            <SmartBotComponent />
        </ProtectedPage>
    );
}
```

### Step 4: Test

1. Login to dashboard
2. Navigate to protected page
3. Should see Block UI
4. Enter code: `330022`
5. Feature unlocked!

## 🔧 Configuration

### Environment Variables

```env
# Database (already configured)
DATABASE_URL=postgresql://...

# JWT (already configured)
JWT_SECRET=your_secret_key
```

### Feature Names

Must match exactly in both frontend and backend:
- "Campaigns"
- "Reports"
- "Interactive Messages"
- "SmartBot"
- "Webhooks"
- "Admin Statistics"
- "Admin Logs"

## 📝 API Examples

### Check Access

```javascript
const response = await axios.get(
    'http://localhost:8080/api/subscriptions/check/Campaigns',
    {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
);

// Response:
{
    "success": true,
    "hasAccess": false,
    "status": "no_subscription",
    "canStartTrial": true
}
```

### Verify Code

```javascript
const response = await axios.post(
    'http://localhost:8080/api/subscriptions/verify-code',
    {
        code: '330022',
        featureName: 'Campaigns'
    },
    {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
);

// Response:
{
    "success": true,
    "message": "Access code verified successfully",
    "subscription": { ... }
}
```

### Start Trial

```javascript
const response = await axios.post(
    'http://localhost:8080/api/subscriptions/start-trial',
    {
        featureName: 'Campaigns',
        trialDays: 7
    },
    {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
);
```

## 🎨 UI States

### Loading
- Shows spinner while checking access
- Prevents flickering

### Blocked
- Lock icon
- Feature name
- Status-specific message
- "Subscribe Now" button
- "Enter Access Code" button

### Active (Trial)
- Full access
- Trial badge (optional)
- Days remaining indicator (optional)

### Active (Premium)
- Full access
- No restrictions

### Expired
- Blocked with expiration message
- Renewal options

## 🔄 Migration from localStorage

Old system:
```javascript
localStorage.getItem('subscription_Campaigns')
```

New system:
```javascript
// Automatic - handled by ProtectedPage
// Checks backend on mount
// No localStorage needed
```

## 📊 Database Schema

### feature_subscriptions
```sql
- id (PK)
- userId (FK -> users.id)
- featureName
- status (active/expired/trial/suspended)
- subscriptionType (free/premium/enterprise/lifetime)
- startDate
- endDate
- trialEndDate
- usageLimit
- usageCount
- metadata (JSONB)
- createdAt, updatedAt
```

### access_codes
```sql
- id (PK)
- featureName
- codeHash (SHA-256)
- isActive
- maxUses
- usedCount
- expiresAt
- subscriptionType
- durationDays
- createdBy (FK -> users.id)
- metadata (JSONB)
- createdAt, updatedAt
```

### feature_access_logs
```sql
- id (PK)
- userId (FK -> users.id)
- featureName
- accessType (view/unlock_attempt/unlock_success/unlock_failed/usage)
- status (allowed/blocked/trial/expired)
- accessCodeUsed
- ipAddress
- userAgent
- metadata (JSONB)
- createdAt
```

## 🎯 Next Steps

1. ✅ Database models created
2. ✅ Backend API implemented
3. ✅ Frontend components updated
4. ✅ 6-digit code support
5. ✅ Encryption implemented
6. 🔄 Apply to remaining pages
7. 🔄 Move Settings to Admin
8. 🔄 Add trial period UI
9. 🔄 Add usage limit indicators
10. 🔄 Admin dashboard for code management

## 🐛 Troubleshooting

### Issue: "Please login first"
**Solution**: Ensure JWT token is in localStorage

### Issue: Code not working
**Solution**: 
1. Check code is 6 digits
2. Verify feature name matches exactly
3. Check code hasn't expired
4. Verify max uses not reached

### Issue: Access denied after unlock
**Solution**: Refresh the page or check backend logs

## 📞 Support

For issues or questions:
1. Check backend logs: `runtime/server/logs/`
2. Check database: `feature_subscriptions` table
3. Verify API responses in browser DevTools
4. Check access logs: `feature_access_logs` table

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-01  
**Status**: ✅ Production Ready
