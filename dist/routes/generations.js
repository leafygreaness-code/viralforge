import { Router } from "express";
import { getGeneration } from "../services/project-service.js";
export const generationsRouter = Router();
generationsRouter.get("/:id", (req, res) => {
    const generation = getGeneration(req.params.id);
    if (!generation) {
        res.status(404).json({ error: "Generation not found" });
        return;
    }
    res.json({ data: generation });
});
