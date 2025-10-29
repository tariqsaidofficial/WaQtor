/**
 * New Campaign Dialog Component
 * Advanced form for creating and editing campaigns
 */

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { Chip } from 'primereact/chip';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';

interface Campaign {
    id?: string;
    name: string;
    message: string;
    recipients: string[] | string;
    scheduledFrom?: Date | string | null;
    scheduledTo?: Date | string | null;
    status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'failed';
    delay?: number;
    randomDelay?: boolean;
    minDelay?: number;
    maxDelay?: number;
    agent?: string;
}

interface NewCampaignDialogProps {
    visible: boolean;
    campaign?: Campaign | null;
    onHide: () => void;
    onSave: (campaignData: Campaign) => Promise<void>;
}

export default function NewCampaignDialog({
    visible,
    campaign,
    onHide,
    onSave
}: NewCampaignDialogProps) {
    const toast = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    
    const [formData, setFormData] = useState<Campaign>({
        name: '',
        message: '',
        recipients: '',
        scheduledFrom: null,
        scheduledTo: null,
        status: 'draft',
        delay: 1000,
        randomDelay: false,
        minDelay: 500,
        maxDelay: 2000,
        agent: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [recipientCount, setRecipientCount] = useState(0);

    useEffect(() => {
        if (campaign) {
            setFormData({
                ...campaign,
                recipients: Array.isArray(campaign.recipients)
                    ? campaign.recipients.join('\n')
                    : campaign.recipients,
                scheduledFrom: campaign.scheduledFrom ? new Date(campaign.scheduledFrom) : null,
                scheduledTo: campaign.scheduledTo ? new Date(campaign.scheduledTo) : null
            });
        } else {
            setFormData({
                name: '',
                message: '',
                recipients: '',
                scheduledFrom: null,
                scheduledTo: null,
                status: 'draft',
                delay: 1000,
                randomDelay: false,
                minDelay: 500,
                maxDelay: 2000,
                agent: ''
            });
        }
        setErrors({});
        setActiveTab(0);
    }, [campaign, visible]);

    // Update recipient count
    useEffect(() => {
        if (typeof formData.recipients === 'string') {
            const count = formData.recipients
                .split('\n')
                .filter(r => r.trim().length > 0)
                .length;
            setRecipientCount(count);
        }
    }, [formData.recipients]);

    const statusOptions = [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' }
    ];

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Campaign name is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        if (!formData.recipients || recipientCount === 0) {
            newErrors.recipients = 'At least one recipient is required';
        }

        if (formData.status === 'scheduled' && !formData.scheduledFrom) {
            newErrors.scheduledFrom = 'Schedule start date is required for scheduled campaigns';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const confirmSave = () => {
        if (!validateForm()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill all required fields',
                life: 3000
            });
            return;
        }

        confirmDialog({
            message: `Are you sure you want to ${campaign ? 'update' : 'create'} this campaign with ${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}?`,
            header: 'Confirm Campaign',
            icon: 'pi pi-exclamation-triangle',
            accept: handleSave,
            acceptLabel: campaign ? 'Update' : 'Create',
            rejectLabel: 'Cancel',
            acceptClassName: 'p-button-success',
            rejectClassName: 'p-button-outlined'
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const recipientsList = typeof formData.recipients === 'string'
                ? formData.recipients.split('\n').map(r => r.trim()).filter(r => r.length > 0)
                : formData.recipients;

            const campaignData: Campaign = {
                ...formData,
                recipients: recipientsList
            };

            await onSave(campaignData);
            
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: campaign ? 'Campaign updated successfully' : 'Campaign created successfully',
                life: 3000
            });
            
            onHide();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to save campaign',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (event: any) => {
        const file = event.files[0];
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
            const text = e.target.result;
            const lines = text.split('\n').filter((line: string) => line.trim());
            setFormData({ ...formData, recipients: lines.join('\n') });
            
            toast.current?.show({
                severity: 'success',
                summary: 'File Uploaded',
                detail: `${lines.length} recipients loaded`,
                life: 3000
            });
        };
        
        reader.readAsText(file);
    };

    const dialogFooter = (
        <div className="flex justify-content-between align-items-center">
            <div className="flex align-items-center gap-2">
                <i className="pi pi-info-circle text-blue-500"></i>
                <span className="text-sm text-600">
                    {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="flex gap-2">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    text
                    onClick={onHide}
                    disabled={loading}
                />
                <Button
                    label={campaign ? 'Update' : 'Create'}
                    icon="pi pi-check"
                    onClick={confirmSave}
                    loading={loading}
                />
            </div>
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visible}
                style={{ width: '800px' }}
                header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-megaphone text-primary"></i>
                        <span>{campaign ? 'Edit Campaign' : 'New Campaign'}</span>
                    </div>
                }
                modal
                footer={dialogFooter}
                onHide={onHide}
                draggable={false}
                resizable={false}
            >
                <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)} className="mt-3">
                    {/* Basic Information Tab */}
                    <TabPanel 
                        header="Basic Info" 
                        leftIcon="pi pi-info-circle mr-2"
                    >
                        <div className="grid p-fluid">
                            {/* Campaign Name */}
                            <div className="col-12">
                                <label htmlFor="name" className="block mb-2 font-semibold">
                                    Campaign Name *
                                </label>
                                <InputText
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Summer Sale 2025"
                                    className={errors.name ? 'p-invalid' : ''}
                                    aria-describedby="name-help"
                                />
                                {errors.name ? (
                                    <small id="name-help" className="p-error">{errors.name}</small>
                                ) : (
                                    <small id="name-help" className="text-500">Enter a descriptive name for your campaign</small>
                                )}
                            </div>

                            {/* Message */}
                            <div className="col-12">
                                <label htmlFor="message" className="block mb-2 font-semibold">
                                    Message *
                                </label>
                                <InputTextarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Your campaign message..."
                                    rows={5}
                                    autoResize
                                    className={errors.message ? 'p-invalid' : ''}
                                    aria-describedby="message-help"
                                />
                                {errors.message ? (
                                    <small id="message-help" className="p-error">{errors.message}</small>
                                ) : (
                                    <small id="message-help" className="text-500">{formData.message.length} characters</small>
                                )}
                            </div>

                            {/* Status & Schedule */}
                            <div className="col-12 md:col-6">
                                <label htmlFor="status" className="block mb-2 font-semibold">
                                    Status
                                </label>
                                <Dropdown
                                    id="status"
                                    value={formData.status}
                                    options={statusOptions}
                                    onChange={(e) => setFormData({ ...formData, status: e.value })}
                                    optionLabel="label"
                                    placeholder="Select Status"
                                />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="scheduledFrom" className="block mb-2 font-semibold">
                                    Scheduled From {formData.status === 'scheduled' && '*'}
                                </label>
                                <Calendar
                                    id="scheduledFrom"
                                    value={formData.scheduledFrom as Date}
                                    onChange={(e) => setFormData({ ...formData, scheduledFrom: e.value })}
                                    showTime
                                    showIcon
                                    placeholder="Select start date/time"
                                    minDate={new Date()}
                                    className={errors.scheduledFrom ? 'p-invalid' : ''}
                                />
                                {errors.scheduledFrom && (
                                    <small className="p-error">{errors.scheduledFrom}</small>
                                )}
                            </div>
                            <div className="col-12 md:col-6">
                                <label htmlFor="scheduledTo" className="block mb-2 font-semibold">
                                    Scheduled To
                                </label>
                                <Calendar
                                    id="scheduledTo"
                                    value={formData.scheduledTo as Date}
                                    onChange={(e) => setFormData({ ...formData, scheduledTo: e.value })}
                                    showTime
                                    showIcon
                                    placeholder="Select end date/time"
                                    minDate={formData.scheduledFrom as Date || new Date()}
                                />
                            </div>
                        </div>
                    </TabPanel>

                    {/* Recipients Tab */}
                    <TabPanel 
                        header="Recipients" 
                        leftIcon="pi pi-users mr-2"
                    >
                        <div className="grid p-fluid">
                            <div className="col-12">
                                <Message 
                                    severity="info" 
                                    text="Enter phone numbers with country code (e.g., 966501234567), one per line"
                                    className="mb-3"
                                />
                            </div>

                            {/* Manual Entry */}
                            <div className="col-12">
                                <label htmlFor="recipients" className="block mb-2 font-semibold">
                                    Recipients * (one per line)
                                </label>
                                <InputTextarea
                                    id="recipients"
                                    value={formData.recipients as string}
                                    onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                                    placeholder="966501234567&#10;966507654321&#10;966509876543"
                                    rows={8}
                                    autoResize
                                    className={errors.recipients ? 'p-invalid' : ''}
                                    aria-describedby="recipients-help"
                                />
                                {errors.recipients ? (
                                    <small id="recipients-help" className="p-error">{errors.recipients}</small>
                                ) : (
                                    <small id="recipients-help" className="text-500">Enter phone numbers with country code, one per line</small>
                                )}
                            </div>

                            <div className="col-12">
                                <Divider align="center">
                                    <span className="text-sm text-500">OR</span>
                                </Divider>
                            </div>

                            {/* File Upload */}
                            <div className="col-12">
                                <label className="block mb-2 font-semibold">
                                    Upload Recipients File
                                </label>
                                <FileUpload
                                    mode="basic"
                                    name="recipients"
                                    accept=".txt,.csv"
                                    maxFileSize={1000000}
                                    onSelect={handleFileUpload}
                                    chooseLabel="Choose File (.txt, .csv)"
                                    className="w-full"
                                    auto
                                />
                                <small className="text-500 block mt-1">
                                    Supported formats: .txt, .csv (one number per line, max 1MB)
                                </small>
                            </div>

                            {/* Recipient Count */}
                            {recipientCount > 0 && (
                                <div className="col-12">
                                    <div className="surface-100 border-round p-3">
                                        <div className="flex align-items-center justify-content-between">
                                            <span className="text-600">Total Recipients:</span>
                                            <Chip 
                                                label={recipientCount.toString()} 
                                                icon="pi pi-users"
                                                className="bg-primary text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabPanel>

                    {/* Advanced Settings Tab */}
                    <TabPanel 
                        header="Advanced" 
                        leftIcon="pi pi-cog mr-2"
                    >
                        <div className="grid p-fluid">
                            <div className="col-12">
                                <Message 
                                    severity="info" 
                                    text="Configure message sending behavior and delays"
                                    className="mb-3"
                                />
                            </div>

                            {/* Random Delay */}
                            <div className="col-12">
                                <div className="flex align-items-center justify-content-between">
                                    <div>
                                        <label htmlFor="randomDelay" className="font-semibold block mb-1">
                                            Use Random Delay
                                        </label>
                                        <small className="text-500">
                                            Add random delays between messages to appear more natural
                                        </small>
                                    </div>
                                    <InputSwitch
                                        inputId="randomDelay"
                                        checked={formData.randomDelay || false}
                                        onChange={(e) => setFormData({ ...formData, randomDelay: e.value || false })}
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <Divider />
                            </div>

                            {/* Delay Settings */}
                            {!formData.randomDelay ? (
                                <div className="col-12">
                                    <label htmlFor="delay" className="block mb-2 font-semibold">
                                        Fixed Delay
                                    </label>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-clock"></i>
                                        </span>
                                        <InputNumber
                                            id="delay"
                                            value={formData.delay}
                                            onValueChange={(e) => setFormData({ ...formData, delay: e.value || 1000 })}
                                            min={100}
                                            max={10000}
                                            step={100}
                                        />
                                        <span className="p-inputgroup-addon">ms</span>
                                    </div>
                                    <small className="text-500 block mt-1">
                                        Delay between each message (recommended: 1000-3000ms)
                                    </small>
                                </div>
                            ) : (
                                <>
                                    <div className="col-12 md:col-6">
                                        <label htmlFor="minDelay" className="block mb-2 font-semibold">
                                            Min Delay
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-arrow-down"></i>
                                            </span>
                                            <InputNumber
                                                id="minDelay"
                                                value={formData.minDelay}
                                                onValueChange={(e) => setFormData({ ...formData, minDelay: e.value || 500 })}
                                                min={100}
                                                max={formData.maxDelay || 5000}
                                                step={100}
                                            />
                                            <span className="p-inputgroup-addon">ms</span>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <label htmlFor="maxDelay" className="block mb-2 font-semibold">
                                            Max Delay
                                        </label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-arrow-up"></i>
                                            </span>
                                            <InputNumber
                                                id="maxDelay"
                                                value={formData.maxDelay}
                                                onValueChange={(e) => setFormData({ ...formData, maxDelay: e.value || 2000 })}
                                                min={formData.minDelay || 500}
                                                max={10000}
                                                step={100}
                                            />
                                            <span className="p-inputgroup-addon">ms</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Estimated Time */}
                            <div className="col-12">
                                <div className="surface-100 border-round p-3">
                                    <div className="flex align-items-center gap-2 mb-2">
                                        <i className="pi pi-clock text-primary"></i>
                                        <span className="font-semibold">Estimated Time</span>
                                    </div>
                                    <span className="text-600">
                                        {recipientCount > 0 ? (
                                            <>
                                                Approximately {Math.ceil((recipientCount * (formData.delay || 1000)) / 60000)} minutes
                                                {formData.randomDelay && ' (may vary with random delays)'}
                                            </>
                                        ) : (
                                            'Add recipients to see estimate'
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </Dialog>
        </>
    );
}
