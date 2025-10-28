# 📢 دليل إدارة الحملات - Waqtor Campaign Management

## 🎯 نظرة عامة

نظام إدارة الحملات في Waqtor يتيح لك:
- ✅ إنشاء حملات للرسائل الجماعية
- ✅ جدولة الحملات لوقت محدد (قريباً)
- ✅ تنفيذ الحملات فوراً
- ✅ تتبع حالة الحملات
- ✅ مراجعة نتائج التنفيذ

---

## 🚀 طريقة العمل

### الخطوات الأساسية

1. **إنشاء حملة** - تحديد الرسالة والمستلمين
2. **تنفيذ الحملة** - إرسال الرسائل للمستلمين
3. **مراجعة النتائج** - التحقق من حالة التنفيذ

---

## 📝 أمثلة عملية

### 1. إنشاء حملة بسيطة

```bash
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "حملة ترحيبية",
    "recipients": ["966501234567", "966507654321"],
    "message": "مرحباً بك في خدمتنا! 🎉"
  }'
```

**النتيجة:**
```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {
    "id": 1,
    "name": "حملة ترحيبية",
    "status": "pending",
    "created_at": "2025-10-28 12:00:00"
  }
}
```

### 2. تنفيذ الحملة فوراً

```bash
curl -X POST http://localhost:8080/api/campaigns/1/execute \
  -H "X-API-Key: your_api_key_here"
```

**النتيجة:**
```json
{
  "success": true,
  "message": "Campaign executed successfully",
  "data": {
    "results": {
      "total": 2,
      "sent": 2,
      "failed": 0,
      "errors": []
    },
    "campaign": {
      "id": "1",
      "name": "حملة ترحيبية",
      "status": "completed"
    }
  }
}
```

### 3. قائمة جميع الحملات

```bash
curl -X GET http://localhost:8080/api/campaigns/list \
  -H "X-API-Key: your_api_key_here"
```

### 4. الحصول على تفاصيل حملة محددة

```bash
curl -X GET http://localhost:8080/api/campaigns/1 \
  -H "X-API-Key: your_api_key_here"
```

### 5. تحديث حالة حملة

```bash
curl -X PUT http://localhost:8080/api/campaigns/1/status \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{"status": "cancelled"}'
```

### 6. حذف حملة

```bash
curl -X DELETE http://localhost:8080/api/campaigns/1 \
  -H "X-API-Key: your_api_key_here"
```

---

## 📊 حالات الحملة (Campaign Status)

| الحالة | الوصف |
|--------|-------|
| `pending` | تم الإنشاء ولم تُنفذ بعد |
| `running` | قيد التنفيذ حالياً |
| `completed` | تم التنفيذ بنجاح |
| `partial` | تم التنفيذ جزئياً (بعض الرسائل فشلت) |
| `failed` | فشل التنفيذ |
| `cancelled` | تم الإلغاء |

---

## 🎨 أمثلة متقدمة

### حملة لعدة مستلمين

```bash
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "إعلان عرض خاص",
    "recipients": [
      "966501234567",
      "966507654321",
      "966509876543",
      "971505121583"
    ],
    "message": "🎁 عرض خاص لفترة محدودة! خصم 50% على جميع المنتجات.\n\nللطلب: www.example.com\n\nشكراً لثقتكم 🙏"
  }'
```

### حملة بتنسيق رقم دولي

```bash
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "حملة دولية",
    "recipients": [
      "966501234567@c.us",
      "971505121583@c.us",
      "201012345678@c.us"
    ],
    "message": "رسالة دولية لعملائنا 🌍"
  }'
```

---

## ⚡ سير العمل الكامل (Full Workflow)

### مثال: حملة ترويجية كاملة

```bash
# الخطوة 1: إنشاء الحملة
CAMPAIGN_ID=$(curl -s -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "عرض الجمعة البيضاء 2025",
    "recipients": ["966501234567", "966507654321"],
    "message": "🎉 الجمعة البيضاء!\n\nخصم يصل إلى 70%\nلمدة 3 أيام فقط!\n\nزوروا موقعنا الآن 🛍️"
  }' | jq -r '.data.id')

echo "تم إنشاء الحملة رقم: $CAMPAIGN_ID"

# الخطوة 2: مراجعة تفاصيل الحملة
curl -X GET http://localhost:8080/api/campaigns/$CAMPAIGN_ID \
  -H "X-API-Key: your_api_key_here"

# الخطوة 3: تنفيذ الحملة
curl -X POST http://localhost:8080/api/campaigns/$CAMPAIGN_ID/execute \
  -H "X-API-Key: your_api_key_here"

# الخطوة 4: التحقق من النتائج
curl -X GET http://localhost:8080/api/campaigns/$CAMPAIGN_ID \
  -H "X-API-Key: your_api_key_here"
```

---

## 🔍 تتبع النتائج

بعد تنفيذ الحملة، ستحصل على تقرير مفصل:

```json
{
  "success": true,
  "data": {
    "results": {
      "total": 10,        // إجمالي المستلمين
      "sent": 9,          // تم الإرسال بنجاح
      "failed": 1,        // فشل الإرسال
      "errors": [
        {
          "recipient": "966501234567",
          "error": "Invalid number"
        }
      ]
    }
  }
}
```

---

## ⚠️ ملاحظات مهمة

### معدل الإرسال (Rate Limiting)

- يوجد تأخير **2 ثانية** بين كل رسالة لتجنب الحظر
- للحملات الكبيرة (100+ مستلم)، يُفضل تقسيمها إلى حملات أصغر

### تنسيق الأرقام

يمكنك استخدام أي من الصيغ التالية:

```javascript
// كود الدولة + الرقم (بدون +)
"966501234567"

// كود الدولة + الرقم + @c.us
"966501234567@c.us"

// مع الصفر المحلي (سيتم إزالته تلقائياً)
"0501234567"  // ⚠️ لا يُنصح به
```

### أفضل الممارسات

1. ✅ **اختبر أولاً** - أرسل لرقمك الشخصي قبل الحملة الكبيرة
2. ✅ **أرقام صحيحة** - تأكد من صحة جميع الأرقام
3. ✅ **رسائل قصيرة** - تجنب الرسائل الطويلة جداً
4. ✅ **وقت مناسب** - أرسل في الأوقات المناسبة
5. ✅ **راجع النتائج** - تحقق من التقرير بعد التنفيذ

---

## 🐛 حل المشاكل

### الحملة لم تُنفذ

**المشكلة:** الحملة في حالة `pending` ولم يتم إرسال الرسائل.

**الحل:**
```bash
# تنفيذ الحملة يدوياً
curl -X POST http://localhost:8080/api/campaigns/1/execute \
  -H "X-API-Key: your_api_key_here"
```

### بعض الرسائل فشلت

**المشكلة:** الحملة في حالة `partial` وبعض الرسائل لم ترسل.

**الحل:**
1. راجع حقل `errors` في النتائج
2. تحقق من صحة الأرقام الفاشلة
3. أنشئ حملة جديدة للأرقام الفاشلة فقط

### خطأ "WhatsApp client is not ready"

**المشكلة:** WhatsApp غير متصل.

**الحل:**
```bash
# تحقق من حالة الاتصال
curl -X GET http://localhost:8080/api/status/client \
  -H "X-API-Key: your_api_key_here"

# إذا لم يكن متصل، أعد تشغيل الخادم
npm run dev
```

---

## 📈 الميزات القادمة

- [ ] **جدولة تلقائية** - تنفيذ الحملات في وقت محدد
- [ ] **قوالب الرسائل** - استخدام متغيرات مخصصة
- [ ] **إحصائيات مفصلة** - تقارير وتحليلات
- [ ] **إعادة المحاولة** - إعادة إرسال الرسائل الفاشلة
- [ ] **Webhooks** - إشعارات عند اكتمال الحملة

---

## 🎯 أمثلة حقيقية

### مثال 1: متجر إلكتروني

```bash
# إنشاء حملة للعملاء الجدد
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "ترحيب بالعملاء الجدد",
    "recipients": ["966501234567", "966507654321"],
    "message": "مرحباً بك في متجرنا! 🎉\n\nاستخدم كود: WELCOME10\nللحصول على خصم 10% على أول طلب\n\nنتمنى لك تجربة تسوق ممتعة! 🛍️"
  }'

# تنفيذ فوري
curl -X POST http://localhost:8080/api/campaigns/1/execute \
  -H "X-API-Key: your_api_key_here"
```

### مثال 2: تذكير بموعد

```bash
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "تذكير بالمواعيد - غداً",
    "recipients": ["966501234567"],
    "message": "تذكير بموعدك 📅\n\nالموعد: غداً الساعة 10:00 صباحاً\nالعيادة: مركز الصحة الطبي\n\nيرجى التأكيد أو إعادة الجدولة\nللتواصل: 0501234567"
  }'
```

### مثال 3: إعلان حدث

```bash
curl -X POST http://localhost:8080/api/campaigns/create \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "دعوة لحضور ورشة عمل",
    "recipients": ["966501234567", "966507654321", "971505121583"],
    "message": "دعوة خاصة! 🎓\n\nورشة عمل: تطوير تطبيقات الذكاء الاصطناعي\nالتاريخ: 1 نوفمبر 2025\nالمكان: فندق الريتز، الرياض\n\nالتسجيل: www.workshop.com\nمجاني للمشتركين الأوائل! ⏰"
  }'
```

---

## 📚 موارد إضافية

- **[API Documentation](../README.md)** - وثائق API الكاملة
- **[Testing Guide](../../TESTING_GUIDE.md)** - دليل الاختبار
- **[Security Guidelines](../../SECURITY.md)** - إرشادات الأمان

---

**تم التحديث:** 28 أكتوبر 2025  
**الإصدار:** Waqtor v1.34.1
