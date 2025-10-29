# 📱 WhatsApp Groups Integration - Technical Guide

## ✅ نعم، يمكن التكامل مع Groups بالكامل!

### **ما يمكن فعله مع Groups:**

#### 1️⃣ **التعرف على Groups**
```javascript
// Get all groups you're part of
const chats = await client.getChats();
const groups = chats.filter(chat => chat.isGroup);

groups.forEach(group => {
    console.log({
        id: group.id._serialized,        // 120363123456789@g.us
        name: group.name,                 // "فريق العمل"
        participants: group.participants.length,
        isAdmin: group.participants.find(p => 
            p.id._serialized === myNumber && p.isAdmin
        )
    });
});
```

**Output Example:**
```json
{
  "id": "120363123456789@g.us",
  "name": "فريق العمل - المشروع الجديد",
  "participants": 15,
  "isAdmin": true
}
```

---

#### 2️⃣ **إرسال رسائل للـ Groups**
```javascript
// Send to specific group
const groupId = '120363123456789@g.us';
await client.sendMessage(groupId, 'تحديث: تم إنجاز المهمة ✅');

// Send with media
const media = MessageMedia.fromFilePath('./report.pdf');
await client.sendMessage(groupId, media, {
    caption: '📊 تقرير الأسبوع'
});

// Mention specific members
await client.sendMessage(groupId, '@201229609292 @971505121583 تفضلوا', {
    mentions: [
        await client.getContactById('201229609292@c.us'),
        await client.getContactById('971505121583@c.us')
    ]
});
```

---

#### 3️⃣ **استقبال رسائل من Groups**
```javascript
client.on('message', async (message) => {
    const chat = await message.getChat();
    
    if (chat.isGroup) {
        console.log({
            groupName: chat.name,
            groupId: chat.id._serialized,
            sender: message.author,           // من أرسل الرسالة
            senderName: message._data.notifyName,
            message: message.body,
            timestamp: message.timestamp
        });
        
        // Check if you're mentioned
        const mentionedIds = await message.getMentions();
        const isMentioned = mentionedIds.some(m => m.isMe);
        
        if (isMentioned) {
            await message.reply('نعم، أنا هنا! 👋');
        }
    }
});
```

---

#### 4️⃣ **إدارة Groups (إذا كنت Admin)**
```javascript
// Add participant
await group.addParticipants(['201229609292@c.us']);

// Remove participant
await group.removeParticipants(['201229609292@c.us']);

// Promote to admin
await group.promoteParticipants(['201229609292@c.us']);

// Demote from admin
await group.demoteParticipants(['201229609292@c.us']);

// Change group subject
await group.setSubject('فريق العمل - Q1 2025');

// Change group description
await group.setDescription('مجموعة متابعة المشاريع');

// Get group invite link
const inviteCode = await group.getInviteCode();
console.log(`https://chat.whatsapp.com/${inviteCode}`);

// Leave group
await group.leave();
```

---

#### 5️⃣ **معلومات تفصيلية عن Group**
```javascript
const group = await client.getChatById('120363123456789@g.us');

console.log({
    name: group.name,
    description: group.description,
    owner: group.owner._serialized,
    createdAt: group.createdAt,
    participants: group.participants.map(p => ({
        id: p.id._serialized,
        isAdmin: p.isAdmin,
        isSuperAdmin: p.isSuperAdmin
    })),
    
    // Group settings
    announce: group.groupMetadata.announce,  // Only admins can send
    restrict: group.groupMetadata.restrict,  // Only admins can edit info
    
    // Unread messages
    unreadCount: group.unreadCount,
    
    // Last message
    lastMessage: group.lastMessage
});
```

---

## 🎯 **حالات استخدام عملية**

### **Use Case 1: متابعة سير العمل**
```javascript
// Monitor work progress in team group
client.on('message', async (message) => {
    const chat = await message.getChat();
    
    if (chat.isGroup && chat.name.includes('فريق العمل')) {
        // Track keywords
        if (message.body.includes('تم إنجاز')) {
            // Log to database
            await logTaskCompletion({
                groupId: chat.id._serialized,
                groupName: chat.name,
                completedBy: message.author,
                task: message.body,
                timestamp: new Date()
            });
            
            // Send confirmation
            await message.reply('✅ تم تسجيل الإنجاز');
        }
        
        if (message.body.includes('مشكلة') || message.body.includes('عطل')) {
            // Alert admin
            await client.sendMessage('ADMIN_NUMBER@c.us', 
                `⚠️ مشكلة في ${chat.name}:\n${message.body}`
            );
        }
    }
});
```

---

### **Use Case 2: إرسال تحديثات منتظمة**
```javascript
// Daily standup reminder
cron.schedule('0 9 * * 1-5', async () => {
    const workGroups = [
        '120363123456789@g.us',  // فريق التطوير
        '120363987654321@g.us'   // فريق التسويق
    ];
    
    for (const groupId of workGroups) {
        await client.sendMessage(groupId, 
            '🌅 صباح الخير!\n\n' +
            'وقت الـ Daily Standup:\n' +
            '1️⃣ ماذا أنجزت أمس؟\n' +
            '2️⃣ ماذا ستنجز اليوم؟\n' +
            '3️⃣ هل هناك معوقات؟'
        );
    }
});
```

---

### **Use Case 3: Bot ذكي للـ Group**
```javascript
client.on('message', async (message) => {
    const chat = await message.getChat();
    
    if (!chat.isGroup) return;
    
    const text = message.body.toLowerCase();
    
    // Commands
    if (text === '!help') {
        await message.reply(
            '🤖 الأوامر المتاحة:\n' +
            '!status - حالة المشروع\n' +
            '!tasks - المهام المعلقة\n' +
            '!report - تقرير اليوم'
        );
    }
    
    if (text === '!status') {
        const status = await getProjectStatus();
        await message.reply(`📊 ${status}`);
    }
    
    if (text === '!tasks') {
        const tasks = await getPendingTasks();
        await message.reply(`📝 المهام:\n${tasks.join('\n')}`);
    }
    
    // Auto-reply to questions
    if (text.includes('متى الاجتماع')) {
        await message.reply('📅 الاجتماع القادم: الأحد 10 صباحاً');
    }
});
```

---

### **Use Case 4: تحليل نشاط الـ Group**
```javascript
// Track group activity
const groupAnalytics = {
    messageCount: {},
    activeMembers: {},
    keywords: {}
};

client.on('message', async (message) => {
    const chat = await message.getChat();
    
    if (chat.isGroup) {
        const groupId = chat.id._serialized;
        
        // Count messages
        groupAnalytics.messageCount[groupId] = 
            (groupAnalytics.messageCount[groupId] || 0) + 1;
        
        // Track active members
        const sender = message.author;
        if (!groupAnalytics.activeMembers[groupId]) {
            groupAnalytics.activeMembers[groupId] = {};
        }
        groupAnalytics.activeMembers[groupId][sender] = 
            (groupAnalytics.activeMembers[groupId][sender] || 0) + 1;
        
        // Track keywords
        const keywords = ['مشكلة', 'تم', 'عاجل', 'مهم'];
        keywords.forEach(keyword => {
            if (message.body.includes(keyword)) {
                if (!groupAnalytics.keywords[keyword]) {
                    groupAnalytics.keywords[keyword] = 0;
                }
                groupAnalytics.keywords[keyword]++;
            }
        });
    }
});

// Generate daily report
cron.schedule('0 18 * * *', async () => {
    const report = generateGroupReport(groupAnalytics);
    await client.sendMessage('ADMIN_NUMBER@c.us', report);
});
```

---

## 🏗️ **كيفية التكامل في النظام الحالي**

### **1. إضافة Group Management Routes**
```javascript
// /runtime/server/routes/groups.js
const express = require('express');
const router = express.Router();

/**
 * GET /api/groups
 * Get all groups
 */
router.get('/', async (req, res) => {
    try {
        const waClient = req.app.get('waClient');
        const client = waClient.getClient();
        
        const chats = await client.getChats();
        const groups = chats.filter(chat => chat.isGroup);
        
        const groupsData = groups.map(group => ({
            id: group.id._serialized,
            name: group.name,
            description: group.description,
            participantsCount: group.participants.length,
            isAdmin: group.participants.some(p => 
                p.id._serialized === client.info.wid._serialized && p.isAdmin
            ),
            unreadCount: group.unreadCount,
            lastMessage: group.lastMessage?.body,
            lastMessageTime: group.lastMessage?.timestamp
        }));
        
        res.json({
            success: true,
            data: groupsData,
            count: groupsData.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/groups/:id/send
 * Send message to group
 */
router.post('/:id/send', async (req, res) => {
    try {
        const { message, mentions } = req.body;
        const groupId = req.params.id;
        
        const waClient = req.app.get('waClient');
        const client = waClient.getClient();
        
        const options = {};
        if (mentions && mentions.length > 0) {
            options.mentions = await Promise.all(
                mentions.map(id => client.getContactById(id))
            );
        }
        
        await client.sendMessage(groupId, message, options);
        
        res.json({
            success: true,
            message: 'Message sent to group'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/groups/:id/participants
 * Get group participants
 */
router.get('/:id/participants', async (req, res) => {
    try {
        const groupId = req.params.id;
        
        const waClient = req.app.get('waClient');
        const client = waClient.getClient();
        
        const chat = await client.getChatById(groupId);
        
        const participants = chat.participants.map(p => ({
            id: p.id._serialized,
            isAdmin: p.isAdmin,
            isSuperAdmin: p.isSuperAdmin
        }));
        
        res.json({
            success: true,
            data: participants,
            count: participants.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
```

---

### **2. إضافة Group Service**
```javascript
// /runtime/server/services/groupService.js
class GroupService {
    constructor(waClient) {
        this.waClient = waClient;
        this.client = null;
    }
    
    async initialize() {
        this.client = this.waClient.getClient();
        this.setupGroupListeners();
    }
    
    setupGroupListeners() {
        // Listen to group messages
        this.client.on('message', async (message) => {
            const chat = await message.getChat();
            
            if (chat.isGroup) {
                await this.handleGroupMessage(message, chat);
            }
        });
        
        // Listen to group join
        this.client.on('group_join', async (notification) => {
            console.log('Joined group:', notification.chatId);
        });
        
        // Listen to group leave
        this.client.on('group_leave', async (notification) => {
            console.log('Left group:', notification.chatId);
        });
    }
    
    async handleGroupMessage(message, chat) {
        // Log group activity
        console.log({
            group: chat.name,
            sender: message.author,
            message: message.body
        });
        
        // Check for commands
        if (message.body.startsWith('!')) {
            await this.handleCommand(message, chat);
        }
    }
    
    async handleCommand(message, chat) {
        const command = message.body.toLowerCase();
        
        switch (command) {
            case '!ping':
                await message.reply('🏓 Pong!');
                break;
                
            case '!info':
                await message.reply(
                    `📊 معلومات المجموعة:\n` +
                    `الاسم: ${chat.name}\n` +
                    `الأعضاء: ${chat.participants.length}`
                );
                break;
        }
    }
    
    async getAllGroups() {
        const chats = await this.client.getChats();
        return chats.filter(chat => chat.isGroup);
    }
    
    async sendToGroup(groupId, message) {
        await this.client.sendMessage(groupId, message);
    }
}

module.exports = GroupService;
```

---

### **3. إضافة Frontend للـ Groups**
```typescript
// /dashboard/src/app/(main)/groups/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messageDialog, setMessageDialog] = useState(false);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        loadGroups();
    }, []);
    
    const loadGroups = async () => {
        const response = await fetch('/api/groups');
        const data = await response.json();
        setGroups(data.data);
    };
    
    const sendMessage = async () => {
        await fetch(`/api/groups/${selectedGroup.id}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        setMessageDialog(false);
        setMessage('');
    };
    
    return (
        <div>
            <h1>WhatsApp Groups</h1>
            
            <DataTable value={groups}>
                <Column field="name" header="Group Name" />
                <Column field="participantsCount" header="Members" />
                <Column field="isAdmin" header="Admin" body={(row) => 
                    row.isAdmin ? '✅' : '❌'
                } />
                <Column body={(row) => (
                    <Button 
                        label="Send Message"
                        onClick={() => {
                            setSelectedGroup(row);
                            setMessageDialog(true);
                        }}
                    />
                )} />
            </DataTable>
            
            <Dialog 
                visible={messageDialog}
                onHide={() => setMessageDialog(false)}
                header="Send to Group"
            >
                <InputTextarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    style={{ width: '100%' }}
                />
                <Button label="Send" onClick={sendMessage} />
            </Dialog>
        </div>
    );
}
```

---

## 📊 **ملخص الإمكانيات**

| الميزة | ممكن؟ | ملاحظات |
|--------|-------|---------|
| التعرف على Groups | ✅ نعم | كل الـ groups اللي أنت فيها |
| إرسال رسائل | ✅ نعم | نص، صور، ملفات، mentions |
| استقبال رسائل | ✅ نعم | كل رسالة في الـ group |
| معرفة من أرسل | ✅ نعم | `message.author` |
| معرفة إذا كنت Admin | ✅ نعم | `participant.isAdmin` |
| إضافة/حذف أعضاء | ✅ نعم | إذا كنت admin |
| تغيير اسم/وصف | ✅ نعم | إذا كنت admin |
| Mention أعضاء | ✅ نعم | `@username` |
| الرد على رسائل محددة | ✅ نعم | `message.reply()` |
| تتبع نشاط الـ group | ✅ نعم | كل الرسائل والأحداث |
| Bot commands | ✅ نعم | `!command` |
| تحليلات | ✅ نعم | عدد الرسائل، أنشط الأعضاء |
| جدولة رسائل | ✅ نعم | cron jobs |

---

## 🚀 **الخطوات التالية**

1. **إضافة Groups Routes** في `/runtime/server/routes/groups.js`
2. **إضافة Group Service** في `/runtime/server/services/groupService.js`
3. **تسجيل الـ routes** في `server/index.js`
4. **إضافة Frontend** في `/dashboard/src/app/(main)/groups/`
5. **إضافة API services** في `/dashboard/src/api/services.js`

**هل تريد البدء في التنفيذ؟ 🎯**
