/**
 * Language Detector & Smart Response Generator
 * Detects user language and responds in same language
 */

const logger = require('./logger');

/**
 * Detect language of message
 */
function detectLanguage(message) {
    // Arabic characters
    const arabicRegex = /[\u0600-\u06FF]/;
    // English characters
    const englishRegex = /[a-zA-Z]/;
    
    const hasArabic = arabicRegex.test(message);
    const hasEnglish = englishRegex.test(message);
    
    if (hasArabic && !hasEnglish) {
        return 'ar';
    } else if (hasEnglish && !hasArabic) {
        return 'en';
    } else if (hasArabic && hasEnglish) {
        // Mixed - count which is more
        const arabicCount = (message.match(arabicRegex) || []).length;
        const englishCount = (message.match(englishRegex) || []).length;
        return arabicCount > englishCount ? 'ar' : 'en';
    }
    
    return 'ar'; // Default to Arabic
}

/**
 * Professional Egyptian Arabic responses for business
 */
const egyptianProfessionalResponses = {
    greeting: {
        original: [
            'أهلاً بحضرتك',
            'مرحباً بك',
            'أهلاً وسهلاً',
            'تشرفنا',
            'نورت'
        ],
        withHelp: [
            'أهلاً بحضرتك، إزاي نقدر نساعدك؟',
            'مرحباً بك، عايزين نخدمك في إيه؟',
            'أهلاً وسهلاً، حضرتك محتاج إيه؟',
            'تشرفنا بحضرتك، إزاي نقدر نفيدك؟',
            'نورت، في خدمتك'
        ]
    },
    
    thanks: {
        simple: [
            'العفو',
            'تسلم',
            'على الرحب والسعة',
            'ده واجبنا',
            'في خدمتك دايماً'
        ],
        withService: [
            'العفو! في خدمتك دايماً',
            'تسلم! نورت',
            'على الرحب والسعة! أي خدمة تانية؟',
            'ده واجبنا! محتاج حاجة تانية؟',
            'في خدمتك دايماً! تحت أمرك'
        ]
    },
    
    help: {
        available: [
            'أيوة، إزاي نقدر نساعدك؟',
            'تحت أمرك، عايز إيه؟',
            'في خدمتك، قول',
            'موجودين، محتاج إيه؟',
            'أكيد، إزاي نفيدك؟'
        ],
        support: [
            'فريق الدعم جاهز يساعدك',
            'موجودين على طول في خدمتك',
            'تقدر تتواصل معانا في أي وقت',
            'إحنا هنا عشان نساعدك',
            'الدعم الفني متاح 24/7'
        ]
    },
    
    pricing: {
        inquiry: [
            'الأسعار بتبدأ من {price} جنيه',
            'عندنا عروض مميزة، السعر {price} جنيه',
            'التكلفة {price} جنيه، وفيه عروض',
            'الباقات بتبدأ من {price} جنيه',
            'الأسعار تنافسية، من {price} جنيه'
        ],
        details: [
            'عايز تفاصيل أكتر عن الأسعار؟',
            'تحب تعرف تفاصيل الباقات؟',
            'محتاج معلومات أكتر عن الأسعار؟',
            'عايز نوضحلك العروض المتاحة؟',
            'تقدر تختار الباقة المناسبة ليك'
        ]
    },
    
    timing: {
        hours: [
            'مواعيد العمل من 9 صباحاً لـ 6 مساءً',
            'شغالين من الأحد للخميس، 9-6',
            'متاحين من 9 الصبح لـ 6 المساء',
            'أوقات العمل: 9 ص - 6 م',
            'الدوام من 9 صباحاً حتى 6 مساءً'
        ],
        available: [
            'موجودين دلوقتي، في خدمتك',
            'متاحين حالياً للرد عليك',
            'الفريق جاهز يساعدك',
            'تقدر تتواصل معانا دلوقتي',
            'موجودين على طول'
        ]
    },
    
    location: {
        address: [
            'العنوان: {address}',
            'موقعنا في {address}',
            'تقدر تلاقينا في {address}',
            'الفرع الرئيسي: {address}',
            'عنواننا: {address}'
        ],
        directions: [
            'تقدر توصلنا بسهولة',
            'الموقع سهل الوصول',
            'ممكن نبعتلك الموقع على الخريطة',
            'عايز نبعتلك اللوكيشن؟',
            'تحب نوجهك للعنوان؟'
        ]
    },
    
    contact: {
        phone: [
            'تقدر تتصل بينا على {phone}',
            'رقم التواصل: {phone}',
            'كلمنا على {phone}',
            'للاستفسار: {phone}',
            'رقمنا: {phone}'
        ],
        whatsapp: [
            'تقدر تراسلنا على واتساب',
            'متاحين على الواتساب',
            'ابعتلنا رسالة هنا',
            'تواصل معانا على الواتساب',
            'الواتساب متاح للرد'
        ]
    }
};

/**
 * Professional English responses for business
 */
const englishProfessionalResponses = {
    greeting: {
        original: [
            'Welcome',
            'Hello',
            'Good day',
            'Greetings',
            'Thank you for reaching out'
        ],
        withHelp: [
            'Welcome, how can we assist you today?',
            'Hello, what can we help you with?',
            'Good day, how may we support you?',
            'Thank you for contacting us, how can we help?',
            'Greetings, what do you need assistance with?'
        ]
    },
    
    thanks: {
        simple: [
            'You\'re welcome',
            'Our pleasure',
            'Happy to help',
            'Glad we could assist',
            'Anytime'
        ],
        withService: [
            'You\'re welcome, is there anything else we can help with?',
            'Our pleasure, feel free to reach out anytime.',
            'Happy to help, let us know if you need further assistance.',
            'Glad we could assist, we\'re here if you need anything else.',
            'Anytime, don\'t hesitate to contact us again.'
        ]
    },
    
    help: {
        available: [
            'Certainly, how can we assist you?',
            'Of course, what do you need help with?',
            'Absolutely, how may we support you?',
            'Yes, we\'re here to help.',
            'Sure, what can we do for you?'
        ],
        support: [
            'Our support team is ready to assist you.',
            'We\'re available to help whenever you need.',
            'Feel free to reach out anytime for assistance.',
            'Our team is here to support you.',
            'Technical support is available 24/7.'
        ]
    },
    
    pricing: {
        inquiry: [
            'Our pricing starts from ${price}.',
            'Packages are available starting at ${price}.',
            'The cost is ${price}, with flexible options.',
            'We offer competitive rates from ${price}.',
            'Pricing begins at ${price} for our services.'
        ],
        details: [
            'Would you like detailed pricing information?',
            'I can provide more details about our packages.',
            'Let me know if you need specific pricing information.',
            'We have various packages to suit your needs.',
            'I\'d be happy to explain our pricing structure.'
        ]
    },
    
    timing: {
        hours: [
            'Our working hours are 9 AM to 6 PM.',
            'We operate Sunday through Thursday, 9 AM - 6 PM.',
            'Business hours: 9 AM - 6 PM, Sunday to Thursday.',
            'We\'re available from 9 AM to 6 PM daily.',
            'Office hours are 9 AM to 6 PM.'
        ],
        available: [
            'We\'re currently available to assist you.',
            'Our team is ready to help you now.',
            'We\'re online and ready to support you.',
            'Available now to answer your questions.',
            'We\'re here to help you right away.'
        ]
    },
    
    location: {
        address: [
            'Our address is: {address}',
            'You can find us at: {address}',
            'We\'re located at: {address}',
            'Our office is at: {address}',
            'Visit us at: {address}'
        ],
        directions: [
            'The location is easily accessible.',
            'We can send you the exact location on the map.',
            'Would you like directions to our office?',
            'I can share our location with you.',
            'Let me know if you need help finding us.'
        ]
    },
    
    contact: {
        phone: [
            'You can reach us at: {phone}',
            'Our contact number is: {phone}',
            'Call us at: {phone}',
            'For inquiries, please call: {phone}',
            'Phone: {phone}'
        ],
        whatsapp: [
            'You can message us on WhatsApp.',
            'We\'re available on WhatsApp for your convenience.',
            'Feel free to send us a message here.',
            'WhatsApp is available for quick responses.',
            'Contact us via WhatsApp anytime.'
        ]
    }
};

/**
 * Get smart response based on detected language
 */
function getLanguageAwareResponse(userMessage, originalResponse, category = 'greeting', subcategory = 'withHelp') {
    const detectedLang = detectLanguage(userMessage);
    
    logger.info(`🌐 Detected language: ${detectedLang} for message: "${userMessage.substring(0, 30)}..."`);
    
    // Select appropriate response set
    const responses = detectedLang === 'ar' 
        ? egyptianProfessionalResponses 
        : englishProfessionalResponses;
    
    // Get category responses
    if (responses[category] && responses[category][subcategory]) {
        const options = responses[category][subcategory];
        const selected = options[Math.floor(Math.random() * options.length)];
        
        logger.info(`✅ Selected ${detectedLang} response: "${selected.substring(0, 40)}..."`);
        
        return {
            response: selected,
            language: detectedLang
        };
    }
    
    // Fallback to original
    return {
        response: originalResponse,
        language: detectedLang
    };
}

/**
 * Detect category from keywords
 */
function detectCategory(keywords) {
    const keywordLower = keywords.map(k => k.toLowerCase());
    
    // Greeting
    if (keywordLower.some(k => ['hi', 'hello', 'hey', 'مرحبا', 'السلام', 'أهلا', 'هلا'].includes(k))) {
        return { category: 'greeting', subcategory: 'withHelp' };
    }
    
    // Thanks
    if (keywordLower.some(k => ['thanks', 'thank', 'شكرا', 'شكراً', 'تسلم'].includes(k))) {
        return { category: 'thanks', subcategory: 'withService' };
    }
    
    // Help
    if (keywordLower.some(k => ['help', 'مساعدة', 'ساعدني', 'محتاج'].includes(k))) {
        return { category: 'help', subcategory: 'available' };
    }
    
    // Pricing
    if (keywordLower.some(k => ['price', 'cost', 'سعر', 'كم', 'بكام', 'تكلفة'].includes(k))) {
        return { category: 'pricing', subcategory: 'inquiry' };
    }
    
    // Timing
    if (keywordLower.some(k => ['time', 'when', 'موعد', 'متى', 'وقت', 'ساعة'].includes(k))) {
        return { category: 'timing', subcategory: 'hours' };
    }
    
    // Location
    if (keywordLower.some(k => ['where', 'location', 'address', 'فين', 'وين', 'مكان', 'عنوان'].includes(k))) {
        return { category: 'location', subcategory: 'address' };
    }
    
    // Contact
    if (keywordLower.some(k => ['contact', 'call', 'phone', 'اتصل', 'رقم', 'تواصل'].includes(k))) {
        return { category: 'contact', subcategory: 'phone' };
    }
    
    // Default
    return { category: 'greeting', subcategory: 'withHelp' };
}

module.exports = {
    detectLanguage,
    getLanguageAwareResponse,
    detectCategory,
    egyptianProfessionalResponses,
    englishProfessionalResponses
};
