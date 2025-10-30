/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {

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
