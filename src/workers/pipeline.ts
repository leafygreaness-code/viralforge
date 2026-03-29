import type { GenerationRequest, ProjectInput } from "../domain/types.js";
import type {
  AssetProvider,
  LlmProvider,
  RenderProvider,
  TtsProvider
} from "../providers/interfaces.js";
import { log } from "../lib/logger.js";

export class GenerationPipeline {
  constructor(
    private readonly llm: LlmProvider,
    private readonly tts: TtsProvider,
    private readonly assets: AssetProvider,
    private readonly renderer: RenderProvider
  ) {}

  async run(project: ProjectInput, request: GenerationRequest) {
    log("pipeline.started", { projectId: request.projectId });

    const script = await this.llm.generateScript(project);
    log("pipeline.script.completed", { projectId: request.projectId });

    const voice = await this.tts.synthesize(script);
    log("pipeline.voice.completed", { projectId: request.projectId, voiceAssetId: voice.assetId });

    const visuals = await this.assets.resolveVisuals(script);
    log("pipeline.assets.completed", { projectId: request.projectId, assetCount: visuals.length });

    const render = await this.renderer.renderVideo({
      project,
      script,
      voice,
      visuals
    });

    log("pipeline.render.completed", {
      projectId: request.projectId,
      renderAssetId: render.assetId,
      url: render.url
    });

    return {
      script,
      voice,
      visuals,
      render
    };
  }
}
