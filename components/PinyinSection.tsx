"use client";

import type { ReactNode } from "react";
import { getYouTubeVideoId } from "@/lib/contentUrls";
import type {
  PinyinLesson,
  PinyinLessonMedia,
} from "@/types/content";

type PinyinSectionProps = {
  lessons: PinyinLesson[];
  selectedLesson: PinyinLesson | null;
  media: PinyinLessonMedia[];
  shareMessage: string;
  onSelectLesson: (lesson: PinyinLesson) => void;
  onCloseLesson: () => void;
  onCopyLink: (lessonId: number) => void | Promise<void>;
  renderDictionaryLinks: (text: string) => ReactNode;
};

export default function PinyinSection({
  lessons,
  selectedLesson,
  media,
  shareMessage,
  onSelectLesson,
  onCloseLesson,
  onCopyLink,
  renderDictionaryLinks,
}: PinyinSectionProps) {
  return (
    <section
      id="pinyin-lessons"
      className="scroll-mt-24 rounded-xl border border-rose-200 bg-rose-100 p-5"
    >
      <h2 className="text-xl font-bold">Pinyin Lessons</h2>

      {lessons.length === 0 ? (
        <p className="mt-3 text-gray-700">
          ยังไม่มีบทเรียนที่เผยแพร่ในขณะนี้
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => onSelectLesson(lesson)}
              className={`w-full rounded-lg border p-3 text-left transition ${
                selectedLesson?.id === lesson.id
                  ? "border-rose-500 bg-white"
                  : "border-rose-200 bg-white/80 hover:bg-white"
              }`}
            >
              <div className="font-bold text-gray-900">
                {lesson.title}
              </div>

              {lesson.title_chinese ? (
                <div className="mt-1 text-lg text-red-700">
                  {lesson.title_chinese}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {selectedLesson ? (
        <div
          id={`pinyin-${selectedLesson.id}`}
          className="mt-4 scroll-mt-24 rounded-lg border border-rose-200 bg-white p-4"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {selectedLesson.title}
          </h3>

          {selectedLesson.title_chinese ? (
            <div className="mt-1 text-xl text-red-700">
              {selectedLesson.title_chinese}
            </div>
          ) : null}

          {selectedLesson.content ? (
            <div className="mt-4 whitespace-pre-wrap leading-8 text-gray-800">
              {renderDictionaryLinks(selectedLesson.content)}
            </div>
          ) : null}

          {media
            .filter((item) => item.media_type === "image")
            .map((item) => (
              <figure key={item.id} className="mt-4">
                <img
                  src={item.media_url}
                  alt={item.alt_text || selectedLesson.title}
                  className="max-h-[520px] w-full rounded-lg object-contain"
                />

                {item.caption ? (
                  <figcaption className="mt-2 text-sm text-gray-600">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}

          {media
            .filter((item) => item.media_type === "video")
            .map((item) => {
              const videoId = getYouTubeVideoId(item.media_url);

              if (!videoId) {
                return null;
              }

              return (
                <div key={item.id} className="mt-4">
                  <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-lg">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                      title={
                        item.alt_text ||
                        item.caption ||
                        selectedLesson.title
                      }
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {item.caption ? (
                    <p className="mt-2 text-sm text-gray-600">
                      {item.caption}
                    </p>
                  ) : null}
                </div>
              );
            })}

          {media
            .filter((item) => item.media_type === "audio")
            .map((item) => (
              <div key={item.id} className="mt-4">
                <audio
                  controls
                  preload="metadata"
                  src={item.media_url}
                  className="w-full"
                />

                {item.caption ? (
                  <p className="mt-2 text-sm text-gray-600">
                    {item.caption}
                  </p>
                ) : null}
              </div>
            ))}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onCopyLink(selectedLesson.id)}
              className="rounded-md bg-purple-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-purple-800"
            >
              Copy Link This Content
            </button>

            <button
              type="button"
              onClick={onCloseLesson}
              className="rounded-md border border-stone-300 px-3 py-2 text-sm text-gray-700 hover:bg-stone-50"
            >
              ปิดบทเรียน
            </button>

            {shareMessage ? (
              <span className="text-sm font-medium text-green-700">
                {shareMessage}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
