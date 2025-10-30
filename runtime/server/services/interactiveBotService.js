/**
 * Interactive Bot Service
 * Handles WhatsApp Interactive Messages (Buttons & Lists)
 */

const fs = require('fs');
const path = require('path');

class InteractiveBotService {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.conversationsFile = path.join(this.dataDir, 'interactive-conversations.json');
        this.conversations = this.loadConversations();
    }

    loadConversations() {
        try {
            if (fs.existsSync(this.conversationsFile)) {
                return JSON.parse(fs.readFileSync(this.conversationsFile, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
        return {};
    }

    saveConversations() {
        try {
            if (!fs.existsSync(this.dataDir)) {
                fs.mkdirSync(this.dataDir, { recursive: true });
            }
            fs.writeFileSync(this.conversationsFile, JSON.stringify(this.conversations, null, 2));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }

    /**
     * Send Language Selection Message
     */
    async sendLanguageSelection(client, chatId) {
        const message = `*Language Selection* 🌍

Before we begin, kindly select your preferred language. 💬

Reply with:
1️⃣ for *English*
2️⃣ for *العربية*

_Powered by WaQtor_`;

        try {
            await client.sendMessage(chatId, message);

            // Store conversation state
            this.conversations[chatId] = {
                state: 'awaiting_language',
                timestamp: new Date().toISOString()
            };
            this.saveConversations();

            return { success: true };
        } catch (error) {
            console.error('Error sending language selection:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send Product Catalog
     */
    async sendProductCatalog(client, chatId, language = 'en') {
        const message = language === 'ar' ? `*📦 كتالوج المنتجات*

اختر المنتج الذي تريده:

*الإلكترونيات:*
1️⃣ لابتوب 💻 - أحدث الأجهزة
2️⃣ هاتف 📱 - هواتف ذكية
3️⃣ تابلت 📲 - أجهزة لوحية

*الإكسسوارات:*
4️⃣ سماعات 🎧 - صوت نقي
5️⃣ شاحن 🔌 - شحن سريع

_رد برقم المنتج_` : `*📦 Product Catalog*

Choose the product you want:

*Electronics:*
1️⃣ Laptop 💻 - Latest devices
2️⃣ Phone 📱 - Smartphones
3️⃣ Tablet 📲 - Tablets

*Accessories:*
4️⃣ Headphones 🎧 - Clear sound
5️⃣ Charger 🔌 - Fast charging

_Reply with product number_`;

        try {
            await client.sendMessage(chatId, message);

            this.conversations[chatId] = {
                ...this.conversations[chatId],
                state: 'awaiting_product_selection',
                language: language
            };
            this.saveConversations();

            return { success: true };
        } catch (error) {
            console.error('Error sending product catalog:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send Service Menu
     */
    async sendServiceMenu(client, chatId, language = 'en') {
        const message = language === 'ar' ? `*خدماتنا* 🤝

كيف يمكننا مساعدتك اليوم؟

1️⃣ 🛠️ *الدعم الفني*
2️⃣ 💰 *المبيعات*
3️⃣ ℹ️ *معلومات*

_رد برقم الخدمة_` : `*Our Services* 🤝

How can we help you today?

1️⃣ 🛠️ *Technical Support*
2️⃣ 💰 *Sales*
3️⃣ ℹ️ *Information*

_Reply with service number_`;

        try {
            await client.sendMessage(chatId, message);

            this.conversations[chatId] = {
                ...this.conversations[chatId],
                state: 'awaiting_service_selection',
                language: language
            };
            this.saveConversations();

            return { success: true };
        } catch (error) {
            console.error('Error sending service menu:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send Confirmation Buttons
     */
    async sendConfirmation(client, chatId, confirmMessage, language = 'en') {
        const message = language === 'ar' ? `${confirmMessage}

1️⃣ ✅ *نعم*
2️⃣ ❌ *لا*

_رد برقم الاختيار_` : `${confirmMessage}

1️⃣ ✅ *Yes*
2️⃣ ❌ *No*

_Reply with your choice_`;

        try {
            await client.sendMessage(chatId, message);

            this.conversations[chatId] = {
                ...this.conversations[chatId],
                state: 'awaiting_confirmation',
                language: language
            };
            this.saveConversations();

            return { success: true };
        } catch (error) {
            console.error('Error sending confirmation:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Handle Text Response (Number-based menu)
     */
    async handleTextResponse(client, message) {
        const chatId = message.from;
        const text = message.body.trim();
        const conversation = this.conversations[chatId];

        if (!conversation) {
            return { success: false, error: 'No active conversation' };
        }

        try {
            const language = conversation.language || 'en';

            // Handle Language Selection
            if (conversation.state === 'awaiting_language') {
                let selectedLanguage = 'en';
                if (text === '1' || text.toLowerCase() === 'english') {
                    selectedLanguage = 'en';
                } else if (text === '2' || text.includes('عرب')) {
                    selectedLanguage = 'ar';
                } else {
                    return { success: false, error: 'Invalid selection' };
                }

                const response = selectedLanguage === 'ar'
                    ? '✅ تم اختيار اللغة العربية!\n\nماذا تريد أن تفعل بعد ذلك؟'
                    : '✅ English selected!\n\nWhat would you like to do next?';

                await client.sendMessage(chatId, response);
                await this.sendServiceMenu(client, chatId, selectedLanguage);
                
                return { success: true, action: 'language_selected', language: selectedLanguage };
            }

            // Handle Service Selection
            if (conversation.state === 'awaiting_service_selection') {
                const serviceMap = { '1': 'support', '2': 'sales', '3': 'info' };
                const service = serviceMap[text];

                if (!service) {
                    return { success: false, error: 'Invalid selection' };
                }

                let response;
                if (service === 'support') {
                    response = language === 'ar'
                        ? '🛠️ الدعم الفني\n\nسنقوم بتوصيلك بفريق الدعم الفني.'
                        : '🛠️ Technical Support\n\nWe will connect you with our technical support team.';
                } else if (service === 'sales') {
                    response = language === 'ar'
                        ? '💰 المبيعات\n\nهل تريد رؤية كتالوج المنتجات؟'
                        : '💰 Sales\n\nWould you like to see our product catalog?';
                    
                    await client.sendMessage(chatId, response);
                    await this.sendProductCatalog(client, chatId, language);
                    return { success: true, action: 'service_selected', service };
                } else {
                    response = language === 'ar'
                        ? 'ℹ️ معلومات\n\nنحن WaQtor - منصة إدارة WhatsApp الاحترافية.'
                        : 'ℹ️ Information\n\nWe are WaQtor - Professional WhatsApp Management Platform.';
                }

                await client.sendMessage(chatId, response);
                return { success: true, action: 'service_selected', service };
            }

            // Handle Product Selection
            if (conversation.state === 'awaiting_product_selection') {
                const productMap = {
                    '1': 'Laptop',
                    '2': 'Phone',
                    '3': 'Tablet',
                    '4': 'Headphones',
                    '5': 'Charger'
                };
                const product = productMap[text];

                if (!product) {
                    return { success: false, error: 'Invalid selection' };
                }

                const response = language === 'ar'
                    ? `✅ تم اختيار: ${product}\n\nهل تريد إتمام الطلب؟`
                    : `✅ Selected: ${product}\n\nWould you like to complete the order?`;

                await client.sendMessage(chatId, response);
                await this.sendConfirmation(client, chatId, 
                    language === 'ar' ? 'تأكيد الطلب؟' : 'Confirm order?', 
                    language
                );
                
                return { success: true, action: 'product_selected', product };
            }

            // Handle Confirmation
            if (conversation.state === 'awaiting_confirmation') {
                const confirmed = text === '1' || text.toLowerCase() === 'yes' || text === 'نعم';
                
                const response = confirmed
                    ? (language === 'ar' 
                        ? '✅ تم تأكيد الطلب! شكراً لك.'
                        : '✅ Order confirmed! Thank you.')
                    : (language === 'ar'
                        ? '❌ تم إلغاء الطلب.'
                        : '❌ Order cancelled.');

                await client.sendMessage(chatId, response);
                
                // Clear conversation
                delete this.conversations[chatId];
                this.saveConversations();
                
                return { success: true, action: 'confirmation', confirmed };
            }

            return { success: false, error: 'Unknown state' };
        } catch (error) {
            console.error('Error handling text response:', error);
            return { success: false, error: error.message };
        }
    }


    /**
     * Start Demo Conversation
     */
    async startDemo(client, chatId) {
        return await this.sendLanguageSelection(client, chatId);
    }
}

module.exports = new InteractiveBotService();
