import { Router } from "express";
import { z } from "zod";
const publishSchema = z.object({
    projectId: z.string().min(1),
    platform: z.enum(["tiktok", "instagram", "youtube"]),
    scheduledFor: z.string().datetime().optional()
});
export const publishRouter = Router();
publishRouter.post("/", (req, res) => {
    const input = publishSchema.parse(req.body);
    res.status(202).json({
        data: {
            id: `publish_${Date.now()}`,
            status: "queued",
            ...input
        }
    });
});
