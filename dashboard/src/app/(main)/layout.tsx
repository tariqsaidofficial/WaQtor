'use client';
import React from 'react';
import Layout from '../../components/layout/layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <ProtectedRoute>
            <Layout>{children}</Layout>
        </ProtectedRoute>
    );
}
