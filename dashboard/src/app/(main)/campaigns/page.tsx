/**
 * Campaigns Page
 * Path: /campaigns
 */

'use client';

import Campaigns from '@/src/app/Campaigns';
import ProtectedPage from '@/src/components/BlockUI/ProtectedPage';

export default function CampaignsPage() {
    return (
        <ProtectedPage featureName="Campaigns">
            <Campaigns />
        </ProtectedPage>
    );
}
