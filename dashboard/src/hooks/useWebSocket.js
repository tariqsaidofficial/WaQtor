/**
 * WebSocket Hook
 * Real-time connection to Waqtor backend
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * Get the appropriate WebSocket URL based on environment
 */
const getWebSocketUrl = () => {
    console.log('🔍 DEBUG: Getting WebSocket URL...');
    console.log('🔍 DEBUG: Window object:', typeof window !== 'undefined');
    console.log('🔍 DEBUG: NEXT_PUBLIC_BROWSER_WS_URL:', process.env.NEXT_PUBLIC_BROWSER_WS_URL);
    console.log('🔍 DEBUG: NEXT_PUBLIC_WS_URL:', process.env.NEXT_PUBLIC_WS_URL);

    // Check if running in browser
    if (typeof window !== 'undefined') {
        // For browser access, use localhost with /ws path
        const baseUrl =
            process.env.NEXT_PUBLIC_BROWSER_WS_URL || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
        const url = baseUrl + '/ws';
        console.log('🔍 DEBUG: Browser WebSocket URL:', url);
        return url;
    }
    // Fallback (should not be used as WebSocket is client-side only)
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
    const url = baseUrl + '/ws';
    console.log('🔍 DEBUG: Fallback WebSocket URL:', url);
    return url;
};

export function useWebSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const { qr, status, sessionState, setQr, setStatus, setSessionState } = useAppStore();

    const connect = useCallback(() => {
        try {
            const wsUrl = getWebSocketUrl();
            const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
            const fullUrl = apiKey ? `${wsUrl}?apiKey=${apiKey}` : wsUrl;

            console.log('🔍 DEBUG: Connecting to WebSocket...');
            console.log('🔍 DEBUG: Base URL:', wsUrl);
            console.log('🔍 DEBUG: API Key:', apiKey);
            console.log('🔍 DEBUG: Full URL:', fullUrl);

            const ws = new WebSocket(fullUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('✅ WebSocket connected');
                setIsConnected(true);
                setError(null);

                // Request initial state
                ws.send(JSON.stringify({ type: 'get_state' }));
                ws.send(JSON.stringify({ type: 'get_qr' }));

                // Subscribe to all events
                ws.send(
                    JSON.stringify({
                        type: 'subscribe',
                        events: ['all'],
                    })
                );
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Store reference to WebSocket for global access
                    if (typeof window !== 'undefined') {
                        window.waqtorWebSocket = ws;
                    }

                    switch (data.type) {
                    case 'pong':
                        console.log('🏓 Pong received');
                        break;

                    case 'qr_max_retries':
                        console.log('🔄 QR max retries reached:', data.message);
                        setQr(null);
                        // يمكن إضافة state خاص بانتهاء المحاولات
                        break;

                    case 'session_authenticated':
                        console.log('✅ Session authenticated:', data.message);
                        setQr(null);
                        setStatus('authenticated');
                        break;

                    case 'client_ready':
                        console.log('🚀 Client ready:', data.message);
                        setStatus('ready');
                        break;

                    case 'client_disconnected':
                        console.log('⚠️ Client disconnected:', data.message);
                        setStatus('disconnected');
                        break;

                    case 'auth_failure':
                        console.log('❌ Authentication failed:', data.message);
                        setStatus('auth_failure');
                        setQr(null);
                        break;

                    case 'message_ack':
                        console.log('\n🟣 ========== WEBSOCKET MESSAGE ACK ==========');
                        console.log('📨 Message ACK received from backend:', data.data);
                        console.log('📨 ACK Details:', {
                            messageId: data.data?.messageId,
                            status: data.data?.status,
                            ackCode: data.data?.ackCode,
                            to: data.data?.to,
                            from: data.data?.from
                        });
                        
                        // Emit custom event for message status update
                        if (typeof window !== 'undefined') {
                            console.log('📡 Dispatching waqtor:message_ack event to window');
                            window.dispatchEvent(new CustomEvent('waqtor:message_ack', { 
                                detail: data.data 
                            }));
                            console.log('✅ Event dispatched successfully');
                        } else {
                            console.log('❌ Window object not available!');
                        }
                        console.log('🟣 ========== WEBSOCKET MESSAGE ACK END ==========\n');
                        break;

                    case 'message_sent':
                        console.log('\n🟤 ========== WEBSOCKET MESSAGE SENT ==========');
                        console.log('📤 Message sent from backend:', data.data);
                        
                        // Emit custom event for message sent
                        if (typeof window !== 'undefined') {
                            console.log('📡 Dispatching waqtor:message_sent event to window');
                            window.dispatchEvent(new CustomEvent('waqtor:message_sent', { 
                                detail: data.data 
                            }));
                            console.log('✅ Event dispatched successfully');
                        }
                        console.log('🟤 ========== WEBSOCKET MESSAGE SENT END ==========\n');
                        break;

                    case 'status':
                        console.log('📊 Status update:', data.data);
                        setStatus(data.data);
                        break;

                    case 'session_state':
                        console.log('🔍 Session state:', data.data);
                        if (data.data) {
                            // Map backend data to frontend format
                            const mappedState = {
                                status: data.data.status,
                                ready: data.data.ready,
                                authenticated: data.data.authenticated,
                                messagesSent: data.data.stats?.messagesSent || 0,
                                messagesDelivered: data.data.stats?.messagesDelivered || 0,
                                messagesFailed: data.data.stats?.messagesFailed || 0,
                                messagesReceived: data.data.stats?.messagesReceived || 0,
                                uptime: data.data.uptime || 0,
                                lastUpdate: data.data.lastUpdate || new Date().toISOString(),
                                // Client info
                                clientInfo: data.data.info ? {
                                    phoneNumber: data.data.info.phoneMasked || data.data.info.phone || 'N/A',
                                    pushname: data.data.info.pushname || 'N/A',
                                    platform: data.data.info.platform || 'WhatsApp'
                                } : null
                            };
                            setSessionState(mappedState);
                            setStatus(data.data.status);
                        }
                        break;

                    case 'session_update':
                        console.log('📱 Session update:', data.data);
                        if (data.data) {
                            // Map backend data to frontend format
                            const mappedState = {
                                status: data.data.status,
                                ready: data.data.ready,
                                authenticated: data.data.authenticated,
                                messagesSent: data.data.stats?.messagesSent || 0,
                                messagesDelivered: data.data.stats?.messagesDelivered || 0,
                                messagesFailed: data.data.stats?.messagesFailed || 0,
                                messagesReceived: data.data.stats?.messagesReceived || 0,
                                uptime: data.data.uptime || 0,
                                lastUpdate: data.data.lastUpdate || new Date().toISOString(),
                                // Client info
                                clientInfo: data.data.info ? {
                                    phoneNumber: data.data.info.phoneMasked || data.data.info.phone || 'N/A',
                                    pushname: data.data.info.pushname || 'N/A',
                                    platform: data.data.info.platform || 'WhatsApp'
                                } : null
                            };
                            setSessionState(mappedState);
                            setStatus(data.data.status);
                        }
                        break;

                    case 'qr_code':
                    case 'qr':
                        console.log('🔲 QR code received');
                        if (data.data?.qr) {
                            setQr(data.data.qr);
                        } else if (typeof data.data === 'string') {
                            setQr(data.data);
                        }
                        break;

                    case 'state':
                        console.log('📊 State received:', data.data);
                        setSessionState(data.data);
                        setStatus(data.data.status);
                        break;

                    case 'message':
                        console.log('💬 Message event:', data.data);
                        // Handle message events (can be used for notifications)
                        break;

                    case 'campaign':
                        console.log('📢 Campaign event:', data.data);
                        // Handle campaign events
                        break;

                    case 'subscribed':
                        console.log('✅ Subscribed to events:', data.events);
                        break;

                    case 'error':
                        console.error('❌ WebSocket error:', data.message);
                        setError(data.message);
                        break;

                    default:
                        console.log('📦 Unknown message type:', data.type);
                    }
                } catch (err) {
                    console.error('❌ Error parsing WebSocket message:', err);
                }
            };

            ws.onerror = (event) => {
                console.error('❌ WebSocket error:', event);
                setError('WebSocket connection error');
                setIsConnected(false);
            };

            ws.onclose = () => {
                console.warn('⚠️ WebSocket disconnected');
                setIsConnected(false);

                // Attempt to reconnect after 2 seconds (faster recovery)
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('🔄 Attempting to reconnect...');
                    connect();
                }, 2000);
            };
        } catch (err) {
            console.error('❌ Failed to create WebSocket connection:', err);
            setError(err.message);
        }
    }, [setQr, setStatus, setSessionState]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    }, []);

    const sendMessage = useCallback((message) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
            return true;
        }
        console.warn('⚠️ WebSocket is not connected');
        return false;
    }, []);

    const ping = useCallback(() => {
        sendMessage({ type: 'ping' });
    }, [sendMessage]);

    useEffect(() => {
        connect();

        // Ping every 30 seconds to keep connection alive
        const pingInterval = setInterval(() => {
            ping();
        }, 30000);

        return () => {
            clearInterval(pingInterval);
            disconnect();
        };
    }, [connect, disconnect, ping]);

    return {
        isConnected,
        error,
        sendMessage,
        ping,
        reconnect: connect,
        qr,
        status,
        sessionState,
    };
}
