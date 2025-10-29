/**
 * Quick Actions Card Component
 * Quick access to common actions
 */

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { testService, messageService } from '../api/services';
import { useAppStore } from '../store/useAppStore';

export default function QuickActionsCard() {
    const { status } = useAppStore();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [sendData, setSendData] = useState({ phone: '', message: '' });

    const isConnected = status === 'ready' || status === 'connected';

    const handleTestMessage = async () => {
        if (!isConnected) {
            toast.current.show({
                severity: 'warn',
                summary: 'Not Connected',
                detail: 'WhatsApp is not connected. Please scan QR code first.',
                life: 3000
            });
            return;
        }

        try {
            setLoading(true);
            const result = await testService.send('Test message from Waqtor Dashboard');
      
            toast.current.show({
                severity: 'success',
                summary: 'Test Message Sent',
                detail: result.message || 'Test message sent successfully',
                life: 3000
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to send test message',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!sendData.phone || !sendData.message) {
            toast.current.show({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please enter both phone number and message',
                life: 3000
            });
            return;
        }

        try {
            setLoading(true);
            const result = await messageService.sendText(sendData.phone, sendData.message);
      
            toast.current.show({
                severity: 'success',
                summary: 'Message Sent',
                detail: result.message || 'Message sent successfully',
                life: 3000
            });
      
            setShowSendDialog(false);
            setSendData({ phone: '', message: '' });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to send message',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast ref={toast} />
      
            <Card title="Quick Actions" className="shadow-2" style={{ height: '100%' }}>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <Button
                            label="Send Message"
                            icon="pi pi-send"
                            className="w-full p-button-lg"
                            onClick={() => setShowSendDialog(true)}
                            disabled={!isConnected || loading}
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <Button
                            label="Send Test Message"
                            icon="pi pi-check-circle"
                            className="w-full p-button-lg p-button-secondary"
                            onClick={handleTestMessage}
                            disabled={!isConnected || loading}
                            loading={loading}
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <Button
                            label="View Campaigns"
                            icon="pi pi-megaphone"
                            className="w-full p-button-lg p-button-info"
                            onClick={() => window.location.href = '/campaigns'}
                            disabled={!isConnected}
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <Button
                            label="View Chats"
                            icon="pi pi-comments"
                            className="w-full p-button-lg p-button-help"
                            onClick={() => window.location.href = '/chats'}
                            disabled={!isConnected}
                        />
                    </div>
                </div>

                {!isConnected && (
                    <div className="mt-3 p-3 bg-yellow-50 border-round text-center">
                        <i className="pi pi-info-circle text-yellow-600 mr-2"></i>
                        <span className="text-yellow-900 text-sm">
              Actions are disabled. Please connect WhatsApp first.
                        </span>
                    </div>
                )}
            </Card>

            <Dialog
                header="Send Message"
                visible={showSendDialog}
                style={{ width: '450px' }}
                onHide={() => {
                    setShowSendDialog(false);
                    setSendData({ phone: '', message: '' });
                }}
                footer={
                    <div>
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            text
                            onClick={() => setShowSendDialog(false)}
                        />
                        <Button
                            label="Send"
                            icon="pi pi-send"
                            onClick={handleSendMessage}
                            loading={loading}
                            disabled={!sendData.phone || !sendData.message}
                        />
                    </div>
                }
            >
                <div className="flex flex-column gap-3">
                    <div>
                        <label htmlFor="phone" className="block mb-2 font-semibold">
              Phone Number
                        </label>
                        <InputText
                            id="phone"
                            value={sendData.phone}
                            onChange={(e) => setSendData({ ...sendData, phone: e.target.value })}
                            placeholder="e.g., 201234567890"
                            className="w-full"
                        />
                        <small className="text-500">Enter with country code (without +)</small>
                    </div>
          
                    <div>
                        <label htmlFor="message" className="block mb-2 font-semibold">
              Message
                        </label>
                        <InputTextarea
                            id="message"
                            value={sendData.message}
                            onChange={(e) => setSendData({ ...sendData, message: e.target.value })}
                            placeholder="Type your message here..."
                            rows={5}
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
}
