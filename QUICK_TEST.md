# ⚡ اختبار سريع - Message ACK Status

## 🚀 **ابدأ الآن:**

### **1. شغّل Runtime Server:**
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/runtime
npm start
```

### **2. شغّل Dashboard:**
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/dashboard
npm run dev
```

### **3. شغّل سكريبت الاختبار:**
```bash
cd /Users/sunmarke/Downloads/Waqtor-main
./test-ack-status.sh
```

---

## 📱 **أو اختبار يدوي:**

### **A. من Dashboard:**
1. افتح: http://localhost:3000/messages
2. أضف رقم: `201273574131`
3. أرسل رسالة
4. افتح Console (F12)
5. راقب الـ logs

### **B. من Terminal:**
```bash
curl -X POST http://localhost:8080/api/messages/send-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{"phone":"201273574131","message":"Test"}'
```

---

## 👀 **ما تراقبه:**

### **في Backend Console:**
```
🟢 MESSAGE ACK RECEIVED
📨 ackCode: 1 (sent)
✅ Broadcast sent
```

### **في Browser Console (F12):**
```
🟣 WEBSOCKET MESSAGE ACK
📨 ackCode: 3 (read)
🔴 FRONTEND MESSAGE ACK
✅ MATCH FOUND! ack: 2 → 3
```

### **في Dashboard UI:**
```
⏳ → ✓ → ✓✓ (gray) → ✓✓ (blue) ✅
```

---

## ✅ **علامات النجاح:**

- [x] Backend logs تظهر ACK events
- [x] WebSocket يبث البيانات
- [x] Frontend يستقبل ويحدث
- [x] UI يعرض الأيقونة الصحيحة
- [x] Status يتحول لـ blue عند القراءة

---

## 🐛 **إذا لم يعمل:**

1. تأكد من WhatsApp متصل
2. تأكد من WebSocket متصل
3. افتح Console وابحث عن errors
4. اقرأ: `TESTING_GUIDE.md` للتفاصيل

---

**للتفاصيل الكاملة:** اقرأ `TESTING_GUIDE.md`
