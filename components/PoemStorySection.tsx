"use client";

import { getSafeSourceUrl } from "@/lib/contentUrls";
import type { PoemStory } from "@/types/content";

type PoemStorySectionProps = {
  poemStories: PoemStory[];
  onSelectPoemStory: (poemStory: PoemStory) => void;
};

export default function PoemStorySection({
  poemStories,
  onSelectPoemStory,
}: PoemStorySectionProps) {
  return (
    <section
      id="poem-story"
      className="min-h-52 scroll-mt-24 rounded-xl bg-blue-700 p-4 text-white"
    >
      <h2 className="text-lg font-bold">Poem and Story</h2>

      {poemStories.length === 0 ? (
        <p className="mt-2 text-sm text-blue-50">
          ยังไม่มีบทกวีหรือเรื่องเล่าที่เผยแพร่ในขณะนี้
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {poemStories.map((poemStory) => {
            const headerImageUrl = poemStory.header_image_url
              ? getSafeSourceUrl(poemStory.header_image_url)
              : null;

            return (
              <article
                id={`poem-story-${poemStory.id}`}
                key={poemStory.id}
                className="scroll-mt-24 overflow-hidden rounded-lg bg-white text-gray-900 shadow-sm"
              >
                {headerImageUrl ? (
                  <img
                    src={headerImageUrl}
                    alt={poemStory.title}
                    loading="lazy"
                    className="h-36 w-full object-cover"
                  />
                ) : null}

                <div className="p-3">
                  <h3 className="font-bold leading-6">
                    {poemStory.title}
                  </h3>

                  <button
                    type="button"
                    onClick={() => onSelectPoemStory(poemStory)}
                    className="mt-3 rounded-lg bg-blue-800 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                  >
                    อ่านเพิ่มเติม
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
