/**
 * Dashboard Page
 * Main dashboard with comprehensive overview
 */

import React from 'react';
import { EnhancedQRStatusCard } from '../components/enhanced/EnhancedQRStatusCard';
import SessionStatsCard from '../components/SessionStatsCard';
import CampaignSummaryCard from '../components/dashboard/CampaignSummaryCard';
import UpcomingCampaignsCard from '../components/dashboard/UpcomingCampaignsCard';

export default function Dashboard() {
    return (
        <div className="grid">
            {/* Header */}
            <div className="col-12">
                <div className="card">
                    <h1 className="text-3xl font-bold mb-2">
                        <i className="pi pi-chart-line mr-2"></i>
                        Dashboard
                    </h1>
                    <p className="text-600 m-0">
                        Welcome to Waqtor - Complete overview of your WhatsApp automation
                    </p>
                </div>
            </div>

            {/* Row 1: QR Status & Session/Message Stats */}
            <div className="col-12 lg:col-6">
                <EnhancedQRStatusCard />
            </div>

            <div className="col-12 lg:col-6">
                <SessionStatsCard />
            </div>

            {/* Row 2: Campaign Summary & Campaigns */}
            <div className="col-12 lg:col-6">
                <CampaignSummaryCard />
            </div>

            <div className="col-12 lg:col-6">
                <UpcomingCampaignsCard />
            </div>
        </div>
    );
}
