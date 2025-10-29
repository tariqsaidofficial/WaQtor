/**
 * App Store
 * Global state management using Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useAppStore = create(
    devtools(
        persist(
            (set, get) => ({
                // Session State
                qr: null,
                status: 'disconnected',
                sessionState: null,

                // Campaigns
                campaigns: [],
                selectedCampaign: null,

                // Messages
                messages: [],

                // UI State
                sidebarVisible: true,
                theme: 'light',

                // Settings
                settings: {
                    autoRefresh: true,
                    refreshInterval: 30000, // 30 seconds
                    notifications: true,
                },

                // Actions - Session
                setQr: (qr) => set({ qr }),

                setStatus: (status) => set({ status }),

                setSessionState: (sessionState) =>
                    set({
                        sessionState,
                        status: sessionState?.status || get().status,
                        qr: sessionState?.qrCode || get().qr,
                    }),

                clearSession: () =>
                    set({
                        qr: null,
                        status: 'disconnected',
                        sessionState: null,
                    }),

                // Actions - Campaigns
                setCampaigns: (campaigns) => set({ campaigns }),

                addCampaign: (campaign) =>
                    set((state) => ({
                        campaigns: [...state.campaigns, campaign],
                    })),

                updateCampaign: (id, updates) =>
                    set((state) => ({
                        campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                    })),

                deleteCampaign: (id) =>
                    set((state) => ({
                        campaigns: state.campaigns.filter((c) => c.id !== id),
                    })),

                setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),

                // Actions - Messages
                setMessages: (messages) => set({ messages }),

                addMessage: (message) =>
                    set((state) => ({
                        messages: [...state.messages, message],
                    })),

                // Actions - UI
                toggleSidebar: () =>
                    set((state) => ({
                        sidebarVisible: !state.sidebarVisible,
                    })),

                setSidebarVisible: (visible) => set({ sidebarVisible: visible }),

                setTheme: (theme) => set({ theme }),

                toggleTheme: () =>
                    set((state) => ({
                        theme: state.theme === 'light' ? 'dark' : 'light',
                    })),

                // Actions - Settings
                updateSettings: (newSettings) =>
                    set((state) => ({
                        settings: { ...state.settings, ...newSettings },
                    })),

                // Reset all state
                reset: () =>
                    set({
                        qr: null,
                        status: 'disconnected',
                        sessionState: null,
                        campaigns: [],
                        selectedCampaign: null,
                        messages: [],
                        sidebarVisible: true,
                        theme: 'light',
                    }),
            }),
            {
                name: 'waqtor-storage',
                partialize: (state) => ({
                    theme: state.theme,
                    settings: state.settings,
                    sidebarVisible: state.sidebarVisible,
                }),
            }
        ),
        {
            name: 'WaqtorStore',
        }
    )
);

export default useAppStore;
