'use client';

import React from 'react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';

export default function BadgePage() {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Badge Component</h5>
                    <p>Badge is a small status indicator for another element.</p>
                </div>
            </div>

            {/* Basic */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Basic</h5>
                    <div className="flex flex-wrap gap-3">
                        <Badge value="2" />
                        <Badge value="8" severity="success" />
                        <Badge value="4" severity="info" />
                        <Badge value="12" severity="warning" />
                        <Badge value="3" severity="danger" />
                    </div>
                </div>
            </div>

            {/* Pill */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Pill</h5>
                    <div className="flex flex-wrap gap-3">
                        <Badge value="2" />
                        <Badge value="8" severity="success" />
                        <Badge value="4" severity="info" />
                        <Badge value="12" severity="warning" />
                        <Badge value="3" severity="danger" />
                    </div>
                </div>
            </div>

            {/* Positioned Badge */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Positioned Badge</h5>
                    <div className="flex flex-wrap gap-4">
                        <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '2rem' }}>
                            <Badge value="2" />
                        </i>
                        <i className="pi pi-calendar p-overlay-badge" style={{ fontSize: '2rem' }}>
                            <Badge value="5+" severity="danger" />
                        </i>
                        <i className="pi pi-envelope p-overlay-badge" style={{ fontSize: '2rem' }}>
                            <Badge severity="warning" />
                        </i>
                    </div>
                </div>
            </div>

            {/* Button Badge */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Button Badge</h5>
                    <div className="flex flex-wrap gap-3">
                        <Button type="button" label="Emails" badge="8" />
                        <Button type="button" label="Messages" icon="pi pi-users" outlined badge="8" badgeClassName="p-badge-danger" />
                        <Button type="button" label="Notifications" icon="pi pi-bell" outlined badge="2" badgeClassName="p-badge-warning" />
                    </div>
                </div>
            </div>

            {/* Sizes */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Sizes</h5>
                    <div className="flex flex-wrap align-items-center gap-3">
                        <Badge value="2" size="xlarge" severity="success" />
                        <Badge value="4" size="large" severity="warning" />
                        <Badge value="6" />
                        <Badge value="8" size="large" severity="danger" />
                        <Badge value="10" size="xlarge" severity="info" />
                    </div>
                </div>
            </div>

            {/* Avatar Badge */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Avatar Badge</h5>
                    <div className="flex flex-wrap gap-4">
                        <Avatar label="U" className="p-overlay-badge" size="xlarge">
                            <Badge value="4" severity="danger" />
                        </Avatar>
                        <Avatar icon="pi pi-user" className="p-overlay-badge" size="xlarge" style={{ backgroundColor: '#4caf50', color: '#ffffff' }}>
                            <Badge value="2" severity="success" />
                        </Avatar>
                        <Avatar label="A" className="p-overlay-badge" size="xlarge" style={{ backgroundColor: '#2196F3', color: '#ffffff' }}>
                            <Badge severity="warning" />
                        </Avatar>
                    </div>
                </div>
            </div>

            {/* Inline Badge */}
            <div className="col-12">
                <div className="card">
                    <h5>Inline Badge</h5>
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <h6 className="mb-2">Notifications</h6>
                            <div className="flex align-items-center gap-2">
                                <span>New Messages</span>
                                <Badge value="5" severity="danger" />
                            </div>
                        </div>
                        <div>
                            <h6 className="mb-2">Tasks</h6>
                            <div className="flex align-items-center gap-2">
                                <span>Pending</span>
                                <Badge value="12" severity="warning" />
                            </div>
                        </div>
                        <div>
                            <h6 className="mb-2">Status</h6>
                            <div className="flex align-items-center gap-2">
                                <span>Active Users</span>
                                <Badge value="42" severity="success" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
