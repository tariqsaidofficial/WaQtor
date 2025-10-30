'use client';

import React, { useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import Link from 'next/link';

interface NotificationDropdownProps {
    panelRef: React.RefObject<OverlayPanel>;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ panelRef }) => {
    const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [activeIndex, setActiveIndex] = useState(0);

    const unreadNotifications = notifications.filter(n => !n.read);
    const displayNotifications = activeIndex === 0 ? notifications : unreadNotifications;

    return (
        <OverlayPanel ref={panelRef} style={{ width: '400px', maxHeight: '600px' }}>
            <div className='flex flex-column' style={{ height: '100%' }}>
                {/* Header */}
                <div className='flex align-items-center justify-content-between mb-3 pb-3 border-bottom-1 border-300'>
                    <h3 className='m-0 text-xl font-semibold'>Notifications</h3>
                    {unreadNotifications.length > 0 && (
                        <Button
                            label='Mark all as read'
                            text
                            size='small'
                            onClick={markAllAsRead}
                            style={{ color: 'var(--primary-color)' }}
                        />
                    )}
                </div>

                {/* Tabs */}
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header={`All (${notifications.length})`}>
                        {/* Content will be rendered below */}
                    </TabPanel>
                    <TabPanel header={`Unread (${unreadNotifications.length})`}>
                        {/* Content will be rendered below */}
                    </TabPanel>
                </TabView>

                {/* Notifications List */}
                <div className='flex-1 overflow-y-auto' style={{ maxHeight: '400px' }}>
                    {loading ? (
                        <div className='flex align-items-center justify-content-center p-5'>
                            <i className='pi pi-spin pi-spinner text-4xl' style={{ color: 'var(--primary-color)' }}></i>
                        </div>
                    ) : displayNotifications.length === 0 ? (
                        <div className='flex flex-column align-items-center justify-content-center p-5 text-center'>
                            <i className='pi pi-bell-slash text-6xl text-400 mb-3'></i>
                            <div className='text-900 font-semibold mb-2'>No notifications</div>
                            <div className='text-600 text-sm'>
                                {activeIndex === 0
                                    ? 'You have no notifications at the moment'
                                    : 'You have no unread notifications'}
                            </div>
                        </div>
                    ) : (
                        displayNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={markAsRead}
                                onDelete={deleteNotification}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                {displayNotifications.length > 0 && (
                    <div className='pt-3 border-top-1 border-300 text-center'>
                        <Link href='/notifications'>
                            <Button
                                label='View All Notifications'
                                text
                                className='w-full'
                                style={{ color: 'var(--primary-color)' }}
                                onClick={() => panelRef.current?.hide()}
                            />
                        </Link>
                    </div>
                )}
            </div>
        </OverlayPanel>
    );
};

export default NotificationDropdown;
