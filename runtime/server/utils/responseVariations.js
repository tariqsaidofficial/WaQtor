/**
 * Response Variations Generator
 * Anti-ban protection by varying responses
 */

const logger = require('./logger');

/**
 * Generate variations of a response message
 */
function generateVariations(originalMessage) {
    const variations = [originalMessage];
    
    // Add greeting variations (language-specific will be handled by languageDetector)
    const greetingPrefixes = [
        '',
        ''
    ];
    
    // Add closing variations (minimal, language-aware)
    const closingSuffixes = [
        '',
        ' 😊',
        ' ✨',
        ''
    ];
    
    // Generate combinations
    greetingPrefixes.forEach(prefix => {
        closingSuffixes.forEach(suffix => {
            if (prefix || suffix) {
                const variation = prefix + originalMessage + suffix;
                if (!variations.includes(variation)) {
                    variations.push(variation);
                }
            }
        });
    });
    
    return variations;
}

/**
 * Add natural variations to message
 */
function addNaturalVariations(message) {
    const variations = [message];
    
    // Add punctuation variations
    if (!message.endsWith('!') && !message.endsWith('؟') && !message.endsWith('?')) {
        variations.push(message + '!');
        variations.push(message + '.');
    }
    
    // Add emoji variations
    const emojis = ['😊', '🙂', '👍', '✨', '💫', '🌟', ''];
    emojis.forEach(emoji => {
        if (emoji) {
            variations.push(message + ' ' + emoji);
        }
    });
    
    // Add line break variations
    if (message.length > 50) {
        const words = message.split(' ');
        const mid = Math.floor(words.length / 2);
        const withBreak = words.slice(0, mid).join(' ') + '\n\n' + words.slice(mid).join(' ');
        variations.push(withBreak);
    }
    
    return variations;
}

/**
 * Paraphrase message (Arabic & English)
 */
function paraphraseMessage(message) {
    const paraphrases = [message];
    
    // Arabic paraphrasing patterns
    const arabicPatterns = {
        'مرحبا': ['أهلاً', 'مرحباً بك', 'أهلاً وسهلاً', 'حياك الله'],
        'مرحباً بك': ['أهلاً بك', 'مرحبا', 'أهلاً وسهلاً', 'نورت'],
        'كيف يمكنني مساعدتك': ['كيف أقدر أساعدك', 'شو تحتاج', 'كيف أخدمك', 'ايش تبغى'],
        'شكرا': ['شكراً لك', 'نشكرك', 'ممتنين لك', 'الشكر لك'],
        'نحن هنا': ['موجودين', 'متواجدين', 'جاهزين', 'حاضرين'],
        'في أي وقت': ['دائماً', 'على طول', '24/7', 'في خدمتك'],
        'تواصل معنا': ['راسلنا', 'كلمنا', 'اتصل بنا', 'تحدث معنا'],
        'السعر': ['التكلفة', 'الثمن', 'المبلغ', 'قيمة'],
        'الموعد': ['الوقت', 'التوقيت', 'الميعاد', 'الزمن'],
        'المكان': ['الموقع', 'العنوان', 'المقر', 'الفرع']
    };
    
    // English paraphrasing patterns
    const englishPatterns = {
        'hello': ['hi', 'hey', 'greetings', 'welcome'],
        'hi': ['hello', 'hey', 'hi there', 'howdy'],
        'how can I help you': ['how may I assist you', 'what can I do for you', 'how can I assist', 'need help'],
        'thank you': ['thanks', 'appreciate it', 'thanks a lot', 'much appreciated'],
        'we are here': ['we\'re available', 'we\'re ready', 'we\'re here for you', 'available now'],
        'anytime': ['always', '24/7', 'whenever you need', 'at your service'],
        'contact us': ['reach out', 'get in touch', 'message us', 'talk to us'],
        'price': ['cost', 'pricing', 'rate', 'fee'],
        'time': ['schedule', 'timing', 'hours', 'availability'],
        'location': ['address', 'place', 'where', 'venue']
    };
    
    // Apply Arabic patterns
    Object.keys(arabicPatterns).forEach(pattern => {
        if (message.includes(pattern)) {
            arabicPatterns[pattern].forEach(replacement => {
                const newMessage = message.replace(pattern, replacement);
                if (!paraphrases.includes(newMessage)) {
                    paraphrases.push(newMessage);
                }
            });
        }
    });
    
    // Apply English patterns
    Object.keys(englishPatterns).forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        if (regex.test(message)) {
            englishPatterns[pattern].forEach(replacement => {
                const newMessage = message.replace(regex, replacement);
                if (!paraphrases.includes(newMessage)) {
                    paraphrases.push(newMessage);
                }
            });
        }
    });
    
    return paraphrases;
}

/**
 * Generate all possible variations
 */
function generateAllVariations(message) {
    let allVariations = new Set([message]);
    
    // Add greeting/closing variations
    const greetingVariations = generateVariations(message);
    greetingVariations.forEach(v => allVariations.add(v));
    
    // Add natural variations
    const naturalVariations = addNaturalVariations(message);
    naturalVariations.forEach(v => allVariations.add(v));
    
    // Add paraphrased variations
    const paraphrased = paraphraseMessage(message);
    paraphrased.forEach(p => {
        allVariations.add(p);
        // Also add natural variations of paraphrases
        const pNatural = addNaturalVariations(p);
        pNatural.forEach(v => allVariations.add(v));
    });
    
    return Array.from(allVariations);
}

/**
 * Select variation based on usage history
 */
function selectVariation(variations, usageHistory = {}) {
    if (variations.length === 1) {
        return variations[0];
    }
    
    // Find least used variation
    let leastUsed = variations[0];
    let minUsage = usageHistory[leastUsed] || 0;
    
    variations.forEach(variation => {
        const usage = usageHistory[variation] || 0;
        if (usage < minUsage) {
            minUsage = usage;
            leastUsed = variation;
        }
    });
    
    // If all variations used equally, pick random
    const equallyUsed = variations.filter(v => (usageHistory[v] || 0) === minUsage);
    if (equallyUsed.length > 1) {
        return equallyUsed[Math.floor(Math.random() * equallyUsed.length)];
    }
    
    return leastUsed;
}

/**
 * Track variation usage
 */
const variationUsage = {};

function trackUsage(ruleId, variation) {
    if (!variationUsage[ruleId]) {
        variationUsage[ruleId] = {};
    }
    
    variationUsage[ruleId][variation] = (variationUsage[ruleId][variation] || 0) + 1;
    
    logger.info(`📊 Variation usage for rule ${ruleId}: ${JSON.stringify(variationUsage[ruleId])}`);
}

function getUsageHistory(ruleId) {
    return variationUsage[ruleId] || {};
}

/**
 * Get smart response with variation
 */
function getSmartResponse(ruleId, originalMessage) {
    // Generate all variations
    const variations = generateAllVariations(originalMessage);
    
    logger.info(`🎲 Generated ${variations.length} variations for rule ${ruleId}`);
    
    // Get usage history
    const usageHistory = getUsageHistory(ruleId);
    
    // Select best variation
    const selectedVariation = selectVariation(variations, usageHistory);
    
    // Track usage
    trackUsage(ruleId, selectedVariation);
    
    logger.info(`✅ Selected variation: "${selectedVariation.substring(0, 50)}..."`);
    
    return selectedVariation;
}

/**
 * Reset usage history (for testing or periodic reset)
 */
function resetUsageHistory(ruleId = null) {
    if (ruleId) {
        delete variationUsage[ruleId];
        logger.info(`🔄 Reset usage history for rule ${ruleId}`);
    } else {
        Object.keys(variationUsage).forEach(key => delete variationUsage[key]);
        logger.info('🔄 Reset all usage history');
    }
}

module.exports = {
    generateVariations,
    addNaturalVariations,
    paraphraseMessage,
    generateAllVariations,
    selectVariation,
    getSmartResponse,
    trackUsage,
    getUsageHistory,
    resetUsageHistory
};
