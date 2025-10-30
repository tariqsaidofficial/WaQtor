# 📚 PrimeReact Components - Reference Guide

## ✅ **المكونات المعتمدة:**

### **1️⃣ Checkbox**

```tsx
import React, { useState } from "react";
import { Checkbox } from "primereact/checkbox";

export default function BasicDemo() {
    const [checked, setChecked] = useState<boolean>(false);

    return (
        <div className="card flex justify-content-center">
            <Checkbox onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
        </div>
    )
}
```

---

### **2️⃣ Dropdown**

```tsx
import React, { useState } from "react";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface City {
    name: string;
    code: string;
}

export default function BasicDemo() {
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    return (
        <div className="card flex justify-content-center">
            <Dropdown 
                value={selectedCity} 
                onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value)} 
                options={cities} 
                optionLabel="name" 
                placeholder="Select a City" 
                className="w-full md:w-14rem" 
            />
        </div>
    )
}
```

---

### **3️⃣ Button - Basic**

```tsx
import React from 'react'; 
import { Button } from 'primereact/button';

export default function BasicDemo() {
    return (
        <div className="card flex justify-content-center">
            <Button label="Submit" />
        </div>
    )
}
```

---

### **4️⃣ Button - Icons**

```tsx
import React from 'react'; 
import { Button } from 'primereact/button';

export default function IconsDemo() {
    return (
        <div className="card flex flex-wrap justify-content-center gap-3">
            <Button icon="pi pi-check" />
            <Button label="Submit" icon="pi pi-check" />
            <Button label="Submit" icon="pi pi-check" iconPos="right" />
        </div>
    )
}
```

---

### **5️⃣ Button - Loading**

```tsx
import React, { useState } from "react";
import { Button } from 'primereact/button';

export default function LoadingDemo() {
    const [loading, setLoading] = useState<boolean>(false);

    const load = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="card flex flex-wrap justify-content-center gap-3">
            <Button label="Submit" icon="pi pi-check" loading={loading} onClick={load} />
        </div>
    )
}
```

---

### **6️⃣ Button - Rounded**

```tsx
import React from 'react'; 
import { Button } from 'primereact/button';

export default function RoundedDemo() {
    return (
        <div className="card flex flex-wrap justify-content-center gap-3">
            <Button label="Primary" rounded />
            <Button label="Secondary" severity="secondary" rounded />
            <Button label="Success" severity="success" rounded />
            <Button label="Info" severity="info" rounded />
            <Button label="Warning" severity="warning" rounded />
            <Button label="Help" severity="help" rounded />
            <Button label="Danger" severity="danger" rounded />
        </div>
    )
}
```

---

### **7️⃣ Button - Text**

```tsx
import React from 'react'; 
import { Button } from 'primereact/button';

export default function TextDemo() {
    return (
        <div className="card flex flex-wrap justify-content-center gap-3">
            <Button label="Primary" text />
            <Button label="Secondary" severity="secondary" text />
            <Button label="Success" severity="success" text />
            <Button label="Info" severity="info" text />
            <Button label="Warning" severity="warning" text />
            <Button label="Help" severity="help" text />
            <Button label="Danger" severity="danger" text />
        </div>
    )
}
```

---

### **8️⃣ Button - Outlined**

```tsx
import React from 'react'; 
import { Button } from 'primereact/button';

export default function OutlinedDemo() {
    return (
        <div className="card flex flex-wrap justify-content-center gap-3">
            <Button label="Primary" outlined />
            <Button label="Secondary" severity="secondary" outlined />
            <Button label="Success" severity="success" outlined />
            <Button label="Info" severity="info" outlined />
            <Button label="Warning" severity="warning" outlined />
            <Button label="Help" severity="help" outlined />
            <Button label="Danger" severity="danger" outlined />
        </div>
    )
}
```

---

### **9️⃣ Button - Badges**

```tsx
import React from 'react'; 
import { Button } from 'primereact/button';

export default function BadgesDemo() {
    return (
        <div className="card flex flex-wrap justify-content-center gap-3">
            <Button type="button" label="Emails" badge="8" />
            <Button type="button" label="Messages" icon="pi pi-users" outlined badge="2" badgeClassName="p-badge-danger" />
        </div>
    )
}
```

---

### **🔟 Button Group**

```tsx
import React from 'react'; 
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';

export default function ButtonSetDemo() {
    return (
        <div className="card flex justify-content-center">
            <ButtonGroup>
                <Button label="Save" icon="pi pi-check" />
                <Button label="Delete" icon="pi pi-trash" />
                <Button label="Cancel" icon="pi pi-times" />
            </ButtonGroup>
        </div>
    )
}
```

---

### **1️⃣1️⃣ Button - Template**

```tsx
import React from 'react'; 
import { Button } from 'primereact/button';

export default function TemplateDemo() {
    return (
        <div className="card flex justify-content-center">
            <Button className="bg-bluegray-600 hover:bg-bluegray-400 border-bluegray-700">
                <img alt="logo" src="https://primefaces.org/cdn/primereact/images/primereact-logo-light.svg" className="h-2rem"></img>
            </Button>
        </div>
    )
}
```

---

### **1️⃣2️⃣ SplitButton - Basic**

```tsx
import React, { useRef } from 'react';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';

export default function BasicDemo() {
    const toast = useRef(null);
    const items = [
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
                toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
            }
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
                window.location.href = 'https://reactjs.org/';
            }
        },
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                // router.push('/fileupload');
            }
        }
    ];

    const save = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast}></Toast>
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} />
        </div>
    )
}
```

---

### **1️⃣3️⃣ SplitButton - Severity**

```tsx
import React, { useRef } from 'react';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';

export default function SeverityDemo() {
    const toast = useRef(null);
    const items = [
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
                toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
            }
        }
    ];

    const save = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    };

    return (
        <div className="card flex justify-content-center gap-2">
            <Toast ref={toast}></Toast>
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="secondary" />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="success" />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="info" />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="warning" />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="help" />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="danger" />
            <SplitButton label="Save" icon="pi pi-plus" onClick={save} model={items} severity="contrast" />
        </div>
    )
}
```

---

## 📋 **قواعد الاستخدام:**

### **✅ يجب:**
```
1. استخدام المكونات كما هي بالضبط
2. عدم تعديل البنية الأساسية
3. الالتزام بـ PrimeReact syntax
4. استخدام severity للألوان
5. استخدام icon من PrimeIcons
```

### **❌ ممنوع:**
```
1. تعديل البنية الأساسية
2. استخدام custom components
3. hardcoded colors
4. inline styles للألوان
5. custom CSS للمكونات الأساسية
```

---

## 🎯 **Button Severity:**

```tsx
severity="primary"    // default (primary color)
severity="secondary"  // gray
severity="success"    // green
severity="info"       // blue
severity="warning"    // orange
severity="help"       // purple
severity="danger"     // red
severity="contrast"   // black/white
```

---

## 🎨 **Button Variants:**

```tsx
<Button label="Default" />
<Button label="Outlined" outlined />
<Button label="Text" text />
<Button label="Rounded" rounded />
<Button label="Icon" icon="pi pi-check" />
<Button label="Loading" loading={true} />
```

---

### **1️⃣4️⃣ RadioButton**

```tsx
import React, { useState } from "react";
import { RadioButton } from "primereact/radiobutton";

export default function GroupDemo() {
    const [ingredient, setIngredient] = useState('');

    return (
        <div className="card flex justify-content-center">
            <div className="flex flex-wrap gap-3">
                <div className="flex align-items-center">
                    <RadioButton inputId="ingredient1" name="pizza" value="Cheese" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Cheese'} />
                    <label htmlFor="ingredient1" className="ml-2">Cheese</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="ingredient2" name="pizza" value="Mushroom" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Mushroom'} />
                    <label htmlFor="ingredient2" className="ml-2">Mushroom</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="ingredient3" name="pizza" value="Pepper" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Pepper'} />
                    <label htmlFor="ingredient3" className="ml-2">Pepper</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="ingredient4" name="pizza" value="Onion" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Onion'} />
                    <label htmlFor="ingredient4" className="ml-2">Onion</label>
                </div>
            </div>
        </div>
    );
}
```

---

### **1️⃣5️⃣ SelectButton**

```tsx
import React, { useState } from "react";
import { SelectButton } from 'primereact/selectbutton';

export default function BasicDemo() {
    const options = ['Off', 'On'];
    const [value, setValue] = useState(options[0]);

    return (
        <div className="card flex justify-content-center">
            <SelectButton value={value} onChange={(e) => setValue(e.value)} options={options} />
        </div>
    );
}
```

---

### **1️⃣6️⃣ IconField**

```tsx
import React from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export default function BasicDemo() {
    return (
        <div className="flex gap-3">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText placeholder="Search" />
            </IconField>

            <IconField>
                <InputIcon className="pi pi-spin pi-spinner"> </InputIcon>
                <InputText />
            </IconField>
        </div>
    )
}
```

---

### **1️⃣7️⃣ InputGroup - Basic**

```tsx
import React from 'react'; 
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

export default function BasicDemo() {
    return (
        <div className="card flex flex-column md:flex-row gap-3">
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                </span>
                <InputText placeholder="Username" />
            </div>

            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">$</span>
                <InputNumber placeholder="Price" />
                <span className="p-inputgroup-addon">.00</span>
            </div>

            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">www</span>
                <InputText placeholder="Website" />
            </div>
        </div>
    )
}
```

---

### **1️⃣8️⃣ InputGroup - Button**

```tsx
import React from 'react'; 
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function ButtonDemo() {
    return (
        <div className="card flex flex-column md:flex-row gap-3">
            <div className="p-inputgroup flex-1">
                <Button label="Search" />
                <InputText placeholder="Keyword" />
            </div>

            <div className="p-inputgroup flex-1">
                <InputText placeholder="Keyword" />
                <Button icon="pi pi-search" className="p-button-warning" />
            </div>

            <div className="p-inputgroup flex-1">
                <Button icon="pi pi-check" className="p-button-success" />
                <InputText placeholder="Vote" />
                <Button icon="pi pi-times" className="p-button-danger" />
            </div>
        </div>
    )
}
```

---

## 📋 **المكونات المضافة:**

```
✅ RadioButton - للاختيارات المتعددة
✅ SelectButton - toggle buttons
✅ IconField - حقول مع أيقونات
✅ InputGroup - حقول مع addons
✅ InputGroup + Button - حقول مع أزرار
```

---

**تم حفظ جميع المكونات! ✅**

**المجموع الآن: 18 مكون PrimeReact!** 🚀
