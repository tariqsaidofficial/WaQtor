'use client';

import React from 'react';
import { Chip } from 'primereact/chip';
import { Avatar } from 'primereact/avatar';

export default function ChipPage() {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Chip Component</h5>
                    <p>Chip represents people or filtering options.</p>
                </div>
            </div>

            {/* Basic */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Basic</h5>
                    <div className="flex flex-wrap gap-2">
                        <Chip label="Action" />
                        <Chip label="Comedy" />
                        <Chip label="Mystery" />
                        <Chip label="Thriller" />
                    </div>
                </div>
            </div>

            {/* Icon */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Icon</h5>
                    <div className="flex flex-wrap gap-2">
                        <Chip label="Apple" icon="pi pi-apple" />
                        <Chip label="Facebook" icon="pi pi-facebook" />
                        <Chip label="Google" icon="pi pi-google" />
                        <Chip label="Microsoft" icon="pi pi-microsoft" />
                    </div>
                </div>
            </div>

            {/* Image */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Image</h5>
                    <div className="flex flex-wrap gap-2">
                        <Chip label="Amy Elsner" image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" />
                        <Chip label="Asiya Javayant" image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" />
                        <Chip label="Onyama Limba" image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" />
                    </div>
                </div>
            </div>

            {/* Removable */}
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Removable</h5>
                    <div className="flex flex-wrap gap-2">
                        <Chip label="Action" removable />
                        <Chip label="Comedy" removable />
                        <Chip label="Mystery" removable />
                        <Chip label="Thriller" removable />
                    </div>
                </div>
            </div>

            {/* Custom */}
            <div className="col-12">
                <div className="card">
                    <h5>Custom</h5>
                    <div className="flex flex-wrap gap-2">
                        <Chip 
                            label="Node.js" 
                            image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                        />
                        <Chip 
                            label="React" 
                            image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                        />
                        <Chip 
                            label="TypeScript" 
                            image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                        />
                        <Chip 
                            label="Next.js" 
                            image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                        />
                    </div>
                </div>
            </div>

            {/* Template */}
            <div className="col-12">
                <div className="card">
                    <h5>Template</h5>
                    <div className="flex flex-wrap gap-2">
                        <Chip 
                            template={
                                <div className="flex align-items-center gap-2">
                                    <Avatar icon="pi pi-user" shape="circle" />
                                    <span className="font-medium">John Doe</span>
                                    <i className="pi pi-times cursor-pointer"></i>
                                </div>
                            }
                        />
                        <Chip 
                            template={
                                <div className="flex align-items-center gap-2">
                                    <Avatar label="J" shape="circle" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
                                    <span className="font-medium">Jane Smith</span>
                                    <i className="pi pi-times cursor-pointer"></i>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Use Cases */}
            <div className="col-12">
                <div className="card">
                    <h5>Use Cases</h5>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <h6>Tags</h6>
                            <div className="flex flex-wrap gap-2">
                                <Chip label="JavaScript" icon="pi pi-code" removable />
                                <Chip label="TypeScript" icon="pi pi-code" removable />
                                <Chip label="React" icon="pi pi-code" removable />
                                <Chip label="Vue" icon="pi pi-code" removable />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <h6>Team Members</h6>
                            <div className="flex flex-wrap gap-2">
                                <Chip label="Amy Elsner" image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" removable />
                                <Chip label="Asiya Javayant" image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" removable />
                                <Chip label="Onyama Limba" image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" removable />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <h6>Categories</h6>
                            <div className="flex flex-wrap gap-2">
                                <Chip label="Electronics" icon="pi pi-mobile" />
                                <Chip label="Clothing" icon="pi pi-shopping-bag" />
                                <Chip label="Books" icon="pi pi-book" />
                                <Chip label="Sports" icon="pi pi-star" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styled Chips */}
            <div className="col-12">
                <div className="card">
                    <h5>Styled Chips</h5>
                    <div className="flex flex-wrap gap-2">
                        <Chip label="Primary" style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }} />
                        <Chip label="Success" style={{ backgroundColor: '#16a34a', color: '#ffffff' }} />
                        <Chip label="Info" style={{ backgroundColor: '#3b82f6', color: '#ffffff' }} />
                        <Chip label="Warning" style={{ backgroundColor: '#f59e0b', color: '#ffffff' }} />
                        <Chip label="Danger" style={{ backgroundColor: '#ef4444', color: '#ffffff' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
