import { Metadata } from 'next';
import AppConfig from '../../components/layout/AppConfig';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'WaQtor - WhatsApp Marketing Platform',
    description: 'Professional WhatsApp marketing and automation platform with campaigns, smart bot, and analytics.',
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            {children}
            <AppConfig simple />
        </React.Fragment>
    );
}
