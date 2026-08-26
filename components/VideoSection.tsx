"use client";

import { useState, type ReactNode } from "react";
import type { Video } from "@/types/content";

type VideoSectionProps = {
  videos: Video[];
  renderDictionaryLinks: (text: string) => ReactNode;
};

export default function VideoSection({
  videos,
  renderDictionaryLinks,
}: VideoSectionProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const selectedVideo =
    videos.find((video) => video.id === selectedVideoId) ?? null;

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
                    <>
                      <p className="mt-1 line-clamp-5 whitespace-pre-wrap text-sm text-gray-600">
                        {renderDictionaryLinks(video.description)}
                      </p>
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => setSelectedVideoId(video.id)}
                        className="mt-2 text-sm font-semibold text-purple-700 hover:text-purple-900"
                      >
                        คลิ๊ก ....อ่านต่อ
                      </button>
                    </>
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

      {selectedVideo?.description ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`video-description-title-${selectedVideo.id}`}
          onClick={() => setSelectedVideoId(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                id={`video-description-title-${selectedVideo.id}`}
                className="text-lg font-bold text-gray-900"
              >
                {selectedVideo.title || "คำบรรยายวิดีโอ"}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedVideoId(null)}
                className="shrink-0 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-stone-100"
              >
                ปิด
              </button>
            </div>

            <div className="mt-5 whitespace-pre-wrap text-base leading-8 text-gray-700">
              {renderDictionaryLinks(selectedVideo.description)}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
