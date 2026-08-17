"use client";

import type { RefObject } from "react";
import type { Word } from "@/types/content";

type DictionarySectionProps = {
  search: string;
  hasSearch: boolean;
  linkedWordId: number | null;
  displayedWord: Word | null;
  filteredWords: Word[];
  vocabularyDetailRef: RefObject<HTMLElement | null>;
  onSearchChange: (value: string) => void;
  onSelectWord: (word: Word) => void;
};

export default function DictionarySection({
  search,
  hasSearch,
  linkedWordId,
  displayedWord,
  filteredWords,
  vocabularyDetailRef,
  onSearchChange,
  onSelectWord,
}: DictionarySectionProps) {
  return (
    <>
      <section
        id="dictionary"
        className="scroll-mt-24 rounded-xl border bg-white p-4"
      >
        <h2 className="mb-3 font-bold">
          🔍 Search / ค้นหาคำศัพท์ --&gt;
          พิมพ์คำที่ต้องการค้นในช่องด้านล่าง ▼
        </h2>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
            🔍
          </span>

          <input
            className="w-full rounded-lg border-2 border-orange-300 bg-orange-50 py-3 pl-12 pr-4 text-lg focus:border-orange-500 focus:bg-white focus:outline-none"
            placeholder="ค้นหาคำศัพท์..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </section>

      {hasSearch ? (
        <section
          ref={vocabularyDetailRef}
          className="scroll-mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <h2 className="mb-3 font-bold">
            Vocabulary Detail / รายละเอียดคำศัพท์
          </h2>

          {displayedWord ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">
                #{displayedWord.id}
              </div>

              <div className="text-2xl font-bold">
                {displayedWord.meaning_th}
              </div>

              <div>
                <span className="text-gray-600">
                  อักษรจีนตัวย่อ (简体字):
                </span>
                <span className="ml-2 text-3xl font-bold text-red-700">
                  {displayedWord.simplified || "-"}
                </span>
              </div>

              <div>
                <span className="text-gray-600">
                  อักษรจีนตัวเต็ม (繁體字):
                </span>
                <span className="ml-2 text-3xl font-bold text-red-700">
                  {displayedWord.traditional || "-"}
                </span>
              </div>

              <div>
                <span className="font-bold text-gray-700">
                  เสียงไฮ้หน่ำ:
                </span>
                <span className="ml-2 text-2xl font-bold text-blue-700">
                  {displayedWord.hainan_pronunciation || "-"}
                </span>
              </div>

              <div>
                <span className="font-bold text-gray-700">
                  พินอินไฮ้หน่ำ:
                </span>
                <span className="ml-2">
                  {displayedWord.hainan_pinyin || "-"}
                </span>
              </div>

              {displayedWord.note ? (
                <div className="mt-4">
                  <div className="font-bold text-blue-700">
                    หมายเหตุ :
                  </div>
                  <hr className="my-2 border-gray-300" />
                  <div className="mt-2 whitespace-pre-wrap pl-5 leading-7">
                    {displayedWord.note}
                  </div>
                </div>
              ) : null}

              {displayedWord.example ? (
                <div className="mt-4">
                  <div className="font-bold text-green-700">
                    Example / ตัวอย่าง :
                  </div>
                  <hr className="my-2 border-gray-300" />
                  <div className="mt-2 pl-2">
                    {displayedWord.example}
                  </div>
                </div>
              ) : null}

              {displayedWord.hainan_audio ? (
                <audio
                  controls
                  className="mt-6"
                  src={displayedWord.hainan_audio}
                />
              ) : null}
            </div>
          ) : (
            <p className="text-gray-500">
              คลิกคำศัพท์จากผลการค้นหา เพื่อดูรายละเอียด
            </p>
          )}
        </section>
      ) : null}

      {hasSearch && linkedWordId === null ? (
        <section className="rounded-xl border bg-white p-4">
          <h2 className="mb-4 font-bold">
            Search Results / ค้นหาเพิ่มเติม --&gt;
            คลิกเลือกคำอื่นๆ ที่ปรากฏด้านล่าง ▼
          </h2>

          <div className="space-y-2">
            {filteredWords.length === 0 ? (
              <p className="rounded-lg bg-stone-50 p-4 text-gray-600">
                ไม่พบคำศัพท์ที่ตรงกับคำค้นนี้
              </p>
            ) : (
              filteredWords.map((word) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => onSelectWord(word)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    displayedWord?.id === word.id
                      ? "border-orange-400 bg-orange-100"
                      : "bg-white hover:bg-stone-100"
                  }`}
                >
                  <div className="text-sm text-gray-500">
                    #{word.id}
                  </div>
                  <div className="font-bold">
                    {word.meaning_th || "ไม่มีคำแปลไทย"}
                  </div>
                  <div className="text-sm">
                    {word.simplified} {word.traditional}
                  </div>
                </button>
              ))
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}
