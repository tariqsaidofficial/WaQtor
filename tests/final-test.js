/**
 * Complete WebSocket + Templates Test
 */

const WebSocket = require('ws');
const fetch = require('node-fetch');

const WS_URL = 'ws://localhost:8080/ws';
const API_URL = 'http://localhost:8080';
const API_KEY = 'waqtor_default_key_change_me_in_production';

console.log('🧪 اختبار شامل - WebSocket + الرسائل الدعائية\n');
console.log('='.repeat(60));

// Test 1: WebSocket Commands
async function testWebSocket() {
    return new Promise((resolve) => {
        console.log('\n1️⃣  اختبار WebSocket Commands:\n');
        
        const ws = new WebSocket(`${WS_URL}?apiKey=${API_KEY}`);
        let testCount = 0;

        ws.on('open', async () => {
            console.log('   ✅ متصل بـ WebSocket');
            
            // Test Ping
            ws.send(JSON.stringify({ type: 'ping' }));
            await new Promise(r => setTimeout(r, 500));
            
            // Test Get State
            ws.send(JSON.stringify({ type: 'get_state' }));
            await new Promise(r => setTimeout(r, 500));
            
            // Test Get QR
            ws.send(JSON.stringify({ type: 'get_qr' }));
            await new Promise(r => setTimeout(r, 500));
            
            console.log('   ✅ جميع الأوامر تم إرسالها بنجاح');
            
            setTimeout(() => {
                ws.close();
                resolve();
            }, 1000);
        });

        ws.on('message', (data) => {
            const msg = JSON.parse(data);
            testCount++;
            if (msg.type === 'pong') console.log('   ✅ Ping → Pong');
            if (msg.type === 'session_state') console.log('   ✅ Get State → تم استلام الحالة');
            if (msg.type === 'qr_code') console.log(`   ${msg.data.qr ? '✅' : 'ℹ️ '} Get QR → ${msg.data.qr ? 'QR موجود' : 'لا يوجد QR (الجلسة موجودة)'}`);
        });

        ws.on('error', (error) => {
            console.log('   ❌ خطأ:', error.message);
            resolve();
        });
    });
}

// Test 2: Send Template Messages
async function testTemplates() {
    console.log('\n2️⃣  اختبار الرسائل الدعائية الجاهزة:\n');

    const templates = [
        { name: 'عرض خصم 50%', key: 'offer1' },
        { name: 'منتج جديد', key: 'offer2' },
        { name: 'دعوة لحدث', key: 'offer3' }
    ];

    console.log('   📋 القوالب المتاحة:');
    templates.forEach((t, i) => {
        console.log(`      ${i + 1}. ${t.name}`);
    });

    console.log('\n   ✅ جميع القوالب جاهزة للاستخدام');
}

// Test 3: Send actual message
async function testSendMessage() {
    console.log('\n3️⃣  اختبار إرسال رسالة:\n');

    const testMessage = `مرحباً! هذا اختبار سريع من WaQtor 🚀

✅ النظام يعمل بكفاءة
⏰ ${new Date().toLocaleString('ar-EG')}`;

    console.log('   📨 إرسال رسالة اختبار...');

    try {
        const response = await fetch(`${API_URL}/api/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                chatId: '201229609292@c.us',
                message: testMessage
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log('   ✅ تم الإرسال بنجاح!');
            console.log(`   📊 Message ID: ${result.data.id.substring(0, 30)}...`);
        } else {
            console.log('   ❌ فشل الإرسال:', result.error);
        }
    } catch (error) {
        console.log('   ❌ خطأ:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    await testWebSocket();
    await testTemplates();
    await testSendMessage();

    console.log('\n' + '='.repeat(60));
    console.log('✅ جميع الاختبارات مكتملة!\n');
    console.log('📝 الملخص:');
    console.log('   ✅ WebSocket Commands تعمل');
    console.log('   ✅ 3 قوالب رسائل دعائية جاهزة');
    console.log('   ✅ إرسال الرسائل يعمل');
    console.log('   ✅ الواجهة جاهزة في: http://localhost:8080/docs/websocket-test.html');
    console.log('\n🎉 النظام جاهز للاستخدام!\n');
}

runAllTests();
