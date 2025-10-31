/**
 * Message Queue Processor
 * Processes messages from the queue
 */

const { messageQueue } = require('./messageQueue');
const waClient = require('../waClient');
const logger = require('../utils/logger');
const { replaceVariables } = require('../utils/variableReplacer');

// Configuration
const MESSAGE_DELAY = parseInt(process.env.MESSAGE_DELAY || '2000'); // 2 seconds between messages
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3');

/**
 * Process bulk message job
 * @param {Object} job - Bull job
 * @returns {Promise<Object>}
 */
async function processBulkMessage(job) {
    const { recipients } = job.data;
    const results = [];
    let successCount = 0;
    let failedCount = 0;

    logger.info(`Processing bulk message job ${job.id} with ${recipients.length} recipients`);

    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        
        try {
            // Update progress
            const progress = Math.round(((i + 1) / recipients.length) * 100);
            await job.progress(progress);

            // Get WhatsApp client
            const client = waClient.getClient();
            if (!client) {
                throw new Error('WhatsApp client not available');
            }

            // Format phone number
            const chatId = recipient.phone.includes('@c.us') 
                ? recipient.phone 
                : `${recipient.phone}@c.us`;

            logger.debug(`Sending message to ${recipient.phone}...`);

            // Replace variables in message
            const finalMessage = replaceVariables(recipient.message, {
                phone: recipient.phone,
                name: recipient.name,
                email: recipient.email,
                company: recipient.company,
                position: recipient.position,
                order_id: recipient.order_id,
                amount: recipient.amount,
                product: recipient.product,
                link: recipient.link,
                custom1: recipient.custom1,
                custom2: recipient.custom2,
                custom3: recipient.custom3,
                signature: recipient.signature
            });

            // Send message
            const sentMessage = await client.sendMessage(chatId, finalMessage);
            
            results.push({
                phone: recipient.phone,
                success: true,
                messageId: sentMessage.id._serialized,
                timestamp: Date.now()
            });

            successCount++;
            logger.info(`✅ Message sent to ${recipient.phone}`);

            // Delay before next message (except for last one)
            if (i < recipients.length - 1) {
                logger.debug(`Waiting ${MESSAGE_DELAY}ms before next message...`);
                await new Promise(resolve => setTimeout(resolve, MESSAGE_DELAY));
            }

        } catch (error) {
            logger.error(`❌ Failed to send message to ${recipient.phone}:`, error.message);
            
            results.push({
                phone: recipient.phone,
                success: false,
                error: error.message,
                timestamp: Date.now()
            });

            failedCount++;
        }
    }

    const result = {
        total: recipients.length,
        successful: successCount,
        failed: failedCount,
        results,
        completedAt: Date.now()
    };

    logger.info(`Bulk message job ${job.id} completed: ${successCount} sent, ${failedCount} failed`);

    return result;
}

/**
 * Process single message job
 * @param {Object} job - Bull job
 * @returns {Promise<Object>}
 */
async function processSingleMessage(job) {
    const { phone, message, ...recipientData } = job.data;

    logger.info(`Processing single message job ${job.id} for ${phone}`);

    try {
        // Get WhatsApp client
        const client = waClient.getClient();
        if (!client) {
            throw new Error('WhatsApp client not available');
        }

        // Format phone number
        const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;

        // Replace variables in message
        const finalMessage = replaceVariables(message, {
            phone: phone,
            ...recipientData
        });

        // Send message
        const sentMessage = await client.sendMessage(chatId, finalMessage);

        const result = {
            phone,
            success: true,
            messageId: sentMessage.id._serialized,
            timestamp: Date.now()
        };

        logger.info(`✅ Single message sent to ${phone}`);

        return result;

    } catch (error) {
        logger.error(`❌ Failed to send message to ${phone}:`, error.message);
        
        throw new Error(`Failed to send message: ${error.message}`);
    }
}

/**
 * Initialize queue processor
 */
function initializeProcessor() {
    logger.info('Initializing message queue processor...');

    // Process bulk messages
    messageQueue.process('send-bulk', async (job) => {
        return await processBulkMessage(job);
    });

    // Process single messages
    messageQueue.process('send-single', async (job) => {
        return await processSingleMessage(job);
    });

    logger.info('Message queue processor initialized');
}

module.exports = {
    initializeProcessor,
    processBulkMessage,
    processSingleMessage
};
