# إصلاح خطأ AuthStore - Cannot read properties of undefined (reading 'RegistrationUtils')

## 🔍 المشكلة

عند محاولة الاتصال بـ WhatsApp Web، يظهر الخطأ التالي:

```
UNHANDLED REJECTION! 💥 Shutting down...
Error: Evaluation failed: TypeError: Cannot read properties of undefined (reading 'RegistrationUtils')
at pptr://__puppeteer_evaluation_script__:2:69
```

## 🎯 السبب

المشكلة تحدث عندما يحاول الكود الوصول إلى `window.AuthStore.RegistrationUtils` قبل أن يتم تحميل AuthStore بشكل كامل في صفحة WhatsApp Web.

## ✅ الحل المطبق

تم إضافة آليتين للحماية:

### 1. Retry Logic بعد تحميل AuthStore

تم إضافة كود في `src/Client.js` (السطر 111-128) لانتظار تحميل AuthStore مع إعادة المحاولة:

```javascript
// Wait for AuthStore to be fully initialized with retry logic
await this.pupPage.evaluate(async () => {
    let retries = 0;
    const maxRetries = 10;
    const retryDelay = 500; // 500ms
    
    while (retries < maxRetries) {
        if (window.AuthStore && window.AuthStore.RegistrationUtils && window.AuthStore.AppState) {
            break; // AuthStore is ready
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retries++;
    }
    
    if (!window.AuthStore || !window.AuthStore.RegistrationUtils) {
        throw new Error('AuthStore failed to load after ' + maxRetries + ' retries');
    }
});
```

**الفوائد:**
- ينتظر حتى 5 ثواني (10 محاولات × 500ms) لتحميل AuthStore
- يتحقق من وجود جميع المكونات المطلوبة
- يعطي رسالة خطأ واضحة إذا فشل التحميل

### 2. Validation قبل استخدام RegistrationUtils

تم إضافة فحص في `src/Client.js` (السطر 180-183):

```javascript
// Wait for AuthStore to be fully loaded
if (!window.AuthStore || !window.AuthStore.RegistrationUtils) {
    throw new Error('AuthStore not loaded yet. Please wait and try again.');
}
```

## 🚀 كيفية التطبيق

### الخطوة 1: تطبيق التعديلات

التعديلات تم تطبيقها بالفعل في ملف `src/Client.js`. لا حاجة لأي إجراء إضافي.

### الخطوة 2: إعادة تشغيل الخادم

```bash
# إيقاف الخادم الحالي (Ctrl+C)

# إعادة التشغيل
cd /Users/sunmarke/Downloads/Waqtor-main
npm start
```

أو إذا كنت تستخدم Docker:

```bash
docker-compose down
docker-compose up --build
```

### الخطوة 3: مراقبة السجلات

راقب السجلات للتأكد من عدم ظهور الخطأ مرة أخرى:

```bash
# إذا كنت تستخدم nodemon
npm run dev

# إذا كنت تستخدم Docker
docker-compose logs -f
```

## 🔧 حلول إضافية (إذا استمرت المشكلة)

### الحل 1: زيادة وقت الانتظار

إذا كان الاتصال بطيئاً، يمكنك زيادة عدد المحاولات أو وقت الانتظار:

في `src/Client.js` السطر 114-115:
```javascript
const maxRetries = 20;  // زيادة من 10 إلى 20
const retryDelay = 1000; // زيادة من 500ms إلى 1000ms
```

### الحل 2: مسح الكاش والجلسات القديمة

```bash
# حذف مجلد الجلسات
rm -rf .wwebjs_auth
rm -rf .wwebjs_cache

# إعادة التشغيل
npm start
```

### الحل 3: تحديث المكتبات

```bash
npm update whatsapp-web.js
npm update puppeteer
npm install
```

### الحل 4: استخدام Chrome بدلاً من Chromium

في ملف إعدادات Client، أضف:

```javascript
const client = new Client({
    puppeteer: {
        executablePath: '/path/to/chrome', // مسار Chrome
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});
```

## 📊 التحقق من نجاح الإصلاح

بعد إعادة التشغيل، يجب أن ترى:

```
✅ AuthStore loaded successfully
✅ Generating QR code...
📱 QR Code received
```

بدلاً من:

```
❌ Error: Evaluation failed: TypeError: Cannot read properties of undefined
```

## 🆘 إذا استمرت المشكلة

1. **تحقق من إصدار WhatsApp Web:**
   - قد تكون هناك تحديثات جديدة غيرت هيكل AuthStore
   - جرب تحديث `whatsapp-web.js` لأحدث إصدار

2. **تحقق من الاتصال بالإنترنت:**
   - تأكد من أن الخادم يمكنه الوصول إلى `web.whatsapp.com`

3. **تحقق من Puppeteer:**
   - تأكد من تثبيت Chromium بشكل صحيح
   - جرب تشغيل Puppeteer في وضع `headless: false` للتصحيح

4. **راجع السجلات:**
   - ابحث عن أي أخطاء أخرى في السجلات
   - قد تكون هناك مشاكل في الشبكة أو الذاكرة

## 📝 ملاحظات

- هذا الإصلاح يحسن استقرار الاتصال بـ WhatsApp Web
- قد يستغرق الاتصال الأول وقتاً أطول قليلاً (5 ثوانٍ إضافية كحد أقصى)
- الإصلاح متوافق مع جميع إصدارات WhatsApp Web الحديثة

## 🔗 مراجع

- [WhatsApp Web.js Documentation](https://wwebjs.dev/)
- [Puppeteer Documentation](https://pptr.dev/)
- [Issue Tracker](https://github.com/pedroslopez/whatsapp-web.js/issues)
