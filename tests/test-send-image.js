/**
 * Test sending an image file via API
 * This test will verify that images are sent as Media (with preview) not as Documents
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:8080';
const API_KEY = 'waqtor_default_key_change_me_in_production';
const PHONE_NUMBER = '201068629968'; // Replace with your test number

async function testSendImage() {
    try {
        console.log('🧪 Testing Image Sending...\n');

        // Create a test image (1x1 pixel PNG)
        const testImagePath = path.join(__dirname, 'test-image.png');
        
        // Create a simple PNG image buffer (1x1 red pixel)
        const pngBuffer = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
            0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
            0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, // Red pixel data
            0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D,
            0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
            0x44, 0xAE, 0x42, 0x60, 0x82 // IEND chunk
        ]);
        
        // Write test image to file
        fs.writeFileSync(testImagePath, pngBuffer);
        console.log('✅ Created test image:', testImagePath);

        // Create form data
        const formData = new FormData();
        formData.append('phone', PHONE_NUMBER);
        formData.append('caption', '🖼️ هذه صورة اختبار - يجب أن تظهر كصورة مع معاينة وليس كمستند!');
        formData.append('file', fs.createReadStream(testImagePath), {
            filename: 'test-image.png',
            contentType: 'image/png'
        });

        // Send request
        console.log('\n📤 Sending image to:', PHONE_NUMBER);
        console.log('Caption: 🖼️ هذه صورة اختبار - يجب أن تظهر كصورة مع معاينة وليس كمستند!');
        
        const response = await axios.post(`${API_URL}/api/messages/send-file`, formData, {
            headers: {
                ...formData.getHeaders(),
                'X-API-Key': API_KEY
            },
            timeout: 30000
        });

        console.log('\n✅ Image sent successfully!');
        console.log('Response:', JSON.stringify(response.data, null, 2));

        // Cleanup
        fs.unlinkSync(testImagePath);
        console.log('\n🧹 Cleaned up test image');

        console.log('\n📱 Check WhatsApp to verify:');
        console.log('   ✓ Image appears as a photo (not a document)');
        console.log('   ✓ Preview is visible before opening');
        console.log('   ✓ Caption is displayed correctly');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        
        // Cleanup on error
        const testImagePath = path.join(__dirname, 'test-image.png');
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
    }
}

// Run test
testSendImage();
