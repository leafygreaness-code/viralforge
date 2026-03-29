export interface YouTubeSourceMeta {
  kind: "youtube";
  url: string;
  videoId: string;
  title?: string;
  authorName?: string;
  thumbnailUrl?: string;
}

export function parseYouTubeUrl(input: string) {
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? { videoId, canonicalUrl: `https://www.youtube.com/watch?v=${videoId}` } : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        const videoId = url.searchParams.get("v");
        return videoId ? { videoId, canonicalUrl: `https://www.youtube.com/watch?v=${videoId}` } : null;
      }

      if (url.pathname.startsWith("/shorts/")) {
        const videoId = url.pathname.split("/").filter(Boolean)[1];
        return videoId ? { videoId, canonicalUrl: `https://www.youtube.com/watch?v=${videoId}` } : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function fetchYouTubeOEmbed(input: string): Promise<YouTubeSourceMeta | null> {
  const parsed = parseYouTubeUrl(input);
  if (!parsed) return null;

  const endpoint = new URL("https://www.youtube.com/oembed");
  endpoint.searchParams.set("url", parsed.canonicalUrl);
  endpoint.searchParams.set("format", "json");

  const response = await fetch(endpoint, {
    headers: {
      "User-Agent": "vivida-infra/0.1"
    }
  });

  if (!response.ok) {
    throw new Error(`YouTube oEmbed failed with ${response.status}`);
  }

  const data = await response.json() as {
    title?: string;
    author_name?: string;
    thumbnail_url?: string;
  };

  return {
    kind: "youtube",
    url: parsed.canonicalUrl,
    videoId: parsed.videoId,
    title: data.title,
    authorName: data.author_name,
    thumbnailUrl: data.thumbnail_url
  };
}

