import { mkdir } from "node:fs/promises";
import path from "node:path";

export const projectRoot = path.resolve(process.cwd());
export const generatedRoot = path.join(projectRoot, "generated");
export const audioRoot = path.join(generatedRoot, "audio");
export const videoRoot = path.join(generatedRoot, "video");
export const tempRoot = path.join(generatedRoot, "temp");

export async function ensureMediaDirs() {
  await mkdir(audioRoot, { recursive: true });
  await mkdir(videoRoot, { recursive: true });
  await mkdir(tempRoot, { recursive: true });
}

