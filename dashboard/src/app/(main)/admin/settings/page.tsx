/**
 * Admin Settings Page
 * System settings and configuration
 */

'use client';

import React from 'react';
import ProtectedPage from '../../../../components/BlockUI/ProtectedPage';
import SettingsPage from '../../settings/page';

export default function AdminSettingsPage() {
    return (
        <ProtectedPage featureName="Admin Settings">
            <SettingsPage />
        </ProtectedPage>
    );
}
