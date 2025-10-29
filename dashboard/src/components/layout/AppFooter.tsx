/* eslint-disable @next/next/no-img-element */

import React, { useContext, useState, useEffect } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [footerText, setFooterText] = useState('by PrimeReact');

    useEffect(() => {
        // Load footer text from localStorage
        const savedFooterText = localStorage.getItem('app_footer_text');
        if (savedFooterText) {
            setFooterText(savedFooterText);
        }

        // Listen for branding updates
        const handleBrandingUpdate = () => {
            const updatedFooterText = localStorage.getItem('app_footer_text');
            if (updatedFooterText) {
                setFooterText(updatedFooterText);
            }
        };

        window.addEventListener('branding-updated', handleBrandingUpdate);
        return () => window.removeEventListener('branding-updated', handleBrandingUpdate);
    }, []);

    return (
        <div className='layout-footer'>
            <img
                src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`}
                alt='Logo'
                height='20'
                className='mr-2'
            />
            <span className='font-medium'>{footerText}</span>
        </div>
    );
};

export default AppFooter;
