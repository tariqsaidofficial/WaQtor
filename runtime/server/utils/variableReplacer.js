/**
 * Variable Replacer Utility
 * Replaces variables in messages with actual values
 */

const logger = require('./logger');

/**
 * Replace variables in message with actual values
 * @param {string} message - Message template with variables
 * @param {object} data - Data object containing variable values
 * @param {string} data.phone - Phone number
 * @param {string} data.name - Recipient name
 * @param {string} data.email - Email address
 * @param {string} data.company - Company name
 * @param {string} data.position - Job position
 * @param {string} data.order_id - Order ID
 * @param {string} data.amount - Amount
 * @param {string} data.product - Product name
 * @param {string} data.link - Custom link
 * @param {string} data.custom1 - Custom field 1
 * @param {string} data.custom2 - Custom field 2
 * @param {string} data.custom3 - Custom field 3
 * @returns {string} - Message with replaced variables
 */
function replaceVariables(message, data = {}) {
    if (!message) return '';
    
    let replacedMessage = message;
    
    // Get current date/time
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Date/Time variables
    const dateVariables = {
        '{date}': now.toLocaleDateString('en-GB'), // DD/MM/YYYY
        '{time}': now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        '{day}': days[now.getDay()],
        '{month}': months[now.getMonth()],
        '{year}': now.getFullYear().toString()
    };
    
    // Personal variables
    const personalVariables = {
        '{name}': data.name || 'Valued Customer',
        '{phone}': data.phone || '',
        '{email}': data.email || ''
    };
    
    // Business variables
    const businessVariables = {
        '{company}': data.company || '',
        '{position}': data.position || '',
        '{order_id}': data.order_id || '',
        '{amount}': data.amount || '',
        '{product}': data.product || ''
    };
    
    // System variables
    // Note: signature should be passed from frontend (stored in localStorage)
    // Default to 'WaQtor Team' if not provided
    const systemVariables = {
        '{signature}': data.signature || 'WaQtor Team'
    };
    
    // Custom variables
    const customVariables = {
        '{link}': data.link || '',
        '{custom1}': data.custom1 || '',
        '{custom2}': data.custom2 || '',
        '{custom3}': data.custom3 || ''
    };
    
    // Combine all variables
    const allVariables = {
        ...dateVariables,
        ...personalVariables,
        ...businessVariables,
        ...systemVariables,
        ...customVariables
    };
    
    // Replace all variables
    Object.keys(allVariables).forEach(variable => {
        const value = allVariables[variable];
        // Use global replace to replace all occurrences
        replacedMessage = replacedMessage.split(variable).join(value);
    });
    
    // Log if variables were replaced
    if (replacedMessage !== message) {
        logger.debug(`Variables replaced in message`);
    }
    
    return replacedMessage;
}

/**
 * Extract variables from message template
 * @param {string} message - Message template
 * @returns {array} - Array of variable names found
 */
function extractVariables(message) {
    if (!message) return [];
    
    const variablePattern = /\{([a-z0-9_]+)\}/gi;
    const matches = message.match(variablePattern);
    
    if (!matches) return [];
    
    // Remove duplicates
    return [...new Set(matches)];
}

/**
 * Validate if all required variables have values
 * @param {string} message - Message template
 * @param {object} data - Data object
 * @returns {object} - {valid: boolean, missing: array}
 */
function validateVariables(message, data = {}) {
    const variables = extractVariables(message);
    const missing = [];
    
    variables.forEach(variable => {
        const key = variable.replace('{', '').replace('}', '');
        
        // Skip date/time and system variables (they have defaults)
        const autoVariables = ['date', 'time', 'day', 'month', 'year', 'signature'];
        if (autoVariables.includes(key)) {
            return;
        }
        
        // Check if variable has a value
        if (!data[key] || data[key].trim() === '') {
            missing.push(variable);
        }
    });
    
    return {
        valid: missing.length === 0,
        missing
    };
}

module.exports = {
    replaceVariables,
    extractVariables,
    validateVariables
};
