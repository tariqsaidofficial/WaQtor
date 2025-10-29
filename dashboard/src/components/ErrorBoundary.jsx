/**
 * Error Boundary Component
 * Catches and handles React errors
 */

'use client';

import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console
        console.error('Error Boundary caught an error:', error, errorInfo);

        // Log to error tracking service (future: Sentry, LogRocket, etc.)
        this.logErrorToService(error, errorInfo);

        this.setState({
            error,
            errorInfo
        });
    }

    logErrorToService = (error, errorInfo) => {
        // Future: Send to error tracking service
        const errorData = {
            message: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Log to localStorage for debugging
        try {
            const errors = JSON.parse(localStorage.getItem('waqtor_errors') || '[]');
            errors.push(errorData);
            // Keep only last 10 errors
            if (errors.length > 10) errors.shift();
            localStorage.setItem('waqtor_errors', JSON.stringify(errors));
        } catch (e) {
            console.error('Failed to log error:', e);
        }
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                    <Card 
                        title="⚠️ Something went wrong"
                        className="w-full max-w-30rem"
                    >
                        <div className="mb-4">
                            <p className="text-600 mb-3">
                                We're sorry, but something went wrong. The error has been logged and we'll look into it.
                            </p>
                            
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-4 p-3 bg-red-50 border-1 border-red-200 border-round">
                                    <div className="font-semibold text-red-900 mb-2">
                                        Error Details (Development Only):
                                    </div>
                                    <div className="text-sm text-red-800 mb-2">
                                        {this.state.error && this.state.error.toString()}
                                    </div>
                                    {this.state.errorInfo && (
                                        <details className="text-xs text-red-700">
                                            <summary className="cursor-pointer">Component Stack</summary>
                                            <pre className="mt-2 overflow-auto">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                label="Try Again"
                                icon="pi pi-refresh"
                                onClick={this.handleReset}
                                severity="secondary"
                            />
                            <Button
                                label="Go Home"
                                icon="pi pi-home"
                                onClick={this.handleGoHome}
                            />
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
