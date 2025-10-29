/**
 * Error Management Page
 * Monitor and manage application errors
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { useToast } from '../components/ToastProvider';
import { errorService } from '../api/services';
import useErrorHandler from '../hooks/useErrorHandler';

export default function ErrorManagement() {
    const [errors, setErrors] = useState([]);
    const [stats, setStats] = useState(null);
    const [timeRange, setTimeRange] = useState('day');
    const [loading, setLoading] = useState(false);
    const [selectedError, setSelectedError] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    
    const { showSuccess } = useToast();
    const { handleError } = useErrorHandler();

    const timeRangeOptions = [
        { label: 'Last Hour', value: 'hour' },
        { label: 'Last Day', value: 'day' },
        { label: 'Last Week', value: 'week' }
    ];

    useEffect(() => {
        loadData();
        
        // Auto refresh every minute
        const interval = setInterval(loadData, 60000);
        return () => clearInterval(interval);
    }, [timeRange]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [errorsData, statsData] = await Promise.all([
                errorService.getRecent(20),
                errorService.getStats(timeRange)
            ]);
            
            setErrors(errorsData.errors || []);
            setStats(statsData);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = () => {
        confirmDialog({
            message: 'Are you sure you want to clear all error history? This action cannot be undone.',
            header: 'Clear Error History',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await errorService.clearHistory();
                    showSuccess('Error history cleared successfully');
                    loadData();
                } catch (error) {
                    handleError(error);
                }
            }
        });
    };

    const getChartData = () => {
        if (!stats || !stats.byCode) return null;

        const labels = Object.keys(stats.byCode);
        const data = Object.values(stats.byCode);

        return {
            labels,
            datasets: [
                {
                    label: 'Error Count',
                    data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderWidth: 1
                }
            ]
        };
    };

    const getSeverityTag = (statusCode) => {
        if (statusCode >= 500) {
            return <Tag severity="danger" value="Critical" />;
        } else if (statusCode >= 400) {
            return <Tag severity="warning" value="Warning" />;
        }
        return <Tag severity="info" value="Info" />;
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <code className="text-sm">{rowData.code}</code>
            </div>
        );
    };

    const timestampBodyTemplate = (rowData) => {
        return new Date(rowData.timestamp).toLocaleString();
    };

    const statusBodyTemplate = (rowData) => {
        return getSeverityTag(rowData.statusCode);
    };

    const actionsBodyTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-eye"
                className="p-button-sm p-button-text"
                onClick={() => {
                    setSelectedError(rowData);
                    setDetailsVisible(true);
                }}
                tooltip="View Details"
            />
        );
    };

    return (
        <div className="grid">
            <ConfirmDialog />
            
            {/* Header */}
            <div className="col-12">
                <div className="flex justify-content-between align-items-center mb-4">
                    <h1 className="text-3xl font-bold m-0">Error Management</h1>
                    <div className="flex gap-2">
                        <Dropdown
                            value={timeRange}
                            options={timeRangeOptions}
                            onChange={(e) => setTimeRange(e.value)}
                        />
                        <Button
                            icon="pi pi-refresh"
                            label="Refresh"
                            onClick={loadData}
                            loading={loading}
                        />
                        <Button
                            icon="pi pi-trash"
                            label="Clear History"
                            severity="danger"
                            onClick={handleClearHistory}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="col-12 md:col-4">
                <Card className="h-full">
                    <div className="flex justify-content-between align-items-start">
                        <div>
                            <div className="text-500 mb-2">Total Errors</div>
                            <div className="text-4xl font-bold text-900">
                                {stats?.total || 0}
                            </div>
                        </div>
                        <div className="bg-red-100 p-3 border-round">
                            <i className="pi pi-exclamation-circle text-red-500 text-3xl"></i>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-12 md:col-4">
                <Card className="h-full">
                    <div className="flex justify-content-between align-items-start">
                        <div>
                            <div className="text-500 mb-2">Error Types</div>
                            <div className="text-4xl font-bold text-900">
                                {stats?.byCode ? Object.keys(stats.byCode).length : 0}
                            </div>
                        </div>
                        <div className="bg-orange-100 p-3 border-round">
                            <i className="pi pi-list text-orange-500 text-3xl"></i>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-12 md:col-4">
                <Card className="h-full">
                    <div className="flex justify-content-between align-items-start">
                        <div>
                            <div className="text-500 mb-2">Time Range</div>
                            <div className="text-2xl font-bold text-900">
                                {timeRangeOptions.find(o => o.value === timeRange)?.label}
                            </div>
                        </div>
                        <div className="bg-blue-100 p-3 border-round">
                            <i className="pi pi-clock text-blue-500 text-3xl"></i>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Error Distribution Chart */}
            {stats?.byCode && Object.keys(stats.byCode).length > 0 && (
                <div className="col-12 md:col-6">
                    <Card title="Error Distribution by Code">
                        <Chart type="pie" data={getChartData()} />
                    </Card>
                </div>
            )}

            {/* Status Code Distribution */}
            {stats?.byStatusCode && Object.keys(stats.byStatusCode).length > 0 && (
                <div className="col-12 md:col-6">
                    <Card title="Status Code Distribution">
                        <Chart
                            type="bar"
                            data={{
                                labels: Object.keys(stats.byStatusCode),
                                datasets: [{
                                    label: 'Count',
                                    data: Object.values(stats.byStatusCode),
                                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                                }]
                            }}
                        />
                    </Card>
                </div>
            )}

            {/* Recent Errors Table */}
            <div className="col-12">
                <Card title="Recent Errors">
                    <DataTable
                        value={errors}
                        loading={loading}
                        paginator
                        rows={10}
                        emptyMessage="No errors found"
                        responsiveLayout="scroll"
                    >
                        <Column
                            field="timestamp"
                            header="Timestamp"
                            body={timestampBodyTemplate}
                            sortable
                        />
                        <Column
                            field="code"
                            header="Error Code"
                            body={codeBodyTemplate}
                            sortable
                        />
                        <Column
                            field="message"
                            header="Message"
                            sortable
                        />
                        <Column
                            field="statusCode"
                            header="Status"
                            body={statusBodyTemplate}
                            sortable
                        />
                        <Column
                            header="Actions"
                            body={actionsBodyTemplate}
                        />
                    </DataTable>
                </Card>
            </div>

            {/* Error Details Dialog */}
            <Dialog
                visible={detailsVisible}
                onHide={() => setDetailsVisible(false)}
                header="Error Details"
                style={{ width: '50vw' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            >
                {selectedError && (
                    <div>
                        <div className="mb-3">
                            <strong>Timestamp:</strong> {new Date(selectedError.timestamp).toLocaleString()}
                        </div>
                        <div className="mb-3">
                            <strong>Error Code:</strong> <code>{selectedError.code}</code>
                        </div>
                        <div className="mb-3">
                            <strong>Status Code:</strong> {selectedError.statusCode}
                        </div>
                        <div className="mb-3">
                            <strong>Message:</strong> {selectedError.message}
                        </div>
                        {selectedError.stack && (
                            <div className="mb-3">
                                <strong>Stack Trace:</strong>
                                <pre className="mt-2 p-3 bg-gray-100 border-round text-xs overflow-auto max-h-20rem">
                                    {selectedError.stack}
                                </pre>
                            </div>
                        )}
                        {selectedError.context && (
                            <div className="mb-3">
                                <strong>Context:</strong>
                                <pre className="mt-2 p-3 bg-gray-100 border-round text-xs overflow-auto">
                                    {JSON.stringify(selectedError.context, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </div>
    );
}
