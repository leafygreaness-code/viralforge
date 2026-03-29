import type {
  ProjectInput,
  RenderOutput,
  ScriptPackage,
  VoiceAsset
} from "../domain/types.js";

export interface LlmProvider {
  generateScript(input: ProjectInput): Promise<ScriptPackage>;
}

export interface TtsProvider {
  synthesize(script: ScriptPackage): Promise<VoiceAsset>;
}

export interface AssetProvider {
  resolveVisuals(script: ScriptPackage): Promise<Array<{ sceneNumber: number; assetUrl: string }>>;
}

export interface RenderProvider {
  renderVideo(input: {
    project: ProjectInput;
    script: ScriptPackage;
    voice: VoiceAsset;
    visuals: Array<{ sceneNumber: number; assetUrl: string }>;
  }): Promise<RenderOutput>;
}

export interface StorageProvider {
  getSignedUploadUrl(key: string): Promise<{ url: string; key: string }>;
  getPublicUrl(key: string): Promise<string>;
}

export interface PublisherProvider {
  publish(input: {
    platform: string;
    videoUrl: string;
    title: string;
    caption: string;
    scheduledFor?: string;
  }): Promise<{ remoteId: string; status: string }>;
}

