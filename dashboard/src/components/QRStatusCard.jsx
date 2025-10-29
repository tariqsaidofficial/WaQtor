/**
 * QR Status Card Component
 * Displays WhatsApp connection status and QR code
 */

import React from 'react';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import QRCode from 'react-qr-code';
import { useAppStore } from '../store/useAppStore';
import { useWebSocket } from '../hooks/useWebSocket';

export default function QRStatusCard() {
    const { qr, status, sessionState } = useAppStore();
    const { isConnected, reconnect } = useWebSocket();

    const getStatusBadge = () => {
        switch (status) {
        case 'connected':
        case 'ready':
            return <Badge value="Connected" severity="success" />;
        case 'authenticated':
            return <Badge value="Authenticated" severity="info" />;
        case 'disconnected':
            return <Badge value="Disconnected" severity="danger" />;
        case 'loading':
        case 'initializing':
            return <Badge value="Loading..." severity="warning" />;
        default:
            return <Badge value={status || 'Unknown'} severity="secondary" />;
        }
    };

    const getStatusIcon = () => {
        switch (status) {
        case 'connected':
        case 'ready':
            return 'pi pi-check-circle';
        case 'authenticated':
            return 'pi pi-shield';
        case 'disconnected':
            return 'pi pi-times-circle';
        case 'loading':
        case 'initializing':
            return 'pi pi-spin pi-spinner';
        default:
            return 'pi pi-question-circle';
        }
    };

    const cardHeader = (
        <div className="flex align-items-center justify-content-between p-3">
            <div className="flex align-items-center gap-2">
                <i className={`${getStatusIcon()} text-2xl`}></i>
                <h3 className="m-0">WhatsApp Connection</h3>
            </div>
            {getStatusBadge()}
        </div>
    );

    const cardFooter = (
        <div className="flex justify-content-between align-items-center">
            <div className="text-sm text-500">
        WebSocket: {isConnected ? (
                    <span className="text-green-500">
                        <i className="pi pi-circle-fill text-xs mr-1"></i>
            Connected
                    </span>
                ) : (
                    <span className="text-red-500">
                        <i className="pi pi-circle-fill text-xs mr-1"></i>
            Disconnected
                    </span>
                )}
            </div>
            <Button 
                label="Refresh" 
                icon="pi pi-refresh" 
                size="small"
                text
                onClick={reconnect}
            />
        </div>
    );

    return (
        <Card 
            header={cardHeader} 
            footer={cardFooter}
            className="shadow-2"
        >
            <div className="flex flex-column align-items-center justify-content-center p-4">
                {status === 'loading' || status === 'initializing' ? (
                    <div className="text-center">
                        <ProgressSpinner />
                        <p className="mt-3 text-600">Initializing WhatsApp client...</p>
                    </div>
                ) : qr ? (
                    <div className="text-center">
                        <div className="bg-white p-3 border-round inline-block">
                            <QRCode 
                                value={qr} 
                                size={220} 
                                level="H"
                                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                            />
                        </div>
                        <div className="mt-3">
                            <p className="text-lg font-semibold mb-2">Scan QR Code</p>
                            <p className="text-600 text-sm">
                Open WhatsApp on your phone and scan this code to connect
                            </p>
                            <div className="mt-3 flex flex-column gap-2 text-left">
                                <div className="flex align-items-center gap-2 text-sm">
                                    <i className="pi pi-mobile text-primary"></i>
                                    <span>1. Open WhatsApp on your phone</span>
                                </div>
                                <div className="flex align-items-center gap-2 text-sm">
                                    <i className="pi pi-ellipsis-v text-primary"></i>
                                    <span>2. Tap Menu or Settings</span>
                                </div>
                                <div className="flex align-items-center gap-2 text-sm">
                                    <i className="pi pi-qrcode text-primary"></i>
                                    <span>3. Tap "Linked Devices"</span>
                                </div>
                                <div className="flex align-items-center gap-2 text-sm">
                                    <i className="pi pi-camera text-primary"></i>
                                    <span>4. Scan this QR code</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : status === 'ready' || status === 'connected' ? (
                    <div className="text-center">
                        <i className="pi pi-check-circle text-green-500 text-6xl mb-3"></i>
                        <p className="text-xl font-semibold text-green-600 mb-2">
              Connected Successfully!
                        </p>
                        <p className="text-600">
              Your WhatsApp is ready to send messages
                        </p>
                        {sessionState?.info && (
                            <div className="mt-4 p-3 bg-green-50 border-round">
                                <div className="text-sm text-left">
                                    <p className="mb-1">
                                        <strong>Phone:</strong> {sessionState.info.phone || 'N/A'}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Name:</strong> {sessionState.info.pushname || 'N/A'}
                                    </p>
                                    <p className="mb-0">
                                        <strong>Platform:</strong> {sessionState.info.platform || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <i className="pi pi-exclamation-triangle text-orange-500 text-6xl mb-3"></i>
                        <p className="text-lg font-semibold mb-2">Disconnected</p>
                        <p className="text-600 mb-3">
              WhatsApp client is not connected. Click refresh to reconnect.
                        </p>
                        <Button 
                            label="Reconnect" 
                            icon="pi pi-refresh" 
                            onClick={reconnect}
                            className="p-button-warning"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
}
