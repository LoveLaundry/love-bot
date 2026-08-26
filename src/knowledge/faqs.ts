import type { Faq } from "../types";

/**
 * Training corpus.
 *
 * This is the structured knowledge base the bot reasons over today. When the
 * "chatbot training" step happens later, this file becomes the seed data for
 * an embeddings index / fine-tune, or it can be replaced entirely by a call to
 * a trained model (see `bot.ts` -> `askLLM`).
 *
 * Each entry:
 *   intent   – stable label used for analytics / routing
 *   patterns – keyword/regex hints used by the rule-based classifier
 *   responses – language-keyed reply variants (one is picked at random)
 */
export const faqs: Faq[] = [
    {
        intent: "greeting",
        patterns: ["hi", "hello", "hey", "good morning", "good evening", "howdy", "sup"],
        responses: {
            en: [
                "Hello! Welcome to Love Laundry. How can I help you today?",
                "Hey there! Need help with laundry? I'm here for you.",
                "Hi! Thanks for reaching out to Love Laundry. What can I do for you?",
            ],
        },
    },
    {
        intent: "services",
        patterns: ["service", "offer", "provide", "wash", "fold", "iron", "dry clean", "laundry"],
        responses: {
            en: [
                "We offer 4 main services:\n\n1. Wash & Fold — Everyday laundry\n2. Ironing — Crisp, pressed clothes\n3. Dry Cleaning — Suits, dresses, delicates\n4. Pickup & Delivery — We collect and return to your door\n\nWould you like to know more about any of these?",
            ],
        },
    },
    {
        intent: "pricing",
        patterns: ["how much", "price", "cost", "rate", "charge", "fee", "tariff", "quote"],
        responses: {
            en: [
                "Our general pricing:\n\n• Wash & Fold: From Rs. 200/kg\n• Ironing: From Rs. 50/piece\n• Dry Cleaning: From Rs. 300/piece\n\nFor an exact quote, call us or WhatsApp!",
            ],
        },
    },
    {
        intent: "pickup",
        patterns: ["pick up", "pickup", "deliver", "collect", "drop off", "schedule", "book", "turnaround"],
        responses: {
            en: [
                "We offer free pickup and delivery! Here's how:\n\n1. Call or WhatsApp us to schedule\n2. We collect your laundry\n3. We wash, fold/iron, and deliver back fresh!\n\nTypical turnaround: 24–48 hours.",
            ],
        },
    },
    {
        intent: "locations",
        patterns: ["where", "location", "address", "branch", "chilaw", "madampe", "mahawewa", "find you", "map"],
        responses: {
            en: [
                "Our main centre is in Chilaw. We also have collection points in Madampe, Mahawewa, Kottaramulla, Dunakadeniya, Bibiladeniya, and Wennappuwa.\n\nScroll down on our website to see all locations on the map!",
            ],
        },
    },
    {
        intent: "hours",
        patterns: ["hour", "open", "close", "time", "when", "available"],
        responses: {
            en: [
                "We're available 24/7 for WhatsApp bookings!\n\nPickup & delivery hours:\n• Mon–Sat: 8 AM – 7 PM\n• Sunday: 9 AM – 5 PM",
            ],
        },
    },
    {
        intent: "contact",
        patterns: ["contact", "phone", "whatsapp", "call", "email", "number", "reach"],
        responses: {
            en: [
                "Reach us at:\n\n📞 Phone: +94 77 420 0919\n💬 WhatsApp: +94 77 420 0919\n📧 Email: lovelaundry01@gmail.com",
            ],
        },
    },
    {
        intent: "commercial",
        patterns: ["hotel", "business", "commercial", "bulk", "restaurant", "spa", "gym", "corporate", "linen"],
        responses: {
            en: [
                "Yes! We serve hotels, restaurants, spas, and businesses. Our commercial services include Hotel Linen, Commercial Laundry, and Bulk Processing.\n\nWe partner with 9 hotels including Goldi Sands, Amagi, and Camelot. Contact us for a custom quote!",
            ],
        },
    },
    {
        intent: "careers",
        patterns: ["job", "hiring", "work", "career", "team", "employ", "vacancy", "apply"],
        responses: {
            en: [
                "We're hiring! Current openings:\n\n• Delivery Driver\n• Machine Operator\n• Ironer / Presser\n• Collection Agent\n\nBenefits include competitive pay, training, and flexible schedules. Send us a WhatsApp message to apply!",
            ],
        },
    },
    {
        intent: "quality",
        patterns: ["quality", "care", "safe", "damage", "delicate", "stain", "silk", "trust"],
        responses: {
            en: [
                "We treat every garment with professional care! Professional-grade equipment, separate handling for delicates, quality inspection before delivery, and a 4.9/5 customer rating.",
            ],
        },
    },
];

export const FALLBACK: Record<string, string> = {
    en: "I'm not sure I understand that. Could you rephrase?\n\nI can help with services, pricing, pickup/delivery, locations, hours, commercial services, or job openings.",
    sin: "මට ඔබේ පණිවිඩය තේරුම් ගත නොහැක. කරුණාකර නැවත කියන්න.\n\nසේවා, මිල, එකතු/බෙදාහැරීම, පිහිටීම්, වේලාවන්, ව්‍යාපාරික සේවා හෝ රැකියාවන් ගැන උදව් කළ හැක.",
};
