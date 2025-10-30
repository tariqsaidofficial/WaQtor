'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Tag } from 'primereact/tag';
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
    const [appLogo, setAppLogo] = useState<string>('');

    useEffect(() => {
        // Load app logo from localStorage
        const savedLogo = localStorage.getItem('app_logo') || '/layout/images/logo-dark.svg';
        setAppLogo(savedLogo);

        // Listen for branding updates
        const handleBrandingUpdate = () => {
            const updatedLogo = localStorage.getItem('app_logo') || '/layout/images/logo-dark.svg';
            setAppLogo(updatedLogo);
        };

        window.addEventListener('branding-update', handleBrandingUpdate);
        return () => window.removeEventListener('branding-update', handleBrandingUpdate);
    }, []);

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
            color: 'var(--primary-color)',
            status: 'current',
            description: 'SmartBot AI v2, Webhook Dispatcher, WebSocket namespaces'
        },
        {
            version: '2.1.0',
            date: 'September 2025',
            icon: 'pi pi-check',
            color: '#6b7280',
            description: 'Campaign Management, SmartBot auto-reply, Bulk messaging'
        },
        {
            version: '2.0.0',
            date: 'August 2025',
            icon: 'pi pi-check',
            color: '#6b7280',
            description: 'Dashboard redesign, Real-time WebSocket, REST API'
        },
        {
            version: '1.0.0',
            date: 'July 2025',
            icon: 'pi pi-check',
            color: '#6b7280',
            description: 'Initial release with basic messaging features'
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
            icon: 'pi pi-book',
            title: 'Developer Guide',
            description: 'Integration examples and best practices',
            link: '/docs/developer',
            color: '#6b7280'
        }
    ];

    return (
        <div className="about-page">
            <div className="grid">
                {/* Hero Section */}
                <div className="col-12">
                    <Card className="about-hero">
                        <div className="text-center">
                            <div className="mb-3">
                                {appLogo ? (
                                    <img 
                                        src={appLogo} 
                                        alt="WaQtor Logo" 
                                        style={{ height: '4rem', maxWidth: '200px', objectFit: 'contain' }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <i className="pi pi-whatsapp hidden" style={{ fontSize: '4rem', color: 'var(--primary-color)' }}></i>
                            </div>
                            <h1 className="text-5xl font-bold mb-3">WaQtor</h1>
                            <p className="text-xl text-600 mb-3">
                                Professional WhatsApp Automation Platform
                            </p>
                            <div className="flex align-items-center justify-content-center gap-2 mb-4">
                                <Tag value={`v${currentVersion}`} severity="info" style={{ minWidth: '80px' }} />
                                <Tag value={releaseDate} severity="success" style={{ minWidth: '120px' }} />
                                <Tag value="Apache 2.0" icon="pi pi-shield" style={{ minWidth: '110px' }} />
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
                        <div className="version-history-list">
                            {versionHistory.map((version, index) => (
                                <div key={index} className="version-item">
                                    <div className="version-marker" style={{ backgroundColor: version.color }}>
                                        <i className={version.icon}></i>
                                    </div>
                                    <div className="version-content">
                                        <div className="flex align-items-center gap-2 mb-2">
                                            <h3 className="version-number">v{version.version}</h3>
                                            {version.status === 'current' && (
                                                <Tag value="Current" severity="success" />
                                            )}
                                        </div>
                                        <div className="version-date mb-2">{version.date}</div>
                                        <p className="version-description">{version.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Tech Stack */}
                <div className="col-12 lg:col-6">
                    <Card title="Technology Stack">
                        <div className="flex flex-wrap gap-2">
                            <Chip 
                                label="Node.js" 
                                image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                            />
                            <Chip 
                                label="Next.js" 
                                image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
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
                                label="Socket.IO" 
                                image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg"
                            />
                            <Chip 
                                label="SQLite" 
                                image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg"
                            />
                            <Chip label="PrimeReact" icon="pi pi-palette" />
                            <Chip label="Zustand" icon="pi pi-box" />
                            <Chip label="WhatsApp Web.js" icon="pi pi-whatsapp" />
                        </div>
                    </Card>
                </div>

                {/* Support & Contact */}
                <div className="col-12 lg:col-6">
                    <Card title="Support & Contact">
                        <div className="grid">
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column align-items-center text-center gap-2">
                                    <i className="pi pi-envelope text-3xl text-primary"></i>
                                    <div className="font-semibold">Email Support</div>
                                    <a href="mailto:support@dxbmark.com" className="text-600 text-sm">support@dxbmark.com</a>
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column align-items-center text-center gap-2">
                                    <i className="pi pi-github text-3xl text-primary"></i>
                                    <div className="font-semibold">GitHub Issues</div>
                                    <a 
                                        href="https://github.com/tariqsaidofficial/WaQtor/issues" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-600 text-sm"
                                    >
                                        Report bugs
                                    </a>
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column align-items-center text-center gap-2">
                                    <i className="pi pi-globe text-3xl text-primary"></i>
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
                            <h4 className="mb-3">License Information</h4>
                            <div className="mb-4">
                                <p className="text-600 mb-2">
                                    <strong>Dashboard UI:</strong> MIT License - Free to use and modify
                                </p>
                                <p className="text-600 mb-0">
                                    <strong>Core Technology:</strong> Apache License 2.0 - Enterprise ready
                                </p>
                            </div>
                            <div className="flex align-items-center justify-content-center gap-3 flex-wrap">
                                <Button 
                                    label="View License" 
                                    icon="pi pi-file" 
                                    outlined 
                                    onClick={() => window.open('https://www.apache.org/licenses/LICENSE-2.0', '_blank')}
                                />
                                <Button 
                                    label="Documentation" 
                                    icon="pi pi-book" 
                                    onClick={() => window.location.href = '/docs'}
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
