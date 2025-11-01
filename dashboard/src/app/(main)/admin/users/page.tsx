/**
 * User Management Page
 * Modern admin interface for managing users
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Checkbox } from 'primereact/checkbox';
import axios from 'axios';
import { getToken, getCurrentUser, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'viewer';
    is_active: boolean;
    created_at: string;
    last_login_at: string | null;
}

interface EditUserData {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    is_active?: boolean;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [createDialogVisible, setCreateDialogVisible] = useState(false);
    const [resetPasswordDialogVisible, setResetPasswordDialogVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [editFormData, setEditFormData] = useState<EditUserData>({});
    const [createFormData, setCreateFormData] = useState<EditUserData>({
        role: 'user',
        is_active: true
    });
    const [saving, setSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    
    const toast = useRef<Toast>(null);
    const router = useRouter();
    
    // Update currentUser when localStorage changes
    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
    }, []);

    // Security: Verify admin access
    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            toast.current?.show({
                severity: 'error',
                summary: 'Access Denied',
                detail: 'You do not have permission to access this page',
                life: 3000
            });
            router.push('/');
        }
    }, [currentUser, router]);

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = getToken();
            
            if (!token) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Authentication Required',
                    detail: 'Please login again',
                    life: 3000
                });
                logout();
                router.push('/auth/login');
                return;
            }

            const response = await axios.get(`${API_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    page: Math.floor(first / rows) + 1,
                    limit: rows,
                    search: globalFilter
                }
            });

            if (response.data.success) {
                setUsers(response.data.data.users || []);
                setTotalRecords(response.data.data.pagination?.total || 0);
            }
        } catch (error: any) {
            console.error('❌ Error fetching users:', error);
            
            if (error.response?.status === 401) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Session Expired',
                    detail: 'Please login again',
                    life: 3000
                });
                logout();
                router.push('/auth/login');
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response?.data?.error || 'Failed to fetch users',
                    life: 3000
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchUsers();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [first, rows, globalFilter]);

    // Edit user
    const openEditDialog = (user: User) => {
        if (user.id === currentUser?.id) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'You cannot edit your own account from here',
                life: 3000
            });
            return;
        }

        setSelectedUser(user);
        setEditFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            is_active: user.is_active
        });
        setEditDialogVisible(true);
    };

    const handleSaveUser = async () => {
        if (!selectedUser) return;

        if (!editFormData.name?.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Name is required',
                life: 3000
            });
            return;
        }

        if (!editFormData.email?.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Email is required',
                life: 3000
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editFormData.email)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Invalid email format',
                life: 3000
            });
            return;
        }

        try {
            setSaving(true);
            const token = getToken();

            const response = await axios.put(
                `${API_URL}/api/admin/users/${selectedUser.id}`,
                {
                    name: editFormData.name?.trim(),
                    email: editFormData.email?.trim(),
                    role: editFormData.role,
                    is_active: editFormData.is_active
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User updated successfully',
                    life: 3000
                });
                setEditDialogVisible(false);
                setSelectedUser(null);
                fetchUsers();
            }
        } catch (error: any) {
            console.error('❌ Error updating user:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.error || 'Failed to update user',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    // Create new user
    const openCreateDialog = () => {
        setCreateFormData({
            name: '',
            email: '',
            password: '',
            role: 'user',
            is_active: true
        });
        setCreateDialogVisible(true);
    };

    const handleCreateUser = async () => {
        if (!createFormData.name?.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Name is required',
                life: 3000
            });
            return;
        }

        if (!createFormData.email?.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Email is required',
                life: 3000
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(createFormData.email)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Invalid email format',
                life: 3000
            });
            return;
        }

        if (!createFormData.password || createFormData.password.length < 6) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Password must be at least 6 characters',
                life: 3000
            });
            return;
        }

        try {
            setSaving(true);
            const token = getToken();

            const response = await axios.post(
                `${API_URL}/api/admin/users`,
                {
                    name: createFormData.name?.trim(),
                    email: createFormData.email?.trim(),
                    password: createFormData.password,
                    role: createFormData.role,
                    is_active: createFormData.is_active
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User created successfully',
                    life: 3000
                });
                setCreateDialogVisible(false);
                setCreateFormData({
                    role: 'user',
                    is_active: true
                });
                fetchUsers();
            }
        } catch (error: any) {
            console.error('❌ Error creating user:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.error || 'Failed to create user',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    // Delete user
    const confirmDelete = (user: User) => {
        if (user.id === currentUser?.id) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'You cannot delete your own account',
                life: 3000
            });
            return;
        }

        confirmDialog({
            message: `Are you sure you want to delete user "${user.email}"? This action cannot be undone.`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => handleDeleteUser(user.id)
        });
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const token = getToken();

            const response = await axios.delete(
                `${API_URL}/api/admin/users/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User deleted successfully',
                    life: 3000
                });
                fetchUsers();
            }
        } catch (error: any) {
            console.error('❌ Error deleting user:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.error || 'Failed to delete user',
                life: 3000
            });
        }
    };

    // Reset Password
    const openResetPasswordDialog = (user: User) => {
        setSelectedUser(user);
        setNewPassword('');
        setResetPasswordDialogVisible(true);
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Password must be at least 6 characters',
                life: 3000
            });
            return;
        }

        if (!selectedUser) return;

        try {
            setSaving(true);
            const token = getToken();

            await axios.post(
                `${API_URL}/api/admin/users/${selectedUser.id}/reset-password`,
                { password: newPassword },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Password reset successfully',
                life: 3000
            });
            setResetPasswordDialogVisible(false);
            setSelectedUser(null);
            setNewPassword('');
        } catch (error: any) {
            console.error('❌ Error resetting password:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.error || 'Failed to reset password',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    // Templates
    const userBodyTemplate = (rowData: User) => {
        const initials = rowData.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        return (
            <div className="flex align-items-center gap-3">
                <Avatar 
                    label={initials} 
                    size="large" 
                    style={{ 
                        backgroundColor: rowData.role === 'admin' ? '#ef4444' : '#3b82f6',
                        color: '#ffffff'
                    }} 
                    shape="circle" 
                />
                <div>
                    <div className="font-semibold text-900">{rowData.name}</div>
                    <div className="text-sm text-600">{rowData.email}</div>
                </div>
            </div>
        );
    };

    const roleBodyTemplate = (rowData: User) => {
        const roleConfig = {
            admin: { severity: 'danger' as const, icon: 'pi-shield', label: 'Admin' },
            user: { severity: 'success' as const, icon: 'pi-user', label: 'User' },
            viewer: { severity: 'info' as const, icon: 'pi-eye', label: 'Viewer' }
        };

        const config = roleConfig[rowData.role];

        return (
            <Tag 
                value={config.label} 
                severity={config.severity}
                icon={`pi ${config.icon}`}
            />
        );
    };

    const statusBodyTemplate = (rowData: User) => {
        return (
            <Tag 
                value={rowData.is_active ? 'Active' : 'Inactive'} 
                severity={rowData.is_active ? 'success' : 'danger'}
                icon={rowData.is_active ? 'pi pi-check-circle' : 'pi pi-times-circle'}
            />
        );
    };

    const lastLoginBodyTemplate = (rowData: User) => {
        if (!rowData.last_login_at) {
            return <span className="text-500 italic">Never logged in</span>;
        }
        
        const date = new Date(rowData.last_login_at);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeAgo = '';
        if (diffMins < 60) {
            timeAgo = `${diffMins}m ago`;
        } else if (diffHours < 24) {
            timeAgo = `${diffHours}h ago`;
        } else {
            timeAgo = `${diffDays}d ago`;
        }

        return (
            <div>
                <div className="text-900">{date.toLocaleDateString()}</div>
                <div className="text-sm text-500">{timeAgo}</div>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: User) => {
        // Only disable buttons if it's actually the current user
        // Both IDs must exist and match
        const isCurrentUser = !!(
            currentUser?.id && 
            rowData.id && 
            currentUser.id === rowData.id
        );
        
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="info"
                    onClick={() => openEditDialog(rowData)}
                    tooltip="Edit User"
                    tooltipOptions={{ position: 'top' }}
                    disabled={isCurrentUser}
                />
                <Button
                    icon="pi pi-key"
                    rounded
                    text
                    severity="warning"
                    onClick={() => openResetPasswordDialog(rowData)}
                    tooltip="Reset Password"
                    tooltipOptions={{ position: 'top' }}
                    disabled={isCurrentUser}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    onClick={() => confirmDelete(rowData)}
                    tooltip="Delete User"
                    tooltipOptions={{ position: 'top' }}
                    disabled={isCurrentUser}
                />
            </div>
        );
    };

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Viewer', value: 'viewer' }
    ];

    return (
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />
                <ConfirmDialog />
                
                <Card>
                    {/* Header */}
                    <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4 gap-3">
                        <div className="flex align-items-center gap-3">
                            <div 
                                className="flex align-items-center justify-content-center border-circle"
                                style={{ 
                                    width: '3rem', 
                                    height: '3rem', 
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white'
                                }}
                            >
                                <i className="pi pi-users text-2xl"></i>
                            </div>
                            <div>
                                <h2 className="m-0 text-900">User Management</h2>
                                <p className="m-0 text-600">Manage system users and permissions</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Search users..."
                                    className="w-full md:w-auto"
                                />
                            </span>
                            <Button
                                label="New User"
                                icon="pi pi-plus"
                                onClick={openCreateDialog}
                                className="p-button-success"
                            />
                            <Button
                                icon="pi pi-refresh"
                                rounded
                                outlined
                                onClick={fetchUsers}
                                tooltip="Refresh"
                                tooltipOptions={{ position: 'top' }}
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid mb-4">
                        <div className="col-12 md:col-4">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-2">Total Users</span>
                                        <div className="text-900 font-bold text-xl">{totalRecords}</div>
                                    </div>
                                    <div 
                                        className="flex align-items-center justify-content-center border-round"
                                        style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#EEF2FF' }}
                                    >
                                        <i className="pi pi-users text-blue-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-2">Active Users</span>
                                        <div className="text-900 font-bold text-xl">
                                            {users.filter(u => u.is_active).length}
                                        </div>
                                    </div>
                                    <div 
                                        className="flex align-items-center justify-content-center border-round"
                                        style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#F0FDF4' }}
                                    >
                                        <i className="pi pi-check-circle text-green-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-2">Admins</span>
                                        <div className="text-900 font-bold text-xl">
                                            {users.filter(u => u.role === 'admin').length}
                                        </div>
                                    </div>
                                    <div 
                                        className="flex align-items-center justify-content-center border-round"
                                        style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#FEF2F2' }}
                                    >
                                        <i className="pi pi-shield text-red-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        value={users}
                        loading={loading}
                        paginator
                        rows={rows}
                        first={first}
                        totalRecords={totalRecords}
                        onPage={(e) => {
                            setFirst(e.first);
                            setRows(e.rows);
                        }}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        dataKey="id"
                        emptyMessage="No users found"
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        stripedRows
                        rowHover
                    >
                        <Column 
                            field="name" 
                            header="User" 
                            body={userBodyTemplate} 
                            sortable 
                            style={{ minWidth: '250px' }}
                        />
                        <Column 
                            field="role" 
                            header="Role" 
                            body={roleBodyTemplate} 
                            sortable 
                            style={{ minWidth: '120px' }}
                        />
                        <Column 
                            field="is_active" 
                            header="Status" 
                            body={statusBodyTemplate} 
                            sortable 
                            style={{ minWidth: '120px' }}
                        />
                        <Column 
                            field="last_login_at" 
                            header="Last Login" 
                            body={lastLoginBodyTemplate} 
                            sortable 
                            style={{ minWidth: '150px' }}
                        />
                        <Column 
                            header="Actions" 
                            body={actionBodyTemplate} 
                            exportable={false}
                            style={{ minWidth: '120px' }}
                        />
                    </DataTable>
                </Card>

                {/* Edit Dialog */}
                <Dialog
                    visible={editDialogVisible}
                    style={{ width: '500px' }}
                    header={
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-user-edit text-primary"></i>
                            <span>Edit User</span>
                        </div>
                    }
                    modal
                    className="p-fluid"
                    onHide={() => {
                        setEditDialogVisible(false);
                        setSelectedUser(null);
                    }}
                >
                    <div className="formgrid grid">
                        <div className="field col-12">
                            <label htmlFor="name" className="font-semibold">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                id="name"
                                value={editFormData.name || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                required
                                autoFocus
                                className="w-full"
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="email" className="font-semibold">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                id="email"
                                type="email"
                                value={editFormData.email || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="role" className="font-semibold">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                id="role"
                                value={editFormData.role}
                                options={roleOptions}
                                onChange={(e) => setEditFormData({ ...editFormData, role: e.value })}
                                placeholder="Select a role"
                                className="w-full"
                            />
                        </div>

                        <div className="field col-12">
                            <div className="flex align-items-center gap-2">
                                <Checkbox
                                    inputId="is_active"
                                    checked={editFormData.is_active || false}
                                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.checked })}
                                />
                                <label htmlFor="is_active" className="font-semibold cursor-pointer">
                                    Active User
                                </label>
                            </div>
                            <small className="text-500">
                                Inactive users cannot login to the system
                            </small>
                        </div>
                    </div>

                    <div className="flex justify-content-end gap-2 mt-4">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            outlined
                            onClick={() => {
                                setEditDialogVisible(false);
                                setSelectedUser(null);
                            }}
                        />
                        <Button
                            label="Save Changes"
                            icon="pi pi-check"
                            onClick={handleSaveUser}
                            loading={saving}
                        />
                    </div>
                </Dialog>

                {/* Create User Dialog */}
                <Dialog
                    visible={createDialogVisible}
                    style={{ width: '500px' }}
                    header={
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-user-plus text-primary"></i>
                            <span>Create New User</span>
                        </div>
                    }
                    modal
                    className="p-fluid"
                    onHide={() => {
                        setCreateDialogVisible(false);
                        setCreateFormData({
                            role: 'user',
                            is_active: true
                        });
                    }}
                >
                    <div className="formgrid grid">
                        <div className="field col-12">
                            <label htmlFor="create_name" className="font-semibold">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                id="create_name"
                                value={createFormData.name || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                                required
                                autoFocus
                                className="w-full"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="create_email" className="font-semibold">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                id="create_email"
                                type="email"
                                value={createFormData.email || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                                required
                                className="w-full"
                                placeholder="user@example.com"
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="create_password" className="font-semibold">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <Password
                                id="create_password"
                                value={createFormData.password || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                                required
                                className="w-full"
                                inputClassName="w-full"
                                placeholder="Minimum 6 characters"
                                toggleMask
                                feedback={false}
                            />
                            <small className="text-500">
                                Password must be at least 6 characters long
                            </small>
                        </div>

                        <div className="field col-12">
                            <label htmlFor="create_role" className="font-semibold">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                id="create_role"
                                value={createFormData.role}
                                options={roleOptions}
                                onChange={(e) => setCreateFormData({ ...createFormData, role: e.value })}
                                placeholder="Select a role"
                                className="w-full"
                            />
                        </div>

                        <div className="field col-12">
                            <div className="flex align-items-center gap-2">
                                <Checkbox
                                    inputId="create_is_active"
                                    checked={createFormData.is_active || false}
                                    onChange={(e) => setCreateFormData({ ...createFormData, is_active: e.checked })}
                                />
                                <label htmlFor="create_is_active" className="font-semibold cursor-pointer">
                                    Active User
                                </label>
                            </div>
                            <small className="text-500">
                                Inactive users cannot login to the system
                            </small>
                        </div>
                    </div>

                    <div className="flex justify-content-end gap-2 mt-4">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            outlined
                            onClick={() => {
                                setCreateDialogVisible(false);
                                setCreateFormData({
                                    role: 'user',
                                    is_active: true
                                });
                            }}
                        />
                        <Button
                            label="Create User"
                            icon="pi pi-check"
                            onClick={handleCreateUser}
                            loading={saving}
                            className="p-button-success"
                        />
                    </div>
                </Dialog>

                {/* Reset Password Dialog */}
                <Dialog
                    visible={resetPasswordDialogVisible}
                    style={{ width: '450px' }}
                    header={
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-key text-orange-500"></i>
                            <span>Reset Password</span>
                        </div>
                    }
                    modal
                    className="p-fluid"
                    onHide={() => {
                        setResetPasswordDialogVisible(false);
                        setSelectedUser(null);
                        setNewPassword('');
                    }}
                >
                    <div className="mb-3">
                        <p className="text-600 mb-3">
                            Reset password for <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
                        </p>
                    </div>

                    <div className="field">
                        <label htmlFor="new_password" className="font-semibold">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <Password
                            id="new_password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full"
                            inputClassName="w-full"
                            placeholder="Minimum 6 characters"
                            toggleMask
                            feedback={false}
                        />
                        <small className="text-500">
                            Password must be at least 6 characters long
                        </small>
                    </div>

                    <div className="flex justify-content-end gap-2 mt-4">
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            outlined
                            onClick={() => {
                                setResetPasswordDialogVisible(false);
                                setSelectedUser(null);
                                setNewPassword('');
                            }}
                        />
                        <Button
                            label="Reset Password"
                            icon="pi pi-check"
                            onClick={handleResetPassword}
                            loading={saving}
                            severity="warning"
                        />
                    </div>
                </Dialog>
            </div>
        </div>
    );
}
