'use client';

import React from 'react';
import { Tag } from 'primereact/tag';

export default function TagPage() {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Tag Component</h5>
                    <p>Tag component is used to categorize content.</p>
                </div>
            </div>

            {/* Basic */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Basic</h5>
                    <div className="flex flex-wrap gap-2">
                        <Tag value="Primary" />
                        <Tag value="Success" severity="success" />
                        <Tag value="Info" severity="info" />
                        <Tag value="Warning" severity="warning" />
                        <Tag value="Danger" severity="danger" />
                    </div>
                </div>
            </div>

            {/* Pill */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Pill</h5>
                    <div className="flex flex-wrap gap-2">
                        <Tag value="Primary" rounded />
                        <Tag value="Success" severity="success" rounded />
                        <Tag value="Info" severity="info" rounded />
                        <Tag value="Warning" severity="warning" rounded />
                        <Tag value="Danger" severity="danger" rounded />
                    </div>
                </div>
            </div>

            {/* Icons */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Icons</h5>
                    <div className="flex flex-wrap gap-2">
                        <Tag icon="pi pi-user" value="Primary" />
                        <Tag icon="pi pi-check" value="Success" severity="success" />
                        <Tag icon="pi pi-info-circle" value="Info" severity="info" />
                        <Tag icon="pi pi-exclamation-triangle" value="Warning" severity="warning" />
                        <Tag icon="pi pi-times" value="Danger" severity="danger" />
                    </div>
                </div>
            </div>

            {/* Icons with Pill */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Icons with Pill</h5>
                    <div className="flex flex-wrap gap-2">
                        <Tag icon="pi pi-user" value="Primary" rounded />
                        <Tag icon="pi pi-check" value="Success" severity="success" rounded />
                        <Tag icon="pi pi-info-circle" value="Info" severity="info" rounded />
                        <Tag icon="pi pi-exclamation-triangle" value="Warning" severity="warning" rounded />
                        <Tag icon="pi pi-times" value="Danger" severity="danger" rounded />
                    </div>
                </div>
            </div>

            {/* Status Tags */}
            <div className="col-12">
                <div className="card">
                    <h5>Status Tags</h5>
                    <div className="flex flex-wrap gap-2">
                        <Tag value="New" severity="success" icon="pi pi-star" />
                        <Tag value="Active" severity="info" icon="pi pi-check-circle" />
                        <Tag value="Pending" severity="warning" icon="pi pi-clock" />
                        <Tag value="Inactive" severity="danger" icon="pi pi-ban" />
                        <Tag value="Draft" icon="pi pi-pencil" />
                        <Tag value="Archived" icon="pi pi-inbox" />
                    </div>
                </div>
            </div>

            {/* Custom Colors */}
            <div className="col-12">
                <div className="card">
                    <h5>Custom Colors</h5>
                    <div className="flex flex-wrap gap-2">
                        <Tag value="Purple" style={{ backgroundColor: '#9333ea', color: '#ffffff' }} />
                        <Tag value="Pink" style={{ backgroundColor: '#ec4899', color: '#ffffff' }} />
                        <Tag value="Teal" style={{ backgroundColor: '#14b8a6', color: '#ffffff' }} />
                        <Tag value="Cyan" style={{ backgroundColor: '#06b6d4', color: '#ffffff' }} />
                        <Tag value="Indigo" style={{ backgroundColor: '#6366f1', color: '#ffffff' }} />
                    </div>
                </div>
            </div>

            {/* Use Cases */}
            <div className="col-12">
                <div className="card">
                    <h5>Use Cases</h5>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <h6>Product Status</h6>
                            <div className="flex flex-column gap-2">
                                <div className="flex align-items-center justify-content-between">
                                    <span>iPhone 15 Pro</span>
                                    <Tag value="In Stock" severity="success" />
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <span>MacBook Air</span>
                                    <Tag value="Low Stock" severity="warning" />
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <span>iPad Pro</span>
                                    <Tag value="Out of Stock" severity="danger" />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <h6>Order Status</h6>
                            <div className="flex flex-column gap-2">
                                <div className="flex align-items-center justify-content-between">
                                    <span>Order #1234</span>
                                    <Tag value="Delivered" severity="success" icon="pi pi-check" />
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <span>Order #1235</span>
                                    <Tag value="Shipped" severity="info" icon="pi pi-truck" />
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <span>Order #1236</span>
                                    <Tag value="Processing" severity="warning" icon="pi pi-spin pi-spinner" />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <h6>User Roles</h6>
                            <div className="flex flex-column gap-2">
                                <div className="flex align-items-center justify-content-between">
                                    <span>John Doe</span>
                                    <Tag value="Admin" severity="danger" icon="pi pi-shield" />
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <span>Jane Smith</span>
                                    <Tag value="Editor" severity="info" icon="pi pi-pencil" />
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <span>Bob Johnson</span>
                                    <Tag value="Viewer" icon="pi pi-eye" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
