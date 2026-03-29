import { LocalAssetProvider, LocalLlmProvider, LocalRenderProvider, LocalTtsProvider } from "../providers/local.js";
import { getProject, markGenerationCompleted, markGenerationFailed, markGenerationRunning } from "./project-service.js";
import { GenerationPipeline } from "../workers/pipeline.js";
import { logError } from "../lib/logger.js";

const pipeline = new GenerationPipeline(
  new LocalLlmProvider(),
  new LocalTtsProvider(),
  new LocalAssetProvider(),
  new LocalRenderProvider()
);

export async function queueGeneration(generationId: string, projectId: string, userId: string) {
  setTimeout(async () => {
    try {
      markGenerationRunning(generationId);
      const project = getProject(projectId);
      if (!project) {
        throw new Error("Project not found for generation");
      }

      const result = await pipeline.run(project, {
        generationId,
        projectId,
        userId
      } as never);

      markGenerationCompleted(generationId, result);
    } catch (error) {
      logError("generation.failed", error, { generationId, projectId });
      markGenerationFailed(
        generationId,
        error instanceof Error ? error.message : "Generation failed"
      );
    }
  }, 50);
}
