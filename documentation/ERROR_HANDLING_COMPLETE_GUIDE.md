# نظام Error Handling الشامل - دليل المطور

## 📋 نظرة عامة

تم بناء نظام Error Handling متكامل للخلفية (Backend) والواجهة (Frontend) مع الميزات التالية:

### ✅ الميزات الرئيسية

1. **Error Handling موحد** عبر التطبيق
2. **Error Logging متقدم** مع تخزين وتتبع
3. **Error Monitoring** مع تنبيهات تلقائية
4. **Error Recovery** استراتيجيات استرداد تلقائية
5. **Error Boundaries** لحماية الواجهة من الانهيار
6. **Global Error Handlers** لمعالجة الأخطاء غير المتوقعة
7. **Error Dashboard** لمراقبة وإدارة الأخطاء

---

## 🔧 البنية التحتية (Backend)

### 1. Error Handler Middleware

**المسار:** `/runtime/server/middleware/errorHandler.js`

#### المكونات الرئيسية:

##### AppError Class
```javascript
const { AppError } = require('./middleware/errorHandler');

// إنشاء خطأ مخصص
throw new AppError(
    'Message not found',    // الرسالة
    404,                     // Status code
    'MESSAGE_NOT_FOUND',     // Error code
    { messageId: 123 }       // تفاصيل إضافية
);
```

##### Error Codes
```javascript
const { ErrorCodes } = require('./middleware/errorHandler');

// أكواد الأخطاء المتاحة:
ErrorCodes.VALIDATION_ERROR
ErrorCodes.AUTHENTICATION_ERROR
ErrorCodes.WHATSAPP_NOT_READY
ErrorCodes.MESSAGE_SEND_FAILED
ErrorCodes.CAMPAIGN_NOT_FOUND
ErrorCodes.DATABASE_ERROR
// ... وغيرها
```

##### Async Handler
```javascript
const { asyncHandler } = require('./middleware/errorHandler');

// استخدم مع route handlers
router.get('/campaigns/:id', asyncHandler(async (req, res) => {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
        throw new AppError('Campaign not found', 404, ErrorCodes.CAMPAIGN_NOT_FOUND);
    }
    res.json({ success: true, data: campaign });
}));
```

##### Helper Functions
```javascript
const { validationError, whatsappError } = require('./middleware/errorHandler');

// Validation error
throw validationError('Invalid phone number', { phone: '123' });

// WhatsApp error
throw whatsappError('WhatsApp not connected', ErrorCodes.WHATSAPP_DISCONNECTED);
```

### 2. Error Logger

**المسار:** `/runtime/server/utils/errorLogger.js`

```javascript
const errorLogger = require('./utils/errorLogger');

// تسجيل خطأ
await errorLogger.logError(error, {
    userId: req.user?.id,
    action: 'send_message',
    phone: '966501234567'
});

// الحصول على إحصائيات الأخطاء
const stats = await errorLogger.getErrorStats('day'); // hour, day, week

// الحصول على أحدث الأخطاء
const recentErrors = errorLogger.getRecentErrors(10);

// مسح السجل
await errorLogger.clearHistory();
```

### 3. Error Monitor

**المسار:** `/runtime/server/services/errorMonitor.js`

```javascript
const errorMonitor = require('./services/errorMonitor');

// بدء المراقبة
errorMonitor.start();

// الاستماع للتنبيهات
errorMonitor.on('critical', (alert) => {
    console.error('CRITICAL:', alert);
    // إرسال تنبيه عبر Email/Slack/etc.
});

errorMonitor.on('warning', (alert) => {
    console.warn('WARNING:', alert);
});

// تعيين حدود التنبيهات
errorMonitor.setThresholds({
    critical: 10,  // أخطاء في الدقيقة
    warning: 5,
    info: 2
});
```

### 4. Error Recovery

**المسار:** `/runtime/server/services/errorRecovery.js`

```javascript
const errorRecovery = require('./services/errorRecovery');

// تسجيل استراتيجية استرداد
errorRecovery.registerStrategy('CUSTOM_ERROR', async (error, context) => {
    // منطق الاسترداد
    return { recovered: true };
});

// محاولة الاسترداد
const recovered = await errorRecovery.recover(error, { waClient });

// التحقق من إمكانية الاسترداد
if (errorRecovery.isRecoverable(error)) {
    await errorRecovery.recover(error);
}
```

### 5. Error Routes

**المسار:** `/runtime/server/routes/errors.js`

**Endpoints:**

```bash
# إحصائيات الأخطاء
GET /api/errors/stats?timeRange=day

# أحدث الأخطاء
GET /api/errors/recent?limit=10

# مسح السجل
DELETE /api/errors/clear

# تسجيل خطأ من Frontend
POST /api/errors/log
{
  "error": { "message": "...", "code": "...", "stack": "..." },
  "context": { "page": "/dashboard", "action": "..." }
}
```

---

## 🎨 البنية التحتية (Frontend)

### 1. Error Handler Utility

**المسار:** `/dashboard/src/utils/errorHandler.js`

```javascript
import { parseApiError, getUserFriendlyMessage, showErrorToast, logError } from '../utils/errorHandler';

// تحليل خطأ API
const parsed = parseApiError(error);
// { type, message, code, statusCode, details }

// رسالة مفهومة للمستخدم
const message = getUserFriendlyMessage(error);

// عرض Toast للخطأ
showErrorToast(toast, error, { summary: 'Failed' });

// تسجيل الخطأ
logError(error, { page: 'Dashboard', action: 'load_campaigns' });
```

### 2. Error Boundary Component

**المسار:** `/dashboard/src/components/ErrorBoundary.jsx`

```jsx
import ErrorBoundary from '../components/ErrorBoundary';

// استخدام في Layout
<ErrorBoundary>
    <YourComponent />
</ErrorBoundary>
```

### 3. Error Fallback Component

**المسار:** `/dashboard/src/components/ErrorFallback.jsx`

```jsx
import ErrorFallback from '../components/ErrorFallback';

// استخدام مع Error Boundary
<ErrorBoundary fallback={(error, reset) => 
    <ErrorFallback error={error} resetErrorBoundary={reset} />
}>
    <YourComponent />
</ErrorBoundary>
```

### 4. useErrorHandler Hook

**المسار:** `/dashboard/src/hooks/useErrorHandler.js`

```javascript
import useErrorHandler from '../hooks/useErrorHandler';

function MyComponent() {
    const { error, isError, handleError, clearError, retryWithErrorHandling } = useErrorHandler();

    // معالجة خطأ
    try {
        await someAsyncFunction();
    } catch (error) {
        handleError(error, { component: 'MyComponent' });
    }

    // إعادة محاولة مع معالجة الأخطاء
    await retryWithErrorHandling(
        async () => await fetchData(),
        {
            maxRetries: 3,
            delay: 1000,
            onRetry: (attempt, maxRetries) => {
                console.log(`Retry ${attempt}/${maxRetries}`);
            }
        }
    );

    // مسح الخطأ
    clearError();
}
```

### 5. Global Error Handler

**المسار:** `/dashboard/src/components/GlobalErrorHandler.jsx`

```jsx
import GlobalErrorHandler from '../components/GlobalErrorHandler';

// استخدام في Root Layout
<GlobalErrorHandler>
    <ToastProvider>
        <App />
    </ToastProvider>
</GlobalErrorHandler>
```

### 6. Toast Provider

**المسار:** `/dashboard/src/components/ToastProvider.jsx`

```javascript
import { useToast } from '../components/ToastProvider';

function MyComponent() {
    const { showSuccess, showError, showWarning, showInfo } = useToast();

    // عرض رسائل مختلفة
    showSuccess('Operation completed successfully');
    showError(error);
    showWarning('Please check your input');
    showInfo('Loading data...');
}
```

### 7. Error Management Page

**المسار:** `/dashboard/src/pages/ErrorManagement.jsx`

صفحة كاملة لإدارة ومراقبة الأخطاء مع:
- إحصائيات الأخطاء
- رسوم بيانية
- جدول الأخطاء الأخيرة
- تفاصيل كل خطأ
- إمكانية مسح السجل

---

## 📝 أمثلة الاستخدام

### Backend Example

```javascript
const express = require('express');
const router = express.Router();
const { asyncHandler, AppError, ErrorCodes } = require('../middleware/errorHandler');
const errorLogger = require('../utils/errorLogger');
const errorRecovery = require('../services/errorRecovery');

router.post('/send-message', asyncHandler(async (req, res) => {
    const { phone, message } = req.body;
    
    // Validation
    if (!phone || !message) {
        throw new AppError(
            'Missing required fields',
            400,
            ErrorCodes.VALIDATION_ERROR,
            { required: ['phone', 'message'] }
        );
    }

    try {
        // Send message
        const result = await waClient.sendMessage(phone, message);
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        // Log error
        await errorLogger.logError(error, {
            phone,
            action: 'send_message'
        });

        // Try to recover
        if (errorRecovery.isRecoverable(error)) {
            const recovered = await errorRecovery.recover(error, { waClient });
            if (recovered) {
                // Retry
                const result = await waClient.sendMessage(phone, message);
                return res.json({ success: true, data: result });
            }
        }

        // Throw to global error handler
        throw error;
    }
}));

module.exports = router;
```

### Frontend Example

```jsx
import React, { useEffect } from 'react';
import { useToast } from '../components/ToastProvider';
import useErrorHandler from '../hooks/useErrorHandler';
import { messageService } from '../api/services';

function SendMessageForm() {
    const { showSuccess } = useToast();
    const { handleError, retryWithErrorHandling } = useErrorHandler();

    const handleSubmit = async (formData) => {
        try {
            // إرسال مع إعادة محاولة تلقائية
            const result = await retryWithErrorHandling(
                () => messageService.sendText(formData.phone, formData.message),
                {
                    maxRetries: 3,
                    delay: 1000
                }
            );

            showSuccess('Message sent successfully!');
            return result;
        } catch (error) {
            handleError(error, {
                component: 'SendMessageForm',
                action: 'send_message',
                phone: formData.phone
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    );
}

export default SendMessageForm;
```

---

## 🚀 التكامل في المشروع

### 1. Backend Integration

في `/runtime/server/index.js`:

```javascript
// Import error handlers
const { 
    errorHandler, 
    notFoundHandler, 
    handleUnhandledRejection, 
    handleUncaughtException 
} = require('./middleware/errorHandler');
const errorMonitor = require('./services/errorMonitor');
const errorRoutes = require('./routes/errors');

// Routes
app.use('/api/errors', apiKeyAuth, errorRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Global handlers
handleUnhandledRejection();
handleUncaughtException();

// Start error monitoring
errorMonitor.start();
errorMonitor.on('critical', (alert) => {
    logger.error('CRITICAL:', alert);
});
```

### 2. Frontend Integration

في `/dashboard/app/layout.tsx`:

```jsx
import ToastProvider from '../src/components/ToastProvider';
import GlobalErrorHandler from '../src/components/GlobalErrorHandler';
import ErrorBoundary from '../src/components/ErrorBoundary';

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <GlobalErrorHandler>
                    <ToastProvider>
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </ToastProvider>
                </GlobalErrorHandler>
            </body>
        </html>
    );
}
```

---

## 📊 Error Codes Reference

### Client Errors (4xx)

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | بيانات غير صحيحة |
| `AUTHENTICATION_ERROR` | 401 | فشل المصادقة |
| `AUTHORIZATION_ERROR` | 403 | غير مصرح |
| `NOT_FOUND` | 404 | غير موجود |
| `CONFLICT` | 409 | تعارض البيانات |
| `RATE_LIMIT` | 429 | تجاوز الحد |

### WhatsApp Errors

| Code | Status | Description |
|------|--------|-------------|
| `WHATSAPP_NOT_READY` | 503 | WhatsApp غير جاهز |
| `WHATSAPP_DISCONNECTED` | 503 | انقطع الاتصال |
| `WHATSAPP_QR_TIMEOUT` | 408 | انتهى وقت QR |
| `MESSAGE_SEND_FAILED` | 500 | فشل الإرسال |
| `INVALID_PHONE_NUMBER` | 400 | رقم غير صحيح |

### Server Errors (5xx)

| Code | Status | Description |
|------|--------|-------------|
| `INTERNAL_ERROR` | 500 | خطأ داخلي |
| `DATABASE_ERROR` | 500 | خطأ قاعدة البيانات |
| `SERVICE_UNAVAILABLE` | 503 | الخدمة غير متاحة |
| `TIMEOUT` | 504 | انتهى الوقت |

---

## 🔍 Monitoring & Debugging

### 1. Error Logs

الأخطاء تُخزن في:
- `/runtime/logs/errors.json` (آخر 1000 خطأ)
- Winston logs في `/runtime/logs/`
- Browser console (development)
- localStorage (`waqtor_errors` - آخر 10 أخطاء)

### 2. Error Stats API

```bash
# إحصائيات الساعة الأخيرة
curl http://localhost:8080/api/errors/stats?timeRange=hour

# أحدث 20 خطأ
curl http://localhost:8080/api/errors/recent?limit=20
```

### 3. Error Dashboard

الوصول عبر: `/error-management` في Dashboard

الميزات:
- إحصائيات في الوقت الفعلي
- رسوم بيانية للتوزيع
- جدول الأخطاء القابل للفرز
- تفاصيل كل خطأ
- إمكانية مسح السجل

---

## ⚙️ Configuration

### Environment Variables

```env
# Error Monitoring
ERROR_MONITORING_ENABLED=true
ERROR_THRESHOLD_CRITICAL=10
ERROR_THRESHOLD_WARNING=5

# Error Logging
SENTRY_DSN=your_sentry_dsn  # اختياري
LOG_LEVEL=error

# Frontend
NEXT_PUBLIC_LOG_ERRORS=true
```

### Thresholds

```javascript
// في server/index.js
errorMonitor.setThresholds({
    critical: 10,  // أخطاء/دقيقة للتنبيه الحرج
    warning: 5,    // أخطاء/دقيقة للتحذير
    info: 2        // أخطاء/دقيقة للمعلومات
});
```

---

## 🎯 Best Practices

### 1. استخدم Error Codes المناسبة
```javascript
// ❌ سيء
throw new Error('Something went wrong');

// ✅ جيد
throw new AppError(
    'Campaign not found',
    404,
    ErrorCodes.CAMPAIGN_NOT_FOUND,
    { campaignId: id }
);
```

### 2. أضف Context للأخطاء
```javascript
// Backend
await errorLogger.logError(error, {
    userId: req.user?.id,
    action: 'send_message',
    phone: phone,
    timestamp: new Date()
});

// Frontend
logError(error, {
    page: window.location.pathname,
    component: 'SendMessageForm',
    userAction: 'submit'
});
```

### 3. استخدم Async Handler
```javascript
// ❌ سيء
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ جيد
router.get('/campaigns', asyncHandler(async (req, res) => {
    const campaigns = await Campaign.find();
    res.json({ success: true, data: campaigns });
}));
```

### 4. استخدم Error Boundaries
```jsx
// ❌ سيء
<MyComplexComponent />

// ✅ جيد
<ErrorBoundary>
    <MyComplexComponent />
</ErrorBoundary>
```

### 5. استخدم Retry Logic
```javascript
// مع useErrorHandler
const { retryWithErrorHandling } = useErrorHandler();

await retryWithErrorHandling(
    () => api.call(),
    { maxRetries: 3, delay: 1000 }
);
```

---

## 📚 الملفات المضافة/المحدثة

### Backend Files
- ✅ `/runtime/server/middleware/errorHandler.js` - Enhanced
- ✅ `/runtime/server/middleware/validator.js` - Enhanced  
- ✅ `/runtime/server/utils/errorLogger.js` - جديد
- ✅ `/runtime/server/services/errorMonitor.js` - جديد
- ✅ `/runtime/server/services/errorRecovery.js` - جديد
- ✅ `/runtime/server/routes/errors.js` - جديد
- ✅ `/runtime/server/index.js` - Updated

### Frontend Files
- ✅ `/dashboard/src/utils/errorHandler.js` - Enhanced
- ✅ `/dashboard/src/components/ErrorBoundary.jsx` - Enhanced
- ✅ `/dashboard/src/components/ErrorFallback.jsx` - جديد
- ✅ `/dashboard/src/components/ToastProvider.jsx` - Enhanced
- ✅ `/dashboard/src/components/GlobalErrorHandler.jsx` - جديد
- ✅ `/dashboard/src/hooks/useErrorHandler.js` - جديد
- ✅ `/dashboard/src/pages/ErrorManagement.jsx` - جديد
- ✅ `/dashboard/src/api/services.js` - Updated

---

## 🧪 Testing

### Backend Tests
```bash
cd runtime
npm test -- tests/error-handler.test.js
```

### Frontend Tests
```bash
cd dashboard
npm test -- src/__tests__/errorHandler.test.js
```

### Manual Testing
1. اختبر معالجة الأخطاء في API endpoints
2. اختبر Error Boundaries في الواجهة
3. اختبر Error Recovery strategies
4. تحقق من Error Monitoring alerts
5. راجع Error Dashboard

---

## 🔄 Next Steps

1. [ ] إضافة Sentry/LogRocket integration
2. [ ] إعداد Email/Slack alerts للأخطاء الحرجة
3. [ ] إنشاء Error Analytics Dashboard
4. [ ] إضافة Error Replay functionality
5. [ ] كتابة Unit Tests شاملة
6. [ ] إضافة Error Recovery strategies إضافية

---

## 📞 الدعم

للمساعدة أو الأسئلة:
- راجع الأمثلة في الكود
- تحقق من Error Dashboard
- راجع error logs في `/runtime/logs/`
- افحص browser console في Development mode

---

**تم التحديث:** 2025
**الإصدار:** 1.0.0
**الحالة:** ✅ Production Ready
