/**
 * Protected Route Component
 * Wraps components that require authentication
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, hasRole, verifyToken } from '@/lib/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireRole?: 'admin' | 'user' | 'viewer';
}

export default function ProtectedRoute({ 
    children, 
    requireAdmin = false,
    requireRole 
}: ProtectedRouteProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // Check if user is authenticated
            if (!isAuthenticated()) {
                router.push('/auth/login');
                return;
            }

            // Verify token with backend
            const isValid = await verifyToken();
            if (!isValid) {
                router.push('/auth/login');
                return;
            }

            // Check role-based access
            if (requireAdmin && !hasRole('admin')) {
                router.push('/auth/access'); // Access denied page
                return;
            }

            if (requireRole && !hasRole(requireRole)) {
                router.push('/auth/access'); // Access denied page
                return;
            }

            setIsAuthorized(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [router, requireAdmin, requireRole]);

    if (isLoading) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-6xl text-primary mb-3"></i>
                    <div className="text-xl text-700">Verifying authentication...</div>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
