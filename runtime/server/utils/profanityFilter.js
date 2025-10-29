/**
 * Profanity Filter & Warning System
 * Detects and blocks inappropriate language
 */

const logger = require('./logger');

/**
 * Profanity patterns (English)
 */
const englishProfanity = [
    // F-word variations
    'fuck', 'fck', 'fuk', 'f*ck', 'f**k', 'fuсk', 'fvck', 'phuck', 'fawk',
    'fucking', 'fucked', 'fucker', 'fuckin', 'fking', 'f***ing',
    
    // S-word variations
    'shit', 'sh*t', 'sh1t', 'shіt', 'sht', 'shyt', 'shite',
    'shitty', 'shitting', 'bullshit', 'bs',
    
    // B-word variations
    'bitch', 'b*tch', 'b1tch', 'biatch', 'biotch', 'beatch',
    'bitches', 'bitching',
    
    // A-word variations
    'ass', 'arse', 'a**', 'a$$', 'azz', 'asshole', 'a**hole',
    
    // D-word variations
    'dick', 'd*ck', 'd1ck', 'dіck', 'dik', 'dikk',
    'dickhead', 'dicks',
    
    // P-word variations
    'pussy', 'p*ssy', 'pus*y', 'pussу', 'pvssy',
    
    // C-word variations
    'cock', 'c*ck', 'cоck', 'cawk', 'cok',
    'cunt', 'c*nt', 'cvnt',
    
    // Other variations
    'damn', 'damned', 'dammit', 'damnit',
    'hell', 'hеll',
    'bastard', 'b*stard',
    'whore', 'wh*re', 'slut', 'sl*t',
    'piss', 'p*ss', 'pіss',
    'nigga', 'nigger', 'n*gga', 'n*gger',
    'fag', 'faggot', 'f*g', 'f*ggot',
    
    // Sexual content
    'sex', 'porn', 'porno', 'xxx', 'nude', 'naked',
    'boobs', 'tits', 'penis', 'vagina', 'anal'
];

/**
 * Profanity patterns (Arabic)
 */
const arabicProfanity = [
    // Common Arabic profanity
    'كس', 'كسم', 'كسمك', 'كسختك',
    'عرص', 'عرصة', 'يا عرص',
    'خول', 'خولات', 'يا خول',
    'شرموط', 'شرموطة', 'شراميط',
    'قحبة', 'قحاب', 'يا قحبة',
    'زب', 'زبي', 'زبك',
    'متناك', 'متناكة', 'نيك',
    'يلعن', 'لعنة', 'يلعن دينك',
    'ابن الكلب', 'ابن الوسخة',
    'حيوان', 'يا حيوان',
    'وسخ', 'وسخة', 'يا وسخ',
    'خرا', 'خراء', 'خرة',
    'طيز', 'طيزك',
    
    // Egyptian slang
    'احا', 'اح', 'اخخ',
    'يابن المتناكة', 'يا ابن المتناكة',
    'كسمين', 'كسمينك',
    'منيك', 'منيوك',
    'لبوة', 'لبوه',
    'فشخ', 'فشخك',
    
    // Variations with different spellings
    'كـس', 'كـسـم', 'عـرص', 'خـول',
    'شـرموط', 'قـحبة', 'زبـ',
    'احـا', 'اح',
    
    // Mixed with numbers
    'ك5', 'ك5م', '3ars', '3rs'
];

/**
 * Detect if message contains profanity
 */
function containsProfanity(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check English profanity
    for (const word of englishProfanity) {
        try {
            // Escape special regex characters
            const escapedWord = escapeRegex(word);
            // Word boundary check
            const regex = new RegExp(`\\b${escapedWord}\\b|${escapedWord}`, 'i');
            if (regex.test(lowerMessage)) {
                return {
                    detected: true,
                    word: word,
                    language: 'en'
                };
            }
        } catch (error) {
            // Fallback to simple includes check
            if (lowerMessage.includes(word.toLowerCase())) {
                return {
                    detected: true,
                    word: word,
                    language: 'en'
                };
            }
        }
    }
    
    // Check Arabic profanity
    for (const word of arabicProfanity) {
        if (message.includes(word)) {
            return {
                detected: true,
                word: word,
                language: 'ar'
            };
        }
    }
    
    return {
        detected: false,
        word: null,
        language: null
    };
}

/**
 * Get warning message based on language
 */
function getWarningMessage(language) {
    const warnings = {
        ar: {
            messages: [
                '⚠️ تحذير\n\nنرجو الالتزام بالأدب واحترام الآخرين.\nاستخدام الألفاظ غير اللائقة غير مسموح به.\n\nشكراً لتفهمك.',
                '⚠️ تنبيه\n\nالرجاء استخدام لغة محترمة.\nنحن هنا لخدمتك بشكل احترافي.\n\nنقدر تعاونك.',
                '⚠️ ملاحظة هامة\n\nنرجو منك التحدث بأدب.\nالألفاظ الخارجة غير مقبولة.\n\nمع تحياتنا.',
                '⚠️ تحذير\n\nلا نقبل الألفاظ غير اللائقة.\nنرجو الالتزام بالاحترام المتبادل.\n\nشكراً لك.',
                '⚠️ تنبيه مهم\n\nالرجاء الحفاظ على أسلوب محترم في التواصل.\nنحن نقدر عملاءنا ونتوقع نفس الاحترام.\n\nنشكر تفهمك.'
            ]
        },
        en: {
            messages: [
                '⚠️ Warning\n\nPlease maintain respectful language.\nInappropriate words are not allowed.\n\nThank you for understanding.',
                '⚠️ Notice\n\nKindly use professional language.\nWe are here to serve you professionally.\n\nWe appreciate your cooperation.',
                '⚠️ Important Notice\n\nPlease communicate respectfully.\nOffensive language is not acceptable.\n\nBest regards.',
                '⚠️ Warning\n\nWe do not accept inappropriate language.\nPlease maintain mutual respect.\n\nThank you.',
                '⚠️ Important Notice\n\nPlease keep your communication professional.\nWe value our customers and expect the same respect.\n\nThank you for understanding.'
            ]
        }
    };
    
    const langWarnings = warnings[language] || warnings.en;
    const randomIndex = Math.floor(Math.random() * langWarnings.messages.length);
    
    return langWarnings.messages[randomIndex];
}

/**
 * Check message and return warning if needed
 */
function checkAndWarn(message) {
    const result = containsProfanity(message);
    
    if (result.detected) {
        logger.warn(`🚫 Profanity detected: "${result.word}" in message: "${message.substring(0, 30)}..."`);
        
        const warningMessage = getWarningMessage(result.language);
        
        return {
            shouldBlock: true,
            warning: warningMessage,
            detectedWord: result.word,
            language: result.language
        };
    }
    
    return {
        shouldBlock: false,
        warning: null,
        detectedWord: null,
        language: null
    };
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Censor profanity in message (replace with ***)
 */
function censorMessage(message) {
    let censoredMessage = message;
    let censoredCount = 0;
    const censoredWords = [];
    
    // Censor English profanity
    for (const word of englishProfanity) {
        try {
            const escapedWord = escapeRegex(word);
            const regex = new RegExp(`\\b${escapedWord}\\b|${escapedWord}`, 'gi');
            if (regex.test(censoredMessage)) {
                const replacement = '***';
                censoredMessage = censoredMessage.replace(regex, replacement);
                censoredCount++;
                censoredWords.push(word);
            }
        } catch (error) {
            // Skip if regex fails
            continue;
        }
    }
    
    // Censor Arabic profanity
    for (const word of arabicProfanity) {
        if (censoredMessage.includes(word)) {
            const replacement = '***';
            censoredMessage = censoredMessage.replaceAll(word, replacement);
            censoredCount++;
            censoredWords.push(word);
        }
    }
    
    return {
        original: message,
        censored: censoredMessage,
        hasProfanity: censoredCount > 0,
        censoredCount: censoredCount,
        censoredWords: censoredWords
    };
}

/**
 * Log profanity attempt with censored version
 */
function logProfanityAttempt(from, message, detectedWord) {
    const censored = censorMessage(message);
    
    logger.warn(`🚫 PROFANITY ATTEMPT:`);
    logger.warn(`   From: ${from}`);
    logger.warn(`   Original: "${message.substring(0, 50)}..."`);
    logger.warn(`   Censored: "${censored.censored.substring(0, 50)}..."`);
    logger.warn(`   Detected: "${detectedWord}"`);
    logger.warn(`   Total censored: ${censored.censoredCount} word(s)`);
    logger.warn(`   Action: Warning sent`);
}

module.exports = {
    containsProfanity,
    getWarningMessage,
    checkAndWarn,
    censorMessage,
    logProfanityAttempt,
    englishProfanity,
    arabicProfanity
};
