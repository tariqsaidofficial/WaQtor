/**
 * Test sending message with template
 */

const fetch = require('node-fetch');

const API_URL = 'http://localhost:8080';
const API_KEY = 'waqtor_default_key_change_me_in_production';

const templates = {
    offer1: `السلام عليكم! 🌟

🎉 عرض خاص لعملائنا الكرام
✨ خصم 50% على جميع المنتجات
⏰ العرض ساري حتى نهاية الأسبوع

📞 للطلب: 01234567890
🚚 توصيل مجاني لجميع المحافظات
💳 الدفع عند الاستلام متاح

احجز طلبك الآن! 🔥`,

    offer2: `مرحباً بك! 👋

🆕 منتج جديد وصل للتو!
✨ جودة عالية وأسعار تنافسية
🎁 اطلب الآن واحصل على هدية مجانية

📱 للطلب والاستفسار: 01234567890
🌐 زوروا موقعنا: www.example.com
⭐ تقييم 5 نجوم من عملائنا

لا تفوت الفرصة! 🚀`,

    offer3: `أهلاً وسهلاً! 🎊

📅 ندعوكم لحضور:
🎯 معرض المنتجات الجديدة 2025
📍 المكان: القاهرة - وسط البلد
⏰ الموعد: الجمعة 10 صباحاً

✨ مفاجآت وجوائز قيمة
🎁 هدايا مجانية لأول 100 زائر
☕ ضيافة مميزة

للتأكيد والاستفسار: 01234567890`
};

async function testTemplate(templateName) {
    console.log(`\n📨 Testing template: ${templateName}\n`);
    console.log('Message:');
    console.log('─'.repeat(50));
    console.log(templates[templateName]);
    console.log('─'.repeat(50));

    try {
        const response = await fetch(`${API_URL}/api/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                chatId: '201229609292@c.us',
                message: templates[templateName]
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log('\n✅ Sent successfully!');
            console.log(`📊 Message ID: ${result.data.id}`);
        } else {
            console.log('\n❌ Failed:', result.error);
        }
    } catch (error) {
        console.log('\n❌ Error:', error.message);
    }
}

async function runTests() {
    console.log('🧪 Testing promotional message templates\n');
    console.log('='.repeat(50));

    // Test offer1
    await testTemplate('offer1');
    
    console.log('\n\nWaiting 3 seconds before next message...\n');
    await new Promise(r => setTimeout(r, 3000));

    // Uncomment to test other templates
    // await testTemplate('offer2');
    // await new Promise(r => setTimeout(r, 3000));
    // await testTemplate('offer3');

    console.log('\n' + '='.repeat(50));
    console.log('✅ Test completed!\n');
}

runTests();
