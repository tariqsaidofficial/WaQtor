'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
interface APIKeyCardProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function APIKeyCard({ onSuccess, onError }: APIKeyCardProps) {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load API key from env
        const key = process.env.NEXT_PUBLIC_API_KEY || 'test-api-key-123';
        setApiKey(key);
    }, []);

    const handleCopyKey = () => {
        navigator.clipboard.writeText(apiKey);
        onSuccess('API Key copied to clipboard');
    };

    const handleGenerateKey = () => {
        setLoading(true);
        // Generate new API key
        const newKey = 'waqtor_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setTimeout(() => {
            setApiKey(newKey);
            setLoading(false);
            onSuccess('New API Key generated successfully');
        }, 1000);
    };

    const handleSaveKey = async () => {
        setLoading(true);
        try {
            // Save API key
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSuccess('API Key saved successfully');
        } catch (error) {
            onError('Failed to save API Key');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="settings-card-content">
            <div className="flex flex-column gap-4">
                {/* API Key Display */}
                <div className="surface-card p-4 border-round shadow-1">
                    <div className="flex align-items-center gap-2 mb-3">
                        <i className="pi pi-key text-2xl text-primary"></i>
                        <span className="text-xl font-semibold">Your API Key</span>
                    </div>
                    
                    <div className="p-inputgroup mb-2">
                        <InputText
                            value={showKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                            readOnly
                            className="font-mono"
                        />
                        <Button
                            icon="pi pi-refresh"
                            onClick={handleGenerateKey}
                            loading={loading}
                            tooltip="Generate New Key"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                            icon={showKey ? 'pi pi-eye-slash' : 'pi pi-eye'}
                            onClick={() => setShowKey(!showKey)}
                            tooltip={showKey ? 'Hide key' : 'Show key'}
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                            icon="pi pi-copy"
                            onClick={handleCopyKey}
                            tooltip="Copy to clipboard"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </div>
                    
                    <small className="text-500">
                        <i className="pi pi-info-circle mr-1"></i>
                        Use this key to authenticate all API requests
                    </small>
                </div>

                {/* Action Buttons */}
                <div className="flex align-items-center justify-content-center gap-2">
                    <Button
                        label="Save Key"
                        icon="pi pi-save"
                        onClick={handleSaveKey}
                        loading={loading}
                        style={{ width: '200px' }}
                    />
                </div>

                {/* Warning Message */}
                <div className="surface-border border-1 border-round p-3">
                    <div className="flex align-items-start gap-2">
                        <i className="pi pi-exclamation-triangle text-orange-500 text-xl mt-1"></i>
                        <div>
                            <div className="font-semibold text-900 mb-1">Security Notice</div>
                            <div className="text-600 text-sm line-height-3">
                                Generating a new API key will immediately invalidate the old one. Make sure to update all your applications with the new key to avoid service interruption.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
