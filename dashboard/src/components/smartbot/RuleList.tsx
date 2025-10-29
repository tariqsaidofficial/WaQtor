/**
 * RuleList Component
 * Display and manage auto-reply rules
 */

import React from 'react';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputSwitch } from 'primereact/inputswitch';
import { Chip } from 'primereact/chip';
import { confirmDialog } from 'primereact/confirmdialog';
import type { AutoReplyRule } from '../../app/(main)/smartbot/page';

interface RuleListProps {
    rules: AutoReplyRule[];
    onEdit: (_rule: AutoReplyRule) => void;
    onDelete: (_ruleId: string) => void;
    onToggle: (_ruleId: string) => void;
}

export default function RuleList({ rules, onEdit, onDelete, onToggle }: RuleListProps) {
    
    const confirmDelete = (rule: AutoReplyRule) => {
        confirmDialog({
            message: `Are you sure you want to delete "${rule.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => onDelete(rule.id)
        });
    };

    const itemTemplate = (rule: AutoReplyRule) => {
        return (
            <div className="col-12">
                <Card className="mb-3">
                    <div className="flex align-items-start justify-content-between">
                        {/* Left Side - Rule Info */}
                        <div className="flex-1">
                            <div className="flex align-items-center gap-3 mb-3">
                                <i className={`pi ${rule.enabled ? 'pi-bolt text-primary' : 'pi-ban text-400'} text-2xl`}></i>
                                <div>
                                    <h3 className="m-0 mb-1 text-xl font-bold">{rule.name}</h3>
                                    <div className="flex gap-2 align-items-center">
                                        <Tag 
                                            value={rule.matchType} 
                                            severity="info"
                                            icon="pi pi-search"
                                        />
                                        {rule.caseSensitive && (
                                            <Tag 
                                                value="Case Sensitive" 
                                                severity="warning"
                                                icon="pi pi-info-circle"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="mb-3">
                                <div className="text-sm font-semibold text-600 mb-2">
                                    <i className="pi pi-key mr-1"></i>
                                    Keywords:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {rule.keywords.map((keyword: string, idx: number) => (
                                        <Chip 
                                            key={idx} 
                                            label={keyword}
                                            className="bg-blue-50 text-blue-700"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Reply Message Preview */}
                            <div className="mb-3">
                                <div className="text-sm font-semibold text-600 mb-2">
                                    <i className="pi pi-comment mr-1"></i>
                                    Reply Message:
                                </div>
                                <div className="p-3 surface-50 border-round">
                                    <p className="m-0 text-sm line-height-3 white-space-pre-wrap">
                                        {rule.replyMessage.length > 150 
                                            ? rule.replyMessage.substring(0, 150) + '...' 
                                            : rule.replyMessage
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-3 text-sm text-600">
                                <div>
                                    <i className="pi pi-send mr-1"></i>
                                    <span className="font-semibold">{rule.triggerCount || 0}</span> triggers
                                </div>
                                <div>
                                    <i className="pi pi-calendar mr-1"></i>
                                    Created: {rule.createdAt ? new Date(rule.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                                {rule.lastTriggered && (
                                    <div>
                                        <i className="pi pi-clock mr-1"></i>
                                        Last: {new Date(rule.lastTriggered).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side - Actions */}
                        <div className="flex flex-column gap-2 ml-3">
                            <div className="flex align-items-center gap-2 mb-2">
                                <InputSwitch
                                    checked={rule.enabled}
                                    onChange={() => onToggle(rule.id)}
                                    tooltip={rule.enabled ? 'Disable' : 'Enable'}
                                />
                                <span className="text-sm font-semibold">
                                    {rule.enabled ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            
                            <Button
                                icon="pi pi-pencil"
                                label="Edit"
                                size="small"
                                outlined
                                onClick={() => onEdit(rule)}
                            />
                            
                            <Button
                                icon="pi pi-trash"
                                label="Delete"
                                size="small"
                                severity="danger"
                                outlined
                                onClick={() => confirmDelete(rule)}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <Card>
            <div className="mb-4">
                <h2 className="text-2xl font-bold m-0 mb-2">
                    <i className="pi pi-list mr-2 text-primary"></i>
                    Auto-Reply Rules
                </h2>
                <p className="text-600 m-0">
                    {rules.length} rule{rules.length !== 1 ? 's' : ''} configured
                </p>
            </div>

            {rules.length === 0 ? (
                <div className="text-center py-6">
                    <i className="pi pi-inbox text-6xl text-400 mb-3"></i>
                    <p className="text-600 text-xl">No rules created yet</p>
                    <p className="text-500">Create your first auto-reply rule to get started!</p>
                </div>
            ) : (
                <DataView 
                    value={rules} 
                    itemTemplate={itemTemplate}
                    layout="list"
                />
            )}
        </Card>
    );
}
