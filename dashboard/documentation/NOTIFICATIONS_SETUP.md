# 🔔 Notification System Setup Guide

## Overview
نظام الإشعارات في WaQtor مربوط بالكامل مع Backend API ويستخدم polling كل 30 ثانية للتحديث التلقائي.

---

## 📋 Prerequisites

### 1. Backend Server Running
تأكد من تشغيل Backend server:
```bash
cd /Users/sunmarke/Downloads/Waqtor-main
npm start
```

Server should be running on: `http://localhost:8080`

### 2. API Key Configuration
يجب تكوين API Key بإحدى الطرق التالية:

#### Option A: Using localStorage (Recommended)
1. افتح Dashboard في المتصفح
2. افتح Developer Console (F12)
3. نفذ الأمر التالي:
```javascript
localStorage.setItem('api_key', 'YOUR_API_KEY_HERE');
```

#### Option B: Using .env.local file
1. أنشئ ملف `.env.local` في `/dashboard/`:
```bash
cd /Users/sunmarke/Downloads/Waqtor-main/dashboard
touch .env.local
```

2. أضف المتغيرات التالية:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_KEY=your_api_key_here
```

3. أعد تشغيل Dashboard:
```bash
npm run dev
```

---

## 🚀 Features

### ✅ Implemented Features:
- **Real-time Badge**: عرض عدد الإشعارات غير المقروءة في Topbar
- **Dropdown Menu**: قائمة منسدلة مع tabs (All/Unread)
- **Full Page View**: صفحة كاملة في `/notifications`
- **Mark as Read**: تحديد كمقروء (فردي أو الكل)
- **Delete**: حذف الإشعارات
- **Auto-refresh**: تحديث تلقائي كل 30 ثانية
- **Color-coded Types**: ألوان مختلفة حسب النوع (success/error/warning/info)
- **Time Ago**: عرض الوقت النسبي (e.g., "5 minutes ago")
- **Empty States**: حالات فارغة عند عدم وجود إشعارات
- **Loading States**: حالات التحميل
- **Responsive Design**: تصميم متجاوب

### 🔄 Pending Features:
- ~~WebSocket for real-time updates~~ ✅ **IMPLEMENTED**
- Sound notifications
- Desktop notifications
- Animations for new notifications

---

## 🔌 WebSocket Real-Time Updates

### How it Works
نظام الإشعارات يستخدم WebSocket للتحديثات الفورية:

1. **Auto-Connect**: يتصل تلقائياً عند تحميل Dashboard
2. **Events**: يستمع لـ `notification:new` و `notification:count`
3. **Auto-Reconnect**: إعادة اتصال تلقائية مع exponential backoff
4. **Fallback**: يعود للـ polling إذا فشل WebSocket

### WebSocket Events

#### Event: `notification:new`
يُرسل عند إنشاء إشعار جديد:
```json
{
  "type": "notification:new",
  "data": {
    "id": "123",
    "userId": "user1",
    "type": "success",
    "title": "New Message",
    "message": "You have a new message",
    "read": false,
    "createdAt": "2025-10-31T00:00:00.000Z"
  },
  "timestamp": 1698710400000
}
```

#### Event: `notification:count`
يُرسل عند تغيير عدد الإشعارات:
```json
{
  "type": "notification:count",
  "data": {
    "userId": "user1",
    "unread": 5,
    "total": 10
  },
  "timestamp": 1698710400000
}
```

### Configuration
```env
# في .env.local
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_API_KEY=your_api_key
```

### Testing WebSocket
```javascript
// في Browser Console
const ws = new WebSocket('ws://localhost:8080/ws?apiKey=YOUR_API_KEY');

ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({
    type: 'subscribe',
    events: ['notification:new', 'notification:count']
  }));
};

ws.onmessage = (event) => {
  console.log('Message:', JSON.parse(event.data));
};
```

---

## 📁 File Structure

```
📁 Backend:
└── /runtime/server/routes/notifications.js
    - GET /api/notifications
    - GET /api/notifications/count
    - PATCH /api/notifications/:id
    - DELETE /api/notifications/:id
    - POST /api/notifications (mark-all-read)

📁 Frontend:
├── /components/Notifications/
│   ├── NotificationBell.tsx
│   ├── NotificationDropdown.tsx
│   └── NotificationItem.tsx
├── /app/(main)/notifications/
│   └── page.tsx
└── /contexts/
    └── NotificationContext.tsx
```

---

## 🔧 API Endpoints

### 1. Get All Notifications
```http
GET /api/notifications?filter=all&limit=50&offset=0
Headers:
  X-API-Key: your_api_key
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "userId": "user1",
      "type": "success",
      "title": "Message Sent Successfully",
      "message": "Your campaign message was sent to 150 contacts",
      "icon": "pi-check-circle",
      "link": "/campaigns",
      "read": false,
      "createdAt": "2025-10-31T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 4,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### 2. Get Unread Count
```http
GET /api/notifications/count
Headers:
  X-API-Key: your_api_key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "unread": 2,
    "total": 4
  }
}
```

### 3. Mark as Read
```http
PATCH /api/notifications/:id
Headers:
  X-API-Key: your_api_key
  Content-Type: application/json
Body:
{
  "read": true
}
```

### 4. Delete Notification
```http
DELETE /api/notifications/:id
Headers:
  X-API-Key: your_api_key
```

### 5. Mark All as Read
```http
POST /api/notifications
Headers:
  X-API-Key: your_api_key
  Content-Type: application/json
Body:
{
  "action": "mark-all-read"
}
```

### 6. Create Notification (from other routes)
```javascript
const { createNotification } = require('./routes/notifications');

// في أي route آخر
createNotification(
  userId,
  'success',
  'Campaign Completed',
  'Your campaign was sent to 500 contacts',
  'pi-check-circle',
  '/campaigns'
);
```

---

## 🎨 Notification Types

| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| `success` | Green (#16a34a) | pi-check-circle | Successful operations |
| `error` | Red (#ef4444) | pi-times-circle | Failed operations |
| `warning` | Orange (#f59e0b) | pi-exclamation-triangle | Warnings & alerts |
| `info` | Blue (#3b82f6) | pi-info-circle | General information |

---

## 🧪 Testing

### 1. Test Notification Creation
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "success",
    "title": "Test Notification",
    "message": "This is a test notification",
    "icon": "pi-bell",
    "link": "/dashboard"
  }'
```

### 2. Test in Browser
1. افتح Dashboard: `http://localhost:3000`
2. انظر إلى Topbar - يجب أن ترى أيقونة الجرس مع Badge
3. اضغط على الجرس لفتح القائمة
4. جرب Mark as read / Delete
5. افتح `/notifications` للصفحة الكاملة

---

## 🐛 Troubleshooting

### Problem: No notifications showing
**Solution:**
1. تأكد من Backend server running
2. تحقق من API Key في localStorage أو .env.local
3. افتح Developer Console وتحقق من Network requests
4. تأكد من عدم وجود CORS errors

### Problem: Badge not updating
**Solution:**
1. انتظر 30 ثانية (polling interval)
2. أو refresh الصفحة
3. تحقق من Console للأخطاء

### Problem: API Key error
**Solution:**
```javascript
// في Console
localStorage.setItem('api_key', 'YOUR_ACTUAL_API_KEY');
location.reload();
```

---

## 📝 Next Steps

### Database Integration
حالياً النظام يستخدم in-memory storage. للإنتاج:

1. أنشئ جدول `notifications` في قاعدة البيانات
2. حدّث `/runtime/server/routes/notifications.js` لاستخدام DB
3. أضف indexes على `userId` و `read` و `createdAt`

### WebSocket Integration
لتحديثات فورية بدون polling:

1. استخدم Socket.io الموجود في المشروع
2. أضف event `notification:new`
3. حدّث `NotificationContext` للاستماع للـ events

---

## 📚 Resources

- **Backend Route**: `/runtime/server/routes/notifications.js`
- **Frontend Context**: `/dashboard/src/contexts/NotificationContext.tsx`
- **Components**: `/dashboard/src/components/Notifications/`
- **Page**: `/dashboard/src/app/(main)/notifications/page.tsx`

---

## ✅ Checklist

- [ ] Backend server running
- [ ] API Key configured
- [ ] Dashboard running
- [ ] Notifications visible in Topbar
- [ ] Can mark as read
- [ ] Can delete notifications
- [ ] Full page accessible at `/notifications`
- [ ] Auto-refresh working (30s)

---

**Last Updated**: 2025-10-31
**Version**: 1.0.0
**Status**: ✅ Production Ready (with in-memory storage)
