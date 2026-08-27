export const handler = async (req: any, res: any) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true, minimal: true }));
};
