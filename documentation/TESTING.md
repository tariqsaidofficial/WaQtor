# 🧪 دليل اختبار Waqtor - Quick Testing Guide

## 🎯 الهدف
هذا الدليل يساعدك على اختبار Waqtor بسهولة وفهم كيفية استخدامه.

---

## 🚀 طريقة 1: Shell التفاعلي (الطريقة الأسرع)

### الخطوات:
```bash
npm run shell
```

### ماذا سيحدث:
1. ✅ ستفتح نافذة Chrome
2. ✅ سيظهر QR Code
3. ✅ امسح الكود من واتساب (الأجهزة المرتبطة)
4. ✅ بعد المسح، سيظهر `wwebjs>` prompt

### الأوامر التي يمكنك تجربتها:

#### 1️⃣ الحصول على معلومات حسابك:
```javascript
client.info
```

#### 2️⃣ عرض جميع المحادثات:
```javascript
await client.getChats()
```

#### 3️⃣ عرض جهات الاتصال:
```javascript
const contacts = await client.getContacts()
contacts.slice(0, 5) // أول 5 جهات
```

#### 4️⃣ إرسال رسالة لنفسك (للاختبار):
```javascript
const myNumber = client.info.wid._serialized
await client.sendMessage(myNumber, "اختبار Waqtor 🚀")
```

#### 5️⃣ إرسال رسالة لرقم معين:
```javascript
// استبدل الرقم برقم حقيقي (بدون + أو -)
const chatId = "201273574131@c.us"  // مثال: رقم إماراتي
await client.sendMessage(chatId, "مرحباً من Waqtor!")
```

#### 6️⃣ الحصول على محادثة معينة:
```javascript
const chats = await client.getChats()
const firstChat = chats[0]
console.log(firstChat.name)
console.log(firstChat.id._serialized)
```

#### 7️⃣ قراءة آخر 10 رسائل من محادثة:
```javascript
const chat = await client.getChatById("chat_id_هنا")
const messages = await chat.fetchMessages({limit: 10})
messages.forEach(msg => console.log(msg.body))
```

#### 8️⃣ الحصول على حالة الاتصال:
```javascript
await client.getState()
```

---

## 🧪 طريقة 2: ملف الاختبار الشامل (موصى به)

### الخطوات:
```bash
node test-waqtor.js
```

### ماذا سيحدث:
1. ✅ سيفتح Chrome مع QR Code
2. ✅ امسح الكود من واتساب
3. ✅ سيعرض معلومات كاملة عن حسابك تلقائياً:
   - اسم الحساب
   - الرقم
   - عدد جهات الاتصال
   - آخر 5 محادثات
4. ✅ سيرسل رسالة اختبار لحسابك تلقائياً
5. ✅ سيعرض أمثلة على الأوامر التي يمكنك تجربتها

### الميزات الإضافية:
- **رد تلقائي على `!ping`** - جرب أن ترسل `!ping` لنفسك أو من أي رقم
- **رد تلقائي على `!info`** - جرب أن ترسل `!info` للحصول على معلومات البوت

---

## 📱 كيفية الحصول على Chat ID

### الطريقة الأولى: من Shell
```javascript
// احصل على جميع المحادثات
const chats = await client.getChats()

// اعرض أول 10 محادثات مع الأسماء والـ IDs
chats.slice(0, 10).forEach((chat, i) => {
    console.log(`${i + 1}. ${chat.name}`)
    console.log(`   ID: ${chat.id._serialized}`)
})
```

### الطريقة الثانية: من رقم الهاتف
```javascript
// صيغة الـ Chat ID للمحادثات الفردية:
// <country_code><phone_number>@c.us

// مثال 1: رقم إماراتي (971)
const chatId = "971501234567@c.us"

// مثال 2: رقم سعودي (966)
const chatId = "966501234567@c.us"

// مثال 3: رقم مصري (20)
const chatId = "201001234567@c.us"
```

### الطريقة الثالثة: للمجموعات
```javascript
// احصل على جميع المحادثات
const chats = await client.getChats()

// تصفية المجموعات فقط
const groups = chats.filter(chat => chat.isGroup)

// عرض المجموعات
groups.forEach((group, i) => {
    console.log(`${i + 1}. ${group.name}`)
    console.log(`   ID: ${group.id._serialized}`)
    console.log(`   Members: ${group.participants.length}`)
})
```

---

## 🎨 أمثلة متقدمة

### إرسال رسالة منسقة:
```javascript
const chatId = "971501234567@c.us"
await client.sendMessage(chatId, `
*مرحباً بك في Waqtor* 🚀

✅ ميزات متقدمة
✅ واجهة برمجية قوية
✅ أتمتة ذكية

_تم الإرسال من Waqtor Bot_
`)
```

### إرسال رسالة مع emoji:
```javascript
await client.sendMessage(chatId, "مرحباً 👋 كيف حالك؟ 😊")
```

### التحقق من وجود رقم على واتساب:
```javascript
const phoneNumber = "971501234567" // بدون @c.us
const isRegistered = await client.isRegisteredUser(phoneNumber + "@c.us")
console.log(isRegistered ? "✅ موجود" : "❌ غير موجود")
```

### الحصول على صورة البروفايل:
```javascript
const chatId = "971501234567@c.us"
const profilePicUrl = await client.getProfilePicUrl(chatId)
console.log(profilePicUrl)
```

### تحديد رسالة كمقروءة:
```javascript
const chat = await client.getChatById(chatId)
await chat.sendSeen()
```

### الكتابة... (typing indicator):
```javascript
const chat = await client.getChatById(chatId)
await chat.sendStateTyping() // يظهر "typing..."
await new Promise(resolve => setTimeout(resolve, 2000)) // انتظر ثانيتين
await chat.clearState() // أوقف "typing..."
await client.sendMessage(chatId, "مرحباً!")
```

---

## 🔍 تصحيح الأخطاء (Debugging)

### إذا لم يعمل الكود:

#### 1️⃣ تحقق من الاتصال:
```javascript
await client.getState()
// يجب أن يعود: "CONNECTED"
```

#### 2️⃣ تحقق من صحة Chat ID:
```javascript
const chatId = "971501234567@c.us" // تأكد من الصيغة
const isValid = await client.isRegisteredUser(chatId)
console.log(isValid)
```

#### 3️⃣ إعادة تشغيل الـ Client:
```bash
# اضغط Ctrl+C لإيقاف
# ثم شغل من جديد:
npm run shell
```

#### 4️⃣ حذف الـ Session وإعادة المسح:
```bash
rm -rf .wwebjs_auth
npm run shell
# امسح QR Code من جديد
```

---

## 📊 فهم تنسيق Chat ID

```
نوع المحادثة         | التنسيق
---------------------|------------------------
فردي (Individual)   | 971501234567@c.us
مجموعة (Group)       | 123456789@g.us
قناة (Channel)       | 123456789@newsletter
بث (Broadcast)       | 123456789@broadcast
```

---

## ⚡ نصائح سريعة

1. **استخدم `await`** مع جميع الأوامر غير المتزامنة
2. **احفظ Chat IDs** في ملف للاستخدام السريع
3. **جرب على نفسك أولاً** قبل إرسال لأرقام أخرى
4. **راقب الـ console** لرؤية الرسائل الواردة
5. **اضغط Ctrl+C** للخروج من Shell

---

## 🎯 الخطوة التالية

بعد أن تتأكد أن كل شيء يعمل، يمكنك:

1. ✅ تحديث README.md
2. ✅ بناء REST API Server
3. ✅ إضافة Docker Support
4. ✅ بناء Admin Dashboard

---

## 🆘 المساعدة

إذا واجهت مشكلة:
1. تحقق من console للأخطاء
2. تأكد أن Chrome مفتوح ومتصل
3. تأكد أن QR Code ممسوح بشكل صحيح
4. راجع [الأمثلة الرسمية](https://github.com/tariqsaidofficial/Waqtor/blob/main/example.js)

---

**Waqtor - A new vector for intelligent communication.** 🚀
