/**
 * SmartBot (Auto Reply) Page
 * Intelligent automatic responses based on keywords
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Chip } from 'primereact/chip';
import { smartbotService } from '../../../api/services';
import RuleList from '../../../components/smartbot/RuleList';
import EditorDialog from '../../../components/smartbot/EditorDialog';
import ReplyHistory from '../../../components/smartbot/ReplyHistory';

export interface AutoReplyRule {
    id: string;
    name: string;
    keywords: string[];
    replyMessage: string;
    enabled: boolean;
    matchType: 'exact' | 'contains' | 'startsWith' | 'endsWith';
    caseSensitive: boolean;
    fuzzyThreshold?: number; // 0-100, default 70 (AI matching sensitivity)
    typingDelay?: number; // milliseconds, default: auto-calculated
    createdAt: Date;
    lastTriggered?: Date;
    triggerCount: number;
}

export interface ReplyLog {
    id: string;
    ruleId: string;
    ruleName: string;
    keyword: string;
    recipient: string;
    message: string;
    timestamp: Date;
}

export default function SmartBotPage() {
    const toast = useRef<any>(null);
    const [rules, setRules] = useState<AutoReplyRule[]>([]);
    const [replyHistory, setReplyHistory] = useState<ReplyLog[]>([]);
    const [loading, setLoading] = useState(true);

    const [editorVisible, setEditorVisible] = useState(false);
    const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

    // Load rules and history on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load rules
            const rulesResponse = await smartbotService.getRules();
            if (rulesResponse.success) {
                setRules(rulesResponse.data || []);
            }
            
            // Load history (last 5 only)
            const historyResponse = await smartbotService.getHistory(5);
            if (historyResponse.success) {
                setReplyHistory(historyResponse.data || []);
            }
        } catch (error) {
            console.error('Failed to load SmartBot data:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load data',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRule = () => {
        setEditingRule(null);
        setEditorVisible(true);
    };

    const handleEditRule = (rule: AutoReplyRule) => {
        setEditingRule(rule);
        setEditorVisible(true);
    };

    const handleSaveRule = async (rule: AutoReplyRule) => {
        try {
            if (editingRule) {
                // Update existing rule
                const response = await smartbotService.updateRule(rule.id, rule);
                if (response.success) {
                    setRules(rules.map(r => r.id === rule.id ? response.data : r));
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Updated',
                        detail: `Rule "${rule.name}" updated successfully`,
                        life: 3000
                    });
                }
            } else {
                // Create new rule
                const response = await smartbotService.createRule(rule);
                if (response.success) {
                    setRules([...rules, response.data]);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Created',
                        detail: `Rule "${rule.name}" created successfully`,
                        life: 3000
                    });
                }
            }
            setEditorVisible(false);
            await loadData(); // Reload to get updated data
        } catch (error) {
            console.error('Failed to save rule:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save rule',
                life: 3000
            });
        }
    };

    const handleDeleteRule = async (ruleId: string) => {
        try {
            const rule = rules.find(r => r.id === ruleId);
            const response = await smartbotService.deleteRule(ruleId);
            if (response.success) {
                setRules(rules.filter(r => r.id !== ruleId));
                toast.current?.show({
                    severity: 'info',
                    summary: 'Deleted',
                    detail: `Rule "${rule?.name}" deleted`,
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Failed to delete rule:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete rule',
                life: 3000
            });
        }
    };

    const handleToggleRule = async (ruleId: string) => {
        try {
            const response = await smartbotService.toggleRule(ruleId);
            if (response.success) {
                setRules(rules.map(r => 
                    r.id === ruleId ? response.data : r
                ));
            }
        } catch (error) {
            console.error('Failed to toggle rule:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to toggle rule',
                life: 3000
            });
        }
    };

    const enabledCount = rules.filter(r => r.enabled).length;
    const totalTriggers = rules.reduce((sum, r) => sum + r.triggerCount, 0);

    return (
        <div className="grid">
            <Toast ref={toast} />

            {/* Header */}
            <div className="col-12">
                <div className="card">
                    <div className="flex align-items-center justify-content-between">
                        <div>
                            <h1 className="text-3xl font-bold m-0 mb-2">
                                <i className="pi pi-bolt mr-2 text-primary"></i>
                                SmartBot
                                <span className="text-sm font-normal text-500 ml-2">
                                    🧠 AI-Powered
                                </span>
                            </h1>
                            <p className="text-600 m-0">
                                🌐 Bilingual intelligent responses • Arabic & English • Typo correction
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Chip 
                                label={`${enabledCount} Active`} 
                                icon="pi pi-check-circle"
                                className="bg-green-100 text-green-700"
                            />
                            <Chip 
                                label={`${totalTriggers} Replies Sent`} 
                                icon="pi pi-send"
                                className="bg-blue-100 text-blue-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="col-12">
                <Card>
                    <div className="flex gap-2 align-items-center">
                        <Button
                            label="Create New Rule"
                            icon="pi pi-plus"
                            onClick={handleCreateRule}
                        />
                        <Button
                            label="Enable All"
                            icon="pi pi-check"
                            severity="success"
                            outlined
                            onClick={() => setRules(rules.map(r => ({ ...r, enabled: true })))}
                        />
                        <Button
                            label="Disable All"
                            icon="pi pi-times"
                            severity="warning"
                            outlined
                            onClick={() => setRules(rules.map(r => ({ ...r, enabled: false })))}
                        />
                    </div>
                </Card>
            </div>

            {/* Rules List */}
            <div className="col-12 lg:col-8">
                <RuleList
                    rules={rules}
                    onEdit={handleEditRule}
                    onDelete={handleDeleteRule}
                    onToggle={handleToggleRule}
                />
            </div>

            {/* Reply History */}
            <div className="col-12 lg:col-4">
                <ReplyHistory history={replyHistory} />
            </div>

            {/* Editor Dialog */}
            <EditorDialog
                visible={editorVisible}
                rule={editingRule}
                onHide={() => setEditorVisible(false)}
                onSave={handleSaveRule}
            />
        </div>
    );
}
