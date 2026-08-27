import app from "../src/app";

// Vercel invokes this with (req, res) — an Express app is a valid request
// listener, so we export it directly. The function is mounted at /api/chat,
// which matches the app's POST /api/chat route.
export default app;
