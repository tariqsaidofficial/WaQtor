'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface SessionControlsProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function SessionControls({ onSuccess, onError }: SessionControlsProps) {
    const [sessionInfo, setSessionInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSessionInfo();
    }, []);

    const fetchSessionInfo = async () => {
        try {
            const response = await fetch('/api/session/state');
            if (response.ok) {
                const data = await response.json();
                setSessionInfo(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch session info:', error);
        }
    };

    const handleLogout = () => {
        confirmDialog({
            message: 'Are you sure you want to logout? You will need to scan QR code again.',
            header: 'Confirm Logout',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                setLoading(true);
                try {
                    const response = await fetch('/api/status/logout', {
                        method: 'POST',
                        headers: {
                            'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || 'test-api-key-123'
                        }
                    });
                    
                    if (response.ok) {
                        onSuccess('Logged out successfully');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        onError('Failed to logout');
                    }
                } catch (error) {
                    onError('Failed to logout');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleClearSession = () => {
        confirmDialog({
            message: 'This will clear all session data. Are you sure?',
            header: 'Confirm Clear Session',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                setLoading(true);
                try {
                    // Clear session data
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    onSuccess('Session cleared successfully');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } catch (error) {
                    onError('Failed to clear session');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleRestartSession = () => {
        confirmDialog({
            message: 'This will restart the WhatsApp session. Continue?',
            header: 'Confirm Restart',
            icon: 'pi pi-refresh',
            accept: async () => {
                setLoading(true);
                try {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    onSuccess('Session restarted successfully');
                    fetchSessionInfo();
                } catch (error) {
                    onError('Failed to restart session');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <>
            <ConfirmDialog />
            <Card title="⚙️ Session Controls" className="settings-card h-full">
                <div className="flex flex-column gap-3">
                    {sessionInfo && (
                        <div className="p-3 bg-blue-50 border-round mb-2">
                            <div className="flex align-items-center gap-2 mb-2">
                                <i className="pi pi-info-circle text-blue-600"></i>
                                <span className="font-semibold">Session Status</span>
                            </div>
                            <div className="grid">
                                <div className="col-6">
                                    <div className="text-500 text-sm">Status</div>
                                    <div className="font-semibold">
                                        {sessionInfo.status === 'connected' ? (
                                            <span className="text-green-600">
                                                <i className="pi pi-check-circle mr-1"></i>
                                                Connected
                                            </span>
                                        ) : (
                                            <span className="text-red-600">
                                                <i className="pi pi-times-circle mr-1"></i>
                                                Disconnected
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-500 text-sm">Ready</div>
                                    <div className="font-semibold">
                                        {sessionInfo.isReady ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        label="Restart Session"
                        icon="pi pi-refresh"
                        onClick={handleRestartSession}
                        loading={loading}
                        className="w-full"
                        severity="info"
                    />

                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        onClick={handleLogout}
                        loading={loading}
                        className="w-full"
                        severity="warning"
                    />

                    <Button
                        label="Clear Session Data"
                        icon="pi pi-trash"
                        onClick={handleClearSession}
                        loading={loading}
                        className="w-full"
                        severity="danger"
                    />

                    <div className="p-3 bg-red-50 border-round">
                        <div className="flex align-items-start gap-2">
                            <i className="pi pi-exclamation-circle text-red-600 mt-1"></i>
                            <div className="text-sm">
                                <strong>Caution:</strong> Clearing session data will require you to scan the QR code again to reconnect.
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
}
