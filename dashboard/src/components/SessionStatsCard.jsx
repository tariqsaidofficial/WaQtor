/**
 * Session Stats Card Component
 * Displays session statistics and message metrics
 */

import React from 'react';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { Divider } from 'primereact/divider';
import { useAppStore } from '../store/useAppStore';

export default function SessionStatsCard() {
    const { sessionState, settings } = useAppStore();
    const [currentDate, setCurrentDate] = React.useState('');
    const [timeZone, setTimeZone] = React.useState('');
    
    // Get current date and timezone on client side only (to avoid hydration mismatch)
    React.useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('en-US', { 
            weekday: 'short',  // Wed instead of Wednesday
            year: 'numeric', 
            month: 'short',    // Oct instead of October
            day: 'numeric' 
        }));
        
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    const formatUptime = (seconds) => {
        if (!seconds) return 'N/A';
    
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
    
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const StatItem = ({ icon, label, value, color = 'primary' }) => (
        <div className="flex align-items-center gap-3 p-3 border-round hover:bg-gray-50 transition-colors">
            <div className={`flex align-items-center justify-content-center bg-${color}-100 text-${color}-700 border-round`} 
                style={{ width: '3rem', height: '3rem' }}>
                <i className={`${icon} text-2xl`}></i>
            </div>
            <div className="flex-1">
                <div className="text-500 text-sm mb-1">{label}</div>
                <div className="text-900 font-semibold text-xl">
                    {value !== undefined && value !== null ? value : <Skeleton width="4rem" height="1.5rem" />}
                </div>
            </div>
        </div>
    );

    return (
        <Card title="Session & Message Statistics" className="shadow-2" style={{ height: '100%' }}>
            {/* Date and Time Zone */}
            <div className="grid mb-3">
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-calendar-plus"
                        label="Date"
                        value={currentDate}
                        color="indigo"
                    />
                </div>
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-globe"
                        label="Time Zone"
                        value={timeZone}
                        color="teal"
                    />
                </div>
            </div>

            <Divider />

            {/* Message Statistics */}
            <div className="grid">
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-send"
                        label="Messages Sent (Today)"
                        value={sessionState?.messagesSent || 0}
                        color="blue"
                    />
                </div>
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-check"
                        label="Messages Delivered"
                        value={sessionState?.messagesDelivered || 0}
                        color="green"
                    />
                </div>
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-times"
                        label="Messages Failed"
                        value={sessionState?.messagesFailed || 0}
                        color="red"
                    />
                </div>
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-inbox"
                        label="Messages Received"
                        value={sessionState?.messagesReceived || 0}
                        color="cyan"
                    />
                </div>
            </div>

            <Divider />

            {/* Session Information */}
            <div className="grid">
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-clock"
                        label="Session Uptime"
                        value={formatUptime(sessionState?.uptime)}
                        color="purple"
                    />
                </div>
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-refresh"
                        label="Last Update"
                        value={sessionState?.lastUpdate 
                            ? new Date(sessionState.lastUpdate).toLocaleTimeString()
                            : 'N/A'
                        }
                        color="orange"
                    />
                </div>
            </div>
        </Card>
    );
}
