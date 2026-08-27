"use client";

import { Fragment, type ReactNode } from "react";
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

type PinyinLessonDetailProps = {
  lesson: PinyinLesson;
  media: PinyinLessonMedia[];
  shareMessage: string;
  onClose: () => void;
  onCopyLink: (lessonId: number) => void | Promise<void>;
  renderDictionaryLinks: (text: string) => ReactNode;
};

function PinyinLessonDetail({
  lesson,
  media,
  shareMessage,
  onClose,
  onCopyLink,
  renderDictionaryLinks,
}: PinyinLessonDetailProps) {
  const lessonMedia = media.filter((item) => item.lesson_id === lesson.id);
  const videos = lessonMedia.filter((item) => item.media_type === "video");
  const audio = lessonMedia.filter((item) => item.media_type === "audio");
  const images = lessonMedia.filter((item) => item.media_type === "image");

  return (
    <div
      id={`pinyin-${lesson.id}`}
      className="col-span-full scroll-mt-24 rounded-lg border border-rose-200 bg-white p-4"
    >
      <h3 className="text-lg font-bold text-gray-900">
        {lesson.title}
      </h3>

      {lesson.title_chinese ? (
        <div className="mt-1 text-xl text-red-700">
          {lesson.title_chinese}
        </div>
      ) : null}

      {lesson.content ? (
        <div className="mt-4 whitespace-pre-wrap leading-8 text-gray-800">
          {renderDictionaryLinks(lesson.content)}
        </div>
      ) : null}

      {videos.map((item) => {
        const videoId = getYouTubeVideoId(item.media_url);

        if (!videoId) {
          return null;
        }

        return (
          <div key={item.id} className="mt-4">
            <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={item.alt_text || item.caption || lesson.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
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

      {audio.map((item) => (
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
          onClick={() => onCopyLink(lesson.id)}
          className="rounded-md bg-purple-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-purple-800"
        >
          Copy Link This Content
        </button>

        <button
          type="button"
          onClick={onClose}
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

      {images.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {images.map((item) => (
            <figure
              key={item.id}
              className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-rose-200 bg-rose-50"
            >
              <img
                src={item.media_url}
                alt={item.alt_text || lesson.title}
                className="h-auto w-full object-contain"
                loading="lazy"
              />

              {item.alt_text || item.caption ? (
                <figcaption className="p-3 text-sm text-gray-600">
                  {item.caption || item.alt_text}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  );
}

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
  const handleToggleLesson = (lesson: PinyinLesson) => {
    if (selectedLesson?.id === lesson.id) {
      onCloseLesson();
      return;
    }

    onSelectLesson(lesson);

    window.setTimeout(() => {
      document.getElementById(`pinyin-${lesson.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

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
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson) => {
            const isSelected = selectedLesson?.id === lesson.id;

            return (
              <Fragment key={lesson.id}>
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition ${
                    isSelected
                      ? "border-red-500 ring-1 ring-red-200"
                      : "border-rose-200"
                  }`}
                >
                  {lesson.thumbnail_url ? (
                    <div className="flex h-40 items-center justify-center bg-stone-50">
                      <img
                        src={lesson.thumbnail_url}
                        alt={lesson.thumbnail_alt_text || lesson.title}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">
                        {lesson.title}
                      </h3>

                      {lesson.title_chinese ? (
                        <p className="mt-1 text-lg text-red-700">
                          {lesson.title_chinese}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleLesson(lesson)}
                      aria-expanded={isSelected}
                      aria-controls={`pinyin-${lesson.id}`}
                      className="mt-4 inline-flex w-fit rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                    >
                      {isSelected ? "ปิดบทเรียน" : "เปิดบทเรียน"}
                    </button>
                  </div>
                </article>

                {isSelected ? (
                  <PinyinLessonDetail
                    lesson={lesson}
                    media={media}
                    shareMessage={shareMessage}
                    onClose={onCloseLesson}
                    onCopyLink={onCopyLink}
                    renderDictionaryLinks={renderDictionaryLinks}
                  />
                ) : null}
              </Fragment>
            );
          })}
        </div>
      )}
    </section>
  );
}
