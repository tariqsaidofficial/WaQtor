'use client';

import React from 'react';
import { Notification } from '../../contexts/NotificationContext';
import { useRouter } from 'next/navigation';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onMarkAsRead,
    onDelete,
}) => {
    const router = useRouter();

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'success':
                return '#16a34a';
            case 'error':
                return '#ef4444';
            case 'warning':
                return '#f59e0b';
            case 'info':
            default:
                return '#3b82f6';
        }
    };

    const handleClick = () => {
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
        if (notification.link) {
            router.push(notification.link);
        }
    };

    return (
        <div
            className={`p-3 border-bottom-1 border-300 cursor-pointer transition-colors transition-duration-150 ${
                !notification.read ? 'surface-hover' : ''
            }`}
            style={{
                backgroundColor: !notification.read ? 'var(--surface-50)' : 'transparent',
            }}
            onClick={handleClick}
        >
            <div className='flex align-items-start gap-3'>
                {/* Icon */}
                <div
                    className='flex align-items-center justify-content-center border-circle flex-shrink-0'
                    style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: `${getIconColor(notification.type)}20`,
                    }}
                >
                    <i
                        className={`pi ${notification.icon || 'pi-bell'}`}
                        style={{ color: getIconColor(notification.type), fontSize: '1.25rem' }}
                    ></i>
                </div>

                {/* Content */}
                <div className='flex-1'>
                    <div className='flex align-items-start justify-content-between mb-1'>
                        <div className='font-semibold text-900'>{notification.title}</div>
                        {!notification.read && (
                            <div
                                className='border-circle'
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: 'var(--primary-color)',
                                }}
                            ></div>
                        )}
                    </div>
                    <div className='text-600 text-sm mb-2'>{notification.message}</div>
                    <div className='flex align-items-center justify-content-between'>
                        <div className='text-500 text-xs'>{getTimeAgo(notification.createdAt)}</div>
                        <div className='flex gap-2'>
                            {!notification.read && (
                                <button
                                    className='p-link text-xs'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAsRead(notification.id);
                                    }}
                                    style={{ color: 'var(--primary-color)' }}
                                >
                                    Mark as read
                                </button>
                            )}
                            <button
                                className='p-link text-xs text-500'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(notification.id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
