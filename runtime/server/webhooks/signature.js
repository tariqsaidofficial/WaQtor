/**
 * HMAC Signature Generation and Verification
 * For securing webhook payloads
 */

const crypto = require('crypto');

/**
 * Generate HMAC signature for webhook payload
 * @param {string} payload - JSON stringified payload
 * @param {string} secret - Webhook secret key
 * @returns {string} Signature in format: sha256=<hex>
 */
function generateSignature(payload, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    return 'sha256=' + hmac.digest('hex');
}

/**
 * Verify HMAC signature
 * @param {string} payload - JSON stringified payload
 * @param {string} signature - Signature from header
 * @param {string} secret - Webhook secret key
 * @returns {boolean} True if signature is valid
 */
function verifySignature(payload, signature, secret) {
    try {
        const expectedSignature = generateSignature(payload, secret);
        
        // Use timing-safe comparison to prevent timing attacks
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    } catch (error) {
        return false;
    }
}

module.exports = {
    generateSignature,
    verifySignature
};
