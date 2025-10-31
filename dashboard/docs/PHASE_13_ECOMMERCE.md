# 💼 المرحلة 13: E-Commerce Features (Product/Order/Payment)

**الحالة:** 📋 **TODO**  
**الأولوية:** 🟡 **متوسطة**  
**الصعوبة:** ⚠️ **متوسطة**

---

## 🎯 الهدف

تفعيل ميزات **E-Commerce** باستخدام Product/Order/Payment structures المتاحة في `/src/structures/`.

---

## 📦 الكائنات المتاحة

### 1. Product.js ✅

```javascript
// من /src/structures/Product.js
class Product extends Base {
    constructor(client, data) {
        super(client);
        if (data) this._patch(data);
    }

    _patch(data) {
        this.id = data.id;                    // Product ID
        this.price = data.price || '';        // Price
        this.thumbnailUrl = data.thumbnailUrl; // Product Thumbnail
        this.currency = data.currency;        // Currency
        this.name = data.name;                // Product Name
        this.quantity = data.quantity;        // Product Quantity
        this.data = null;                     // Product metadata
    }

    async getData() {
        // Get full product metadata
        if (this.data === null) {
            let result = await this.client.pupPage.evaluate((productId) => {
                return window.WWebJS.getProductMetadata(productId);
            }, this.id);
            
            if (!result) {
                this.data = undefined;
            } else {
                this.data = new ProductMetadata(this.client, result);
            }
        }
        return this.data;
    }
}
```

### 2. Order.js ✅

```javascript
// من /src/structures/Order.js
class Order extends Base {
    constructor(client, data) {
        super(client);
        if (data) this._patch(data);
    }

    _patch(data) {
        // List of products
        if (data.products) {
            this.products = data.products.map(product => new Product(this.client, product));
        }
        
        this.subtotal = data.subtotal;    // Order Subtotal
        this.total = data.total;          // Order Total
        this.currency = data.currency;    // Order Currency
        this.createdAt = data.createdAt;  // Order Created At
    }
}
```

### 3. Payment.js ✅

```javascript
// من /src/structures/Payment.js
class Payment extends Base {
    constructor(client, data) {
        super(client);
        if (data) this._patch(data);
    }

    _patch(data) {
        this.id = data.id;                                    // Payment Id
        this.paymentCurrency = data.paymentCurrency;          // Payment currency
        this.paymentAmount1000 = data.paymentAmount1000;      // Amount (R$ 1.00 = 1000)
        this.paymentMessageReceiverJid = data.paymentMessageReceiverJid; // Receiver
        this.paymentTransactionTimestamp = data.paymentTransactionTimestamp; // Timestamp
        this.paymentStatus = data.paymentStatus;              // Status (0-11)
        this.paymentTxnStatus = data.paymentTxnStatus;        // Transaction status
        this.paymentNote = data.paymentNoteMsg?.body;         // Note
    }
}

/**
 * Payment Status Values:
 * 0: UNKNOWN_STATUS
 * 1: PROCESSING
 * 2: SENT
 * 3: NEED_TO_ACCEPT
 * 4: COMPLETE
 * 5: COULD_NOT_COMPLETE
 * 6: REFUNDED
 * 7: EXPIRED
 * 8: REJECTED
 * 9: CANCELLED
 * 10: WAITING_FOR_PAYER
 * 11: WAITING
 */
```

---

## 🔧 الطرق الممكنة للاستخدام

### Option 1: WhatsApp Business API (Official) ❌

**المتطلبات:**
- ✅ WhatsApp Business Account
- ✅ Facebook Business Manager
- ✅ Product Catalog في Facebook
- ❌ يحتاج موافقة Meta
- ❌ قد يحتاج رسوم شهرية
- ❌ **غير متاح في whatsapp-web.js**

**الميزات:**
- ✅ Product Catalog رسمي
- ✅ Shopping Cart مدمج
- ✅ Payment Integration مباشر
- ✅ Order Management رسمي

**الخلاصة:** غير متاح حالياً في المشروع

---

### Option 2: Custom E-Commerce via Messages ✅ (Recommended)

**المتطلبات:**
- ✅ whatsapp-web.js (متاح حالياً)
- ✅ Custom Product Database
- ✅ Payment Gateway Integration (Stripe, PayPal, Razorpay)
- ✅ Custom Order Management

**الميزات:**
- ✅ Product Catalog مخصص
- ✅ Order Management كامل
- ✅ Payment Links
- ✅ Order Tracking
- ✅ Inventory Management

---

## 🛍️ التنفيذ الكامل

### 1. Product Catalog System

**الملف:** `/runtime/server/models/Product.js` (NEW)

```javascript
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { 
        type: String, 
        enum: ['electronics', 'fashion', 'home', 'beauty', 'sports', 'books', 'other'],
        required: true 
    },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    stock: { type: Number, default: 0 },
    images: [String],
    video: String,
    specifications: {
        brand: String,
        model: String,
        color: String,
        size: String,
        weight: String,
        dimensions: String
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'out_of_stock'],
        default: 'active'
    },
    tags: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    discount: {
        type: { type: String, enum: ['percentage', 'fixed'] },
        value: Number,
        validUntil: Date
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
```

**الملف:** `/runtime/server/models/Order.js` (NEW)

```javascript
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customer: {
        phone: { type: String, required: true },
        name: String,
        email: String,
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    },
    items: [{
        productId: { type: String, required: true },
        name: String,
        price: Number,
        quantity: { type: Number, required: true },
        subtotal: Number
    }],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    payment: {
        method: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'] },
        status: { 
            type: String, 
            enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: String,
        paidAt: Date
    },
    tracking: {
        carrier: String,
        trackingNumber: String,
        estimatedDelivery: Date,
        actualDelivery: Date
    },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
```

---

### 2. Product Catalog Sender

**الملف:** `/runtime/server/services/productService.js` (NEW)

```javascript
const Product = require('../models/Product');
const { MessageMedia, Buttons, List } = require('../../../index');
const logger = require('../utils/logger');

class ProductService {
    /**
     * Send product catalog
     */
    async sendProductCatalog(client, chatId, category = null) {
        try {
            const query = category ? { category, status: 'active' } : { status: 'active' };
            const products = await Product.find(query).limit(10);
            
            if (products.length === 0) {
                await client.sendMessage(chatId, 'No products available at the moment.');
                return;
            }
            
            // Send category list
            const categories = await this.getCategories();
            const categoryList = new List(
                '🛍️ *Our Products*\n\nChoose a category to browse:',
                'View Categories',
                categories.map(cat => ({
                    title: cat.name,
                    rows: cat.products.map(p => ({
                        title: p.name,
                        description: `${p.currency} ${p.price} - ${p.stock > 0 ? 'In Stock' : 'Out of Stock'}`
                    }))
                }))
            );
            
            await client.sendMessage(chatId, categoryList);
            
            logger.info(`Product catalog sent to ${chatId}`);
        } catch (error) {
            logger.error('Error sending product catalog:', error);
            throw error;
        }
    }
    
    /**
     * Send product details
     */
    async sendProductDetails(client, chatId, productId) {
        try {
            const product = await Product.findOne({ id: productId });
            
            if (!product) {
                await client.sendMessage(chatId, 'Product not found.');
                return;
            }
            
            // Send product image
            if (product.images && product.images.length > 0) {
                const image = MessageMedia.fromFilePath(product.images[0]);
                await client.sendMessage(chatId, image, {
                    caption: this.formatProductDetails(product)
                });
            } else {
                await client.sendMessage(chatId, this.formatProductDetails(product));
            }
            
            // Send action buttons
            const buttons = new Buttons(
                'What would you like to do?',
                [
                    { body: '🛒 Add to Cart' },
                    { body: '📋 View More Products' },
                    { body: '💬 Ask Question' }
                ]
            );
            
            await client.sendMessage(chatId, buttons);
            
            logger.info(`Product details sent: ${productId} to ${chatId}`);
        } catch (error) {
            logger.error('Error sending product details:', error);
            throw error;
        }
    }
    
    /**
     * Format product details
     */
    formatProductDetails(product) {
        const discountText = product.discount 
            ? `\n🎁 Discount: ${product.discount.type === 'percentage' ? product.discount.value + '%' : product.currency + ' ' + product.discount.value} OFF`
            : '';
        
        return (
            `📱 *${product.name}*\n\n` +
            `${product.description}\n\n` +
            `💰 Price: ${product.currency} ${product.price.toLocaleString()}${discountText}\n` +
            `📦 Stock: ${product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}\n` +
            `⭐ Rating: ${product.rating}/5 (${product.reviews} reviews)\n\n` +
            `*Specifications:*\n` +
            `• Brand: ${product.specifications.brand || 'N/A'}\n` +
            `• Model: ${product.specifications.model || 'N/A'}\n` +
            `• Color: ${product.specifications.color || 'N/A'}\n` +
            `• Size: ${product.specifications.size || 'N/A'}\n\n` +
            `🚚 Free shipping on orders above ${product.currency} 50`
        );
    }
    
    /**
     * Get categories with products
     */
    async getCategories() {
        const categories = await Product.aggregate([
            { $match: { status: 'active' } },
            { $group: { 
                _id: '$category', 
                products: { $push: { name: '$name', price: '$price', currency: '$currency', stock: '$stock' } }
            }},
            { $project: { 
                name: '$_id', 
                products: { $slice: ['$products', 5] }
            }}
        ]);
        
        return categories;
    }
}

module.exports = new ProductService();
```

---

### 3. Shopping Cart System

**الملف:** `/runtime/server/services/cartService.js` (NEW)

```javascript
class CartService {
    constructor() {
        this.carts = new Map(); // phone => cart
    }
    
    /**
     * Add item to cart
     */
    async addToCart(phone, productId, quantity = 1) {
        const product = await Product.findOne({ id: productId });
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }
        
        let cart = this.carts.get(phone) || { items: [], subtotal: 0 };
        
        // Check if product already in cart
        const existingItem = cart.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.price * existingItem.quantity;
        } else {
            cart.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                subtotal: product.price * quantity
            });
        }
        
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        this.carts.set(phone, cart);
        
        return cart;
    }
    
    /**
     * Get cart
     */
    getCart(phone) {
        return this.carts.get(phone) || { items: [], subtotal: 0 };
    }
    
    /**
     * Clear cart
     */
    clearCart(phone) {
        this.carts.delete(phone);
    }
    
    /**
     * Format cart for display
     */
    formatCart(cart) {
        if (cart.items.length === 0) {
            return '🛒 Your cart is empty.';
        }
        
        let message = '🛒 *Your Cart*\n\n';
        
        cart.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Qty: ${item.quantity} × $${item.price} = $${item.subtotal}\n\n`;
        });
        
        message += `───────────────\n`;
        message += `💰 Subtotal: $${cart.subtotal}\n`;
        message += `🚚 Shipping: Free\n`;
        message += `───────────────\n`;
        message += `💳 Total: $${cart.subtotal}`;
        
        return message;
    }
}

module.exports = new CartService();
```

---

### 4. Order Management

**الملف:** `/runtime/server/services/orderService.js` (NEW)

```javascript
const Order = require('../models/Order');
const cartService = require('./cartService');
const paymentService = require('./paymentService');
const { v4: uuidv4 } = require('uuid');

class OrderService {
    /**
     * Create order from cart
     */
    async createOrder(phone, customerInfo) {
        const cart = cartService.getCart(phone);
        
        if (cart.items.length === 0) {
            throw new Error('Cart is empty');
        }
        
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const order = new Order({
            orderId,
            customer: {
                phone,
                ...customerInfo
            },
            items: cart.items,
            subtotal: cart.subtotal,
            tax: cart.subtotal * 0.18, // 18% tax
            shipping: cart.subtotal > 50 ? 0 : 10,
            total: cart.subtotal + (cart.subtotal * 0.18) + (cart.subtotal > 50 ? 0 : 10),
            currency: 'USD',
            status: 'pending'
        });
        
        await order.save();
        
        // Clear cart
        cartService.clearCart(phone);
        
        return order;
    }
    
    /**
     * Send order confirmation
     */
    async sendOrderConfirmation(client, order) {
        const message = 
            `✅ *Order Confirmed!*\n\n` +
            `📦 Order #${order.orderId}\n` +
            `💳 Total: ${order.currency} ${order.total}\n` +
            `📅 Date: ${new Date(order.createdAt).toLocaleDateString()}\n\n` +
            `*Items:*\n` +
            order.items.map((item, i) => 
                `${i + 1}. ${item.name} × ${item.quantity} = ${order.currency} ${item.subtotal}`
            ).join('\n') +
            `\n\n🚚 Estimated Delivery: 3-5 business days\n\n` +
            `Track your order:\n` +
            `https://yourstore.com/track/${order.orderId}`;
        
        await client.sendMessage(order.customer.phone, message);
    }
    
    /**
     * Update order status
     */
    async updateOrderStatus(orderId, status) {
        const order = await Order.findOne({ orderId });
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        order.status = status;
        order.updatedAt = new Date();
        await order.save();
        
        return order;
    }
}

module.exports = new OrderService();
```

---

### 5. Payment Integration

**الملف:** `/runtime/server/services/paymentService.js` (NEW)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
    /**
     * Create payment link
     */
    async createPaymentLink(order) {
        try {
            // Create Stripe payment link
            const paymentLink = await stripe.paymentLinks.create({
                line_items: order.items.map(item => ({
                    price_data: {
                        currency: order.currency.toLowerCase(),
                        product_data: {
                            name: item.name
                        },
                        unit_amount: item.price * 100 // Convert to cents
                    },
                    quantity: item.quantity
                })),
                metadata: {
                    orderId: order.orderId,
                    phone: order.customer.phone
                }
            });
            
            return paymentLink.url;
        } catch (error) {
            logger.error('Error creating payment link:', error);
            throw error;
        }
    }
    
    /**
     * Send payment link via WhatsApp
     */
    async sendPaymentLink(client, order) {
        const paymentLink = await this.createPaymentLink(order);
        
        const message = 
            `💳 *Payment Required*\n\n` +
            `Order #${order.orderId}\n` +
            `Total: ${order.currency} ${order.total}\n\n` +
            `Click the link below to complete your payment:\n` +
            `${paymentLink}\n\n` +
            `🔒 Secure payment via Stripe\n` +
            `✅ SSL Encrypted\n` +
            `💯 100% Safe`;
        
        await client.sendMessage(order.customer.phone, message);
    }
    
    /**
     * Handle payment webhook
     */
    async handlePaymentWebhook(event) {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata.orderId;
            
            // Update order payment status
            const order = await Order.findOne({ orderId });
            if (order) {
                order.payment.status = 'completed';
                order.payment.transactionId = session.payment_intent;
                order.payment.paidAt = new Date();
                order.status = 'confirmed';
                await order.save();
                
                // Send confirmation
                await this.sendPaymentConfirmation(order);
            }
        }
    }
}

module.exports = new PaymentService();
```

---

## 📋 خطوات التنفيذ

### Phase 1: Database & Models (يوم 1-2)
- [ ] **Step 1.1:** إنشاء Product model
- [ ] **Step 1.2:** إنشاء Order model
- [ ] **Step 1.3:** إنشاء Customer model
- [ ] **Step 1.4:** اختبار CRUD operations

### Phase 2: Product Catalog (يوم 3-4)
- [ ] **Step 2.1:** إنشاء Product Service
- [ ] **Step 2.2:** إنشاء catalog sender
- [ ] **Step 2.3:** إضافة category filtering
- [ ] **Step 2.4:** اختبار catalog display

### Phase 3: Shopping Cart (يوم 5-6)
- [ ] **Step 3.1:** إنشاء Cart Service
- [ ] **Step 3.2:** إضافة add/remove/update logic
- [ ] **Step 3.3:** إضافة cart display
- [ ] **Step 3.4:** اختبار cart operations

### Phase 4: Order Management (يوم 7-8)
- [ ] **Step 4.1:** إنشاء Order Service
- [ ] **Step 4.2:** إضافة order creation
- [ ] **Step 4.3:** إضافة order tracking
- [ ] **Step 4.4:** اختبار order flow

### Phase 5: Payment Integration (يوم 9-10)
- [ ] **Step 5.1:** إعداد Stripe account
- [ ] **Step 5.2:** إنشاء Payment Service
- [ ] **Step 5.3:** إضافة payment links
- [ ] **Step 5.4:** إضافة webhook handling
- [ ] **Step 5.5:** اختبار payment flow

### Phase 6: Dashboard UI (يوم 11-13)
- [ ] **Step 6.1:** إنشاء Products page
- [ ] **Step 6.2:** إنشاء Orders page
- [ ] **Step 6.3:** إنشاء Customers page
- [ ] **Step 6.4:** إضافة analytics

### Phase 7: Testing & Polish (يوم 14)
- [ ] **Step 7.1:** End-to-end testing
- [ ] **Step 7.2:** Performance optimization
- [ ] **Step 7.3:** UI/UX improvements
- [ ] **Step 7.4:** Documentation

---

## 🧪 الاختبار

### Test Case 1: Product Catalog

```bash
# Send product catalog
curl -X POST http://localhost:3001/api/product/send-catalog \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "default",
    "phone": "966501234567@c.us",
    "category": "electronics"
  }'
```

### Test Case 2: Shopping Cart

```bash
# Add to cart
curl -X POST http://localhost:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "966501234567",
    "productId": "PROD-001",
    "quantity": 2
  }'

# View cart
curl http://localhost:3001/api/cart/966501234567
```

### Test Case 3: Order Creation

```bash
# Create order
curl -X POST http://localhost:3001/api/order/create \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "966501234567",
    "customerInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "Dubai",
        "country": "UAE"
      }
    }
  }'
```

---

## 🎯 Success Criteria

- ✅ Product catalog يُعرض بشكل جميل
- ✅ Shopping cart يعمل بسلاسة
- ✅ Order creation يعمل بدون أخطاء
- ✅ Payment integration يعمل
- ✅ Order tracking متاح
- ✅ UI في Dashboard سهل الاستخدام
- ✅ Performance جيد مع 1000+ products

---

**آخر تحديث:** 2025-11-01  
**المسؤول:** Development Team  
**Payment Gateway:** Stripe (Recommended)
