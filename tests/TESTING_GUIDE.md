# اختبارات WaQtor - دليل شامل

هذا المجلد يحتوي على اختبارات شاملة لجميع ميزات WaQtor.

## 📁 ملفات الاختبار

### 1. اختبارات إرسال الرسائل النصية

#### `send-message.js`
اختبار بسيط لإرسال رسالة نصية.

```bash
node tests/send-message.js
```

### 2. اختبارات إرسال الملفات

#### `test-send-image.js`
اختبار إرسال صورة PNG واحدة مع caption.

**ما يتم اختباره:**
- ✅ إنشاء صورة PNG صغيرة تلقائياً
- ✅ إرسالها عبر API
- ✅ التحقق من أن الصورة وصلت كصورة (ليس كمستند)
- ✅ التحقق من ظهور Preview في WhatsApp

```bash
node tests/test-send-image.js
```

**النتيجة المتوقعة:**
```
✅ Created test image: test-image.png
✅ Image sent successfully!
📱 Check WhatsApp to verify:
   ✓ Image appears as a photo (not a document)
   ✓ Preview is visible before opening
   ✓ Caption is displayed correctly
```

#### `test-send-file.js`
اختبار إرسال ملف PDF (كتالوج منتجات).

**ما يتم اختباره:**
- ✅ إنشاء ملف PDF صحيح
- ✅ إرساله مع caption دعائي
- ✅ التحقق من وصول الملف كمستند PDF

```bash
node tests/test-send-file.js
```

#### `test-multiple-files.js`
اختبار شامل لأنواع ملفات مختلفة.

**ما يتم اختباره:**
- ✅ إرسال صورة PNG → يجب أن تظهر كصورة
- ✅ إرسال ملف PDF → يجب أن يظهر كمستند
- ✅ إرسال صورة JPG → يجب أن تظهر كصورة

```bash
node tests/test-multiple-files.js
```

**النتيجة المتوقعة:**
```
📸 Test 1: Sending PNG Image...
✅ PNG sent: test.png

📄 Test 2: Sending PDF Document...
✅ PDF sent: test.pdf

📸 Test 3: Sending JPG Image...
✅ JPG sent: test.jpg

✅ All tests completed successfully!
```

### 3. اختبارات عامة

#### `client.js`
اختبار اتصال العميل وإرسال رسالة.

#### `quick-test.js`
اختبار سريع للتأكد من أن كل شيء يعمل.

#### `test-waqtor.js`
اختبار شامل لميزات WaQtor.

## 🔧 الإعدادات

### المتطلبات

تأكد من تثبيت الحزم المطلوبة:

```bash
npm install axios form-data node-fetch
```

### إعداد رقم الاختبار

في كل ملف اختبار، قم بتعديل رقم الهاتف:

```javascript
const PHONE_NUMBER = '201234567890'; // ضع رقمك هنا
```

### API Key

جميع الاختبارات تستخدم API key الافتراضي:

```javascript
const API_KEY = 'waqtor_default_key_change_me_in_production';
```

إذا قمت بتغيير API key في السيرفر، عدّله في ملفات الاختبار.

### Port

السيرفر يعمل على:

```
http://localhost:8080
```

تأكد من أن السيرفر يعمل قبل تشغيل الاختبارات:

```bash
# في terminal منفصل
npm run dev
# أو
node runtime/server/index.js
```

## 📊 التحقق من النتائج

بعد تشغيل أي اختبار، افتح WhatsApp وتحقق من:

### للصور (PNG, JPG, GIF, WebP)
- ✅ تظهر كصورة (Media) وليس كمستند
- ✅ Preview مرئي قبل فتح الصورة
- ✅ Caption يظهر أسفل الصورة
- ✅ يمكن التكبير/التصغير مباشرة

### للمستندات (PDF, DOC, DOCX)
- ✅ تظهر كمستند (Document)
- ✅ اسم الملف وحجمه مرئي
- ✅ Caption يظهر مع الملف
- ✅ يحتاج تنزيل أو فتح لعرض المحتوى

### للفيديو (MP4, AVI, MOV)
- ✅ تظهر كفيديو (Video)
- ✅ Thumbnail مرئي
- ✅ يمكن تشغيله مباشرة

### للصوت (MP3, WAV, OGG)
- ✅ تظهر كملف صوتي
- ✅ يمكن تشغيله مباشرة

## 🐛 استكشاف الأخطاء

### خطأ: Cannot find module
```bash
npm install
```

### خطأ: Request failed with status code 401
تحقق من API key في:
- ملف الاختبار
- `/runtime/config/.env`

### خطأ: timeout
- تحقق من أن السيرفر يعمل
- تحقق من أن WhatsApp متصل (QR code ممسوح)

### خطأ: ECONNREFUSED
- تحقق من أن السيرفر يعمل على port 8080
- جرب: `lsof -i :8080` للتأكد

## 📝 إضافة اختبار جديد

لإضافة اختبار جديد:

1. أنشئ ملف في `tests/`
2. استورد الحزم المطلوبة:
   ```javascript
   const axios = require('axios');
   const FormData = require('form-data');
   ```
3. أضف الإعدادات:
   ```javascript
   const API_URL = 'http://localhost:8080';
   const API_KEY = 'waqtor_default_key_change_me_in_production';
   ```
4. اكتب اختبارك
5. شغّله: `node tests/your-test.js`

## 🔗 روابط ذات صلة

- [توثيق WebSocket الكامل](../documentation/WEBSOCKET_COMPLETE.md)
- [إصلاح مشكلة إرسال الصور](../documentation/IMAGE_SEND_FIX.md)
- [واجهة الاختبار](../docs/websocket-test.html)

---

**آخر تحديث**: 29 أكتوبر 2025
