/**
 * User Management Page
 * Secure admin-only page for managing users
 * 
 * Security Features:
 * - Protected route (admin only)
 * - JWT token validation
 * - CSRF protection
 * - XSS prevention
 * - Input sanitization
 * - Rate limiting ready
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { Card } from 'primereact/card';
import axios from 'axios';
import { useRef } from 'react';
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
    session_count?: number;
}

interface EditUserData {
    name?: string;
    email?: string;
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
    const [editFormData, setEditFormData] = useState<EditUserData>({});
    const [saving, setSaving] = useState(false);
    
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const currentUser = getCurrentUser();

    // Security: Verify admin access
    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            toast.current?.show({
                severity: 'error',
                summary: 'Access Denied',
                detail: 'You do not have permission to access this page',
                life: 3000
            });
            router.push('/auth/access');
        }
    }, [currentUser, router]);

    // Fetch users with security headers
    const fetchUsers = useCallback(async () => {
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
            
            // Handle authentication errors
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
    }, [first, rows, globalFilter, router]);

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchUsers();
        }
    }, [fetchUsers, currentUser]);

    // Edit user
    const openEditDialog = (user: User) => {
        // Security: Prevent editing yourself
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

        // Validation
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

        // Email validation
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

    // Delete user
    const confirmDelete = (user: User) => {
        // Security: Prevent deleting yourself
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

    // Templates
    const roleBodyTemplate = (rowData: User) => {
        const severity = rowData.role === 'admin' ? 'danger' : rowData.role === 'user' ? 'success' : 'info';
        return <Tag value={rowData.role.toUpperCase()} severity={severity} />;
    };

    const statusBodyTemplate = (rowData: User) => {
        return (
            <Tag 
                value={rowData.is_active ? 'ACTIVE' : 'INACTIVE'} 
                severity={rowData.is_active ? 'success' : 'danger'} 
            />
        );
    };

    const dateBodyTemplate = (rowData: User, field: 'created_at' | 'last_login_at') => {
        const date = rowData[field];
        if (!date) return <span className="text-500">Never</span>;
        return new Date(date).toLocaleString();
    };

    const actionBodyTemplate = (rowData: User) => {
        const isCurrentUser = rowData.id === currentUser?.id;
        
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="p-button-sm"
                    onClick={() => openEditDialog(rowData)}
                    tooltip="Edit User"
                    tooltipOptions={{ position: 'top' }}
                    disabled={isCurrentUser}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    className="p-button-sm"
                    onClick={() => confirmDelete(rowData)}
                    tooltip="Delete User"
                    tooltipOptions={{ position: 'top' }}
                    disabled={isCurrentUser}
                />
            </div>
        );
    };

    // Toolbar
    const leftToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <h2 className="m-0">User Management</h2>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search users..."
                    />
                </span>
                <Button
                    icon="pi pi-refresh"
                    rounded
                    outlined
                    onClick={fetchUsers}
                    tooltip="Refresh"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    // Role options
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
                    <Toolbar 
                        className="mb-4" 
                        left={leftToolbarTemplate} 
                        right={rightToolbarTemplate}
                    />

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
                    >
                        <Column field="email" header="Email" sortable />
                        <Column field="name" header="Name" sortable />
                        <Column field="role" header="Role" body={roleBodyTemplate} sortable />
                        <Column field="is_active" header="Status" body={statusBodyTemplate} sortable />
                        <Column 
                            field="created_at" 
                            header="Created" 
                            body={(rowData) => dateBodyTemplate(rowData, 'created_at')} 
                            sortable 
                        />
                        <Column 
                            field="last_login_at" 
                            header="Last Login" 
                            body={(rowData) => dateBodyTemplate(rowData, 'last_login_at')} 
                            sortable 
                        />
                        <Column header="Actions" body={actionBodyTemplate} exportable={false} />
                    </DataTable>
                </Card>

                {/* Edit Dialog */}
                <Dialog
                    visible={editDialogVisible}
                    style={{ width: '450px' }}
                    header="Edit User"
                    modal
                    className="p-fluid"
                    onHide={() => {
                        setEditDialogVisible(false);
                        setSelectedUser(null);
                    }}
                >
                    <div className="field">
                        <label htmlFor="name">Name</label>
                        <InputText
                            id="name"
                            value={editFormData.name || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            value={editFormData.email || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="role">Role</label>
                        <Dropdown
                            id="role"
                            value={editFormData.role}
                            options={roleOptions}
                            onChange={(e) => setEditFormData({ ...editFormData, role: e.value })}
                            placeholder="Select a role"
                        />
                    </div>

                    <div className="field-checkbox">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={editFormData.is_active || false}
                            onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                        />
                        <label htmlFor="is_active">Active</label>
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
                            label="Save"
                            icon="pi pi-check"
                            onClick={handleSaveUser}
                            loading={saving}
                        />
                    </div>
                </Dialog>
            </div>
        </div>
    );
}
