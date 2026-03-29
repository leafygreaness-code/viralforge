import { Router } from "express";
import { z } from "zod";
import { createGeneration, createProject, getProject, listProjects } from "../services/project-service.js";
import { queueGeneration } from "../services/generation-runner.js";
const projectSchema = z.object({
    title: z.string().min(1),
    prompt: z.string().min(1),
    platform: z.enum(["tiktok", "instagram", "youtube"]),
    durationSeconds: z.number().int().min(5).max(180),
    style: z.string().optional(),
    brandProfileId: z.string().optional()
});
const generationSchema = z.object({
    regenerateScript: z.boolean().optional(),
    regenerateAssets: z.boolean().optional(),
    regenerateVoice: z.boolean().optional()
});
export const projectsRouter = Router();
projectsRouter.get("/", (req, res) => {
    const userId = String(req.headers["x-user-id"] ?? "demo-user");
    res.json({ data: listProjects(userId) });
});
projectsRouter.post("/", (req, res) => {
    const userId = String(req.headers["x-user-id"] ?? "demo-user");
    const input = projectSchema.parse(req.body);
    const project = createProject(userId, input);
    res.status(201).json({ data: project });
});
projectsRouter.get("/:id", (req, res) => {
    const project = getProject(req.params.id);
    if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
    }
    res.json({ data: project });
});
projectsRouter.post("/:id/generations", (req, res) => {
    const userId = String(req.headers["x-user-id"] ?? "demo-user");
    const project = getProject(req.params.id);
    if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
    }
    const options = generationSchema.parse(req.body ?? {});
    const generation = createGeneration({
        projectId: project.id,
        userId,
        ...options
    });
    void queueGeneration(generation.id, project.id, userId);
    res.status(202).json({ data: generation });
});
