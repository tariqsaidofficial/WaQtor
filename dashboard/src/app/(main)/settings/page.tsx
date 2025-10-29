/**
 * Settings Page
 * Path: /settings
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import APIKeyCard from '../../../components/Settings/APIKeyCard';
import SessionControls from '../../../components/Settings/SessionControls';
import AppearanceSettings from '../../../components/Settings/AppearanceSettings';
import './settings.css';

export default function SettingsPage() {
    const [systemInfo, setSystemInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const toast = React.useRef<Toast>(null);

    useEffect(() => {
        fetchSystemInfo();
    }, []);

    const fetchSystemInfo = async () => {
        try {
            const response = await fetch('/api/status/info', {
                headers: {
                    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || 'test-api-key-123'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setSystemInfo(data);
            }
        } catch (error) {
            console.error('Failed to fetch system info:', error);
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (message: string) => {
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000
        });
    };

    const showError = (message: string) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000
        });
    };

    return (
        <div className="settings-page">
            <Toast ref={toast} />
            
            {/* Header */}
            <div className="settings-header mb-4">
                <h1 className="text-3xl font-bold m-0 mb-2">
                    <i className="pi pi-cog mr-2 text-primary"></i>
                    Settings
                </h1>
                <p className="text-600 m-0">
                    ⚙️ Manage your application settings and preferences
                </p>
            </div>

            <div className="grid">
                {/* API Key Management */}
                <div className="col-12 lg:col-6">
                    <APIKeyCard onSuccess={showSuccess} onError={showError} />
                </div>

                {/* Session Controls */}
                <div className="col-12 lg:col-6">
                    <SessionControls onSuccess={showSuccess} onError={showError} />
                </div>

                {/* Appearance Settings */}
                <div className="col-12 lg:col-6">
                    <AppearanceSettings onSuccess={showSuccess} onError={showError} />
                </div>

                {/* Date, Timezone & Language */}
                <div className="col-12 lg:col-6">
                    <Card title="🌍 Date, Timezone & Language" className="settings-card">
                        <div className="flex flex-column gap-3">
                            <div>
                                <label className="block mb-2 font-semibold">
                                    <i className="pi pi-calendar mr-2"></i>
                                    Date Format
                                </label>
                                <Dropdown
                                    value="DD/MM/YYYY"
                                    options={[
                                        { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                                        { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                                        { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
                                    ]}
                                    className="w-full"
                                    placeholder="Select date format"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold">
                                    <i className="pi pi-clock mr-2"></i>
                                    Timezone
                                </label>
                                <Dropdown
                                    value={Intl.DateTimeFormat().resolvedOptions().timeZone}
                                    options={[
                                        { label: 'Africa/Cairo (GMT+2)', value: 'Africa/Cairo' },
                                        { label: 'Asia/Dubai (GMT+4)', value: 'Asia/Dubai' },
                                        { label: 'Asia/Riyadh (GMT+3)', value: 'Asia/Riyadh' },
                                        { label: 'Europe/London (GMT+0)', value: 'Europe/London' },
                                        { label: 'America/New_York (GMT-5)', value: 'America/New_York' }
                                    ]}
                                    className="w-full"
                                    placeholder="Select timezone"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold">
                                    <i className="pi pi-globe mr-2"></i>
                                    Language
                                </label>
                                <Dropdown
                                    value="en"
                                    options={[
                                        { label: '🇬🇧 English', value: 'en' },
                                        { label: '🇪🇬 العربية', value: 'ar' }
                                    ]}
                                    className="w-full"
                                    placeholder="Select language"
                                />
                            </div>

                            <Button
                                label="Save Changes"
                                icon="pi pi-check"
                                className="w-full"
                                onClick={() => showSuccess('Settings saved successfully')}
                            />
                        </div>
                    </Card>
                </div>

                {/* System Information */}
                <div className="col-12">
                    <Card title="💻 System Information" className="settings-card">
                        {loading ? (
                            <div className="text-center p-3">
                                <i className="pi pi-spin pi-spinner text-2xl"></i>
                            </div>
                        ) : (
                            <div className="grid">
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="info-item">
                                        <i className="pi pi-server text-2xl text-primary mb-2"></i>
                                        <div className="text-500 text-sm">Server Status</div>
                                        <div className="text-900 font-bold text-xl">
                                            {systemInfo?.status || 'Unknown'}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="info-item">
                                        <i className="pi pi-wifi text-2xl text-green-600 mb-2"></i>
                                        <div className="text-500 text-sm">IP Address</div>
                                        <div className="text-900 font-bold text-xl">
                                            {systemInfo?.ip || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="info-item">
                                        <i className="pi pi-box text-2xl text-purple-600 mb-2"></i>
                                        <div className="text-500 text-sm">Version</div>
                                        <div className="text-900 font-bold text-xl">
                                            {systemInfo?.version || '1.0.0'}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="info-item">
                                        <i className="pi pi-clock text-2xl text-cyan-600 mb-2"></i>
                                        <div className="text-500 text-sm">Uptime</div>
                                        <div className="text-900 font-bold text-xl">
                                            {systemInfo?.uptime || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Logging & Error Control */}
                <div className="col-12">
                    <Card title="🧩 Logging & Error Control" className="settings-card">
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                                    <div>
                                        <div className="font-semibold mb-1">Enable Logging</div>
                                        <div className="text-500 text-sm">Log all activities</div>
                                    </div>
                                    <InputSwitch checked={true} />
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                                    <div>
                                        <div className="font-semibold mb-1">Error Reporting</div>
                                        <div className="text-500 text-sm">Report errors</div>
                                    </div>
                                    <InputSwitch checked={true} />
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                                    <div>
                                        <div className="font-semibold mb-1">Debug Mode</div>
                                        <div className="text-500 text-sm">Verbose logging</div>
                                    </div>
                                    <InputSwitch checked={false} />
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                                    <div>
                                        <div className="font-semibold mb-1">Auto Clear Logs</div>
                                        <div className="text-500 text-sm">Clear old logs</div>
                                    </div>
                                    <InputSwitch checked={true} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
