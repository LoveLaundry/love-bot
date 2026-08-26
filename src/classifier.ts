import { faqs } from "./knowledge/faqs";

/**
 * Lightweight keyword/regex intent classifier.
 *
 * This is only a stand-in until the trained model / RAG pipeline is ready.
 * Replace `classifyIntent` usage in `bot.ts` once a real classifier exists.
 */
export function classifyIntent(text: string): string {
    const lower = text.toLowerCase();

    const rules: Array<{ intent: string; test: RegExp }> = [
        { intent: "greeting", test: /\b(hi|hello|hey|good\s*(morning|evening)|sup|howdy)\b/ },
        { intent: "services", test: /\b(service|offer|provide|wash|fold|iron|dry\s*clean|laundry)\b/ },
        { intent: "pricing", test: /\b(how\s*much|price|cost|rate|charge|fee|tariff|quote)\b/ },
        { intent: "pickup", test: /\b(pick\s*up|deliver|collect|drop\s*off|schedule|book|turnaround)\b/ },
        { intent: "locations", test: /\b(where|location|address|branch|chilaw|madampe|mahawewa|find\s*you|map)\b/ },
        { intent: "hours", test: /\b(hour|open|close|time|when|available)\b/ },
        { intent: "contact", test: /\b(contact|phone|whatsapp|call|email|number|reach)\b/ },
        { intent: "commercial", test: /\b(hotel|business|commercial|bulk|restaurant|spa|gym|corporate|linen)\b/ },
        { intent: "careers", test: /\b(job|hiring|work|career|team|employ|vacancy|apply)\b/ },
        { intent: "quality", test: /\b(quality|care|safe|damage|delicate|stain|silk|trust)\b/ },
    ];

    for (const rule of rules) {
        if (rule.test.test(lower)) return rule.intent;
    }

    // Deeper scan against the FAQ pattern vocabulary as a fallback.
    for (const faq of faqs) {
        if (faq.patterns.some((p) => lower.includes(p))) return faq.intent;
    }

    return "fallback";
}
