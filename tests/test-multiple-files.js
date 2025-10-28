/**
 * Test sending different file types via API
 * Tests: Image (PNG), PDF, Video (if available)
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:8080';
const API_KEY = 'waqtor_default_key_change_me_in_production';
const PHONE_NUMBER = '201068629968'; // Replace with your test number

// Helper function to send file
async function sendFile(filePath, caption, contentType) {
    const formData = new FormData();
    formData.append('phone', PHONE_NUMBER);
    formData.append('caption', caption);
    formData.append('file', fs.createReadStream(filePath), {
        filename: path.basename(filePath),
        contentType: contentType
    });

    const response = await axios.post(`${API_URL}/api/messages/send-file`, formData, {
        headers: {
            ...formData.getHeaders(),
            'X-API-Key': API_KEY
        },
        timeout: 30000
    });

    return response.data;
}

async function testAllFileTypes() {
    try {
        console.log('🧪 Testing Multiple File Types...\n');

        // 1. Test Image (PNG)
        console.log('📸 Test 1: Sending PNG Image...');
        const pngPath = path.join(__dirname, 'test.png');
        const pngBuffer = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
            0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
            0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
            0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D,
            0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
            0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        fs.writeFileSync(pngPath, pngBuffer);
        
        const result1 = await sendFile(
            pngPath, 
            '🖼️ صورة PNG - يجب أن تظهر كصورة مع معاينة', 
            'image/png'
        );
        console.log('✅ PNG sent:', result1.data.filename);
        fs.unlinkSync(pngPath);

        // Wait 2 seconds between messages
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Test PDF
        console.log('\n📄 Test 2: Sending PDF Document...');
        const pdfPath = path.join(__dirname, 'test.pdf');
        const pdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n203\n%%EOF');
        fs.writeFileSync(pdfPath, pdfBuffer);
        
        const result2 = await sendFile(
            pdfPath, 
            '📄 ملف PDF - يجب أن يظهر كمستند PDF', 
            'application/pdf'
        );
        console.log('✅ PDF sent:', result2.data.filename);
        fs.unlinkSync(pdfPath);

        // Wait 2 seconds between messages
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Test JPG Image
        console.log('\n📸 Test 3: Sending JPG Image...');
        const jpgPath = path.join(__dirname, 'test.jpg');
        // Minimal valid JPEG
        const jpgBuffer = Buffer.from([
            0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
            0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
            0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
            0x00, 0x03, 0x02, 0x02, 0x02, 0x02, 0x02, 0x03,
            0x02, 0x02, 0x02, 0x03, 0x03, 0x03, 0x03, 0x04,
            0x06, 0x04, 0x04, 0x04, 0x04, 0x04, 0x08, 0x06,
            0x06, 0x05, 0x06, 0x09, 0x08, 0x0A, 0x0A, 0x09,
            0x08, 0x09, 0x09, 0x0A, 0x0C, 0x0F, 0x0C, 0x0A,
            0x0B, 0x0E, 0x0B, 0x09, 0x09, 0x0D, 0x11, 0x0D,
            0x0E, 0x0F, 0x10, 0x10, 0x11, 0x10, 0x0A, 0x0C,
            0x12, 0x13, 0x12, 0x10, 0x13, 0x0F, 0x10, 0x10,
            0x10, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
            0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4,
            0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x09, 0xFF, 0xC4, 0x00, 0x14,
            0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
            0x00, 0x00, 0x3F, 0x00, 0x7F, 0xC0, 0xFF, 0xD9
        ]);
        fs.writeFileSync(jpgPath, jpgBuffer);
        
        const result3 = await sendFile(
            jpgPath, 
            '🖼️ صورة JPG - يجب أن تظهر كصورة مع معاينة', 
            'image/jpeg'
        );
        console.log('✅ JPG sent:', result3.data.filename);
        fs.unlinkSync(jpgPath);

        console.log('\n✅ All tests completed successfully!');
        console.log('\n📱 Check WhatsApp to verify:');
        console.log('   ✓ PNG image appears as photo with preview');
        console.log('   ✓ PDF appears as document');
        console.log('   ✓ JPG image appears as photo with preview');
        console.log('   ✓ All captions are displayed correctly');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        
        // Cleanup any leftover files
        const files = ['test.png', 'test.pdf', 'test.jpg'];
        files.forEach(file => {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    }
}

// Run tests
testAllFileTypes();
