'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Tag } from 'primereact/tag';
import { Timeline } from 'primereact/timeline';
import { Chip } from 'primereact/chip';
import './about.css';

interface Feature {
    icon: string;
    title: string;
    description: string;
    color: string;
}

interface FAQ {
    question: string;
    answer: string;
}


export default function AboutPage() {
    const [activeIndex, setActiveIndex] = useState<number | number[] | null>(null);

    // App Version Info
    const currentVersion = '2.2.0';
    const releaseDate = 'October 2025';

    // Core Features
    const features: Feature[] = [
        {
            icon: 'pi pi-send',
            title: 'Smart Messaging',
            description: 'Send text, media, buttons, and interactive messages with ease',
            color: '#10b981'
        },
        {
            icon: 'pi pi-megaphone',
            title: 'Campaign Management',
            description: 'Create and execute bulk messaging campaigns with advanced scheduling',
            color: '#3b82f6'
        },
        {
            icon: 'pi pi-bolt',
            title: 'SmartBot AI',
            description: 'Automated responses with semantic matching and learning capabilities',
            color: '#f59e0b'
        },
        {
            icon: 'pi pi-chart-line',
            title: 'Real-time Analytics',
            description: 'Monitor performance with live statistics and detailed reports',
            color: '#8b5cf6'
        },
        {
            icon: 'pi pi-globe',
            title: 'Webhook Integration',
            description: 'Connect with external services using secure HMAC webhooks',
            color: '#ec4899'
        },
        {
            icon: 'pi pi-shield',
            title: 'Enterprise Security',
            description: 'API key authentication, rate limiting, and data encryption',
            color: '#ef4444'
        }
    ];

    // FAQ Data
    const faqs: FAQ[] = [
        {
            question: 'What is WaQtor?',
            answer: 'WaQtor is a powerful WhatsApp automation platform that enables businesses to send bulk messages, manage campaigns, and automate customer interactions using AI-powered smart responses.'
        },
        {
            question: 'How do I get started?',
            answer: 'Simply scan the QR code on the dashboard to connect your WhatsApp account. Once connected, you can start sending messages, creating campaigns, and setting up SmartBot rules.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes! WaQtor uses industry-standard encryption, API key authentication, and follows best security practices. Your session data is stored locally and never shared with third parties.'
        },
        {
            question: 'Can I use multiple WhatsApp accounts?',
            answer: 'Currently, WaQtor supports one active WhatsApp session at a time. Multi-instance support is planned for future releases.'
        },
        {
            question: 'What are the API rate limits?',
            answer: 'Rate limits depend on your plan. The free plan includes 1,000 API requests and 5,000 messages per month. Upgrade to premium for higher limits.'
        },
        {
            question: 'How does SmartBot work?',
            answer: 'SmartBot uses semantic matching with AI embeddings to understand customer queries and provide relevant automated responses. It learns from interactions and improves over time.'
        },
        {
            question: 'Can I integrate WaQtor with my existing systems?',
            answer: 'Yes! WaQtor provides REST APIs, WebSocket connections, and Webhooks for seamless integration with your applications. SDKs for Node.js and Python are also available.'
        },
        {
            question: 'What happens if I disconnect?',
            answer: 'If your WhatsApp session disconnects, WaQtor will automatically attempt to reconnect. You may need to scan the QR code again if the session expires.'
        }
    ];

    // Version History
    const versionHistory = [
        {
            version: '2.2.0',
            date: 'October 2025',
            icon: 'pi pi-star',
            color: '#10b981',
            status: 'current'
        },
        {
            version: '2.1.0',
            date: 'September 2025',
            icon: 'pi pi-check',
            color: '#3b82f6'
        },
        {
            version: '2.0.0',
            date: 'August 2025',
            icon: 'pi pi-check',
            color: '#8b5cf6'
        },
        {
            version: '1.0.0',
            date: 'July 2025',
            icon: 'pi pi-check',
            color: '#6b7280'
        }
    ];

    // Documentation Links
    const docLinks = [
        {
            icon: 'pi pi-book',
            title: 'Quick Start Guide',
            description: 'Get up and running in 5 minutes',
            link: '/docs/quick-start',
            color: '#10b981'
        },
        {
            icon: 'pi pi-code',
            title: 'API Documentation',
            description: 'Complete REST API reference',
            link: '/docs/api',
            color: '#3b82f6'
        },
        {
            icon: 'pi pi-users',
            title: 'User Manual',
            description: 'Detailed usage instructions',
            link: '/docs/manual',
            color: '#f59e0b'
        },
        {
            icon: 'pi pi-github',
            title: 'GitHub Repository',
            description: 'View source code and contribute',
            link: 'https://github.com/tariqsaidofficial/WaQtor',
            color: '#6b7280'
        }
    ];

    const customizedMarker = (item: any) => {
        return (
            <span 
                className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                style={{ backgroundColor: item.color }}
            >
                <i className={item.icon}></i>
            </span>
        );
    };

    const customizedContent = (item: any) => {
        return (
            <div>
                <div className="flex align-items-center gap-2 mb-1">
                    <h4 className="m-0">Version {item.version}</h4>
                    {item.status === 'current' && (
                        <Tag value="Current" severity="success" />
                    )}
                </div>
                <span className="text-500 text-sm">{item.date}</span>
            </div>
        );
    };

    return (
        <div className="about-page">
            <div className="grid">
                {/* Hero Section */}
                <div className="col-12">
                    <Card className="about-hero">
                        <div className="text-center">
                            <div className="mb-3">
                                <i className="pi pi-whatsapp" style={{ fontSize: '4rem', color: 'var(--primary-color)' }}></i>
                            </div>
                            <h1 className="text-5xl font-bold mb-3">WaQtor</h1>
                            <p className="text-xl text-600 mb-3">
                                Professional WhatsApp Automation Platform
                            </p>
                            <div className="flex align-items-center justify-content-center gap-2 mb-4">
                                <Tag value={`Version ${currentVersion}`} severity="info" />
                                <Tag value={releaseDate} severity="success" />
                                <Tag value="Open Source" icon="pi pi-github" />
                            </div>
                            <p className="text-600 max-w-30rem mx-auto">
                                Streamline your WhatsApp communication with powerful automation, 
                                AI-powered responses, and enterprise-grade features.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Key Features */}
                <div className="col-12">
                    <Card title="Key Features" subTitle="Everything you need to automate WhatsApp">
                        <div className="grid">
                            {features.map((feature, index) => (
                                <div key={index} className="col-12 md:col-6 lg:col-4">
                                    <div className="feature-card p-3 border-round hover:surface-hover transition-colors transition-duration-150">
                                        <div className="flex align-items-start gap-3">
                                            <div 
                                                className="flex align-items-center justify-content-center border-circle"
                                                style={{ 
                                                    width: '3rem', 
                                                    height: '3rem',
                                                    backgroundColor: `${feature.color}20`,
                                                    color: feature.color
                                                }}
                                            >
                                                <i className={feature.icon} style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="mt-0 mb-2">{feature.title}</h4>
                                                <p className="text-600 mt-0 mb-0 text-sm">{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Documentation Links */}
                <div className="col-12">
                    <Card title="Documentation" subTitle="Learn how to use WaQtor">
                        <div className="grid">
                            {docLinks.map((doc, index) => (
                                <div key={index} className="col-12 md:col-6">
                                    <div 
                                        className="doc-link-card p-4 border-round cursor-pointer hover:surface-hover transition-colors transition-duration-150"
                                        onClick={() => {
                                            if (doc.link.startsWith('http')) {
                                                window.open(doc.link, '_blank');
                                            } else {
                                                window.location.href = doc.link;
                                            }
                                        }}
                                    >
                                        <div className="flex align-items-center gap-3">
                                            <div 
                                                className="flex align-items-center justify-content-center border-circle"
                                                style={{ 
                                                    width: '3rem', 
                                                    height: '3rem',
                                                    backgroundColor: `${doc.color}20`,
                                                    color: doc.color
                                                }}
                                            >
                                                <i className={doc.icon} style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="mt-0 mb-1">{doc.title}</h4>
                                                <p className="text-600 mt-0 mb-0 text-sm">{doc.description}</p>
                                            </div>
                                            <i className="pi pi-arrow-right text-500"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* FAQ Section */}
                <div className="col-12">
                    <Card title="Frequently Asked Questions" subTitle="Find answers to common questions">
                        <Accordion 
                            activeIndex={activeIndex} 
                            onTabChange={(e) => setActiveIndex(e.index)}
                        >
                            {faqs.map((faq, index) => (
                                <AccordionTab 
                                    key={index} 
                                    header={
                                        <div className="flex align-items-center gap-2">
                                            <i className="pi pi-question-circle text-primary"></i>
                                            <span className="font-semibold">{faq.question}</span>
                                        </div>
                                    }
                                >
                                    <p className="m-0 text-600 line-height-3">{faq.answer}</p>
                                </AccordionTab>
                            ))}
                        </Accordion>
                    </Card>
                </div>

                {/* Version History */}
                <div className="col-12">
                    <Card title="Version History" subTitle="Track our progress and updates">
                        <Timeline 
                            value={versionHistory} 
                            align="alternate" 
                            marker={customizedMarker}
                            content={customizedContent}
                        />
                    </Card>
                </div>

                {/* Tech Stack */}
                <div className="col-12 lg:col-6">
                    <Card title="Technology Stack">
                        <div className="flex flex-wrap gap-2">
                            <Chip label="Node.js" icon="pi pi-server" />
                            <Chip label="Next.js" icon="pi pi-code" />
                            <Chip label="React" icon="pi pi-code" />
                            <Chip label="TypeScript" icon="pi pi-code" />
                            <Chip label="Socket.IO" icon="pi pi-bolt" />
                            <Chip label="SQLite" icon="pi pi-database" />
                            <Chip label="PrimeReact" icon="pi pi-palette" />
                            <Chip label="Zustand" icon="pi pi-box" />
                            <Chip label="Whatsapp-web.js" icon="pi pi-whatsapp" />
                        </div>
                    </Card>
                </div>

                {/* Support & Contact */}
                <div className="col-12 lg:col-6">
                    <Card title="Support & Contact">
                        <div className="flex flex-column gap-3">
                            <div className="flex align-items-center gap-3">
                                <i className="pi pi-envelope text-2xl text-primary"></i>
                                <div>
                                    <div className="font-semibold">Email Support</div>
                                    <a href="mailto:support@waqtor.com" className="text-600 text-sm">support@waqtor.com</a>
                                </div>
                            </div>
                            <Divider />
                            <div className="flex align-items-center gap-3">
                                <i className="pi pi-github text-2xl text-primary"></i>
                                <div>
                                    <div className="font-semibold">GitHub Issues</div>
                                    <a 
                                        href="https://github.com/tariqsaidofficial/WaQtor/issues" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-600 text-sm"
                                    >
                                        Report bugs or request features
                                    </a>
                                </div>
                            </div>
                            <Divider />
                            <div className="flex align-items-center gap-3">
                                <i className="pi pi-globe text-2xl text-primary"></i>
                                <div>
                                    <div className="font-semibold">Website</div>
                                    <a 
                                        href="https://waqtor.dxbmark.com" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-600 text-sm"
                                    >
                                        waqtor.dxbmark.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* License & Credits */}
                <div className="col-12">
                    <Card>
                        <div className="text-center">
                            <h4 className="mb-3">Open Source License</h4>
                            <p className="text-600 mb-4">
                                WaQtor is released under the MIT License. Feel free to use, modify, and distribute.
                            </p>
                            <div className="flex align-items-center justify-content-center gap-3 flex-wrap">
                                <Button 
                                    label="View License" 
                                    icon="pi pi-file" 
                                    outlined 
                                    onClick={() => window.open('https://github.com/tariqsaidofficial/WaQtor/blob/main/LICENSE', '_blank')}
                                />
                                <Button 
                                    label="Star on GitHub" 
                                    icon="pi pi-github" 
                                    onClick={() => window.open('https://github.com/tariqsaidofficial/WaQtor', '_blank')}
                                />
                                <Button 
                                    label="Report Issue" 
                                    icon="pi pi-exclamation-circle" 
                                    severity="warning"
                                    outlined
                                    onClick={() => window.open('https://github.com/tariqsaidofficial/WaQtor/issues/new', '_blank')}
                                />
                            </div>
                            <Divider />
                            <p className="text-500 text-sm mb-0">
                                Made with <i className="pi pi-heart-fill text-red-500"></i> by the WaQtor Team
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
