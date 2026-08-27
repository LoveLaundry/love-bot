// Vercel serverless entry. @vercel/node looks for a named `handler` export.
// We lazy-import the Express app so any module-load error is caught and
// surfaced in the response (temporary diagnostic — see console.error too).
export const handler = async (req: any, res: any) => {
    try {
        const mod = await import("../src/app");
        const app = mod.default;
        return app(req, res);
    } catch (e: any) {
        console.error("BOT_HANDLER_ERROR", e);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(
            JSON.stringify({
                error: "bot handler failed",
                message: e?.message ?? String(e),
                stack: e?.stack,
            }),
        );
    }
};
