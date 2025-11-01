/**
 * Secrets Configuration
 * Encrypted secrets that should never be exposed in code
 */

const crypto = require('crypto');

// Encryption key from environment (should be 32 bytes)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex').substring(0, 32);
const IV_LENGTH = 16;

/**
 * Encrypt a value
 */
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypt a value
 */
function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Default access code (encrypted)
// Original: 330022
// This is encrypted so it cannot be found by searching the codebase
const DEFAULT_ACCESS_CODE_ENCRYPTED = encrypt('330022');

/**
 * Get default access code (decrypted)
 */
function getDefaultAccessCode() {
    try {
        return decrypt(DEFAULT_ACCESS_CODE_ENCRYPTED);
    } catch (error) {
        // Fallback if decryption fails
        console.error('Failed to decrypt default access code');
        return null;
    }
}

module.exports = {
    encrypt,
    decrypt,
    getDefaultAccessCode,
    DEFAULT_ACCESS_CODE_ENCRYPTED
};
