"use client";

import { useEffect, type ReactNode } from "react";
import { getSafeSourceUrl, getYouTubeVideoId } from "@/lib/contentUrls";
import type { PoemStory } from "@/types/content";

type PoemStoryDialogProps = {
  selectedPoemStory: PoemStory | null;
  shareMessage: string;
  onCopyLink: (poemStoryId: number) => void | Promise<void>;
  onClose: () => void;
  renderDictionaryLinks: (text: string) => ReactNode;
};

export default function PoemStoryDialog({
  selectedPoemStory,
  shareMessage,
  onCopyLink,
  onClose,
  renderDictionaryLinks,
}: PoemStoryDialogProps) {
  useEffect(() => {
    if (!selectedPoemStory) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPoemStory, onClose]);

  if (!selectedPoemStory) {
    return null;
  }

  const headerImageUrl = selectedPoemStory.header_image_url
    ? getSafeSourceUrl(selectedPoemStory.header_image_url)
    : null;
  const footerImageUrl = selectedPoemStory.footer_image_url
    ? getSafeSourceUrl(selectedPoemStory.footer_image_url)
    : null;
  const videoId = selectedPoemStory.video_url
    ? getYouTubeVideoId(selectedPoemStory.video_url)
    : null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-6"
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="poem-story-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white px-4 py-3 sm:px-6">
          <h2
            id="poem-story-dialog-title"
            className="text-lg font-bold text-gray-900 sm:text-xl"
          >
            {selectedPoemStory.title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดบทกวีหรือเรื่องเล่า"
            className="shrink-0 rounded-lg bg-gray-100 px-3 py-2 font-bold text-gray-700 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
          >
            ปิด ✕
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {headerImageUrl ? (
            <img
              src={headerImageUrl}
              alt={selectedPoemStory.title}
              className="max-h-[520px] w-full rounded-lg object-contain"
            />
          ) : null}

          <div
            className={`${headerImageUrl ? "mt-5" : ""} whitespace-pre-wrap leading-8 text-gray-800`}
          >
            {renderDictionaryLinks(selectedPoemStory.content)}
          </div>

          {videoId ? (
            <div className="mt-6 aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={`วิดีโอประกอบ: ${selectedPoemStory.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            </div>
          ) : null}

          {footerImageUrl ? (
            <img
              src={footerImageUrl}
              alt={`ภาพท้ายเรื่อง: ${selectedPoemStory.title}`}
              loading="lazy"
              className="mt-6 max-h-[520px] w-full rounded-lg object-contain"
            />
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={() => onCopyLink(selectedPoemStory.id)}
              className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Copy Link This Content
            </button>

            {shareMessage ? (
              <span className="text-sm font-medium text-green-700">
                {shareMessage}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
