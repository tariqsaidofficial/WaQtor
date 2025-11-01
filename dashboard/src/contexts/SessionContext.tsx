/**
 * Session Context
 * Unified session state management for the entire application
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

export type SessionStatus = 
    | 'disconnected' 
    | 'connecting' 
    | 'qr' 
    | 'authenticated' 
    | 'connected' 
    | 'ready' 
    | 'error';

interface SessionState {
    status: SessionStatus;
    qrCode: string | null;
    isReady: boolean;
    phoneNumber: string | null;
    lastUpdate: Date | null;
    error: string | null;
}

interface SessionContextType extends SessionState {
    refreshSession: () => Promise<void>;
    isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<SessionState>({
        status: 'disconnected',
        qrCode: null,
        isReady: false,
        phoneNumber: null,
        lastUpdate: null,
        error: null
    });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch session state from API
    const fetchSessionState = useCallback(async () => {
        try {
            const response = await apiClient.get('/api/session/state');
            
            if (response.data?.success && response.data?.data) {
                const sessionData = response.data.data;
                
                const status = sessionData.status || 'disconnected';
                const isReady = status === 'ready' || 
                               status === 'authenticated' || 
                               status === 'connected' ||
                               sessionData.ready === true;
                
                console.log('🔄 [SessionContext] API Response:', {
                    status,
                    isReady,
                    sessionDataReady: sessionData.ready,
                    sessionDataStatus: sessionData.status
                });
                
                setState({
                    status,
                    qrCode: sessionData.qr || null,
                    isReady,
                    phoneNumber: sessionData.phoneNumber || null,
                    lastUpdate: new Date(),
                    error: null
                });
            }
        } catch (error: any) {
            console.error('Failed to fetch session state:', error);
            setState(prev => ({
                ...prev,
                status: 'error',
                error: error.message || 'Failed to fetch session state',
                lastUpdate: new Date()
            }));
        }
    }, []);

    // Fetch QR code if needed
    const fetchQRCode = useCallback(async () => {
        try {
            const response = await apiClient.get('/api/session/qr');
            
            if (response.data?.success && response.data?.data?.hasQR) {
                setState(prev => ({
                    ...prev,
                    qrCode: response.data.data.qr,
                    status: 'qr',
                    lastUpdate: new Date()
                }));
            }
        } catch (error) {
            console.error('Failed to fetch QR code:', error);
        }
    }, []);

    // Refresh session (manual)
    const refreshSession = useCallback(async () => {
        setIsLoading(true);
        try {
            await fetchSessionState();
            
            // If status is qr or connecting, fetch QR code
            if (state.status === 'qr' || state.status === 'connecting') {
                await fetchQRCode();
            }
        } finally {
            setIsLoading(false);
        }
    }, [fetchSessionState, fetchQRCode, state.status]);

    // WebSocket connection for real-time updates
    useEffect(() => {
        let ws: WebSocket | null = null;
        let reconnectTimeout: NodeJS.Timeout;

        const connectWebSocket = () => {
            try {
                const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
                const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
                
                ws = new WebSocket(`${wsUrl}/ws?apiKey=${apiKey}`);

                ws.onopen = () => {
                    console.log('✅ Session WebSocket connected');
                    // Subscribe to session updates
                    ws?.send(JSON.stringify({
                        type: 'subscribe',
                        events: ['session_update', 'qr_code']
                    }));
                };

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        
                        // Handle session updates
                        if (data.type === 'session_update' && data.data) {
                            setState(prev => {
                                const status = data.data.status || prev.status;
                                const isReady = status === 'ready' || 
                                               status === 'authenticated' || 
                                               status === 'connected' ||
                                               data.data.ready === true;
                                
                                return {
                                    ...prev,
                                    status,
                                    isReady,
                                    phoneNumber: data.data.phoneNumber || prev.phoneNumber,
                                    lastUpdate: new Date()
                                };
                            });
                        }
                        
                        // Handle QR code updates
                        if (data.type === 'qr_code' && data.data?.qr) {
                            setState(prev => ({
                                ...prev,
                                qrCode: data.data.qr,
                                status: 'qr',
                                lastUpdate: new Date()
                            }));
                        }
                    } catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                };

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                ws.onclose = () => {
                    console.log('❌ Session WebSocket disconnected, reconnecting...');
                    // Reconnect after 3 seconds
                    reconnectTimeout = setTimeout(connectWebSocket, 3000);
                };
            } catch (error) {
                console.error('Failed to connect WebSocket:', error);
                reconnectTimeout = setTimeout(connectWebSocket, 3000);
            }
        };

        // Only fetch if user is logged in (has token)
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (token) {
            // Initial fetch
            fetchSessionState();
            
            // Connect WebSocket
            connectWebSocket();

            // Poll every 60 seconds as backup (reduced frequency)
            const pollInterval = setInterval(fetchSessionState, 60000);
            
            return () => {
                if (ws) {
                    ws.close();
                }
                clearTimeout(reconnectTimeout);
                clearInterval(pollInterval);
            };
        }

        // Cleanup for non-authenticated users
        return () => {
            if (ws) {
                ws.close();
            }
            clearTimeout(reconnectTimeout);
        };
    }, [fetchSessionState]);

    return (
        <SessionContext.Provider
            value={{
                ...state,
                refreshSession,
                isLoading
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

// Hook to use session context
export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
