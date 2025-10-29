/**
 * SmartBot Service
 * Handles automatic replies based on keyword matching
 */

const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');
const { findMatchingRule } = require('../routes/smartbot');
const { getSmartResponse } = require('../utils/responseVariations');
const { detectLanguage, getLanguageAwareResponse, detectCategory } = require('../utils/languageDetector');
const { checkAndWarn, logProfanityAttempt, censorMessage } = require('../utils/profanityFilter');

// Reply history storage
const HISTORY_FILE = path.join(__dirname, '../data/smartbot-history.json');
let replyHistory = [];

class SmartBotService {
    constructor(waClient) {
        this.waClient = waClient;
        this.client = null;
        this.isInitialized = false;
    }

    /**
     * Initialize SmartBot service
     */
    async initialize() {
        try {
            logger.info('🤖 Initializing SmartBot service...');
            
            // Load reply history
            await this.loadHistory();
            
            // Try to get WhatsApp client (may not be ready yet)
            try {
                this.client = this.waClient.getClient();
            } catch (error) {
                logger.warn('⚠️ SmartBot: WhatsApp client not ready yet, will retry when client is ready');
                this.client = null;
            }
            
            if (!this.client) {
                // Wait for client to be ready
                logger.info('⏳ SmartBot: Waiting for WhatsApp client to be ready...');
                this.setupClientListener();
                return;
            }
            
            // Setup message listener
            this.setupMessageListener();
            
            this.isInitialized = true;
            logger.info('✅ SmartBot service initialized successfully');
            
        } catch (error) {
            logger.error('❌ Failed to initialize SmartBot service:', error);
            // Don't throw - allow server to start
            logger.warn('⚠️ SmartBot will retry when WhatsApp client is ready');
        }
    }

    /**
     * Setup listener for when client becomes ready
     */
    setupClientListener() {
        // Listen for client ready event
        const checkInterval = setInterval(() => {
            try {
                this.client = this.waClient.getClient();
                if (this.client) {
                    clearInterval(checkInterval);
                    logger.info('✅ SmartBot: WhatsApp client is now ready');
                    this.setupMessageListener();
                    this.isInitialized = true;
                }
            } catch (error) {
                // Client still not ready, keep waiting
            }
        }, 5000); // Check every 5 seconds
    }

    /**
     * Setup message listener
     */
    setupMessageListener() {
        if (!this.client) {
            logger.warn('⚠️ SmartBot: Cannot setup message listener - client not available');
            return;
        }

        // Listen for incoming messages
        this.client.on('message', async (message) => {
            await this.handleIncomingMessage(message);
        });

        logger.info('✅ SmartBot: Message listener setup complete');
    }

    /**
     * Load reply history from file
     */
    async loadHistory() {
        try {
            const dataDir = path.join(__dirname, '../data');
            
            // Create data directory if needed
            try {
                await fs.access(dataDir);
            } catch {
                await fs.mkdir(dataDir, { recursive: true });
            }
            
            // Load history
            try {
                const data = await fs.readFile(HISTORY_FILE, 'utf8');
                replyHistory = JSON.parse(data);
                logger.info(`📜 Loaded ${replyHistory.length} SmartBot reply history entries`);
            } catch {
                replyHistory = [];
                await fs.writeFile(HISTORY_FILE, JSON.stringify([], null, 2));
                logger.info('📝 Created new SmartBot history file');
            }
        } catch (error) {
            logger.error('Failed to load SmartBot history:', error);
            replyHistory = [];
        }
    }

    /**
     * Save reply history
     */
    async saveHistory() {
        try {
            // Keep only last 100 entries
            if (replyHistory.length > 100) {
                replyHistory = replyHistory.slice(-100);
            }
            
            await fs.writeFile(HISTORY_FILE, JSON.stringify(replyHistory, null, 2));
        } catch (error) {
            logger.error('Failed to save SmartBot history:', error);
        }
    }

    /**
     * Add entry to reply history
     */
    async addToHistory(ruleId, ruleName, keyword, recipient, message, originalMessage = null) {
        // Censor the message if it contains profanity
        const censored = censorMessage(message);
        
        const entry = {
            id: Date.now().toString(),
            ruleId,
            ruleName,
            keyword,
            recipient,
            message: censored.censored.substring(0, 100), // Censored version
            originalMessage: originalMessage ? originalMessage.substring(0, 100) : null,
            hasProfanity: censored.hasProfanity,
            timestamp: new Date().toISOString()
        };
        
        replyHistory.push(entry);
        await this.saveHistory();
        
        return entry;
    }

    /**
     * Handle incoming WhatsApp message
     */
    async handleIncomingMessage(message) {
        try {
            // Skip if message is from self or is a status update
            if (message.fromMe || message.isStatus) {
                return;
            }
            
            // Skip if no body (media only, etc.)
            if (!message.body) {
                return;
            }
            
            const messageText = message.body.trim();
            const from = message.from;
            
            logger.info(`📨 SmartBot: Received message from ${from}: "${messageText}"`);
            
            // Check for profanity first
            const profanityCheck = checkAndWarn(messageText);
            
            if (profanityCheck.shouldBlock) {
                logger.warn(`🚫 SmartBot: Profanity detected from ${from}`);
                logProfanityAttempt(from, messageText, profanityCheck.detectedWord);
                
                // Send warning message
                await message.reply(profanityCheck.warning);
                
                logger.info(`⚠️ SmartBot: Warning sent to ${from}`);
                return; // Stop processing
            }
            
            // Reload rules to get latest
            const { rulesCache } = require('../routes/smartbot');
            
            logger.info(`🔍 SmartBot: Checking ${rulesCache.length} rules`);
            
            // Find matching rule
            const match = findMatchingRule(messageText);
            
            if (!match) {
                logger.info('ℹ️ SmartBot: No matching rule found');
                return;
            }
            
            const { rule, keyword } = match;
            
            logger.info(`✅ SmartBot: Matched rule "${rule.name}" with keyword "${keyword}"`);
            
            // Send auto-reply
            await this.sendAutoReply(message, rule, keyword);
            
        } catch (error) {
            logger.error('❌ SmartBot: Error handling message:', error);
        }
    }

    /**
     * Send automatic reply with typing indicator
     */
    async sendAutoReply(message, rule, keyword) {
        try {
            const from = message.from;
            const chat = await message.getChat();
            
            // Detect user language
            const userLang = detectLanguage(message.body);
            logger.info(`🌐 SmartBot: Detected language: ${userLang}`);
            
            // Detect category from keywords
            const { category, subcategory } = detectCategory(rule.keywords);
            logger.info(`📂 SmartBot: Category: ${category}/${subcategory}`);
            
            // Get language-aware response
            const langResponse = getLanguageAwareResponse(message.body, rule.replyMessage, category, subcategory);
            
            // Get smart response with variation (anti-ban protection)
            const replyMessage = getSmartResponse(rule.id, langResponse.response);
            
            logger.info(`📤 SmartBot: Preparing auto-reply to ${from}`);
            logger.info(`📝 SmartBot: Original: "${rule.replyMessage.substring(0, 40)}..."`);
            logger.info(`🌐 SmartBot: Language-aware: "${langResponse.response.substring(0, 40)}..."`);
            logger.info(`🎲 SmartBot: Final variation: "${replyMessage.substring(0, 40)}..."`);
            
            // Show typing indicator
            logger.info('⌨️ SmartBot: Showing typing indicator...');
            await chat.sendStateTyping();
            
            // Calculate realistic delay based on message length or use custom delay
            let totalDelay;
            
            if (rule.typingDelay && rule.typingDelay > 0) {
                // Use custom delay from rule
                totalDelay = rule.typingDelay;
                logger.info(`⏱️ SmartBot: Using custom delay: ${(totalDelay / 1000).toFixed(1)}s`);
            } else {
                // Calculate realistic delay based on message length
                // Average typing speed: 40 words per minute = ~150 chars per minute
                const messageLength = replyMessage.length;
                const baseDelay = 2000; // 2 seconds minimum
                const typingDelay = Math.min((messageLength / 150) * 60 * 1000, 5000); // Max 5 seconds
                totalDelay = baseDelay + typingDelay;
                logger.info(`⏱️ SmartBot: Auto-calculated delay: ${(totalDelay / 1000).toFixed(1)}s (based on ${messageLength} chars)`);
            }
            
            // Wait while "typing"
            await new Promise(resolve => setTimeout(resolve, totalDelay));
            
            // Send the reply
            await message.reply(replyMessage);
            
            logger.info('✅ SmartBot: Auto-reply sent successfully');
            
            // Update rule trigger count in cache and save to file
            const { rulesCache } = require('../routes/smartbot');
            const ruleIndex = rulesCache.findIndex(r => r.id === rule.id);
            if (ruleIndex !== -1) {
                rulesCache[ruleIndex].triggerCount = (rulesCache[ruleIndex].triggerCount || 0) + 1;
                rulesCache[ruleIndex].lastTriggered = new Date().toISOString();
                
                // Save updated rules to file
                const fs = require('fs').promises;
                const path = require('path');
                const RULES_FILE = path.join(__dirname, '../data/smartbot-rules.json');
                await fs.writeFile(RULES_FILE, JSON.stringify(rulesCache, null, 2));
                
                logger.info(`📊 SmartBot: Updated trigger count for "${rule.name}" to ${rulesCache[ruleIndex].triggerCount}`);
            }
            
            // Add to history
            await this.addToHistory(
                rule.id,
                rule.name,
                keyword,
                from,
                replyMessage
            );
            
            logger.info(`📊 SmartBot: Rule "${rule.name}" triggered ${rulesCache[ruleIndex]?.triggerCount || 0} times`);
            
        } catch (error) {
            logger.error('❌ SmartBot: Failed to send auto-reply:', error);
            throw error;
        }
    }

    /**
     * Get reply history
     */
    getHistory(limit = 50) {
        return replyHistory.slice(-limit).reverse();
    }

    /**
     * Clear reply history
     */
    async clearHistory() {
        replyHistory = [];
        await this.saveHistory();
        logger.info('🗑️ SmartBot: Reply history cleared');
    }

    /**
     * Get service status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            clientReady: this.client !== null,
            rulesCount: rulesCache.length,
            enabledRulesCount: rulesCache.filter(r => r.enabled).length,
            historyCount: replyHistory.length
        };
    }

    /**
     * Destroy service
     */
    destroy() {
        if (this.client) {
            this.client.removeAllListeners('message');
        }
        this.isInitialized = false;
        logger.info('🛑 SmartBot service destroyed');
    }
}

module.exports = SmartBotService;
