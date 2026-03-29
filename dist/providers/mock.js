export class MockLlmProvider {
    async generateScript(input) {
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
export class MockTtsProvider {
    async synthesize() {
        return {
            assetId: "voice_mock_1",
            url: "https://example.com/mock-voice.mp3",
            durationMs: 18000
        };
    }
}
export class MockAssetProvider {
    async resolveVisuals(script) {
        return script.shotList.map((shot) => ({
            sceneNumber: shot.sceneNumber,
            assetUrl: `https://example.com/assets/scene-${shot.sceneNumber}.png`
        }));
    }
}
export class MockRenderProvider {
    async renderVideo() {
        return {
            assetId: "render_mock_1",
            url: "https://example.com/renders/final.mp4",
            durationMs: 18000
        };
    }
}
export class MockStorageProvider {
    async getSignedUploadUrl(key) {
        return {
            key,
            url: `https://example.com/upload/${key}`
        };
    }
    async getPublicUrl(key) {
        return `https://example.com/public/${key}`;
    }
}
export class MockPublisherProvider {
    async publish() {
        return {
            remoteId: "publish_mock_1",
            status: "queued"
        };
    }
}
