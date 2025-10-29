/**
 * Error Fallback Component
 * Displays when an error occurs in a component
 */

'use client';

import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

export function ErrorFallback({ 
    error, 
    resetErrorBoundary, 
    title = 'Something went wrong',
    showDetails = process.env.NODE_ENV === 'development'
}) {
    const handleReload = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleReset = () => {
        if (resetErrorBoundary) {
            resetErrorBoundary();
        } else {
            handleReload();
        }
    };

    return (
        <div className="flex align-items-center justify-content-center min-h-screen p-4">
            <Card className="w-full max-w-30rem shadow-4">
                <div className="text-center mb-4">
                    <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-3"></i>
                    <h2 className="text-2xl font-bold text-900 mb-2">{title}</h2>
                    <p className="text-600 mb-3">
                        We apologize for the inconvenience. An error has occurred and has been logged.
                    </p>
                </div>

                {showDetails && error && (
                    <Message 
                        severity="error" 
                        className="w-full mb-4"
                        text={error.message || error.toString()}
                    />
                )}

                <div className="flex gap-2 justify-content-center flex-wrap">
                    <Button 
                        label="Try Again" 
                        icon="pi pi-refresh"
                        onClick={handleReset}
                        severity="primary"
                    />
                    <Button 
                        label="Go Home" 
                        icon="pi pi-home"
                        onClick={handleGoHome}
                        severity="secondary"
                        outlined
                    />
                    <Button 
                        label="Reload Page" 
                        icon="pi pi-replay"
                        onClick={handleReload}
                        severity="help"
                        outlined
                    />
                </div>

                {showDetails && error?.stack && (
                    <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-600 hover:text-900">
                            View Error Details
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 border-round text-xs overflow-auto max-h-20rem">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </Card>
        </div>
    );
}

export default ErrorFallback;
