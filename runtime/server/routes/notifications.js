const express = require('express');
const router = express.Router();

// WebSocket bridge will be injected
let websocketBridge = null;

// Set WebSocket bridge (called from server.js)
function setWebSocketBridge(bridge) {
    websocketBridge = bridge;
}

// In-memory storage (في الإنتاج سيتم استخدام قاعدة بيانات)
let notifications = [
    {
        id: '1',
        userId: 'user1',
        type: 'success',
        title: 'Message Sent Successfully',
        message: 'Your campaign message was sent to 150 contacts',
        icon: 'pi-check-circle',
        link: '/campaigns',
        read: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        userId: 'user1',
        type: 'info',
        title: 'New Contact Added',
        message: 'John Doe was added to your contacts',
        icon: 'pi-user-plus',
        link: '/contacts',
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
        id: '3',
        userId: 'user1',
        type: 'warning',
        title: 'API Rate Limit Warning',
        message: 'You have used 80% of your daily API quota',
        icon: 'pi-exclamation-triangle',
        link: '/settings',
        read: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '4',
        userId: 'user1',
        type: 'error',
        title: 'Message Failed',
        message: 'Failed to send message to +1234567890',
        icon: 'pi-times-circle',
        link: '/messages',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
];

// GET /api/notifications - Get all notifications
router.get('/', (req, res) => {
    try {
        const { filter = 'all', limit = 50, offset = 0 } = req.query;
        const userId = req.user?.id || 'user1'; // في الإنتاج سيتم الحصول عليه من session

        let userNotifications = notifications.filter(n => n.userId === userId);

        // Apply filter
        if (filter === 'unread') {
            userNotifications = userNotifications.filter(n => !n.read);
        }

        // Sort by date (newest first)
        userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        const total = userNotifications.length;
        const paginatedNotifications = userNotifications.slice(
            parseInt(offset),
            parseInt(offset) + parseInt(limit)
        );

        res.json({
            success: true,
            data: paginatedNotifications,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: parseInt(offset) + parseInt(limit) < total,
            },
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications',
        });
    }
});

// GET /api/notifications/count - Get unread count
router.get('/count', (req, res) => {
    try {
        const userId = req.user?.id || 'user1';
        const userNotifications = notifications.filter(n => n.userId === userId);
        const unreadCount = userNotifications.filter(n => !n.read).length;

        res.json({
            success: true,
            data: {
                unread: unreadCount,
                total: userNotifications.length,
            },
        });
    } catch (error) {
        console.error('Error fetching notification count:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notification count',
        });
    }
});

// POST /api/notifications - Create new notification or mark all as read
router.post('/', (req, res) => {
    try {
        const { action, type, title, message, icon, link } = req.body;
        const userId = req.user?.id || 'user1';

        // Mark all as read
        if (action === 'mark-all-read') {
            notifications = notifications.map(n =>
                n.userId === userId ? { ...n, read: true } : n
            );

            return res.json({
                success: true,
                message: 'All notifications marked as read',
            });
        }

        // Create new notification
        if (type && title && message) {
            const newNotification = {
                id: Date.now().toString(),
                userId,
                type,
                title,
                message,
                icon: icon || 'pi-bell',
                link: link || null,
                read: false,
                createdAt: new Date().toISOString(),
            };

            notifications.unshift(newNotification);

            // Broadcast to WebSocket clients
            if (websocketBridge) {
                websocketBridge.broadcastNotification(newNotification);
                
                // Also broadcast updated count
                const unreadCount = notifications.filter(n => n.userId === userId && !n.read).length;
                websocketBridge.broadcastNotificationCount({
                    userId,
                    unread: unreadCount,
                    total: notifications.filter(n => n.userId === userId).length
                });
            }

            return res.json({
                success: true,
                message: 'Notification created successfully',
                data: newNotification,
            });
        }

        res.status(400).json({
            success: false,
            error: 'Invalid request',
        });
    } catch (error) {
        console.error('Error processing notification:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process notification',
        });
    }
});

// PATCH /api/notifications/:id - Mark as read/unread
router.patch('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { read } = req.body;
        const userId = req.user?.id || 'user1';

        const notificationIndex = notifications.findIndex(
            n => n.id === id && n.userId === userId
        );

        if (notificationIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found',
            });
        }

        notifications[notificationIndex].read = read;

        res.json({
            success: true,
            message: 'Notification updated successfully',
            data: notifications[notificationIndex],
        });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update notification',
        });
    }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || 'user1';

        const notificationIndex = notifications.findIndex(
            n => n.id === id && n.userId === userId
        );

        if (notificationIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found',
            });
        }

        notifications.splice(notificationIndex, 1);

        res.json({
            success: true,
            message: 'Notification deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete notification',
        });
    }
});

// Helper function to create notification (can be called from other routes)
function createNotification(userId, type, title, message, icon = null, link = null) {
    const newNotification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId,
        type,
        title,
        message,
        icon: icon || 'pi-bell',
        link,
        read: false,
        createdAt: new Date().toISOString(),
    };

    notifications.unshift(newNotification);

    // Broadcast to WebSocket clients
    if (websocketBridge) {
        websocketBridge.broadcastNotification(newNotification);
        
        // Also broadcast updated count
        const unreadCount = notifications.filter(n => n.userId === userId && !n.read).length;
        websocketBridge.broadcastNotificationCount({
            userId,
            unread: unreadCount,
            total: notifications.filter(n => n.userId === userId).length
        });
    }

    return newNotification;
}

module.exports = router;
module.exports.createNotification = createNotification;
module.exports.setWebSocketBridge = setWebSocketBridge;
