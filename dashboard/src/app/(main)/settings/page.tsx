/**
 * Settings Page
 * Path: /settings
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Knob } from 'primereact/knob';
import { api } from '../../../api/client';
import APIKeyCard from '../../../components/Settings/APIKeyCard';
import SessionControls from '../../../components/Settings/SessionControls';
import AppearanceSettings from '../../../components/Settings/AppearanceSettings';
import './settings.css';

type SettingType = 'api' | 'session' | 'appearance' | 'localization' | 'system' | 'logging' | null;

interface FeatureCard {
    id: SettingType;
    icon: string;
    title: string;
    description: string;
}

export default function SettingsPage() {
    const [activeDialog, setActiveDialog] = useState<SettingType>(null);
    const [systemInfo, setSystemInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const toast = React.useRef<Toast>(null);

    useEffect(() => {
        fetchSystemInfo();
    }, []);

    const fetchSystemInfo = async () => {
        try {
            const response = await api.get('/api/status/info');
            
            if (response.data?.success) {
                setSystemInfo(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch system info:', error);
        } finally {
            setLoading(false);
        }
    };

    const features: FeatureCard[] = [
        {
            id: 'api',
            icon: 'pi-key',
            title: 'API Management',
            description: 'Manage your API keys and access tokens'
        },
        {
            id: 'session',
            icon: 'pi-users',
            title: 'Session Controls',
            description: 'Control your WhatsApp session'
        },
        {
            id: 'appearance',
            icon: 'pi-palette',
            title: 'Appearance',
            description: 'Customize theme and display settings'
        },
        {
            id: 'localization',
            icon: 'pi-globe',
            title: 'Localization',
            description: 'Set date, time, and language preferences'
        },
        {
            id: 'system',
            icon: 'pi-server',
            title: 'System Information',
            description: 'View system status and information'
        },
        {
            id: 'logging',
            icon: 'pi-list',
            title: 'Logging & Error Control',
            description: 'Configure logging and error reporting'
        }
    ];

    const getDialogContent = () => {
        switch (activeDialog) {
            case 'api':
                return (
                    <div className="settings-dialog-body">
                        <APIKeyCard onSuccess={showSuccess} onError={showError} />
                    </div>
                );
            case 'session':
                return (
                    <div className="settings-dialog-body">
                        <SessionControls onSuccess={showSuccess} onError={showError} />
                    </div>
                );
            case 'appearance':
                return (
                    <div className="settings-dialog-body">
                        <AppearanceSettings onSuccess={showSuccess} onError={showError} />
                    </div>
                );
            case 'localization':
                return (
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
                                value="Africa/Cairo"
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
                                    { label: 'English', value: 'en' },
                                    { label: 'العربية', value: 'ar' }
                                ]}
                                className="w-full"
                                placeholder="Select language"
                            />
                        </div>
                        <div className="flex justify-content-end gap-2 mt-3">
                            <Button label="Cancel" severity="secondary" outlined onClick={() => setActiveDialog(null)} />
                            <Button label="Save Changes" icon="pi pi-check" onClick={() => { showSuccess('Settings saved successfully'); setActiveDialog(null); }} />
                        </div>
                    </div>
                );
            case 'system':
                return (
                    <div>
                        {loading ? (
                            <div className="text-center p-3">
                                <i className="pi pi-spin pi-spinner text-2xl"></i>
                            </div>
                        ) : (
                            <div className="grid">
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="flex flex-column align-items-center p-3">
                                        <Knob value={systemInfo?.status === 'running' ? 100 : 0} valueColor="#14b8a6" size={120} readOnly />
                                        <div className="text-500 text-sm mt-3">Server Status</div>
                                        <div className="text-900 font-semibold">{systemInfo?.status || 'Unknown'}</div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="flex flex-column align-items-center p-3">
                                        <Knob value={75} valueColor="#10b981" size={120} readOnly />
                                        <div className="text-500 text-sm mt-3">CPU Usage</div>
                                        <div className="text-900 font-semibold">75%</div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="flex flex-column align-items-center p-3">
                                        <Knob value={60} valueColor="#8b5cf6" size={120} readOnly />
                                        <div className="text-500 text-sm mt-3">Memory Usage</div>
                                        <div className="text-900 font-semibold">60%</div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="flex flex-column align-items-center p-3">
                                        <Knob value={45} valueColor="#06b6d4" size={120} readOnly />
                                        <div className="text-500 text-sm mt-3">Disk Usage</div>
                                        <div className="text-900 font-semibold">45%</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'logging':
                return (
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                                <div>
                                    <div className="font-semibold mb-1">Enable Logging</div>
                                    <div className="text-500 text-sm">Log all activities</div>
                                </div>
                                <InputSwitch checked={true} />
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                                <div>
                                    <div className="font-semibold mb-1">Error Reporting</div>
                                    <div className="text-500 text-sm">Report errors</div>
                                </div>
                                <InputSwitch checked={true} />
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                                <div>
                                    <div className="font-semibold mb-1">Debug Mode</div>
                                    <div className="text-500 text-sm">Verbose logging</div>
                                </div>
                                <InputSwitch checked={false} />
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                                <div>
                                    <div className="font-semibold mb-1">Auto Clear Logs</div>
                                    <div className="text-500 text-sm">Clear old logs</div>
                                </div>
                                <InputSwitch checked={true} />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const getDialogTitle = () => {
        const feature = features.find(f => f.id === activeDialog);
        return feature ? feature.title : '';
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
                    Manage your application settings and preferences
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid">
                {features.map((feature) => (
                    <div key={feature.id} className="col-12 md:col-6 lg:col-4 mb-4">
                        <Card 
                            className="feature-card cursor-pointer h-full"
                            onClick={() => setActiveDialog(feature.id)}
                        >
                            <div className="text-center">
                                <div 
                                    className="feature-icon-wrapper mb-3 inline-flex align-items-center justify-content-center"
                                    style={{ 
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--primary-color)',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <i 
                                        className={`pi ${feature.icon} text-3xl`}
                                        style={{ color: '#ffffff' }}
                                    ></i>
                                </div>
                                <h4 className="text-900 text-lg mb-2 font-semibold">
                                    {feature.title}
                                </h4>
                                <p className="text-600 text-sm line-height-3 m-0">
                                    {feature.description}
                                </p>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Settings Dialog */}
            <Dialog
                header={getDialogTitle()}
                visible={activeDialog !== null}
                style={{ width: '700px', maxWidth: '95vw' }}
                onHide={() => setActiveDialog(null)}
                draggable={false}
                resizable={false}
                dismissableMask
                className="settings-dialog"
            >
                {getDialogContent()}
            </Dialog>
        </div>
    );
}
