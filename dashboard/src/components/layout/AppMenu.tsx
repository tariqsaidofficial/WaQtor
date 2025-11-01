/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const [userRole, setUserRole] = useState<string>('user');

    useEffect(() => {
        // Get user role from localStorage
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                setUserRole(userData.role || 'user');
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const isAdmin = userRole === 'admin';

    const model: AppMenuItem[] = [
        {
            label: 'WAQTOR',
            items: [
                { 
                    label: 'Dashboard', 
                    icon: 'pi pi-fw pi-chart-line', 
                    to: '/' 
                },
                { 
                    label: 'Campaigns', 
                    icon: 'pi pi-fw pi-megaphone', 
                    to: '/campaigns',
                    badge: 'NEW'
                },
                { 
                    label: 'Messages', 
                    icon: 'pi pi-fw pi-comments', 
                    to: '/messages' 
                },
                { 
                    label: 'Notifications', 
                    icon: 'pi pi-fw pi-bell', 
                    to: '/notifications' 
                },
                { 
                    label: 'SmartBot', 
                    icon: 'pi pi-fw pi-bolt', 
                    to: '/smartbot' 
                },
                { 
                    label: 'Interactive', 
                    icon: 'pi pi-fw pi-comments', 
                    to: '/interactive',
                    badge: 'NEW'
                },
                { 
                    label: 'Reports', 
                    icon: 'pi pi-fw pi-chart-bar', 
                    to: '/reports',
                    badge: 'NEW'
                },
                { 
                    label: 'Settings', 
                    icon: 'pi pi-fw pi-cog', 
                    items: [
                        {
                            label: 'General',
                            icon: 'pi pi-fw pi-cog',
                            to: '/settings'
                        },
                        {
                            label: 'Webhooks',
                            icon: 'pi pi-fw pi-link',
                            to: '/settings/webhooks'
                        }
                    ]
                },
                { 
                    label: 'Profile', 
                    icon: 'pi pi-fw pi-user', 
                    to: '/profile' 
                },
                { 
                    label: 'About', 
                    icon: 'pi pi-fw pi-info-circle', 
                    to: '/about' 
                },
            ],
        },
        // Admin Section - Only visible to admins
        ...(isAdmin ? [{
            label: 'ADMIN',
            items: [
                { 
                    label: 'User Management', 
                    icon: 'pi pi-fw pi-users', 
                    to: '/admin/users',
                    badge: 'ADMIN' as const
                },
                { 
                    label: 'System Statistics', 
                    icon: 'pi pi-fw pi-chart-pie', 
                    to: '/admin/statistics',
                    badge: 'SOON' as const
                },
                { 
                    label: 'Activity Logs', 
                    icon: 'pi pi-fw pi-list', 
                    to: '/admin/logs',
                    badge: 'SOON' as const
                },
                { 
                    label: 'Admin Settings', 
                    icon: 'pi pi-fw pi-shield', 
                    to: '/admin/settings'
                },
            ],
        }] : []),
        {
            label: 'Development',
            items: [
                { label: 'Prime Dashboard', icon: 'pi pi-fw pi-desktop', to: '/dashboard' },
                { label: 'UI Components', icon: 'pi pi-fw pi-box', to: '/uikit/formlayout' },
            ],
        },
    ];

    return (
        <MenuProvider>
            <ul className='layout-menu'>
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className='menu-separator'></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
