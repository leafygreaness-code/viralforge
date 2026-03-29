import type {
  AssetProvider,
  LlmProvider,
  PublisherProvider,
  RenderProvider,
  StorageProvider,
  TtsProvider
} from "./interfaces.js";
import type { ProjectInput, RenderOutput, ScriptPackage, VoiceAsset } from "../domain/types.js";

export class MockLlmProvider implements LlmProvider {
  async generateScript(input: ProjectInput): Promise<ScriptPackage> {
    return {
      title: input.title,
      hook: `You won't believe this ${input.platform} idea.`,
      script: `Hook. Main point. Curiosity loop. Payoff. CTA for ${input.platform}.`,
      cta: "Follow for more.",
      shotList: [
        { sceneNumber: 1, visualPrompt: "High contrast opener", durationSeconds: 4, caption: "Stop scrolling" },
        { sceneNumber: 2, visualPrompt: "Main scene with kinetic motion", durationSeconds: 8, caption: "Here's the story" },
        { sceneNumber: 3, visualPrompt: "Payoff shot", durationSeconds: 6, caption: "Here's why it works" }
      ]
    };
  }
}

export class MockTtsProvider implements TtsProvider {
  async synthesize(): Promise<VoiceAsset> {
    return {
      assetId: "voice_mock_1",
      url: "https://example.com/mock-voice.mp3",
      durationMs: 18000
    };
  }
}

export class MockAssetProvider implements AssetProvider {
  async resolveVisuals(script: ScriptPackage) {
    return script.shotList.map((shot) => ({
      sceneNumber: shot.sceneNumber,
      assetUrl: `https://example.com/assets/scene-${shot.sceneNumber}.png`
    }));
  }
}

export class MockRenderProvider implements RenderProvider {
  async renderVideo(): Promise<RenderOutput> {
    return {
      assetId: "render_mock_1",
      url: "https://example.com/renders/final.mp4",
      durationMs: 18000
    };
  }
}

export class MockStorageProvider implements StorageProvider {
  async getSignedUploadUrl(key: string) {
    return {
      key,
      url: `https://example.com/upload/${key}`
    };
  }

  async getPublicUrl(key: string) {
    return `https://example.com/public/${key}`;
  }
}

export class MockPublisherProvider implements PublisherProvider {
  async publish() {
    return {
      remoteId: "publish_mock_1",
      status: "queued"
    };
  }
}

