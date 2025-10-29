/**
 * Reports API Routes
 * Provides analytics and reporting data
 */

const express = require('express');
const router = express.Router();
const db = require('../db/db');
const logger = require('../utils/logger');

/**
 * GET /api/reports
 * Get report data based on filters
 */
router.get('/', async (req, res) => {
    try {
        const { type = 'overview', startDate, endDate } = req.query;
        
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        
        logger.info(`Fetching ${type} report from ${start.toISOString()} to ${end.toISOString()}`);
        
        let reportData;
        
        switch (type) {
            case 'overview':
                reportData = await getOverviewReport(start, end);
                break;
            case 'campaigns':
                reportData = await getCampaignsReport(start, end);
                break;
            case 'messages':
                reportData = await getMessagesReport(start, end);
                break;
            case 'smartbot':
                reportData = await getSmartBotReport(start, end);
                break;
            default:
                reportData = await getOverviewReport(start, end);
        }
        
        res.json(reportData);
    } catch (error) {
        logger.error('Failed to fetch report data:', error);
        res.status(500).json({ error: 'Failed to fetch report data' });
    }
});

/**
 * POST /api/reports/export
 * Export report as PDF
 */
router.post('/export', async (req, res) => {
    try {
        const { type = 'overview', startDate, endDate } = req.body;
        
        // TODO: Implement PDF generation
        // For now, return a simple response
        res.json({ message: 'PDF export will be implemented soon' });
    } catch (error) {
        logger.error('Failed to export report:', error);
        res.status(500).json({ error: 'Failed to export report' });
    }
});

/**
 * Get overview report data
 */
async function getOverviewReport(startDate, endDate) {
    try {
        // Get total messages
        const totalMessages = await db.query(
            'SELECT COUNT(*) as count FROM messages WHERE timestamp BETWEEN ? AND ?',
            [startDate.toISOString(), endDate.toISOString()]
        );
        
        // Get messages by status
        const messagesByStatus = await db.query(
            `SELECT 
                status,
                COUNT(*) as count
            FROM messages 
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY status`,
            [startDate.toISOString(), endDate.toISOString()]
        );
        
        const statusCounts = {
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0
        };
        
        messagesByStatus.forEach(row => {
            if (row.status in statusCounts) {
                statusCounts[row.status] = row.count;
            }
        });
        
        // Calculate success rate
        const total = totalMessages[0]?.count || 0;
        const delivered = statusCounts.delivered + statusCounts.read;
        const successRate = total > 0 ? (delivered / total) * 100 : 0;
        
        // Get daily volume
        const dailyVolume = await db.query(
            `SELECT 
                DATE(timestamp) as date,
                SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
                SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
                SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
            FROM messages
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY DATE(timestamp)
            ORDER BY date ASC`,
            [startDate.toISOString(), endDate.toISOString()]
        );
        
        // Get top campaigns
        const topCampaigns = await db.query(
            `SELECT 
                c.id,
                c.name,
                COUNT(m.id) as sent,
                SUM(CASE WHEN m.status IN ('delivered', 'read') THEN 1 ELSE 0 END) as delivered,
                (SUM(CASE WHEN m.status IN ('delivered', 'read') THEN 1 ELSE 0 END) * 100.0 / COUNT(m.id)) as successRate
            FROM campaigns c
            LEFT JOIN messages m ON c.id = m.campaignId
            WHERE c.createdAt BETWEEN ? AND ?
            GROUP BY c.id, c.name
            HAVING COUNT(m.id) > 0
            ORDER BY successRate DESC
            LIMIT 10`,
            [startDate.toISOString(), endDate.toISOString()]
        );
        
        return {
            totalMessages: total,
            sentMessages: statusCounts.sent,
            deliveredMessages: statusCounts.delivered,
            readMessages: statusCounts.read,
            failedMessages: statusCounts.failed,
            campaignSuccessRate: successRate,
            dailyVolume: dailyVolume.map(row => ({
                date: row.date,
                sent: row.sent || 0,
                delivered: row.delivered || 0,
                read: row.read || 0,
                failed: row.failed || 0
            })),
            topCampaigns: topCampaigns.map(row => ({
                id: row.id,
                name: row.name,
                sent: row.sent,
                delivered: row.delivered,
                successRate: parseFloat(row.successRate) || 0
            }))
        };
    } catch (error) {
        logger.error('Failed to get overview report:', error);
        throw error;
    }
}

/**
 * Get campaigns report data
 */
async function getCampaignsReport(startDate, endDate) {
    // Similar to overview but focused on campaigns
    return getOverviewReport(startDate, endDate);
}

/**
 * Get messages report data
 */
async function getMessagesReport(startDate, endDate) {
    // Similar to overview but focused on messages
    return getOverviewReport(startDate, endDate);
}

/**
 * Get SmartBot report data
 */
async function getSmartBotReport(startDate, endDate) {
    try {
        const fs = require('fs').promises;
        const path = require('path');
        const historyFile = path.join(__dirname, '../data/smartbot-history.json');
        
        let history = [];
        try {
            const data = await fs.readFile(historyFile, 'utf8');
            history = JSON.parse(data);
        } catch (error) {
            logger.warn('SmartBot history file not found');
        }
        
        // Filter by date range
        const filtered = history.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= startDate && entryDate <= endDate;
        });
        
        // Group by date
        const dailyVolume = {};
        filtered.forEach(entry => {
            const date = new Date(entry.timestamp).toISOString().split('T')[0];
            if (!dailyVolume[date]) {
                dailyVolume[date] = { date, sent: 0, delivered: 0, read: 0, failed: 0 };
            }
            dailyVolume[date].sent++;
            dailyVolume[date].delivered++;
            dailyVolume[date].read++;
        });
        
        // Group by rule
        const ruleStats = {};
        filtered.forEach(entry => {
            if (!ruleStats[entry.ruleId]) {
                ruleStats[entry.ruleId] = {
                    id: entry.ruleId,
                    name: entry.ruleName,
                    sent: 0,
                    delivered: 0,
                    successRate: 100
                };
            }
            ruleStats[entry.ruleId].sent++;
            ruleStats[entry.ruleId].delivered++;
        });
        
        return {
            totalMessages: filtered.length,
            sentMessages: filtered.length,
            deliveredMessages: filtered.length,
            readMessages: filtered.length,
            failedMessages: 0,
            campaignSuccessRate: 100,
            dailyVolume: Object.values(dailyVolume),
            topCampaigns: Object.values(ruleStats).slice(0, 10)
        };
    } catch (error) {
        logger.error('Failed to get SmartBot report:', error);
        throw error;
    }
}

module.exports = router;
