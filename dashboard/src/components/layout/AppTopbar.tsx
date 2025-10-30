/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Menu } from 'primereact/menu';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRouter } from 'next/navigation';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const router = useRouter();
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const profileMenuRef = useRef<Menu>(null);
    const quickActionPanelRef = useRef<OverlayPanel>(null);
    
    const [logoUrl, setLogoUrl] = useState('');
    const [logoText, setLogoText] = useState('');
    const [showLogoText, setShowLogoText] = useState(true);
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Mark as client-side
        setIsClient(true);
        
        // Load branding settings from localStorage
        const savedLogoUrl = localStorage.getItem('app_logo') || '/layout/images/logo-dark.svg';
        const savedLogoText = localStorage.getItem('app_logo_text') || 'WaQtor';
        const savedShowLogoText = localStorage.getItem('app_show_logo_text');
        const savedUserName = localStorage.getItem('user_name') || 'User';
        const savedUserAvatar = localStorage.getItem('user_avatar') || '';
        const savedNotificationCount = localStorage.getItem('notification_count') || '0';
        
        setLogoUrl(savedLogoUrl);
        setLogoText(savedLogoText);
        setShowLogoText(savedShowLogoText !== 'false');
        setUserName(savedUserName);
        setUserAvatar(savedUserAvatar);
        setNotificationCount(parseInt(savedNotificationCount, 10));

        // Listen for branding updates
        const handleBrandingUpdate = () => {
            const updatedLogoUrl = localStorage.getItem('app_logo') || '/layout/images/logo-dark.svg';
            const updatedLogoText = localStorage.getItem('app_logo_text') || 'WaQtor';
            const updatedShowLogoText = localStorage.getItem('app_show_logo_text');
            const updatedUserName = localStorage.getItem('user_name') || 'User';
            const updatedUserAvatar = localStorage.getItem('user_avatar') || '';
            const updatedNotificationCount = localStorage.getItem('notification_count') || '0';
            
            setLogoUrl(updatedLogoUrl);
            setLogoText(updatedLogoText);
            setShowLogoText(updatedShowLogoText !== 'false');
            setUserName(updatedUserName);
            setUserAvatar(updatedUserAvatar);
            setNotificationCount(parseInt(updatedNotificationCount, 10));
        };

        window.addEventListener('branding-update', handleBrandingUpdate);
        return () => window.removeEventListener('branding-update', handleBrandingUpdate);
    }, []);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    // Get user initials for Avatar label
    const getUserInitials = (name: string) => {
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    // Profile menu items
    const profileMenuItems = [
        {
            template: () => (
                <div className="profile-menu-header" style={{ padding: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {userAvatar ? (
                            <Avatar 
                                image={userAvatar}
                                size="xlarge" 
                                shape="circle"
                            />
                        ) : (
                            <Avatar 
                                label={getUserInitials(userName)}
                                size="xlarge" 
                                shape="circle"
                                style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }}
                            />
                        )}
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{userName}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', cursor: 'pointer' }} onClick={() => router.push('/profile')}>View Profile</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            template: () => (
                <div 
                    onClick={() => {
                        localStorage.clear();
                        router.push('/auth/login');
                    }}
                    style={{
                        padding: '0.75rem 1rem',
                        margin: '0.5rem 0.5rem 0.5rem 0.5rem',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                >
                    <i className="pi pi-sign-out" style={{ fontSize: '1rem' }}></i>
                    <span>Logout</span>
                </div>
            )
        }
    ];

    // Quick Action items (based on the image)
    const quickActionItems = [
        { icon: 'pi pi-user', label: 'Profile', command: () => router.push('/profile') },
        { icon: 'pi pi-users', label: 'Friends', command: () => console.log('Friends') },
        { icon: 'pi pi-sitemap', label: 'Groups', command: () => console.log('Groups') },
        { icon: 'pi pi-code', label: 'Create', command: () => router.push('/messages') },
        { icon: 'pi pi-file', label: 'Blog', command: () => console.log('Blog') },
    ];

    return (
        <div className='layout-topbar'>
            <Link href='/' className='layout-topbar-logo'>
                {isClient && logoUrl && (
                    <img
                        src={logoUrl}
                        width='47.22px'
                        height={'35px'}
                        alt='logo'
                    />
                )}
                {isClient && showLogoText && logoText && <span>{logoText}</span>}
            </Link>

            <button
                ref={menubuttonRef}
                type='button'
                className='p-link layout-menu-button layout-topbar-button'
                onClick={onMenuToggle}
            >
                <i className='pi pi-bars' />
            </button>

            <div className='layout-topbar-menu' style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                {/* Quick Action Button */}
                <button 
                    type='button' 
                    className='p-link layout-topbar-button'
                    title="Quick Actions"
                >
                    <i className='pi pi-th-large'></i>
                </button>

                {/* User Avatar with Badge */}
                <button 
                    type='button' 
                    className='p-link layout-topbar-button'
                    onClick={() => router.push('/profile')}
                    style={{ position: 'relative' }}
                    title="Go to Profile"
                >
                    {isClient && (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            {userAvatar ? (
                                <Avatar 
                                    image={userAvatar}
                                    size="normal" 
                                    shape="circle"
                                    style={{ width: '2.5rem', height: '2.5rem', cursor: 'pointer' }}
                                />
                            ) : (
                                <Avatar 
                                    label={userName ? getUserInitials(userName) : 'U'}
                                    size="normal" 
                                    shape="circle"
                                    style={{ 
                                        backgroundColor: 'var(--primary-color)', 
                                        color: '#ffffff', 
                                        width: '2.5rem', 
                                        height: '2.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                />
                            )}
                            {notificationCount > 0 && (
                                <Badge 
                                    value={notificationCount} 
                                    severity="danger"
                                    style={{
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '-4px',
                                        minWidth: '1.25rem',
                                        height: '1.25rem'
                                    }}
                                />
                            )}
                        </div>
                    )}
                </button>
            </div>

            {/* Profile Menu */}
            <Menu model={profileMenuItems} popup ref={profileMenuRef} />

            {/* Quick Action Panel */}
            <OverlayPanel ref={quickActionPanelRef} style={{ width: '400px' }}>
                <div style={{ padding: '0.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Quick Actions</h3>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '1rem' 
                    }}>
                        {quickActionItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.command}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '1.5rem 1rem',
                                    border: '1px solid var(--surface-border)',
                                    borderRadius: '12px',
                                    backgroundColor: 'var(--surface-card)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    position: 'relative'
                                }}
                                className="quick-action-item"
                            >
                                <i className={item.icon} style={{ fontSize: '1.75rem', color: 'var(--text-color-secondary)' }}></i>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)' }}>{item.label}</span>
                                {item.label === 'Settings' && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>1</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </OverlayPanel>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
