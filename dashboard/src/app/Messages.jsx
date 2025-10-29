/**
 * Messages Page
 * Send and track WhatsApp messages
 */

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';
import { messageService } from '../api/services';
import { useAppStore } from '../store/useAppStore';

export default function Messages() {
    const toast = useRef(null);
    const { status } = useAppStore();
    const [sending, setSending] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Single message state
    const [singleMessage, setSingleMessage] = useState({
        phone: '',
        message: ''
    });

    // Media message state
    const [mediaMessage, setMediaMessage] = useState({
        phone: '',
        mediaUrl: '',
        caption: ''
    });

    // Bulk message state
    const [bulkMessage, setBulkMessage] = useState({
        recipients: '',
        message: ''
    });

    const isConnected = status === 'ready';

    const sendTextMessage = async () => {
        if (!singleMessage.phone || !singleMessage.message) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing Data',
                detail: 'Please fill in all fields',
                life: 3000
            });
            return;
        }

        setSending(true);
        try {
            await messageService.sendText(singleMessage.phone, singleMessage.message);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Message sent successfully',
                life: 3000
            });
            setSingleMessage({ phone: '', message: '' });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to send message',
                life: 3000
            });
        } finally {
            setSending(false);
        }
    };

    const sendMediaMessage = async () => {
        if (!mediaMessage.phone || !mediaMessage.mediaUrl) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing Data',
                detail: 'Please fill in phone and media URL',
                life: 3000
            });
            return;
        }

        setSending(true);
        try {
            await messageService.sendMedia(
                mediaMessage.phone,
                mediaMessage.mediaUrl,
                mediaMessage.caption
            );
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Media sent successfully',
                life: 3000
            });
            setMediaMessage({ phone: '', mediaUrl: '', caption: '' });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to send media',
                life: 3000
            });
        } finally {
            setSending(false);
        }
    };

    const sendBulkMessages = async () => {
        const recipients = bulkMessage.recipients
            .split('\n')
            .map(r => r.trim())
            .filter(r => r.length > 0);

        if (recipients.length === 0 || !bulkMessage.message) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing Data',
                detail: 'Please fill in recipients and message',
                life: 3000
            });
            return;
        }

        setSending(true);
        try {
            await messageService.sendBulk(recipients, bulkMessage.message);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: `Bulk message sent to ${recipients.length} recipients`,
                life: 3000
            });
            setBulkMessage({ recipients: '', message: '' });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to send bulk messages',
                life: 3000
            });
        } finally {
            setSending(false);
        }
    };

    const onFileUpload = async (event) => {
        const file = event.files[0];
        setSending(true);
        try {
            const result = await messageService.uploadFile(file);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'File uploaded successfully',
                life: 3000
            });
      
            // Update media URL with uploaded file URL
            if (result.url) {
                setMediaMessage({ ...mediaMessage, mediaUrl: result.url });
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to upload file',
                life: 3000
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="grid">
            <Toast ref={toast} />

            <div className="col-12">
                <div className="card">
                    <h1 className="text-3xl font-bold mb-2">
                        <i className="pi pi-send mr-2"></i>
            Messages
                    </h1>
                    <p className="text-600 m-0">
            Send WhatsApp messages
                    </p>
                </div>
            </div>

            {!isConnected && (
                <div className="col-12">
                    <Card className="bg-yellow-50 border-yellow-300">
                        <div className="flex align-items-center gap-3">
                            <i className="pi pi-exclamation-triangle text-yellow-600 text-2xl"></i>
                            <div>
                                <h3 className="m-0 mb-1 text-yellow-900">WhatsApp Not Connected</h3>
                                <p className="m-0 text-yellow-800">
                  Please scan QR code on the dashboard to send messages
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <div className="col-12">
                <Card>
                    <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                        {/* Single Message Tab */}
                        <TabPanel header="Single Message" leftIcon="pi pi-comment mr-2">
                            <div className="grid">
                                <div className="col-12">
                                    <label htmlFor="phone" className="block mb-2 font-semibold">
                    Phone Number
                                    </label>
                                    <InputText
                                        id="phone"
                                        value={singleMessage.phone}
                                        onChange={(e) =>
                                            setSingleMessage({ ...singleMessage, phone: e.target.value })
                                        }
                                        placeholder="966501234567"
                                        className="w-full"
                                        disabled={!isConnected || sending}
                                    />
                                    <small className="text-500">Include country code (e.g., 966 for Saudi Arabia)</small>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="message" className="block mb-2 font-semibold">
                    Message
                                    </label>
                                    <InputTextarea
                                        id="message"
                                        value={singleMessage.message}
                                        onChange={(e) =>
                                            setSingleMessage({ ...singleMessage, message: e.target.value })
                                        }
                                        rows={5}
                                        placeholder="Type your message here..."
                                        className="w-full"
                                        disabled={!isConnected || sending}
                                    />
                                </div>

                                <div className="col-12">
                                    <Button
                                        label="Send Message"
                                        icon="pi pi-send"
                                        onClick={sendTextMessage}
                                        disabled={!isConnected || sending}
                                        loading={sending}
                                    />
                                </div>
                            </div>
                        </TabPanel>

                        {/* Media Message Tab */}
                        <TabPanel header="Media Message" leftIcon="pi pi-image mr-2">
                            <div className="grid">
                                <div className="col-12">
                                    <label htmlFor="mediaPhone" className="block mb-2 font-semibold">
                    Phone Number
                                    </label>
                                    <InputText
                                        id="mediaPhone"
                                        value={mediaMessage.phone}
                                        onChange={(e) =>
                                            setMediaMessage({ ...mediaMessage, phone: e.target.value })
                                        }
                                        placeholder="966501234567"
                                        className="w-full"
                                        disabled={!isConnected || sending}
                                    />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="mediaUrl" className="block mb-2 font-semibold">
                    Media URL
                                    </label>
                                    <InputText
                                        id="mediaUrl"
                                        value={mediaMessage.mediaUrl}
                                        onChange={(e) =>
                                            setMediaMessage({ ...mediaMessage, mediaUrl: e.target.value })
                                        }
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full mb-3"
                                        disabled={!isConnected || sending}
                                    />

                                    <Divider align="center">
                                        <span className="text-sm text-500">OR</span>
                                    </Divider>

                                    <FileUpload
                                        mode="basic"
                                        name="file"
                                        accept="image/*,video/*"
                                        maxFileSize={10000000}
                                        customUpload
                                        uploadHandler={onFileUpload}
                                        auto
                                        chooseLabel="Upload File"
                                        disabled={!isConnected || sending}
                                    />
                                    <small className="text-500">Max size: 10MB</small>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="caption" className="block mb-2 font-semibold">
                    Caption (Optional)
                                    </label>
                                    <InputTextarea
                                        id="caption"
                                        value={mediaMessage.caption}
                                        onChange={(e) =>
                                            setMediaMessage({ ...mediaMessage, caption: e.target.value })
                                        }
                                        rows={3}
                                        placeholder="Add a caption..."
                                        className="w-full"
                                        disabled={!isConnected || sending}
                                    />
                                </div>

                                <div className="col-12">
                                    <Button
                                        label="Send Media"
                                        icon="pi pi-send"
                                        onClick={sendMediaMessage}
                                        disabled={!isConnected || sending}
                                        loading={sending}
                                    />
                                </div>
                            </div>
                        </TabPanel>

                        {/* Bulk Message Tab */}
                        <TabPanel header="Bulk Messages" leftIcon="pi pi-users mr-2">
                            <div className="grid">
                                <div className="col-12">
                                    <label htmlFor="recipients" className="block mb-2 font-semibold">
                    Recipients (one per line)
                                    </label>
                                    <InputTextarea
                                        id="recipients"
                                        value={bulkMessage.recipients}
                                        onChange={(e) =>
                                            setBulkMessage({ ...bulkMessage, recipients: e.target.value })
                                        }
                                        rows={5}
                                        placeholder="966501234567&#10;966507654321&#10;966509876543"
                                        className="w-full"
                                        disabled={!isConnected || sending}
                                    />
                                    <small className="text-500">
                    Recipients count:{' '}
                                        {bulkMessage.recipients.split('\n').filter((r) => r.trim()).length}
                                    </small>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="bulkMessage" className="block mb-2 font-semibold">
                    Message
                                    </label>
                                    <InputTextarea
                                        id="bulkMessage"
                                        value={bulkMessage.message}
                                        onChange={(e) =>
                                            setBulkMessage({ ...bulkMessage, message: e.target.value })
                                        }
                                        rows={5}
                                        placeholder="Type your message here..."
                                        className="w-full"
                                        disabled={!isConnected || sending}
                                    />
                                </div>

                                <div className="col-12">
                                    <Button
                                        label="Send to All"
                                        icon="pi pi-send"
                                        onClick={sendBulkMessages}
                                        disabled={!isConnected || sending}
                                        loading={sending}
                                    />
                                </div>
                            </div>
                        </TabPanel>
                    </TabView>
                </Card>
            </div>
        </div>
    );
}
