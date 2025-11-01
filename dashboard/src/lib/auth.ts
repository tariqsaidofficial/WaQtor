/**
 * Authentication Service
 * Handles JWT authentication, token management, and API calls
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'viewer';
    isActive: boolean;
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
    error?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    name: string;
    email: string;
    password: string;
}

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
        
        if (response.data.success && response.data.token) {
            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.error || 'Login failed. Please try again.',
        };
    }
};

/**
 * Register new user
 */
export const signup = async (data: SignupData): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, data);
        
        if (response.data.success && response.data.token) {
            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.error || 'Signup failed. Please try again.',
        };
    }
};

/**
 * Logout user
 */
export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

/**
 * Get auth token from localStorage
 */
export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

/**
 * Check if user has admin role
 */
export const isAdmin = (): boolean => {
    const user = getCurrentUser();
    return user?.role === 'admin';
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: 'admin' | 'user' | 'viewer'): boolean => {
    const user = getCurrentUser();
    return user?.role === role;
};

/**
 * Initialize axios with token from localStorage
 */
export const initializeAuth = (): void => {
    const token = getToken();
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

/**
 * Verify token with backend
 */
export const verifyToken = async (): Promise<boolean> => {
    try {
        const token = getToken();
        if (!token) return false;
        
        const response = await axios.get(`${API_URL}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        return response.data.success;
    } catch {
        // Token is invalid, clear it
        logout();
        return false;
    }
};

/**
 * Get user profile from backend
 */
export const getProfile = async (): Promise<User | null> => {
    try {
        const token = getToken();
        if (!token) return null;
        
        const response = await axios.get(`${API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data.user;
        }
        
        return null;
    } catch {
        return null;
    }
};

// Initialize auth on module load
if (typeof window !== 'undefined') {
    initializeAuth();
}
