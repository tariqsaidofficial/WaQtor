'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
interface AppearanceSettingsProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function AppearanceSettings({ onSuccess, onError }: AppearanceSettingsProps) {
    const [theme, setTheme] = useState('soho-light');
    const [darkMode, setDarkMode] = useState(false);
    const [compactMode, setCompactMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const themes = [
        { label: 'Soho Light', value: 'soho-light' },
        { label: 'Soho Dark', value: 'soho-dark' },
        { label: 'Lara Light Blue', value: 'lara-light-blue' },
        { label: 'Lara Dark Blue', value: 'lara-dark-blue' },
        { label: 'Lara Light Teal', value: 'lara-light-teal' },
        { label: 'Lara Dark Teal', value: 'lara-dark-teal' },
        { label: 'Viva Light', value: 'viva-light' },
        { label: 'Viva Dark', value: 'viva-dark' }
    ];

    useEffect(() => {
        // Load saved preferences
        const savedTheme = localStorage.getItem('theme') || 'soho-light';
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        const savedCompactMode = localStorage.getItem('compactMode') === 'true';
        
        setTheme(savedTheme);
        setDarkMode(savedDarkMode);
        setCompactMode(savedCompactMode);
    }, []);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme link
        const themeLink = document.getElementById('theme-link') as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = `/themes/${newTheme}/theme.css`;
        }
        
        onSuccess(`Theme changed to ${newTheme}`);
    };

    const handleDarkModeToggle = (value: boolean) => {
        setDarkMode(value);
        localStorage.setItem('darkMode', value.toString());
        
        if (value) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        onSuccess(`Dark mode ${value ? 'enabled' : 'disabled'}`);
    };

    const handleCompactModeToggle = (value: boolean) => {
        setCompactMode(value);
        localStorage.setItem('compactMode', value.toString());
        
        if (value) {
            document.documentElement.classList.add('compact');
        } else {
            document.documentElement.classList.remove('compact');
        }
        
        onSuccess(`Compact mode ${value ? 'enabled' : 'disabled'}`);
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
        setTheme('soho-light');
        setDarkMode(false);
        setCompactMode(false);
        
        localStorage.setItem('theme', 'soho-light');
        localStorage.setItem('darkMode', 'false');
        localStorage.setItem('compactMode', 'false');
        
        document.documentElement.classList.remove('dark', 'compact');
        
        const themeLink = document.getElementById('theme-link') as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = '/themes/soho-light/theme.css';
        }
        
        onSuccess('Reset to default appearance');
    };

    return (
        <Card title="🧠 Appearance" className="settings-card h-full">
            <div className="flex flex-column gap-3">
                <div>
                    <label className="block mb-2 font-semibold">
                        <i className="pi pi-palette mr-2"></i>
                        Theme
                    </label>
                    <Dropdown
                        value={theme}
                        options={themes}
                        onChange={(e) => handleThemeChange(e.value)}
                        className="w-full"
                        placeholder="Select theme"
                    />
                </div>

                <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                    <div>
                        <div className="font-semibold mb-1">
                            <i className="pi pi-moon mr-2"></i>
                            Dark Mode
                        </div>
                        <div className="text-500 text-sm">Enable dark theme</div>
                    </div>
                    <InputSwitch 
                        checked={darkMode} 
                        onChange={(e) => handleDarkModeToggle(e.value)}
                    />
                </div>

                <div className="flex align-items-center justify-content-between p-3 border-round surface-border" style={{ border: '1px solid var(--surface-border)' }}>
                    <div>
                        <div className="font-semibold mb-1">
                            <i className="pi pi-arrows-h mr-2"></i>
                            Compact Mode
                        </div>
                        <div className="text-500 text-sm">Reduce spacing</div>
                    </div>
                    <InputSwitch 
                        checked={compactMode} 
                        onChange={(e) => handleCompactModeToggle(e.value)}
                    />
                </div>

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

                <div className="p-3 bg-blue-50 border-round">
                    <div className="flex align-items-start gap-2">
                        <i className="pi pi-info-circle text-blue-600 mt-1"></i>
                        <div className="text-sm">
                            <strong>Tip:</strong> Changes are applied immediately and saved to your browser.
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
