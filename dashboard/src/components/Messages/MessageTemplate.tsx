/**
 * Message Template Component
 * Manage pre-defined message templates and create new ones
 */

import React, { useState, useRef } from 'react';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';

interface Template {
    id: string;
    name: string;
    message: string;
    category: string;
    createdAt: Date;
    usageCount: number;
}

interface MessageTemplateProps {
    onSelectTemplate: (template: Template) => void;
}

export default function MessageTemplate({ onSelectTemplate }: MessageTemplateProps) {
    const toast = useRef<any>(null);
    
    const [templates, setTemplates] = useState<Template[]>([
        {
            id: '1',
            name: 'Welcome Message',
            message: 'Hello {name}! 👋\n\nWelcome to our service. We\'re excited to have you with us!\n\nIf you have any questions, feel free to reach out.',
            category: 'greeting',
            createdAt: new Date(),
            usageCount: 45
        },
        {
            id: '2',
            name: 'Order Confirmation',
            message: 'Hi {name},\n\nYour order has been confirmed! 🎉\n\nOrder ID: {custom1}\nTotal: {custom2}\n\nThank you for your purchase!',
            category: 'business',
            createdAt: new Date(),
            usageCount: 128
        },
        {
            id: '3',
            name: 'Appointment Reminder',
            message: 'Dear {name},\n\nThis is a reminder for your appointment on {date} at {time}.\n\nPlease arrive 10 minutes early.\n\nSee you soon!',
            category: 'reminder',
            createdAt: new Date(),
            usageCount: 67
        },
        {
            id: '4',
            name: 'Special Offer',
            message: '🎁 Special Offer for {name}!\n\nGet 50% OFF on all products today only!\n\nUse code: SPECIAL50\n\nShop now: {custom1}',
            category: 'marketing',
            createdAt: new Date(),
            usageCount: 203
        },
        {
            id: '5',
            name: 'Thank You',
            message: 'Thank you {name}! 🙏\n\nWe appreciate your business and look forward to serving you again.\n\nHave a great day!',
            category: 'greeting',
            createdAt: new Date(),
            usageCount: 89
        }
    ]);
    
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        message: '',
        category: 'custom'
    });

    const categoryColors: Record<string, string> = {
        greeting: 'success',
        business: 'info',
        reminder: 'warning',
        marketing: 'danger',
        custom: 'secondary'
    };

    const openNew = () => {
        setEditingTemplate(null);
        setFormData({ name: '', message: '', category: 'custom' });
        setDialogVisible(true);
    };

    const openEdit = (template: Template) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            message: template.message,
            category: template.category
        });
        setDialogVisible(true);
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.message.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill all required fields',
                life: 3000
            });
            return;
        }

        if (editingTemplate) {
            // Update existing template
            setTemplates(templates.map(t => 
                t.id === editingTemplate.id 
                    ? { ...t, ...formData }
                    : t
            ));
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Template updated successfully',
                life: 3000
            });
        } else {
            // Create new template
            const newTemplate: Template = {
                id: Date.now().toString(),
                ...formData,
                createdAt: new Date(),
                usageCount: 0
            };
            setTemplates([...templates, newTemplate]);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Template created successfully',
                life: 3000
            });
        }

        setDialogVisible(false);
    };

    const handleDelete = (template: Template) => {
        confirmDialog({
            message: `Delete template "${template.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                setTemplates(templates.filter(t => t.id !== template.id));
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Template deleted successfully',
                    life: 3000
                });
            },
            acceptClassName: 'p-button-danger',
            rejectClassName: 'p-button-outlined'
        });
    };

    const handleUseTemplate = (template: Template) => {
        onSelectTemplate(template);
        toast.current?.show({
            severity: 'info',
            summary: 'Template Applied',
            detail: `"${template.name}" template applied to message`,
            life: 3000
        });
    };

    const itemTemplate = (template: Template) => {
        return (
            <div className="col-12 md:col-6 lg:col-4">
                <div className="surface-card border-round p-4 h-full flex flex-column">
                    <div className="flex align-items-start justify-content-between mb-3">
                        <div className="flex-1">
                            <div className="font-bold text-xl mb-2">{template.name}</div>
                            <Tag 
                                value={template.category.toUpperCase()} 
                                severity={categoryColors[template.category] as any}
                                className="text-xs"
                            />
                        </div>
                        <Chip 
                            label={`${template.usageCount} uses`} 
                            icon="pi pi-chart-line"
                            className="text-xs"
                        />
                    </div>
                    
                    <div className="flex-1 mb-3">
                        <div className="text-600 line-height-3" style={{ 
                            maxHeight: '100px', 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {template.message}
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                            label="Use"
                            icon="pi pi-check"
                            size="small"
                            className="flex-1"
                            onClick={() => handleUseTemplate(template)}
                        />
                        <Button
                            icon="pi pi-pencil"
                            size="small"
                            outlined
                            onClick={() => openEdit(template)}
                        />
                        <Button
                            icon="pi pi-trash"
                            size="small"
                            severity="danger"
                            outlined
                            onClick={() => handleDelete(template)}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            
            <div className="flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold m-0 mb-2">
                        <i className="pi pi-book mr-2 text-primary"></i>
                        Message Templates
                    </h2>
                    <p className="text-600 m-0">
                        Use pre-defined templates or create your own
                    </p>
                </div>
                <Button
                    label="New Template"
                    icon="pi pi-plus"
                    onClick={openNew}
                />
            </div>

            <DataView 
                value={templates} 
                itemTemplate={itemTemplate}
                layout="grid"
                emptyMessage="No templates found"
            />

            {/* New/Edit Template Dialog */}
            <Dialog
                visible={dialogVisible}
                style={{ width: '600px' }}
                header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-book text-primary"></i>
                        <span>{editingTemplate ? 'Edit Template' : 'New Template'}</span>
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
                            label={editingTemplate ? 'Update' : 'Create'}
                            icon="pi pi-check"
                            onClick={handleSave}
                        />
                    </div>
                }
            >
                <div className="flex flex-column gap-3">
                    <div>
                        <label htmlFor="templateName" className="block mb-2 font-semibold">
                            Template Name *
                        </label>
                        <InputText
                            id="templateName"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Welcome Message"
                            className="w-full"
                            aria-describedby="name-help"
                        />
                        <small id="name-help" className="text-500">
                            Enter a descriptive name for your template
                        </small>
                    </div>

                    <div>
                        <label htmlFor="templateMessage" className="block mb-2 font-semibold">
                            Message *
                        </label>
                        <InputTextarea
                            id="templateMessage"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Type your template message... Use variables like {name}, {phone}, etc."
                            rows={8}
                            autoResize
                            className="w-full"
                            aria-describedby="message-help"
                        />
                        <small id="message-help" className="text-500">
                            {formData.message.length} characters
                        </small>
                    </div>

                    <div className="surface-100 border-round p-3">
                        <div className="flex align-items-start gap-2">
                            <i className="pi pi-info-circle text-blue-500 mt-1"></i>
                            <div className="flex-1 text-sm text-600">
                                <div className="font-semibold text-900 mb-1">Available Variables:</div>
                                <div className="flex flex-wrap gap-2">
                                    <code className="bg-white p-1 border-round">{'{name}'}</code>
                                    <code className="bg-white p-1 border-round">{'{phone}'}</code>
                                    <code className="bg-white p-1 border-round">{'{date}'}</code>
                                    <code className="bg-white p-1 border-round">{'{time}'}</code>
                                    <code className="bg-white p-1 border-round">{'{custom1}'}</code>
                                    <code className="bg-white p-1 border-round">{'{custom2}'}</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
