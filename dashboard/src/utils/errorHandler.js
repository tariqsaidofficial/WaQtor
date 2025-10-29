/**
 * Error Handler Utility
 * Frontend error handling helpers
 */

import { Toast } from 'primereact/toast';

/**
 * Error types mapping
 */
export const ErrorTypes = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    API_ERROR: 'API_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    WHATSAPP_ERROR: 'WHATSAPP_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Parse API error response
 */
export function parseApiError(error) {
    // Network error (no response)
    if (!error.response) {
        return {
            type: ErrorTypes.NETWORK_ERROR,
            message: 'Network error. Please check your internet connection.',
            code: 'NETWORK_ERROR',
            statusCode: 0,
            details: null,
        };
    }

    // API error response
    const { data, status } = error.response;

    return {
        type: getErrorType(status),
        message: data?.error?.message || data?.message || 'An error occurred',
        code: data?.error?.code || 'UNKNOWN_ERROR',
        statusCode: status,
        details: data?.error?.details || null,
    };
}

/**
 * Get error type from status code
 */
function getErrorType(statusCode) {
    if (statusCode >= 500) {
        return ErrorTypes.API_ERROR;
    } else if (statusCode === 401 || statusCode === 403) {
        return ErrorTypes.AUTHENTICATION_ERROR;
    } else if (statusCode === 400 || statusCode === 422) {
        return ErrorTypes.VALIDATION_ERROR;
    } else if (statusCode === 503) {
        return ErrorTypes.WHATSAPP_ERROR;
    }
    return ErrorTypes.UNKNOWN_ERROR;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error) {
    const parsed = typeof error === 'string' ? { message: error } : parseApiError(error);

    // Map common error codes to user-friendly messages
    const messageMap = {
        WHATSAPP_NOT_READY: 'WhatsApp is not connected. Please scan the QR code.',
        WHATSAPP_DISCONNECTED: 'WhatsApp connection lost. Please reconnect.',
        INVALID_PHONE_NUMBER: 'Invalid phone number format. Please use international format (e.g., 966501234567).',
        MESSAGE_SEND_FAILED: 'Failed to send message. Please try again.',
        FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB.',
        NETWORK_ERROR: 'Network connection error. Please check your internet.',
        AUTHENTICATION_ERROR: 'Authentication failed. Please check your API key.',
        RATE_LIMIT: 'Too many requests. Please wait and try again.',
    };

    return messageMap[parsed.code] || parsed.message || 'An unexpected error occurred';
}

/**
 * Get error severity for Toast
 */
export function getErrorSeverity(error) {
    const parsed = typeof error === 'string' ? { type: ErrorTypes.UNKNOWN_ERROR } : parseApiError(error);

    switch (parsed.type) {
    case ErrorTypes.NETWORK_ERROR:
    case ErrorTypes.API_ERROR:
        return 'error';
    case ErrorTypes.AUTHENTICATION_ERROR:
        return 'warn';
    case ErrorTypes.VALIDATION_ERROR:
        return 'info';
    case ErrorTypes.WHATSAPP_ERROR:
        return 'warn';
    default:
        return 'error';
    }
}

/**
 * Show error toast
 */
export function showErrorToast(toast, error, options = {}) {
    const parsed = typeof error === 'string' ? { message: error } : parseApiError(error);
    const message = getUserFriendlyMessage(error);
    const severity = getErrorSeverity(error);

    toast.current?.show({
        severity,
        summary: options.summary || 'Error',
        detail: message,
        life: options.life || 5000,
        ...options,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            parsed,
            original: error,
        });
    }
}

/**
 * Log error to tracking service
 */
export function logError(error, context = {}) {
    const errorData = {
        timestamp: new Date().toISOString(),
        error: typeof error === 'string' ? error : parseApiError(error),
        context,
        userAgent: navigator.userAgent,
        url: window.location.href,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error logged:', errorData);
    }

    // Store in localStorage for debugging
    try {
        const errors = JSON.parse(localStorage.getItem('waqtor_errors') || '[]');
        errors.push(errorData);
        // Keep only last 20 errors
        if (errors.length > 20) errors.shift();
        localStorage.setItem('waqtor_errors', JSON.stringify(errors));
    } catch (e) {
        console.error('Failed to store error:', e);
    }

    // Future: Send to error tracking service (Sentry, LogRocket, etc.)
}

/**
 * Retry wrapper for async operations
 */
export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            const isLastRetry = i === maxRetries - 1;

            if (isLastRetry) {
                throw error;
            }

            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));

            console.log(`Retry ${i + 1}/${maxRetries}...`);
        }
    }
}

/**
 * Validate form data
 */
export function validateFormData(data, rules) {
    const errors = {};

    Object.keys(rules).forEach((field) => {
        const rule = rules[field];
        const value = data[field];

        // Required check
        if (rule.required && (!value || value.trim() === '')) {
            errors[field] = rule.message || `${field} is required`;
            return;
        }

        // Min length check
        if (rule.minLength && value && value.length < rule.minLength) {
            errors[field] = `${field} must be at least ${rule.minLength} characters`;
            return;
        }

        // Max length check
        if (rule.maxLength && value && value.length > rule.maxLength) {
            errors[field] = `${field} must be less than ${rule.maxLength} characters`;
            return;
        }

        // Pattern check
        if (rule.pattern && value && !rule.pattern.test(value)) {
            errors[field] = rule.message || `${field} is invalid`;
            return;
        }

        // Custom validation
        if (rule.validate && value) {
            const error = rule.validate(value);
            if (error) {
                errors[field] = error;
            }
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Handle async errors in React components
 */
export function useErrorHandler() {
    const handleError = (error, toast, context = {}) => {
        logError(error, context);
        if (toast) {
            showErrorToast(toast, error);
        }
    };

    return { handleError };
}

export default {
    ErrorTypes,
    parseApiError,
    getUserFriendlyMessage,
    getErrorSeverity,
    showErrorToast,
    logError,
    retryOperation,
    validateFormData,
    useErrorHandler,
};
