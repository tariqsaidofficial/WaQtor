/**
 * Request Validator Middleware
 * Validate incoming requests
 */

const { validationError } = require('./errorHandler');

/**
 * Validate phone number format
 */
function validatePhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a valid international number (10-15 digits)
    if (cleaned.length < 10 || cleaned.length > 15) {
        return false;
    }
    
    return true;
}

/**
 * Validate required fields
 */
function validateRequired(fields, data) {
    const missing = [];
    
    for (const field of fields) {
        if (!data[field] || data[field] === '') {
            missing.push(field);
        }
    }
    
    if (missing.length > 0) {
        throw validationError(
            'Missing required fields',
            { missing }
        );
    }
}

/**
 * Validate phone number middleware
 */
function validatePhone(req, res, next) {
    const phone = req.body.phone || req.query.phone;
    
    if (!phone) {
        throw validationError('Phone number is required');
    }
    
    if (!validatePhoneNumber(phone)) {
        throw validationError(
            'Invalid phone number format',
            { 
                phone, 
                expected: 'International format with country code (e.g., 966501234567)' 
            }
        );
    }
    
    next();
}

/**
 * Validate message content
 */
function validateMessage(req, res, next) {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
        throw validationError('Message content is required');
    }
    
    if (message.length > 4096) {
        throw validationError(
            'Message is too long',
            { maxLength: 4096, currentLength: message.length }
        );
    }
    
    next();
}

/**
 * Validate bulk recipients
 */
function validateBulkRecipients(req, res, next) {
    const { recipients } = req.body;
    
    if (!Array.isArray(recipients) || recipients.length === 0) {
        throw validationError('Recipients array is required and must not be empty');
    }
    
    if (recipients.length > 1000) {
        throw validationError(
            'Too many recipients',
            { maxRecipients: 1000, currentCount: recipients.length }
        );
    }
    
    // Validate each phone number
    const invalid = [];
    recipients.forEach((phone, index) => {
        if (!validatePhoneNumber(phone)) {
            invalid.push({ index, phone });
        }
    });
    
    if (invalid.length > 0) {
        throw validationError(
            'Invalid phone numbers found',
            { invalidNumbers: invalid }
        );
    }
    
    next();
}

/**
 * Validate campaign data
 */
function validateCampaign(req, res, next) {
    const { name, message, recipients } = req.body;
    
    validateRequired(['name', 'message', 'recipients'], req.body);
    
    if (name.length > 100) {
        throw validationError(
            'Campaign name is too long',
            { maxLength: 100, currentLength: name.length }
        );
    }
    
    if (!Array.isArray(recipients) || recipients.length === 0) {
        throw validationError('Recipients must be a non-empty array');
    }
    
    next();
}

/**
 * Validate file upload
 */
function validateFileUpload(req, res, next) {
    if (!req.file && !req.files) {
        throw validationError('No file uploaded');
    }
    
    const file = req.file || req.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
        throw validationError(
            'File is too large',
            { 
                maxSize: '10MB', 
                currentSize: `${(file.size / 1024 / 1024).toFixed(2)}MB` 
            }
        );
    }
    
    // Validate file type
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'application/pdf'
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
        throw validationError(
            'Invalid file type',
            { 
                allowed: allowedTypes,
                received: file.mimetype 
            }
        );
    }
    
    next();
}

/**
 * Sanitize input
 */
function sanitizeInput(req, res, next) {
    // Remove any potential script tags or malicious content
    const sanitize = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .trim();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };
    
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    
    next();
}

module.exports = {
    validatePhoneNumber,
    validateRequired,
    validatePhone,
    validateMessage,
    validateBulkRecipients,
    validateCampaign,
    validateFileUpload,
    sanitizeInput
};
