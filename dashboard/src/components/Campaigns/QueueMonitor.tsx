/**
 * Queue Monitor Component
 * Real-time monitoring of campaign message queue via WebSocket
 */

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Skeleton } from 'primereact/skeleton';
import { useWebSocket } from '../../hooks/useWebSocket';

interface QueueItem {
    id: string;
    campaignId: string;
    campaignName: string;
    recipient: string;
    message: string;
    status: 'pending' | 'processing' | 'sent' | 'failed' | 'delivered';
    timestamp: string;
    error?: string;
    retries?: number;
}

interface QueueStats {
    total: number;
    pending: number;
    processing: number;
    sent: number;
    failed: number;
    delivered: number;
}

export default function QueueMonitor() {
    const { isConnected, sendMessage } = useWebSocket();
    const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
    const [stats, setStats] = useState<QueueStats>({
        total: 0,
        pending: 0,
        processing: 0,
        sent: 0,
        failed: 0,
        delivered: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    // WebSocket connection for queue updates
    useEffect(() => {
        if (!isConnected) return;

        // Listen to global WebSocket for queue events
        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case 'queue_update':
                        if (data.data?.items) {
                            setQueueItems(data.data.items);
                            updateStats(data.data.items);
                        }
                        setIsLoading(false);
                        break;

                    case 'queue_item_update':
                        // Update single item
                        if (data.data) {
                            setQueueItems(prev => {
                                const index = prev.findIndex(item => item.id === data.data.id);
                                if (index !== -1) {
                                    const updated = [...prev];
                                    updated[index] = data.data;
                                    updateStats(updated);
                                    return updated;
                                } else {
                                    const updated = [data.data, ...prev];
                                    updateStats(updated);
                                    return updated;
                                }
                            });
                        }
                        break;

                    case 'queue_stats':
                        if (data.data) {
                            setStats(data.data);
                        }
                        break;

                    case 'message_sent':
                        // Update item status to sent
                        if (data.data?.messageId) {
                            setQueueItems(prev => 
                                prev.map(item => 
                                    item.id === data.data.messageId 
                                        ? { ...item, status: 'sent' }
                                        : item
                                )
                            );
                        }
                        break;

                    case 'message_delivered':
                        // Update item status to delivered
                        if (data.data?.messageId) {
                            setQueueItems(prev => 
                                prev.map(item => 
                                    item.id === data.data.messageId 
                                        ? { ...item, status: 'delivered' }
                                        : item
                                )
                            );
                        }
                        break;

                    case 'message_failed':
                        // Update item status to failed
                        if (data.data?.messageId) {
                            setQueueItems(prev => 
                                prev.map(item => 
                                    item.id === data.data.messageId 
                                        ? { ...item, status: 'failed', error: data.data.error }
                                        : item
                                )
                            );
                        }
                        break;
                }
            } catch (error) {
                console.error('Error parsing queue message:', error);
            }
        };

        if (window.waqtorWebSocket) {
            window.waqtorWebSocket.addEventListener('message', handleMessage);
            
            // Request initial queue state
            sendMessage({ type: 'get_queue' });
        }

        return () => {
            if (window.waqtorWebSocket) {
                window.waqtorWebSocket.removeEventListener('message', handleMessage);
            }
        };
    }, [isConnected, sendMessage]);

    const updateStats = (items: QueueItem[]) => {
        const newStats = {
            total: items.length,
            pending: items.filter(i => i.status === 'pending').length,
            processing: items.filter(i => i.status === 'processing').length,
            sent: items.filter(i => i.status === 'sent').length,
            failed: items.filter(i => i.status === 'failed').length,
            delivered: items.filter(i => i.status === 'delivered').length
        };
        setStats(newStats);
    };

    const handleRefresh = () => {
        setIsLoading(true);
        sendMessage({ type: 'get_queue' });
    };

    // Status Badge Template
    const statusBodyTemplate = (rowData: QueueItem) => {
        const getSeverity = (status: string) => {
            switch (status) {
                case 'delivered':
                    return 'success';
                case 'sent':
                    return 'info';
                case 'processing':
                    return 'warning';
                case 'failed':
                    return 'danger';
                default:
                    return 'secondary';
            }
        };

        const getIcon = (status: string) => {
            switch (status) {
                case 'delivered':
                    return 'pi pi-check-circle';
                case 'sent':
                    return 'pi pi-send';
                case 'processing':
                    return 'pi pi-spin pi-spinner';
                case 'failed':
                    return 'pi pi-times-circle';
                default:
                    return 'pi pi-clock';
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

    // Recipient Template
    const recipientBodyTemplate = (rowData: QueueItem) => {
        return (
            <div className="flex align-items-center gap-2">
                <i className="pi pi-phone text-blue-500"></i>
                <span className="font-mono">{rowData.recipient}</span>
            </div>
        );
    };

    // Timestamp Template
    const timestampBodyTemplate = (rowData: QueueItem) => {
        const date = new Date(rowData.timestamp);
        return (
            <span className="text-sm text-600">
                {date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                })}
            </span>
        );
    };

    // Message Preview Template
    const messageBodyTemplate = (rowData: QueueItem) => {
        const preview = rowData.message.length > 50 
            ? rowData.message.substring(0, 50) + '...'
            : rowData.message;
        
        return (
            <span className="text-sm text-700" title={rowData.message}>
                {preview}
            </span>
        );
    };

    // Stats Card
    const StatCard = ({ icon, label, value, color }: any) => (
        <div className="flex align-items-center gap-3 p-3 border-round surface-100">
            <div 
                className={`flex align-items-center justify-content-center border-round`}
                style={{ 
                    width: '3rem', 
                    height: '3rem',
                    backgroundColor: `var(--${color}-100)`,
                    color: `var(--${color}-700)`
                }}
            >
                <i className={`${icon} text-xl`}></i>
            </div>
            <div className="flex-1">
                <div className="text-500 text-xs mb-1">{label}</div>
                <div className="text-900 font-bold text-xl">
                    {isLoading ? <Skeleton width="3rem" height="1.5rem" /> : value}
                </div>
            </div>
        </div>
    );

    // Calculate progress percentage
    const progressPercentage = stats.total > 0 
        ? Math.round(((stats.sent + stats.delivered + stats.failed) / stats.total) * 100)
        : 0;

    return (
        <div className="grid">
            {/* Header */}
            <div className="col-12">
                <Card>
                    <div className="flex justify-content-between align-items-center">
                        <div className="flex align-items-center gap-3">
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-list text-primary text-2xl"></i>
                                <h2 className="text-2xl font-bold m-0">Queue Monitor</h2>
                            </div>
                            <Badge 
                                value={isConnected ? 'LIVE' : 'OFFLINE'} 
                                severity={isConnected ? 'success' : 'danger'}
                            />
                        </div>
                        <Button
                            icon="pi pi-refresh"
                            rounded
                            text
                            onClick={handleRefresh}
                            loading={isLoading}
                            tooltip="Refresh Queue"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </div>
                </Card>
            </div>

            {/* Stats Cards */}
            <div className="col-12 md:col-6 lg:col-2">
                <StatCard
                    icon="pi pi-inbox"
                    label="Total"
                    value={stats.total}
                    color="blue"
                />
            </div>
            <div className="col-12 md:col-6 lg:col-2">
                <StatCard
                    icon="pi pi-clock"
                    label="Pending"
                    value={stats.pending}
                    color="gray"
                />
            </div>
            <div className="col-12 md:col-6 lg:col-2">
                <StatCard
                    icon="pi pi-spin pi-spinner"
                    label="Processing"
                    value={stats.processing}
                    color="orange"
                />
            </div>
            <div className="col-12 md:col-6 lg:col-2">
                <StatCard
                    icon="pi pi-send"
                    label="Sent"
                    value={stats.sent}
                    color="blue"
                />
            </div>
            <div className="col-12 md:col-6 lg:col-2">
                <StatCard
                    icon="pi pi-check-circle"
                    label="Delivered"
                    value={stats.delivered}
                    color="green"
                />
            </div>
            <div className="col-12 md:col-6 lg:col-2">
                <StatCard
                    icon="pi pi-times-circle"
                    label="Failed"
                    value={stats.failed}
                    color="red"
                />
            </div>

            {/* Progress Bar */}
            {stats.total > 0 && (
                <div className="col-12">
                    <Card>
                        <div className="flex align-items-center gap-3">
                            <div className="flex-1">
                                <div className="flex justify-content-between mb-2">
                                    <span className="font-semibold">Overall Progress</span>
                                    <span className="text-600">{progressPercentage}%</span>
                                </div>
                                <ProgressBar 
                                    value={progressPercentage}
                                    showValue={false}
                                    style={{ height: '12px' }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Queue Table */}
            <div className="col-12">
                <Card>
                    <DataTable
                        value={queueItems}
                        loading={isLoading}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        emptyMessage="No messages in queue"
                        className="p-datatable-sm"
                        stripedRows
                        showGridlines
                        responsiveLayout="scroll"
                    >
                        <Column 
                            field="campaignName" 
                            header="Campaign" 
                            sortable
                            style={{ minWidth: '150px' }}
                            body={(rowData) => (
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-megaphone text-primary"></i>
                                    <span className="font-semibold">{rowData.campaignName}</span>
                                </div>
                            )}
                        />
                        <Column
                            field="recipient"
                            header="Recipient"
                            body={recipientBodyTemplate}
                            sortable
                            style={{ minWidth: '150px' }}
                        />
                        <Column
                            field="message"
                            header="Message"
                            body={messageBodyTemplate}
                            style={{ minWidth: '200px' }}
                        />
                        <Column
                            field="status"
                            header="Status"
                            body={statusBodyTemplate}
                            sortable
                            style={{ minWidth: '120px' }}
                        />
                        <Column
                            field="timestamp"
                            header="Time"
                            body={timestampBodyTemplate}
                            sortable
                            style={{ minWidth: '100px' }}
                        />
                        <Column
                            field="retries"
                            header="Retries"
                            body={(rowData) => (
                                rowData.retries ? (
                                    <Badge value={rowData.retries} severity="warning" />
                                ) : (
                                    <span className="text-500">-</span>
                                )
                            )}
                            style={{ width: '80px' }}
                        />
                    </DataTable>
                </Card>
            </div>
        </div>
    );
}
