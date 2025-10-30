'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

interface AppearanceSettingsProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function AppearanceSettings({ onSuccess, onError }: AppearanceSettingsProps) {
    const scales = [12, 13, 14, 15, 16];
    const [scale, setScale] = useState(14);
    const [theme, setTheme] = useState('lara-light-teal');
    
    // Branding States
    const [appName, setAppName] = useState('WaQtor');
    const [appTitle, setAppTitle] = useState('WaQtor - WhatsApp API');
    const [logoUrl, setLogoUrl] = useState('/layout/images/logo-dark.svg');
    const [logoText, setLogoText] = useState('WaQtor');
    const [showLogoText, setShowLogoText] = useState(true);
    const [footerText, setFooterText] = useState('© 2024 WaQtor. All rights reserved.');
    const [showFooter, setShowFooter] = useState(true);
    const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load saved preferences
        const savedScale = parseInt(localStorage.getItem('scale') || '14');
        const savedTheme = localStorage.getItem('theme') || 'lara-light-teal';
        
        // Load branding settings
        const savedAppName = localStorage.getItem('app_name') || 'WaQtor';
        const savedAppTitle = localStorage.getItem('app_title') || 'WaQtor - WhatsApp API';
        const savedLogoUrl = localStorage.getItem('app_logo') || '/layout/images/logo-dark.svg';
        const savedLogoText = localStorage.getItem('app_logo_text') || 'WaQtor';
        const savedShowLogoText = localStorage.getItem('app_show_logo_text') !== 'false';
        const savedFooterText = localStorage.getItem('app_footer_text') || '© 2024 WaQtor. All rights reserved.';
        const savedShowFooter = localStorage.getItem('app_show_footer') !== 'false';
        const savedFaviconUrl = localStorage.getItem('app_favicon') || '/favicon.ico';
        
        setScale(savedScale);
        setTheme(savedTheme);
        setAppName(savedAppName);
        setAppTitle(savedAppTitle);
        setLogoUrl(savedLogoUrl);
        setLogoText(savedLogoText);
        setShowLogoText(savedShowLogoText);
        setFooterText(savedFooterText);
        setShowFooter(savedShowFooter);
        setFaviconUrl(savedFaviconUrl);
        
        // Apply scale
        document.documentElement.style.fontSize = `${savedScale}px`;
        
        // Apply app title
        document.title = savedAppTitle;
    }, []);

    const decrementScale = () => {
        if (scale > scales[0]) {
            const newScale = scale - 1;
            setScale(newScale);
            document.documentElement.style.fontSize = `${newScale}px`;
            localStorage.setItem('scale', newScale.toString());
            onSuccess(`Scale changed to ${newScale}px`);
        }
    };

    const incrementScale = () => {
        if (scale < scales[scales.length - 1]) {
            const newScale = scale + 1;
            setScale(newScale);
            document.documentElement.style.fontSize = `${newScale}px`;
            localStorage.setItem('scale', newScale.toString());
            onSuccess(`Scale changed to ${newScale}px`);
        }
    };


    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme link
        const themeLink = document.getElementById('theme-css') as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = `/themes/${newTheme}/theme.css`;
        }
        
        onSuccess(`Theme changed to ${newTheme}`);
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSuccess('Appearance settings saved successfully');
        } catch (error) {
            onError('Failed to save appearance settings');
        } finally {
            setLoading(false);
        }
    };

    const handleResetToDefault = () => {
        // Reset all settings to default
        setScale(14);
        setTheme('lara-light-teal');
        setAppName('WaQtor');
        setAppTitle('WaQtor - WhatsApp API');
        setLogoUrl('/layout/images/logo-dark.svg');
        setLogoText('WaQtor');
        setShowLogoText(true);
        setFooterText('© 2024 WaQtor. All rights reserved.');
        setShowFooter(true);
        setFaviconUrl('/favicon.ico');
        
        // Save to localStorage
        localStorage.setItem('scale', '14');
        localStorage.setItem('theme', 'lara-light-teal');
        localStorage.setItem('app_name', 'WaQtor');
        localStorage.setItem('app_title', 'WaQtor - WhatsApp API');
        localStorage.setItem('app_logo', '/layout/images/logo-dark.svg');
        localStorage.setItem('app_logo_text', 'WaQtor');
        localStorage.setItem('app_show_logo_text', 'true');
        localStorage.setItem('app_footer_text', '© 2024 WaQtor. All rights reserved.');
        localStorage.setItem('app_show_footer', 'true');
        localStorage.setItem('app_favicon', '/favicon.ico');
        
        // Apply changes
        document.documentElement.style.fontSize = '14px';
        document.title = 'WaQtor - WhatsApp API';
        
        const themeLink = document.getElementById('theme-css') as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = '/themes/lara-light-teal/theme.css';
        }
        
        const faviconLink = document.querySelector('link[rel*=\'icon\']') as HTMLLinkElement;
        if (faviconLink) {
            faviconLink.href = '/favicon.ico';
        }
        
        window.dispatchEvent(new Event('branding-update'));
        onSuccess('Reset to default settings');
    };

    return (
        <Card className="settings-card-content">
            <div className="flex flex-column gap-3">
                {/* Scale & Theme in one row */}
                <div className="grid">
                    {/* Scale */}
                    <div className="col-12 md:col-6">
                        <div className="surface-card p-3 border-round shadow-1 h-full">
                            <div className="flex align-items-center gap-2 mb-2">
                                <i className="pi pi-search-plus text-xl text-primary"></i>
                                <span className="font-semibold">Scale</span>
                            </div>
                            <div className="flex align-items-center justify-content-center gap-3">
                                <Button 
                                    icon="pi pi-minus" 
                                    onClick={decrementScale} 
                                    rounded 
                                    text 
                                    className="w-2rem h-2rem" 
                                    disabled={scale === scales[0]}
                                />
                                <div className="flex gap-2 align-items-center">
                                    {scales.map((item) => (
                                        <i 
                                            key={item}
                                            className={classNames('pi pi-circle-fill', {
                                                'text-primary': item === scale,
                                                'text-300': item !== scale
                                            })}
                                        ></i>
                                    ))}
                                </div>
                                <Button 
                                    icon="pi pi-plus" 
                                    onClick={incrementScale} 
                                    rounded 
                                    text 
                                    className="w-2rem h-2rem" 
                                    disabled={scale === scales[scales.length - 1]}
                                />
                            </div>
                            <div className="text-center mt-2">
                                <small className="text-500">{scale}px</small>
                            </div>
                        </div>
                    </div>

                    {/* Theme */}
                    <div className="col-12 md:col-6">
                        <div className="surface-card p-3 border-round shadow-1 h-full">
                            <div className="flex align-items-center gap-2 mb-2">
                                <i className="pi pi-palette text-xl text-primary"></i>
                                <span className="font-semibold">Theme</span>
                            </div>
                            <div className="grid">
                                <div className="col-6">
                                    <button 
                                        className="p-link w-full h-3rem border-round overflow-hidden" 
                                        onClick={() => handleThemeChange('lara-light-teal')}
                                        style={{ border: theme === 'lara-light-teal' ? '2px solid var(--primary-color)' : '1px solid var(--surface-border)' }}
                                    >
                                        <div className="h-full flex align-items-center justify-content-center bg-teal-100">
                                            <i className="pi pi-sun text-xl text-teal-600"></i>
                                        </div>
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button 
                                        className="p-link w-full h-3rem border-round overflow-hidden" 
                                        onClick={() => handleThemeChange('lara-dark-teal')}
                                        style={{ border: theme === 'lara-dark-teal' ? '2px solid var(--primary-color)' : '1px solid var(--surface-border)' }}
                                    >
                                        <div className="h-full flex align-items-center justify-content-center bg-gray-900">
                                            <i className="pi pi-moon text-xl text-teal-400"></i>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Branding & Customization */}
                <div className="surface-card p-4 border-round shadow-1">
                    <div className="flex align-items-center gap-2 mb-4">
                        <i className="pi pi-building text-2xl text-primary"></i>
                        <span className="text-xl font-semibold">Branding & Customization</span>
                    </div>
                    
                    <div className="flex flex-column gap-3">
                        {/* App Name & Browser Title */}
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <label className="block mb-2 font-semibold">App Name</label>
                                <InputText
                                    value={appName}
                                    onChange={(e) => {
                                        setAppName(e.target.value);
                                        localStorage.setItem('app_name', e.target.value);
                                        window.dispatchEvent(new Event('branding-update'));
                                        onSuccess('App name updated');
                                    }}
                                    className="w-full"
                                    placeholder="Enter app name"
                                />
                                <small className="text-500">Used in header</small>
                            </div>
                            <div className="col-12 md:col-6">
                                <label className="block mb-2 font-semibold">Browser Tab Title</label>
                                <InputText
                                    value={appTitle}
                                    onChange={(e) => {
                                        setAppTitle(e.target.value);
                                        localStorage.setItem('app_title', e.target.value);
                                        document.title = e.target.value;
                                        onSuccess('Browser title updated');
                                    }}
                                    className="w-full"
                                    placeholder="Enter browser tab title"
                                />
                                <small className="text-500">Displayed in browser tab</small>
                            </div>
                        </div>

                        {/* Logo Settings */}
                        <div className="surface-border border-1 border-round p-3">
                            <h6 className="mt-0 mb-3">Logo Settings</h6>
                            
                            <div className="flex flex-column gap-3">
                                <div className="grid">
                                    <div className="col-12 md:col-6">
                                        <label className="block mb-2 font-semibold">Logo URL</label>
                                        <div className="flex gap-2">
                                            <InputText
                                                value={logoUrl}
                                                onChange={(e) => {
                                                    setLogoUrl(e.target.value);
                                                    localStorage.setItem('app_logo', e.target.value);
                                                    window.dispatchEvent(new Event('branding-update'));
                                                    onSuccess('Logo URL updated');
                                                }}
                                                className="flex-1"
                                                placeholder="/path/to/logo.png"
                                            />
                                            <Button
                                                icon="pi pi-upload"
                                                tooltip="Upload"
                                                tooltipOptions={{ position: 'top' }}
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e: any) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                const url = event.target?.result as string;
                                                                setLogoUrl(url);
                                                                localStorage.setItem('app_logo', url);
                                                                window.dispatchEvent(new Event('branding-update'));
                                                                onSuccess('Logo uploaded');
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    };
                                                    input.click();
                                                }}
                                            />
                                        </div>
                                        <small className="text-500">PNG/SVG (40x40px)</small>
                                    </div>

                                    <div className="col-12 md:col-6">
                                        <label className="block mb-2 font-semibold">Logo Text</label>
                                        <InputText
                                            value={logoText}
                                            onChange={(e) => {
                                                setLogoText(e.target.value);
                                                localStorage.setItem('app_logo_text', e.target.value);
                                                window.dispatchEvent(new Event('branding-update'));
                                                onSuccess('Logo text updated');
                                            }}
                                            className="w-full"
                                            placeholder="Enter logo text"
                                        />
                                        <small className="text-500">Text next to logo</small>
                                    </div>
                                </div>

                                <div className="flex align-items-center justify-content-between">
                                    <div>
                                        <div className="font-semibold">Show Logo Text</div>
                                        <div className="text-500 text-sm">Display text next to logo</div>
                                    </div>
                                    <InputSwitch
                                        checked={showLogoText}
                                        onChange={(e) => {
                                            setShowLogoText(e.value);
                                            localStorage.setItem('app_show_logo_text', e.value.toString());
                                            window.dispatchEvent(new Event('branding-update'));
                                            onSuccess(`Logo text ${e.value ? 'shown' : 'hidden'}`);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Favicon */}
                        <div className="surface-border border-1 border-round p-3">
                            <h6 className="mt-0 mb-3">Favicon</h6>
                            <div>
                                <label className="block mb-2 font-semibold">Favicon URL</label>
                                <div className="flex gap-2">
                                    <InputText
                                        value={faviconUrl}
                                        onChange={(e) => {
                                            setFaviconUrl(e.target.value);
                                            localStorage.setItem('app_favicon', e.target.value);
                                            const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
                                            if (link) link.href = e.target.value;
                                            onSuccess('Favicon updated');
                                        }}
                                        className="flex-1"
                                        placeholder="/favicon.ico"
                                    />
                                    <Button
                                        icon="pi pi-upload"
                                        tooltip="Upload Favicon"
                                        tooltipOptions={{ position: 'top' }}
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/x-icon,image/png';
                                            input.onchange = (e: any) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        const url = event.target?.result as string;
                                                        setFaviconUrl(url);
                                                        localStorage.setItem('app_favicon', url);
                                                        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
                                                        if (link) link.href = url;
                                                        onSuccess('Favicon uploaded');
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            };
                                            input.click();
                                        }}
                                    />
                                </div>
                                <small className="text-500">Upload ICO/PNG (recommended: 32x32px)</small>
                            </div>
                        </div>

                        {/* Footer Settings */}
                        <div className="surface-border border-1 border-round p-3">
                            <h6 className="mt-0 mb-3">Footer Settings</h6>
                            <div className="flex flex-column gap-3">
                                <div>
                                    <label className="block mb-2 font-semibold">Footer Text</label>
                                    <InputText
                                        value={footerText}
                                        onChange={(e) => {
                                            setFooterText(e.target.value);
                                            localStorage.setItem('app_footer_text', e.target.value);
                                            window.dispatchEvent(new Event('branding-update'));
                                            onSuccess('Footer text updated');
                                        }}
                                        className="w-full"
                                        placeholder="© 2024 Your Company"
                                    />
                                </div>

                                <div className="flex align-items-center justify-content-between">
                                    <div>
                                        <div className="font-semibold">Show Footer</div>
                                        <div className="text-500 text-sm">Display footer at bottom</div>
                                    </div>
                                    <InputSwitch
                                        checked={showFooter}
                                        onChange={(e) => {
                                            setShowFooter(e.value);
                                            localStorage.setItem('app_show_footer', e.value.toString());
                                            window.dispatchEvent(new Event('branding-update'));
                                            onSuccess(`Footer ${e.value ? 'shown' : 'hidden'}`);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        label="Reset to Default"
                        icon="pi pi-undo"
                        onClick={handleResetToDefault}
                        className="flex-1"
                        severity="secondary"
                        outlined
                    />
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        onClick={handleSaveSettings}
                        loading={loading}
                        className="flex-1"
                    />
                </div>

                {/* Info Message */}
                <div className="surface-border border-1 border-round p-3">
                    <div className="flex align-items-start gap-2">
                        <i className="pi pi-info-circle text-blue-500 text-xl mt-1"></i>
                        <div>
                            <div className="font-semibold text-900 mb-1">Auto-Save</div>
                            <div className="text-600 text-sm line-height-3">
                                Changes are applied immediately and saved to your browser's local storage.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
