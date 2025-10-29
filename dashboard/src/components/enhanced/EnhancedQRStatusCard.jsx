/**
 * Enhanced QR Status Card Component
 * Advanced QR handling with retry logic and session refresh
 */

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import QRCode from 'react-qr-code';
import { useWebSocket } from '../../hooks/useWebSocket';
import { apiClient } from '../../api/client';
import { useAppStore } from '../../store/useAppStore';

export function EnhancedQRStatusCard() {
    // WebSocket connection and Store
    const { isConnected, qr: wsQr, status: wsStatus } = useWebSocket();
    const { sessionState } = useAppStore();
    const toast = useRef(null);
    
    // QR State
    const [qrData, setQrData] = useState(null);
    const [qrAttempt, setQrAttempt] = useState({ attempt: 0, maxAttempts: 10 });
    const [isMaxRetries, setIsMaxRetries] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [sessionStatus, setSessionStatus] = useState('connecting');
    const [lastUpdate, setLastUpdate] = useState(null);

    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [qrExpiry, setQrExpiry] = useState(60);

    // Update QR when WebSocket receives it
    useEffect(() => {
        if (wsQr) {
            setQrData(wsQr);
            setIsMaxRetries(false);
            setLastUpdate(new Date());
            setQrExpiry(60); // Reset timer
            console.log('📱 QR updated from WebSocket');
            
            // Show toast notification
            toast.current?.show({
                severity: 'success',
                summary: 'QR Code Ready',
                detail: 'Scan with your WhatsApp mobile app',
                life: 3000
            });
        }
    }, [wsQr]);

    // Fallback: Poll for QR if not received via WebSocket
    useEffect(() => {
        // Poll if: no QR AND connected AND not in final states
        if (!qrData && isConnected && sessionStatus !== 'connected' && sessionStatus !== 'authenticated') {
            console.log('🔄 QR not received, polling API...');
            const pollQR = async () => {
                try {
                    const response = await apiClient.get('/session/qr');
                    if (response.data?.qr) {
                        setQrData(response.data.qr);
                        setSessionStatus('qr');
                        console.log('✅ QR fetched from API');
                    }
                } catch (error) {
                    console.error('Failed to fetch QR:', error);
                }
            };

            const pollInterval = setInterval(pollQR, 2000);
            pollQR(); // Initial fetch

            return () => clearInterval(pollInterval);
        }
    }, [qrData, isConnected, sessionStatus]);

    // Monitor connection status and show feedback
    useEffect(() => {
        if (!isConnected && qrData) {
            // Show disconnection warning
            toast.current?.show({
                severity: 'warn',
                summary: 'Connection Lost',
                detail: 'Trying to reconnect to server...',
                sticky: true
            });
        } else if (isConnected && qrData) {
            // Clear warnings when reconnected
            toast.current?.clear();
        }
    }, [isConnected, qrData]);

    // QR Expiry countdown
    useEffect(() => {
        if (qrData && qrExpiry > 0) {
            const timer = setInterval(() => {
                setQrExpiry(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [qrData, qrExpiry]);

    // Update status when WebSocket receives it
    useEffect(() => {
        if (wsStatus) {
            setSessionStatus(wsStatus);
            // Clear QR when authenticated or connected
            if (wsStatus === 'authenticated' || wsStatus === 'connected') {
                setQrData(null);
                
                // Show success toast
                toast.current?.show({
                    severity: 'success',
                    summary: 'Connected!',
                    detail: 'WhatsApp connected successfully',
                    life: 4000
                });
            }
        }
    }, [wsStatus]);

    useEffect(() => {
        if (!isConnected) return;

        // Handle WebSocket events through global reference
        const handleWebSocketMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                switch (data.type) {
                case 'qr':
                    setQrData(data.data);
                    setQrAttempt({
                        attempt: data.attempt || 1,
                        maxAttempts: data.maxAttempts || 5
                    });
                    setTimeRemaining(data.timeRemaining || 20);
                    setIsMaxRetries(false);
                    setLastUpdate(new Date());
                    console.log(`📱 QR received - Attempt ${data.attempt}/${data.maxAttempts}`);
                    break;

                case 'qr_max_retries':
                    setIsMaxRetries(true);
                    setQrData(null);
                    console.log('🔄 QR max retries reached');
                    break;

                case 'session_authenticated':
                    setSessionStatus('authenticated');
                    setQrData(null);
                    setIsMaxRetries(false);
                    console.log('✅ Session authenticated');
                    break;

                case 'client_ready':
                    setSessionStatus('ready');
                    setQrData(null);
                    setIsMaxRetries(false);
                    console.log('🚀 Client ready');
                    break;

                case 'session_state':
                    if (data.data) {
                        setSessionStatus(data.data.status || 'unknown');
                    }
                    break;
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        // Connect to WebSocket events through global reference
        const connectToEvents = () => {
            if (window.waqtorWebSocket) {
                window.waqtorWebSocket.addEventListener('message', handleWebSocketMessage);
                return true;
            }
            return false;
        };

        // Try to connect immediately
        if (!connectToEvents()) {
            // If not available, retry after a short delay
            const timer = setTimeout(() => {
                connectToEvents();
            }, 500);
            
            return () => clearTimeout(timer);
        }

        return () => {
            if (window.waqtorWebSocket) {
                window.waqtorWebSocket.removeEventListener('message', handleWebSocketMessage);
            }
        };
    }, [isConnected]);

    // Countdown timer effect
    useEffect(() => {
        if (timeRemaining > 0 && qrData && !isMaxRetries) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining, qrData, isMaxRetries]);

    const handleRefreshSession = async () => {
        setIsRefreshing(true);
        try {
            console.log('🔄 Requesting session refresh...');
            
            const response = await apiClient.post('/session/refresh');
            
            if (response.data.success) {
                setIsMaxRetries(false);
                setQrData(null);
                setSessionStatus('connecting');
                setQrAttempt({ attempt: 0, maxAttempts: 10 });
                console.log('✅ Session refresh initiated');
            } else {
                throw new Error(response.data.error || 'Refresh failed');
            }
        } catch (error) {
            console.error('❌ Failed to refresh session:', error);
            // يمكن إضافة toast notification هنا
        } finally {
            setIsRefreshing(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusColor = () => {
        switch (sessionStatus) {
        case 'authenticated': return 'success';
        case 'disconnected': return 'error';
        case 'connecting': return 'info';
        default: return 'info';
        }
    };

    const getStatusMessage = () => {
        switch (sessionStatus) {
        case 'authenticated': return 'WhatsApp Connected Successfully';
        case 'disconnected': return 'WhatsApp Disconnected';
        case 'connecting': return 'Connecting to WhatsApp...';
        default: return 'Initializing...';
        }
    };

    // Max retries reached - show refresh option
    if (isMaxRetries) {
        return (
            <Card title="Session Refresh Required" className="qr-card">
                <div className="text-center p-4">
                    <i className="pi pi-clock text-6xl text-orange-500 mb-3"></i>
                    <Message 
                        severity="warn" 
                        text="QR code scanning timed out after multiple attempts" 
                        className="mb-4"
                    />
                    <p className="text-gray-600 mb-4">
                        Total attempts: {qrAttempt.attempt} of {qrAttempt.maxAttempts}
                    </p>
                    <Button 
                        label="Refresh Session" 
                        icon="pi pi-refresh"
                        onClick={handleRefreshSession}
                        loading={isRefreshing}
                        className="p-button-lg p-button-warning"
                    />
                    <p className="text-xs mt-3 text-gray-500">
                        This will restart the WhatsApp connection
                    </p>
                </div>
            </Card>
        );
    }

    // Session authenticated or connected - show success
    if (sessionStatus === 'authenticated' || sessionStatus === 'connected') {
        // Get client info from sessionState
        const clientInfo = {
            phoneNumber: sessionState?.clientInfo?.phoneNumber || sessionState?.phoneNumber || 'N/A',
            clientName: sessionState?.clientInfo?.pushname || sessionState?.clientName || 'N/A',
            platform: sessionState?.clientInfo?.platform || sessionState?.platform || 'WhatsApp'
        };

        return (
            <Card title="WhatsApp Connected" className="qr-card" style={{ height: '100%' }}>
                <div className="text-center p-4">
                    <div className="mb-4">
                        <i className="pi pi-whatsapp text-6xl text-green-500"></i>
                    </div>
                    <h3 className="text-xl font-bold text-900 mb-2">Connected Successfully!</h3>
                    <p className="text-600 mb-4">
                        Your WhatsApp is now connected and ready to send messages
                    </p>
                    
                    {/* Active Session Status */}
                    <div className="surface-100 border-round p-3 mb-3">
                        <div className="flex align-items-center justify-content-center gap-2">
                            <i className="pi pi-circle-fill text-green-500" style={{ fontSize: '0.5rem' }}></i>
                            <span className="text-sm font-semibold text-green-700">Active Session</span>
                        </div>
                    </div>

                    {/* Client Information */}
                    <div className="surface-100 border-round p-3 text-left">
                        <div className="mb-2">
                            <div className="flex align-items-center gap-2 mb-1">
                                <i className="pi pi-phone text-blue-500"></i>
                                <span className="text-xs text-500">Phone Number</span>
                            </div>
                            <div className="text-sm font-semibold text-900 ml-4">{clientInfo.phoneNumber}</div>
                        </div>
                        
                        <div className="mb-2">
                            <div className="flex align-items-center gap-2 mb-1">
                                <i className="pi pi-user text-purple-500"></i>
                                <span className="text-xs text-500">Client Name</span>
                            </div>
                            <div className="text-sm font-semibold text-900 ml-4">{clientInfo.clientName}</div>
                        </div>
                        
                        <div>
                            <div className="flex align-items-center gap-2 mb-1">
                                <i className="pi pi-mobile text-green-500"></i>
                                <span className="text-xs text-500">Platform</span>
                            </div>
                            <div className="text-sm font-semibold text-900 ml-4">{clientInfo.platform}</div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    const handleRefreshQR = async () => {
        setIsRefreshing(true);
        try {
            await apiClient.post('/session/refresh');
            setQrData(null);
            setQrExpiry(60);
            toast.current?.show({
                severity: 'info',
                summary: 'Refreshing',
                detail: 'Generating new QR code...',
                life: 2000
            });
        } catch (error) {
            console.error('Failed to refresh QR:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Refresh Failed',
                detail: 'Could not refresh QR code',
                life: 3000
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    // Show QR code for scanning
    return (
        <>
            <Toast ref={toast} position="top-right" />
            <Card title="WhatsApp QR Code" className="qr-card" style={{ height: '100%', position: 'relative' }}>
                <div className="text-center">
                    {qrData ? (
                        <>
                            {/* Header with Timer */}
                            <div className="mb-3">
                                <div className="flex align-items-center justify-content-between mb-2">
                                    <h4 className="text-lg font-semibold text-900 m-0">Scan to Connect</h4>
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-clock text-orange-500"></i>
                                        <span className="text-sm font-semibold" style={{ 
                                            color: qrExpiry < 20 ? '#ef4444' : '#f97316' 
                                        }}>
                                            {Math.floor(qrExpiry / 60)}:{String(qrExpiry % 60).padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-600">Use your WhatsApp mobile app to scan this code</p>
                            </div>

                            {/* QR Code */}
                            <div className="qr-container mb-3" style={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                                padding: '16px', 
                                borderRadius: '12px',
                                display: 'inline-block',
                                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
                                position: 'relative'
                            }}>
                                <div style={{
                                    background: 'white',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    filter: !isConnected ? 'blur(4px) grayscale(50%)' : 'none',
                                    opacity: !isConnected ? 0.5 : 1,
                                    transition: 'all 0.3s ease'
                                }}>
                                    <QRCode 
                                        value={qrData} 
                                        size={200} 
                                        level="H"
                                    />
                                </div>
                                
                                {/* Disconnection Overlay */}
                                {!isConnected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(239, 68, 68, 0.95)',
                                        color: 'white',
                                        padding: '12px 20px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                        zIndex: 10,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <i className="pi pi-spin pi-spinner"></i>
                                        <span>Reconnecting...</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Instructions */}
                            <div className="surface-100 border-round p-3 mb-3">
                                <div className="text-sm text-700">
                                    <div className="flex align-items-center gap-2 mb-2">
                                        <i className="pi pi-mobile text-primary"></i>
                                        <span className="font-semibold">How to scan:</span>
                                    </div>
                                    <ol className="text-xs text-600 pl-3 m-0" style={{ lineHeight: '1.8' }}>
                                        <li>Open WhatsApp on your phone</li>
                                        <li>Tap Menu or Settings</li>
                                        <li>Select "Linked Devices"</li>
                                        <li>Tap "Link a Device"</li>
                                        <li>Point your phone at this screen</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Status & Retry */}
                            <div className="flex align-items-center justify-content-between">
                                <div className="flex align-items-center gap-2">
                                    {isConnected ? (
                                        <>
                                            <i className="pi pi-circle-fill text-blue-500" style={{ fontSize: '0.5rem' }}></i>
                                            <span className="text-xs text-600">Waiting for scan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="pi pi-spin pi-spinner text-orange-500" style={{ fontSize: '0.75rem' }}></i>
                                            <span className="text-xs text-orange-600 font-semibold">Reconnecting to server...</span>
                                        </>
                                    )}
                                </div>
                                <Button 
                                    label="Refresh" 
                                    icon="pi pi-refresh" 
                                    size="small"
                                    text
                                    onClick={handleRefreshQR}
                                    loading={isRefreshing}
                                />
                            </div>
                        </>
                    ) : (
                    <div className="p-5">
                        <div className="mb-4">
                            <i className="pi pi-spin pi-spinner text-5xl text-primary"></i>
                        </div>
                        <h4 className="text-lg font-semibold text-900 mb-2">
                            {isConnected ? 'Generating QR Code...' : 'Connecting to Server...'}
                        </h4>
                        <p className="text-sm text-600 mb-3">
                            {isConnected 
                                ? 'Please wait while we generate your QR code' 
                                : 'Establishing connection with WhatsApp service'}
                        </p>
                        <div className="surface-100 border-round p-3">
                            <div className="flex align-items-center justify-content-center gap-2">
                                <i className="pi pi-circle-fill text-orange-500" style={{ fontSize: '0.5rem' }}></i>
                                <span className="text-xs text-600">Initializing...</span>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </Card>
        </>
    );
}

export default EnhancedQRStatusCard;
