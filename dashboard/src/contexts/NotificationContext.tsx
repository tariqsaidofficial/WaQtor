'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNotificationWebSocket } from '../hooks/useNotificationWebSocket';

export interface Notification {
    id: string;
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    icon?: string;
    link?: string;
    read: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: (filter?: 'all' | 'unread') => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    refreshCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // WebSocket connection for real-time updates
    useNotificationWebSocket({
        onNewNotification: (notification) => {
            // Add new notification to the list
            setNotifications(prev => [notification, ...prev]);
            // Refresh count
            refreshCount();
        },
        onCountUpdate: (count) => {
            // Update unread count from WebSocket
            setUnreadCount(count.unread);
        },
    });

    // Fetch notifications
    const fetchNotifications = async (filter: 'all' | 'unread' = 'all') => {
        setLoading(true);
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            
            const response = await fetch(`${apiUrl}/api/notifications?filter=${filter}&limit=50`, {
                headers: {
                    'X-API-Key': apiKey || '',
                },
            });
            const result = await response.json();
            
            if (result.success) {
                setNotifications(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh unread count
    const refreshCount = async () => {
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            
            const response = await fetch(`${apiUrl}/api/notifications/count`, {
                headers: {
                    'X-API-Key': apiKey || '',
                },
            });
            const result = await response.json();
            
            if (result.success) {
                setUnreadCount(result.data.unread);
            }
        } catch (error) {
            console.error('Failed to fetch notification count:', error);
        }
    };

    // Mark as read
    const markAsRead = async (id: string) => {
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            
            const response = await fetch(`${apiUrl}/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey || '',
                },
                body: JSON.stringify({ read: true }),
            });

            const result = await response.json();
            
            if (result.success) {
                setNotifications(prev =>
                    prev.map(n => (n.id === id ? { ...n, read: true } : n))
                );
                await refreshCount();
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            
            const response = await fetch(`${apiUrl}/api/notifications`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey || '',
                },
                body: JSON.stringify({ action: 'mark-all-read' }),
            });

            const result = await response.json();
            
            if (result.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    // Delete notification
    const deleteNotification = async (id: string) => {
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            
            const response = await fetch(`${apiUrl}/api/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-API-Key': apiKey || '',
                },
            });

            const result = await response.json();
            
            if (result.success) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                await refreshCount();
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
        refreshCount();

        // Poll every 30 seconds
        const interval = setInterval(() => {
            refreshCount();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const value: NotificationContextType = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshCount,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
