/**
 * Campaigns Page
 * Manage and schedule WhatsApp campaigns with advanced features
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Skeleton } from 'primereact/skeleton';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { campaignService } from '../api/services';
import { useWebSocket } from '../hooks/useWebSocket';
import CampaignTable from '../components/Campaigns/CampaignTable';
import NewCampaignDialog from '../components/Campaigns/NewCampaignDialog';

export default function Campaigns() {
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const { isConnected } = useWebSocket();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [uploadDialogVisible, setUploadDialogVisible] = useState(false);
    const [uploadedCampaigns, setUploadedCampaigns] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    
    // Queue Stats
    const [queueStats, setQueueStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        sent: 0,
        delivered: 0,
        failed: 0
    });

    useEffect(() => {
        loadCampaigns();
        
        // Listen to WebSocket for queue updates
        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'queue_stats' && data.data) {
                    setQueueStats(data.data);
                }
            } catch (error) {
                console.error('Error parsing queue message:', error);
            }
        };

        if (window.waqtorWebSocket) {
            window.waqtorWebSocket.addEventListener('message', handleMessage);
        }

        return () => {
            if (window.waqtorWebSocket) {
                window.waqtorWebSocket.removeEventListener('message', handleMessage);
            }
        };
    }, []);

    const loadCampaigns = async () => {
        setLoading(true);
        try {
            const data = await campaignService.list();
            setCampaigns(data.campaigns || []);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load campaigns',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setSelectedCampaign(null);
        setDialogVisible(true);
    };

    const openEdit = (campaign) => {
        setSelectedCampaign(campaign);
        setDialogVisible(true);
    };

    const saveCampaign = async (campaignData) => {
        try {
            if (selectedCampaign) {
                // Update existing
                await campaignService.updateStatus(selectedCampaign.id, campaignData.status);
            } else {
                // Create new
                await campaignService.create(campaignData);
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: selectedCampaign ? 'Campaign updated successfully' : 'Campaign created successfully',
                life: 3000
            });

            setDialogVisible(false);
            loadCampaigns();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to save campaign',
                life: 3000
            });
            throw error;
        }
    };

    const deleteCampaign = async (campaign) => {
        confirmDialog({
            message: `Are you sure you want to delete "${campaign.name}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await campaignService.delete(campaign.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Campaign deleted successfully',
                        life: 3000
                    });
                    loadCampaigns();
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete campaign',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleCampaignFileUpload = (event) => {
        const files = event.files;
        setUploadedCampaigns(files);
        let size = 0;
        files.forEach(f => size += f.size);
        setTotalSize(size);

        // قراءة ملف CSV ومعالجته
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvText = e.target.result;
                    const lines = csvText.split('\n').filter(line => line.trim());
                    
                    // تخطي السطر الأول (العناوين)
                    const campaignsData = [];
                    for (let i = 1; i < lines.length; i++) {
                        const columns = lines[i].split(',').map(col => col.trim());
                        if (columns.length >= 5) {
                            const campaign = {
                                name: columns[0],
                                message: columns[1],
                                recipients: columns[2].split(';').map(r => r.trim()),
                                status: columns[3] || 'draft',
                                delay: parseInt(columns[4]) || 1000,
                                scheduledFrom: columns[5] || null,
                                scheduledTo: columns[6] || null
                            };
                            campaignsData.push(campaign);
                        }
                    }

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Loaded ${campaignsData.length} campaign(s) from CSV`,
                        life: 3000
                    });

                    // يمكن هنا حفظ الحملات
                    console.log('Campaigns loaded:', campaignsData);
                    
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Invalid CSV file format',
                        life: 3000
                    });
                }
            };
            reader.readAsText(file);
        }
    };

    const downloadCampaignTemplate = () => {
        const template = `Campaign Name,Message,Recipients (separated by ;),Status,Delay (ms),Scheduled From,Scheduled To
Summer Sale 2025,Special offer! 50% discount on all products,966501234567;966507654321;966509876543,draft,1000,2025-06-01T09:00:00,2025-06-30T18:00:00
Ramadan Greetings,Ramadan Kareem! Wishing you a blessed month,966501111111;966502222222,scheduled,2000,2025-03-01T08:00:00,2025-03-30T20:00:00
New Product Launch,Check out our new product line!,966503333333;966504444444,draft,1500,,`;

        const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'campaigns_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const executeCampaign = (campaign) => {
        confirmDialog({
            message: `Execute campaign "${campaign.name}" now?`,
            header: 'Confirm Execution',
            icon: 'pi pi-question-circle',
            acceptClassName: 'p-button-success',
            accept: async () => {
                try {
                    await campaignService.execute(campaign.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Campaign execution started',
                        life: 3000
                    });
                    loadCampaigns();
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to execute campaign',
                        life: 3000
                    });
                }
            }
        });
    };

    // Calculate campaign stats
    const campaignStats = {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'active').length,
        scheduled: campaigns.filter(c => c.status === 'scheduled').length,
        completed: campaigns.filter(c => c.status === 'completed').length
    };

    // Stat Card Component
    const StatCard = ({ icon, label, value, color, isLoading }) => (
        <div className="surface-100 border-round p-3">
            <div className="flex align-items-center justify-content-between">
                <div>
                    <span className="text-500 text-sm">{label}</span>
                    <div className="text-900 font-bold text-2xl mt-1">
                        {isLoading ? <Skeleton width="3rem" height="2rem" /> : value}
                    </div>
                </div>
                <div className={`bg-${color}-100 border-round p-3`}>
                    <i className={`${icon} text-${color}-700 text-2xl`}></i>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid">
            <style>{`
                @keyframes pulse-green {
                    0%, 100% {
                        box-shadow: 0 0 4px 1px rgba(34, 197, 94, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 6px 2px rgba(34, 197, 94, 0.6);
                    }
                }
            `}</style>
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Header */}
            <div className="col-12">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold m-0 mb-2">
                                <i className="pi pi-megaphone mr-2 text-primary"></i>
                                Campaigns
                            </h1>
                            <p className="text-600 m-0">
                                Create, manage and monitor WhatsApp campaigns
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                label="Upload Campaigns"
                                icon="pi pi-upload"
                                onClick={() => setUploadDialogVisible(true)}
                                className="p-button-lg p-button-outlined"
                            />
                            <Button
                                label="New Campaign"
                                icon="pi pi-plus"
                                onClick={openNew}
                                className="p-button-lg"
                            />
                        </div>
                    </div>

                    {/* Campaign Stats */}
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold mb-3 text-700">
                            <i className="pi pi-chart-bar mr-2"></i>
                            Campaign Statistics
                        </h3>
                        <div className="grid">
                            <div className="col-12 md:col-3">
                                <StatCard
                                    icon="pi pi-chart-bar"
                                    label="Total Campaigns"
                                    value={campaignStats.total}
                                    color="blue"
                                    isLoading={loading}
                                />
                            </div>
                            <div className="col-12 md:col-3">
                                <StatCard
                                    icon="pi pi-spin pi-spinner"
                                    label="Active"
                                    value={campaignStats.active}
                                    color="green"
                                    isLoading={loading}
                                />
                            </div>
                            <div className="col-12 md:col-3">
                                <StatCard
                                    icon="pi pi-clock"
                                    label="Scheduled"
                                    value={campaignStats.scheduled}
                                    color="orange"
                                    isLoading={loading}
                                />
                            </div>
                            <div className="col-12 md:col-3">
                                <StatCard
                                    icon="pi pi-check-circle"
                                    label="Completed"
                                    value={campaignStats.completed}
                                    color="cyan"
                                    isLoading={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Queue Monitor Stats */}
                    <div>
                        <div className="flex align-items-center justify-content-between mb-3">
                            <h3 className="text-lg font-semibold m-0 text-700">
                                <i className="pi pi-list mr-2"></i>
                                Queue Monitor
                            </h3>
                            <div className="flex align-items-center gap-2">
                                <span 
                                    className={`inline-block border-circle ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ 
                                        width: '8px', 
                                        height: '8px',
                                        boxShadow: isConnected ? '0 0 4px 1px rgba(34, 197, 94, 0.4)' : 'none',
                                        animation: isConnected ? 'pulse-green 2s ease-in-out infinite' : 'none'
                                    }}
                                ></span>
                                <span className="text-sm text-600 font-semibold">{isConnected ? 'Live' : 'Offline'}</span>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-12 md:col-2">
                                <StatCard
                                    icon="pi pi-inbox"
                                    label="Total"
                                    value={queueStats.total}
                                    color="blue"
                                    isLoading={false}
                                />
                            </div>
                            <div className="col-12 md:col-2">
                                <StatCard
                                    icon="pi pi-clock"
                                    label="Pending"
                                    value={queueStats.pending}
                                    color="gray"
                                    isLoading={false}
                                />
                            </div>
                            <div className="col-12 md:col-2">
                                <StatCard
                                    icon="pi pi-spin pi-spinner"
                                    label="Processing"
                                    value={queueStats.processing}
                                    color="orange"
                                    isLoading={false}
                                />
                            </div>
                            <div className="col-12 md:col-2">
                                <StatCard
                                    icon="pi pi-send"
                                    label="Sent"
                                    value={queueStats.sent}
                                    color="blue"
                                    isLoading={false}
                                />
                            </div>
                            <div className="col-12 md:col-2">
                                <StatCard
                                    icon="pi pi-check-circle"
                                    label="Delivered"
                                    value={queueStats.delivered}
                                    color="green"
                                    isLoading={false}
                                />
                            </div>
                            <div className="col-12 md:col-2">
                                <StatCard
                                    icon="pi pi-times-circle"
                                    label="Failed"
                                    value={queueStats.failed}
                                    color="red"
                                    isLoading={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaigns Table */}
            <div className="col-12">
                <div className="card">
                    <CampaignTable
                        campaigns={campaigns}
                        loading={loading}
                        onEdit={openEdit}
                        onDelete={deleteCampaign}
                        onExecute={executeCampaign}
                        onRefresh={loadCampaigns}
                    />
                </div>
            </div>

            {/* New/Edit Campaign Dialog */}
            <NewCampaignDialog
                visible={dialogVisible}
                campaign={selectedCampaign}
                onHide={() => setDialogVisible(false)}
                onSave={saveCampaign}
            />

            {/* Upload Campaigns Dialog */}
            <Dialog
                visible={uploadDialogVisible}
                style={{ width: '700px' }}
                header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-upload text-primary"></i>
                        <span>Upload Campaigns</span>
                    </div>
                }
                modal
                onHide={() => {
                    setUploadDialogVisible(false);
                    setUploadedCampaigns([]);
                    setTotalSize(0);
                }}
                footer={
                    <div className="flex justify-content-between align-items-center">
                        <Button
                            label="Download Template"
                            icon="pi pi-download"
                            outlined
                            onClick={downloadCampaignTemplate}
                        />
                        <Button
                            label="Close"
                            icon="pi pi-times"
                            text
                            onClick={() => {
                                setUploadDialogVisible(false);
                                setUploadedCampaigns([]);
                                setTotalSize(0);
                            }}
                        />
                    </div>
                }
            >
                <div className="flex flex-column gap-3">
                    <p className="text-600 m-0">
                        Upload a CSV file containing campaign configurations. Download the template below to see the required format.
                    </p>

                    <Tooltip target=".custom-upload-choose" content="Choose File" position="bottom" />
                    <Tooltip target=".custom-upload-cancel" content="Clear" position="bottom" />

                    <FileUpload
                        ref={fileUploadRef}
                        name="campaigns[]"
                        accept=".csv"
                        maxFileSize={5000000}
                        onSelect={handleCampaignFileUpload}
                        onClear={() => {
                            setUploadedCampaigns([]);
                            setTotalSize(0);
                        }}
                        headerTemplate={(options) => {
                            const { className, chooseButton, cancelButton } = options;
                            const formattedValue = fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';
                            return (
                                <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                                    {chooseButton}
                                    {cancelButton}
                                    {totalSize > 0 && (
                                        <div className="flex align-items-center gap-3 ml-auto">
                                            <span className="text-600">{formattedValue} / 5 MB</span>
                                            <ProgressBar 
                                                value={(totalSize / 50000)} 
                                                showValue={false} 
                                                style={{ width: '10rem', height: '10px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                        itemTemplate={(file, props) => (
                            <div className="flex align-items-center justify-content-between p-3 surface-50 border-round mb-2">
                                <div className="flex align-items-center gap-3">
                                    <i className="pi pi-file-excel text-green-600" style={{ fontSize: '2.5rem' }}></i>
                                    <div>
                                        <div className="font-semibold text-900">{file.name}</div>
                                        <small className="text-500">{new Date().toLocaleDateString()}</small>
                                    </div>
                                </div>
                                <Tag value={props.formatSize} severity="success" />
                            </div>
                        )}
                        emptyTemplate={() => (
                            <div className="flex align-items-center flex-column p-5">
                                <i className="pi pi-cloud-upload text-6xl text-400 mb-4"></i>
                                <span className="text-700 font-semibold text-xl mb-2">Drag and Drop CSV File</span>
                                <span className="text-600">or click to browse</span>
                                <small className="text-500 mt-3">Supported: .csv (Max 5MB)</small>
                            </div>
                        )}
                        chooseOptions={{ 
                            icon: 'pi pi-file-excel', 
                            iconOnly: false,
                            label: 'Choose CSV File',
                            className: 'custom-upload-choose p-button-rounded p-button-outlined' 
                        }}
                        cancelOptions={{ 
                            icon: 'pi pi-times', 
                            iconOnly: true, 
                            className: 'custom-upload-cancel p-button-danger p-button-rounded p-button-outlined p-button-sm' 
                        }}
                    />

                    <div className="surface-100 border-round p-3">
                        <div className="flex align-items-start gap-2">
                            <i className="pi pi-info-circle text-blue-500 mt-1"></i>
                            <div className="flex-1">
                                <div className="font-semibold text-900 mb-2">CSV Format Example:</div>
                                <div className="text-sm text-600 mb-2">
                                    The CSV file should have the following columns:
                                </div>
                                <div className="surface-50 border-round p-3 mb-2">
                                    <div className="grid text-sm">
                                        <div className="col-12 md:col-6">
                                            <div className="flex align-items-center gap-2 mb-2">
                                                <i className="pi pi-check-circle text-green-500"></i>
                                                <span className="font-semibold">Campaign Name</span>
                                            </div>
                                            <div className="flex align-items-center gap-2 mb-2">
                                                <i className="pi pi-check-circle text-green-500"></i>
                                                <span className="font-semibold">Message</span>
                                            </div>
                                            <div className="flex align-items-center gap-2 mb-2">
                                                <i className="pi pi-check-circle text-green-500"></i>
                                                <span className="font-semibold">Recipients</span>
                                                <small className="text-500">(separated by ;)</small>
                                            </div>
                                        </div>
                                        <div className="col-12 md:col-6">
                                            <div className="flex align-items-center gap-2 mb-2">
                                                <i className="pi pi-check-circle text-green-500"></i>
                                                <span className="font-semibold">Status</span>
                                                <small className="text-500">(draft/scheduled)</small>
                                            </div>
                                            <div className="flex align-items-center gap-2 mb-2">
                                                <i className="pi pi-check-circle text-green-500"></i>
                                                <span className="font-semibold">Delay (ms)</span>
                                            </div>
                                            <div className="flex align-items-center gap-2 mb-2">
                                                <i className="pi pi-check-circle text-green-500"></i>
                                                <span className="font-semibold">Scheduled From/To</span>
                                                <small className="text-500">(optional)</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex align-items-center gap-2 p-2 bg-blue-50 border-round">
                                    <i className="pi pi-download text-blue-600"></i>
                                    <span className="text-sm text-blue-900">
                                        Click "Download Template" below to get a sample CSV file with examples
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
