'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import './profile.css';

interface ActivityLog {
    id: string;
    action: string;
    timestamp: Date;
    type: 'login' | 'update' | 'message' | 'campaign';
}

export default function ProfilePage() {
    const toast = React.useRef<Toast>(null);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // User Info
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    
    // Activity Logs
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        setIsClient(true);
        
        // Load user data from localStorage
        const savedName = localStorage.getItem('user_name') || 'User';
        const savedEmail = localStorage.getItem('user_email') || '';
        const savedPhone = localStorage.getItem('user_phone') || '';
        const savedAvatar = localStorage.getItem('user_avatar') || '';
        
        setUserName(savedName);
        setUserEmail(savedEmail);
        setUserPhone(savedPhone);
        setUserAvatar(savedAvatar);
        
        // Load activity logs
        loadActivityLogs();
    }, []);

    const loadActivityLogs = () => {
        // Mock activity logs
        const logs: ActivityLog[] = [
            { id: '1', action: 'Logged in to dashboard', timestamp: new Date(), type: 'login' },
            { id: '2', action: 'Updated profile information', timestamp: new Date(Date.now() - 3600000), type: 'update' },
            { id: '3', action: 'Sent 50 messages', timestamp: new Date(Date.now() - 7200000), type: 'message' },
            { id: '4', action: 'Created new campaign', timestamp: new Date(Date.now() - 86400000), type: 'campaign' },
        ];
        setActivityLogs(logs);
    };

    const handleSave = () => {
        setLoading(true);
        
        // Save to localStorage
        localStorage.setItem('user_name', userName);
        localStorage.setItem('user_email', userEmail);
        localStorage.setItem('user_phone', userPhone);
        localStorage.setItem('user_avatar', userAvatar);
        
        // Dispatch event for other components
        window.dispatchEvent(new Event('branding-update'));
        
        setTimeout(() => {
            setLoading(false);
            toast.current?.show({ 
                severity: 'success', 
                summary: 'Success', 
                detail: 'Profile updated successfully',
                life: 3000 
            });
        }, 1000);
    };

    const handleAvatarUpload = (event: any) => {
        const file = event.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setUserAvatar(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setUserAvatar('');
        localStorage.removeItem('user_avatar');
        window.dispatchEvent(new Event('branding-update'));
        toast.current?.show({ 
            severity: 'info', 
            summary: 'Avatar Removed', 
            detail: 'Profile picture has been removed',
            life: 3000 
        });
    };

    const getUserInitials = () => {
        const names = userName.trim().split(' ');
        if (names.length >= 2) {
            return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
        }
        return userName.charAt(0).toUpperCase();
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'login': return 'pi pi-sign-in';
            case 'update': return 'pi pi-pencil';
            case 'message': return 'pi pi-send';
            case 'campaign': return 'pi pi-megaphone';
            default: return 'pi pi-info-circle';
        }
    };

    const getActivitySeverity = (type: string) => {
        switch (type) {
            case 'login': return 'info';
            case 'update': return 'warning';
            case 'message': return 'success';
            case 'campaign': return 'danger';
            default: return 'info';
        }
    };

    const actionBodyTemplate = (rowData: ActivityLog) => {
        return (
            <div className="flex align-items-center gap-2">
                <i className={getActivityIcon(rowData.type)} style={{ fontSize: '1.2rem' }}></i>
                <span>{rowData.action}</span>
            </div>
        );
    };

    const typeBodyTemplate = (rowData: ActivityLog) => {
        return <Tag value={rowData.type} severity={getActivitySeverity(rowData.type) as any} />;
    };

    const timestampBodyTemplate = (rowData: ActivityLog) => {
        return new Date(rowData.timestamp).toLocaleString();
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="profile-page">
            <Toast ref={toast} />
            
            <div className="grid">
                {/* Profile Card */}
                <div className="col-12 lg:col-4">
                    <Card className="profile-card">
                        <div className="flex flex-column align-items-center">
                            {/* Avatar */}
                            <div className="mb-3">
                                {userAvatar ? (
                                    <Avatar 
                                        image={userAvatar}
                                        size="xlarge"
                                        shape="circle"
                                        className="profile-avatar"
                                    />
                                ) : (
                                    <Avatar 
                                        label={getUserInitials()}
                                        size="xlarge"
                                        shape="circle"
                                        className="profile-avatar"
                                        style={{ 
                                            backgroundColor: 'var(--primary-color)', 
                                            color: '#ffffff',
                                            fontSize: '2rem'
                                        }}
                                    />
                                )}
                            </div>

                            {/* Name */}
                            <h3 className="mb-2">{userName}</h3>
                            <p className="text-500 mb-3">{userEmail}</p>

                            {/* Upload/Remove Buttons */}
                            <div className="flex gap-2 mb-3">
                                <FileUpload
                                    mode="basic"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    onSelect={handleAvatarUpload}
                                    auto
                                    chooseLabel="Upload Photo"
                                    className="p-button-sm"
                                />
                                {userAvatar && (
                                    <Button
                                        label="Remove"
                                        icon="pi pi-trash"
                                        severity="danger"
                                        size="small"
                                        outlined
                                        onClick={handleRemoveAvatar}
                                    />
                                )}
                            </div>

                            <Divider />

                            {/* Stats */}
                            <div className="w-full">
                                <div className="flex justify-content-between mb-2">
                                    <span className="text-500">Messages Sent</span>
                                    <span className="font-semibold">1,234</span>
                                </div>
                                <div className="flex justify-content-between mb-2">
                                    <span className="text-500">Campaigns</span>
                                    <span className="font-semibold">12</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span className="text-500">Member Since</span>
                                    <span className="font-semibold">Oct 2025</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Profile Information */}
                <div className="col-12 lg:col-8">
                    <Card title="Profile Information" className="mb-3">
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <label htmlFor="name" className="block mb-2 font-semibold">Full Name</label>
                                <InputText
                                    id="name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="email" className="block mb-2 font-semibold">Email Address</label>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="phone" className="block mb-2 font-semibold">Phone Number</label>
                                <InputText
                                    id="phone"
                                    value={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    className="w-full"
                                    placeholder="+1234567890"
                                />
                            </div>

                            <div className="col-12">
                                <div className="flex gap-2 justify-content-end">
                                    <Button
                                        label="Cancel"
                                        icon="pi pi-times"
                                        severity="secondary"
                                        outlined
                                        onClick={() => window.location.reload()}
                                    />
                                    <Button
                                        label="Save Changes"
                                        icon="pi pi-check"
                                        loading={loading}
                                        onClick={handleSave}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Activity Log */}
                    <Card title="Recent Activity">
                        <DataTable 
                            value={activityLogs} 
                            paginator 
                            rows={5}
                            emptyMessage="No activity found"
                        >
                            <Column 
                                field="action" 
                                header="Action" 
                                body={actionBodyTemplate}
                            />
                            <Column 
                                field="type" 
                                header="Type" 
                                body={typeBodyTemplate}
                            />
                            <Column 
                                field="timestamp" 
                                header="Time" 
                                body={timestampBodyTemplate}
                            />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </div>
    );
}
