'use client';

import React, { useState, useEffect } from 'react';
import { BlockUI } from 'primereact/blockui';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import OtpDialog from './OtpDialog';
import axios from 'axios';

interface ProtectedPageProps {
    children: React.ReactNode;
    featureName: string;
    requireSubscription?: boolean;
}

export default function ProtectedPage({ 
    children, 
    featureName,
    requireSubscription = true
}: ProtectedPageProps) {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');

    useEffect(() => {
        setIsClient(true);
        checkFeatureAccess();
    }, [featureName]);

    const checkFeatureAccess = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setIsSubscribed(false);
                setIsLoading(false);
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/subscriptions/check/${encodeURIComponent(featureName)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success && response.data.hasAccess) {
                setIsSubscribed(true);
                setSubscriptionStatus(response.data.status);
            } else {
                setIsSubscribed(false);
                setSubscriptionStatus(response.data.status || 'no_subscription');
            }
        } catch (error) {
            console.error('Error checking feature access:', error);
            setIsSubscribed(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlock = () => {
        setShowOtpDialog(true);
    };

    const handleVerify = async (code: string): Promise<boolean> => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('Please login first');
            }

            const response = await axios.post(
                'http://localhost:8080/api/subscriptions/verify-code',
                {
                    code,
                    featureName
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setIsSubscribed(true);
                setShowOtpDialog(false);
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            console.error('Error verifying code:', error);
            throw new Error(error.response?.data?.error || 'Failed to verify code');
        }
    };

    if (!isClient) {
        return null;
    }

    // Show loading spinner while checking access
    if (isLoading) {
        return (
            <div className="flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                <ProgressSpinner />
            </div>
        );
    }

    const getStatusMessage = () => {
        switch (subscriptionStatus) {
            case 'trial':
                return 'You are currently on a trial period.';
            case 'expired':
                return 'Your subscription has expired. Renew to continue using this feature.';
            case 'trial_expired':
                return 'Your trial period has ended. Subscribe to continue.';
            case 'limit_reached':
                return 'You have reached your usage limit. Upgrade to continue.';
            default:
                return 'This feature is available for premium users. Subscribe to unlock or enter your access code.';
        }
    };

    const blockTemplate = (
        <div className="flex flex-column align-items-center justify-content-center p-5" style={{ minHeight: '400px' }}>
            <i className="pi pi-lock" style={{ fontSize: '4rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
            <h2 className="text-center mb-3" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Premium Feature</h2>
            <p className="text-center mb-4" style={{ maxWidth: '500px', color: 'var(--text-color-secondary)' }}>
                {getStatusMessage()}
            </p>
            <div className="flex gap-2">
                <Button 
                    label="Subscribe Now" 
                    icon="pi pi-star"
                    onClick={() => window.open('https://waqtor.dxbmark.com/#pricing', '_blank')}
                />
                <Button 
                    label="Enter Access Code" 
                    icon="pi pi-key"
                    severity="secondary"
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
