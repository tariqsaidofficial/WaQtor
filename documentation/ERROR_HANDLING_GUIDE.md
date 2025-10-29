# 🛡️ نظام معالجة الأخطاء الشامل - Waqtor

## 📋 نظرة عامة

تم بناء نظام معالجة أخطاء متكامل يغطي:
- ✅ **Backend Error Handling** - معالجة الأخطاء في الخادم
- ✅ **Frontend Error Handling** - معالجة الأخطاء في الواجهة
- ✅ **Error Logging** - تسجيل الأخطاء للتتبع
- ✅ **User-Friendly Messages** - رسائل واضحة للمستخدم
- ✅ **Error Recovery** - استرداد من الأخطاء

---

## 🔧 Backend Error Handling

### الملفات المُنشأة

#### 1. `runtime/server/middleware/errorHandler.js`

**المميزات:**
- ✅ `AppError` class - فئة مخصصة للأخطاء
- ✅ `ErrorCodes` - رموز أخطاء موحدة
- ✅ `errorHandler` - Middleware للأخطاء
- ✅ `asyncHandler` - Wrapper للدوال async
- ✅ `validationError` - Helper للتحقق
- ✅ `whatsappError` - Helper لأخطاء WhatsApp

**رموز الأخطاء:**
```javascript
const ErrorCodes = {
    // Client errors (4xx)
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    
    // WhatsApp errors
    WHATSAPP_NOT_READY: 'WHATSAPP_NOT_READY',
    WHATSAPP_DISCONNECTED: 'WHATSAPP_DISCONNECTED',
    
    // Message errors
    MESSAGE_SEND_FAILED: 'MESSAGE_SEND_FAILED',
    INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
    
    // Server errors (5xx)
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR'
};
```

**الاستخدام:**

```javascript
const { AppError, ErrorCodes, asyncHandler } = require('./middleware/errorHandler');

// في Route Handler
router.post('/messages/send', asyncHandler(async (req, res) => {
    if (!client.isReady()) {
        throw new AppError(
            'WhatsApp is not connected',
            503,
            ErrorCodes.WHATSAPP_NOT_READY
        );
    }
    
    // Your code here
}));
```

#### 2. `runtime/server/middleware/validator.js`

**المميزات:**
- ✅ `validatePhone` - التحقق من رقم الهاتف
- ✅ `validateMessage` - التحقق من الرسالة
- ✅ `validateBulkRecipients` - التحقق من المستلمين
- ✅ `validateCampaign` - التحقق من الحملة
- ✅ `validateFileUpload` - التحقق من الملفات
- ✅ `sanitizeInput` - تنظيف المدخلات

**الاستخدام:**

```javascript
const { validatePhone, validateMessage } = require('./middleware/validator');

router.post('/messages/send',
    validatePhone,
    validateMessage,
    asyncHandler(async (req, res) => {
        // Your code here
    })
);
```

---

## 🎨 Frontend Error Handling

### الملفات المُنشأة

#### 1. `dashboard/src/components/ErrorBoundary.jsx`

**المميزات:**
- ✅ يلتقط أخطاء React
- ✅ يعرض صفحة خطأ جميلة
- ✅ يسجل الأخطاء للتتبع
- ✅ خيارات "Try Again" و "Go Home"

**الاستخدام:**

```jsx
import ErrorBoundary from '@/src/components/ErrorBoundary';

export default function RootLayout({ children }) {
    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    );
}
```

#### 2. `dashboard/src/utils/errorHandler.js`

**المميزات:**
- ✅ `parseApiError` - تحليل أخطاء API
- ✅ `getUserFriendlyMessage` - رسائل واضحة
- ✅ `showErrorToast` - عرض Toast للأخطاء
- ✅ `logError` - تسجيل الأخطاء
- ✅ `retryOperation` - إعادة المحاولة
- ✅ `validateFormData` - التحقق من النماذج

**الاستخدام:**

```javascript
import { showErrorToast, logError } from '@/src/utils/errorHandler';

try {
    await messageService.sendText(phone, message);
} catch (error) {
    showErrorToast(toast, error);
    logError(error, { phone, action: 'send_message' });
}
```

#### 3. `dashboard/src/components/ToastProvider.jsx`

**المميزات:**
- ✅ Toast عام في كل التطبيق
- ✅ `showSuccess` - رسالة نجاح
- ✅ `showError` - رسالة خطأ
- ✅ `showWarning` - تحذير
- ✅ `showInfo` - معلومة

**الاستخدام:**

```jsx
import { ToastProvider, useToast } from '@/src/components/ToastProvider';

// في Layout
<ToastProvider>
    {children}
</ToastProvider>

// في Component
function MyComponent() {
    const { showSuccess, showError } = useToast();
    
    const handleSend = async () => {
        try {
            await sendMessage();
            showSuccess('Message sent successfully!');
        } catch (error) {
            showError(error);
        }
    };
}
```

---

## 📚 أمثلة عملية

### مثال 1: إرسال رسالة مع معالجة أخطاء كاملة

**Backend:**

```javascript
// routes/messages.js
const { asyncHandler, AppError, ErrorCodes } = require('../middleware/errorHandler');
const { validatePhone, validateMessage } = require('../middleware/validator');

router.post('/send',
    validatePhone,
    validateMessage,
    asyncHandler(async (req, res) => {
        const { phone, message } = req.body;
        
        // Check WhatsApp status
        if (!client.isReady()) {
            throw new AppError(
                'WhatsApp is not connected. Please scan QR code.',
                503,
                ErrorCodes.WHATSAPP_NOT_READY
            );
        }
        
        try {
            // Send message
            const result = await client.sendMessage(phone + '@c.us', message);
            
            res.json({
                success: true,
                data: {
                    id: result.id._serialized,
                    timestamp: result.timestamp
                }
            });
        } catch (error) {
            throw new AppError(
                'Failed to send message',
                500,
                ErrorCodes.MESSAGE_SEND_FAILED,
                { phone, error: error.message }
            );
        }
    })
);
```

**Frontend:**

```jsx
import { useToast } from '@/src/components/ToastProvider';
import { logError } from '@/src/utils/errorHandler';

function SendMessage() {
    const { showSuccess, showError } = useToast();
    const [sending, setSending] = useState(false);
    
    const handleSend = async () => {
        setSending(true);
        
        try {
            await messageService.sendText(phone, message);
            showSuccess('Message sent successfully!');
            setPhone('');
            setMessage('');
        } catch (error) {
            showError(error);
            logError(error, { 
                phone, 
                action: 'send_message',
                component: 'SendMessage'
            });
        } finally {
            setSending(false);
        }
    };
    
    return (
        <Button
            label="Send"
            onClick={handleSend}
            loading={sending}
        />
    );
}
```

### مثال 2: رفع ملف مع التحقق

**Backend:**

```javascript
const { validateFileUpload } = require('../middleware/validator');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload',
    upload.single('file'),
    validateFileUpload,
    asyncHandler(async (req, res) => {
        const file = req.file;
        
        // Process file...
        
        res.json({
            success: true,
            data: {
                url: `/uploads/${file.filename}`,
                size: file.size,
                type: file.mimetype
            }
        });
    })
);
```

**Frontend:**

```jsx
const handleFileUpload = async (event) => {
    const file = event.files[0];
    
    try {
        const result = await messageService.uploadFile(file);
        showSuccess('File uploaded successfully!');
        setMediaUrl(result.url);
    } catch (error) {
        showError(error);
        logError(error, { 
            fileName: file.name,
            fileSize: file.size,
            action: 'upload_file'
        });
    }
};
```

---

## 🔍 تتبع الأخطاء

### في Backend

```javascript
// الأخطاء تُسجل تلقائياً في:
// - Console (Development)
// - Winston Logger (Production)
// - يمكن إضافة Sentry/LogRocket

logger.error('API Error:', {
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: err.stack
});
```

### في Frontend

```javascript
// الأخطاء تُخزن في localStorage
const errors = JSON.parse(localStorage.getItem('waqtor_errors') || '[]');

// عرض الأخطاء المسجلة
console.table(errors);

// مسح الأخطاء
localStorage.removeItem('waqtor_errors');
```

---

## 📊 Error Codes المدعومة

### Backend

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | خطأ في البيانات المدخلة |
| `AUTHENTICATION_ERROR` | 401 | خطأ في المصادقة |
| `NOT_FOUND` | 404 | المورد غير موجود |
| `WHATSAPP_NOT_READY` | 503 | WhatsApp غير متصل |
| `MESSAGE_SEND_FAILED` | 500 | فشل إرسال الرسالة |
| `INVALID_PHONE_NUMBER` | 400 | رقم هاتف غير صحيح |
| `FILE_TOO_LARGE` | 400 | الملف كبير جداً |

### Frontend

| Type | Severity | When |
|------|----------|------|
| `NETWORK_ERROR` | error | لا يوجد اتصال بالإنترنت |
| `API_ERROR` | error | خطأ في الخادم (5xx) |
| `AUTHENTICATION_ERROR` | warn | مشكلة في API Key |
| `VALIDATION_ERROR` | info | بيانات غير صحيحة |
| `WHATSAPP_ERROR` | warn | مشكلة في WhatsApp |

---

## ✅ قائمة التحقق

### Backend
- [x] Error Handler Middleware
- [x] Validation Middleware
- [x] Async Handler Wrapper
- [x] Custom Error Classes
- [x] Error Codes Mapping
- [x] Unhandled Rejection Handler
- [x] Uncaught Exception Handler

### Frontend
- [x] Error Boundary Component
- [x] Error Handler Utility
- [x] Toast Provider
- [x] API Client Error Interceptor
- [x] User-Friendly Messages
- [x] Error Logging
- [x] Retry Mechanism

---

## 🚀 التطبيق

### 1. Backend Setup

```javascript
// في runtime/server/index.js
const { 
    errorHandler, 
    notFoundHandler,
    handleUnhandledRejection,
    handleUncaughtException
} = require('./middleware/errorHandler');

// Enable global handlers
handleUnhandledRejection();
handleUncaughtException();

// في Express app
app.use(notFoundHandler);
app.use(errorHandler);
```

### 2. Frontend Setup

```jsx
// في app/layout.tsx
import ErrorBoundary from '@/src/components/ErrorBoundary';
import { ToastProvider } from '@/src/components/ToastProvider';

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <ErrorBoundary>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
```

---

## 🎯 النتيجة

الآن لديك:
- ✅ معالجة شاملة للأخطاء في Backend
- ✅ معالجة شاملة للأخطاء في Frontend
- ✅ رسائل واضحة وسهلة الفهم للمستخدم
- ✅ تسجيل مركزي للأخطاء
- ✅ استرداد تلقائي من الأخطاء
- ✅ تتبع كامل للأخطاء في التطبيق

---

**آخر تحديث:** 29 أكتوبر 2025  
**الحالة:** ✅ كامل وجاهز للتطبيق
