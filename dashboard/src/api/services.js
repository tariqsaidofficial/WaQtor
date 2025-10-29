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
        const response = await api.post('/api/messages/send-text', { phone, message });
        return response.data;
    },

    // Send media message
    sendMedia: async (phone, mediaUrl, caption = '') => {
        const response = await api.post('/api/messages/send-media', { phone, mediaUrl, caption });
        return response.data;
    },

    // Send bulk messages
    sendBulk: async (recipients, message) => {
        const response = await api.post('/api/messages/send-bulk', { recipients, message });
        return response.data;
    },

    // Send bulk messages with variables
    sendBulkWithVariables: async (recipients, messageTemplate, attachments = []) => {
        console.log('📤 [API] sendBulkWithVariables called');
        console.log('📤 [API] Recipients:', recipients);
        console.log('📤 [API] Message template:', messageTemplate);
        console.log('📤 [API] Attachments:', attachments);
        
        // Replace variables in message for each recipient
        const processedRecipients = recipients.map(recipient => {
            let personalizedMessage = messageTemplate;
            
            // Replace all variables
            if (recipient.variables) {
                Object.keys(recipient.variables).forEach(key => {
                    const placeholder = `{${key}}`;
                    const value = recipient.variables[key] || '';
                    personalizedMessage = personalizedMessage.replace(new RegExp(placeholder, 'g'), value);
                });
            }
            
            console.log(`📝 [API] Personalized message for ${recipient.phone}:`, personalizedMessage);
            
            return {
                phone: recipient.phone,
                message: personalizedMessage
            };
        });
        
        console.log('📤 [API] Processed recipients:', processedRecipients);
        
        // If there are attachments, use the media endpoint
        if (attachments && attachments.length > 0) {
            console.log('📎 [API] Sending with attachments via FormData');
            
            const formData = new FormData();
            formData.append('recipients', JSON.stringify(processedRecipients));
            
            // Add all attachments
            attachments.forEach((file, index) => {
                formData.append('attachments', file);
                console.log(`📎 [API] Added attachment ${index + 1}:`, file.name);
            });
            
            const response = await api.post('/api/messages/send-bulk-with-media', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('✅ [API] sendBulkWithVariables (with media) response:', response.data);
            return response.data;
        } else {
            // No attachments, use regular endpoint
            const response = await api.post('/api/messages/send-bulk', { 
                recipients: processedRecipients
            });
            
            console.log('✅ [API] sendBulkWithVariables response:', response.data);
            return response.data;
        }
    },

    // Schedule bulk message
    scheduleBulkMessage: async (recipients, message, scheduledDate, attachments = []) => {
        console.log('⏰ [API] scheduleBulkMessage called');
        console.log('⏰ [API] Recipients:', recipients);
        console.log('⏰ [API] Message:', message);
        console.log('⏰ [API] Scheduled date:', scheduledDate);
        console.log('⏰ [API] Attachments:', attachments);
        
        const response = await api.post('/api/messages/schedule-bulk', { 
            recipients, 
            message,
            scheduledDate,
            attachments 
        });
        
        console.log('✅ [API] scheduleBulkMessage response:', response.data);
        return response.data;
    },

    // Upload file
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/api/messages/upload', formData, {
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
        const response = await api.post('/api/messages/send-file', formData, {
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
        const response = await api.post('/api/campaigns/create', campaignData);
        return response.data;
    },

    // List all campaigns
    list: async () => {
        const response = await api.get('/api/campaigns/list');
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
        const response = await api.get('/api/status/client');
        return response.data;
    },

    // Get session info
    getInfo: async () => {
        const response = await api.get('/api/status/info');
        return response.data;
    },

    // Get all chats
    getChats: async () => {
        const response = await api.get('/api/status/chats');
        return response.data;
    },

    // Get version info
    getVersion: async () => {
        const response = await api.get('/api/status/version');
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/api/status/logout');
        return response.data;
    },
};

/**
 * Session Services
 */
export const sessionService = {
    // Get session state
    getState: async () => {
        const response = await api.get('/api/session/state');
        return response.data;
    },

    // Get QR code
    getQR: async () => {
        const response = await api.get('/api/session/qr');
        return response.data;
    },

    // Get WebSocket info
    getWebSocketInfo: async () => {
        const response = await api.get('/api/session/websocket/info');
        return response.data;
    },

    // Reset stats
    resetStats: async () => {
        const response = await api.post('/api/session/stats/reset');
        return response.data;
    },
};

/**
 * Test Services
 */
export const testService = {
    // Send test message
    send: async (message) => {
        const response = await api.post('/api/test/send', { message });
        return response.data;
    },

    // Get test info
    getInfo: async () => {
        const response = await api.get('/api/test/info');
        return response.data;
    },
};

/**
 * Error Services
 */
export const errorService = {
    // Get error statistics
    getStats: async (timeRange = 'day') => {
        const response = await api.get('/api/errors/stats', { params: { timeRange } });
        return response.data.data;
    },

    // Get recent errors
    getRecent: async (limit = 10) => {
        const response = await api.get('/api/errors/recent', { params: { limit } });
        return response.data.data;
    },

    // Clear error history
    clearHistory: async () => {
        const response = await api.delete('/api/errors/clear');
        return response.data;
    },

    // Log frontend error
    logError: async (error, context = {}) => {
        const response = await api.post('/api/errors/log', { error, context });
        return response.data;
    },
};

/**
 * Queue Services
 */
export const queueService = {
    // Get queue statistics
    getStats: async () => {
        const response = await api.get('/api/queue/stats');
        return response.data.data;
    },

    // Get recent jobs
    getJobs: async (limit = 50) => {
        const response = await api.get('/api/queue/jobs', { params: { limit } });
        return response.data.data;
    },

    // Get job status by ID
    getJobStatus: async (jobId) => {
        const response = await api.get(`/queue/jobs/${jobId}`);
        return response.data.data;
    },

    // Pause queue
    pause: async () => {
        const response = await api.post('/api/queue/pause');
        return response.data;
    },

    // Resume queue
    resume: async () => {
        const response = await api.post('/api/queue/resume');
        return response.data;
    },

    // Clean old jobs
    clean: async (grace = 24 * 60 * 60 * 1000) => {
        const response = await api.post('/api/queue/clean', { grace });
        return response.data;
    },

    // Check queue health
    getHealth: async () => {
        const response = await api.get('/api/queue/health');
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
    queue: queueService,
};
