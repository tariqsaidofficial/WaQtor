/**
 * Settings Page
 * Configure Waqtor dashboard and API settings
 */

import React, { useState, useRef, useEffect, useContext } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';
import { PrimeReactContext } from 'primereact/api';
import { statusService } from '../api/services';
import { useAppStore } from '../store/useAppStore';
import { LayoutContext } from '../components/layout/context/layoutcontext';

export default function Settings() {
    const toast = useRef(null);
    const { status } = useAppStore();
    const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
    const { changeTheme } = useContext(PrimeReactContext);
    const [saving, setSaving] = useState(false);
    const [versionInfo, setVersionInfo] = useState(null);
    const [scales] = useState([12, 13, 14, 15, 16]);
  
    const [settings, setSettings] = useState({
        apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
        apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
        wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080',
        autoReconnect: true,
        keepAlive: true,
        notifications: true,
        soundEnabled: true
    });

    // Branding settings
    const [brandingSettings, setBrandingSettings] = useState({
        logoUrl: '/layout/images/logo-dark.svg',
        logoText: 'WaQtor',
        showLogoText: true,
        footerText: 'WhatsApp Marketing Platform'
    });

    useEffect(() => {
        loadVersionInfo();
        loadSettings();
        loadBrandingSettings();
    }, []);

    const loadBrandingSettings = () => {
        if (typeof window !== 'undefined') {
            const savedLogoUrl = localStorage.getItem('app_logo');
            const savedLogoText = localStorage.getItem('app_logo_text');
            const savedShowLogoText = localStorage.getItem('app_show_logo_text');
            const savedFooterText = localStorage.getItem('app_footer_text');
            
            setBrandingSettings({
                logoUrl: savedLogoUrl || '/layout/images/logo-dark.svg',
                logoText: savedLogoText || 'WaQtor',
                showLogoText: savedShowLogoText !== 'false',
                footerText: savedFooterText || 'WhatsApp Marketing Platform'
            });
        }
    };

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
            
            // Save branding settings
            localStorage.setItem('app_logo', brandingSettings.logoUrl);
            localStorage.setItem('app_logo_text', brandingSettings.logoText);
            localStorage.setItem('app_show_logo_text', brandingSettings.showLogoText.toString());
            localStorage.setItem('app_footer_text', brandingSettings.footerText);
            
            // Trigger page reload to apply branding changes
            window.dispatchEvent(new Event('branding-updated'));
            
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Settings saved! Reloading page...',
                life: 2000
            });
            
            // Reload page after 2 seconds to apply changes
            setTimeout(() => {
                window.location.reload();
            }, 2000);
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

                        <div className="col-12">
                            <Divider />
                        </div>

                        <div className="col-6">
                            <div className="text-500 mb-1">
                                <i className="pi pi-desktop mr-1"></i>
                                Platform
                            </div>
                            <div className="font-semibold text-sm">
                                {typeof window !== 'undefined' ? window.navigator.platform : 'Server'}
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="text-500 mb-1">
                                <i className="pi pi-globe mr-1"></i>
                                Browser
                            </div>
                            <div className="font-semibold text-sm">
                                {typeof window !== 'undefined' ? window.navigator.userAgent.includes('Chrome') ? 'Chrome' : window.navigator.userAgent.includes('Firefox') ? 'Firefox' : window.navigator.userAgent.includes('Safari') ? 'Safari' : 'Other' : 'N/A'}
                            </div>
                        </div>

                        <div className="col-12">
                            <Divider />
                        </div>

                        <div className="col-6">
                            <div className="text-500 mb-1">
                                <i className="pi pi-clock mr-1"></i>
                                Uptime
                            </div>
                            <div className="font-semibold text-sm">
                                {versionInfo?.uptime || 'N/A'}
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="text-500 mb-1">
                                <i className="pi pi-server mr-1"></i>
                                Memory Usage
                            </div>
                            <div className="font-semibold text-sm">
                                {versionInfo?.memoryUsage || 'N/A'}
                            </div>
                        </div>

                        <div className="col-12">
                            <Divider />
                        </div>

                        <div className="col-12">
                            <div className="text-500 mb-1">
                                <i className="pi pi-calendar mr-1"></i>
                                Last Updated
                            </div>
                            <div className="font-semibold text-sm">
                                {new Date().toLocaleString()}
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
          
                    <div className="grid">
                        <div className="col-12">
                            <div className="flex align-items-center justify-content-between mb-3 p-3 surface-50 border-round">
                                <div>
                                    <div className="font-semibold mb-1">
                                        <i className="pi pi-mobile mr-2 text-primary"></i>
                                        WhatsApp Session
                                    </div>
                                    <small className="text-500">Current connection status</small>
                                </div>
                                <div className="text-right">
                                    {(status === 'ready' || status === 'authenticated' || status === 'connected') ? (
                                        <span className="text-green-500 font-semibold">
                                            <i className="pi pi-check-circle mr-1"></i>
                                            Active
                                        </span>
                                    ) : (
                                        <span className="text-orange-500 font-semibold">
                                            <i className="pi pi-exclamation-circle mr-1"></i>
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <Divider />
                        </div>

                        <div className="col-12">
                            <div className="flex gap-2">
                                <Button
                                    label="Logout WhatsApp"
                                    icon="pi pi-sign-out"
                                    severity="danger"
                                    onClick={handleLogout}
                                    disabled={status !== 'ready'}
                                />
                                <Button
                                    label="Restart Session"
                                    icon="pi pi-refresh"
                                    severity="warning"
                                    outlined
                                    onClick={() => {
                                        toast.current?.show({
                                            severity: 'info',
                                            summary: 'Restarting',
                                            detail: 'Session restart initiated',
                                            life: 3000
                                        });
                                    }}
                                    disabled={status !== 'ready'}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Appearance Settings */}
            <div className="col-12">
                <Card>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold m-0 mb-2 text-primary">
                            <i className="pi pi-palette mr-2"></i>
                            Appearance Settings
                        </h2>
                        <p className="text-600 m-0">Customize the look and feel of your dashboard</p>
                    </div>

                    <div className="grid">
                        {/* Theme Selection */}
                        <div className="col-12">
                            <h5 className="font-bold mb-3">
                                <i className="pi pi-sun mr-2"></i>
                                Theme Selection
                            </h5>
                            <div className="grid">
                                <div className="col-6 lg:col-3">
                                    <button
                                        className="p-link w-full border-2 border-round p-2"
                                        style={{ borderColor: layoutConfig.theme === 'lara-light-teal' ? 'var(--primary-color)' : 'transparent' }}
                                        onClick={() => changeTheme?.(layoutConfig.theme, 'lara-light-teal', 'theme-css', () => {
                                            setLayoutConfig(prev => ({ ...prev, theme: 'lara-light-teal', colorScheme: 'light' }));
                                        })}
                                    >
                                        <img
                                            src='/layout/images/themes/lara-light-teal.png'
                                            className='w-full border-round'
                                            alt='Lara Light Teal'
                                            style={{ maxHeight: '120px', objectFit: 'cover' }}
                                        />
                                        <div className="text-center mt-2 text-sm">Light Teal</div>
                                    </button>
                                </div>
                                <div className="col-6 lg:col-3">
                                    <button
                                        className="p-link w-full border-2 border-round p-2 transition-all transition-duration-200 hover:shadow-3"
                                        style={{ borderColor: layoutConfig.theme === 'lara-dark-teal' ? 'var(--primary-color)' : 'transparent' }}
                                        onClick={() => changeTheme?.(layoutConfig.theme, 'lara-dark-teal', 'theme-css', () => {
                                            setLayoutConfig(prev => ({ ...prev, theme: 'lara-dark-teal', colorScheme: 'dark' }));
                                        })}
                                    >
                                        <img
                                            src='/layout/images/themes/lara-dark-teal.png'
                                            className='w-full border-round'
                                            alt='Lara Dark Teal'
                                            style={{ maxHeight: '120px', objectFit: 'cover' }}
                                        />
                                        <div className="text-center mt-2 text-sm font-semibold">Dark Teal</div>
                                    </button>
                                </div>
                                <div className="col-6 lg:col-3">
                                    <button
                                        className="p-link w-full border-2 border-round p-2 transition-all transition-duration-200 hover:shadow-3"
                                        style={{ borderColor: layoutConfig.theme === 'lara-light-indigo' ? 'var(--primary-color)' : 'transparent' }}
                                        onClick={() => changeTheme?.(layoutConfig.theme, 'lara-light-indigo', 'theme-css', () => {
                                            setLayoutConfig(prev => ({ ...prev, theme: 'lara-light-indigo', colorScheme: 'light' }));
                                        })}
                                    >
                                        <img
                                            src='/layout/images/themes/lara-light-indigo.png'
                                            className='w-full border-round'
                                            alt='Lara Light Indigo'
                                            style={{ maxHeight: '120px', objectFit: 'cover' }}
                                        />
                                        <div className="text-center mt-2 text-sm font-semibold">Light Indigo</div>
                                    </button>
                                </div>
                                <div className="col-6 lg:col-3">
                                    <button
                                        className="p-link w-full border-2 border-round p-2"
                                        style={{ borderColor: layoutConfig.theme === 'lara-dark-indigo' ? 'var(--primary-color)' : 'transparent' }}
                                        onClick={() => changeTheme?.(layoutConfig.theme, 'lara-dark-indigo', 'theme-css', () => {
                                            setLayoutConfig(prev => ({ ...prev, theme: 'lara-dark-indigo', colorScheme: 'dark' }));
                                        })}
                                    >
                                        <img
                                            src='/layout/images/themes/lara-dark-indigo.png'
                                            className='w-full border-round'
                                            alt='Lara Dark Indigo'
                                            style={{ maxHeight: '120px', objectFit: 'cover' }}
                                        />
                                        <div className="text-center mt-2 text-sm">Dark Indigo</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-12"><Divider /></div>

                        {/* Typography Scale */}
                        <div className="col-12 md:col-6">
                            <h6 className="font-semibold mb-3">Typography Scale</h6>
                            <div className='flex align-items-center gap-3'>
                                <Button
                                    icon='pi pi-minus'
                                    onClick={() => setLayoutConfig(prev => ({ ...prev, scale: prev.scale - 1 }))}
                                    rounded
                                    text
                                    disabled={layoutConfig.scale === scales[0]}
                                />
                                <div className='flex gap-2 align-items-center'>
                                    {scales.map((item) => (
                                        <i
                                            key={item}
                                            className={`pi pi-circle-fill ${
                                                item === layoutConfig.scale ? 'text-primary' : 'text-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <Button
                                    icon='pi pi-plus'
                                    onClick={() => setLayoutConfig(prev => ({ ...prev, scale: prev.scale + 1 }))}
                                    rounded
                                    text
                                    disabled={layoutConfig.scale === scales[scales.length - 1]}
                                />
                                <span className="text-600 ml-2">{layoutConfig.scale}px</span>
                            </div>
                        </div>

                        {/* Input Style */}
                        <div className="col-12 md:col-6">
                            <h6 className="font-semibold mb-3">Input Style</h6>
                            <div className='flex gap-4'>
                                <div className='flex align-items-center'>
                                    <RadioButton
                                        inputId='outlined_input'
                                        name='inputStyle'
                                        value='outlined'
                                        checked={layoutConfig.inputStyle === 'outlined'}
                                        onChange={(e) => setLayoutConfig(prev => ({ ...prev, inputStyle: e.value }))}
                                    />
                                    <label htmlFor='outlined_input' className='ml-2'>Outlined</label>
                                </div>
                                <div className='flex align-items-center'>
                                    <RadioButton
                                        inputId='filled_input'
                                        name='inputStyle'
                                        value='filled'
                                        checked={layoutConfig.inputStyle === 'filled'}
                                        onChange={(e) => setLayoutConfig(prev => ({ ...prev, inputStyle: e.value }))}
                                    />
                                    <label htmlFor='filled_input' className='ml-2'>Filled</label>
                                </div>
                            </div>
                        </div>

                        <div className="col-12"><Divider /></div>

                        {/* Menu Mode */}
                        <div className="col-12 md:col-6">
                            <h6 className="font-semibold mb-3">Menu Type</h6>
                            <div className='flex gap-4'>
                                <div className='flex align-items-center'>
                                    <RadioButton
                                        inputId='static_menu'
                                        name='menuMode'
                                        value='static'
                                        checked={layoutConfig.menuMode === 'static'}
                                        onChange={(e) => setLayoutConfig(prev => ({ ...prev, menuMode: e.value }))}
                                    />
                                    <label htmlFor='static_menu' className='ml-2'>Static</label>
                                </div>
                                <div className='flex align-items-center'>
                                    <RadioButton
                                        inputId='overlay_menu'
                                        name='menuMode'
                                        value='overlay'
                                        checked={layoutConfig.menuMode === 'overlay'}
                                        onChange={(e) => setLayoutConfig(prev => ({ ...prev, menuMode: e.value }))}
                                    />
                                    <label htmlFor='overlay_menu' className='ml-2'>Overlay</label>
                                </div>
                            </div>
                        </div>

                        {/* Ripple Effect */}
                        <div className="col-12 md:col-6">
                            <h6 className="font-semibold mb-3">Ripple Effect</h6>
                            <InputSwitch
                                checked={layoutConfig.ripple}
                                onChange={(e) => setLayoutConfig(prev => ({ ...prev, ripple: e.value }))}
                            />
                        </div>

                        <div className="col-12"><Divider /></div>

                        {/* Branding Section */}
                        <div className="col-12">
                            <h5 className="font-bold mb-3 text-primary">
                                <i className="pi pi-palette mr-2"></i>
                                Branding & Customization
                            </h5>
                        </div>

                        {/* Logo Settings */}
                        <div className="col-12 lg:col-6">
                            <h6 className="font-semibold mb-3">Logo Settings</h6>
                            <div className="grid">
                                <div className="col-12">
                                    <label className="block mb-2 text-sm">Logo URL</label>
                                    <InputText
                                        value={brandingSettings.logoUrl}
                                        onChange={(e) => setBrandingSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                                        placeholder="/layout/images/logo-dark.svg"
                                        className="w-full mb-2"
                                    />
                                    <small className="text-500">Path to logo image (e.g., /images/my-logo.svg)</small>
                                </div>
                                <div className="col-12">
                                    <label className="block mb-2 text-sm">Logo Text</label>
                                    <InputText
                                        value={brandingSettings.logoText}
                                        onChange={(e) => setBrandingSettings(prev => ({ ...prev, logoText: e.target.value }))}
                                        placeholder="SAKAI"
                                        className="w-full mb-2"
                                    />
                                    <small className="text-500">Text displayed next to logo</small>
                                </div>
                                <div className="col-12">
                                    <div className="flex align-items-center gap-2">
                                        <InputSwitch
                                            checked={brandingSettings.showLogoText}
                                            onChange={(e) => setBrandingSettings(prev => ({ ...prev, showLogoText: e.value }))}
                                        />
                                        <label className="text-sm">Show Logo Text</label>
                                    </div>
                                    <small className="text-500 block mt-2">
                                        {brandingSettings.showLogoText ? 'Logo + Text' : 'Logo Only'}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Footer & Favicon */}
                        <div className="col-12 lg:col-6">
                            <h6 className="font-semibold mb-3">Footer & Favicon</h6>
                            <div className="grid">
                                <div className="col-12">
                                    <label className="block mb-2 text-sm">Footer Text</label>
                                    <InputText
                                        value={brandingSettings.footerText}
                                        onChange={(e) => setBrandingSettings(prev => ({ ...prev, footerText: e.target.value }))}
                                        placeholder="WhatsApp Marketing Platform"
                                        className="w-full mb-2"
                                    />
                                    <small className="text-500">Text displayed in footer</small>
                                </div>
                                <div className="col-12">
                                    <label className="block mb-2 text-sm">Favicon</label>
                                    <FileUpload
                                        mode="basic"
                                        name="favicon"
                                        accept="image/x-icon,image/png"
                                        maxFileSize={100000}
                                        chooseLabel="Upload Favicon"
                                        className="w-full"
                                        auto
                                        customUpload
                                        uploadHandler={(e) => {
                                            const file = e.files[0];
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                // Here you would typically upload to server
                                                // For now, we'll just show a message
                                                toast.current?.show({
                                                    severity: 'info',
                                                    summary: 'Favicon Selected',
                                                    detail: 'Save settings to apply changes',
                                                    life: 3000
                                                });
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                    <small className="text-500">Recommended: 32x32px, ICO/PNG</small>
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="col-12">
                            <Divider />
                            <h6 className="font-semibold mb-3">Preview</h6>
                            <div className="surface-50 border-round p-4">
                                <div className="flex align-items-center gap-3 mb-4">
                                    <img src={brandingSettings.logoUrl} alt="Logo Preview" height="35" />
                                    {brandingSettings.showLogoText && (
                                        <span className="font-bold text-xl">{brandingSettings.logoText}</span>
                                    )}
                                </div>
                                <div className="text-sm text-600">
                                    <i className="pi pi-info-circle mr-2"></i>
                                    Footer: <span className="font-medium">{brandingSettings.footerText}</span>
                                </div>
                            </div>
                        </div>
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
