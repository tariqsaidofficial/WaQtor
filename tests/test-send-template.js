/**
 * اختبار إرسال قالب جاهز
 */

const fetch = require('node-fetch');

const API_URL = 'http://localhost:8080';
const API_KEY = 'waqtor_default_key_change_me_in_production';

// القالب الأول - عرض خصم 50%
const template1 = `السلام عليكم! 🌟

🎉 عرض خاص لعملائنا الكرام
✨ خصم 50% على جميع المنتجات
⏰ العرض ساري حتى نهاية الأسبوع

📞 للطلب: 01234567890
🚚 توصيل مجاني لجميع المحافظات
💳 الدفع عند الاستلام

⭐ لا تفوت الفرصة!`;

console.log('📨 اختبار إرسال القالب الجاهز #1 (عرض خصم 50%)\n');

async function sendTemplate() {
    try {
        const response = await fetch(`${API_URL}/api/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                chatId: '201229609292@c.us',
                message: template1
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ تم إرسال القالب بنجاح!');
            console.log(`📊 Message ID: ${result.data.id.substring(0, 40)}...`);
            console.log(`⏰ Timestamp: ${new Date(result.data.timestamp * 1000).toLocaleString('ar-EG')}`);
        } else {
            console.log('❌ فشل الإرسال:', result.error);
        }
    } catch (error) {
        console.log('❌ خطأ:', error.message);
    }
}

sendTemplate();
