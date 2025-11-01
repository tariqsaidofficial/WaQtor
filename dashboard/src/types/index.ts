/**
 * Global Type Definitions
 */

export interface AppMenuItem {
    label: string;
    icon?: string;
    to?: string;
    url?: string;
    target?: string;
    seperator?: boolean;
    items?: AppMenuItem[];
    badge?: 'NEW' | 'SOON' | 'ADMIN';
    badgeClass?: string;
    class?: string;
    preventExact?: boolean;
    visible?: boolean;
    disabled?: boolean;
    replaceUrl?: boolean;
    command?: () => void;
}

export interface AppMenuItemProps {
    item: AppMenuItem;
    index: number;
    root?: boolean;
    parentKey?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
        refreshToken?: string;
    };
    message?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
