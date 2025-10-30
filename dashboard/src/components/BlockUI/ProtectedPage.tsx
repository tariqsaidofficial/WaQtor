'use client';

import React, { useState, useEffect } from 'react';
import { BlockUI } from 'primereact/blockui';
import { Button } from 'primereact/button';
import OtpDialog from './OtpDialog';

interface ProtectedPageProps {
    children: React.ReactNode;
    featureName: string;
    requireSubscription?: boolean;
    accessCode?: string;
}

export default function ProtectedPage({ 
    children, 
    featureName,
    requireSubscription = true,
    accessCode = '1234'
}: ProtectedPageProps) {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
        // Check subscription status from localStorage
        const subscriptionStatus = localStorage.getItem(`subscription_${featureName}`);
        if (subscriptionStatus === 'active') {
            setIsSubscribed(true);
        }
    }, [featureName]);

    const handleUnlock = () => {
        setShowOtpDialog(true);
    };

    const handleVerify = (code: string) => {
        if (code === accessCode) {
            setIsSubscribed(true);
            localStorage.setItem(`subscription_${featureName}`, 'active');
            setShowOtpDialog(false);
        } else {
            return false;
        }
        return true;
    };

    if (!isClient) {
        return null;
    }

    const blockTemplate = (
        <div className="flex flex-column align-items-center justify-content-center p-5" style={{ minHeight: '400px' }}>
            <i className="pi pi-lock" style={{ fontSize: '4rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
            <h2 className="text-center mb-3">Premium Feature</h2>
            <p className="text-center text-600 mb-4" style={{ maxWidth: '500px' }}>
                This feature is available for premium users. Subscribe to unlock or enter your access code.
            </p>
            <div className="flex gap-2">
                <Button 
                    label="Subscribe Now" 
                    icon="pi pi-star"
                    severity="success"
                    onClick={() => window.open('https://waqtor.com/pricing', '_blank')}
                />
                <Button 
                    label="Enter Access Code" 
                    icon="pi pi-key"
                    severity="info"
                    outlined
                    onClick={handleUnlock}
                />
            </div>
        </div>
    );

    return (
        <>
            <BlockUI 
                blocked={!isSubscribed && requireSubscription} 
                template={blockTemplate}
                fullScreen={false}
                className="block-ui-container"
            >
                {children}
            </BlockUI>

            <OtpDialog
                visible={showOtpDialog}
                onHide={() => setShowOtpDialog(false)}
                onVerify={handleVerify}
                featureName={featureName}
            />
        </>
    );
}
