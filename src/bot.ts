import type { Lang } from "./types";
import { faqs, FALLBACK } from "./knowledge/faqs";
import { classifyIntent } from "./classifier";

/**
 * Pick a reply from the training corpus for a given intent + language.
 */
function replyFromCorpus(intent: string, lang: Lang): string {
    if (intent === "fallback") {
        return FALLBACK[lang] ?? FALLBACK.en;
    }

    const faq = faqs.find((f) => f.intent === intent);
    if (!faq) return FALLBACK[lang] ?? FALLBACK.en;

    const pool =
        lang === "sin" && faq.responses.sin && faq.responses.sin.length > 0
            ? faq.responses.sin
            : faq.responses.en;

    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * LLM / RAG integration point (used ONLY when explicitly configured).
 *
 * This is where the trained chatbot connects later. Build your prompt from
 * the knowledge base (`knowledge/faqs.ts`) and any retrieved context, then
 * call your provider. Left unimplemented on purpose — `generateReply` only
 * routes here when LLM_PROVIDER + LLM_API_KEY are set.
 *
 * Example (OpenAI-compatible):
 *   const res = await fetch(`${baseUrl}/chat/completions`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
 *     body: JSON.stringify({
 *       model,
 *       messages: [
 *         { role: "system", content: "You are the Love Laundry assistant..." },
 *         { role: "user", content: message },
 *       ],
 *     }),
 *   });
 */
async function askLLM(message: string, lang: Lang): Promise<string> {
    const provider = process.env.LLM_PROVIDER;
    const apiKey = process.env.LLM_API_KEY;
    const model = process.env.LLM_MODEL ?? "gpt-4o-mini";
    const baseUrl = process.env.LLM_BASE_URL ?? "https://api.openai.com/v1";

    if (!provider || !apiKey) {
        throw new Error("LLM not configured");
    }

    // NOTE: replace this with your trained-model / RAG call.
    const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
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

/**
 * Main entry point. Rule-based today; routes to the trained model when the
 * LLM env vars are present. The frontend never needs to know which is used.
 */
export async function generateReply(
    message: string,
    lang: Lang = "en"
): Promise<string> {
    if (process.env.LLM_PROVIDER && process.env.LLM_API_KEY) {
        try {
            return await askLLM(message, lang);
        } catch {
            // Fall through to the rule-based corpus on any LLM failure.
        }
    }

    const intent = classifyIntent(message);
    return replyFromCorpus(intent, lang);
}
