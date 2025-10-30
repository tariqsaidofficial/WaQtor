/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';

const AppFooter = () => {
    const [footerText, setFooterText] = useState('© 2024 WaQtor. All rights reserved.');
    const [showFooter, setShowFooter] = useState(true);
    const [logoUrl, setLogoUrl] = useState('/layout/images/logo-dark.svg');

    useEffect(() => {
        // Load footer settings from localStorage
        const savedFooterText = localStorage.getItem('app_footer_text') || '© 2024 WaQtor. All rights reserved.';
        const savedShowFooter = localStorage.getItem('app_show_footer') !== 'false';
        const savedLogoUrl = localStorage.getItem('app_logo') || '/layout/images/logo-dark.svg';
        
        setFooterText(savedFooterText);
        setShowFooter(savedShowFooter);
        setLogoUrl(savedLogoUrl);

        // Listen for branding updates
        const handleBrandingUpdate = () => {
            const updatedFooterText = localStorage.getItem('app_footer_text') || '© 2024 WaQtor. All rights reserved.';
            const updatedShowFooter = localStorage.getItem('app_show_footer') !== 'false';
            const updatedLogoUrl = localStorage.getItem('app_logo') || '/layout/images/logo-dark.svg';
            
            setFooterText(updatedFooterText);
            setShowFooter(updatedShowFooter);
            setLogoUrl(updatedLogoUrl);
        };

        window.addEventListener('branding-update', handleBrandingUpdate);
        return () => window.removeEventListener('branding-update', handleBrandingUpdate);
    }, []);

    if (!showFooter) {
        return null;
    }

    return (
        <div className='layout-footer'>
            <img
                src={logoUrl}
                alt='Logo'
                height='20'
                className='mr-2'
            />
            <span className='font-medium'>{footerText}</span>
        </div>
    );
};

export default AppFooter;
