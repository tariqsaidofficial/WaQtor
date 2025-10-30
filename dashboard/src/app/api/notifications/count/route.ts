import { NextRequest, NextResponse } from 'next/server';

// Mock data
const mockNotifications = [
    { id: '1', read: false },
    { id: '2', read: false },
    { id: '3', read: true },
    { id: '4', read: true },
];

// GET /api/notifications/count - عدد الإشعارات غير المقروءة
export async function GET(request: NextRequest) {
    try {
        // في الواقع سيتم جلبها من قاعدة البيانات
        const unreadCount = mockNotifications.filter(n => !n.read).length;

        return NextResponse.json({
            success: true,
            data: {
                unread: unreadCount,
                total: mockNotifications.length,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch notification count' },
            { status: 500 }
        );
    }
}
