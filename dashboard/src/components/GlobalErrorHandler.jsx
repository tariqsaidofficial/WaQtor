/**
 * Global Error Handler
 * Monitors and handles global errors
 */

'use client';

import { useEffect } from 'react';
import { useToast } from './ToastProvider';
import { logError } from '../utils/errorHandler';

export function GlobalErrorHandler({ children }) {
    const { showError } = useToast();

    useEffect(() => {
        // Handle unhandled promise rejections
        const handleUnhandledRejection = (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            
            logError(event.reason, {
                type: 'unhandledRejection',
                promise: event.promise
            });

            showError('An unexpected error occurred. Please try again.');
            
            // Prevent default browser behavior
            event.preventDefault();
        };

        // Handle global errors
        const handleGlobalError = (event) => {
            console.error('Global Error:', event.error);
            
            logError(event.error, {
                type: 'globalError',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });

            // Prevent default browser behavior for specific errors
            if (event.error && event.error.name !== 'ChunkLoadError') {
                event.preventDefault();
            }
        };

        // Handle console errors
        const originalConsoleError = console.error;
        console.error = (...args) => {
            // Log to error tracking
            logError(args[0], {
                type: 'consoleError',
                args: args.slice(1)
            });

            // Call original console.error
            originalConsoleError.apply(console, args);
        };

        // Add event listeners
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleGlobalError);

        // Cleanup
        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleGlobalError);
            console.error = originalConsoleError;
        };
    }, [showError]);

    return children;
}

export default GlobalErrorHandler;
