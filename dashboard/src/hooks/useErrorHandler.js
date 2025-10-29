/**
 * Custom Error Handler Hook
 * Provides error handling utilities for components
 */

import { useState, useCallback } from 'react';
import { useToast } from '../components/ToastProvider';
import { parseApiError, getUserFriendlyMessage, logError } from '../utils/errorHandler';

export function useErrorHandler() {
    const [error, setError] = useState(null);
    const [isError, setIsError] = useState(false);
    const { showError, showWarning } = useToast();

    /**
     * Handle error with toast notification
     */
    const handleError = useCallback(
        (error, context = {}) => {
            const parsed = typeof error === 'string' ? { message: error } : parseApiError(error);

            setError(parsed);
            setIsError(true);

            // Log error
            logError(error, context);

            // Show toast
            if (parsed.type === 'AUTHENTICATION_ERROR') {
                showWarning(parsed.message, 'Authentication Required');
            } else {
                showError(error);
            }

            return parsed;
        },
        [showError, showWarning]
    );

    /**
     * Handle error silently (no toast)
     */
    const handleErrorSilent = useCallback((error, context = {}) => {
        const parsed = typeof error === 'string' ? { message: error } : parseApiError(error);

        setError(parsed);
        setIsError(true);

        // Log error
        logError(error, context);

        return parsed;
    }, []);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
        setIsError(false);
    }, []);

    /**
     * Retry handler
     */
    const retryWithErrorHandling = useCallback(
        async (fn, options = {}) => {
            const maxRetries = options.maxRetries || 3;
            const delay = options.delay || 1000;
            const onRetry = options.onRetry;

            let lastError;

            for (let i = 0; i < maxRetries; i++) {
                try {
                    clearError();
                    return await fn();
                } catch (error) {
                    lastError = error;

                    if (onRetry) {
                        onRetry(i + 1, maxRetries);
                    }

                    if (i < maxRetries - 1) {
                        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
                    }
                }
            }

            handleError(lastError, { retries: maxRetries });
            throw lastError;
        },
        [handleError, clearError]
    );

    /**
     * Wrap async function with error handling
     */
    const withErrorHandling = useCallback(
        (fn) => {
            return async (...args) => {
                try {
                    clearError();
                    return await fn(...args);
                } catch (error) {
                    handleError(error);
                    throw error;
                }
            };
        },
        [handleError, clearError]
    );

    return {
        error,
        isError,
        handleError,
        handleErrorSilent,
        clearError,
        retryWithErrorHandling,
        withErrorHandling,
    };
}

export default useErrorHandler;
