# 📋 Variables Guide - WaQtor Dashboard

## 🎯 What are Variables?

Variables are **dynamic placeholders** that get replaced with actual data when sending messages. They allow you to personalize bulk messages for each recipient.

---

## 📊 Available Variables

### 👤 **Personal Information**
| Variable | Description | Example Output |
|----------|-------------|----------------|
| `{name}` | Recipient's full name | "Ahmed Mohamed" |
| `{phone}` | Phone number | "+201234567890" |
| `{email}` | Email address | "ahmed@example.com" |

**Use Case:** Personalized greetings
```
Hello {name}! 👋
We're reaching out to you at {phone}
```

---

### 💼 **Business Information**
| Variable | Description | Example Output |
|----------|-------------|----------------|
| `{company}` | Company/Business name | "Tech Solutions Ltd" |
| `{position}` | Job title/position | "Marketing Manager" |
| `{order_id}` | Order/Invoice number | "ORD-2025-001" |
| `{amount}` | Payment/Order amount | "$299.99" |
| `{product}` | Product/Service name | "Premium Package" |

**Use Case:** Business communications
```
Dear {name} from {company},

Your order #{order_id} for {product} 
Total: {amount}

Thank you for your business! 💼
```

---

### 📅 **Date & Time**
| Variable | Description | Example Output |
|----------|-------------|----------------|
| `{date}` | Current date | "29/10/2025" |
| `{time}` | Current time | "10:30 PM" |
| `{day}` | Day of week | "Tuesday" |
| `{month}` | Month name | "October" |
| `{year}` | Current year | "2025" |

**Use Case:** Time-sensitive messages
```
📆 Reminder for {day}, {date}
Meeting scheduled at {time}

See you there! ⏰
```

---

### ⚙️ **Custom Fields**
| Variable | Description | Use For |
|----------|-------------|---------|
| `{custom1}` | Custom field 1 | Any custom data |
| `{custom2}` | Custom field 2 | Any custom data |
| `{custom3}` | Custom field 3 | Any custom data |
| `{link}` | Custom URL/Link | Website, payment link, etc. |

**Use Case:** Flexible customization
```
Hi {name}! 🎉

Special offer just for you:
{custom1}

Click here: {link}
```

---

## 💡 **How to Use Variables**

### 1️⃣ **In Message Composer**
- Click any variable button to insert it into your message
- Variables are organized by category for easy access
- Hover over any variable to see its description

### 2️⃣ **In Recipients Table**
- Add recipients with their data (name, phone, custom fields)
- Import from CSV/JSON with all variable data
- Each recipient can have different values

### 3️⃣ **When Sending**
- Variables are automatically replaced with actual data
- Each recipient gets a personalized message
- Preview shows how variables will look

---

## 📝 **Best Practices**

### ✅ **DO:**
- Use variables to personalize messages
- Test with a small group first
- Keep variable names consistent in your data
- Use descriptive custom field names

### ❌ **DON'T:**
- Use variables without providing data
- Mix up variable names
- Forget to test before bulk sending
- Use sensitive data in custom fields

---

## 🎨 **Example Templates**

### **Welcome Message**
```
👋 Welcome {name}!

Thank you for joining {company}!

Your account is now active.
Login: {email}
Date: {date}

Need help? Reply to this message! 💬
```

### **Order Confirmation**
```
✅ Order Confirmed!

Hi {name},

Order ID: {order_id}
Product: {product}
Amount: {amount}
Date: {date} at {time}

Track your order: {link}

Thank you for shopping with us! 🛍️
```

### **Appointment Reminder**
```
📅 Appointment Reminder

Hello {name},

You have an appointment on:
{day}, {date} at {time}

Location: {custom1}
With: {custom2}

See you soon! 👋
```

### **Payment Request**
```
💰 Payment Due

Dear {name} ({company}),

Invoice: {order_id}
Amount: {amount}
Due Date: {date}

Pay now: {link}

Questions? Contact us! 📞
```

---

## 🔧 **Advanced Usage**

### **Combining Variables**
```
Hi {name}! 🎉

Your {product} order ({order_id}) 
placed on {date} at {time}
is ready for pickup!

Total: {amount}
Location: {custom1}

See you on {day}! 🚀
```

### **Conditional Content**
Use custom fields for conditional content:
- `{custom1}` = VIP status
- `{custom2}` = Discount code
- `{custom3}` = Special instructions

```
Hello {name}! ⭐

{custom1} Member Benefits:
- Exclusive discount: {custom2}
- {custom3}

Shop now: {link}
```

---

## 📊 **Data Import Format**

### **CSV Example:**
```csv
phone,name,email,company,custom1,custom2
+201234567890,Ahmed,ahmed@example.com,Tech Co,VIP,SAVE20
+201234567891,Sara,sara@example.com,Design Ltd,Regular,SAVE10
```

### **JSON Example:**
```json
[
  {
    "phone": "+201234567890",
    "name": "Ahmed",
    "email": "ahmed@example.com",
    "company": "Tech Co",
    "custom1": "VIP",
    "custom2": "SAVE20"
  }
]
```

---

## 🎯 **Tips for Success**

1. **Start Simple:** Use basic variables first ({name}, {phone})
2. **Test First:** Send to yourself before bulk sending
3. **Keep Data Clean:** Ensure all recipient data is accurate
4. **Use Emojis:** Make messages more engaging 😊
5. **Track Results:** Monitor delivery and read rates

---

## 🆘 **Troubleshooting**

**Q: Variable not replaced?**
- Check if recipient has that data field
- Verify variable name spelling
- Ensure data is imported correctly

**Q: Empty values showing?**
- Provide default values in your data
- Use only variables you have data for

**Q: How to add more variables?**
- Use custom1, custom2, custom3 for any data
- Import CSV with additional columns

---

## 📞 **Support**

Need help? Contact support or check the documentation!

**Happy Messaging! 🚀**
