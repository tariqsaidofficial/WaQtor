/**
 * Campaign Summary Card Component
 * Displays campaign statistics (Active, Completed, Failed, Total)
 */

import React from 'react';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { useAppStore } from '../../store/useAppStore';

export default function CampaignSummaryCard({ loading = false }) {
    const { campaigns } = useAppStore();
    
    const stats = {
        active: campaigns.filter(c => c.status === 'active').length,
        completed: campaigns.filter(c => c.status === 'completed').length,
        failed: campaigns.filter(c => c.status === 'failed').length,
        total: campaigns.length
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
                    {loading ? <Skeleton width="4rem" height="1.5rem" /> : value}
                </div>
            </div>
        </div>
    );

    return (
        <Card title="Campaign Summary" className="shadow-2" style={{ height: '100%' }}>
            <div className="grid">
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-spin pi-spinner"
                        label="Active Campaigns"
                        value={stats.active}
                        color="green"
                    />
                </div>
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-check-circle"
                        label="Completed Campaigns"
                        value={stats.completed}
                        color="blue"
                    />
                </div>
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-times-circle"
                        label="Failed Campaigns"
                        value={stats.failed}
                        color="red"
                    />
                </div>
                <div className="col-12 md:col-6">
                    <StatItem
                        icon="pi pi-chart-bar"
                        label="Total Campaigns"
                        value={stats.total}
                        color="purple"
                    />
                </div>
            </div>
        </Card>
    );
}
