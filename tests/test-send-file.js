/**
 * Test sending message with media file
 */

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8080';
const API_KEY = 'waqtor_default_key_change_me_in_production';

// Create a test PDF file
const testPDF = Buffer.from(`%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 24 Tf
100 700 Td
(WaQtor Catalog 2025) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000273 00000 n
0000000366 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
444
%%EOF`);

// Save test PDF
const pdfPath = path.join(__dirname, 'test-catalog.pdf');
fs.writeFileSync(pdfPath, testPDF);

async function sendMessageWithFile() {
    console.log('📄 اختبار إرسال رسالة مع ملف PDF\n');

    try {
        const formData = new FormData();
        formData.append('phone', '201229609292');
        formData.append('caption', `السلام عليكم! 🌟

🎁 كتالوج المنتجات الجديدة 2025
✨ أحدث التصميمات والعروض
📞 للطلب: 01234567890

شاهد الكتالوج المرفق! 📄`);
        formData.append('file', fs.createReadStream(pdfPath), {
            filename: 'WaQtor_Catalog_2025.pdf',
            contentType: 'application/pdf'
        });

        console.log('📤 إرسال الرسالة مع الملف...\n');

        const response = await fetch(`${API_URL}/api/messages/send-file`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                ...formData.getHeaders()
            },
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ تم إرسال الملف بنجاح!\n');
            console.log('📊 التفاصيل:');
            console.log(`   Message ID: ${result.data.id.substring(0, 40)}...`);
            console.log(`   Timestamp: ${new Date(result.data.timestamp * 1000).toLocaleString('ar-EG')}`);
            console.log(`   File: ${result.data.filename}`);
            console.log(`   Size: ${(result.data.filesize / 1024).toFixed(2)} KB`);
        } else {
            console.log('❌ فشل الإرسال:', result.error);
        }

    } catch (error) {
        console.log('❌ خطأ:', error.message);
    } finally {
        // Clean up
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
            console.log('\n🧹 تم حذف الملف التجريبي');
        }
    }
}

sendMessageWithFile();
