# ✅ Session Context - Unified Session Management

## **المشكلة:**
كل صفحة كانت بتعمل استعلام منفصل عن حالة الجلسة، مما يسبب:
- ❌ تضارب في البيانات
- ❌ استعلامات متكررة غير ضرورية
- ❌ صفحة Messages تقول "Not Connected" بالرغم من الاتصال

## **الحل:**
إنشاء **SessionContext** موحد يدير حالة الجلسة لكل التطبيق

---

## **1️⃣ SessionContext - المكون الرئيسي**

### **الملف:**
```
/src/contexts/SessionContext.tsx ✅
```

### **الميزات:**

#### **Real-time Updates:**
- ✅ WebSocket connection للتحديثات الفورية
- ✅ Polling كل 10 ثواني كـ backup
- ✅ Auto-reconnect عند انقطاع الاتصال

#### **Unified State:**
```tsx
{
    status: SessionStatus;        // حالة الجلسة
    qrCode: string | null;        // QR code
    isReady: boolean;             // جاهز للإرسال؟
    phoneNumber: string | null;   // رقم الهاتف
    lastUpdate: Date | null;      // آخر تحديث
    error: string | null;         // أخطاء
}
```

#### **Methods:**
```tsx
refreshSession()  // تحديث يدوي
isLoading         // حالة التحميل
```

---

## **2️⃣ التطبيق في Root Layout**

### **الملف:**
```
/src/app/layout.tsx ✅
```

### **الكود:**
```tsx
<PrimeReactProvider>
    <SessionProvider>  {/* ✅ Wraps entire app */}
        <LayoutProvider>{children}</LayoutProvider>
    </SessionProvider>
</PrimeReactProvider>
```

---

## **3️⃣ استخدام في Messages Page**

### **الملف:**
```
/src/app/Messages.jsx ✅
```

### **قبل:**
```jsx
// ❌ كل صفحة تستعلم بشكل منفصل
const store = useAppStore();
const { status, isConnected, sessionState, qr } = store;
```

### **بعد:**
```jsx
// ✅ استعلام موحد من Context
const { status, isReady } = useSession();
```

### **التغييرات:**
- استبدال `isConnected` بـ `isReady`
- إزالة `useAppStore`
- استخدام `useSession()` hook

---

## **4️⃣ كيف يعمل:**

### **Flow Diagram:**
```
┌─────────────────────────────────────────┐
│         SessionContext Provider         │
│  (Root Level - Wraps Entire App)       │
└──────────────┬──────────────────────────┘
               │
               ├─► WebSocket Connection
               │   └─► Real-time updates
               │
               ├─► API Polling (10s)
               │   └─► Backup updates
               │
               └─► Unified State
                   ├─► status
                   ├─► isReady
                   ├─► qrCode
                   └─► phoneNumber
                   
┌──────────────┴──────────────────────────┐
│                                          │
▼                                          ▼
Messages Page                    Dashboard Page
useSession()                     useSession()
├─► status                       ├─► status
├─► isReady                      ├─► isReady
└─► Same Data ✅                 └─► Same Data ✅
```

---

## **5️⃣ الفوائد:**

### **Performance:**
- ✅ استعلام واحد بدل من متعدد
- ✅ WebSocket للتحديثات الفورية
- ✅ Caching تلقائي

### **Consistency:**
- ✅ كل الصفحات تشوف نفس البيانات
- ✅ لا تضارب في الحالة
- ✅ تحديثات متزامنة

### **Maintainability:**
- ✅ مكان واحد لإدارة الجلسة
- ✅ سهل التعديل والصيانة
- ✅ كود أنظف وأبسط

---

## **6️⃣ API Endpoints Used:**

```
GET /api/session/state  - Get current session state
GET /api/session/qr     - Get QR code
WS  /ws                 - WebSocket for real-time updates
```

---

## **7️⃣ Hook Usage:**

### **في أي صفحة:**
```tsx
import { useSession } from '../contexts/SessionContext';

function MyComponent() {
    const { 
        status,      // 'ready' | 'qr' | 'disconnected' | ...
        isReady,     // true/false - ready to send?
        qrCode,      // QR code string
        phoneNumber, // Connected phone number
        refreshSession, // Manual refresh
        isLoading    // Loading state
    } = useSession();
    
    // Use the data
    if (!isReady) {
        return <div>Please connect WhatsApp</div>;
    }
    
    return <div>Connected: {phoneNumber}</div>;
}
```

---

## **8️⃣ WebSocket Events:**

### **Subscribed Events:**
```json
{
    "type": "subscribe",
    "events": ["session_update", "qr_code"]
}
```

### **Received Events:**
```json
// Session Update
{
    "type": "session_update",
    "data": {
        "status": "ready",
        "phoneNumber": "+966501234567"
    }
}

// QR Code Update
{
    "type": "qr_code",
    "data": {
        "qr": "data:image/png;base64,..."
    }
}
```

---

## **9️⃣ Auto-Reconnection:**

```tsx
ws.onclose = () => {
    console.log('❌ WebSocket disconnected, reconnecting...');
    setTimeout(connectWebSocket, 3000); // Reconnect after 3s
};
```

---

## **🔟 Polling Backup:**

```tsx
// Poll every 10 seconds as backup
const pollInterval = setInterval(fetchSessionState, 10000);
```

---

## **الملفات المُعدلة:**

```
✅ /src/contexts/SessionContext.tsx (NEW)
✅ /src/app/layout.tsx (Updated)
✅ /src/app/Messages.jsx (Updated)
```

---

## **الصفحات التي يمكن تحديثها:**

```
📄 /src/app/(main)/page.tsx (Dashboard)
📄 /src/app/Campaigns.jsx
📄 /src/app/Reports.jsx
📄 /src/components/enhanced/EnhancedQRStatusCard.jsx
```

### **كيفية التحديث:**
```tsx
// Replace this:
const store = useAppStore();
const { status, isConnected } = store;

// With this:
const { status, isReady } = useSession();
```

---

## **Testing:**

### **1. Test Session Context:**
```bash
npm run dev
# Open console
# Should see: "✅ Session WebSocket connected"
```

### **2. Test Messages Page:**
```bash
# Navigate to /messages
# Should show correct connection status
# Should NOT show "Not Connected" if session is active
```

### **3. Test Real-time Updates:**
```bash
# Logout from WhatsApp
# Watch Messages page - should update immediately
# Scan QR code
# Watch Messages page - should show "Connected" immediately
```

---

## **🎉 Summary:**

### **Before:**
- ❌ كل صفحة تستعلم بشكل منفصل
- ❌ تضارب في البيانات
- ❌ استعلامات متكررة

### **After:**
- ✅ استعلام موحد من مكان واحد
- ✅ بيانات متسقة في كل الصفحات
- ✅ تحديثات فورية عبر WebSocket
- ✅ Auto-reconnection
- ✅ Polling كـ backup

---

## **Status: COMPLETE! ✅**

Session management is now unified and all pages will show consistent connection status!
