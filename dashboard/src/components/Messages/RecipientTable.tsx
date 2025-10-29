/**
 * Recipient Table Component
 * Manage target phone numbers with CSV/JSON import
 */

import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { Chip } from 'primereact/chip';
import { Tag } from 'primereact/tag';

interface Recipient {
    id: string;
    phone: string;
    name?: string;
    custom1?: string;
    custom2?: string;
    status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
    messageId?: string;
}

interface RecipientTableProps {
    recipients: Recipient[];
    onRecipientsChange: (recipients: Recipient[]) => void;
}

export default function RecipientTable({ recipients, onRecipientsChange }: RecipientTableProps) {
    const toast = useRef<any>(null);
    const fileUploadRef = useRef<any>(null);
    
    const [dialogVisible, setDialogVisible] = useState(false);
    const [importDialogVisible, setImportDialogVisible] = useState(false);
    const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
    const [formData, setFormData] = useState({
        phone: '',
        name: '',
        custom1: '',
        custom2: ''
    });
    const [globalFilter, setGlobalFilter] = useState('');

    const openNew = () => {
        setEditingRecipient(null);
        setFormData({ phone: '', name: '', custom1: '', custom2: '' });
        setDialogVisible(true);
    };

    const openEdit = (recipient: Recipient) => {
        setEditingRecipient(recipient);
        setFormData({
            phone: recipient.phone,
            name: recipient.name || '',
            custom1: recipient.custom1 || '',
            custom2: recipient.custom2 || ''
        });
        setDialogVisible(true);
    };

    const handleSave = () => {
        if (!formData.phone.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Phone number is required',
                life: 3000
            });
            return;
        }

        if (editingRecipient) {
            // Update existing recipient
            const updated = recipients.map(r => 
                r.id === editingRecipient.id 
                    ? { ...r, ...formData }
                    : r
            );
            onRecipientsChange(updated);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Recipient updated successfully',
                life: 3000
            });
        } else {
            // Add new recipient
            const newRecipient: Recipient = {
                id: Date.now().toString(),
                ...formData,
                status: 'pending'
            };
            onRecipientsChange([...recipients, newRecipient]);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Recipient added successfully',
                life: 3000
            });
        }

        setDialogVisible(false);
    };

    const handleDelete = (recipient: Recipient) => {
        confirmDialog({
            message: `Delete recipient ${recipient.phone}?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                onRecipientsChange(recipients.filter(r => r.id !== recipient.id));
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Recipient deleted successfully',
                    life: 3000
                });
            },
            acceptClassName: 'p-button-danger',
            rejectClassName: 'p-button-outlined'
        });
    };

    const handleFileUpload = (event: any) => {
        const file = event.files[0];
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
            try {
                const content = e.target.result;
                let importedRecipients: Recipient[] = [];

                if (file.name.endsWith('.json')) {
                    // Parse JSON
                    const jsonData = JSON.parse(content);
                    importedRecipients = jsonData.map((item: any, index: number) => ({
                        id: `imported-${Date.now()}-${index}`,
                        phone: item.phone || item.number || '',
                        name: item.name || '',
                        custom1: item.custom1 || '',
                        custom2: item.custom2 || '',
                        status: 'pending' as const
                    }));
                } else if (file.name.endsWith('.csv')) {
                    // Parse CSV
                    const lines = content.split('\n').filter((line: string) => line.trim());
                    // Skip header
                    for (let i = 1; i < lines.length; i++) {
                        const columns = lines[i].split(',').map((col: string) => col.trim());
                        if (columns[0]) {
                            importedRecipients.push({
                                id: `imported-${Date.now()}-${i}`,
                                phone: columns[0],
                                name: columns[1] || '',
                                custom1: columns[2] || '',
                                custom2: columns[3] || '',
                                status: 'pending'
                            });
                        }
                    }
                }

                onRecipientsChange([...recipients, ...importedRecipients]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Imported ${importedRecipients.length} recipients`,
                    life: 3000
                });
                setImportDialogVisible(false);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to import file',
                    life: 3000
                });
            }
        };

        reader.readAsText(file);
    };

    const downloadTemplate = () => {
        const template = `Phone,Name,Custom1,Custom2
966501234567,John Doe,Value1,Value2
966507654321,Jane Smith,Value3,Value4`;

        const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'recipients_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearAll = () => {
        confirmDialog({
            message: 'Clear all recipients?',
            header: 'Confirm Clear',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                onRecipientsChange([]);
                // Clear from localStorage
                localStorage.removeItem('waqtor_recipients');
                toast.current?.show({
                    severity: 'info',
                    summary: 'Cleared',
                    detail: 'All recipients cleared',
                    life: 3000
                });
            },
            acceptClassName: 'p-button-danger',
            rejectClassName: 'p-button-outlined'
        });
    };

    const resetStatus = () => {
        confirmDialog({
            message: 'Reset all recipients status to pending?',
            header: 'Confirm Reset',
            icon: 'pi pi-refresh',
            accept: () => {
                const updated = recipients.map(r => ({ ...r, status: 'pending' as const }));
                onRecipientsChange(updated);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Reset',
                    detail: 'All statuses reset to pending',
                    life: 3000
                });
            },
            acceptClassName: 'p-button-warning',
            rejectClassName: 'p-button-outlined'
        });
    };

    const statusBodyTemplate = (rowData: Recipient) => {
        const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
            pending: 'warning',
            sent: 'info',
            delivered: 'success',
            read: 'success',
            failed: 'danger'
        };

        const iconMap: Record<string, string> = {
            pending: 'pi-clock',
            sent: 'pi-send',
            delivered: 'pi-check',
            read: 'pi-check-circle',
            failed: 'pi-times-circle'
        };

        return (
            <Tag 
                value={rowData.status.toUpperCase()} 
                severity={severityMap[rowData.status]}
                icon={`pi ${iconMap[rowData.status]}`}
            />
        );
    };

    const actionsBodyTemplate = (rowData: Recipient) => {
        return (
            <div className="flex gap-1">
                <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="warning"
                    size="small"
                    onClick={() => openEdit(rowData)}
                    tooltip="Edit"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    size="small"
                    onClick={() => handleDelete(rowData)}
                    tooltip="Delete"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="flex gap-2">
                <Button
                    label="Add Recipient"
                    icon="pi pi-plus"
                    onClick={openNew}
                />
                <Button
                    label="Import"
                    icon="pi pi-upload"
                    outlined
                    onClick={() => setImportDialogVisible(true)}
                />
                <Button
                    label="Reset Status"
                    icon="pi pi-refresh"
                    severity="warning"
                    outlined
                    onClick={resetStatus}
                    disabled={recipients.length === 0}
                    tooltip="Reset all recipients status to pending"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    label="Clear All"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    onClick={clearAll}
                    disabled={recipients.length === 0}
                />
            </div>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            
            <div className="flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold m-0 mb-2">
                        <i className="pi pi-users mr-2 text-primary"></i>
                        Recipients
                    </h2>
                    <p className="text-600 m-0 mb-2">
                        Manage target phone numbers for your messages
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <Chip 
                            label={`${recipients.filter(r => r.status === 'pending').length} Pending`}
                            icon="pi pi-clock"
                            className="bg-orange-100 text-orange-700"
                        />
                        <Chip 
                            label={`${recipients.filter(r => r.status === 'sent').length} Sent`}
                            icon="pi pi-send"
                            className="bg-blue-100 text-blue-700"
                        />
                        <Chip 
                            label={`${recipients.filter(r => r.status === 'delivered').length} Delivered`}
                            icon="pi pi-check"
                            className="bg-green-100 text-green-700"
                        />
                        <Chip 
                            label={`${recipients.filter(r => r.status === 'read').length} Read`}
                            icon="pi pi-check-circle"
                            className="bg-teal-100 text-teal-700"
                        />
                        <Chip 
                            label={`${recipients.filter(r => r.status === 'failed').length} Failed`}
                            icon="pi pi-times"
                            className="bg-red-100 text-red-700"
                        />
                    </div>
                </div>
                <Chip 
                    label={`${recipients.length} Total`} 
                    icon="pi pi-users"
                    className="bg-primary text-white text-xl px-4 py-2"
                />
            </div>

            <DataTable
                value={recipients}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                dataKey="id"
                globalFilter={globalFilter}
                header={header}
                emptyMessage="No recipients found. Add recipients manually or import from file."
                stripedRows
            >
                <Column 
                    field="phone" 
                    header="Phone Number" 
                    sortable
                    style={{ minWidth: '150px' }}
                />
                <Column 
                    field="name" 
                    header="Name" 
                    sortable
                    style={{ minWidth: '150px' }}
                />
                <Column 
                    field="custom1" 
                    header="Custom 1" 
                    style={{ minWidth: '120px' }}
                />
                <Column 
                    field="custom2" 
                    header="Custom 2" 
                    style={{ minWidth: '120px' }}
                />
                <Column 
                    field="status" 
                    header="Status" 
                    body={statusBodyTemplate}
                    sortable
                    style={{ minWidth: '100px' }}
                />
                <Column 
                    header="Actions" 
                    body={actionsBodyTemplate}
                    style={{ width: '100px' }}
                />
            </DataTable>

            {/* Add/Edit Recipient Dialog */}
            <Dialog
                visible={dialogVisible}
                style={{ width: '500px' }}
                header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-user text-primary"></i>
                        <span>{editingRecipient ? 'Edit Recipient' : 'Add Recipient'}</span>
                    </div>
                }
                modal
                onHide={() => setDialogVisible(false)}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            text
                            onClick={() => setDialogVisible(false)}
                        />
                        <Button
                            label={editingRecipient ? 'Update' : 'Add'}
                            icon="pi pi-check"
                            onClick={handleSave}
                        />
                    </div>
                }
            >
                <div className="flex flex-column gap-3">
                    <div>
                        <label htmlFor="phone" className="block mb-2 font-semibold">
                            Phone Number *
                        </label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-phone"></i>
                            </span>
                            <InputText
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="966501234567"
                                aria-describedby="phone-help"
                            />
                        </div>
                        <small id="phone-help" className="text-500">
                            Enter phone number with country code
                        </small>
                    </div>

                    <div>
                        <label htmlFor="name" className="block mb-2 font-semibold">
                            Name
                        </label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Recipient name"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="custom1" className="block mb-2 font-semibold">
                            Custom Field 1
                        </label>
                        <InputText
                            id="custom1"
                            value={formData.custom1}
                            onChange={(e) => setFormData({ ...formData, custom1: e.target.value })}
                            placeholder="Custom value 1"
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="custom2" className="block mb-2 font-semibold">
                            Custom Field 2
                        </label>
                        <InputText
                            id="custom2"
                            value={formData.custom2}
                            onChange={(e) => setFormData({ ...formData, custom2: e.target.value })}
                            placeholder="Custom value 2"
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>

            {/* Import Dialog */}
            <Dialog
                visible={importDialogVisible}
                style={{ width: '600px' }}
                header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-upload text-primary"></i>
                        <span>Import Recipients</span>
                    </div>
                }
                modal
                onHide={() => setImportDialogVisible(false)}
                footer={
                    <div className="flex justify-content-between align-items-center">
                        <Button
                            label="Download Template"
                            icon="pi pi-download"
                            outlined
                            onClick={downloadTemplate}
                        />
                        <Button
                            label="Close"
                            icon="pi pi-times"
                            text
                            onClick={() => setImportDialogVisible(false)}
                        />
                    </div>
                }
            >
                <div className="flex flex-column gap-3">
                    <p className="text-600 m-0">
                        Upload a CSV or JSON file containing recipient information.
                    </p>

                    <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        name="recipients"
                        accept=".csv,.json"
                        maxFileSize={1000000}
                        onSelect={handleFileUpload}
                        chooseLabel="Choose File (.csv, .json)"
                        className="w-full"
                        auto
                    />

                    <div className="surface-100 border-round p-3">
                        <div className="flex align-items-start gap-2">
                            <i className="pi pi-info-circle text-blue-500 mt-1"></i>
                            <div className="flex-1 text-sm text-600">
                                <div className="font-semibold text-900 mb-2">CSV Format:</div>
                                <code className="block bg-white p-2 border-round mb-2">
                                    Phone,Name,Custom1,Custom2
                                </code>
                                <div className="font-semibold text-900 mb-2">JSON Format:</div>
                                <code className="block bg-white p-2 border-round">
                                    {'[{"phone":"966501234567","name":"John"}]'}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
