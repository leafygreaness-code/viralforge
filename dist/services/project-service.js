import crypto from "node:crypto";
const projects = new Map();
const generations = new Map();
export function createProject(userId, input) {
    const project = {
        ...input,
        id: crypto.randomUUID(),
        userId,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    projects.set(project.id, project);
    return project;
}
export function listProjects(userId) {
    return Array.from(projects.values()).filter((project) => project.userId === userId);
}
export function getProject(projectId) {
    return projects.get(projectId) ?? null;
}
export function createGeneration(input) {
    const generation = {
        ...input,
        id: crypto.randomUUID(),
        status: "queued",
        createdAt: new Date().toISOString()
    };
    generations.set(generation.id, generation);
    const project = projects.get(input.projectId);
    if (project) {
        project.status = "queued";
        project.generationId = generation.id;
        project.updatedAt = new Date().toISOString();
        projects.set(project.id, project);
    }
    return generation;
}
export function getGeneration(generationId) {
    return generations.get(generationId) ?? null;
}
export function markGenerationRunning(generationId) {
    const generation = generations.get(generationId);
    if (!generation)
        return null;
    generation.status = "running";
    generations.set(generation.id, generation);
    const project = projects.get(generation.projectId);
    if (project) {
        project.status = "generating";
        project.updatedAt = new Date().toISOString();
        projects.set(project.id, project);
    }
    return generation;
}
export function markGenerationCompleted(generationId, result) {
    const generation = generations.get(generationId);
    if (!generation)
        return null;
    generation.status = "completed";
    generation.result = result;
    generation.videoUrl = result.render.url;
    generations.set(generation.id, generation);
    const project = projects.get(generation.projectId);
    if (project) {
        project.status = "ready";
        project.videoUrl = result.render.url;
        project.updatedAt = new Date().toISOString();
        projects.set(project.id, project);
    }
    return generation;
}
export function markGenerationFailed(generationId, error) {
    const generation = generations.get(generationId);
    if (!generation)
        return null;
    generation.status = "failed";
    generation.error = error;
    generations.set(generation.id, generation);
    const project = projects.get(generation.projectId);
    if (project) {
        project.status = "failed";
        project.updatedAt = new Date().toISOString();
        projects.set(project.id, project);
    }
    return generation;
}
