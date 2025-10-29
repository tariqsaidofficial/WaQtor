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
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { confirmDialog } from 'primereact/confirmdialog';

interface MessageFormProps {
    onSend: (messageData: any) => Promise<void>;
    recipientCount: number;
}

export default function MessageForm({ onSend, recipientCount }: MessageFormProps) {
    const toast = useRef<any>(null);
    const fileUploadRef = useRef<any>(null);
    
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [totalSize, setTotalSize] = useState(0);
    const [scheduleDialogVisible, setScheduleDialogVisible] = useState(false);
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

    // Available variables
    const variables = [
        { label: '{name}', description: 'Recipient name' },
        { label: '{phone}', description: 'Phone number' },
        { label: '{date}', description: 'Current date' },
        { label: '{time}', description: 'Current time' },
        { label: '{custom1}', description: 'Custom field 1' },
        { label: '{custom2}', description: 'Custom field 2' }
    ];

    const insertVariable = (variable: string) => {
        setMessage(message + variable);
    };

    const handleFileSelect = (event: any) => {
        const files = event.files;
        setAttachments(files);
        let size = 0;
        files.forEach((f: File) => size += f.size);
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

            {/* Message Text Area */}
            <div className="mb-4">
                <label htmlFor="message" className="block mb-2 font-semibold">
                    Message *
                </label>
                <InputTextarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here... Use variables like {name}, {phone}, etc."
                    rows={8}
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

            {/* Variables */}
            <div className="mb-4">
                <label className="block mb-2 font-semibold">
                    <i className="pi pi-code mr-2"></i>
                    Insert Variables
                </label>
                <div className="flex flex-wrap gap-2">
                    {variables.map((variable) => (
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

            {/* Attachments */}
            <div className="mb-4">
                <label className="block mb-2 font-semibold">
                    <i className="pi pi-paperclip mr-2"></i>
                    Attachments (Images only)
                </label>
                
                <Tooltip target=".custom-attachment-choose" content="Choose Images" position="bottom" />
                <Tooltip target=".custom-attachment-cancel" content="Clear" position="bottom" />
                
                <FileUpload
                    ref={fileUploadRef}
                    name="attachments[]"
                    accept="image/*"
                    maxFileSize={5000000}
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
                                    <div className="flex align-items-center gap-3 ml-auto">
                                        <span className="text-600">{formattedValue} / 5 MB</span>
                                        <ProgressBar 
                                            value={(totalSize / 50000)} 
                                            showValue={false} 
                                            style={{ width: '10rem', height: '10px' }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }}
                    itemTemplate={(file: any, props) => (
                        <div className="flex align-items-center justify-content-between p-3 surface-50 border-round mb-2">
                            <div className="flex align-items-center gap-3">
                                <img 
                                    alt={file.name} 
                                    role="presentation" 
                                    src={file.objectURL} 
                                    width={60}
                                    className="border-round"
                                />
                                <div>
                                    <div className="font-semibold text-900">{file.name}</div>
                                    <small className="text-500">{new Date().toLocaleDateString()}</small>
                                </div>
                            </div>
                            <Tag value={props.formatSize} severity="info" />
                        </div>
                    )}
                    emptyTemplate={() => (
                        <div className="flex align-items-center flex-column p-4">
                            <i className="pi pi-image text-4xl text-400 mb-3"></i>
                            <span className="text-600">Drag and drop images here or click to browse</span>
                            <small className="text-500 mt-2">Supported: Images (Max 5MB per file)</small>
                        </div>
                    )}
                    chooseOptions={{ 
                        icon: 'pi pi-images', 
                        iconOnly: false,
                        label: 'Choose Images',
                        className: 'custom-attachment-choose p-button-rounded p-button-outlined' 
                    }}
                    cancelOptions={{ 
                        icon: 'pi pi-times', 
                        iconOnly: true, 
                        className: 'custom-attachment-cancel p-button-danger p-button-rounded p-button-outlined p-button-sm' 
                    }}
                />
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
