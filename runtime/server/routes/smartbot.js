/**
 * SmartBot Routes
 * Auto-reply rules management and keyword matching
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');
const { enhancedMatch } = require('../utils/smartMatcher');

// Rules storage file
const RULES_FILE = path.join(__dirname, '../data/smartbot-rules.json');

// In-memory cache
let rulesCache = [];

/**
 * Initialize rules storage
 */
async function initializeRulesStorage() {
    try {
        const dataDir = path.join(__dirname, '../data');
        
        // Create data directory if it doesn't exist
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
            logger.info('📁 Created data directory for SmartBot');
        }
        
        // Load existing rules or create empty file
        try {
            const data = await fs.readFile(RULES_FILE, 'utf8');
            rulesCache = JSON.parse(data);
            logger.info(`✅ Loaded ${rulesCache.length} SmartBot rules`);
        } catch {
            rulesCache = [];
            await fs.writeFile(RULES_FILE, JSON.stringify([], null, 2));
            logger.info('📝 Created new SmartBot rules file');
        }
    } catch (error) {
        logger.error('Failed to initialize SmartBot storage:', error);
        rulesCache = [];
    }
}

/**
 * Save rules to file
 */
async function saveRules() {
    try {
        await fs.writeFile(RULES_FILE, JSON.stringify(rulesCache, null, 2));
        logger.info(`💾 Saved ${rulesCache.length} SmartBot rules`);
    } catch (error) {
        logger.error('Failed to save SmartBot rules:', error);
        throw error;
    }
}

/**
 * Match message against rules
 */
function matchKeyword(message, keyword, matchType, caseSensitive) {
    const msg = caseSensitive ? message : message.toLowerCase();
    const kw = caseSensitive ? keyword : keyword.toLowerCase();
    
    switch (matchType) {
        case 'exact':
            return msg === kw;
        case 'startsWith':
            return msg.startsWith(kw);
        case 'endsWith':
            return msg.endsWith(kw);
        case 'contains':
        default:
            return msg.includes(kw);
    }
}

/**
 * Find matching rule for a message (with AI-powered smart matching)
 */
function findMatchingRule(message) {
    if (!message || typeof message !== 'string') {
        return null;
    }
    
    // Get only enabled rules
    const enabledRules = rulesCache.filter(rule => rule.enabled);
    
    // Try enhanced matching first
    for (const rule of enabledRules) {
        const result = enhancedMatch(message, rule);
        
        if (result.matched) {
            return { 
                rule, 
                keyword: result.keyword,
                confidence: result.confidence,
                method: result.method,
                corrected: result.corrected,
                typo: result.typo
            };
        }
    }
    
    // Fallback to basic matching
    for (const rule of enabledRules) {
        for (const keyword of rule.keywords) {
            if (matchKeyword(message, keyword, rule.matchType, rule.caseSensitive)) {
                logger.info(`✅ SmartBot: Rule "${rule.name}" matched keyword "${keyword}"`);
                return { rule, keyword, confidence: 100, method: 'basic' };
            }
        }
    }
    
    return null;
}

/**
 * GET /api/smartbot/rules
 * Get all rules
 */
router.get('/rules', async (req, res) => {
    try {
        // Reload from file to get latest data
        await initializeRulesStorage();
        
        res.json({
            success: true,
            data: rulesCache,
            count: rulesCache.length
        });
    } catch (error) {
        logger.error('Error getting SmartBot rules:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get rules',
            message: error.message
        });
    }
});

/**
 * GET /api/smartbot/rules/:id
 * Get a specific rule
 */
router.get('/rules/:id', async (req, res) => {
    try {
        const rule = rulesCache.find(r => r.id === req.params.id);
        
        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }
        
        res.json({
            success: true,
            data: rule
        });
    } catch (error) {
        logger.error('Error getting SmartBot rule:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get rule',
            message: error.message
        });
    }
});

/**
 * POST /api/smartbot/rules
 * Create a new auto-reply rule
 */
router.post('/rules', async (req, res) => {
    try {
        const { name, keywords, replyMessage, matchType, caseSensitive } = req.body;
        
        // Validation
        if (!name || !keywords || !replyMessage) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, keywords, replyMessage'
            });
        }
        
        if (!Array.isArray(keywords) || keywords.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Keywords must be a non-empty array'
            });
        }
        
        // Create new rule
        const newRule = {
            id: Date.now().toString(),
            name,
            keywords,
            replyMessage,
            enabled: true,
            matchType: matchType || 'contains',
            caseSensitive: caseSensitive || false,
            createdAt: new Date().toISOString(),
            triggerCount: 0
        };
        
        rulesCache.push(newRule);
        await saveRules();
        
        logger.info(`✅ SmartBot: Created rule "${name}" with ${keywords.length} keywords`);
        
        res.status(201).json({
            success: true,
            data: newRule,
            message: 'Rule created successfully'
        });
    } catch (error) {
        logger.error('Error creating SmartBot rule:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create rule',
            message: error.message
        });
    }
});

/**
 * PUT /api/smartbot/rules/:id
 * Update an existing rule
 */
router.put('/rules/:id', async (req, res) => {
    try {
        const ruleIndex = rulesCache.findIndex(r => r.id === req.params.id);
        
        if (ruleIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }
        
        const { name, keywords, replyMessage, enabled, matchType, caseSensitive } = req.body;
        
        // Update rule
        const updatedRule = {
            ...rulesCache[ruleIndex],
            name: name !== undefined ? name : rulesCache[ruleIndex].name,
            keywords: keywords !== undefined ? keywords : rulesCache[ruleIndex].keywords,
            replyMessage: replyMessage !== undefined ? replyMessage : rulesCache[ruleIndex].replyMessage,
            enabled: enabled !== undefined ? enabled : rulesCache[ruleIndex].enabled,
            matchType: matchType !== undefined ? matchType : rulesCache[ruleIndex].matchType,
            caseSensitive: caseSensitive !== undefined ? caseSensitive : rulesCache[ruleIndex].caseSensitive,
            updatedAt: new Date().toISOString()
        };
        
        rulesCache[ruleIndex] = updatedRule;
        await saveRules();
        
        logger.info(`✅ SmartBot: Updated rule "${updatedRule.name}"`);
        
        res.json({
            success: true,
            data: updatedRule,
            message: 'Rule updated successfully'
        });
    } catch (error) {
        logger.error('Error updating SmartBot rule:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update rule',
            message: error.message
        });
    }
});

/**
 * DELETE /api/smartbot/rules/:id
 * Delete a rule
 */
router.delete('/rules/:id', async (req, res) => {
    try {
        const ruleIndex = rulesCache.findIndex(r => r.id === req.params.id);
        
        if (ruleIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }
        
        const deletedRule = rulesCache[ruleIndex];
        rulesCache.splice(ruleIndex, 1);
        await saveRules();
        
        logger.info(`✅ SmartBot: Deleted rule "${deletedRule.name}"`);
        
        res.json({
            success: true,
            message: 'Rule deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting SmartBot rule:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete rule',
            message: error.message
        });
    }
});

/**
 * POST /api/smartbot/rules/:id/toggle
 * Toggle rule enabled/disabled
 */
router.post('/rules/:id/toggle', async (req, res) => {
    try {
        const ruleIndex = rulesCache.findIndex(r => r.id === req.params.id);
        
        if (ruleIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }
        
        rulesCache[ruleIndex].enabled = !rulesCache[ruleIndex].enabled;
        await saveRules();
        
        logger.info(`✅ SmartBot: Toggled rule "${rulesCache[ruleIndex].name}" to ${rulesCache[ruleIndex].enabled ? 'enabled' : 'disabled'}`);
        
        res.json({
            success: true,
            data: rulesCache[ruleIndex],
            message: `Rule ${rulesCache[ruleIndex].enabled ? 'enabled' : 'disabled'}`
        });
    } catch (error) {
        logger.error('Error toggling SmartBot rule:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle rule',
            message: error.message
        });
    }
});

/**
 * GET /api/smartbot/stats
 * Get SmartBot statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = {
            totalRules: rulesCache.length,
            enabledRules: rulesCache.filter(r => r.enabled).length,
            disabledRules: rulesCache.filter(r => !r.enabled).length,
            totalTriggers: rulesCache.reduce((sum, r) => sum + (r.triggerCount || 0), 0),
            topRules: rulesCache
                .sort((a, b) => (b.triggerCount || 0) - (a.triggerCount || 0))
                .slice(0, 5)
                .map(r => ({
                    id: r.id,
                    name: r.name,
                    triggerCount: r.triggerCount || 0
                }))
        };
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error getting SmartBot stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get stats',
            message: error.message
        });
    }
});

/**
 * GET /api/smartbot/history
 * Get reply history
 */
router.get('/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        
        // Get history from service if available
        const smartbotService = req.app.get('smartbotService');
        
        if (smartbotService) {
            const history = smartbotService.getHistory(limit);
            res.json({
                success: true,
                data: history,
                count: history.length
            });
        } else {
            res.json({
                success: true,
                data: [],
                count: 0,
                message: 'SmartBot service not initialized'
            });
        }
    } catch (error) {
        logger.error('Error getting SmartBot history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get history',
            message: error.message
        });
    }
});

/**
 * DELETE /api/smartbot/history
 * Clear reply history
 */
router.delete('/history', async (req, res) => {
    try {
        const smartbotService = req.app.get('smartbotService');
        
        if (smartbotService) {
            await smartbotService.clearHistory();
            res.json({
                success: true,
                message: 'History cleared successfully'
            });
        } else {
            res.status(503).json({
                success: false,
                error: 'SmartBot service not initialized'
            });
        }
    } catch (error) {
        logger.error('Error clearing SmartBot history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear history',
            message: error.message
        });
    }
});

module.exports = {
    router,
    initializeRulesStorage,
    findMatchingRule,
    rulesCache
};
