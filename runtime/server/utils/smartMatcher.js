/**
 * Smart Matcher - AI-Powered Keyword Matching
 * Handles typos, variations, and intelligent matching
 */

const logger = require('./logger');

/**
 * Calculate Levenshtein distance (edit distance) between two strings
 * Used for fuzzy matching and typo detection
 */
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[len1][len2];
}

/**
 * Calculate similarity percentage between two strings
 */
function calculateSimilarity(str1, str2) {
    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return ((maxLength - distance) / maxLength) * 100;
}

/**
 * Normalize text for better matching
 */
function normalizeText(text) {
    return text
        .toLowerCase()
        .trim()
        // Remove extra spaces
        .replace(/\s+/g, ' ')
        // Remove repeated characters (Hiiiii -> Hi)
        .replace(/(.)\1{2,}/g, '$1$1')
        // Remove diacritics (Arabic)
        .replace(/[\u064B-\u065F]/g, '')
        // Normalize Arabic letters
        .replace(/[أإآ]/g, 'ا')
        .replace(/[ى]/g, 'ي')
        .replace(/[ة]/g, 'ه')
        .replace(/[ؤ]/g, 'و');
}

/**
 * Check if message matches keyword with smart matching
 */
function smartMatch(message, keyword, options = {}) {
    const {
        matchType = 'contains',
        caseSensitive = false,
        fuzzyThreshold = 70, // 70% similarity for typos (more flexible)
        normalizeArabic = true
    } = options;

    // Normalize both strings
    let msg = normalizeArabic ? normalizeText(message) : message;
    let kw = normalizeArabic ? normalizeText(keyword) : keyword;

    if (!caseSensitive) {
        msg = msg.toLowerCase();
        kw = kw.toLowerCase();
    }

    // Exact match types
    switch (matchType) {
        case 'exact':
            if (msg === kw) return { matched: true, confidence: 100, method: 'exact' };
            break;

        case 'startsWith':
            if (msg.startsWith(kw)) return { matched: true, confidence: 100, method: 'startsWith' };
            break;

        case 'endsWith':
            if (msg.endsWith(kw)) return { matched: true, confidence: 100, method: 'endsWith' };
            break;

        case 'contains':
            if (msg.includes(kw)) return { matched: true, confidence: 100, method: 'contains' };
            break;
    }

    // Fuzzy matching for typos
    const words = msg.split(' ');
    for (const word of words) {
        const similarity = calculateSimilarity(word, kw);
        
        if (similarity >= fuzzyThreshold) {
            logger.info(`🎯 SmartBot: Fuzzy match found - "${word}" ≈ "${kw}" (${similarity.toFixed(1)}%)`);
            return {
                matched: true,
                confidence: similarity,
                method: 'fuzzy',
                original: word,
                matchedKeyword: kw
            };
        }
    }

    // Word boundary matching (whole word)
    const wordBoundaryRegex = new RegExp(`\\b${kw}\\b`, caseSensitive ? '' : 'i');
    if (wordBoundaryRegex.test(msg)) {
        return { matched: true, confidence: 95, method: 'wordBoundary' };
    }

    return { matched: false, confidence: 0 };
}

/**
 * Extended Arabic patterns - More comprehensive
 */
const arabicTypoPatterns = {
    // Greetings
    'السلام عليكم': ['السلامم', 'السلام', 'سلام', 'السلامممم', 'السلم', 'عليكم السلام', 'سلامو', 'سلامات'],
    'مرحبا': ['مرحبااا', 'مرحبه', 'مرحبااااا', 'مرحب', 'مرحبتين', 'مراحب', 'اهلا', 'اهلين', 'هلا'],
    'أهلا': ['اهلا', 'اهلين', 'هلا', 'اهلاا', 'اهلااا'],
    'صباح الخير': ['صباح', 'صباحو', 'صباح الخيرر', 'صباح النور', 'صباحك', 'صبحو'],
    'مساء الخير': ['مساء', 'مساءو', 'مساء الخيرر', 'مساء النور', 'مساك', 'مسائك'],
    
    // Thanks
    'شكرا': ['شكراا', 'شكرااا', 'شكرن', 'شكررا', 'شكرآ', 'ثانكس', 'تسلم', 'يعطيك العافية'],
    'شكرا جزيلا': ['شكرا', 'شكراً', 'الف شكر', 'مشكور', 'مشكوره'],
    
    // Questions
    'كيف حالك': ['كيف حالكك', 'كيف الحال', 'كيفك', 'كيف', 'شلونك', 'ازيك', 'عامل ايه'],
    'ازيك': ['ازيك', 'ازي', 'ازاي', 'عامل ايه', 'اخبارك'],
    'شلونك': ['شلونك', 'شلونج', 'شخبارك', 'شخبار'],
    
    // Affirmative
    'نعم': ['نعممم', 'نعمم', 'اي', 'ايوه', 'ايوة', 'اه', 'اوكي', 'تمام'],
    'تمام': ['تمامم', 'تماام', 'اوكي', 'اوك', 'ماشي', 'زين'],
    
    // Negative
    'لا': ['لاا', 'لااا', 'لأ', 'لاء', 'نو', 'مش عاوز'],
    
    // Requests
    'من فضلك': ['لو سمحت', 'ممكن', 'عايز', 'ابغى', 'بدي'],
    'ممكن': ['ممكنن', 'لو سمحت', 'من فضلك', 'عايز', 'ابغى'],
    
    // Common words
    'السعر': ['سعر', 'كم', 'بكام', 'بكم', 'التكلفة', 'الثمن'],
    'موعد': ['وقت', 'متى', 'امتى', 'ايمتى'],
    'مكان': ['وين', 'فين', 'اين', 'عنوان', 'موقع'],
    'اتصل': ['كلمني', 'اتصل بي', 'رد علي', 'جاوبني']
};

/**
 * Extended English patterns - More comprehensive
 */
const englishTypoPatterns = {
    // Greetings
    'hello': ['helo', 'hllo', 'helllo', 'hellooo', 'hiii', 'hiiiii', 'heya', 'hiya', 'hey'],
    'hi': ['hii', 'hiii', 'hiiii', 'hy', 'hiy', 'hey', 'hai'],
    'hey': ['heyy', 'heyyy', 'heyyyy', 'hay', 'hei'],
    'good morning': ['morning', 'gm', 'gud morning', 'good mornin', 'mornin', 'gmorning'],
    'good evening': ['evening', 'ge', 'gud evening', 'good evenin', 'evenin'],
    'good night': ['night', 'gn', 'gud night', 'nite', 'gnite'],
    
    // Thanks
    'thanks': ['thnks', 'thanx', 'thx', 'thankss', 'thanksss', 'tnx', 'ty', 'thank you'],
    'thank you': ['thanks', 'thanx', 'thx', 'ty', 'thnk u', 'thank u'],
    
    // Affirmative
    'yes': ['yess', 'yesss', 'yep', 'yeah', 'yea', 'ya', 'yup', 'ok', 'okay'],
    'ok': ['okk', 'okkk', 'okay', 'okey', 'k', 'kk'],
    'sure': ['suree', 'sureee', 'shure'],
    
    // Negative
    'no': ['noo', 'nooo', 'nope', 'nah', 'na'],
    
    // Requests
    'please': ['plz', 'pls', 'plss', 'pleasse', 'pleas', 'plez'],
    'help': ['halp', 'heelp', 'hlp'],
    'want': ['wnt', 'wanna', 'wan'],
    'need': ['ned', 'neeed', 'nedd'],
    
    // Questions
    'how are you': ['how r u', 'how r you', 'hru', 'how are u', 'how u'],
    'what': ['wat', 'wht', 'whaat', 'wot'],
    'when': ['wen', 'whn', 'whenn'],
    'where': ['wher', 'were', 'whr'],
    'why': ['y', 'wy', 'whyy'],
    
    // Common
    'price': ['pric', 'priice', 'cost', 'how much'],
    'time': ['tym', 'tyme', 'when'],
    'location': ['place', 'where', 'address'],
    'call': ['cal', 'cll', 'phone', 'ring']
};

/**
 * Find best matching keyword with typo tolerance
 */
function findBestMatch(message, keywords, options = {}) {
    const results = [];

    for (const keyword of keywords) {
        const result = smartMatch(message, keyword, options);
        
        if (result.matched) {
            results.push({
                keyword,
                ...result
            });
        }

        // Check typo patterns
        const allPatterns = { ...arabicTypoPatterns, ...englishTypoPatterns };
        
        for (const [correct, typos] of Object.entries(allPatterns)) {
            if (correct === keyword || keyword.includes(correct)) {
                for (const typo of typos) {
                    const typoResult = smartMatch(message, typo, options);
                    if (typoResult.matched) {
                        results.push({
                            keyword,
                            ...typoResult,
                            corrected: true,
                            typo: typo,
                            correct: correct
                        });
                    }
                }
            }
        }
    }

    // Sort by confidence
    results.sort((a, b) => b.confidence - a.confidence);

    return results.length > 0 ? results[0] : null;
}

/**
 * Enhanced keyword matching for SmartBot
 */
function enhancedMatch(message, rule) {
    const options = {
        matchType: rule.matchType || 'contains',
        caseSensitive: rule.caseSensitive || false,
        fuzzyThreshold: rule.fuzzyThreshold || 70,
        normalizeArabic: true
    };

    const bestMatch = findBestMatch(message, rule.keywords, options);

    if (bestMatch) {
        logger.info(`✅ SmartBot 🧠 AI-Powered: Enhanced match found for rule "${rule.name}"`);
        logger.info(`   Keyword: "${bestMatch.keyword}"`);
        logger.info(`   Confidence: ${bestMatch.confidence.toFixed(1)}%`);
        logger.info(`   Method: ${bestMatch.method}`);
        logger.info(`   🌐 Bilingual: Arabic & English supported`);
        
        if (bestMatch.corrected) {
            logger.info(`   🔧 Typo corrected: "${bestMatch.typo}" → "${bestMatch.correct}"`);
        }

        return {
            matched: true,
            keyword: bestMatch.keyword,
            confidence: bestMatch.confidence,
            method: bestMatch.method,
            corrected: bestMatch.corrected || false,
            typo: bestMatch.typo,
            correct: bestMatch.correct
        };
    }

    return { matched: false };
}

module.exports = {
    smartMatch,
    findBestMatch,
    enhancedMatch,
    normalizeText,
    calculateSimilarity,
    levenshteinDistance
};
