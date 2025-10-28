/**
 * Campaign Executor Service
 * Executes campaigns by sending messages to recipients
 */

const logger = require('../utils/logger');
const db = require('../db/db');

class CampaignExecutor {
    constructor(waClient) {
        this.waClient = waClient;
    }

    /**
     * Execute a campaign
     * Send messages to all recipients
     */
    async executeCampaign(campaignId) {
        try {
            // Get campaign details
            const campaign = await db.getCampaignById(campaignId);
            
            if (!campaign) {
                logger.error(`Campaign ${campaignId} not found`);
                return { success: false, error: 'Campaign not found' };
            }

            if (campaign.status === 'completed') {
                logger.warn(`Campaign ${campaignId} already completed`);
                return { success: false, error: 'Campaign already completed' };
            }

            // Update status to running
            await db.updateCampaignStatus(campaignId, 'running');
            logger.info(`Starting campaign execution: ${campaign.name} (ID: ${campaignId})`);

            // Parse recipients
            let recipients;
            try {
                recipients = typeof campaign.recipients === 'string' 
                    ? JSON.parse(campaign.recipients) 
                    : campaign.recipients;
            } catch (e) {
                logger.error('Failed to parse recipients:', e);
                await db.updateCampaignStatus(campaignId, 'failed');
                return { success: false, error: 'Invalid recipients format' };
            }

            // Get WhatsApp client
            const client = this.waClient.getClient();

            // Results tracking
            const results = {
                total: recipients.length,
                sent: 0,
                failed: 0,
                errors: []
            };

            // Send messages to all recipients
            for (const recipient of recipients) {
                try {
                    // Format chat ID
                    const chatId = recipient.includes('@c.us') ? recipient : `${recipient}@c.us`;
                    
                    // Send message
                    const sentMessage = await client.sendMessage(chatId, campaign.message);
                    
                    // Log success
                    await db.logMessage({
                        phone: chatId,
                        message: campaign.message,
                        messageType: 'campaign',
                        status: 'sent',
                        messageId: sentMessage.id._serialized
                    });

                    results.sent++;
                    logger.info(`Campaign message sent to ${chatId}`);

                    // Add delay between messages to avoid rate limiting
                    await this.delay(2000); // 2 seconds delay

                } catch (error) {
                    results.failed++;
                    results.errors.push({
                        recipient,
                        error: error.message
                    });
                    
                    logger.error(`Failed to send campaign message to ${recipient}:`, error);

                    // Log failure
                    await db.logMessage({
                        phone: recipient,
                        message: campaign.message,
                        messageType: 'campaign',
                        status: 'failed',
                        messageId: null
                    });
                }
            }

            // Update campaign status
            const finalStatus = results.failed === 0 ? 'completed' : 'partial';
            await db.updateCampaignStatus(campaignId, finalStatus);

            logger.info(`Campaign execution completed: ${campaign.name}`, results);

            return {
                success: true,
                results,
                campaign: {
                    id: campaignId,
                    name: campaign.name,
                    status: finalStatus
                }
            };

        } catch (error) {
            logger.error('Campaign execution error:', error);
            await db.updateCampaignStatus(campaignId, 'failed');
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Execute campaign immediately (on-demand)
     */
    async executeNow(campaignId) {
        logger.info(`Executing campaign ${campaignId} immediately`);
        return this.executeCampaign(campaignId);
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = CampaignExecutor;
