'use client';

import React, { useRef } from 'react';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell: React.FC = () => {
    const { unreadCount } = useNotifications();
    const notificationPanelRef = useRef<OverlayPanel>(null);

    return (
        <>
            <button
                type='button'
                className='p-link layout-topbar-button'
                onClick={(e) => notificationPanelRef.current?.toggle(e)}
                title='Notifications'
            >
                <i className='pi pi-bell' style={{ fontSize: '1.5rem' }}></i>
                {unreadCount > 0 && (
                    <Badge
                        value={unreadCount > 99 ? '99+' : unreadCount}
                        severity='danger'
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            minWidth: '1.25rem',
                            height: '1.25rem',
                            fontSize: '0.75rem',
                        }}
                    />
                )}
            </button>

            <NotificationDropdown panelRef={notificationPanelRef} />
        </>
    );
};

export default NotificationBell;
