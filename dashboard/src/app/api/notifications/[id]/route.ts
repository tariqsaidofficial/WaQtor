import { NextRequest, NextResponse } from 'next/server';

// Mock data
const mockNotifications = [
    { id: '1', read: false },
    { id: '2', read: false },
    { id: '3', read: true },
    { id: '4', read: true },
];

// PATCH /api/notifications/[id] - تحديد كمقروء
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { read } = body;

        // في الواقع سيتم تحديث قاعدة البيانات
        const notification = mockNotifications.find(n => n.id === id);
        if (!notification) {
            return NextResponse.json(
                { success: false, error: 'Notification not found' },
                { status: 404 }
            );
        }

        notification.read = read;

        return NextResponse.json({
            success: true,
            message: 'Notification updated successfully',
            data: notification,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update notification' },
            { status: 500 }
        );
    }
}

// DELETE /api/notifications/[id] - حذف إشعار
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // في الواقع سيتم حذف من قاعدة البيانات
        const index = mockNotifications.findIndex(n => n.id === id);
        if (index === -1) {
            return NextResponse.json(
                { success: false, error: 'Notification not found' },
                { status: 404 }
            );
        }

        mockNotifications.splice(index, 1);

        return NextResponse.json({
            success: true,
            message: 'Notification deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete notification' },
            { status: 500 }
        );
    }
}
