import app from "../src/app";

// Vercel (@vercel/node) accepts either a named `handler` or a default export.
// We provide both. Any synchronous init/invoke error is surfaced in the body
// so failures are diagnosable without Vercel log access.
export const handler = (req: any, res: any) => {
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
