'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { api } from '../../api/client';

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
            const response = await api.get('/api/session/state');
            if (response.data?.success) {
                setSessionInfo(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch session info:', error);
        }
    };

    const handleDisconnect = () => {
        confirmDialog({
            message: 'This will disconnect your WhatsApp session. You can reconnect anytime without scanning QR code again.',
            header: 'Disconnect WhatsApp',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                setLoading(true);
                try {
                    const response = await api.post('/api/status/logout');
                    
                    if (response.data?.success) {
                        onSuccess('WhatsApp disconnected successfully');
                        setTimeout(() => {
                            fetchSessionInfo();
                        }, 1000);
                    } else {
                        onError('Failed to disconnect WhatsApp');
                    }
                } catch (error) {
                    onError('Failed to disconnect WhatsApp');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleDeleteSession = () => {
        confirmDialog({
            message: 'This will permanently delete your session files. You will need to scan the QR code again to reconnect.',
            header: 'Delete Session',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                setLoading(true);
                try {
                    const response = await api.delete('/api/session/delete');
                    
                    if (response.data?.success) {
                        onSuccess('Session deleted successfully');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        onError('Failed to delete session');
                    }
                } catch (error) {
                    onError('Failed to delete session');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleRestartSession = () => {
        confirmDialog({
            message: 'This will restart your WhatsApp session. Continue?',
            header: 'Restart Session',
            icon: 'pi pi-refresh',
            accept: async () => {
                setLoading(true);
                try {
                    const response = await api.post('/api/session/restart');
                    
                    if (response.data?.success) {
                        onSuccess('Session restarted successfully');
                        setTimeout(() => {
                            fetchSessionInfo();
                        }, 1500);
                    } else {
                        onError('Failed to restart session');
                    }
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
            <Card className="settings-card-content">
                <div className="flex flex-column gap-4">
                    {/* Session Status Card */}
                    <div className="surface-card p-4 border-round shadow-1">
                        <div className="flex align-items-center justify-content-between mb-3">
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-whatsapp text-2xl text-green-500"></i>
                                <span className="text-xl font-semibold">WhatsApp Session</span>
                            </div>
                            {sessionInfo?.status === 'connected' ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 border-round font-semibold text-sm">
                                    <i className="pi pi-check-circle mr-1"></i>
                                    Connected
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-700 border-round font-semibold text-sm">
                                    <i className="pi pi-times-circle mr-1"></i>
                                    Disconnected
                                </span>
                            )}
                        </div>
                        
                        <div className="grid">
                            <div className="col-6">
                                <div className="flex flex-column gap-1">
                                    <span className="text-500 text-sm">Session Ready</span>
                                    <span className="font-semibold text-lg">
                                        {sessionInfo?.isReady ? (
                                            <span className="text-green-600">
                                                <i className="pi pi-check mr-1"></i>
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="text-orange-600">
                                                <i className="pi pi-times mr-1"></i>
                                                No
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="flex flex-column gap-1">
                                    <span className="text-500 text-sm">Connection</span>
                                    <span className="font-semibold text-lg">
                                        {sessionInfo?.status === 'connected' ? (
                                            <span className="text-green-600">Active</span>
                                        ) : (
                                            <span className="text-red-600">Inactive</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-column gap-2">
                        <div className="grid">
                            <div className="col-12 md:col-4">
                                <Button
                                    label="Restart"
                                    icon="pi pi-refresh"
                                    onClick={handleRestartSession}
                                    loading={loading}
                                    disabled={sessionInfo?.status !== 'connected'}
                                    className="w-full"
                                    outlined
                                    tooltip="Restart WhatsApp session"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            </div>
                            <div className="col-12 md:col-4">
                                <Button
                                    label="Disconnect"
                                    icon="pi pi-sign-out"
                                    onClick={handleDisconnect}
                                    loading={loading}
                                    disabled={sessionInfo?.status !== 'connected'}
                                    severity="secondary"
                                    className="w-full"
                                    outlined
                                    tooltip="Disconnect WhatsApp (can reconnect without QR)"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            </div>
                            <div className="col-12 md:col-4">
                                <Button
                                    label="Delete Session"
                                    icon="pi pi-trash"
                                    onClick={handleDeleteSession}
                                    loading={loading}
                                    severity="danger"
                                    className="w-full"
                                    tooltip="Permanently delete session files"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="surface-border border-1 border-round p-3">
                        <div className="flex align-items-start gap-2">
                            <i className="pi pi-info-circle text-orange-500 text-xl mt-1"></i>
                            <div>
                                <div className="font-semibold text-900 mb-2">Session Actions Guide</div>
                                <ul className="text-600 text-sm line-height-3 m-0 pl-3">
                                    <li><strong>Restart:</strong> Reconnect WhatsApp without losing session</li>
                                    <li><strong>Disconnect:</strong> Temporarily disconnect (can reconnect without QR)</li>
                                    <li><strong>Delete Session:</strong> Permanently remove session files (requires new QR scan)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
}
