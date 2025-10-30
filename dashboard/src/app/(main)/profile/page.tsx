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
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { TabView, TabPanel } from 'primereact/tabview';
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
    
    // Security
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    
    // Preferences
    const [language, setLanguage] = useState('en');
    const [timezone, setTimezone] = useState('UTC');
    const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    
    // Activity Logs
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        setIsClient(true);
        
        // Load user data from localStorage
        const savedName = localStorage.getItem('user_name') || 'User';
        const savedEmail = localStorage.getItem('user_email') || '';
        const savedPhone = localStorage.getItem('user_phone') || '';
        const savedAvatar = localStorage.getItem('user_avatar') || '';
        const saved2FA = localStorage.getItem('two_factor_enabled') === 'true';
        const savedLanguage = localStorage.getItem('language') || 'en';
        const savedTimezone = localStorage.getItem('timezone') || 'UTC';
        const savedDateFormat = localStorage.getItem('date_format') || 'DD/MM/YYYY';
        const savedEmailNotif = localStorage.getItem('email_notifications') !== 'false';
        const savedPushNotif = localStorage.getItem('push_notifications') !== 'false';
        
        setUserName(savedName);
        setUserEmail(savedEmail);
        setUserPhone(savedPhone);
        setUserAvatar(savedAvatar);
        setTwoFactorEnabled(saved2FA);
        setLanguage(savedLanguage);
        setTimezone(savedTimezone);
        setDateFormat(savedDateFormat);
        setEmailNotifications(savedEmailNotif);
        setPushNotifications(savedPushNotif);
        
        // Load activity logs
        loadActivityLogs();
    }, []);

    const loadActivityLogs = () => {
        // Load from localStorage
        const savedLogs = localStorage.getItem('activity_logs');
        if (savedLogs) {
            try {
                const logs = JSON.parse(savedLogs);
                setActivityLogs(logs.map((log: any) => ({
                    ...log,
                    timestamp: new Date(log.timestamp)
                })));
            } catch (e) {
                setActivityLogs([]);
            }
        } else {
            setActivityLogs([]);
        }
    };

    // Auto-save function
    const autoSave = (field: string, value: any) => {
        localStorage.setItem(field, value);
        window.dispatchEvent(new Event('branding-update'));
        
        toast.current?.show({ 
            severity: 'success', 
            summary: 'Saved', 
            detail: 'Changes saved automatically',
            life: 2000 
        });
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

    const handlePasswordChange = () => {
        // Reset error
        setPasswordError('');

        // Validate
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Please fill all password fields');
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Please fill all password fields',
                life: 3000 
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'New passwords do not match',
                life: 3000 
            });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Password must be at least 6 characters',
                life: 3000 
            });
            return;
        }

        // Success
        toast.current?.show({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Password updated successfully',
            life: 3000 
        });

        // Clear fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        if (newPassword && value && newPassword !== value) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
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
                                    chooseOptions={{
                                        icon: 'pi pi-upload',
                                        className: 'p-button-sm'
                                    }}
                                />
                                {userAvatar && (
                                    <Button
                                        label="Remove"
                                        icon="pi pi-trash"
                                        severity="danger"
                                        size="small"
                                        onClick={handleRemoveAvatar}
                                    />
                                )}
                            </div>

                            <Divider />

                            {/* Current Plan */}
                            <div className="w-full mb-3">
                                <div className="flex align-items-center justify-content-between mb-2">
                                    <span className="text-500">Current Plan</span>
                                    <Tag value="Active" severity="success" />
                                </div>
                                <div className="text-xl font-bold text-primary mb-2">Free Plan</div>
                                <Button 
                                    label="Upgrade" 
                                    icon="pi pi-arrow-up" 
                                    size="small" 
                                    className="w-full"
                                    onClick={() => window.open('https://waqtor.dxbmark.com/pricing', '_blank')}
                                />
                            </div>

                            <Divider />

                            {/* Usage Statistics */}
                            <div className="w-full">
                                <h5 className="mb-3">Usage Statistics</h5>
                                <div className="mb-3">
                                    <div className="flex justify-content-between mb-1">
                                        <span className="text-500 text-sm">API Requests</span>
                                        <span className="font-semibold text-sm">0 / 1,000</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="flex justify-content-between mb-1">
                                        <span className="text-500 text-sm">Messages</span>
                                        <span className="font-semibold text-sm">0 / 5,000</span>
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            {/* Account Info */}
                            <div className="w-full">
                                <div className="flex justify-content-between mb-2">
                                    <span className="text-500">Account Status</span>
                                    <span className="font-semibold text-green-500">Active</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span className="text-500">Member Since</span>
                                    <span className="font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
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

                    {/* Security & Preferences Tabs */}
                    <Card className="mb-3">
                        <TabView>
                            {/* Security Tab */}
                            <TabPanel header="Security" leftIcon="pi pi-shield">
                                <div className="grid">
                                    {/* Change Password */}
                                    <div className="col-12">
                                        <h4 className="mb-3">Change Password</h4>
                                        <div className="grid">
                                            <div className="col-12">
                                                <label className="block mb-2">Current Password</label>
                                                <Password
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="w-full"
                                                    toggleMask
                                                    feedback={false}
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="block mb-2">New Password</label>
                                                <Password
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full"
                                                    toggleMask
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="block mb-2">Confirm New Password</label>
                                                <Password
                                                    value={confirmPassword}
                                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                                    className={`w-full ${passwordError ? 'p-invalid' : ''}`}
                                                    toggleMask
                                                    feedback={false}
                                                    placeholder="Confirm new password"
                                                />
                                                {passwordError && (
                                                    <small className="p-error block mt-1">{passwordError}</small>
                                                )}
                                            </div>
                                            <div className="col-12">
                                                <Button 
                                                    label="Update Password" 
                                                    icon="pi pi-key" 
                                                    size="small" 
                                                    onClick={handlePasswordChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Two-Factor Authentication */}
                                    <div className="col-12">
                                        <div className="flex align-items-center justify-content-between">
                                            <div>
                                                <h4 className="mb-2">Two-Factor Authentication (2FA)</h4>
                                                <p className="text-500 mt-0">Add an extra layer of security to your account</p>
                                            </div>
                                            <InputSwitch checked={twoFactorEnabled} onChange={(e) => { setTwoFactorEnabled(e.value); autoSave('two_factor_enabled', e.value); }} />
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Active Sessions */}
                                    <div className="col-12">
                                        <h4 className="mb-3">Active Sessions</h4>
                                        <div className="surface-card p-3 border-round mb-2">
                                            <div className="flex align-items-center justify-content-between">
                                                <div>
                                                    <div className="font-semibold">Current Session</div>
                                                    <div className="text-500 text-sm">Chrome on MacOS • {new Date().toLocaleString()}</div>
                                                </div>
                                                <Tag value="Active" severity="success" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                            {/* Preferences Tab */}
                            <TabPanel header="Preferences" leftIcon="pi pi-cog">
                                <div className="grid">
                                    {/* Language */}
                                    <div className="col-12 md:col-6">
                                        <label className="block mb-2 font-semibold">Language</label>
                                        <Dropdown
                                            value={language}
                                            onChange={(e) => { setLanguage(e.value); autoSave('language', e.value); }}
                                            options={[
                                                { label: '🇬🇧 English', value: 'en' },
                                                { label: '🇸🇦 العربية', value: 'ar' }
                                            ]}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Timezone */}
                                    <div className="col-12 md:col-6">
                                        <label className="block mb-2 font-semibold">Timezone</label>
                                        <Dropdown
                                            value={timezone}
                                            onChange={(e) => { setTimezone(e.value); autoSave('timezone', e.value); }}
                                            options={[
                                                { label: 'UTC', value: 'UTC' },
                                                { label: 'GMT+4 (Dubai)', value: 'Asia/Dubai' },
                                                { label: 'GMT+3 (Riyadh)', value: 'Asia/Riyadh' },
                                                { label: 'GMT+2 (Cairo)', value: 'Africa/Cairo' }
                                            ]}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Date Format */}
                                    <div className="col-12 md:col-6">
                                        <label className="block mb-2 font-semibold">Date Format</label>
                                        <Dropdown
                                            value={dateFormat}
                                            onChange={(e) => { setDateFormat(e.value); autoSave('date_format', e.value); }}
                                            options={[
                                                { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                                                { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                                                { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
                                            ]}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <Divider />
                                        <h4 className="mb-3">Notifications</h4>
                                    </div>

                                    {/* Email Notifications */}
                                    <div className="col-12">
                                        <div className="flex align-items-center justify-content-between mb-3">
                                            <div>
                                                <div className="font-semibold">Email Notifications</div>
                                                <div className="text-500 text-sm">Receive updates via email</div>
                                            </div>
                                            <InputSwitch checked={emailNotifications} onChange={(e) => { setEmailNotifications(e.value); autoSave('email_notifications', e.value); }} />
                                        </div>
                                    </div>

                                    {/* Push Notifications */}
                                    <div className="col-12">
                                        <div className="flex align-items-center justify-content-between">
                                            <div>
                                                <div className="font-semibold">Push Notifications</div>
                                                <div className="text-500 text-sm">Receive browser notifications</div>
                                            </div>
                                            <InputSwitch checked={pushNotifications} onChange={(e) => { setPushNotifications(e.value); autoSave('push_notifications', e.value); }} />
                                        </div>
                                    </div>

                                </div>
                            </TabPanel>

                            {/* Backup & Export Tab */}
                            <TabPanel header="Backup" leftIcon="pi pi-save">
                                <div className="grid">
                                    <div className="col-12">
                                        <h4 className="mb-3">Data Management</h4>
                                        <p className="text-500 mb-4">Export your data or backup your settings</p>
                                    </div>

                                    {/* Backup Buttons */}
                                    <div className="col-12">
                                        <div className="flex flex-wrap gap-3">
                                            <Button 
                                                label="Export Data" 
                                                icon="pi pi-download" 
                                                outlined 
                                                size="small"
                                                className="flex-1"
                                                style={{ minWidth: '150px' }}
                                            />
                                            <Button 
                                                label="Backup Settings" 
                                                icon="pi pi-save" 
                                                outlined 
                                                size="small"
                                                className="flex-1"
                                                style={{ minWidth: '150px' }}
                                            />
                                            <Button 
                                                label="Import Data" 
                                                icon="pi pi-upload" 
                                                outlined 
                                                size="small"
                                                className="flex-1"
                                                style={{ minWidth: '150px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
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
