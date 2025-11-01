/**
 * Admin Statistics Page
 * System-wide statistics and analytics
 */

'use client';

import React from 'react';
import ProtectedPage from '../../../../components/BlockUI/ProtectedPage';
import { Card } from 'primereact/card';

function AdminStatisticsContent() {
    return (
        <div className="grid">
            <div className="col-12">
                <Card title="📊 Admin Statistics">
                    <p>System-wide statistics and analytics dashboard.</p>
                    <p className="text-500">This page is under development.</p>
                </Card>
            </div>
        </div>
    );
}

export default function AdminStatisticsPage() {
    return (
        <ProtectedPage featureName="Admin Statistics">
            <AdminStatisticsContent />
        </ProtectedPage>
    );
}
