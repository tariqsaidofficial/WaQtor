/**
 * Validation Utilities
 * Request validation middleware
 */

/**
 * Validate phone number format
 */
function isValidPhone(phone) {
    // Basic validation: should be digits, can include +, -, spaces
    const phoneRegex = /^[\d\s\-\+]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate message request
 */
function validateMessage(req, res, next) {
    const { phone, message } = req.body;

    if (!phone) {
        return res.status(400).json({
            success: false,
            error: 'Phone number is required'
        });
    }

    if (!message) {
        return res.status(400).json({
            success: false,
            error: 'Message is required'
        });
    }

    if (!isValidPhone(phone)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid phone number format'
        });
    }

    if (message.length > 4096) {
        return res.status(400).json({
            success: false,
            error: 'Message is too long (max 4096 characters)'
        });
    }

    next();
}

/**
 * Sanitize phone number
 */
function sanitizePhone(phone) {
    // Remove all non-digit characters except +
    return phone.replace(/[^\d\+]/g, '');
}

module.exports = {
    isValidPhone,
    validateMessage,
    sanitizePhone
};
