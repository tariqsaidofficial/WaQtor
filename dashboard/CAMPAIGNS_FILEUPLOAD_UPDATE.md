# 📤 تحديث FileUpload في Campaigns

## ✅ التحديثات المنفذة

### 1️⃣ **FileUpload للـ Recipients (Basic Mode)**

تم تبسيط FileUpload للأرقام ليكون basic mode فقط:

```jsx
<FileUpload
    mode="basic"
    name="recipients"
    accept=".txt,.csv"
    maxFileSize={1000000}
    onSelect={handleFileUpload}
    chooseLabel="Choose File (.txt, .csv)"
    className="w-full"
    auto
/>
```

**المميزات:**
- ✅ **Basic Mode** - زر بسيط للاختيار
- ✅ دعم .txt و .csv
- ✅ حجم أقصى 1MB
- ✅ Auto upload عند الاختيار
- ✅ مناسب للملفات النصية

### 2️⃣ **FileUpload للـ Campaigns (Advanced Mode)**

تم إضافة ميزة رفع الحملات بتصميم متقدم:

```jsx
<Button
    label="Upload Campaigns"
    icon="pi pi-upload"
    onClick={() => setUploadDialogVisible(true)}
    className="p-button-lg p-button-outlined"
/>
```

**Dialog مخصص للرفع:**
```jsx
<Dialog
    visible={uploadDialogVisible}
    header="Upload Campaigns"
    modal
>
    <FileUpload
        ref={fileUploadRef}
        name="campaigns[]"
        accept=".json"
        maxFileSize={5000000}
        headerTemplate={...}
        itemTemplate={...}
        emptyTemplate={...}
    />
</Dialog>
```

## 🎨 التصميم

### Recipients FileUpload (Basic)
```
┌─────────────────────────────────────┐
│  Upload Recipients File             │
│  [Choose File (.txt, .csv)]         │
│  Supported formats: .txt, .csv...   │
└─────────────────────────────────────┘
```

### Campaigns FileUpload (Advanced)
```
┌─────────────────────────────────────────────┐
│  📤 Upload Campaigns                  [×]   │
├─────────────────────────────────────────────┤
│  Upload a JSON file containing campaign...  │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │ 📁 Choose  [×]    0 B / 5 MB  ▓▓▓▓ │   │
│  ├─────────────────────────────────────┤   │
│  │  ☁️                                  │   │
│  │  Drag and Drop Campaign File        │   │
│  │  or click to browse                 │   │
│  │  Supported: .json (Max 5MB)         │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ℹ️ Expected JSON Format:                   │
│  ┌─────────────────────────────────────┐   │
│  │ [                                    │   │
│  │   {                                  │   │
│  │     "name": "Campaign Name",         │   │
│  │     "message": "Your message",       │   │
│  │     "recipients": ["966501234567"],  │   │
│  │     "status": "draft",               │   │
│  │     "delay": 1000                    │   │
│  │   }                                  │   │
│  │ ]                                    │   │
│  └─────────────────────────────────────┘   │
│                                              │
│                              [Close]         │
└─────────────────────────────────────────────┘
```

### Uploaded Campaign File
```
┌─────────────────────────────────────────┐
│ 📄 campaigns.json          [SUCCESS]    │
│    2025-10-29                           │
└─────────────────────────────────────────┘
```

## 📋 الفرق بين النوعين

### Recipients FileUpload
- **النوع**: Basic Mode
- **الملفات**: .txt, .csv
- **الحجم**: 1MB
- **الاستخدام**: أرقام هواتف المستلمين
- **التصميم**: بسيط - زر واحد فقط

### Campaigns FileUpload
- **النوع**: Advanced Mode
- **الملفات**: .json
- **الحجم**: 5MB
- **الاستخدام**: رفع حملات كاملة
- **التصميم**: متقدم - Drag & Drop, ProgressBar, Templates

## 🔄 كيفية الاستخدام

### رفع أرقام المستلمين
1. افتح New Campaign Dialog
2. اذهب لتبويب Recipients
3. اضغط "Choose File (.txt, .csv)"
4. اختر ملف يحتوي على أرقام (رقم في كل سطر)
5. سيتم إضافة الأرقام تلقائياً

### رفع حملات كاملة
1. اضغط "Upload Campaigns" في الصفحة الرئيسية
2. سيفتح Dialog مخصص
3. اسحب ملف JSON أو اضغط "Choose Campaign File"
4. سيتم قراءة الحملات وإضافتها
5. يمكن تنفيذ الحملات مباشرة

## 📄 صيغة ملف JSON للحملات

```json
[
  {
    "name": "Summer Sale 2025",
    "message": "عرض خاص! خصم 50% على جميع المنتجات",
    "recipients": [
      "966501234567",
      "966507654321",
      "966509876543"
    ],
    "status": "draft",
    "scheduledFrom": "2025-06-01T09:00:00",
    "scheduledTo": "2025-06-30T18:00:00",
    "delay": 1000,
    "randomDelay": false,
    "minDelay": 500,
    "maxDelay": 2000
  },
  {
    "name": "Ramadan Greetings",
    "message": "رمضان كريم! نتمنى لكم شهراً مباركاً",
    "recipients": [
      "966501111111",
      "966502222222"
    ],
    "status": "scheduled",
    "delay": 2000
  }
]
```

## 🎯 المميزات

### Recipients FileUpload
- ✅ بسيط وسريع
- ✅ مناسب للملفات النصية
- ✅ Auto upload
- ✅ تحديث فوري لعدد المستلمين

### Campaigns FileUpload
- ✅ Drag & Drop
- ✅ ProgressBar للحجم
- ✅ عرض معلومات الملف
- ✅ مثال على الصيغة المطلوبة
- ✅ معالجة JSON تلقائية
- ✅ إشعارات النجاح/الفشل

## 📁 الملفات المحدثة

### 1. `/src/app/Campaigns.jsx`
```jsx
// إضافة imports
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';

// إضافة state
const [uploadDialogVisible, setUploadDialogVisible] = useState(false);
const [uploadedCampaigns, setUploadedCampaigns] = useState([]);
const [totalSize, setTotalSize] = useState(0);

// إضافة handler
const handleCampaignFileUpload = (event) => {
    // معالجة ملف JSON
};

// إضافة زر Upload
<Button
    label="Upload Campaigns"
    icon="pi pi-upload"
    onClick={() => setUploadDialogVisible(true)}
    className="p-button-lg p-button-outlined"
/>

// إضافة Dialog
<Dialog visible={uploadDialogVisible}>
    <FileUpload ... />
</Dialog>
```

### 2. `/src/components/Campaigns/NewCampaignDialog.tsx`
```jsx
// تبسيط FileUpload
<FileUpload
    mode="basic"
    name="recipients"
    accept=".txt,.csv"
    maxFileSize={1000000}
    onSelect={handleFileUpload}
    chooseLabel="Choose File (.txt, .csv)"
    className="w-full"
    auto
/>

// إزالة imports غير مستخدمة
- import { Tooltip } from 'primereact/tooltip';
- import { ProgressBar } from 'primereact/progressbar';
- import { Tag } from 'primereact/tag';

// إزالة state غير مستخدم
- const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
- const [totalSize, setTotalSize] = useState(0);
- const fileUploadRef = useRef<any>(null);
```

## 🎨 متى نستخدم كل نوع؟

### Basic Mode (للـ Recipients)
استخدم عندما:
- ✅ الملفات نصية بسيطة (.txt, .csv)
- ✅ لا تحتاج Drag & Drop
- ✅ تريد تصميم بسيط ومباشر
- ✅ الملفات صغيرة الحجم

### Advanced Mode (للـ Campaigns)
استخدم عندما:
- ✅ الملفات معقدة (JSON, XML)
- ✅ تحتاج Drag & Drop
- ✅ تريد عرض معلومات الملف
- ✅ تحتاج ProgressBar
- ✅ تريد Templates مخصصة

## 🚀 الخلاصة

تم تنفيذ نظام FileUpload مزدوج:

1. **Basic للـ Recipients** - بسيط وسريع للملفات النصية
2. **Advanced للـ Campaigns** - متقدم مع Drag & Drop للملفات المعقدة

كلا النظامين:
- ✅ يعملان بشكل مستقل
- ✅ لهما تصميم مناسب لاستخدامهما
- ✅ يوفران تجربة مستخدم ممتازة
- ✅ يدعمان الملفات المطلوبة

**🎉 جاهز للاستخدام!**
