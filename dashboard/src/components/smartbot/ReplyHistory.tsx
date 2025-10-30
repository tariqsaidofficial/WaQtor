/**
 * ReplyHistory Component
 * Display log of recent automatic replies
 */

import React from 'react';
import { Card } from 'primereact/card';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import type { ReplyLog } from '../../app/(main)/smartbot/page';

interface ReplyHistoryProps {
    history: ReplyLog[];
}

export default function ReplyHistory({ history }: ReplyHistoryProps) {
    
    // Format phone number smartly
    const formatRecipient = (recipient: string) => {
        // Remove @c.us or @g.us suffix
        const phone = recipient.replace(/@c\.us|@g\.us/, '');
        
        // Format as international number
        if (phone.length >= 10) {
            // Example: 201229609292 → +20 122 960 9292
            const countryCode = phone.substring(0, phone.length - 9);
            const rest = phone.substring(phone.length - 9);
            const part1 = rest.substring(0, 3);
            const part2 = rest.substring(3, 6);
            const part3 = rest.substring(6);
            
            return `+${countryCode} ${part1} ${part2} ${part3}`;
        }
        
        return phone;
    };
    
    const customizedMarker = (_item: ReplyLog) => {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#14B8A6';
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                style={{ backgroundColor: primaryColor }}>
                <i className="pi pi-send"></i>
            </span>
        );
    };

    const customizedContent = (item: ReplyLog) => {
        return (
            <Card className="mb-3">
                <div className="flex flex-column gap-2">
                    {/* Rule Name */}
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-bolt text-primary"></i>
                        <span className="font-bold">{item.ruleName}</span>
                    </div>

                    {/* Keyword Triggered */}
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-key text-500 text-sm"></i>
                        <Tag value={item.keyword} severity="info" />
                    </div>

                    {/* Recipient */}
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-whatsapp text-success text-sm"></i>
                        <span className="text-sm font-semibold text-700">{formatRecipient(item.recipient)}</span>
                    </div>

                    {/* Message Preview */}
                    <div className="p-2 surface-50 border-round">
                        <p className="m-0 text-sm text-600 line-height-3">
                            {item.message.length > 80 
                                ? item.message.substring(0, 80) + '...' 
                                : item.message
                            }
                        </p>
                    </div>

                    {/* Timestamp */}
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-clock text-500 text-xs"></i>
                        <span className="text-xs text-500">
                            {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                        </span>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <Card>
            <div className="mb-4">
                <h2 className="text-2xl font-bold m-0 mb-2">
                    <i className="pi pi-history mr-2 text-primary"></i>
                    Reply History
                </h2>
                <p className="text-600 m-0">
                    Recent automatic replies sent
                </p>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-6">
                    <i className="pi pi-inbox text-6xl text-400 mb-3"></i>
                    <p className="text-600 text-lg">No replies sent yet</p>
                    <p className="text-500 text-sm">
                        Automatic replies will appear here when triggered
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-3">
                        <Tag 
                            value={`${history.length} Recent Replies`} 
                            severity="success"
                            icon="pi pi-check-circle"
                        />
                    </div>

                    <Timeline 
                        value={history} 
                        align="left"
                        className="customized-timeline"
                        marker={customizedMarker}
                        content={customizedContent}
                    />

                    {history.length > 5 && (
                        <div className="text-center mt-3">
                            <Button
                                label="View All History"
                                icon="pi pi-external-link"
                                link
                                size="small"
                            />
                        </div>
                    )}
                </>
            )}
        </Card>
    );
}
