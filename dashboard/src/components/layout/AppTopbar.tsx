/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    
    const [logoUrl, setLogoUrl] = useState('/layout/images/logo-dark.svg');
    const [logoText, setLogoText] = useState('SAKAI');
    const [showLogoText, setShowLogoText] = useState(true);

    useEffect(() => {
        // Load branding settings from localStorage
        const savedLogoUrl = localStorage.getItem('app_logo');
        const savedLogoText = localStorage.getItem('app_logo_text');
        const savedShowLogoText = localStorage.getItem('app_show_logo_text');
        
        if (savedLogoUrl) setLogoUrl(savedLogoUrl);
        if (savedLogoText) setLogoText(savedLogoText);
        if (savedShowLogoText !== null) setShowLogoText(savedShowLogoText !== 'false');

        // Listen for branding updates
        const handleBrandingUpdate = () => {
            const updatedLogoUrl = localStorage.getItem('app_logo');
            const updatedLogoText = localStorage.getItem('app_logo_text');
            const updatedShowLogoText = localStorage.getItem('app_show_logo_text');
            
            if (updatedLogoUrl) setLogoUrl(updatedLogoUrl);
            if (updatedLogoText) setLogoText(updatedLogoText);
            if (updatedShowLogoText !== null) setShowLogoText(updatedShowLogoText !== 'false');
        };

        window.addEventListener('branding-updated', handleBrandingUpdate);
        return () => window.removeEventListener('branding-updated', handleBrandingUpdate);
    }, []);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    return (
        <div className='layout-topbar'>
            <Link href='/' className='layout-topbar-logo'>
                <img
                    src={logoUrl}
                    width='47.22px'
                    height={'35px'}
                    alt='logo'
                />
                {showLogoText && <span>{logoText}</span>}
            </Link>

            <button
                ref={menubuttonRef}
                type='button'
                className='p-link layout-menu-button layout-topbar-button'
                onClick={onMenuToggle}
            >
                <i className='pi pi-bars' />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type='button'
                className='p-link layout-topbar-menu-button layout-topbar-button'
                onClick={showProfileSidebar}
            >
                <i className='pi pi-ellipsis-v' />
            </button>

            <div
                ref={topbarmenuRef}
                className={classNames('layout-topbar-menu', {
                    'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible,
                })}
            >
                <button type='button' className='p-link layout-topbar-button'>
                    <i className='pi pi-calendar'></i>
                    <span>Calendar</span>
                </button>
                <button type='button' className='p-link layout-topbar-button'>
                    <i className='pi pi-user'></i>
                    <span>Profile</span>
                </button>
                <Link href='/documentation'>
                    <button type='button' className='p-link layout-topbar-button'>
                        <i className='pi pi-cog'></i>
                        <span>Settings</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
