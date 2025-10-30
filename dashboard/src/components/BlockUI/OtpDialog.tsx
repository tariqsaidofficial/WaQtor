'use client';

import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

interface OtpDialogProps {
    visible: boolean;
    onHide: () => void;
    onVerify: (code: string) => boolean;
    featureName: string;
}

export default function OtpDialog({ visible, onHide, onVerify, featureName }: OtpDialogProps) {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = () => {
        setLoading(true);
        setError('');

        setTimeout(() => {
            const isValid = onVerify(otp);
            
            if (isValid) {
                setOtp('');
                setError('');
            } else {
                setError('Invalid access code. Please try again.');
            }
            
            setLoading(false);
        }, 500);
    };

    const handleHide = () => {
        setOtp('');
        setError('');
        onHide();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && otp.length === 4) {
            handleVerify();
        }
    };

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                onClick={handleHide}
                severity="secondary"
                outlined
            />
            <Button 
                label="Verify" 
                icon="pi pi-check" 
                onClick={handleVerify}
                loading={loading}
                disabled={!otp || otp.length !== 4}
            />
        </div>
    );

    return (
        <Dialog
            header={`Unlock ${featureName}`}
            visible={visible}
            onHide={handleHide}
            footer={footer}
            style={{ width: '450px' }}
            modal
            draggable={false}
        >
            <div className="flex flex-column gap-3">
                <p className="text-600 mb-2">
                    Enter your 4-digit access code to unlock this feature.
                </p>

                {error && (
                    <Message severity="error" text={error} />
                )}

                <div className="flex justify-content-center">
                    <InputText
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        onKeyPress={handleKeyPress}
                        placeholder="••••"
                        maxLength={4}
                        className="text-center"
                        style={{ 
                            fontSize: '2rem', 
                            letterSpacing: '1rem',
                            width: '200px',
                            fontWeight: 'bold'
                        }}
                        type="password"
                    />
                </div>

                <div className="text-center">
                    <small className="text-500">
                        Don't have an access code? <a href="https://waqtor.dxbmark.com/pricing" target="_blank" rel="noopener noreferrer" className="text-primary">Get one here</a>
                    </small>
                </div>
            </div>
        </Dialog>
    );
}
