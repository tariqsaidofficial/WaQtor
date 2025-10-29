/**
 * Message Form Component
 * Form for composing and sending WhatsApp messages with variables and attachments
 */

import React, { useState, useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Chip } from 'primereact/chip';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { confirmDialog } from 'primereact/confirmdialog';
import { Divider } from 'primereact/divider';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface MessageFormProps {
    onSend: (messageData: any) => Promise<void>;
    recipientCount: number;
    selectedTemplate?: any;
    onTemplateApplied?: () => void;
    onMessageChange?: (msg: string) => void;
    onAttachmentsChange?: (files: File[]) => void;
}

export default function MessageForm({ onSend, recipientCount, selectedTemplate, onTemplateApplied, onMessageChange, onAttachmentsChange }: MessageFormProps) {
    const toast = useRef<any>(null);
    const fileUploadRef = useRef<any>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    // Close emoji picker on ESC key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showEmojiPicker) {
                setShowEmojiPicker(false);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showEmojiPicker]);
    
    const [message, setMessage] = useState('👋 Thank you for reaching out to WaQtor!\n\nWe are a digital solutions agency specializing in media production, IT, web design, and marketing services.\n\n📢 Looking for a Strong Visual Identity? A Professional Website? Unique Visual Content?\n\n🚀 Let\'s Elevate Your Business to the Next Level! 🚀');
    const [attachments, setAttachments] = useState<File[]>([]);
    
    // Notify parent of message changes
    React.useEffect(() => {
        if (onMessageChange) {
            onMessageChange(message);
        }
    }, [message, onMessageChange]);
    
    // Notify parent of attachments changes
    React.useEffect(() => {
        if (onAttachmentsChange) {
            onAttachmentsChange(attachments);
        }
    }, [attachments, onAttachmentsChange]);
    const [totalSize, setTotalSize] = useState(0);
    const [scheduleDialogVisible, setScheduleDialogVisible] = useState(false);
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

    // 🔍 DEBUG: Apply template when selected
    React.useEffect(() => {
        if (selectedTemplate) {
            console.log('📄 [MessageForm] Applying template:', selectedTemplate);
            setMessage(selectedTemplate.message);
            
            // Call callback to clear the template
            if (onTemplateApplied) {
                onTemplateApplied();
            }
            
            toast.current?.show({
                severity: 'success',
                summary: 'Template Applied',
                detail: `"${selectedTemplate.name}" template has been loaded`,
                life: 3000
            });
        }
    }, [selectedTemplate, onTemplateApplied]);

    // Available variables - Dynamic placeholders for personalization
    const variables = [
        { label: '{name}', description: 'Recipient name - e.g., "Example Name"', category: 'Personal' },
        { label: '{phone}', description: 'Phone number - e.g., "+966501234567"', category: 'Personal' },
        { label: '{email}', description: 'Email address - e.g., "example@email.com"', category: 'Personal' },
        { label: '{company}', description: 'Company name - e.g., "Company Name"', category: 'Business' },
        { label: '{position}', description: 'Job position/title - e.g., "Position Title"', category: 'Business' },
        { label: '{date}', description: 'Current date - e.g., "29/10/2025"', category: 'DateTime' },
        { label: '{time}', description: 'Current time - e.g., "10:30 PM"', category: 'DateTime' },
        { label: '{day}', description: 'Day of week - e.g., "Tuesday"', category: 'DateTime' },
        { label: '{month}', description: 'Month name - e.g., "October"', category: 'DateTime' },
        { label: '{year}', description: 'Current year - e.g., "2025"', category: 'DateTime' },
        { label: '{order_id}', description: 'Order/Invoice number - e.g., "ORD-2025-001"', category: 'Business' },
        { label: '{amount}', description: 'Payment amount - e.g., "$299.99"', category: 'Business' },
        { label: '{product}', description: 'Product/Service name - e.g., "Product Name"', category: 'Business' },
        { label: '{signature}', description: 'Company signature - e.g., "WaQtor"', category: 'System' },
        { label: '{link}', description: 'Custom URL/Link - e.g., "https://example.com"', category: 'Custom' },
        { label: '{custom1}', description: 'Custom field 1 - Any data', category: 'Custom' },
        { label: '{custom2}', description: 'Custom field 2 - Any data', category: 'Custom' },
        { label: '{custom3}', description: 'Custom field 3 - Any data', category: 'Custom' }
    ];

    const insertVariable = (variable: string) => {
        setMessage(message + variable);
    };

    // Handle emoji selection - insert at cursor position
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        
        // Insert emoji at cursor position
        const newMessage = message.substring(0, start) + emojiData.emoji + message.substring(end);
        setMessage(newMessage);
        
        // Update cursor position after emoji
        const newCursorPos = start + emojiData.emoji.length;
        
        // Focus textarea and set cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };
    
    // Track cursor position
    const handleTextareaClick = () => {
        // Just to maintain cursor position tracking
    };
    
    const handleTextareaKeyUp = () => {
        // Just to maintain cursor position tracking
    };

    // WhatsApp formatting functions
    const applyFormat = (format: string) => {
        const textarea = document.getElementById('message') as HTMLTextAreaElement;
        if (!textarea) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Error',
                detail: 'Please click in the message area first',
                life: 2000
            });
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = message.substring(start, end);

        if (!selectedText) {
            toast.current?.show({
                severity: 'info',
                summary: 'Select Text',
                detail: 'Please select text to apply formatting',
                life: 2000
            });
            return;
        }

        let formattedText = '';
        switch (format) {
            case 'bold':
                formattedText = `*${selectedText}*`;
                break;
            case 'italic':
                formattedText = `_${selectedText}_`;
                break;
            case 'strikethrough':
                formattedText = `~${selectedText}~`;
                break;
            case 'monospace':
                formattedText = '```' + selectedText + '```';
                break;
            case 'code':
                formattedText = '`' + selectedText + '`';
                break;
            default:
                formattedText = selectedText;
        }

        const newMessage = message.substring(0, start) + formattedText + message.substring(end);
        setMessage(newMessage);

        setTimeout(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = start + formattedText.length;
            textarea.focus();
        }, 0);
    };

    const insertListItem = (type: 'bullet' | 'number' | 'quote') => {
        let prefix = '';
        
        switch (type) {
            case 'bullet':
                prefix = '\n• ';
                break;
            case 'number':
                prefix = '\n1. ';
                break;
            case 'quote':
                prefix = '\n> ';
                break;
        }

        setMessage(message + prefix);
    };

    const handleFileSelect = (event: any) => {
        const files = event.files;
        
        // Validate file sizes based on type
        const invalidFiles: string[] = [];
        const validFiles: File[] = [];
        
        files.forEach((file: File) => {
            const sizeInMB = file.size / (1024 * 1024);
            let maxSize = 20; // Default 20MB
            let isValid = true;
            
            if (file.type.startsWith('image/')) {
                maxSize = 5;
                isValid = sizeInMB <= 5;
            } else if (file.type.startsWith('video/')) {
                maxSize = 20;
                isValid = sizeInMB <= 20;
            } else if (file.type.startsWith('audio/')) {
                maxSize = 10;
                isValid = sizeInMB <= 10;
            } else {
                // Documents
                maxSize = 10;
                isValid = sizeInMB <= 10;
            }
            
            if (isValid) {
                validFiles.push(file);
            } else {
                invalidFiles.push(`${file.name} (${sizeInMB.toFixed(1)}MB > ${maxSize}MB)`);
            }
        });
        
        if (invalidFiles.length > 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'File Size Exceeded',
                detail: `The following files exceed size limits:\n${invalidFiles.join('\n')}`,
                life: 5000
            });
        }
        
        setAttachments(validFiles);
        let size = 0;
        validFiles.forEach((f: File) => size += f.size);
        setTotalSize(size);
    };

    const handleSendNow = () => {
        if (!message.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a message',
                life: 3000
            });
            return;
        }

        if (recipientCount === 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please add recipients',
                life: 3000
            });
            return;
        }

        confirmDialog({
            message: `Send message to ${recipientCount} recipient${recipientCount !== 1 ? 's' : ''} now?`,
            header: 'Confirm Send',
            icon: 'pi pi-send',
            accept: async () => {
                try {
                    await onSend({
                        message,
                        attachments,
                        sendMode: 'now',
                        scheduledDate: null
                    });
                    
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Messages sent successfully',
                        life: 3000
                    });
                    
                    // Clear form
                    setMessage('');
                    setAttachments([]);
                    setTotalSize(0);
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to send messages',
                        life: 3000
                    });
                }
            },
            acceptClassName: 'p-button-success',
            rejectClassName: 'p-button-outlined'
        });
    };

    const handleSchedule = () => {
        if (!message.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a message',
                life: 3000
            });
            return;
        }

        if (recipientCount === 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please add recipients',
                life: 3000
            });
            return;
        }

        setScheduleDialogVisible(true);
    };

    const confirmSchedule = async () => {
        if (!scheduledDate) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select a date and time',
                life: 3000
            });
            return;
        }

        try {
            await onSend({
                message,
                attachments,
                sendMode: 'schedule',
                scheduledDate
            });
            
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Message scheduled successfully',
                life: 3000
            });
            
            // Clear form
            setMessage('');
            setAttachments([]);
            setTotalSize(0);
            setScheduledDate(null);
            setScheduleDialogVisible(false);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to schedule message',
                life: 3000
            });
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            
            <div className="flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold m-0 mb-2">
                        <i className="pi pi-send mr-2 text-primary"></i>
                        Compose Message
                    </h2>
                    <p className="text-600 m-0">
                        Create and send WhatsApp messages with variables and attachments
                    </p>
                </div>
                <Chip 
                    label={`${recipientCount} Recipients`} 
                    icon="pi pi-users"
                    className="bg-primary text-white"
                />
            </div>

            {/* Message and Attachments - Side by Side */}
            <div className="grid mb-4">
                {/* Message Text Area - Left Side */}
                <div className="col-12 lg:col-7">
                    <label htmlFor="message" className="block mb-2 font-semibold">
                        Message *
                    </label>
                    
                    {/* Formatting Toolbar */}
                    <div className="flex gap-2 mb-2 p-3 surface-50 border-round" style={{ alignItems: 'center', position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                            <Button
                                icon="pi pi-heart"
                                rounded
                                outlined
                                size="small"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                tooltip="Insert Emoji (ESC to close)"
                                tooltipOptions={{ position: 'top' }}
                            />
                            
                            {/* Emoji Picker - Next to emoji button */}
                            {showEmojiPicker && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '45px',
                                    left: 0,
                                    zIndex: 9999,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    borderRadius: '8px'
                                }}>
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                        width={400}
                                        height={450}
                                        searchPlaceHolder="Search emoji..."
                                        previewConfig={{ showPreview: false }}
                                    />
                                </div>
                            )}
                        </div>
                        <Divider layout="vertical" />
                        <Button
                            label="B"
                            rounded
                            outlined
                            size="small"
                            onClick={() => applyFormat('bold')}
                            tooltip="Bold *text*"
                            tooltipOptions={{ position: 'top' }}
                            style={{ fontWeight: 'bold' }}
                        />
                        <Button
                            label="I"
                            rounded
                            outlined
                            size="small"
                            onClick={() => applyFormat('italic')}
                            tooltip="Italic _text_"
                            tooltipOptions={{ position: 'top' }}
                            style={{ fontStyle: 'italic' }}
                        />
                        <Button
                            icon="pi pi-minus"
                            rounded
                            outlined
                            size="small"
                            onClick={() => applyFormat('strikethrough')}
                            tooltip="Strikethrough ~text~"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                            icon="pi pi-code"
                            rounded
                            outlined
                            size="small"
                            onClick={() => applyFormat('code')}
                            tooltip="Inline code `text`"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                            icon="pi pi-file-edit"
                            rounded
                            outlined
                            size="small"
                            onClick={() => applyFormat('monospace')}
                            tooltip="Monospace ```text```"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Divider layout="vertical" />
                        <Button
                            icon="pi pi-list"
                            rounded
                            outlined
                            size="small"
                            onClick={() => insertListItem('bullet')}
                            tooltip="Bullet list"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                            label="1."
                            rounded
                            outlined
                            size="small"
                            onClick={() => insertListItem('number')}
                            tooltip="Numbered list"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                            icon="pi pi-angle-right"
                            rounded
                            outlined
                            size="small"
                            onClick={() => insertListItem('quote')}
                            tooltip="Quote > text"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </div>

                    <InputTextarea
                        ref={textareaRef}
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onClick={handleTextareaClick}
                        onKeyUp={handleTextareaKeyUp}
                        placeholder="Type your message here... Use variables like {name}, {phone}, etc."
                        rows={12}
                        autoResize
                        className="w-full"
                        aria-describedby="message-help"
                    />
                    <div className="flex justify-content-between align-items-center mt-2">
                        <small id="message-help" className="text-500">
                            {message.length} characters
                        </small>
                        <small className="text-500">
                            Estimated: {Math.ceil(message.length / 160)} SMS
                        </small>
                    </div>
                </div>

                {/* Attachments - Right Side */}
                <div className="col-12 lg:col-5">
                    <label className="block mb-2 font-semibold">
                        <i className="pi pi-paperclip mr-2"></i>
                        Attachments
                    </label>
                    <small className="text-500 block mb-2">
                        📎 Images (5MB), Videos (20MB), Audio (10MB), Docs (10MB)
                    </small>
                    
                    <Tooltip target=".custom-attachment-choose" content="Choose Files" position="bottom" />
                    <Tooltip target=".custom-attachment-cancel" content="Clear" position="bottom" />
                    
                    <FileUpload
                        ref={fileUploadRef}
                        name="attachments[]"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        maxFileSize={20000000}
                        multiple
                        onSelect={handleFileSelect}
                        onClear={() => {
                            setAttachments([]);
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
                                        <div className="flex align-items-center gap-2 ml-auto">
                                            <span className="text-600 text-sm">{formattedValue}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                        itemTemplate={(file: any, props) => {
                            let icon = 'pi-file';
                            let iconColor = 'text-600';
                            
                            if (file.type.startsWith('image/')) {
                                icon = 'pi-image';
                                iconColor = 'text-blue-500';
                            } else if (file.type.startsWith('video/')) {
                                icon = 'pi-video';
                                iconColor = 'text-purple-500';
                            } else if (file.type.startsWith('audio/')) {
                                icon = 'pi-volume-up';
                                iconColor = 'text-orange-500';
                            } else if (file.type === 'application/pdf') {
                                icon = 'pi-file-pdf';
                                iconColor = 'text-red-500';
                            } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                                icon = 'pi-file-word';
                                iconColor = 'text-blue-600';
                            } else if (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                                icon = 'pi-file-excel';
                                iconColor = 'text-green-600';
                            }
                            
                            return (
                                <div className="flex align-items-center justify-content-between p-2 surface-50 border-round mb-2">
                                    <div className="flex align-items-center gap-2">
                                        {file.type.startsWith('image/') ? (
                                            <img 
                                                alt={file.name} 
                                                role="presentation" 
                                                src={file.objectURL} 
                                                width={40}
                                                className="border-round"
                                            />
                                        ) : (
                                            <div className="flex align-items-center justify-content-center border-round" 
                                                style={{ width: '40px', height: '40px', backgroundColor: '#f8f9fa' }}>
                                                <i className={`pi ${icon} text-xl ${iconColor}`}></i>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold text-900 text-sm" style={{maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                {file.name}
                                            </div>
                                            <small className="text-500">{props.formatSize}</small>
                                        </div>
                                    </div>
                                    <Tag value={file.type.split('/')[0].toUpperCase()} severity="info" className="text-xs" />
                                </div>
                            );
                        }}
                        emptyTemplate={() => (
                            <div className="flex align-items-center flex-column p-3">
                                <i className="pi pi-cloud-upload text-3xl text-400 mb-2"></i>
                                <span className="text-600 text-sm text-center">Drag files here or click to browse</span>
                            </div>
                        )}
                        chooseOptions={{ 
                            icon: 'pi pi-paperclip', 
                            iconOnly: false,
                            label: 'Choose',
                            className: 'custom-attachment-choose p-button-rounded p-button-outlined p-button-sm' 
                        }}
                        cancelOptions={{ 
                            icon: 'pi pi-times', 
                            iconOnly: true, 
                            className: 'custom-attachment-cancel p-button-danger p-button-rounded p-button-outlined p-button-sm' 
                        }}
                    />
                </div>
            </div>

            {/* Variables - Organized by Category */}
            <div className="mb-4">
                <label className="block mb-3 font-semibold">
                    <i className="pi pi-code mr-2"></i>
                    Insert Variables (Dynamic Placeholders)
                </label>
                
                {/* Personal Variables */}
                <div className="mb-3">
                    <div className="text-sm font-semibold text-600 mb-2">👤 Personal Info</div>
                    <div className="flex flex-wrap gap-2">
                        {variables.filter(v => v.category === 'Personal').map((variable) => (
                            <Button
                                key={variable.label}
                                label={variable.label}
                                icon="pi pi-plus"
                                size="small"
                                outlined
                                severity="info"
                                onClick={() => insertVariable(variable.label)}
                                tooltip={variable.description}
                                tooltipOptions={{ position: 'top' }}
                            />
                        ))}
                    </div>
                </div>

                {/* Business Variables */}
                <div className="mb-3">
                    <div className="text-sm font-semibold text-600 mb-2">💼 Business Info</div>
                    <div className="flex flex-wrap gap-2">
                        {variables.filter(v => v.category === 'Business').map((variable) => (
                            <Button
                                key={variable.label}
                                label={variable.label}
                                icon="pi pi-plus"
                                size="small"
                                outlined
                                severity="success"
                                onClick={() => insertVariable(variable.label)}
                                tooltip={variable.description}
                                tooltipOptions={{ position: 'top' }}
                            />
                        ))}
                    </div>
                </div>

                {/* DateTime Variables */}
                <div className="mb-3">
                    <div className="text-sm font-semibold text-600 mb-2">📅 Date & Time</div>
                    <div className="flex flex-wrap gap-2">
                        {variables.filter(v => v.category === 'DateTime').map((variable) => (
                            <Button
                                key={variable.label}
                                label={variable.label}
                                icon="pi pi-plus"
                                size="small"
                                outlined
                                severity="warning"
                                onClick={() => insertVariable(variable.label)}
                                tooltip={variable.description}
                                tooltipOptions={{ position: 'top' }}
                            />
                        ))}
                    </div>
                </div>

                {/* System Variables */}
                <div className="mb-3">
                    <div className="text-sm font-semibold text-600 mb-2">🏢 System</div>
                    <div className="flex flex-wrap gap-2">
                        {variables.filter(v => v.category === 'System').map((variable) => (
                            <Button
                                key={variable.label}
                                label={variable.label}
                                icon="pi pi-plus"
                                size="small"
                                outlined
                                severity="help"
                                onClick={() => insertVariable(variable.label)}
                                tooltip={variable.description}
                                tooltipOptions={{ position: 'top' }}
                            />
                        ))}
                    </div>
                </div>

                {/* Custom Variables */}
                <div>
                    <div className="text-sm font-semibold text-600 mb-2">⚙️ Custom Fields</div>
                    <div className="flex flex-wrap gap-2">
                        {variables.filter(v => v.category === 'Custom').map((variable) => (
                            <Button
                                key={variable.label}
                                label={variable.label}
                                icon="pi pi-plus"
                                size="small"
                                outlined
                                onClick={() => insertVariable(variable.label)}
                                tooltip={variable.description}
                                tooltipOptions={{ position: 'top' }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-content-end">
                <Button
                    label="Send Now"
                    icon="pi pi-send"
                    onClick={handleSendNow}
                    className="p-button-success"
                    disabled={!message.trim() || recipientCount === 0}
                />
                <Button
                    label="Schedule"
                    icon="pi pi-clock"
                    onClick={handleSchedule}
                    outlined
                    disabled={!message.trim() || recipientCount === 0}
                />
            </div>

            {/* Schedule Dialog */}
            <Dialog
                visible={scheduleDialogVisible}
                style={{ width: '450px' }}
                header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-clock text-primary"></i>
                        <span>Schedule Message</span>
                    </div>
                }
                modal
                onHide={() => setScheduleDialogVisible(false)}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            text
                            onClick={() => setScheduleDialogVisible(false)}
                        />
                        <Button
                            label="Schedule"
                            icon="pi pi-check"
                            onClick={confirmSchedule}
                            className="p-button-success"
                        />
                    </div>
                }
            >
                <div className="flex flex-column gap-3">
                    <p className="text-600 m-0">
                        Select the date and time when you want to send this message to {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}.
                    </p>
                    
                    <div>
                        <label htmlFor="scheduledDate" className="block mb-2 font-semibold">
                            Date & Time *
                        </label>
                        <Calendar
                            id="scheduledDate"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.value as Date)}
                            showTime
                            showIcon
                            placeholder="Select date and time"
                            minDate={new Date()}
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
