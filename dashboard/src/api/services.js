/**
 * API Services
 * All API endpoints organized by domain
 */

import api from './client';

/**
 * Message Services
 */
export const messageService = {
    // Send text message
    sendText: async (phone, message) => {
        const response = await api.post('/messages/send-text', { phone, message });
        return response.data;
    },

    // Send media message
    sendMedia: async (phone, mediaUrl, caption = '') => {
        const response = await api.post('/messages/send-media', { phone, mediaUrl, caption });
        return response.data;
    },

    // Send bulk messages
    sendBulk: async (recipients, message) => {
        const response = await api.post('/messages/send-bulk', { recipients, message });
        return response.data;
    },

    // Upload file
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/messages/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Send file
    sendFile: async (phone, file, caption = '') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('phone', phone);
        formData.append('caption', caption);
        const response = await api.post('/messages/send-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

/**
 * Campaign Services
 */
export const campaignService = {
    // Create campaign
    create: async (campaignData) => {
        const response = await api.post('/campaigns/create', campaignData);
        return response.data;
    },

    // List all campaigns
    list: async () => {
        const response = await api.get('/campaigns/list');
        return response.data;
    },

    // Get campaign by ID
    getById: async (id) => {
        const response = await api.get(`/campaigns/${id}`);
        return response.data;
    },

    // Update campaign status
    updateStatus: async (id, status) => {
        const response = await api.put(`/campaigns/${id}/status`, { status });
        return response.data;
    },

    // Delete campaign
    delete: async (id) => {
        const response = await api.delete(`/campaigns/${id}`);
        return response.data;
    },

    // Execute campaign
    execute: async (id) => {
        const response = await api.post(`/campaigns/${id}/execute`);
        return response.data;
    },
};

/**
 * Status Services
 */
export const statusService = {
    // Get client status
    getClientStatus: async () => {
        const response = await api.get('/status/client');
        return response.data;
    },

    // Get session info
    getInfo: async () => {
        const response = await api.get('/status/info');
        return response.data;
    },

    // Get all chats
    getChats: async () => {
        const response = await api.get('/status/chats');
        return response.data;
    },

    // Get version info
    getVersion: async () => {
        const response = await api.get('/status/version');
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/status/logout');
        return response.data;
    },
};

/**
 * Session Services
 */
export const sessionService = {
    // Get session state
    getState: async () => {
        const response = await api.get('/session/state');
        return response.data;
    },

    // Get QR code
    getQR: async () => {
        const response = await api.get('/session/qr');
        return response.data;
    },

    // Get WebSocket info
    getWebSocketInfo: async () => {
        const response = await api.get('/session/websocket/info');
        return response.data;
    },

    // Reset stats
    resetStats: async () => {
        const response = await api.post('/session/stats/reset');
        return response.data;
    },
};

/**
 * Test Services
 */
export const testService = {
    // Send test message
    send: async (message) => {
        const response = await api.post('/test/send', { message });
        return response.data;
    },

    // Get test info
    getInfo: async () => {
        const response = await api.get('/test/info');
        return response.data;
    },
};

/**
 * Error Services
 */
export const errorService = {
    // Get error statistics
    getStats: async (timeRange = 'day') => {
        const response = await api.get('/errors/stats', { params: { timeRange } });
        return response.data.data;
    },

    // Get recent errors
    getRecent: async (limit = 10) => {
        const response = await api.get('/errors/recent', { params: { limit } });
        return response.data.data;
    },

    // Clear error history
    clearHistory: async () => {
        const response = await api.delete('/errors/clear');
        return response.data;
    },

    // Log frontend error
    logError: async (error, context = {}) => {
        const response = await api.post('/errors/log', { error, context });
        return response.data;
    },
};

export default {
    message: messageService,
    campaign: campaignService,
    status: statusService,
    session: sessionService,
    test: testService,
    error: errorService,
};
