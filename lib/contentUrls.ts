export const getSafeSourceUrl = (sourceUrl: string) => {
  try {
    const url = new URL(sourceUrl);
    return ["http:", "https:"].includes(url.protocol)
      ? url.toString()
      : null;
  } catch {
    return null;
  }
};

export const getYouTubeVideoId = (sourceUrl: string) => {
  try {
    const url = new URL(sourceUrl);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    } else if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "music.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else {
        const [route, id] = url.pathname.split("/").filter(Boolean);

        if (["embed", "shorts", "live"].includes(route)) {
          videoId = id || null;
        }
      }
    }

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)
      ? videoId
      : null;
  } catch {
    return null;
  }
};
