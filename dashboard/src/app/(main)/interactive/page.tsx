'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import ProtectedPage from '../../../components/BlockUI/ProtectedPage';
import './interactive.css';

function InteractivePage() {
    const [chatId, setChatId] = useState('');
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(false);
    const toast = React.useRef<Toast>(null);

    const languages = [
        { label: '🇬🇧 English', value: 'en' },
        { label: '🇪🇬 العربية', value: 'ar' }
    ];

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

    const handleStartDemo = async () => {
        if (!chatId) {
            showError('Please enter a chat ID');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/interactive/demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || 'test-api-key-123'
                },
                body: JSON.stringify({ chatId })
            });

            const data = await response.json();
            
            if (data.success) {
                showSuccess('Demo started! Check your WhatsApp.');
            } else {
                showError(data.error || 'Failed to start demo');
            }
        } catch (error) {
            showError('Failed to start demo');
        } finally {
            setLoading(false);
        }
    };

    const handleSendLanguageSelection = async () => {
        if (!chatId) {
            showError('Please enter a chat ID');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/interactive/language', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || 'test-api-key-123'
                },
                body: JSON.stringify({ chatId })
            });

            const data = await response.json();
            
            if (data.success) {
                showSuccess('Language selection sent!');
            } else {
                showError(data.error || 'Failed to send');
            }
        } catch (error) {
            showError('Failed to send language selection');
        } finally {
            setLoading(false);
        }
    };

    const handleSendProducts = async () => {
        if (!chatId) {
            showError('Please enter a chat ID');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/interactive/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || 'test-api-key-123'
                },
                body: JSON.stringify({ chatId, language })
            });

            const data = await response.json();
            
            if (data.success) {
                showSuccess('Product catalog sent!');
            } else {
                showError(data.error || 'Failed to send');
            }
        } catch (error) {
            showError('Failed to send product catalog');
        } finally {
            setLoading(false);
        }
    };

    const handleSendServices = async () => {
        if (!chatId) {
            showError('Please enter a chat ID');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/interactive/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || 'test-api-key-123'
                },
                body: JSON.stringify({ chatId, language })
            });

            const data = await response.json();
            
            if (data.success) {
                showSuccess('Service menu sent!');
            } else {
                showError(data.error || 'Failed to send');
            }
        } catch (error) {
            showError('Failed to send service menu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="interactive-page">
            <Toast ref={toast} />
            
            {/* Header */}
            <div className="interactive-header mb-4">
                <h1 className="text-3xl font-bold m-0 mb-2">
                    <i className="pi pi-comments mr-2 text-primary"></i>
                    Interactive Messages
                </h1>
                <p className="text-600 m-0">
                    Send interactive buttons and lists to WhatsApp users
                </p>
            </div>

            <div className="grid">
                {/* Configuration Card */}
                <div className="col-12 lg:col-4">
                    <Card title={<><i className="pi pi-cog mr-2"></i>Configuration</>} className="interactive-card h-full">
                        <div className="flex flex-column gap-3">
                            <div>
                                <label className="block mb-2 font-semibold">
                                    <i className="pi pi-user mr-2"></i>
                                    Chat ID (Phone Number)
                                </label>
                                <InputText
                                    value={chatId}
                                    onChange={(e) => setChatId(e.target.value)}
                                    placeholder="201234567890@c.us"
                                    className="w-full"
                                />
                                <small className="text-500">
                                    Format: countrycode + number + @c.us
                                </small>
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold">
                                    <i className="pi pi-globe mr-2"></i>
                                    Language
                                </label>
                                <Dropdown
                                    value={language}
                                    options={languages}
                                    onChange={(e) => setLanguage(e.value)}
                                    className="w-full"
                                    placeholder="Select language"
                                />
                            </div>

                            <Divider />

                            <Button
                                label="🚀 Start Full Demo"
                                icon="pi pi-play"
                                onClick={handleStartDemo}
                                loading={loading}
                                className="w-full p-button-lg"
                                severity="success"
                            />
                        </div>
                    </Card>
                </div>

                {/* Demo Preview */}
                <div className="col-12 lg:col-8">
                    <Card title={<><i className="pi pi-mobile mr-2"></i>Demo Preview</>} className="interactive-card h-full">
                        <div className="demo-preview">
                            <div className="whatsapp-message">
                                <div className="message-bubble">
                                    <p className="message-text">
                                        Before we begin, kindly select your preferred language.
                                    </p>
                                    <div className="button-group">
                                        <button className="wa-button">English</button>
                                        <button className="wa-button">عربي</button>
                                    </div>
                                    <div className="message-time">2:27 am</div>
                                </div>
                            </div>

                            <div className="whatsapp-message mt-3">
                                <div className="message-bubble">
                                    <p className="message-text">
                                        How can we help you today?
                                    </p>
                                    <div className="button-group">
                                        <button className="wa-button"><i className="pi pi-wrench mr-1"></i> Technical Support</button>
                                        <button className="wa-button"><i className="pi pi-dollar mr-1"></i> Sales</button>
                                        <button className="wa-button"><i className="pi pi-info-circle mr-1"></i> Information</button>
                                    </div>
                                    <div className="message-time">2:27 am</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="col-12">
                    <Card title="⚡ Quick Actions" className="interactive-card">
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-3">
                                <Button
                                    label="Language Selection"
                                    icon="pi pi-globe"
                                    onClick={handleSendLanguageSelection}
                                    loading={loading}
                                    className="w-full"
                                    outlined
                                />
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <Button
                                    label="Product Catalog"
                                    icon="pi pi-shopping-cart"
                                    onClick={handleSendProducts}
                                    loading={loading}
                                    className="w-full"
                                    outlined
                                />
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <Button
                                    label="Service Menu"
                                    icon="pi pi-list"
                                    onClick={handleSendServices}
                                    loading={loading}
                                    className="w-full"
                                    outlined
                                />
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <Button
                                    label="View Conversations"
                                    icon="pi pi-comments"
                                    onClick={() => window.open('/api/interactive/conversations', '_blank')}
                                    className="w-full"
                                    severity="secondary"
                                    outlined
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Features */}
                <div className="col-12">
                    <Card title="✨ Features" className="interactive-card">
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="feature-box">
                                    <i className="pi pi-check-circle text-4xl text-green-600 mb-3"></i>
                                    <h3 className="text-lg font-semibold mb-2">Language Selection</h3>
                                    <p className="text-500 text-sm">
                                        Let users choose their preferred language (English/Arabic)
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="feature-box">
                                    <i className="pi pi-shopping-bag text-4xl text-blue-600 mb-3"></i>
                                    <h3 className="text-lg font-semibold mb-2">Product Catalog</h3>
                                    <p className="text-500 text-sm">
                                        Display products in interactive lists with categories
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="feature-box">
                                    <i className="pi pi-cog text-4xl text-purple-600 mb-3"></i>
                                    <h3 className="text-lg font-semibold mb-2">Service Menu</h3>
                                    <p className="text-500 text-sm">
                                        Quick access to support, sales, and information
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="feature-box">
                                    <i className="pi pi-check-square text-4xl text-cyan-600 mb-3"></i>
                                    <h3 className="text-lg font-semibold mb-2">Confirmations</h3>
                                    <p className="text-500 text-sm">
                                        Yes/No buttons for order confirmations
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function InteractivePageWrapper() {
    return (
        <ProtectedPage featureName="Interactive Messages">
            <InteractivePage />
        </ProtectedPage>
    );
}
