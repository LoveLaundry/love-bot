export interface Faq {
    intent: string;
    patterns: string[];
    responses: {
        en: string[];
        /** Optional Sinhala responses. Falls back to `en` when absent. */
        sin?: string[];
    };
}

export type Lang = "en" | "sin";

export interface ChatRequest {
    message: string;
    lang?: Lang;
}

export interface ChatResponse {
    reply: string;
    intent?: string;
}
