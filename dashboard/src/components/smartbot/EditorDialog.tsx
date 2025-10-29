/**
 * EditorDialog Component
 * Create and edit auto-reply rules
 */

import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Chips } from 'primereact/chips';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import type { AutoReplyRule } from '../../app/(main)/smartbot/page';

interface EditorDialogProps {
    visible: boolean;
    rule: AutoReplyRule | null;
    onHide: () => void;
    onSave: (_rule: AutoReplyRule) => void;
}

export default function EditorDialog({ visible, rule, onHide, onSave }: EditorDialogProps) {
    const [formData, setFormData] = useState<Partial<AutoReplyRule>>({
        name: '',
        keywords: [],
        replyMessage: '',
        enabled: true,
        matchType: 'contains',
        caseSensitive: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (rule) {
            setFormData(rule);
        } else {
            setFormData({
                name: '',
                keywords: [],
                replyMessage: '',
                enabled: true,
                matchType: 'contains',
                caseSensitive: false
            });
        }
        setErrors({});
    }, [rule, visible]);

    const matchTypeOptions = [
        { label: 'Contains - يحتوي على', value: 'contains', icon: 'pi pi-search' },
        { label: 'Exact Match - مطابقة تامة', value: 'exact', icon: 'pi pi-equals' },
        { label: 'Starts With - يبدأ بـ', value: 'startsWith', icon: 'pi pi-arrow-right' },
        { label: 'Ends With - ينتهي بـ', value: 'endsWith', icon: 'pi pi-arrow-left' }
    ];

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Rule name is required';
        }

        if (!formData.keywords || formData.keywords.length === 0) {
            newErrors.keywords = 'At least one keyword is required';
        }

        if (!formData.replyMessage?.trim()) {
            newErrors.replyMessage = 'Reply message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const ruleToSave: AutoReplyRule = {
            id: rule?.id || '',
            name: formData.name!,
            keywords: formData.keywords!,
            replyMessage: formData.replyMessage!,
            enabled: formData.enabled!,
            matchType: formData.matchType!,
            caseSensitive: formData.caseSensitive!,
            createdAt: rule?.createdAt || new Date(),
            triggerCount: rule?.triggerCount || 0,
            lastTriggered: rule?.lastTriggered
        };

        onSave(ruleToSave);
    };

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={onHide}
            />
            <Button
                label={rule ? 'Update Rule' : 'Create Rule'}
                icon="pi pi-check"
                onClick={handleSave}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={
                <div className="flex align-items-center gap-2">
                    <i className={`pi ${rule ? 'pi-pencil' : 'pi-plus'} text-primary`}></i>
                    <span>{rule ? 'Edit Auto-Reply Rule' : 'Create New Auto-Reply Rule'}</span>
                </div>
            }
            footer={footer}
            style={{ width: '600px' }}
            modal
            draggable={false}
        >
            <div className="flex flex-column gap-4">
                {/* Rule Name */}
                <div>
                    <label htmlFor="ruleName" className="block mb-2 font-semibold">
                        <i className="pi pi-tag mr-1"></i>
                        Rule Name *
                    </label>
                    <InputText
                        id="ruleName"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Welcome Message, Pricing Inquiry"
                        className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                    />
                    {errors.name && (
                        <small className="p-error">{errors.name}</small>
                    )}
                </div>

                <Divider />

                {/* Keywords */}
                <div>
                    <label htmlFor="keywords" className="block mb-2 font-semibold">
                        <i className="pi pi-key mr-1"></i>
                        Keywords (Trigger Words) *
                    </label>
                    <Chips
                        id="keywords"
                        value={formData.keywords}
                        onChange={(e) => setFormData({ ...formData, keywords: e.value || [] })}
                        placeholder="Type keyword and press Enter"
                        className={`w-full ${errors.keywords ? 'p-invalid' : ''}`}
                        separator=","
                    />
                    <small className="text-500 block mt-1">
                        Press Enter or comma to add multiple keywords. Example: hello, hi, مرحبا
                    </small>
                    {errors.keywords && (
                        <small className="p-error block mt-1">{errors.keywords}</small>
                    )}
                </div>

                {/* Match Type */}
                <div>
                    <label htmlFor="matchType" className="block mb-2 font-semibold">
                        <i className="pi pi-search mr-1"></i>
                        Match Type
                    </label>
                    <Dropdown
                        id="matchType"
                        value={formData.matchType}
                        options={matchTypeOptions}
                        onChange={(e) => setFormData({ ...formData, matchType: e.value })}
                        placeholder="Select match type"
                        className="w-full"
                        itemTemplate={(option) => (
                            <div className="flex align-items-center gap-2">
                                <i className={option.icon}></i>
                                <span>{option.label}</span>
                            </div>
                        )}
                    />
                    <small className="text-500 block mt-1">
                        How should keywords be matched in incoming messages?
                    </small>
                </div>

                {/* Case Sensitive */}
                <div className="flex align-items-center gap-2">
                    <Checkbox
                        inputId="caseSensitive"
                        checked={formData.caseSensitive || false}
                        onChange={(e) => setFormData({ ...formData, caseSensitive: e.checked || false })}
                    />
                    <label htmlFor="caseSensitive" className="font-semibold">
                        Case Sensitive (حساس لحالة الأحرف)
                    </label>
                </div>

                <Divider />

                {/* Reply Message */}
                <div>
                    <label htmlFor="replyMessage" className="block mb-2 font-semibold">
                        <i className="pi pi-comment mr-1"></i>
                        Reply Message *
                    </label>
                    <InputTextarea
                        id="replyMessage"
                        value={formData.replyMessage}
                        onChange={(e) => setFormData({ ...formData, replyMessage: e.target.value })}
                        placeholder="Type your automatic reply message here..."
                        rows={6}
                        className={`w-full ${errors.replyMessage ? 'p-invalid' : ''}`}
                    />
                    <div className="flex justify-content-between align-items-center mt-1">
                        <small className="text-500">
                            You can use emojis and line breaks
                        </small>
                        <small className="text-600">
                            {formData.replyMessage?.length || 0} characters
                        </small>
                    </div>
                    {errors.replyMessage && (
                        <small className="p-error block mt-1">{errors.replyMessage}</small>
                    )}
                </div>

                {/* Preview */}
                {formData.replyMessage && (
                    <div>
                        <label className="block mb-2 font-semibold">
                            <i className="pi pi-eye mr-1"></i>
                            Preview
                        </label>
                        <div className="p-3 surface-100 border-round">
                            <p className="m-0 white-space-pre-wrap">
                                {formData.replyMessage}
                            </p>
                        </div>
                    </div>
                )}

                {/* Info Message */}
                <Message
                    severity="info"
                    text="This rule will automatically send the reply message when any of the keywords are detected in incoming messages."
                    className="w-full"
                />
            </div>
        </Dialog>
    );
}
