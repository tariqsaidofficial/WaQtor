/**
 * Campaign Table Component
 * Advanced DataTable with lazy loading, filtering, and sorting
 */

import React from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { FilterMatchMode } from 'primereact/api';

interface Campaign {
    id: string;
    name: string;
    message: string;
    recipients: string[] | string;
    scheduledFrom?: Date | string;
    scheduledTo?: Date | string;
    status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'failed';
    createdAt?: Date | string;
    progress?: number;
    sent?: number;
    total?: number;
    agent?: string;
}

interface CampaignTableProps {
    campaigns: Campaign[];
    loading?: boolean;
    onEdit: (campaign: Campaign) => void;
    onDelete: (campaign: Campaign) => void;
    onExecute: (campaign: Campaign) => void;
    onRefresh: () => void;
}

export default function CampaignTable({
    campaigns,
    loading = false,
    onEdit,
    onDelete,
    onExecute
}: CampaignTableProps) {
    const [filters] = React.useState<DataTableFilterMeta>({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        agent: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    // Campaign Name Template
    const nameBodyTemplate = (rowData: Campaign) => {
        return (
            <div className="flex align-items-center gap-2">
                <i className="pi pi-megaphone text-primary"></i>
                <span className="font-semibold">{rowData.name}</span>
            </div>
        );
    };

    // Agent (Recipients) Template
    const agentBodyTemplate = (rowData: Campaign) => {
        const count = Array.isArray(rowData.recipients)
            ? rowData.recipients.length
            : rowData.recipients?.split('\n').filter((r: string) => r.trim()).length || 0;
        
        return (
            <div className="flex align-items-center gap-2">
                <i className="pi pi-users text-blue-500"></i>
                <span>{count} recipients</span>
            </div>
        );
    };

    // Scheduled From Template
    const scheduledFromBodyTemplate = (rowData: Campaign) => {
        if (!rowData.scheduledFrom) return <span className="text-500">-</span>;
        
        const date = new Date(rowData.scheduledFrom);
        return (
            <span className="text-700">
                {date.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
        );
    };

    // Scheduled To Template
    const scheduledToBodyTemplate = (rowData: Campaign) => {
        if (!rowData.scheduledTo) return <span className="text-500">-</span>;
        
        const date = new Date(rowData.scheduledTo);
        return (
            <span className="text-700">
                {date.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
        );
    };

    // Status Template
    const statusBodyTemplate = (rowData: Campaign) => {
        const getSeverity = (status: string): 'success' | 'info' | 'warning' | 'danger' | null => {
            switch (status) {
                case 'active':
                    return 'success';
                case 'completed':
                    return 'info';
                case 'scheduled':
                    return 'warning';
                case 'failed':
                    return 'danger';
                default:
                    return null;
            }
        };

        const getIcon = (status: string) => {
            switch (status) {
                case 'active':
                    return 'pi pi-spin pi-spinner';
                case 'completed':
                    return 'pi pi-check-circle';
                case 'scheduled':
                    return 'pi pi-clock';
                case 'paused':
                    return 'pi pi-pause';
                case 'failed':
                    return 'pi pi-times-circle';
                default:
                    return 'pi pi-file';
            }
        };

        return (
            <Tag 
                value={rowData.status.toUpperCase()} 
                severity={getSeverity(rowData.status)} 
                icon={getIcon(rowData.status)}
            />
        );
    };

    // Progress Template
    const progressBodyTemplate = (rowData: Campaign) => {
        if (rowData.status !== 'active' && rowData.status !== 'completed') {
            return <span className="text-500">-</span>;
        }

        const progress = rowData.progress || 0;
        const sent = rowData.sent || 0;
        const total = rowData.total || 0;

        return (
            <div className="flex flex-column gap-2">
                <ProgressBar 
                    value={progress} 
                    showValue={false}
                    style={{ height: '8px' }}
                    color={progress === 100 ? '#10b981' : '#3b82f6'}
                />
                <small className="text-600">
                    {sent} / {total} ({progress}%)
                </small>
            </div>
        );
    };

    // Actions Template
    const actionsBodyTemplate = (rowData: Campaign) => {
        const canExecute = rowData.status !== 'active' && rowData.status !== 'completed';
        const canPause = rowData.status === 'active';

        return (
            <div className="flex gap-1">
                <Button
                    icon="pi pi-eye"
                    rounded
                    text
                    severity="info"
                    size="small"
                    onClick={() => onEdit(rowData)}
                    tooltip="View Details"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="warning"
                    size="small"
                    onClick={() => onEdit(rowData)}
                    disabled={rowData.status === 'active' || rowData.status === 'completed'}
                    tooltip="Edit"
                    tooltipOptions={{ position: 'top' }}
                />
                {canExecute && (
                    <Button
                        icon="pi pi-play"
                        rounded
                        text
                        severity="success"
                        size="small"
                        onClick={() => onExecute(rowData)}
                        tooltip="Execute"
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
                {canPause && (
                    <Button
                        icon="pi pi-pause"
                        rounded
                        text
                        severity="warning"
                        size="small"
                        tooltip="Pause"
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
                <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    size="small"
                    onClick={() => onDelete(rowData)}
                    disabled={rowData.status === 'active'}
                    tooltip="Delete"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    return (
        <DataTable 
            value={campaigns} 
            lazy 
            filterDisplay="row" 
            dataKey="id" 
            paginator
            rows={10} 
            rowsPerPageOptions={[5, 10, 25, 50]}
            filters={filters} 
            loading={loading} 
            tableStyle={{ minWidth: '75rem' }}
            emptyMessage="No campaigns found"
            stripedRows
        >
            <Column 
                field="name" 
                header="Campaign Name" 
                sortable 
                filter 
                filterPlaceholder="Search by name"
                body={nameBodyTemplate}
                style={{ minWidth: '200px' }}
            />
            <Column 
                field="agent" 
                header="Agent (Recipients)" 
                sortable 
                filter 
                filterPlaceholder="Search"
                body={agentBodyTemplate}
                style={{ minWidth: '150px' }}
            />
            <Column 
                field="scheduledFrom" 
                header="Scheduled From" 
                sortable
                body={scheduledFromBodyTemplate}
                style={{ minWidth: '180px' }}
            />
            <Column 
                field="scheduledTo" 
                header="Scheduled To" 
                sortable
                body={scheduledToBodyTemplate}
                style={{ minWidth: '180px' }}
            />
            <Column 
                field="status" 
                header="Status" 
                sortable 
                filter 
                filterPlaceholder="Search"
                body={statusBodyTemplate}
                style={{ minWidth: '130px' }}
            />
            <Column 
                field="progress" 
                header="Progress" 
                body={progressBodyTemplate}
                style={{ minWidth: '180px' }}
            />
            <Column 
                header="Actions" 
                body={actionsBodyTemplate}
                style={{ width: '200px' }}
                frozen
                alignFrozen="right"
            />
        </DataTable>
    );
}
