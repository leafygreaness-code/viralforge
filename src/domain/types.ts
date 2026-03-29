export type Platform = "tiktok" | "instagram" | "youtube";

export type ProjectStatus =
  | "draft"
  | "queued"
  | "generating"
  | "rendering"
  | "ready"
  | "failed"
  | "published";

export type GenerationStepName =
  | "script"
  | "storyboard"
  | "voiceover"
  | "captions"
  | "assets"
  | "render"
  | "publish";

export interface ProjectInput {
  title: string;
  prompt: string;
  platform: Platform;
  durationSeconds: number;
  style?: string;
  brandProfileId?: string;
  sourceType?: "prompt" | "youtube";
  sourceUrl?: string;
  sourceMeta?: {
    videoId?: string;
    title?: string;
    authorName?: string;
    thumbnailUrl?: string;
  };
}

export interface GenerationRequest {
  projectId: string;
  userId: string;
  regenerateScript?: boolean;
  regenerateAssets?: boolean;
  regenerateVoice?: boolean;
}

export interface ScriptPackage {
  title: string;
  hook: string;
  script: string;
  cta: string;
  shotList: Array<{
    sceneNumber: number;
    visualPrompt: string;
    durationSeconds: number;
    caption: string;
  }>;
}

export interface VoiceAsset {
  assetId: string;
  url: string;
  durationMs: number;
}

export interface RenderOutput {
  assetId: string;
  url: string;
  durationMs: number;
}

export interface GenerationResult {
  script: ScriptPackage;
  voice: VoiceAsset;
  visuals: Array<{ sceneNumber: number; assetUrl: string }>;
  render: RenderOutput;
}
