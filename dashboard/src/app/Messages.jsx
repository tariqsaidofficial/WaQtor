/**
 * Messages Page
 * Send WhatsApp messages directly with templates and recipient management
 */

import React, { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { messageService } from '../api/services';
import { useSession } from '../contexts/SessionContext';
import MessageForm from '../components/Messages/MessageForm';
import RecipientTable from '../components/Messages/RecipientTable';
import MessageTemplate from '../components/Messages/MessageTemplate';

export default function Messages() {
    const toast = useRef(null);
    const { status, isReady } = useSession();
    
    const [recipients, setRecipients] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [previewMessage, setPreviewMessage] = useState('');
    const [previewAttachments, setPreviewAttachments] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Convert WhatsApp formatting to HTML for preview
    const formatWhatsAppText = (text) => {
        if (!text) return text;
        
        let formatted = text;
        
        // Get first recipient data for preview (if available)
        const firstRecipient = recipients.length > 0 ? recipients[0] : null;
        const now = new Date();
        
        // Get signature from localStorage or use default
        const signature = typeof window !== 'undefined' ? localStorage.getItem('companyName') || 'WaQtor' : 'WaQtor';
        
        // Replace variables with real data from first recipient or example values
        const variableExamples = {
            // Personal Info - from recipient data
            '{name}': `<span style="background: #e3f2fd; padding: 2px 6px; border-radius: 4px; color: #1976d2; font-weight: 500;">${firstRecipient?.name || 'Example Name'}</span>`,
            '{phone}': `<span style="background: #e3f2fd; padding: 2px 6px; border-radius: 4px; color: #1976d2; font-weight: 500;">${firstRecipient?.phone || '+966501234567'}</span>`,
            '{email}': `<span style="background: #e3f2fd; padding: 2px 6px; border-radius: 4px; color: #1976d2; font-weight: 500;">${firstRecipient?.email || 'example@email.com'}</span>`,
            
            // Business Info - from recipient data
            '{company}': `<span style="background: #e8f5e9; padding: 2px 6px; border-radius: 4px; color: #388e3c; font-weight: 500;">${firstRecipient?.company || 'Company Name'}</span>`,
            '{position}': `<span style="background: #e8f5e9; padding: 2px 6px; border-radius: 4px; color: #388e3c; font-weight: 500;">${firstRecipient?.position || 'Position Title'}</span>`,
            '{order_id}': '<span style="background: #e8f5e9; padding: 2px 6px; border-radius: 4px; color: #388e3c; font-weight: 500;">ORD-2025-001</span>',
            '{amount}': '<span style="background: #e8f5e9; padding: 2px 6px; border-radius: 4px; color: #388e3c; font-weight: 500;">$299.99</span>',
            '{product}': '<span style="background: #e8f5e9; padding: 2px 6px; border-radius: 4px; color: #388e3c; font-weight: 500;">Product Name</span>',
            
            // Date/Time - from system
            '{date}': `<span style="background: #fff3e0; padding: 2px 6px; border-radius: 4px; color: #f57c00; font-weight: 500;">${now.toLocaleDateString()}</span>`,
            '{time}': `<span style="background: #fff3e0; padding: 2px 6px; border-radius: 4px; color: #f57c00; font-weight: 500;">${now.toLocaleTimeString()}</span>`,
            '{day}': `<span style="background: #fff3e0; padding: 2px 6px; border-radius: 4px; color: #f57c00; font-weight: 500;">${now.toLocaleDateString('en-US', { weekday: 'long' })}</span>`,
            '{month}': `<span style="background: #fff3e0; padding: 2px 6px; border-radius: 4px; color: #f57c00; font-weight: 500;">${now.toLocaleDateString('en-US', { month: 'long' })}</span>`,
            '{year}': `<span style="background: #fff3e0; padding: 2px 6px; border-radius: 4px; color: #f57c00; font-weight: 500;">${now.getFullYear()}</span>`,
            
            // Signature - from settings
            '{signature}': `<span style="background: #e1f5fe; padding: 2px 6px; border-radius: 4px; color: #0277bd; font-weight: 600; font-style: italic;">${signature}</span>`,
            
            // Custom Fields - from recipient data
            '{custom1}': `<span style="background: #f3e5f5; padding: 2px 6px; border-radius: 4px; color: #7b1fa2; font-weight: 500;">${firstRecipient?.custom1 || 'Custom Value 1'}</span>`,
            '{custom2}': `<span style="background: #f3e5f5; padding: 2px 6px; border-radius: 4px; color: #7b1fa2; font-weight: 500;">${firstRecipient?.custom2 || 'Custom Value 2'}</span>`,
            '{custom3}': `<span style="background: #f3e5f5; padding: 2px 6px; border-radius: 4px; color: #7b1fa2; font-weight: 500;">${firstRecipient?.custom3 || 'Custom Value 3'}</span>`,
            '{link}': '<span style="background: #f3e5f5; padding: 2px 6px; border-radius: 4px; color: #7b1fa2; font-weight: 500;">https://example.com</span>'
        };
        
        // Replace all variables with styled examples
        Object.keys(variableExamples).forEach(variable => {
            formatted = formatted.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), variableExamples[variable]);
        });
        
        // Bold: *text* -> <strong>text</strong>
        formatted = formatted.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
        
        // Italic: _text_ -> <em>text</em>
        formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>');
        
        // Strikethrough: ~text~ -> <s>text</s>
        formatted = formatted.replace(/~([^~]+)~/g, '<s>$1</s>');
        
        // Monospace: ```text``` -> <code>text</code>
        formatted = formatted.replace(/```([^`]+)```/g, '<code style="font-family: monospace; background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">$1</code>');
        
        // Inline code: `text` -> <code>text</code>
        formatted = formatted.replace(/`([^`]+)`/g, '<code style="font-family: monospace; background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">$1</code>');
        
        return formatted;
    };

    // 💾 Load recipients from localStorage on mount
    useEffect(() => {
        console.log('📱 [Messages] Component mounted');
        console.log('📱 [Messages] Loading recipients from localStorage...');
        
        try {
            const savedRecipients = localStorage.getItem('waqtor_recipients');
            if (savedRecipients) {
                const parsed = JSON.parse(savedRecipients);
                setRecipients(parsed);
                console.log('✅ [Messages] Loaded recipients from localStorage:', parsed.length, 'recipients');
            } else {
                console.log('ℹ️ [Messages] No saved recipients found');
            }
        } catch (error) {
            console.error('❌ [Messages] Failed to load recipients from localStorage:', error);
        }
        
        console.log('📱 [Messages] Initial status:', status);
        console.log('📱 [Messages] Is ready:', isReady);
        
        // Listen for message acknowledgment events
        const handleMessageAck = (event) => {
            const { messageId, status: ackStatus, to } = event.detail;
            
            console.log('\n🔴 ========== FRONTEND MESSAGE ACK ==========');
            console.log('📨 [Messages] Message ACK received:', { 
                messageId, 
                ackStatus, 
                to,
                timestamp: new Date().toISOString()
            });
            console.log('📋 [Messages] Current recipients:', recipients.map(r => ({
                phone: r.phone,
                status: r.status
            })));
            
            // Update recipient status based on phone number
            setRecipients(prev => {
                const updated = prev.map(r => {
                    const recipientPhone = r.phone.includes('@c.us') ? r.phone : `${r.phone}@c.us`;
                    if (recipientPhone === to) {
                        console.log(`✅ [Messages] MATCH FOUND! Updating ${r.phone} status: ${r.status} → ${ackStatus}`);
                        return { ...r, status: ackStatus, messageId };
                    }
                    return r;
                });
                
                console.log('📋 [Messages] Updated recipients:', updated.map(r => ({
                    phone: r.phone,
                    status: r.status
                })));
                console.log('🔴 ========== FRONTEND MESSAGE ACK END ==========\n');
                
                return updated;
            });
        };

        const handleMessageSent = (event) => {
            const { messageId, to } = event.detail;
            
            console.log('\n🟠 ========== FRONTEND MESSAGE SENT ==========');
            console.log('📤 [Messages] Message sent event:', { 
                messageId, 
                to,
                timestamp: new Date().toISOString()
            });
            
            // Update recipient status to 'sent'
            setRecipients(prev => {
                const updated = prev.map(r => {
                    const recipientPhone = r.phone.includes('@c.us') ? r.phone : `${r.phone}@c.us`;
                    if (recipientPhone === to) {
                        console.log(`✅ [Messages] Marking ${r.phone} as sent`);
                        return { ...r, status: 'sent', messageId };
                    }
                    return r;
                });
                
                console.log('🟠 ========== FRONTEND MESSAGE SENT END ==========\n');
                return updated;
            });
        };

        window.addEventListener('waqtor:message_ack', handleMessageAck);
        window.addEventListener('waqtor:message_sent', handleMessageSent);
        
        return () => {
            console.log('📱 [Messages] Component unmounted');
            window.removeEventListener('waqtor:message_ack', handleMessageAck);
            window.removeEventListener('waqtor:message_sent', handleMessageSent);
        };
    }, []);

    // 💾 Save recipients to localStorage whenever they change
    useEffect(() => {
        if (recipients.length > 0) {
            console.log('💾 [Messages] Saving recipients to localStorage:', recipients.length, 'recipients');
            localStorage.setItem('waqtor_recipients', JSON.stringify(recipients));
        } else {
            console.log('💾 [Messages] Clearing recipients from localStorage');
            localStorage.removeItem('waqtor_recipients');
        }
    }, [recipients]);

    // 🔍 DEBUG: Monitor status changes
    useEffect(() => {
        console.log('🔄 [Messages] Status changed:', status);
        console.log('🔄 [Messages] Is ready:', isReady);
    }, [status, isReady]);

    // 🔍 DEBUG: Monitor recipients changes
    useEffect(() => {
        console.log('👥 [Messages] Recipients updated:', recipients.length, 'recipients');
        if (recipients.length > 0) {
            console.log('👥 [Messages] Recipients data:', recipients);
        }
    }, [recipients]);

    const handleSendMessage = async (messageData) => {
        console.log('📤 [Messages] handleSendMessage called');
        console.log('📤 [Messages] Message data:', messageData);
        console.log('📤 [Messages] Recipients count:', recipients.length);
        console.log('📤 [Messages] Current status:', status);
        console.log('📤 [Messages] Is ready:', isReady);

        try {
            // Check connection status
            if (!isReady) {
                const errorMsg = 'Cannot send message: WhatsApp not connected';
                console.error('❌ [Messages]', errorMsg);
                console.error('❌ [Messages] Current status:', status);
                
                toast.current?.show({
                    severity: 'error',
                    summary: 'Connection Error',
                    detail: errorMsg,
                    life: 5000
                });
                throw new Error(errorMsg);
            }

            // Validate recipients
            if (!recipients || recipients.length === 0) {
                const errorMsg = 'No recipients added';
                console.error('❌ [Messages]', errorMsg);
                
                toast.current?.show({
                    severity: 'warn',
                    summary: 'No Recipients',
                    detail: 'Please add at least one recipient',
                    life: 4000
                });
                throw new Error(errorMsg);
            }

            console.log('✅ [Messages] Validation passed, preparing recipients data...');

            // Use selected recipients if any, otherwise use all
            const recipientsToSend = selectedRecipients.length > 0 ? selectedRecipients : recipients;
            
            console.log('📋 [Messages] Recipients to send:', recipientsToSend.length);
            console.log('📋 [Messages] Selected:', selectedRecipients.length, 'Total:', recipients.length);

            // Prepare recipients data with variables
            const recipientsData = recipientsToSend.map(r => ({
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

            console.log('📋 [Messages] Prepared recipients data:', recipientsData);
            console.log('📋 [Messages] Send mode:', messageData.sendMode);

            // Send message
            let response;
            if (messageData.sendMode === 'now') {
                console.log('⚡ [Messages] Sending bulk message now...');
                response = await messageService.sendBulkWithVariables(
                    recipientsData,
                    messageData.message,
                    messageData.attachments
                );
                console.log('✅ [Messages] Bulk message sent successfully:', response);
            } else {
                console.log('⏰ [Messages] Scheduling bulk message...');
                console.log('⏰ [Messages] Scheduled date:', messageData.scheduledDate);
                response = await messageService.scheduleBulkMessage(
                    recipientsData,
                    messageData.message,
                    messageData.scheduledDate,
                    messageData.attachments
                );
                console.log('✅ [Messages] Bulk message scheduled successfully:', response);
            }

            // Update recipients status
            console.log('📝 [Messages] Updating recipients status to "sent"...');
            setRecipients(recipients.map(r => ({ ...r, status: 'sent' })));

            // Show detailed success toast
            const responseData = response?.data || response;
            const mode = response?.mode || 'instant';
            
            console.log('📊 [Messages] Send results:', responseData);
            console.log('📊 [Messages] Mode:', mode);

            if (mode === 'queue') {
                // QUEUE MODE - Job queued
                const jobId = responseData?.jobId;
                const totalCount = responseData?.total || recipients.length;
                const estimatedTime = responseData?.estimatedTime || 'calculating...';

                console.log('🔄 [Messages] Job queued:', jobId);
                console.log('🔄 [Messages] Estimated time:', estimatedTime);

                toast.current?.show({
                    severity: 'info',
                    summary: 'Messages Queued',
                    detail: `📋 ${totalCount} messages queued for processing. Estimated time: ${estimatedTime}. Job ID: ${jobId}`,
                    life: 8000
                });

                // Update recipients status to 'queued'
                setRecipients(recipients.map(r => ({ ...r, status: 'pending' })));

            } else {
                // INSTANT MODE - Immediate results
                const successCount = responseData?.successful || responseData?.sent || 0;
                const failedCount = responseData?.failed || 0;
                const totalCount = responseData?.total || recipients.length;
                
                console.log('📊 [Messages] Send results:', {
                    total: totalCount,
                    successful: successCount,
                    failed: failedCount,
                    results: responseData?.results || []
                });

                // Show results for each recipient
                if (responseData?.results && Array.isArray(responseData.results)) {
                    responseData.results.forEach(result => {
                        console.log(`📱 [Messages] ${result.phone}: ${result.success ? '✅ Sent' : '❌ Failed'}`, 
                            result.success ? `ID: ${result.messageId}` : `Error: ${result.error}`);
                    });
                }

                const severity = failedCount > 0 && successCount === 0 ? 'error' : 
                                failedCount > 0 ? 'warn' : 'success';

                toast.current?.show({
                    severity,
                    summary: failedCount > 0 && successCount === 0 ? 'Send Failed' : 
                            failedCount > 0 ? 'Partially Sent' : 'Messages Sent',
                    detail: `✅ ${successCount} sent successfully${failedCount > 0 ? `, ❌ ${failedCount} failed` : ''} (Total: ${totalCount})`,
                    life: 6000
                });

                // Update recipients status
                setRecipients(recipients.map(r => ({ ...r, status: 'sent' })));
            }

            console.log('✅ [Messages] handleSendMessage completed successfully');

        } catch (error) {
            console.error('❌ [Messages] Error in handleSendMessage:', error);
            console.error('❌ [Messages] Error message:', error.message);
            console.error('❌ [Messages] Error stack:', error.stack);
            console.error('❌ [Messages] Error details:', {
                status,
                isReady,
                recipientsCount: recipients.length,
                messageData
            });

            // Show error toast
            toast.current?.show({
                severity: 'error',
                summary: 'Send Failed',
                detail: error.message || 'Failed to send message',
                life: 5000
            });

            throw new Error(error.message || 'Failed to send message');
        }
    };

    const handleSelectTemplate = (template) => {
        console.log('📄 [Messages] Template selected:', template);
        
        // Set the selected template to pass to MessageForm
        setSelectedTemplate(template);
        
        toast.current?.show({
            severity: 'success',
            summary: 'Template Applied',
            detail: `"${template.name}" has been applied to your message`,
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
                                <i className="pi pi-comments mr-2 text-primary"></i>
                                Messages
                            </h1>
                            <p className="text-600 m-0">
                                Send WhatsApp messages directly with templates and variables
                            </p>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <span 
                                className={`inline-block border-circle ${isReady ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ 
                                    width: '8px', 
                                    height: '8px',
                                    boxShadow: isReady ? '0 0 4px 1px rgba(34, 197, 94, 0.4)' : 'none',
                                    animation: isReady ? 'pulse-green 2s ease-in-out infinite' : 'none'
                                }}
                            ></span>
                            <span className="text-sm text-600 font-semibold">
                                {isReady ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connection Warning */}
            {!isReady && (
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

            {/* Left Column: Templates & Recipients */}
            <div className="col-12 lg:col-7">
                {/* Message Templates */}
                <MessageTemplate onSelectTemplate={handleSelectTemplate} />
                
                {/* Recipients Table */}
                <RecipientTable 
                    recipients={recipients}
                    onRecipientsChange={setRecipients}
                    selectedRecipients={selectedRecipients}
                    onSelectionChange={setSelectedRecipients}
                />
            </div>

            {/* Right Column: Template Preview - Mobile Mockup */}
            <div className="col-12 lg:col-5">
                <Card>
                    <div className="mb-3">
                        <h3 className="text-xl font-semibold m-0 mb-2">
                            <i className="pi pi-mobile mr-2 text-primary"></i>
                            Template Preview
                        </h3>
                        <p className="text-600 text-sm m-0">
                            Live preview of your message on WhatsApp
                        </p>
                    </div>
                    
                    <div className="flex justify-content-center">
                        <div className="border-4 border-900 border-round-3xl p-2 shadow-8" 
                             style={{ width: '340px', backgroundColor: '#1a1a1a' }}>
                            {/* Phone Notch */}
                            <div className="bg-black border-round-top-3xl p-2 text-center">
                                <div className="bg-800 border-round-pill mx-auto" 
                                     style={{ width: '120px', height: '25px' }}></div>
                            </div>
                            
                            {/* Phone Screen */}
                            <div className="bg-white border-round" style={{ height: '650px', overflow: 'hidden' }}>
                                {/* WhatsApp Header - Original Style */}
                                <div style={{ 
                                    backgroundColor: '#008069',
                                    color: 'white',
                                    padding: '10px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                    <i className="pi pi-arrow-left" style={{ fontSize: '20px' }}></i>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#ddd',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>W</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ 
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            WaQtor
                                            <i className="pi pi-verified" style={{ fontSize: '12px', color: '#25D366' }}></i>
                                        </div>
                                        <div style={{ fontSize: '13px', opacity: 0.9 }}>Business Account</div>
                                    </div>
                                    <i className="pi pi-video" style={{ fontSize: '20px' }}></i>
                                    <i className="pi pi-phone" style={{ fontSize: '20px' }}></i>
                                </div>
                                
                                {/* Chat Area */}
                                <div className="p-3" 
                                     style={{ 
                                         backgroundColor: '#e5ddd5',
                                         height: 'calc(650px - 120px)',
                                         backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h60v60H0z\' fill=\'%23e5ddd5\'/%3E%3Cpath d=\'M10 10h40v40H10z\' fill=\'%23d1d7db\' opacity=\'.05\'/%3E%3C/svg%3E")',
                                         overflowY: 'auto'
                                     }}>
                                    
                                    {/* WhatsApp Message Bubble - Original Style */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                                        <div style={{ 
                                            backgroundColor: '#ffffff',
                                            borderRadius: '8px',
                                            maxWidth: '85%',
                                            position: 'relative',
                                            boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
                                            overflow: 'hidden'
                                        }}>
                                            {/* Message tail */}
                                            <svg viewBox="0 0 8 13" height="13" width="8" style={{
                                                position: 'absolute',
                                                left: '-8px',
                                                top: '0',
                                                fill: '#ffffff'
                                            }}>
                                                <path opacity="0.13" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path>
                                                <path fill="currentColor" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path>
                                            </svg>
                                            
                                            {/* Image/File Banner - Shows actual uploaded file or placeholder */}
                                            {previewAttachments.length > 0 ? (
                                                previewAttachments[0].type?.startsWith('image/') ? (
                                                    // Image Preview
                                                    <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                                                        <img 
                                                            src={URL.createObjectURL(previewAttachments[0])}
                                                            alt="Preview"
                                                            style={{ 
                                                                width: '100%', 
                                                                height: '100%', 
                                                                objectFit: 'cover',
                                                                backgroundColor: '#000'
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    // Document/PDF Preview
                                                    <div style={{ 
                                                        position: 'relative', 
                                                        height: '80px', 
                                                        padding: '16px',
                                                        backgroundColor: '#f0f2f5',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}>
                                                        <div style={{
                                                            width: '48px',
                                                            height: '48px',
                                                            borderRadius: '8px',
                                                            backgroundColor: '#fff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '24px'
                                                        }}>
                                                            {previewAttachments[0].type?.includes('pdf') ? '📄' : 
                                                             previewAttachments[0].type?.startsWith('video/') ? '🎥' :
                                                             previewAttachments[0].type?.startsWith('audio/') ? '🎵' : '📎'}
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ 
                                                                fontSize: '14px',
                                                                fontWeight: '500',
                                                                color: '#111b21',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}>
                                                                {previewAttachments[0].name}
                                                            </div>
                                                            <div style={{ 
                                                                fontSize: '12px',
                                                                color: '#667781',
                                                                marginTop: '2px'
                                                            }}>
                                                                {(previewAttachments[0].size / 1024).toFixed(0)} KB
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                // Placeholder
                                                <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                                                    <img 
                                                        src="/WAQTOR1.png"
                                                        alt="Placeholder"
                                                        style={{ 
                                                            width: '100%', 
                                                            height: '100%', 
                                                            objectFit: 'contain',
                                                            backgroundColor: '#f5f5f5'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            
                                            {/* Message Content - Shows actual message or placeholder */}
                                            <div style={{ padding: '12px' }}>
                                                {previewMessage ? (
                                                    <div 
                                                        style={{ 
                                                            fontSize: '14.2px',
                                                            lineHeight: '19px',
                                                            color: '#111b21',
                                                            whiteSpace: 'pre-wrap',
                                                            wordBreak: 'break-word',
                                                            marginBottom: '4px',
                                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                                                        }}
                                                        dangerouslySetInnerHTML={{ __html: formatWhatsAppText(previewMessage) }}
                                                    />
                                                ) : (
                                                    <div style={{ 
                                                        fontSize: '14.2px',
                                                        lineHeight: '19px',
                                                        color: '#8696a0',
                                                        fontStyle: 'italic',
                                                        marginBottom: '4px',
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                                                    }}>
                                                        Type a message to see preview...
                                                    </div>
                                                )}
                                                
                                                {/* Timestamp & Status */}
                                                <div style={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    gap: '4px',
                                                    fontSize: '11px',
                                                    color: '#667781',
                                                    marginTop: '4px'
                                                }}>
                                                    <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                    <svg viewBox="0 0 16 11" height="11" width="16" style={{ fill: '#53bdeb' }}>
                                                        <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 0.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Input Area - Original WhatsApp Style */}
                                <div style={{ 
                                    backgroundColor: '#f0f2f5',
                                    padding: '8px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <i className="pi pi-face-smile" style={{ fontSize: '24px', color: '#54656f' }}></i>
                                    <i className="pi pi-paperclip" style={{ fontSize: '24px', color: '#54656f' }}></i>
                                    <div style={{ 
                                        flex: 1,
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        padding: '9px 12px',
                                        fontSize: '15px',
                                        color: '#667781'
                                    }}>
                                        Type a message
                                    </div>
                                    <div style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '50%',
                                        backgroundColor: '#008069',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="pi pi-microphone" style={{ fontSize: '20px', color: 'white' }}></i>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Home Indicator */}
                            <div className="flex justify-content-center pt-2 pb-1">
                                <div className="bg-700 border-round-pill" 
                                     style={{ width: '120px', height: '4px' }}></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Message Form */}
            <div className="col-12">
                <MessageForm 
                    onSend={handleSendMessage}
                    recipientCount={selectedRecipients.length > 0 ? selectedRecipients.length : recipients.length}
                    selectedTemplate={selectedTemplate}
                    onTemplateApplied={() => setSelectedTemplate(null)}
                    onMessageChange={setPreviewMessage}
                    onAttachmentsChange={setPreviewAttachments}
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
