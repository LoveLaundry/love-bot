import "dotenv/config";
import express from "express";
import cors from "cors";
import { generateReply } from "./bot";
import type { ChatResponse } from "./types";

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

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
    console.log(`Love Laundry bot listening on http://localhost:${PORT}`);
});
