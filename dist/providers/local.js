import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { audioRoot, ensureMediaDirs, videoRoot } from "../lib/media.js";
const execFileAsync = promisify(execFile);
const ffmpegBin = "/opt/homebrew/bin/ffmpeg";
const ffprobeBin = "/opt/homebrew/bin/ffprobe";
const sayBin = "/usr/bin/say";
export class LocalLlmProvider {
    async generateScript(input) {
        const safePrompt = input.prompt.replace(/\s+/g, " ").trim();
        return {
            title: input.title,
            hook: `${input.platform.toUpperCase()} hook: ${safePrompt.slice(0, 90)}`,
            script: [
                `Here's a fast story about ${safePrompt}.`,
                "First, set up the tension right away.",
                "Then deliver the key insight in a clean, punchy way.",
                "End with a strong payoff and a call to follow for more."
            ].join(" "),
            cta: "Follow for more short-form content.",
            shotList: [
                { sceneNumber: 1, visualPrompt: "Bold opener", durationSeconds: Math.max(3, Math.floor(input.durationSeconds / 3)), caption: "Stop scrolling" },
                { sceneNumber: 2, visualPrompt: "Main explanation", durationSeconds: Math.max(4, Math.floor(input.durationSeconds / 3)), caption: "Here's the core idea" },
                { sceneNumber: 3, visualPrompt: "Payoff ending", durationSeconds: Math.max(3, input.durationSeconds - 2 * Math.max(3, Math.floor(input.durationSeconds / 3))), caption: "Here's why it matters" }
            ]
        };
    }
}
export class LocalTtsProvider {
    async synthesize(script) {
        await ensureMediaDirs();
        const assetId = `voice_${Date.now()}`;
        const aiffPath = path.join(audioRoot, `${assetId}.aiff`);
        await execFileAsync(sayBin, [
            "-v",
            "Samantha",
            "-o",
            aiffPath,
            script.script
        ]);
        const { stdout } = await execFileAsync(ffprobeBin, [
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            aiffPath
        ]);
        return {
            assetId,
            url: `/generated/audio/${assetId}.aiff`,
            durationMs: Math.round(Number(stdout.trim()) * 1000)
        };
    }
}
export class LocalAssetProvider {
    async resolveVisuals(script) {
        return script.shotList.map((shot) => ({
            sceneNumber: shot.sceneNumber,
            assetUrl: `scene:${shot.sceneNumber}:${shot.caption}`
        }));
    }
}
export class LocalRenderProvider {
    async renderVideo(input) {
        await ensureMediaDirs();
        const assetId = `video_${Date.now()}`;
        const outputPath = path.join(videoRoot, `${assetId}.mp4`);
        const duration = Math.max(8, input.project.durationSeconds, Number.isFinite(input.voice.durationMs) ? Math.ceil(input.voice.durationMs / 1000) : 0);
        const audioPath = path.join(process.cwd(), input.voice.url.replace(/^\//, ""));
        await execFileAsync(ffmpegBin, [
            "-y",
            "-f",
            "lavfi",
            "-i",
            `testsrc2=size=1080x1920:rate=24:duration=${duration}`,
            "-i",
            audioPath,
            "-shortest",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            outputPath
        ]);
        const { stdout } = await execFileAsync(ffprobeBin, [
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            outputPath
        ]);
        return {
            assetId,
            url: `/generated/video/${assetId}.mp4`,
            durationMs: Math.round(Number(stdout.trim()) * 1000)
        };
    }
}
export class LocalStorageProvider {
    async getSignedUploadUrl(key) {
        return {
            key,
            url: `/generated/${key}`
        };
    }
    async getPublicUrl(key) {
        return `/generated/${key}`;
    }
}
