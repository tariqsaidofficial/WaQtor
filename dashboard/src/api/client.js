/**
 * Waqtor API Client
 * Axios configuration for API communication
 */

import axios from 'axios';

/**
 * Get the appropriate API URL based on environment
 * - In browser (client-side): use BROWSER_API_URL or fallback to localhost
 * - In SSR/server: use API_URL (docker service name) or fallback to localhost
 */
const getApiUrl = () => {
    // Check if running in browser
    if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_BROWSER_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    }
    // Server-side rendering
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
};

/**
 * Main API client instance
 */
export const api = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

/**
 * Request interceptor
 * Add authentication and logging
 */
api.interceptors.request.use(
    (config) => {
        // Add JWT token if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        
        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * Handle errors and logging
 */
api.interceptors.response.use(
    (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
    },
    (error) => {
        // Enhanced error handling
        const errorResponse = {
            message: 'An error occurred',
            code: 'UNKNOWN_ERROR',
            statusCode: 0,
            details: null,
        };

        if (error.response) {
            // Server responded with error
            const { status, data } = error.response;
            errorResponse.statusCode = status;
            errorResponse.message = data?.error?.message || data?.message || error.message;
            errorResponse.code = data?.error?.code || 'API_ERROR';
            errorResponse.details = data?.error?.details || null;

            // Log specific error types
            switch (status) {
            case 401:
                console.error('🔐 Authentication failed. Check your API key.');
                break;
            case 403:
                console.error('⛔ Access forbidden.');
                break;
            case 404:
                console.error('🔍 Resource not found.');
                break;
            case 429:
                console.error('⏱️ Rate limit exceeded. Please try again later.');
                break;
            case 503:
                console.error('� WhatsApp service unavailable:', errorResponse.message);
                break;
            case 500:
                console.error('💥 Server error:', errorResponse.message);
                break;
            default:
                console.error(`❌ Error ${status}:`, errorResponse.message);
            }
        } else if (error.request) {
            // Request made but no response
            console.error('🌐 Network error: No response received from server');
            errorResponse.message = 'Network error. Please check your connection.';
            errorResponse.code = 'NETWORK_ERROR';
        } else {
            // Error in request configuration
            console.error('❌ Error:', error.message);
            errorResponse.message = error.message;
        }

        // Attach enhanced error info
        error.waqtorError = errorResponse;

        return Promise.reject(error);
    }
);

// Export both named and default exports
export const apiClient = api;
export default api;
