/**
 * Campaigns Page
 * Path: /campaigns
 */

'use client';

import Campaigns from '../../Campaigns';
import ProtectedPage from '../../../components/BlockUI/ProtectedPage';

export default function CampaignsPage() {
    return (
        <ProtectedPage featureName="Campaigns">
            <Campaigns />
        </ProtectedPage>
    );
}
