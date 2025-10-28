/**
 * Test sending WhatsApp messages via REST API
 */

const fetch = require('node-fetch');

const API_URL = 'http://localhost:8080';
const API_KEY = 'waqtor_default_key_change_me_in_production';

async function testSendMessage() {
    console.log('🧪 Testing message sending...\n');

    try {
        const recipientPhone = '201229609292';
        const message = `مرحباً! هذه رسالة اختبار من WaQtor 🚀

✨ تم الإرسال بنجاح
⏰ ${new Date().toLocaleString('ar-EG')}
🎯 النظام يعمل بكفاءة`;

        console.log(`📱 Sending to: ${recipientPhone}`);
        console.log(`💬 Message:\n${message}\n`);

        const response = await fetch(`${API_URL}/api/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                chatId: `${recipientPhone}@c.us`,
                message: message
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Message sent successfully!');
            console.log('📊 Result:', JSON.stringify(result, null, 2));
        } else {
            console.error('❌ Failed to send message:');
            console.error('Status:', response.status);
            console.error('Response:', JSON.stringify(result, null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run test
testSendMessage();
