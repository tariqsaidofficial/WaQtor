/**
 * Messages Page
 * Send WhatsApp messages directly with templates and recipient management
 */

import React, { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { messageService } from '../api/services';
import { useAppStore } from '../store/useAppStore';
import MessageForm from '../components/Messages/MessageForm';
import MessageTemplate from '../components/Messages/MessageTemplate';
import RecipientTable from '../components/Messages/RecipientTable';

export default function Messages() {
    const toast = useRef(null);
    const { status } = useAppStore();
    const [recipients, setRecipients] = useState([]);

    const isConnected = status === 'ready';

    const handleSendMessage = async (messageData) => {
        try {
            // Prepare recipients data with variables
            const recipientsData = recipients.map(r => ({
                phone: r.phone,
                variables: {
                    name: r.name || '',
                    phone: r.phone,
                    custom1: r.custom1 || '',
                    custom2: r.custom2 || '',
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString()
                }
            }));

            // Send message
            if (messageData.sendMode === 'now') {
                await messageService.sendBulkWithVariables(
                    recipientsData,
                    messageData.message,
                    messageData.attachments
                );
            } else {
                await messageService.scheduleBulkMessage(
                    recipientsData,
                    messageData.message,
                    messageData.scheduledDate,
                    messageData.attachments
                );
            }

            // Update recipients status
            setRecipients(recipients.map(r => ({ ...r, status: 'sent' })));

        } catch (error) {
            throw new Error(error.message || 'Failed to send message');
        }
    };

    const handleSelectTemplate = (template) => {
        // This will be handled by MessageForm through a callback
        // For now, we'll show a toast
        toast.current?.show({
            severity: 'info',
            summary: 'Template Selected',
            detail: `"${template.name}" template selected`,
            life: 3000
        });
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Header */}
            <div className="col-12">
                <div className="card">
                    <div className="flex align-items-center justify-content-between">
                        <div>
                            <h1 className="text-3xl font-bold m-0 mb-2">
                                <i className="pi pi-send mr-2 text-primary"></i>
                                Send Message
                            </h1>
                            <p className="text-600 m-0">
                                Send WhatsApp messages directly with templates and variables
                            </p>
                        </div>
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
                            <span className="text-sm text-600 font-semibold">
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connection Warning */}
            {!isConnected && (
                <div className="col-12">
                    <Card className="bg-yellow-50 border-yellow-300">
                        <div className="flex align-items-center gap-3">
                            <i className="pi pi-exclamation-triangle text-yellow-600 text-3xl"></i>
                            <div>
                                <h3 className="m-0 mb-1 text-yellow-900 font-bold">WhatsApp Not Connected</h3>
                                <p className="m-0 text-yellow-800">
                                    Please scan QR code on the dashboard to send messages
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Message Templates */}
            <div className="col-12">
                <MessageTemplate onSelectTemplate={handleSelectTemplate} />
            </div>

            {/* Recipients Table */}
            <div className="col-12">
                <RecipientTable 
                    recipients={recipients}
                    onRecipientsChange={setRecipients}
                />
            </div>

            {/* Message Form */}
            <div className="col-12">
                <MessageForm 
                    onSend={handleSendMessage}
                    recipientCount={recipients.length}
                />
            </div>

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
        </div>
    );
}
