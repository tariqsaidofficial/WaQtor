# 🏡 المرحلة 12: Real Estate Engagement

**الحالة:** 📋 **TODO - جاهز للتنفيذ**  
**الأولوية:** 🟠 **عالية - Business Feature**  
**الصعوبة:** ⚠️ **متوسطة - يحتاج integration**

---

## 🎯 الهدف

إنشاء نظام متكامل لـ **Real Estate Marketing & Lead Management** عبر WhatsApp، مستوحى من أفضل الممارسات في الصناعة (مثل WANotifier).

---

## ✅ الميزات المتاحة حالياً

### 1. Buttons & Lists ✅

```javascript
const { Buttons, List } = require('waqtor');

// Property Listing with Buttons (كما في الصورة المرفقة)
const propertyButtons = new Buttons(
    '🏠 *New Property Listings - UrbanNest Realty*\n\n' +
    'Looking for your dream home? 🏘️\n' +
    'Check out our latest residential listings in prime locations—perfect for families, professionals, and investors.\n\n' +
    '🏢 *2 & 3 BHK Apartments*\n' +
    '📍 *Locations:* Gurgaon, Noida, Bangalore\n' +
    '💰 *Starting at ₹45 Lakhs*\n\n' +
    'Find your perfect space today!',
    [
        { body: '📋 View Listings' },
        { body: '💬 Talk to Agent' },
        { body: '📅 Book a Visit' }
    ],
    'UrbanNest Realty'
);

await client.sendMessage(chatId, propertyButtons);

// Property List with Multiple Options
const propertyList = new List(
    '🏠 *Select Property Type*\n\nChoose from our available properties:',
    'View Properties',
    [
        {
            title: 'Apartments',
            rows: [
                { 
                    title: '2 BHK - Gurgaon', 
                    description: '₹45L - 1200 sqft - Ready to Move' 
                },
                { 
                    title: '3 BHK - Noida', 
                    description: '₹65L - 1800 sqft - Under Construction' 
                },
                { 
                    title: '4 BHK - Bangalore', 
                    description: '₹95L - 2400 sqft - Premium' 
                }
            ]
        },
        {
            title: 'Villas',
            rows: [
                { 
                    title: '4 BHK Villa - Bangalore', 
                    description: '₹1.2Cr - 3000 sqft - Luxury' 
                },
                { 
                    title: '5 BHK Villa - Gurgaon', 
                    description: '₹2.5Cr - 4500 sqft - Ultra Luxury' 
                }
            ]
        },
        {
            title: 'Plots',
            rows: [
                { 
                    title: 'Residential Plot - Noida', 
                    description: '₹35L - 1000 sqft' 
                }
            ]
        }
    ],
    'UrbanNest Realty'
);

await client.sendMessage(chatId, propertyList);
```

### 2. Location Sharing ✅

```javascript
const { Location } = require('waqtor');

// Send Property Location
const propertyLocation = new Location(
    28.4595, 77.0266,  // Gurgaon coordinates
    'UrbanNest Realty - Gurgaon Office\n' +
    '📍 Sector 29, Gurgaon\n' +
    '🕐 Open: 9 AM - 6 PM\n' +
    '📞 +91 98765 43210'
);

await client.sendMessage(chatId, propertyLocation);

// Send Property Site Location
const siteLocation = new Location(
    28.4123, 77.0456,
    '🏗️ Ellington Resort - Dubai Islands\n' +
    '📍 Dubai Islands, UAE\n' +
    '🏠 Luxury 1-5 BR Apartments\n' +
    '💰 Starting at AED 1.2M'
);

await client.sendMessage(chatId, siteLocation);
```

### 3. Media Messages ✅

```javascript
const { MessageMedia } = require('waqtor');

// Send Property Image
const propertyImage = MessageMedia.fromFilePath('./property-images/apartment-2bhk.jpg');
await client.sendMessage(chatId, propertyImage, {
    caption: 
        '🏠 *2 BHK Apartment - Gurgaon*\n\n' +
        '📐 Area: 1200 sqft\n' +
        '💰 Price: ₹45 Lakhs\n' +
        '📍 Location: Sector 29, Gurgaon\n' +
        '🏗️ Status: Ready to Move\n' +
        '🅿️ Parking: 1 Covered\n' +
        '🏊 Amenities: Pool, Gym, Club\n\n' +
        'Contact us for site visit!'
});

// Send Property Video Tour
const propertyVideo = MessageMedia.fromFilePath('./property-videos/360-tour.mp4');
await client.sendMessage(chatId, propertyVideo, {
    caption: '🎥 *360° Virtual Tour*\n3 BHK Luxury Apartment - Bangalore'
});

// Send Property Brochure (PDF) - كما في الصورة
const brochure = MessageMedia.fromFilePath('./brochures/ellington-resort.pdf');
await client.sendMessage(chatId, brochure, {
    caption: 
        '📄 *Ellington Resort Brochure*\n\n' +
        '🏝️ Style Living on Dubai Islands\n' +
        '🏠 Luxury 1-5 BR Apartments\n' +
        '🌊 Mid-Rise Waterfront Community\n' +
        '🏖️ Direct Access to Private Beach\n\n' +
        'Download the brochure for full details!'
});

// Send Floor Plan
const floorPlan = MessageMedia.fromFilePath('./floor-plans/2bhk-plan.jpg');
await client.sendMessage(chatId, floorPlan, {
    caption: '📐 *2 BHK Floor Plan*\n1200 sqft - Optimized Layout'
});
```

### 4. Scheduled Messages (Drip Campaigns) ✅

```javascript
// Property Launch Drip Campaign
const campaign = {
    name: 'Ellington Resort Launch Campaign',
    recipients: leadsList,
    messages: [
        {
            delay: 0,  // Immediate
            content: 
                '🏝️ *Exciting News!*\n\n' +
                'Ellington Resort - Style Living on Dubai Islands is now open for bookings!\n\n' +
                'Luxury 1-5 BR Apartments starting at AED 1.2M\n\n' +
                'Limited units available!'
        },
        {
            delay: 24 * 60 * 60 * 1000,  // After 24 hours
            content: 
                '📅 *Book Your Site Visit*\n\n' +
                'Experience luxury living firsthand!\n\n' +
                'Available slots:\n' +
                '• Morning: 10 AM - 12 PM\n' +
                '• Afternoon: 2 PM - 4 PM\n' +
                '• Evening: 5 PM - 7 PM\n\n' +
                'Reply with your preferred time!'
        },
        {
            delay: 72 * 60 * 60 * 1000,  // After 3 days
            content: 
                '💰 *Limited Time Offer!*\n\n' +
                '🎁 Early Bird Discount: 10% OFF\n' +
                '🎁 Free Registration\n' +
                '🎁 Flexible Payment Plans\n\n' +
                'Offer valid till end of month!\n\n' +
                'Book now to secure your dream home!'
        },
        {
            delay: 7 * 24 * 60 * 60 * 1000,  // After 7 days
            content: 
                '⏰ *Last Chance!*\n\n' +
                'Only 5 units left in your preferred configuration!\n\n' +
                'Don\'t miss out on this opportunity.\n\n' +
                'Call us now: +971 50 123 4567'
        }
    ]
};

// Schedule the campaign
await campaignService.scheduleCampaign(campaign);
```

### 5. Interactive Bot ✅

```javascript
// Auto-respond to Property Inquiries
client.on('message', async (message) => {
    const text = message.body.toLowerCase();
    
    // Price Inquiry
    if (text.includes('price') || text.includes('cost') || text.includes('budget')) {
        await message.reply(
            '💰 *Pricing Information*\n\n' +
            '2 BHK: ₹45L - ₹55L\n' +
            '3 BHK: ₹65L - ₹85L\n' +
            '4 BHK: ₹95L - ₹1.2Cr\n' +
            'Villas: ₹1.2Cr - ₹2.5Cr\n\n' +
            'Would you like to schedule a visit?'
        );
    }
    
    // Site Visit Request
    if (text.includes('visit') || text.includes('viewing') || text.includes('tour')) {
        const buttons = new Buttons(
            '📅 *Schedule Site Visit*\n\n' +
            'Choose your preferred time:',
            [
                { body: '🌅 Morning (10 AM - 12 PM)' },
                { body: '☀️ Afternoon (2 PM - 4 PM)' },
                { body: '🌆 Evening (5 PM - 7 PM)' }
            ]
        );
        await client.sendMessage(message.from, buttons);
    }
    
    // Location Request
    if (text.includes('location') || text.includes('address') || text.includes('where')) {
        const location = new Location(
            28.4595, 77.0266,
            'UrbanNest Realty - Gurgaon Office\n📍 Sector 29, Gurgaon'
        );
        await client.sendMessage(message.from, location);
    }
    
    // Brochure Request
    if (text.includes('brochure') || text.includes('catalog') || text.includes('details')) {
        const brochure = MessageMedia.fromFilePath('./brochures/property-catalog.pdf');
        await client.sendMessage(message.from, brochure, {
            caption: '📄 Here\'s our complete property catalog!'
        });
    }
    
    // Agent Contact
    if (text.includes('agent') || text.includes('talk') || text.includes('call')) {
        await message.reply(
            '👤 *Connect with Our Agent*\n\n' +
            '📞 Call: +91 98765 43210\n' +
            '📧 Email: sales@urbannest.com\n' +
            '💬 WhatsApp: Available 24/7\n\n' +
            'Our agent will contact you within 15 minutes!'
        );
    }
});
```

---

## 📋 الميزات الجديدة المطلوبة

### 1. Property Catalog System

**الملف:** `/runtime/server/models/Property.js` (NEW)

```javascript
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['apartment', 'villa', 'plot', 'commercial'],
        required: true 
    },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    sqft: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    location: {
        city: String,
        area: String,
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    images: [String],
    video: String,
    brochure: String,
    floorPlan: String,
    status: { 
        type: String, 
        enum: ['available', 'sold', 'reserved', 'under_construction'],
        default: 'available'
    },
    amenities: [String],
    features: {
        parking: Number,
        balconies: Number,
        furnished: Boolean,
        facing: String
    },
    developer: String,
    possession: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);
```

**الملف:** `/runtime/server/routes/property.js` (NEW)

```javascript
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { MessageMedia, Buttons, List } = require('../../../index');
const waClientManager = require('../waClient');

/**
 * Send property catalog to lead
 * POST /api/property/send-catalog
 */
router.post('/send-catalog', async (req, res) => {
    try {
        const { clientId = 'default', phone, propertyIds, includeButtons = true } = req.body;
        
        const waClient = waClientManager.getClient(clientId);
        const client = waClient.getClient();
        const chatId = phone.includes('@') ? phone : `${phone}@c.us`;
        
        // Get properties
        const properties = await Property.find({ id: { $in: propertyIds } });
        
        for (const property of properties) {
            // Send image
            if (property.images && property.images.length > 0) {
                const image = MessageMedia.fromFilePath(property.images[0]);
                await client.sendMessage(chatId, image, {
                    caption: formatPropertyDetails(property)
                });
            }
            
            // Send buttons
            if (includeButtons) {
                const buttons = new Buttons(
                    'Interested in this property?',
                    [
                        { body: '📋 View Details' },
                        { body: '📅 Book Visit' },
                        { body: '📄 Get Brochure' },
                        { body: '💬 Talk to Agent' }
                    ]
                );
                await client.sendMessage(chatId, buttons);
            }
            
            // Small delay between properties
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        res.json({
            success: true,
            message: `Sent ${properties.length} properties to ${phone}`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Format property details for WhatsApp
 */
function formatPropertyDetails(property) {
    return (
        `🏠 *${property.title}*\n\n` +
        `📐 Area: ${property.sqft} sqft\n` +
        `💰 Price: ${property.currency} ${property.price.toLocaleString()}\n` +
        `📍 Location: ${property.location.area}, ${property.location.city}\n` +
        `🛏️ Bedrooms: ${property.bedrooms}\n` +
        `🚿 Bathrooms: ${property.bathrooms}\n` +
        `🏗️ Status: ${property.status.replace('_', ' ').toUpperCase()}\n` +
        `🅿️ Parking: ${property.features.parking} Covered\n\n` +
        `✨ Amenities: ${property.amenities.join(', ')}\n\n` +
        `Contact us for more details!`
    );
}

module.exports = router;
```

---

### 2. Lead Capture & Qualification System

**الملف:** `/runtime/server/models/Lead.js` (NEW)

```javascript
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    name: String,
    email: String,
    source: { 
        type: String, 
        enum: ['whatsapp', 'website', 'facebook', 'instagram', 'referral'],
        default: 'whatsapp'
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'hot', 'warm', 'cold', 'converted', 'lost'],
        default: 'new'
    },
    qualification: {
        budget: { min: Number, max: Number },
        location: [String],
        propertyType: [String],
        bedrooms: Number,
        timeline: String,  // 'immediate', '1-3months', '3-6months', '6+months'
        purpose: String    // 'self-use', 'investment', 'rental'
    },
    interactions: [{
        type: { type: String },
        message: String,
        timestamp: { type: Date, default: Date.now },
        agent: String
    }],
    assignedAgent: String,
    interestedProperties: [String],
    scheduledVisits: [{
        propertyId: String,
        date: Date,
        status: { type: String, enum: ['scheduled', 'completed', 'cancelled'] }
    }],
    notes: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
```

**الملف:** `/runtime/server/services/leadService.js` (NEW)

```javascript
const Lead = require('../models/Lead');
const logger = require('../utils/logger');

class LeadService {
    /**
     * Capture lead from WhatsApp message
     */
    async captureLeadFromMessage(message) {
        try {
            const phone = message.from;
            const name = message._data.notifyName || 'Unknown';
            
            // Check if lead exists
            let lead = await Lead.findOne({ phone });
            
            if (!lead) {
                // Create new lead
                lead = new Lead({
                    phone,
                    name,
                    source: 'whatsapp',
                    status: 'new'
                });
            }
            
            // Add interaction
            lead.interactions.push({
                type: 'message',
                message: message.body,
                timestamp: new Date()
            });
            
            // Qualify lead
            const qualification = await this.qualifyLead(message.body);
            if (qualification) {
                lead.qualification = { ...lead.qualification, ...qualification };
                lead.status = qualification.isHot ? 'hot' : 'warm';
            }
            
            lead.updatedAt = new Date();
            await lead.save();
            
            logger.info(`Lead captured: ${phone} - Status: ${lead.status}`);
            
            // Notify agent if hot lead
            if (qualification && qualification.isHot) {
                await this.notifyAgentOfHotLead(lead);
            }
            
            return lead;
        } catch (error) {
            logger.error('Error capturing lead:', error);
            throw error;
        }
    }
    
    /**
     * Qualify lead based on message content
     */
    async qualifyLead(messageText) {
        const text = messageText.toLowerCase();
        
        // Hot keywords
        const hotKeywords = ['buy', 'purchase', 'invest', 'urgent', 'cash', 'ready', 'immediately'];
        const isHot = hotKeywords.some(kw => text.includes(kw));
        
        // Extract budget
        const budget = this.extractBudget(text);
        
        // Extract location
        const location = this.extractLocation(text);
        
        // Extract property type
        const propertyType = this.extractPropertyType(text);
        
        // Extract bedrooms
        const bedrooms = this.extractBedrooms(text);
        
        return {
            isHot,
            budget,
            location,
            propertyType,
            bedrooms
        };
    }
    
    /**
     * Extract budget from text
     */
    extractBudget(text) {
        // Match patterns like "45 lakhs", "1.2 crore", "50L", "1Cr"
        const lakhsMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakhs?|l)/i);
        const croreMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:crores?|cr)/i);
        
        if (croreMatch) {
            const amount = parseFloat(croreMatch[1]) * 10000000;
            return { min: amount * 0.9, max: amount * 1.1 };
        }
        
        if (lakhsMatch) {
            const amount = parseFloat(lakhsMatch[1]) * 100000;
            return { min: amount * 0.9, max: amount * 1.1 };
        }
        
        return null;
    }
    
    /**
     * Extract location from text
     */
    extractLocation(text) {
        const locations = ['gurgaon', 'noida', 'bangalore', 'mumbai', 'delhi', 'pune', 'hyderabad'];
        const found = locations.filter(loc => text.includes(loc));
        return found.length > 0 ? found : null;
    }
    
    /**
     * Extract property type from text
     */
    extractPropertyType(text) {
        const types = [];
        if (text.includes('apartment') || text.includes('flat')) types.push('apartment');
        if (text.includes('villa') || text.includes('bungalow')) types.push('villa');
        if (text.includes('plot') || text.includes('land')) types.push('plot');
        return types.length > 0 ? types : null;
    }
    
    /**
     * Extract bedrooms from text
     */
    extractBedrooms(text) {
        const match = text.match(/(\d+)\s*bhk/i);
        return match ? parseInt(match[1]) : null;
    }
    
    /**
     * Notify agent of hot lead
     */
    async notifyAgentOfHotLead(lead) {
        // Implementation depends on agent assignment system
        logger.info(`🔥 Hot lead detected: ${lead.phone}`);
        // Send notification to agent via WhatsApp/Email/SMS
    }
}

module.exports = new LeadService();
```

---

### 3. Agent Assignment System

**الملف:** `/runtime/server/services/agentService.js` (NEW)

```javascript
const logger = require('../utils/logger');

class AgentService {
    constructor() {
        this.agents = new Map();  // agentId => { name, phone, availability, locations, leads }
        this.queue = [];  // Lead assignment queue
    }
    
    /**
     * Register agent
     */
    registerAgent(agentId, agentData) {
        this.agents.set(agentId, {
            ...agentData,
            availability: true,
            leads: [],
            maxLeads: agentData.maxLeads || 10
        });
        logger.info(`Agent registered: ${agentId} - ${agentData.name}`);
    }
    
    /**
     * Assign lead to agent
     */
    async assignLead(lead) {
        // Find available agent based on location and workload
        const agent = this.findAvailableAgent(lead.qualification?.location);
        
        if (agent) {
            agent.leads.push(lead.phone);
            lead.assignedAgent = agent.id;
            await lead.save();
            
            await this.notifyAgent(agent, lead);
            logger.info(`Lead ${lead.phone} assigned to agent ${agent.id}`);
            return agent;
        }
        
        // Add to queue if no agent available
        this.queue.push(lead);
        logger.warn(`No agent available for lead ${lead.phone}. Added to queue.`);
        return null;
    }
    
    /**
     * Find available agent
     */
    findAvailableAgent(locations) {
        for (const [id, agent] of this.agents) {
            if (!agent.availability) continue;
            if (agent.leads.length >= agent.maxLeads) continue;
            
            // Check if agent covers the location
            if (locations && agent.locations) {
                const hasLocation = locations.some(loc => 
                    agent.locations.includes(loc)
                );
                if (!hasLocation) continue;
            }
            
            return { ...agent, id };
        }
        return null;
    }
    
    /**
     * Notify agent of new lead
     */
    async notifyAgent(agent, lead) {
        const waClientManager = require('../waClient');
        const waClient = waClientManager.getClient('default');
        const client = waClient.getClient();
        
        const message = 
            `🔔 *New Lead Assigned*\n\n` +
            `👤 Name: ${lead.name}\n` +
            `📱 Phone: ${lead.phone}\n` +
            `📍 Location: ${lead.qualification?.location?.join(', ') || 'Not specified'}\n` +
            `💰 Budget: ${lead.qualification?.budget ? `₹${(lead.qualification.budget.min / 100000).toFixed(0)}L - ₹${(lead.qualification.budget.max / 100000).toFixed(0)}L` : 'Not specified'}\n` +
            `🏠 Type: ${lead.qualification?.propertyType?.join(', ') || 'Not specified'}\n` +
            `🔥 Status: ${lead.status.toUpperCase()}\n\n` +
            `⏰ Please contact within 15 minutes.`;
        
        await client.sendMessage(agent.phone, message);
    }
}

module.exports = new AgentService();
```

---

## 📋 خطوات التنفيذ

### Phase 1: Database & Models (يوم 1-2)
- [ ] **Step 1.1:** إعداد MongoDB connection
- [ ] **Step 1.2:** إنشاء Property model
- [ ] **Step 1.3:** إنشاء Lead model
- [ ] **Step 1.4:** إنشاء Agent model
- [ ] **Step 1.5:** اختبار CRUD operations

### Phase 2: Property Catalog (يوم 3-4)
- [ ] **Step 2.1:** إنشاء Property routes (CRUD)
- [ ] **Step 2.2:** إنشاء property catalog sender
- [ ] **Step 2.3:** إضافة image/video/brochure handling
- [ ] **Step 2.4:** اختبار إرسال catalog

### Phase 3: Lead Management (يوم 5-6)
- [ ] **Step 3.1:** إنشاء Lead Service
- [ ] **Step 3.2:** إضافة lead qualification logic
- [ ] **Step 3.3:** إضافة lead tracking
- [ ] **Step 3.4:** اختبار lead capture

### Phase 4: Agent System (يوم 7-8)
- [ ] **Step 4.1:** إنشاء Agent Service
- [ ] **Step 4.2:** إضافة agent assignment logic
- [ ] **Step 4.3:** إضافة agent notifications
- [ ] **Step 4.4:** اختبار agent workflow

### Phase 5: Dashboard UI (يوم 9-11)
- [ ] **Step 5.1:** إنشاء Properties page
- [ ] **Step 5.2:** إنشاء Leads page
- [ ] **Step 5.3:** إنشاء Agents page
- [ ] **Step 5.4:** إضافة analytics dashboard

### Phase 6: Testing & Polish (يوم 12-14)
- [ ] **Step 6.1:** End-to-end testing
- [ ] **Step 6.2:** Performance optimization
- [ ] **Step 6.3:** UI/UX improvements
- [ ] **Step 6.4:** Documentation

---

## ⚠️ TODO لاحقاً

### 1. CRM Integration
```javascript
// Integration with Salesforce, HubSpot, Zoho CRM
class CRMIntegration {
    async syncLead(lead) {
        // Sync with external CRM
    }
}
```

### 2. Webhook for Lead Capture
```javascript
// Capture leads from website forms
router.post('/webhook/lead-capture', async (req, res) => {
    const { name, phone, email, property_id } = req.body;
    // Create lead and send WhatsApp message
});
```

### 3. Analytics & Reports
```javascript
// Generate reports on leads, conversions, agent performance
class AnalyticsService {
    async generateReport(startDate, endDate) {
        // Generate comprehensive report
    }
}
```

### 4. Multi-Agent Queue System
```javascript
// Advanced queue with priority, SLA, escalation
class QueueManager {
    async processQueue() {
        // Process lead queue with priority
    }
}
```

---

## 🎯 Success Criteria

- ✅ يمكن إرسال property catalogs مع buttons
- ✅ Lead capture يعمل تلقائياً
- ✅ Lead qualification يعمل بدقة
- ✅ Agent assignment يعمل بكفاءة
- ✅ UI في Dashboard سهل الاستخدام
- ✅ Real-time notifications للـ agents
- ✅ Analytics & reports متاحة

---

**آخر تحديث:** 2025-11-01  
**المسؤول:** Development Team  
**مرجع:** WANotifier Best Practices
