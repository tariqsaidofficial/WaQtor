import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'test-api-key-123';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type') || 'overview';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Build query string
        const params = new URLSearchParams();
        params.append('type', type);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        // Try to call backend API
        try {
            const response = await fetch(`${API_BASE_URL}/api/reports?${params.toString()}`, {
                headers: {
                    'X-API-Key': API_KEY,
                },
                cache: 'no-store',
            });

            if (response.ok) {
                const data = await response.json();
                return NextResponse.json(data);
            }
        } catch (backendError) {
            console.log('Backend not available, using mock data');
        }

        // Return mock data if backend fails
        return NextResponse.json(getMockData());
    } catch (error) {
        console.error('Reports API error:', error);
        // Return mock data on error
        return NextResponse.json(getMockData());
    }
}

function getMockData() {
    // Read real data from SmartBot history
    const fs = require('fs');
    const path = require('path');
    
    try {
        const historyPath = path.join(process.cwd(), '../runtime/server/data/smartbot-history.json');
        const historyData = fs.readFileSync(historyPath, 'utf8');
        const history = JSON.parse(historyData);
        
        // Group by date
        const dailyVolumeMap: Record<string, any> = {};
        
        history.forEach((entry: any) => {
            const date = new Date(entry.timestamp).toISOString().split('T')[0];
            if (!dailyVolumeMap[date]) {
                dailyVolumeMap[date] = {
                    date,
                    sent: 0,
                    delivered: 0,
                    read: 0,
                    failed: 0
                };
            }
            dailyVolumeMap[date].sent++;
            dailyVolumeMap[date].delivered++;
            dailyVolumeMap[date].read++;
        });
        
        const dailyVolume = Object.values(dailyVolumeMap).sort((a: any, b: any) => 
            a.date.localeCompare(b.date)
        );
        
        // Get last 7 days
        const last7Days = dailyVolume.slice(-7);
        
        const totalSent = history.length;
        const totalDelivered = history.length;
        const totalRead = history.length;
        const totalFailed = 0;
        
        // Group by rule
        const rulesMap: Record<string, any> = {};
        history.forEach((entry: any) => {
            if (!rulesMap[entry.ruleId]) {
                rulesMap[entry.ruleId] = {
                    id: entry.ruleId,
                    name: entry.ruleName,
                    sent: 0,
                    delivered: 0,
                    successRate: 100
                };
            }
            rulesMap[entry.ruleId].sent++;
            rulesMap[entry.ruleId].delivered++;
        });
        
        const topCampaigns = Object.values(rulesMap)
            .sort((a: any, b: any) => b.sent - a.sent)
            .slice(0, 5);
        
        return {
            totalMessages: totalSent,
            sentMessages: totalSent,
            deliveredMessages: totalDelivered,
            readMessages: totalRead,
            failedMessages: totalFailed,
            campaignSuccessRate: totalSent > 0 ? parseFloat(((totalDelivered / totalSent) * 100).toFixed(1)) : 0,
            dailyVolume: last7Days,
            topCampaigns
        };
    } catch (error) {
        console.error('Error reading SmartBot history:', error);
        
        // Fallback to empty data
        return {
            totalMessages: 0,
            sentMessages: 0,
            deliveredMessages: 0,
            readMessages: 0,
            failedMessages: 0,
            campaignSuccessRate: 0,
            dailyVolume: [],
            topCampaigns: []
        };
    }
}
