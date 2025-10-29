'use client';
import React from 'react';
import { LayoutProvider } from '../components/layout/context/layoutcontext';
import { SessionProvider } from '../contexts/SessionContext';
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../components/ui/layout/layout.scss';
import '../components/ui/demo/Demos.scss';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <link id='theme-css' href={'/themes/lara-light-teal/theme.css'} rel='stylesheet'></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <SessionProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                    </SessionProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
