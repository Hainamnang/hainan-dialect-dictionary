"use client";

import type { ReactNode } from "react";
import type { Video } from "@/types/content";

type VideoSectionProps = {
  videos: Video[];
  renderDictionaryLinks: (text: string) => ReactNode;
};

export default function VideoSection({
  videos,
  renderDictionaryLinks,
}: VideoSectionProps) {
  return (
    <section
      id="videos"
      className="scroll-mt-24 rounded-xl border bg-white p-4"
    >
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
        <h2 className="mb-4 font-bold">Videos / วิดีโอ</h2>

        {videos.length === 0 ? (
          <p className="text-gray-500">
            ยังไม่มีวิดีโอที่เผยแพร่ในขณะนี้
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => {
              if (!video.youtube_video_id?.trim()) {
                return null;
              }

              const aspectRatio =
                video.aspect_ratio === "9:16" ? "9 / 16" : "16 / 9";

              return (
                <div
                  key={video.id}
                  className="rounded-lg border border-stone-200 bg-white p-3"
                >
                  <div className="font-semibold text-gray-900">
                    {video.title || "ไม่มีหัวข้อ"}
                  </div>

                  {video.description ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {renderDictionaryLinks(video.description)}
                    </p>
                  ) : null}

                  <div className="mt-3 w-full max-w-[900px] overflow-hidden rounded-lg border border-stone-200 bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.youtube_video_id}`}
                      title={video.title || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ aspectRatio }}
                      className="h-full w-full"
                    />
                  </div>

                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtube_video_id.trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  >
                    เปิดวิดีโอต้นฉบับบน YouTube
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
