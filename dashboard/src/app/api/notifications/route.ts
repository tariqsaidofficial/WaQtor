import { NextRequest, NextResponse } from 'next/server';

// Mock data - في الواقع سيتم جلبها من قاعدة البيانات
const mockNotifications = [
    {
        id: '1',
        userId: 'user1',
        type: 'success',
        title: 'Message Sent Successfully',
        message: 'Your campaign message was sent to 150 contacts',
        icon: 'pi-check-circle',
        link: '/campaigns',
        read: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
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
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
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
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
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
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
];

// GET /api/notifications - جلب جميع الإشعارات
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter'); // 'all' | 'unread'
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        let notifications = [...mockNotifications];

        // Filter
        if (filter === 'unread') {
            notifications = notifications.filter(n => !n.read);
        }

        // Pagination
        const total = notifications.length;
        notifications = notifications.slice(offset, offset + limit);

        return NextResponse.json({
            success: true,
            data: notifications,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

// POST /api/notifications/mark-all-read - تحديد الكل كمقروء
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action } = body;

        if (action === 'mark-all-read') {
            // في الواقع سيتم تحديث قاعدة البيانات
            mockNotifications.forEach(n => n.read = true);

            return NextResponse.json({
                success: true,
                message: 'All notifications marked as read',
            });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update notifications' },
            { status: 500 }
        );
    }
}
