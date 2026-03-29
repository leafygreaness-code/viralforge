import { log } from "../lib/logger.js";
export class GenerationPipeline {
    llm;
    tts;
    assets;
    renderer;
    constructor(llm, tts, assets, renderer) {
        this.llm = llm;
        this.tts = tts;
        this.assets = assets;
        this.renderer = renderer;
    }
    async run(project, request) {
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
