import { Router } from "express";
export const webhooksRouter = Router();
webhooksRouter.post("/render", (req, res) => {
    res.json({
        ok: true,
        received: req.body ?? null
    });
});
webhooksRouter.post("/billing", (req, res) => {
    res.json({
        ok: true,
        received: req.body ?? null
    });
});
