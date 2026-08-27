import express from "express";
import cors from "cors";

// ───────────────────────── Types ─────────────────────────
type Lang = "en" | "sin";

interface Faq {
    intent: string;
    patterns: string[];
    responses: { en: string[]; sin?: string[] };
}

interface ChatResponse {
    reply: string;
    intent?: string;
}

// ─────────────────────── Knowledge base ───────────────────────
const faqs: Faq[] = [
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

const FALLBACK: Record<string, string> = {
    en: "I'm not sure I understand that. Could you rephrase?\n\nI can help with services, pricing, pickup/delivery, locations, hours, commercial services, or job openings.",
    sin: "මට ඔබේ පණිවිඩය තේරුම් ගත නොහැක. කරුණාකර නැවත කියන්න.\n\nසේවා, මිල, එකතු/බෙදාහැරීම, පිහිටීම්, වේලාවන්, ව්‍යාපාරික සේවා හෝ රැකියාවන් ගැන උදව් කළ හැක.",
};

// ─────────────────────── Classifier ───────────────────────
function classifyIntent(text: string): string {
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
    for (const faq of faqs) {
        if (faq.patterns.some((p) => lower.includes(p))) return faq.intent;
    }
    return "fallback";
}

function replyFromCorpus(intent: string, lang: Lang): string {
    if (intent === "fallback") return FALLBACK[lang] ?? FALLBACK.en;
    const faq = faqs.find((f) => f.intent === intent);
    if (!faq) return FALLBACK[lang] ?? FALLBACK.en;
    const pool = lang === "sin" && faq.responses.sin && faq.responses.sin.length > 0
        ? faq.responses.sin
        : faq.responses.en;
    return pool[Math.floor(Math.random() * pool.length)];
}

// ─────────────────── LLM integration point (optional) ───────────────────
async function askLLM(message: string, lang: Lang): Promise<string> {
    const provider = process.env.LLM_PROVIDER;
    const apiKey = process.env.LLM_API_KEY;
    const model = process.env.LLM_MODEL ?? "gpt-4o-mini";
    const baseUrl = process.env.LLM_BASE_URL ?? "https://api.openai.com/v1";
    if (!provider || !apiKey) throw new Error("LLM not configured");
    const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
            model,
            messages: [
                {
                    role: "system",
                    content:
                        "You are the Love Laundry support assistant. Answer in " +
                        (lang === "sin" ? "Sinhala" : "English") +
                        " using only facts about Love Laundry's services, pricing, pickup/delivery, locations, hours, commercial services, and careers.",
                },
                { role: "user", content: message },
            ],
        }),
    });
    if (!res.ok) throw new Error(`LLM request failed: ${res.status}`);
    const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("LLM returned empty reply");
    return reply;
}

export async function generateReply(message: string, lang: Lang = "en"): Promise<string> {
    if (process.env.LLM_PROVIDER && process.env.LLM_API_KEY) {
        try {
            return await askLLM(message, lang);
        } catch {
            // Fall through to rule-based corpus on any LLM failure.
        }
    }
    const intent = classifyIntent(message);
    return replyFromCorpus(intent, lang);
}

// ─────────────────────── Express app ───────────────────────
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.CHAT_API_KEY;

app.post("/api/chat", async (req, res) => {
    try {
        const body = req.body as { message?: unknown; lang?: unknown };
        if (typeof body.message !== "string" || body.message.trim() === "") {
            return res.status(400).json({ error: "message is required" });
        }
        if (API_KEY && req.headers["x-api-key"] !== API_KEY) {
            return res.status(401).json({ error: "unauthorized" });
        }
        const lang = body.lang === "sin" ? "sin" : "en";
        const reply = await generateReply(body.message, lang);
        const payload: ChatResponse = { reply, intent: undefined };
        res.json(payload);
    } catch {
        res.status(500).json({ error: "internal error" });
    }
});

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

export { app };

// Vercel (@vercel/node) accepts a named `handler` or default export.
const handler = (req: any, res: any) => {
    try {
        return app(req, res);
    } catch (e: any) {
        console.error("BOT_HANDLER_ERROR", e);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
                JSON.stringify({
                    error: "bot handler failed",
                    message: e?.message ?? String(e),
                }),
            );
        }
    }
};

export default handler;
