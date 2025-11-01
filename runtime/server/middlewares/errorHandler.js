/**
 * Global Error Handler Middleware
 * Centralized error handling for Waqtor API
 */

const logger = require('../utils/logger');

class AppError extends Error {
    constructor(message, statusCode, code = 'INTERNAL_ERROR', details = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error codes mapping
 */
const ErrorCodes = {
    // Client errors (4xx)
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    RATE_LIMIT: 'RATE_LIMIT',
    BAD_REQUEST: 'BAD_REQUEST',
    
    // WhatsApp errors
    WHATSAPP_NOT_READY: 'WHATSAPP_NOT_READY',
    WHATSAPP_DISCONNECTED: 'WHATSAPP_DISCONNECTED',
    WHATSAPP_QR_TIMEOUT: 'WHATSAPP_QR_TIMEOUT',
    WHATSAPP_AUTH_FAILED: 'WHATSAPP_AUTH_FAILED',
    
    // Message errors
    MESSAGE_SEND_FAILED: 'MESSAGE_SEND_FAILED',
    INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
    MEDIA_UPLOAD_FAILED: 'MEDIA_UPLOAD_FAILED',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    
    // Campaign errors
    CAMPAIGN_NOT_FOUND: 'CAMPAIGN_NOT_FOUND',
    CAMPAIGN_ALREADY_RUNNING: 'CAMPAIGN_ALREADY_RUNNING',
    CAMPAIGN_EXECUTION_FAILED: 'CAMPAIGN_EXECUTION_FAILED',
    
    // Server errors (5xx)
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    TIMEOUT: 'TIMEOUT'
};

/**
 * Error response formatter
 */
function formatErrorResponse(error, includeStack = false) {
    const response = {
        success: false,
        error: {
            code: error.code || ErrorCodes.INTERNAL_ERROR,
            message: error.message || 'An unexpected error occurred',
            statusCode: error.statusCode || 500,
            timestamp: new Date().toISOString()
        }
    };

    // Add details if available
    if (error.details) {
        response.error.details = error.details;
    }

    // Add stack trace in development
    if (includeStack && process.env.NODE_ENV === 'development') {
        response.error.stack = error.stack;
    }

    return response;
}

/**
 * Main error handler middleware
 */
function errorHandler(err, req, res, next) {
    // Default to 500 server error
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    error.code = err.code || ErrorCodes.INTERNAL_ERROR;

    // Log error
    const logLevel = error.statusCode >= 500 ? 'error' : 'warn';
    logger[logLevel]('API Error:', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        path: req.path,
        method: req.method,
        ip: req.ip,
        stack: err.stack
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error = new AppError(
            'Validation Error',
            400,
            ErrorCodes.VALIDATION_ERROR,
            Object.values(err.errors).map(e => e.message)
        );
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new AppError(
            `${field} already exists`,
            409,
            ErrorCodes.CONFLICT
        );
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError(
            'Invalid token',
            401,
            ErrorCodes.AUTHENTICATION_ERROR
        );
    }

    if (err.name === 'TokenExpiredError') {
        error = new AppError(
            'Token expired',
            401,
            ErrorCodes.AUTHENTICATION_ERROR
        );
    }

    // Send error response
    const includeStack = process.env.NODE_ENV === 'development';
    res.status(error.statusCode).json(formatErrorResponse(error, includeStack));
}

/**
 * 404 handler
 */
function notFoundHandler(req, res, next) {
    const error = new AppError(
        `Route ${req.originalUrl} not found`,
        404,
        ErrorCodes.NOT_FOUND
    );
    next(error);
}

/**
 * Async handler wrapper
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * Validation error helper
 */
function validationError(message, details = null) {
    return new AppError(message, 400, ErrorCodes.VALIDATION_ERROR, details);
}

/**
 * WhatsApp error helper
 */
function whatsappError(message, code = ErrorCodes.WHATSAPP_NOT_READY) {
    return new AppError(message, 503, code);
}

/**
 * Unhandled rejection handler
 */
function handleUnhandledRejection() {
    process.on('unhandledRejection', (err) => {
        logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
            error: err.message,
            stack: err.stack
        });
        
        // Give time to log before exit
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    });
}

/**
 * Uncaught exception handler
 */
function handleUncaughtException() {
    process.on('uncaughtException', (err) => {
        logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
            error: err.message,
            stack: err.stack
        });
        
        // Give time to log before exit
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    });
}

module.exports = {
    AppError,
    ErrorCodes,
    errorHandler,
    notFoundHandler,
    asyncHandler,
    validationError,
    whatsappError,
    formatErrorResponse,
    handleUnhandledRejection,
    handleUncaughtException
};
