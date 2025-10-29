# ✅ Docker Setup Checklist

## قبل التشغيل (Before Running)

### المتطلبات الأساسية (Prerequisites)
- [ ] Docker Desktop مُثبّت
- [ ] Docker Desktop يعمل (تحقق من الأيقونة)
- [ ] مساحة قرص متاحة (2GB على الأقل)
- [ ] الموانئ 8080 و 3000 غير مستخدمة

### فحص سريع (Quick Check)
```bash
cd /Users/sunmarke/Downloads/Waqtor-main
./docker/verify-setup.sh
```

---

## الإعداد الأولي (Initial Setup)

### 1. تحضير البيئة
- [ ] تحقق من وجود ملف `.env.docker`
- [ ] سيتم إنشاء `.env` تلقائياً في أول تشغيل
- [ ] افتح `.env` بعد الإنشاء
- [ ] غيّر `API_KEY` من `your-secure-api-key-here` إلى مفتاح آمن
- [ ] تأكد من تطابق `API_KEY` مع `NEXT_PUBLIC_API_KEY`

### 2. تحرير المنافذ (Free Ports)
```bash
# تحقق من المنافذ
lsof -i :8080
lsof -i :3000

# إذا كانت مستخدمة، أوقف العمليات
kill -9 <PID>
```

---

## التشغيل (Running)

### الطريقة 1: Foreground (مُوصى به للاختبار)
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/docker
./start-dev.sh
```

### الطريقة 2: Background (للعمل طويل الأمد)
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/docker
./start-dev.sh -d
```

### التحقق من التشغيل الناجح
- [ ] رسالة "🎉 Waqtor Development Environment is ready!" ظهرت
- [ ] لا توجد رسائل خطأ حمراء
- [ ] Backend health check: http://localhost:8080/health يعطي `{"status":"ok"}`
- [ ] Dashboard يفتح: http://localhost:3000
- [ ] لا توجد أخطاء في console المتصفح

---

## الاختبار (Testing)

### Backend API
- [ ] افتح http://localhost:8080/health
- [ ] يجب أن ترى: `{"status":"ok","timestamp":"...","uptime":...}`
- [ ] افتح http://localhost:8080 (الصفحة الرئيسية)

### Dashboard
- [ ] افتح http://localhost:3000
- [ ] يجب أن يظهر الـ Dashboard
- [ ] تحقق من عدم وجود أخطاء في console المتصفح (F12)
- [ ] جرّب الانتقال بين الصفحات

### WebSocket
- [ ] من Dashboard، حاول الاتصال بـ WhatsApp
- [ ] يجب أن يظهر QR Code
- [ ] امسح QR Code من WhatsApp
- [ ] تحقق من نجاح الاتصال

### Hot Reload - Backend
- [ ] افتح ملف `src/structures/Message.js` (مثلاً)
- [ ] أضف comment بسيط
- [ ] احفظ الملف
- [ ] تحقق من السجلات: `./logs.sh backend`
- [ ] يجب أن ترى "restarting due to changes..."

### Hot Reload - Dashboard
- [ ] افتح ملف `dashboard/layout/AppTopbar.tsx`
- [ ] غيّر نص بسيط
- [ ] احفظ الملف
- [ ] تحقق من التحديث الفوري في المتصفح

---

## السجلات (Logs)

### عرض جميع السجلات
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/docker
./logs.sh
```

### سجلات Backend فقط
```bash
./logs.sh backend
```

### سجلات Dashboard فقط
```bash
./logs.sh dashboard
```

### Follow mode (متابعة مباشرة)
السجلات تُعرض بشكل تلقائي في follow mode، اضغط `Ctrl+C` للخروج

---

## إيقاف التشغيل (Stopping)

### إيقاف كل الخدمات
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/docker
./stop-dev.sh
```

### التحقق من الإيقاف
```bash
docker ps
# يجب ألا ترى waqtor-backend-dev أو waqtor-dashboard-dev
```

---

## استكشاف المشاكل (Troubleshooting)

### المشكلة: Port already in use
**الحل**:
```bash
# ابحث عن العملية
lsof -i :8080
lsof -i :3000

# أوقف العملية
kill -9 <PID>

# أعد التشغيل
./start-dev.sh
```

### المشكلة: Docker not running
**الحل**:
1. افتح Docker Desktop
2. انتظر حتى يصبح جاهزاً (الأيقونة تصبح خضراء)
3. أعد تشغيل `./start-dev.sh`

### المشكلة: Container won't start
**الحل**:
```bash
# شاهد السجلات للتفاصيل
./logs.sh

# إعادة البناء
./rebuild.sh
```

### المشكلة: Dashboard لا يتصل بـ Backend
**الحل**:
1. تحقق من Backend health:
   ```bash
   curl http://localhost:8080/health
   ```

2. تحقق من `.env` - يجب أن يكون `API_KEY` و `NEXT_PUBLIC_API_KEY` متطابقين

3. راجع سجلات Dashboard:
   ```bash
   ./logs.sh dashboard
   ```

### المشكلة: Changes not appearing (Hot Reload)
**الحل**:
```bash
# أعد التشغيل
./stop-dev.sh
./start-dev.sh

# إذا لم يُحل، أعد البناء
./rebuild.sh
```

### المشكلة: "Module not found" errors
**الحل**:
```bash
# إعادة بناء كاملة
./rebuild.sh
```

---

## الصيانة (Maintenance)

### تحديث الكود
```bash
git pull
cd docker
./rebuild.sh
```

### تنظيف Docker
```bash
# حذف containers قديمة
docker system prune

# حذف كل شيء (⚠️ احذر!)
docker system prune -a --volumes
```

### Backup البيانات
```bash
# Backup sessions
docker cp waqtor-backend-dev:/app/.wwebjs_auth ./backup-sessions

# Backup uploads
docker cp waqtor-backend-dev:/app/uploads ./backup-uploads
```

---

## الأوامر السريعة (Quick Commands)

```bash
# بدء
cd docker && ./start-dev.sh

# بدء في الخلفية
cd docker && ./start-dev.sh -d

# إيقاف
cd docker && ./stop-dev.sh

# السجلات
cd docker && ./logs.sh

# إعادة البناء
cd docker && ./rebuild.sh

# التحقق من الإعداد
./docker/verify-setup.sh

# صحة Backend
curl http://localhost:8080/health

# فتح Dashboard
open http://localhost:3000
```

---

## ✅ النجاح! (Success!)

عند رؤية هذه الرسائل، كل شيء يعمل بشكل صحيح:

### في Terminal:
```
🎉 Waqtor Development Environment is ready!

Access services:
  Backend API:    http://localhost:8080
  Dashboard:      http://localhost:3000
  Health Check:   http://localhost:8080/health
```

### في المتصفح (http://localhost:8080/health):
```json
{
  "status": "ok",
  "timestamp": "2024-01-29T...",
  "uptime": 123.45
}
```

### في Dashboard (http://localhost:3000):
- ✅ الصفحة تُحمّل بدون أخطاء
- ✅ لا توجد رسائل خطأ في Console
- ✅ يمكنك التنقل بين الصفحات
- ✅ يمكنك رؤية QR Code للاتصال بـ WhatsApp

---

## 📚 مراجع إضافية (Additional References)

- [DOCKER_QUICK_START.md](../DOCKER_QUICK_START.md) - دليل سريع
- [DOCKER_FINAL_REPORT.md](../DOCKER_FINAL_REPORT.md) - التقرير الشامل
- [docker/README.md](./README.md) - نظرة عامة
- [documentation/DOCKER_TROUBLESHOOTING.md](../documentation/DOCKER_TROUBLESHOOTING.md) - استكشاف مفصّل

---

**آخر تحديث**: 29 أكتوبر 2024  
**الإصدار**: 1.0.0  
**الحالة**: ✅ جاهز للاستخدام
