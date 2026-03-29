import crypto from "node:crypto";
import type {
  GenerationRequest,
  GenerationResult,
  ProjectInput,
  ProjectStatus
} from "../domain/types.js";

type StoredProject = ProjectInput & {
  id: string;
  userId: string;
  status: ProjectStatus;
  videoUrl?: string;
  generationId?: string;
  createdAt: string;
  updatedAt: string;
};

type StoredGeneration = GenerationRequest & {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
  videoUrl?: string;
  result?: GenerationResult;
  error?: string;
  createdAt: string;
};

const projects = new Map<string, StoredProject>();
const generations = new Map<string, StoredGeneration>();

export function createProject(userId: string, input: ProjectInput) {
  const project: StoredProject = {
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

export function listProjects(userId: string) {
  return Array.from(projects.values()).filter((project) => project.userId === userId);
}

export function getProject(projectId: string) {
  return projects.get(projectId) ?? null;
}

export function createGeneration(input: GenerationRequest) {
  const generation: StoredGeneration = {
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

export function getGeneration(generationId: string) {
  return generations.get(generationId) ?? null;
}

export function markGenerationRunning(generationId: string) {
  const generation = generations.get(generationId);
  if (!generation) return null;

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

export function markGenerationCompleted(generationId: string, result: GenerationResult) {
  const generation = generations.get(generationId);
  if (!generation) return null;

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

export function markGenerationFailed(generationId: string, error: string) {
  const generation = generations.get(generationId);
  if (!generation) return null;

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
