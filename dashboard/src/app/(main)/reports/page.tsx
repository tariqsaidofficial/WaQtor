'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import './reports.css';

interface ReportData {
    totalMessages: number;
    sentMessages: number;
    deliveredMessages: number;
    readMessages: number;
    failedMessages: number;
    campaignSuccessRate: number;
    dailyVolume: Array<{
        date: string;
        sent: number;
        delivered: number;
        read: number;
        failed: number;
    }>;
    topCampaigns: Array<{
        id: string;
        name: string;
        sent: number;
        delivered: number;
        successRate: number;
    }>;
}

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [dateRange, setDateRange] = useState<Date[]>([
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        new Date()
    ]);
    const [reportType, setReportType] = useState('overview');
    const [chartType, setChartType] = useState('line');

    const reportTypes = [
        { label: 'Overview', value: 'overview' },
        { label: 'Campaigns', value: 'campaigns' },
        { label: 'Messages', value: 'messages' },
        { label: 'SmartBot', value: 'smartbot' }
    ];

    const chartTypes = [
        { label: 'Line Chart', value: 'line' },
        { label: 'Bar Chart', value: 'bar' },
        { label: 'Area Chart', value: 'area' }
    ];

    useEffect(() => {
        fetchReportData();
    }, [dateRange, reportType]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const startDate = dateRange[0]?.toISOString();
            const endDate = dateRange[1]?.toISOString();
            
            const response = await fetch(
                `/api/reports?type=${reportType}&startDate=${startDate}&endDate=${endDate}`
            );
            
            if (response.ok) {
                const data = await response.json();
                setReportData(data);
            }
        } catch (error) {
            console.error('Failed to fetch report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!reportData) return;

        const csvData = [
            ['Date', 'Sent', 'Delivered', 'Read', 'Failed'],
            ...reportData.dailyVolume.map(day => [
                day.date,
                day.sent,
                day.delivered,
                day.read,
                day.failed
            ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const exportToPDF = async () => {
        try {
            const response = await fetch('/api/reports/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: reportType,
                    startDate: dateRange[0]?.toISOString(),
                    endDate: dateRange[1]?.toISOString()
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report-${new Date().toISOString().split('T')[0]}.pdf`;
                a.click();
            }
        } catch (error) {
            console.error('Failed to export PDF:', error);
        }
    };

    const getChartData = () => {
        if (!reportData) return null;

        // Get colors from theme
        const documentStyle = getComputedStyle(document.documentElement);
        const labels = reportData.dailyVolume.map(day => day.date);
        const blueColor = documentStyle.getPropertyValue('--blue-500') || '#3B82F6';
        const greenColor = documentStyle.getPropertyValue('--green-500') || '#10B981';
        const purpleColor = documentStyle.getPropertyValue('--purple-500') || '#8B5CF6';
        const redColor = documentStyle.getPropertyValue('--red-500') || '#EF4444';

        return {
            labels,
            datasets: [
                {
                    label: 'Sent',
                    data: reportData.dailyVolume.map(day => day.sent),
                    borderColor: blueColor,
                    backgroundColor: chartType === 'area' ? `${blueColor}33` : blueColor,
                    tension: 0.4,
                    fill: chartType === 'area'
                },
                {
                    label: 'Delivered',
                    data: reportData.dailyVolume.map(day => day.delivered),
                    borderColor: greenColor,
                    backgroundColor: chartType === 'area' ? `${greenColor}33` : greenColor,
                    tension: 0.4,
                    fill: chartType === 'area'
                },
                {
                    label: 'Read',
                    data: reportData.dailyVolume.map(day => day.read),
                    borderColor: purpleColor,
                    backgroundColor: chartType === 'area' ? `${purpleColor}33` : purpleColor,
                    tension: 0.4,
                    fill: chartType === 'area'
                },
                {
                    label: 'Failed',
                    data: reportData.dailyVolume.map(day => day.failed),
                    borderColor: redColor,
                    backgroundColor: chartType === 'area' ? `${redColor}33` : redColor,
                    tension: 0.4,
                    fill: chartType === 'area'
                }
            ]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    padding: 15
                }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    const successRateBodyTemplate = (rowData: any) => {
        const rate = rowData.successRate;
        const severity = rate >= 80 ? 'success' : rate >= 60 ? 'warning' : 'danger';
        return (
            <div className="flex align-items-center gap-2">
                <ProgressBar 
                    value={rate} 
                    showValue={false}
                    style={{ width: '100px', height: '8px' }}
                />
                <span className="font-semibold">{rate.toFixed(1)}%</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData: any) => {
        const rate = rowData.successRate;
        const severity = rate >= 80 ? 'success' : rate >= 60 ? 'warning' : 'danger';
        const label = rate >= 80 ? 'Excellent' : rate >= 60 ? 'Good' : 'Poor';
        return <Tag value={label} severity={severity} />;
    };

    return (
        <div className="reports-page">
            {/* Header */}
            <div className="reports-header mb-4">
                <div className="flex justify-content-between align-items-center">
                    <div>
                        <h1 className="text-3xl font-bold m-0 mb-2">
                            <i className="pi pi-chart-bar mr-2 text-primary"></i>
                            Reports & Analytics
                        </h1>
                        <p className="text-600 m-0">
                            Comprehensive analysis of your WhatsApp activity
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            label="Export CSV"
                            icon="pi pi-file-excel"
                            className="p-button-outlined"
                            onClick={exportToCSV}
                            disabled={!reportData}
                        />
                        <Button
                            label="Export PDF"
                            icon="pi pi-file-pdf"
                            className="p-button-outlined p-button-danger"
                            onClick={exportToPDF}
                            disabled={!reportData}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-5">
                    <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
                    <p className="mt-3 text-600">Loading report data...</p>
                </div>
            ) : reportData ? (
                <>
                    {/* Stats Cards */}
                    <div className="grid mb-4">
                        <div className="col-12 md:col-6 lg:col-3">
                            <Card className="stat-card">
                                <div className="flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-500 mb-2">Total Messages</div>
                                        <div className="text-3xl font-bold text-900">
                                            {reportData.totalMessages.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="stat-icon bg-blue-100 text-blue-600">
                                        <i className="pi pi-send text-3xl"></i>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <Card className="stat-card">
                                <div className="flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-500 mb-2">Delivered</div>
                                        <div className="text-3xl font-bold text-green-600">
                                            {reportData.deliveredMessages.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="stat-icon bg-green-100 text-green-600">
                                        <i className="pi pi-check-circle text-3xl"></i>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <Card className="stat-card">
                                <div className="flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-500 mb-2">Read</div>
                                        <div className="text-3xl font-bold text-purple-600">
                                            {reportData.readMessages.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="stat-icon bg-purple-100 text-purple-600">
                                        <i className="pi pi-eye text-3xl"></i>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <Card className="stat-card">
                                <div className="flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-500 mb-2">Success Rate</div>
                                        <div className="text-3xl font-bold text-cyan-600">
                                            {reportData.campaignSuccessRate.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="stat-icon bg-cyan-100 text-cyan-600">
                                        <i className="pi pi-chart-line text-3xl"></i>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </>
            ) : null}

            {/* Filters */}
            <Card className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-4">
                        <label className="block mb-2 font-semibold">
                            <i className="pi pi-calendar mr-2"></i>
                            Date Range
                        </label>
                        <Calendar
                            value={dateRange}
                            onChange={(e) => setDateRange(e.value as Date[])}
                            selectionMode="range"
                            readOnlyInput
                            showIcon
                            dateFormat="dd/mm/yy"
                            className="w-full"
                        />
                    </div>
                    <div className="col-12 md:col-4">
                        <label className="block mb-2 font-semibold">
                            <i className="pi pi-filter mr-2"></i>
                            Report Type
                        </label>
                        <Dropdown
                            value={reportType}
                            options={reportTypes}
                            onChange={(e) => setReportType(e.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="col-12 md:col-4">
                        <label className="block mb-2 font-semibold">
                            <i className="pi pi-chart-line mr-2"></i>
                            Chart Type
                        </label>
                        <Dropdown
                            value={chartType}
                            options={chartTypes}
                            onChange={(e) => setChartType(e.value)}
                            className="w-full"
                        />
                    </div>
                </div>
            </Card>

            {reportData && (
                <>
                    {/* Chart */}
                    <Card className="mb-4" title={<><i className="pi pi-chart-line mr-2"></i>Daily Message Volume</>}>
                        <div style={{ height: '400px' }}>
                            <Chart
                                type={chartType === 'area' ? 'line' : chartType}
                                data={getChartData()!}
                                options={chartOptions}
                            />
                        </div>
                    </Card>

                    {/* Top Campaigns Table */}
                    <Card title="🏆 Top Performing Campaigns">
                        <DataTable
                            value={reportData.topCampaigns}
                            paginator
                            rows={10}
                            emptyMessage="No campaigns found"
                            className="campaigns-table"
                        >
                            <Column field="name" header="Campaign Name" sortable />
                            <Column 
                                field="sent" 
                                header="Sent" 
                                sortable 
                                body={(rowData) => rowData.sent.toLocaleString()}
                            />
                            <Column 
                                field="delivered" 
                                header="Delivered" 
                                sortable 
                                body={(rowData) => rowData.delivered.toLocaleString()}
                            />
                            <Column 
                                field="successRate" 
                                header="Success Rate" 
                                sortable 
                                body={successRateBodyTemplate}
                            />
                            <Column 
                                header="Status" 
                                body={statusBodyTemplate}
                            />
                        </DataTable>
                    </Card>
                </>
            )}
        </div>
    );
}
