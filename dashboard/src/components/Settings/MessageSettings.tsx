/**
 * Message Settings Component
 * Configure default message variables like signature
 */

'use client';

import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';

interface MessageSettingsProps {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export default function MessageSettings({ onSuccess, onError }: MessageSettingsProps) {
    const [signature, setSignature] = useState('WaQtor Team');
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Load signature from localStorage
        const savedSignature = localStorage.getItem('message_signature');
        if (savedSignature) {
            setSignature(savedSignature);
        }
    }, []);

    const handleSave = () => {
        setLoading(true);
        
        try {
            // Save to localStorage
            localStorage.setItem('message_signature', signature);
            
            // Dispatch event for other components to update
            window.dispatchEvent(new CustomEvent('signature-updated', { 
                detail: { signature } 
            }));
            
            setHasChanges(false);
            
            if (onSuccess) {
                onSuccess('Signature saved successfully');
            }
        } catch (error) {
            console.error('Error saving signature:', error);
            if (onError) {
                onError('Failed to save signature');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSignature('WaQtor Team');
        setHasChanges(true);
    };

    const handleChange = (value: string) => {
        setSignature(value);
        setHasChanges(true);
    };

    return (
        <div className="message-settings">
            <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">
                    <i className="pi pi-pencil mr-2"></i>
                    Message Variables
                </h3>
                <p className="text-600 text-sm">
                    Configure default values for message variables that will be used across all messages
                </p>
            </div>

            <Divider />

            {/* Signature Setting */}
            <div className="mb-4">
                <label htmlFor="signature" className="block mb-2 font-semibold">
                    <i className="pi pi-tag mr-2"></i>
                    Default Signature
                </label>
                <small className="text-600 block mb-3">
                    This value will be used when you include <code className="bg-primary-50 text-primary px-2 py-1 border-round">{'{signature}'}</code> in your messages
                </small>
                
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-tag"></i>
                    </span>
                    <InputText
                        id="signature"
                        value={signature}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="Enter your signature (e.g., Your Company Name)"
                        className="w-full"
                    />
                    <Button
                        icon="pi pi-refresh"
                        className="p-button-outlined"
                        onClick={handleReset}
                        tooltip="Reset to default"
                        tooltipOptions={{ position: 'top' }}
                    />
                </div>
            </div>

            {/* Preview */}
            <div className="mb-4">
                <label className="block mb-2 font-semibold">
                    <i className="pi pi-eye mr-2"></i>
                    Preview
                </label>
                <div className="p-3 surface-50 border-round">
                    <p className="text-700 mb-2">
                        Example message with signature:
                    </p>
                    <div className="p-3 surface-0 border-1 surface-border border-round">
                        <p className="m-0 text-900">
                            Thank you for contacting us!<br />
                            <br />
                            Best regards,<br />
                            <strong className="text-primary">{signature}</strong>
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Message */}
            <Message 
                severity="info" 
                text="The signature will be automatically replaced in all messages containing {signature}" 
                className="mb-4"
            />

            {/* Available Variables Info */}
            <div className="mb-4">
                <label className="block mb-2 font-semibold">
                    <i className="pi pi-info-circle mr-2"></i>
                    Available Message Variables
                </label>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="p-3 surface-50 border-round mb-2">
                            <strong className="text-primary">{'{signature}'}</strong>
                            <p className="text-600 text-sm m-0 mt-1">Your custom signature</p>
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="p-3 surface-50 border-round mb-2">
                            <strong className="text-primary">{'{year}'}</strong>
                            <p className="text-600 text-sm m-0 mt-1">Current year (e.g., 2025)</p>
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="p-3 surface-50 border-round mb-2">
                            <strong className="text-primary">{'{date}'}</strong>
                            <p className="text-600 text-sm m-0 mt-1">Current date (e.g., 31/10/2025)</p>
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="p-3 surface-50 border-round mb-2">
                            <strong className="text-primary">{'{time}'}</strong>
                            <p className="text-600 text-sm m-0 mt-1">Current time (e.g., 05:53 PM)</p>
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="p-3 surface-50 border-round mb-2">
                            <strong className="text-primary">{'{name}'}</strong>
                            <p className="text-600 text-sm m-0 mt-1">Recipient name</p>
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="p-3 surface-50 border-round mb-2">
                            <strong className="text-primary">{'{phone}'}</strong>
                            <p className="text-600 text-sm m-0 mt-1">Recipient phone number</p>
                        </div>
                    </div>
                </div>
            </div>

            <Divider />

            {/* Action Buttons */}
            <div className="flex gap-2 justify-content-end">
                <Button
                    label="Save Changes"
                    icon="pi pi-check"
                    onClick={handleSave}
                    loading={loading}
                    disabled={!hasChanges}
                    className="p-button-success"
                />
            </div>
        </div>
    );
}
