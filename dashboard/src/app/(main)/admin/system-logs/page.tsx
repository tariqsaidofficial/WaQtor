/**
 * Admin System Logs Page
 * System logs and audit trail
 */

'use client';

import React from 'react';
import ProtectedPage from '../../../../components/BlockUI/ProtectedPage';
import { Card } from 'primereact/card';

function AdminLogsContent() {
    return (
        <div className="grid">
            <div className="col-12">
                <Card title="📋 System Logs">
                    <p>System logs and audit trail.</p>
                    <p className="text-500">This page is under development.</p>
                </Card>
            </div>
        </div>
    );
}

export default function AdminLogsPage() {
    return (
        <ProtectedPage featureName="Admin Logs">
            <AdminLogsContent />
        </ProtectedPage>
    );
}
