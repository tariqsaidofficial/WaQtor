/**
 * Campaigns Card Component
 * Displays upcoming and active campaigns
 */

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { TabView, TabPanel } from 'primereact/tabview';
import { useAppStore } from '../../store/useAppStore';

export default function UpcomingCampaignsCard({ loading = false }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const { campaigns } = useAppStore();

    // Filter campaigns by status
    const upcomingCampaigns = campaigns.filter(c => c.status === 'scheduled');
    const activeCampaigns = campaigns.filter(c => c.status === 'active');

    const formatDate = (date) => {
        const now = new Date();
        const diff = date - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `in ${days} day${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `in ${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            return 'soon';
        }
    };

    const formatElapsedTime = (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return 'just now';
        }
    };

    const upcomingNameTemplate = (rowData) => {
        if (loading) return <Skeleton width="10rem" height="1rem" />;
        return (
            <div>
                <div className="font-semibold text-900">{rowData.name}</div>
                <div className="text-xs text-500 mt-1">
                    <i className="pi pi-calendar mr-1"></i>
                    {formatDate(rowData.scheduledDate)}
                </div>
            </div>
        );
    };

    const activeNameTemplate = (rowData) => {
        if (loading) return <Skeleton width="10rem" height="1rem" />;
        return (
            <div>
                <div className="font-semibold text-900">{rowData.name}</div>
                <div className="text-xs text-500 mt-1">
                    <i className="pi pi-clock mr-1"></i>
                    Started {formatElapsedTime(rowData.startedDate)}
                </div>
            </div>
        );
    };

    const recipientsTemplate = (rowData) => {
        if (loading) return <Skeleton width="3rem" height="1rem" />;
        return (
            <div className="flex align-items-center gap-2">
                <i className="pi pi-users text-blue-500"></i>
                <span className="font-semibold">{rowData.recipients}</span>
            </div>
        );
    };

    const progressTemplate = (rowData) => {
        if (loading) return <Skeleton width="5rem" height="1rem" />;
        const percentage = Math.round((rowData.sent / rowData.recipients) * 100);
        return (
            <div>
                <div className="text-sm font-semibold text-900 mb-1">
                    {rowData.sent} / {rowData.recipients}
                </div>
                <div className="text-xs text-500">{percentage}% complete</div>
            </div>
        );
    };

    const upcomingStatusTemplate = (rowData) => {
        if (loading) return <Skeleton width="5rem" height="1.5rem" />;
        return <Tag value="Scheduled" severity="info" icon="pi pi-clock" />;
    };

    const activeStatusTemplate = (rowData) => {
        if (loading) return <Skeleton width="5rem" height="1.5rem" />;
        return <Tag value="Running" severity="success" icon="pi pi-spin pi-spinner" />;
    };

    const actionTemplate = (rowData) => {
        if (loading) return <Skeleton width="2rem" height="2rem" shape="circle" />;
        return (
            <Button 
                icon="pi pi-eye" 
                rounded 
                text 
                severity="secondary"
                tooltip="View Details"
                tooltipOptions={{ position: 'top' }}
            />
        );
    };

    const emptyUpcomingMessage = (
        <div className="text-center p-4">
            <i className="pi pi-calendar-times text-4xl text-400 mb-3"></i>
            <p className="text-600 m-0">No upcoming campaigns scheduled</p>
        </div>
    );

    const emptyActiveMessage = (
        <div className="text-center p-4">
            <i className="pi pi-inbox text-4xl text-400 mb-3"></i>
            <p className="text-600 m-0">No active campaigns running</p>
        </div>
    );

    return (
        <Card 
            title="Campaigns" 
            className="shadow-2"
            style={{ height: '100%' }}
        >
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Upcoming" leftIcon="pi pi-calendar mr-2">
                    {loading ? (
                        <div>
                            <Skeleton width="100%" height="3rem" className="mb-2" />
                            <Skeleton width="100%" height="3rem" className="mb-2" />
                            <Skeleton width="100%" height="3rem" />
                        </div>
                    ) : (
                        <DataTable 
                            value={upcomingCampaigns} 
                            emptyMessage={emptyUpcomingMessage}
                            size="small"
                            stripedRows
                        >
                            <Column 
                                field="name" 
                                header="Campaign" 
                                body={upcomingNameTemplate}
                                style={{ width: '50%' }}
                            />
                            <Column 
                                field="recipients" 
                                header="Recipients" 
                                body={recipientsTemplate}
                                style={{ width: '25%' }}
                            />
                            <Column 
                                field="status" 
                                header="Status" 
                                body={upcomingStatusTemplate}
                                style={{ width: '20%' }}
                            />
                            <Column 
                                body={actionTemplate}
                                style={{ width: '5%' }}
                            />
                        </DataTable>
                    )}
                </TabPanel>

                <TabPanel header="Active" leftIcon="pi pi-play-circle mr-2">
                    {loading ? (
                        <div>
                            <Skeleton width="100%" height="3rem" className="mb-2" />
                            <Skeleton width="100%" height="3rem" />
                        </div>
                    ) : (
                        <DataTable 
                            value={activeCampaigns} 
                            emptyMessage={emptyActiveMessage}
                            size="small"
                            stripedRows
                        >
                            <Column 
                                field="name" 
                                header="Campaign" 
                                body={activeNameTemplate}
                                style={{ width: '40%' }}
                            />
                            <Column 
                                header="Progress" 
                                body={progressTemplate}
                                style={{ width: '30%' }}
                            />
                            <Column 
                                field="status" 
                                header="Status" 
                                body={activeStatusTemplate}
                                style={{ width: '25%' }}
                            />
                            <Column 
                                body={actionTemplate}
                                style={{ width: '5%' }}
                            />
                        </DataTable>
                    )}
                </TabPanel>
            </TabView>

            {!loading && (upcomingCampaigns.length > 0 || activeCampaigns.length > 0) && (
                <div className="mt-3 text-center">
                    <Button 
                        label="View All Campaigns" 
                        icon="pi pi-arrow-right" 
                        iconPos="right"
                        link
                        size="small"
                    />
                </div>
            )}
        </Card>
    );
}
