'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useRef } from 'react';
import ProtectedPage from '../../../../components/BlockUI/ProtectedPage';

interface Webhook {
    id: string;
    url: string;
    events: string[];
    secret: string;
    enabled: boolean;
    retryAttempts: number;
    retryDelay: number;
    createdAt: string;
}

const WEBHOOK_EVENTS = [
    { label: 'Message Received', value: 'message_received' },
    { label: 'Message Sent', value: 'message_sent' },
    { label: 'Campaign Executed', value: 'campaign_executed' },
    { label: 'Campaign Completed', value: 'campaign_completed' },
    { label: 'Client Connected', value: 'client_connected' },
    { label: 'Client Disconnected', value: 'client_disconnected' },
    { label: 'SmartBot Reply', value: 'smartbot_reply' },
    { label: 'Session QR', value: 'session_qr' },
];

function WebhooksContent() {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentWebhook, setCurrentWebhook] = useState<Partial<Webhook>>({
        url: '',
        events: [],
        secret: '',
        enabled: true,
        retryAttempts: 3,
        retryDelay: 1000,
    });
    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const fetchWebhooks = async () => {
        setLoading(true);
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

            const response = await fetch(`${apiUrl}/api/webhooks`, {
                headers: {
                    'X-API-Key': apiKey || '',
                },
            });

            const result = await response.json();
            if (result.success) {
                setWebhooks(result.data);
            }
        } catch (error) {
            console.error('Error fetching webhooks:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch webhooks',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

            const url = editMode
                ? `${apiUrl}/api/webhooks/${currentWebhook.id}`
                : `${apiUrl}/api/webhooks`;

            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'X-API-Key': apiKey || '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentWebhook),
            });

            const result = await response.json();

            if (result.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: editMode ? 'Webhook updated' : 'Webhook created',
                });
                setDialogVisible(false);
                fetchWebhooks();
                resetForm();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to save webhook',
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

            const response = await fetch(`${apiUrl}/api/webhooks/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-API-Key': apiKey || '',
                },
            });

            const result = await response.json();

            if (result.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Webhook deleted',
                });
                fetchWebhooks();
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete webhook',
            });
        }
    };

    const handleTest = async (id: string) => {
        try {
            const apiKey = localStorage.getItem('api_key') || process.env.NEXT_PUBLIC_API_KEY;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

            const response = await fetch(`${apiUrl}/api/webhooks/${id}/test`, {
                method: 'POST',
                headers: {
                    'X-API-Key': apiKey || '',
                },
            });

            const result = await response.json();

            if (result.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Test webhook sent',
                });
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to send test webhook',
            });
        }
    };

    const openNew = () => {
        resetForm();
        setEditMode(false);
        setDialogVisible(true);
    };

    const openEdit = (webhook: Webhook) => {
        setCurrentWebhook(webhook);
        setEditMode(true);
        setDialogVisible(true);
    };

    const resetForm = () => {
        setCurrentWebhook({
            url: '',
            events: [],
            secret: '',
            enabled: true,
            retryAttempts: 3,
            retryDelay: 1000,
        });
    };

    const confirmDelete = (id: string) => {
        confirmDialog({
            message: 'Are you sure you want to delete this webhook?',
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleDelete(id),
        });
    };

    const generateSecret = () => {
        const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        setCurrentWebhook({ ...currentWebhook, secret });
    };

    const statusBodyTemplate = (rowData: Webhook) => {
        return (
            <Tag
                value={rowData.enabled ? 'Enabled' : 'Disabled'}
                severity={rowData.enabled ? 'success' : 'danger'}
            />
        );
    };

    const eventsBodyTemplate = (rowData: Webhook) => {
        return <span>{rowData.events.length} events</span>;
    };

    const actionsBodyTemplate = (rowData: Webhook) => {
        return (
            <div className='flex gap-2'>
                <Button
                    icon='pi pi-pencil'
                    rounded
                    text
                    severity='info'
                    onClick={() => openEdit(rowData)}
                    tooltip='Edit'
                />
                <Button
                    icon='pi pi-send'
                    rounded
                    text
                    severity='success'
                    onClick={() => handleTest(rowData.id)}
                    tooltip='Test'
                />
                <Button
                    icon='pi pi-trash'
                    rounded
                    text
                    severity='danger'
                    onClick={() => confirmDelete(rowData.id)}
                    tooltip='Delete'
                />
            </div>
        );
    };

    return (
        <div className='grid'>
            <div className='col-12'>
                <Toast ref={toast} />
                <ConfirmDialog />

                <Card>
                    <div className='flex align-items-center justify-content-between mb-4'>
                        <div>
                            <h2 className='text-3xl font-bold text-900 m-0 mb-2'>Webhooks</h2>
                            <p className='text-600 m-0'>
                                Configure webhooks to receive real-time events from WaQtor
                            </p>
                        </div>
                        <Button
                            label='Add Webhook'
                            icon='pi pi-plus'
                            onClick={openNew}
                        />
                    </div>

                    <DataTable
                        value={webhooks}
                        loading={loading}
                        emptyMessage='No webhooks configured'
                        paginator
                        rows={10}
                    >
                        <Column field='url' header='URL' sortable />
                        <Column
                            field='events'
                            header='Events'
                            body={eventsBodyTemplate}
                        />
                        <Column
                            field='enabled'
                            header='Status'
                            body={statusBodyTemplate}
                            sortable
                        />
                        <Column
                            field='retryAttempts'
                            header='Retry Attempts'
                            sortable
                        />
                        <Column
                            header='Actions'
                            body={actionsBodyTemplate}
                            style={{ width: '150px' }}
                        />
                    </DataTable>
                </Card>

                {/* Add/Edit Dialog */}
                <Dialog
                    visible={dialogVisible}
                    style={{ width: '600px' }}
                    header={editMode ? 'Edit Webhook' : 'Add Webhook'}
                    modal
                    onHide={() => setDialogVisible(false)}
                >
                    <div className='flex flex-column gap-3'>
                        <div>
                            <label htmlFor='url' className='block mb-2 font-semibold'>
                                Webhook URL *
                            </label>
                            <InputText
                                id='url'
                                value={currentWebhook.url}
                                onChange={(e) =>
                                    setCurrentWebhook({ ...currentWebhook, url: e.target.value })
                                }
                                className='w-full'
                                placeholder='https://your-domain.com/webhook'
                            />
                        </div>

                        <div>
                            <label htmlFor='events' className='block mb-2 font-semibold'>
                                Events *
                            </label>
                            <MultiSelect
                                id='events'
                                value={currentWebhook.events}
                                onChange={(e) =>
                                    setCurrentWebhook({ ...currentWebhook, events: e.value })
                                }
                                options={WEBHOOK_EVENTS}
                                optionLabel='label'
                                optionValue='value'
                                placeholder='Select events'
                                className='w-full'
                                display='chip'
                            />
                        </div>

                        <div>
                            <label htmlFor='secret' className='block mb-2 font-semibold'>
                                Secret Key *
                            </label>
                            <div className='flex gap-2'>
                                <InputText
                                    id='secret'
                                    value={currentWebhook.secret}
                                    onChange={(e) =>
                                        setCurrentWebhook({ ...currentWebhook, secret: e.target.value })
                                    }
                                    className='flex-1'
                                    placeholder='Secret for HMAC signing'
                                />
                                <Button
                                    icon='pi pi-refresh'
                                    onClick={generateSecret}
                                    tooltip='Generate random secret'
                                />
                            </div>
                        </div>

                        <div className='grid'>
                            <div className='col-6'>
                                <label htmlFor='retryAttempts' className='block mb-2 font-semibold'>
                                    Retry Attempts
                                </label>
                                <InputNumber
                                    id='retryAttempts'
                                    value={currentWebhook.retryAttempts}
                                    onValueChange={(e) =>
                                        setCurrentWebhook({ ...currentWebhook, retryAttempts: e.value || 3 })
                                    }
                                    min={0}
                                    max={10}
                                    className='w-full'
                                />
                            </div>

                            <div className='col-6'>
                                <label htmlFor='retryDelay' className='block mb-2 font-semibold'>
                                    Retry Delay (ms)
                                </label>
                                <InputNumber
                                    id='retryDelay'
                                    value={currentWebhook.retryDelay}
                                    onValueChange={(e) =>
                                        setCurrentWebhook({ ...currentWebhook, retryDelay: e.value || 1000 })
                                    }
                                    min={100}
                                    step={100}
                                    className='w-full'
                                />
                            </div>
                        </div>

                        <div className='flex align-items-center gap-2'>
                            <InputSwitch
                                checked={currentWebhook.enabled || false}
                                onChange={(e) =>
                                    setCurrentWebhook({ ...currentWebhook, enabled: e.value })
                                }
                            />
                            <label className='font-semibold'>Enabled</label>
                        </div>

                        <div className='flex justify-content-end gap-2 mt-3'>
                            <Button
                                label='Cancel'
                                severity='secondary'
                                onClick={() => setDialogVisible(false)}
                            />
                            <Button
                                label={editMode ? 'Update' : 'Create'}
                                onClick={handleSave}
                                disabled={
                                    !currentWebhook.url ||
                                    !currentWebhook.events?.length ||
                                    !currentWebhook.secret
                                }
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default function WebhooksPage() {
    return (
        <ProtectedPage featureName="Webhooks">
            <WebhooksContent />
        </ProtectedPage>
    );
}
