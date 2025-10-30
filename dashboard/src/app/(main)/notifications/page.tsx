'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { useNotifications } from '../../../contexts/NotificationContext';
import NotificationItem from '../../../components/Notifications/NotificationItem';

export default function NotificationsPage() {
    const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const unreadNotifications = notifications.filter(n => !n.read);
    const displayNotifications = activeIndex === 0 ? notifications : unreadNotifications;

    return (
        <div className='grid'>
            <div className='col-12'>
                <Card>
                    <div className='flex align-items-center justify-content-between mb-4'>
                        <div>
                            <h2 className='text-3xl font-bold text-900 m-0 mb-2'>Notifications</h2>
                            <p className='text-600 m-0'>Stay updated with your latest activities</p>
                        </div>
                        {unreadNotifications.length > 0 && (
                            <Button
                                label={`Mark all as read (${unreadNotifications.length})`}
                                icon='pi pi-check'
                                onClick={markAllAsRead}
                                outlined
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
                    <div className='mt-3'>
                        {loading ? (
                            <div className='flex align-items-center justify-content-center p-8'>
                                <i className='pi pi-spin pi-spinner text-6xl' style={{ color: 'var(--primary-color)' }}></i>
                            </div>
                        ) : displayNotifications.length === 0 ? (
                            <div className='flex flex-column align-items-center justify-content-center p-8 text-center'>
                                <i className='pi pi-bell-slash text-9xl text-300 mb-4'></i>
                                <div className='text-900 text-2xl font-semibold mb-2'>No notifications</div>
                                <div className='text-600'>
                                    {activeIndex === 0
                                        ? 'You have no notifications at the moment'
                                        : 'You have no unread notifications'}
                                </div>
                            </div>
                        ) : (
                            <div className='border-1 border-300 border-round'>
                                {displayNotifications.map((notification, index) => (
                                    <div
                                        key={notification.id}
                                        className={index !== displayNotifications.length - 1 ? 'border-bottom-1 border-300' : ''}
                                    >
                                        <NotificationItem
                                            notification={notification}
                                            onMarkAsRead={markAsRead}
                                            onDelete={deleteNotification}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
