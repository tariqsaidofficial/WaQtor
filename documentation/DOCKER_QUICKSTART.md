# 🐳 Waqtor - دليل التشغيل السريع بـ Docker

## 📋 المتطلبات

- Docker Desktop مثبت ومشغل
- 4GB RAM على الأقل
- 10GB مساحة فارغة

## 🚀 التشغيل السريع

### الطريقة 1: استخدام السكريبت التفاعلي (موصى به)

```bash
./start-docker.sh
```

ثم اختر:
- `1` - وضع Development (مع hot reload)
- `2` - وضع Production
- `3` - إيقاف الخدمات
- `4` - إعادة البناء

### الطريقة 2: أوامر Docker Compose المباشرة

#### تشغيل Development Mode

```bash
# تشغيل الخدمات
docker-compose up -d

# عرض اللوجات
docker-compose logs -f

# إيقاف الخدمات
docker-compose down
```

#### تشغيل Production Mode

```bash
docker-compose -f docker/docker-compose.yml up -d
```

## 🌐 الوصول للخدمات

بعد التشغيل، ستكون الخدمات متاحة على:

- **Backend API**: http://localhost:8080
- **Dashboard**: http://localhost:3000
- **API Health Check**: http://localhost:8080/health

## 📊 مراقبة الخدمات

### عرض حالة الخدمات

```bash
docker-compose ps
```

### عرض اللوجات

```bash
# جميع الخدمات
docker-compose logs -f

# Backend فقط
docker-compose logs -f backend

# Dashboard فقط
docker-compose logs -f dashboard
```

### الدخول لـ Container

```bash
# Backend
docker exec -it waqtor-backend sh

# Dashboard
docker exec -it waqtor-dashboard sh
```

## 🔧 الإعدادات

### ملف البيئة

انسخ `.env.docker` إلى `.env` وعدل القيم:

```bash
cp .env.docker .env
```

أهم الإعدادات:

```env
# API Key (يجب أن يتطابق في Backend و Dashboard)
API_KEY=your-secure-api-key

# URLs للمتصفح
NEXT_PUBLIC_BROWSER_API_URL=http://localhost:8080
NEXT_PUBLIC_BROWSER_WS_URL=ws://localhost:8080
```

## 🐛 حل المشاكل

### الخدمات لا تعمل

```bash
# إعادة البناء من الصفر
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### مشاكل في الاتصال

تأكد من:
1. Docker Desktop يعمل
2. المنافذ 3000 و 8080 غير مستخدمة
3. ملف `.env` موجود ومضبوط

### عرض الأخطاء

```bash
# عرض أخطاء Backend
docker-compose logs backend | grep -i error

# عرض أخطاء Dashboard
docker-compose logs dashboard | grep -i error
```

## 🧹 التنظيف

### إيقاف وحذف كل شيء

```bash
# إيقاف الخدمات وحذف الـ volumes
docker-compose down -v

# حذف الـ images أيضاً
docker-compose down -v --rmi all
```

### حذف البيانات القديمة

```bash
# حذف الـ volumes فقط (البيانات المخزنة)
docker volume rm waqtor-sessions waqtor-cache waqtor-logs waqtor-uploads
```

## 📁 البنية

```
Waqtor-main/
├── docker-compose.yml          # ملف Docker Compose الرئيسي
├── start-docker.sh            # سكريبت التشغيل السريع
├── .env.docker                # مثال لملف البيئة
├── docker/                    # ملفات Docker
│   ├── Dockerfile.backend     # Backend Dockerfile
│   ├── Dockerfile.dashboard   # Dashboard Dockerfile
│   └── nginx.conf            # إعدادات Nginx
├── backend/                   # كود Backend
└── dashboard/                 # كود Dashboard
```

## 🔄 Hot Reload

في وضع Development، التغييرات في الكود ستنعكس تلقائياً:

- **Backend**: يعيد التشغيل تلقائياً عند تغيير الملفات
- **Dashboard**: Next.js Fast Refresh يعمل تلقائياً

## 🎯 نصائح

1. **استخدم وضع Development** للتطوير (hot reload)
2. **استخدم وضع Production** للاختبار النهائي
3. **راقب اللوجات** باستمرار لاكتشاف المشاكل
4. **احفظ نسخة احتياطية** من `.env` قبل التعديل

## 📞 الدعم

إذا واجهت مشاكل:

1. تحقق من اللوجات: `docker-compose logs -f`
2. أعد البناء: `docker-compose down && docker-compose up -d --build`
3. راجع ملف `.env`
4. تأكد من تشغيل Docker Desktop

---

**ملاحظة**: هذا الإعداد مخصص للتطوير. للإنتاج، استخدم إعدادات أمان إضافية.
