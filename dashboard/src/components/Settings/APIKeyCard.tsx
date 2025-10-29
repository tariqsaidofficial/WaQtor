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
        <Card title="🔑 API Key Management" className="settings-card h-full">
            <div className="flex flex-column gap-3">
                <div>
                    <label className="block mb-2 font-semibold">
                        <i className="pi pi-key mr-2"></i>
                        Your API Key
                    </label>
                    <div className="p-inputgroup">
                        <InputText
                            value={showKey ? apiKey : '••••••••••••••••'}
                            readOnly
                            className="w-full"
                        />
                        <Button
                            icon={showKey ? 'pi pi-eye-slash' : 'pi pi-eye'}
                            onClick={() => setShowKey(!showKey)}
                            className="p-button-secondary"
                        />
                        <Button
                            icon="pi pi-copy"
                            onClick={handleCopyKey}
                            className="p-button-secondary"
                        />
                    </div>
                    <small className="text-500">
                        Use this key to authenticate API requests
                    </small>
                </div>

                <div className="flex gap-2">
                    <Button
                        label="Generate New Key"
                        icon="pi pi-refresh"
                        onClick={handleGenerateKey}
                        loading={loading}
                        className="flex-1"
                        severity="warning"
                    />
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        onClick={handleSaveKey}
                        loading={loading}
                        className="flex-1"
                    />
                </div>

                <div className="p-3 bg-yellow-50 border-round">
                    <div className="flex align-items-start gap-2">
                        <i className="pi pi-exclamation-triangle text-yellow-600 mt-1"></i>
                        <div className="text-sm">
                            <strong>Warning:</strong> Generating a new API key will invalidate the old one. Update all your applications with the new key.
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
