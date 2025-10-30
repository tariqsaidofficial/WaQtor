'use client';

import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputOtp } from 'primereact/inputotp';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

interface OtpDialogProps {
    visible: boolean;
    onHide: () => void;
    onVerify: (code: string) => boolean;
    featureName: string;
}

export default function OtpDialog({ visible, onHide, onVerify, featureName }: OtpDialogProps) {
    const [otp, setOtp] = useState<any>('');
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
                    <InputOtp
                        value={otp}
                        onChange={(e) => setOtp(e.value)}
                        length={4}
                        mask
                        integerOnly
                    />
                </div>

                <div className="text-center">
                    <small className="text-500">
                        Don't have an access code? <a href="https://waqtor.com/pricing" target="_blank" rel="noopener noreferrer" className="text-primary">Get one here</a>
                    </small>
                </div>
            </div>
        </Dialog>
    );
}
