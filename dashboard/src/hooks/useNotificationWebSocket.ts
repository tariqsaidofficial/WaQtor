import { useEffect, useRef } from 'react';

interface NotificationWebSocketProps {
    onNewNotification?: (notification: any) => void;
    onCountUpdate?: (count: { unread: number; total: number }) => void;
}

export const useNotificationWebSocket = ({
    onNewNotification,
    onCountUpdate,
}: NotificationWebSocketProps) => {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    const connect = () => {
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
            
            if (!apiKey) {
                console.warn('No API key found for WebSocket connection');
                return;
            }

            const ws = new WebSocket(`${wsUrl}/ws?apiKey=${apiKey}`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('✅ WebSocket connected for notifications');
                reconnectAttempts.current = 0;

                // Subscribe to notification events
                ws.send(JSON.stringify({
                    type: 'subscribe',
                    events: ['notification:new', 'notification:count']
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    
                    switch (message.type) {
                        case 'notification:new':
                            if (onNewNotification && message.data) {
                                onNewNotification(message.data);
                            }
                            break;
                        
                        case 'notification:count':
                            if (onCountUpdate && message.data) {
                                onCountUpdate({
                                    unread: message.data.unread,
                                    total: message.data.total
                                });
                            }
                            break;
                        
                        default:
                            // Ignore other message types
                            break;
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                wsRef.current = null;

                // Attempt to reconnect
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
                    console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttempts.current})`);
                    
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, delay);
                } else {
                    console.warn('Max reconnection attempts reached. Falling back to polling.');
                }
            };
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }
    };

    const disconnect = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    };

    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, []);

    return {
        isConnected: wsRef.current?.readyState === WebSocket.OPEN,
        reconnect: connect,
        disconnect,
    };
};
