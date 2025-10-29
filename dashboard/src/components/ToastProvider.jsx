/**
 * Global Toast Provider
 * Provides toast notifications across the app
 */

'use client';

import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { showErrorToast } from '../utils/errorHandler';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const toast = useRef(null);

    const showToast = (options) => {
        toast.current?.show(options);
    };

    const showSuccess = (message, summary = 'Success') => {
        toast.current?.show({
            severity: 'success',
            summary,
            detail: message,
            life: 3000
        });
    };

    const showError = (error, summary = 'Error') => {
        showErrorToast(toast, error, { summary });
    };

    const showWarning = (message, summary = 'Warning') => {
        toast.current?.show({
            severity: 'warn',
            summary,
            detail: message,
            life: 4000
        });
    };

    const showInfo = (message, summary = 'Info') => {
        toast.current?.show({
            severity: 'info',
            summary,
            detail: message,
            life: 3000
        });
    };

    const value = {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        toast
    };

    return (
        <ToastContext.Provider value={value}>
            <Toast ref={toast} position="top-right" />
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export default ToastProvider;
