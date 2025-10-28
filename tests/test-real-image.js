/**
 * Test sending a real image with better quality
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8080';
const API_KEY = 'waqtor_default_key_change_me_in_production';
const PHONE_NUMBER = '201068629968'; // Replace with your test number

async function testSendRealImage() {
    console.log('🧪 Testing Real Image Sending...\n');

    try {
        // Create a better quality test image (50x50 red square)
        const width = 50;
        const height = 50;
        
        // PNG header + IHDR chunk
        const pngHeader = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
        ]);
        
        const ihdr = Buffer.concat([
            Buffer.from([0x00, 0x00, 0x00, 0x0D]),  // Length
            Buffer.from('IHDR'),
            Buffer.from([0x00, 0x00, 0x00, width]),  // Width
            Buffer.from([0x00, 0x00, 0x00, height]), // Height
            Buffer.from([0x08, 0x02, 0x00, 0x00, 0x00]), // Bit depth, color type, etc
        ]);
        
        // Calculate CRC32 for IHDR
        const crc32 = Buffer.from([0xC1, 0x4B, 0x4E, 0x1D]);
        
        // Create red pixel data (simple version)
        const pixelData = Buffer.alloc(width * height * 3); // RGB
        for (let i = 0; i < pixelData.length; i += 3) {
            pixelData[i] = 0xFF;     // Red
            pixelData[i + 1] = 0x00; // Green
            pixelData[i + 2] = 0x00; // Blue
        }
        
        // Compress and create IDAT chunk
        const zlib = require('zlib');
        const compressed = zlib.deflateSync(pixelData);
        
        const idat = Buffer.concat([
            Buffer.from([0x00, 0x00, (compressed.length >> 8) & 0xFF, compressed.length & 0xFF]),
            Buffer.from('IDAT'),
            compressed
        ]);
        
        const idatCrc = Buffer.from([0x00, 0x00, 0x00, 0x00]); // Placeholder
        
        // IEND chunk
        const iend = Buffer.from([
            0x00, 0x00, 0x00, 0x00,
            0x49, 0x45, 0x4E, 0x44,
            0xAE, 0x42, 0x60, 0x82
        ]);
        
        const pngBuffer = Buffer.concat([
            pngHeader,
            ihdr, crc32,
            idat, idatCrc,
            iend
        ]);
        
        // Save test image
        const testImagePath = path.join(__dirname, 'test-real-image.png');
        fs.writeFileSync(testImagePath, pngBuffer);
        console.log('✅ Created test image:', testImagePath);
        console.log('   Size:', pngBuffer.length, 'bytes');

        // Create form data
        const formData = new FormData();
        formData.append('phone', PHONE_NUMBER);
        formData.append('caption', '🖼️ صورة اختبار حقيقية 50x50 - يجب أن تظهر كصورة مع معاينة!');
        formData.append('file', fs.createReadStream(testImagePath), {
            filename: 'test-real-image.png',
            contentType: 'image/png'
        });

        // Send request
        console.log('\n📤 Sending image to:', PHONE_NUMBER);
        console.log('Caption: 🖼️ صورة اختبار حقيقية - يجب أن تظهر كصورة مع معاينة!');
        
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
        console.log('   ✓ Preview is visible (50x50 red square)');
        console.log('   ✓ Caption is displayed correctly');
        console.log('   ✓ Image opens successfully when clicked');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        
        // Cleanup on error
        const testImagePath = path.join(__dirname, 'test-real-image.png');
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
    }
}

// Run test
testSendRealImage();
