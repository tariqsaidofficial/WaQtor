# 🚀 Waqtor - البدء السريع (بالعربية)

<div dir="rtl">

## ⚡ ابدأ في 60 ثانية

### الخطوة 1: إعداد البيئة (30 ثانية)

```bash
# نسخ ملف البيئة
cp runtime/config/.env.example runtime/config/.env

# تعديله (استخدم nano أو vim أو أي محرر نصوص)
nano runtime/config/.env
```

**اضبط هاتين القيمتين:**
```bash
API_KEY=your_secure_key_here          # غيّر هذا!
TEST_PHONE_NUMBER=966501234567        # رقمك مع كود الدولة
```

### الخطوة 2: تشغيل الخادم (30 ثانية)

**الخيار أ: استخدام Docker (موصى به)**
```bash
npm run docker:build && npm run docker:run
npm run docker:logs    # عرض السجلات ومسح QR code
```

**الخيار ب: استخدام Node.js**
```bash
npm install           # المرة الأولى فقط
npm run dev           # وضع التطوير مع إعادة تحميل تلقائية
```

### الخطوة 3: مسح QR Code

1. ابحث عن QR code في الطرفية/السجلات
2. افتح الواتساب على هاتفك
3. اذهب إلى: **الإعدادات → الأجهزة المرتبطة → ربط جهاز**
4. امسح الكود

✅ **تم! الـ API يعمل الآن على http://localhost:8080**

---

## 🧪 اختبر الإعداد

### 1. تحقق من صحة الخادم

```bash
curl http://localhost:8080/health
```

**النتيجة المتوقعة:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-09T...",
  "service": "Waqtor API",
  "version": "1.34.1"
}
```

### 2. تحقق من إعداد الاختبار

```bash
curl -X GET http://localhost:8080/api/test/info \
  -H "X-API-Key: your_api_key_here"
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "data": {
    "configured": true,
    "message": "Test phone number is configured...",
    "phoneNumberMasked": "***1234"
  }
}
```

### 3. أرسل لنفسك رسالة اختبار

```bash
curl -X POST http://localhost:8080/api/test/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{"message": "مرحباً من Waqtor! 🚀 هذه رسالة اختبار."}'
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "message": "Test message sent successfully",
  "data": {
    "id": "...",
    "timestamp": 1234567890,
    "to": "TEST_PHONE_NUMBER (hidden for security)"
  }
}
```

✅ **تحقق من واتساب - يجب أن تستلم الرسالة!**

---

## 📡 أمثلة API شائعة

### إرسال رسالة نصية

```bash
curl -X POST http://localhost:8080/api/messages/send-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "chatId": "966501234567@c.us",
    "text": "مرحباً! هذه رسالة من Waqtor."
  }'
```

### إرسال صورة

```bash
curl -X POST http://localhost:8080/api/messages/send-media \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "chatId": "966501234567@c.us",
    "media": "https://example.com/image.jpg",
    "caption": "شاهد هذه الصورة!"
  }'
```

### إنشاء حملة

```bash
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "حملة ترحيبية",
    "recipients": ["966501234567@c.us", "966501234568@c.us"],
    "message": "مرحباً بك في خدمتنا!",
    "scheduleAt": "2025-01-10T10:00:00Z"
  }'
```

### قائمة جميع الحملات

```bash
curl -X GET http://localhost:8080/api/campaigns/list \
  -H "X-API-Key: your_api_key_here"
```

### الحصول على حالة العميل

```bash
curl -X GET http://localhost:8080/api/status/client \
  -H "X-API-Key: your_api_key_here"
```

---

## 🐳 أوامر Docker

```bash
# بناء الصورة
npm run docker:build

# تشغيل الحاويات
npm run docker:run

# عرض السجلات (تتضمن QR code)
npm run docker:logs

# إيقاف الحاويات
npm run docker:stop

# إعادة تشغيل الحاويات
npm run docker:stop && npm run docker:run
```

---

## 🛠️ أوامر التطوير

```bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير (إعادة تحميل تلقائية)
npm run dev

# تشغيل خادم الإنتاج
npm start

# تشغيل الاختبارات
npm test

# تشغيل ملف اختبار واحد
npm run test-single tests/quick-test.js

# توليد الوثائق
npm run generate-docs

# Shell تفاعلي
npm run shell
```

---

## ❌ حل المشاكل

### الخادم لا يشتغل

**المشكلة:** المنفذ 8080 مستخدم بالفعل  
**الحل:** غيّر `PORT` في `.env` أو أوقف العملية التي تستخدم المنفذ 8080

```bash
# ابحث عن العملية على المنفذ 8080
lsof -ti:8080

# أوقفها (macOS/Linux)
kill -9 $(lsof -ti:8080)

# أو غيّر المنفذ في .env
PORT=3000
```

### QR code لا يظهر

**المشكلة:** فشل تهيئة العميل  
**الحلول:**
1. تحقق من السجلات: `npm run docker:logs` أو انظر إلى ناتج الطرفية
2. تأكد من تثبيت Chrome/Chromium
3. تحقق من سجلات Puppeteer في `runtime/logs/`
4. جرّب حذف الجلسة: `rm -rf runtime/server/session/*`

### الـ API يعيد 401 Unauthorized

**المشكلة:** API key غير صحيح أو مفقود  
**الحلول:**
1. تحقق من أن ملف `.env` يحتوي على `API_KEY`
2. تأكد من إرسال header: `X-API-Key`
3. تحقق من تطابق API key بين `.env` وطلبك

### endpoint الاختبار يعيد "TEST_PHONE_NUMBER not configured"

**المشكلة:** رقم هاتف الاختبار غير محدد في `.env`  
**الحل:** أضف رقم هاتفك إلى `.env`:

```bash
TEST_PHONE_NUMBER=966501234567  # كود دولتك + الرقم
```

### الرسائل لا ترسل

**الأسباب المحتملة:**
1. الواتساب غير متصل → امسح QR code مرة أخرى
2. صيغة رقم الهاتف خاطئة → استخدم `countrycode + number@c.us`
3. الرقم ليس على الواتساب → تحقق من وجود الرقم على واتساب
4. تحديد المعدل → انتظر وحاول مرة أخرى

**خطوات التشخيص:**
```bash
# تحقق من حالة العميل
curl http://localhost:8080/api/status/client -H "X-API-Key: your_key"

# تحقق من السجلات
npm run docker:logs
# أو
tail -f runtime/logs/app.log
```

---

## 📚 الخطوات التالية

1. ✅ **اقرأ الوثائق الكاملة:** `README.md`
2. ✅ **استكشف API endpoints:** `runtime/README.md`
3. ✅ **راجع المعمارية:** `ARCHITECTURE_IMPLEMENTATION.md`
4. ✅ **تحقق من إرشادات الأمان:** `SECURITY.md`
5. ✅ **تعلّم كيفية المساهمة:** `CONTRIBUTING.md`

---

## 🆘 الحصول على المساعدة

- **المشاكل:** https://github.com/tariqsaidofficial/Waqtor/issues
- **الوثائق:** راجع مجلد `documentation/`
- **أمثلة:** راجع مجلد `tests/`

---

## ✅ قائمة التحقق

قبل الانتقال إلى الإنتاج، تأكد من:

- [ ] نسخت `.env.example` إلى `.env`
- [ ] غيرت API key الافتراضي
- [ ] أضفت رقم هاتف الاختبار
- [ ] اختبرت جميع endpoints الرئيسية
- [ ] راجعت إعدادات الأمان
- [ ] أعددت HTTPS (في الإنتاج)
- [ ] أعددت النسخ الاحتياطية لقاعدة بيانات SQLite
- [ ] أعددت المراقبة والتسجيل
- [ ] راجعت إعدادات تحديد المعدل

---

## 🎉 كل شيء جاهز! برمجة سعيدة مع Waqtor!

*تحتاج مساعدة إضافية؟ راجع `PROJECT_FINAL_SUMMARY_AR.md` للحصول على معلومات شاملة.*

</div>
