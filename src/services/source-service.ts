import type { ProjectInput } from "../domain/types.js";
import { fetchYouTubeOEmbed, parseYouTubeUrl } from "../lib/source.js";

export async function enrichProjectInput(input: ProjectInput): Promise<ProjectInput> {
  const maybeUrl = input.sourceUrl ?? input.prompt;
  const youtube = parseYouTubeUrl(maybeUrl);

  if (!youtube) {
    return {
      ...input,
      sourceType: input.sourceType ?? "prompt"
    };
  }

  try {
    const meta = await fetchYouTubeOEmbed(maybeUrl);
    return {
      ...input,
      title: pickTitle(input.title, meta?.title),
      prompt: meta?.title
        ? `Create a short-form summary based on this YouTube video title: ${meta.title}`
        : input.prompt,
      sourceType: "youtube",
      sourceUrl: meta?.url ?? youtube.canonicalUrl,
      sourceMeta: meta
        ? {
            videoId: meta.videoId,
            title: meta.title,
            authorName: meta.authorName,
            thumbnailUrl: meta.thumbnailUrl
          }
        : {
            videoId: youtube.videoId
          }
    };
  } catch {
    return {
      ...input,
      sourceType: "youtube",
      sourceUrl: youtube.canonicalUrl,
      sourceMeta: {
        videoId: youtube.videoId
      }
    };
  }
}

function pickTitle(existingTitle: string, fetchedTitle?: string) {
  const looksGeneric = existingTitle.trim().toLowerCase() === "test video";
  return looksGeneric && fetchedTitle ? fetchedTitle : existingTitle;
}

