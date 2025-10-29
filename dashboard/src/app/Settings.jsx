/**
 * Settings Page
 * Configure Waqtor dashboard and API settings
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { statusService } from '../api/services';
import { useAppStore } from '../store/useAppStore';

export default function Settings() {
    const toast = useRef(null);
    const { status } = useAppStore();
    const [saving, setSaving] = useState(false);
    const [versionInfo, setVersionInfo] = useState(null);
  
    const [settings, setSettings] = useState({
        apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
        apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
        wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080',
        autoReconnect: true,
        keepAlive: true,
        notifications: true,
        soundEnabled: true
    });

    useEffect(() => {
        loadVersionInfo();
        loadSettings();
    }, []);

    const loadVersionInfo = async () => {
        try {
            const data = await statusService.getVersion();
            setVersionInfo(data);
        } catch (error) {
            console.error('Failed to load version info:', error);
        }
    };

    const loadSettings = () => {
        const saved = localStorage.getItem('waqtor_settings');
        if (saved) {
            setSettings({ ...settings, ...JSON.parse(saved) });
        }
    };

    const saveSettings = () => {
        setSaving(true);
        try {
            localStorage.setItem('waqtor_settings', JSON.stringify(settings));
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Settings saved successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save settings',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    const resetSettings = () => {
        setSettings({
            apiKey: '',
            apiUrl: 'http://localhost:8080/api',
            wsUrl: 'ws://localhost:8080',
            autoReconnect: true,
            keepAlive: true,
            notifications: true,
            soundEnabled: true
        });
        localStorage.removeItem('waqtor_settings');
        toast.current?.show({
            severity: 'info',
            summary: 'Reset',
            detail: 'Settings reset to defaults',
            life: 3000
        });
    };

    const handleLogout = async () => {
        try {
            await statusService.logout();
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Logged out successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to logout',
                life: 3000
            });
        }
    };

    return (
        <div className="grid">
            <Toast ref={toast} />

            <div className="col-12">
                <div className="card">
                    <h1 className="text-3xl font-bold mb-2">
                        <i className="pi pi-cog mr-2"></i>
            Settings
                    </h1>
                    <p className="text-600 m-0">
            Configure your Waqtor dashboard
                    </p>
                </div>
            </div>

            {/* API Configuration */}
            <div className="col-12 lg:col-6">
                <Card title="API Configuration" className="h-full">
                    <div className="grid">
                        <div className="col-12">
                            <label htmlFor="apiUrl" className="block mb-2 font-semibold">
                API Base URL
                            </label>
                            <InputText
                                id="apiUrl"
                                value={settings.apiUrl}
                                onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
                                placeholder="http://localhost:8080/api"
                                className="w-full"
                            />
                            <small className="text-500">Backend API endpoint</small>
                        </div>

                        <div className="col-12">
                            <label htmlFor="wsUrl" className="block mb-2 font-semibold">
                WebSocket URL
                            </label>
                            <InputText
                                id="wsUrl"
                                value={settings.wsUrl}
                                onChange={(e) => setSettings({ ...settings, wsUrl: e.target.value })}
                                placeholder="ws://localhost:8080"
                                className="w-full"
                            />
                            <small className="text-500">WebSocket endpoint for real-time updates</small>
                        </div>

                        <div className="col-12">
                            <label htmlFor="apiKey" className="block mb-2 font-semibold">
                API Key
                            </label>
                            <InputText
                                id="apiKey"
                                type="password"
                                value={settings.apiKey}
                                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                                placeholder="Enter your API key"
                                className="w-full"
                            />
                            <small className="text-500">Required for API authentication</small>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Dashboard Settings */}
            <div className="col-12 lg:col-6">
                <Card title="Dashboard Settings" className="h-full">
                    <div className="flex flex-column gap-4">
                        <div className="flex align-items-center justify-content-between">
                            <div>
                                <div className="font-semibold mb-1">Auto Reconnect</div>
                                <small className="text-500">Automatically reconnect WebSocket on disconnect</small>
                            </div>
                            <InputSwitch
                                checked={settings.autoReconnect}
                                onChange={(e) => setSettings({ ...settings, autoReconnect: e.value })}
                            />
                        </div>

                        <Divider />

                        <div className="flex align-items-center justify-content-between">
                            <div>
                                <div className="font-semibold mb-1">Keep Alive</div>
                                <small className="text-500">Send periodic ping to maintain connection</small>
                            </div>
                            <InputSwitch
                                checked={settings.keepAlive}
                                onChange={(e) => setSettings({ ...settings, keepAlive: e.value })}
                            />
                        </div>

                        <Divider />

                        <div className="flex align-items-center justify-content-between">
                            <div>
                                <div className="font-semibold mb-1">Notifications</div>
                                <small className="text-500">Show desktop notifications</small>
                            </div>
                            <InputSwitch
                                checked={settings.notifications}
                                onChange={(e) => setSettings({ ...settings, notifications: e.value })}
                            />
                        </div>

                        <Divider />

                        <div className="flex align-items-center justify-content-between">
                            <div>
                                <div className="font-semibold mb-1">Sound</div>
                                <small className="text-500">Play sound on notifications</small>
                            </div>
                            <InputSwitch
                                checked={settings.soundEnabled}
                                onChange={(e) => setSettings({ ...settings, soundEnabled: e.value })}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* System Info */}
            <div className="col-12 lg:col-6">
                <Card title="System Information">
                    <div className="grid">
                        <div className="col-6">
                            <div className="text-500 mb-1">Status</div>
                            <div className="font-semibold">
                                {(status === 'ready' || status === 'authenticated' || status === 'connected') ? (
                                    <span className="text-green-500">
                                        <i className="pi pi-check-circle mr-2"></i>
                    Connected
                                    </span>
                                ) : (
                                    <span className="text-orange-500">
                                        <i className="pi pi-exclamation-circle mr-2"></i>
                                        {status || 'Disconnected'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="text-500 mb-1">Version</div>
                            <div className="font-semibold">
                                {versionInfo?.version || '2.0.0'}
                            </div>
                        </div>

                        <div className="col-12">
                            <Divider />
                        </div>

                        <div className="col-6">
                            <div className="text-500 mb-1">WhatsApp Web.js</div>
                            <div className="font-semibold text-sm">
                                {versionInfo?.wwebVersion || 'v1.34.1'}
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="text-500 mb-1">Node.js</div>
                            <div className="font-semibold text-sm">
                                {versionInfo?.nodeVersion || process.version}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Session Management */}
            <div className="col-12 lg:col-6">
                <Card title="Session Management">
                    <Message
                        severity="warn"
                        text="Logging out will disconnect WhatsApp and require re-scanning QR code"
                        className="mb-4 w-full"
                    />
          
                    <div className="flex gap-2">
                        <Button
                            label="Logout WhatsApp"
                            icon="pi pi-sign-out"
                            severity="danger"
                            onClick={handleLogout}
                            disabled={status !== 'ready'}
                        />
                    </div>
                </Card>
            </div>

            {/* Actions */}
            <div className="col-12">
                <Card>
                    <div className="flex gap-2 justify-content-end">
                        <Button
                            label="Reset"
                            icon="pi pi-refresh"
                            severity="secondary"
                            outlined
                            onClick={resetSettings}
                        />
                        <Button
                            label="Save Settings"
                            icon="pi pi-check"
                            onClick={saveSettings}
                            loading={saving}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
