'use client';

import React from 'react';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Badge } from 'primereact/badge';

export default function AvatarPage() {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Avatar Component</h5>
                    <p>Avatar represents people using icons, labels and images.</p>
                </div>
            </div>

            {/* Label */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Label</h5>
                    <div className="flex flex-wrap gap-3">
                        <Avatar label="P" size="xlarge" />
                        <Avatar label="V" size="large" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
                        <Avatar label="U" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} />
                    </div>
                </div>
            </div>

            {/* Icon */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Icon</h5>
                    <div className="flex flex-wrap gap-3">
                        <Avatar icon="pi pi-user" size="xlarge" />
                        <Avatar icon="pi pi-user" size="large" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
                        <Avatar icon="pi pi-user" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} />
                    </div>
                </div>
            </div>

            {/* Image */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Image</h5>
                    <div className="flex flex-wrap gap-3">
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="xlarge" />
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" size="large" />
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" />
                    </div>
                </div>
            </div>

            {/* Sizes */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Sizes</h5>
                    <div className="flex flex-wrap align-items-end gap-3">
                        <Avatar label="XL" size="xlarge" />
                        <Avatar label="L" size="large" />
                        <Avatar label="N" />
                    </div>
                </div>
            </div>

            {/* Shapes */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Shapes</h5>
                    <div className="flex flex-wrap gap-3">
                        <Avatar label="P" size="xlarge" />
                        <Avatar label="V" size="xlarge" shape="circle" />
                    </div>
                </div>
            </div>

            {/* Badge */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Badge</h5>
                    <div className="flex flex-wrap gap-3">
                        <Avatar icon="pi pi-user" size="xlarge" className="p-overlay-badge">
                            <Badge value="4" severity="danger" />
                        </Avatar>
                        <Avatar label="U" size="large" className="p-overlay-badge" style={{ backgroundColor: '#4caf50', color: '#ffffff' }}>
                            <Badge value="2" severity="success" />
                        </Avatar>
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="p-overlay-badge" shape="circle">
                            <Badge severity="warning" />
                        </Avatar>
                    </div>
                </div>
            </div>

            {/* Avatar Group */}
            <div className="col-12">
                <div className="card">
                    <h5>Avatar Group</h5>
                    <div className="flex flex-column gap-4">
                        <div>
                            <h6>Default</h6>
                            <AvatarGroup>
                                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="large" shape="circle" />
                                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" size="large" shape="circle" />
                                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" size="large" shape="circle" />
                                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" size="large" shape="circle" />
                                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/xuxuefeng.png" size="large" shape="circle" />
                                <Avatar label="+2" size="large" shape="circle" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} />
                            </AvatarGroup>
                        </div>
                        <div>
                            <h6>With Labels</h6>
                            <AvatarGroup>
                                <Avatar label="A" size="large" shape="circle" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
                                <Avatar label="B" size="large" shape="circle" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} />
                                <Avatar label="C" size="large" shape="circle" style={{ backgroundColor: '#f44336', color: '#ffffff' }} />
                                <Avatar label="D" size="large" shape="circle" style={{ backgroundColor: '#4caf50', color: '#ffffff' }} />
                                <Avatar label="+5" size="large" shape="circle" style={{ backgroundColor: '#607d8b', color: '#ffffff' }} />
                            </AvatarGroup>
                        </div>
                    </div>
                </div>
            </div>

            {/* Use Cases */}
            <div className="col-12">
                <div className="card">
                    <h5>Use Cases</h5>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <h6>User Profile</h6>
                            <div className="flex align-items-center gap-3">
                                <Avatar 
                                    label="JD" 
                                    size="xlarge" 
                                    shape="circle"
                                    style={{ backgroundColor: '#0f766e', color: '#ffffff' }}
                                />
                                <div>
                                    <div className="font-semibold">John Doe</div>
                                    <div className="text-sm text-500">john.doe@example.com</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <h6>Online Status</h6>
                            <div className="flex align-items-center gap-3">
                                <Avatar 
                                    image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" 
                                    size="xlarge" 
                                    shape="circle"
                                    className="p-overlay-badge"
                                >
                                    <Badge severity="success" />
                                </Avatar>
                                <div>
                                    <div className="font-semibold">Amy Elsner</div>
                                    <div className="text-sm text-500">Online</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <h6>Notifications</h6>
                            <div className="flex align-items-center gap-3">
                                <Avatar 
                                    icon="pi pi-bell" 
                                    size="xlarge" 
                                    shape="circle"
                                    style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}
                                    className="p-overlay-badge"
                                >
                                    <Badge value="12" severity="danger" />
                                </Avatar>
                                <div>
                                    <div className="font-semibold">Notifications</div>
                                    <div className="text-sm text-500">12 unread messages</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <div className="col-12">
                <div className="card">
                    <h5>Custom Styles</h5>
                    <div className="flex flex-wrap gap-3">
                        <Avatar 
                            label="A" 
                            size="xlarge" 
                            shape="circle"
                            style={{ 
                                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: '#ffffff',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}
                        />
                        <Avatar 
                            icon="pi pi-star" 
                            size="xlarge" 
                            shape="circle"
                            style={{ 
                                backgroundColor: '#fbbf24',
                                color: '#ffffff'
                            }}
                        />
                        <Avatar 
                            label="VIP" 
                            size="xlarge"
                            style={{ 
                                backgroundColor: '#dc2626',
                                color: '#ffffff',
                                borderRadius: '8px'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
