"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Word = {
  id: number;
  meaning_th: string | null;
  simplified: string | null;
  traditional: string | null;
  hainan_pronunciation: string | null;
  hainan_pinyin: string | null;
  hainan_audio: string | null;
};

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  useEffect(() => {
    async function loadWords() {
      const { data, error } = await supabase
        .from("hainan_dictionary")
        .select(
          "id, meaning_th, simplified, traditional, hainan_pronunciation, hainan_pinyin, hainan_audio"
        )
        .lte("id", 221)
        .order("sort_key", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setWords(data || []);
      }
    }

    loadWords();
  }, []);

  const filteredWords = words
    .filter((word) => {
      const text = [
        word.meaning_th,
        word.simplified,
        word.traditional,
        word.hainan_pronunciation,
        word.hainan_pinyin,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search.toLowerCase());
    })
    .slice(0, 20);

  return (
    <main className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 1. Header */}
        <section className="bg-white rounded-xl border p-4">
          <Image
            src="/heading.jpg"
            alt="Hainanese Dialect Dictionary"
            width={1366}
            height={466}
            priority
            className="w-full h-auto rounded-lg"
          />
        </section>

        {/* 2. Search */}
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3">Search / ค้นหาคำศัพท์</h2>
          <input
            className="border rounded-lg p-3 w-full"
            placeholder="ค้นหาคำศัพท์..."
            value={search}
            onChange={(e) => {
  setSearch(e.target.value);
  setSelectedWord(null);
}}
          />
        </section>

        

        {/* 3. Vocabulary Detail */}
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3">Vocabulary Detail / รายละเอียดคำศัพท์</h2>

          {selectedWord ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">#{selectedWord.id}</div>
              <div className="text-2xl font-bold">{selectedWord.meaning_th}</div>
              <div>简体字: {selectedWord.simplified || "-"}</div>
              <div>繁體字: {selectedWord.traditional || "-"}</div>
              <div>เสียงไฮ้หน่ำ: {selectedWord.hainan_pronunciation || "-"}</div>
              <div>พินอินไฮ้หน่ำ: {selectedWord.hainan_pinyin || "-"}</div>

              {selectedWord.hainan_audio && (
                <audio
                  controls
                  className="mt-3"
                  src={selectedWord.hainan_audio}
                />
              )}
            </div>
          ) : (
            <p className="text-gray-500">คลิกคำศัพท์จากผลการค้นหา เพื่อดูรายละเอียด</p>
          )}
        </section>
{/* 4. Search Results */}
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3">Search Results / ผลการค้นหา</h2>

          <div className="space-y-2">
            {filteredWords.map((word) => (
              <button
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className="w-full text-left border rounded-lg p-3 hover:bg-stone-100"
              >
                <div className="text-sm text-gray-500">#{word.id}</div>
                <div className="font-bold">{word.meaning_th || "ไม่มีคำแปลไทย"}</div>
                <div className="text-sm">
                  {word.simplified} {word.traditional}
                </div>
              </button>
            ))}
          </div>
        </section>
        {/* 5. Example Sentence */}
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3">Example Sentence / ตัวอย่างประโยค</h2>
          <p className="text-gray-500">พื้นที่สำหรับตัวอย่างประโยคในอนาคต</p>
        </section>

        {/* 6. Image Area */}
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3">Image / รูปภาพประกอบ</h2>
          <p className="text-gray-500">พื้นที่สำหรับรูปภาพประกอบคำศัพท์</p>
        </section>

        {/* 7. Resources / Links */}
        <section className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3">Resources / Links</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>พื้นที่สำหรับลิงก์เว็บไซต์ที่เกี่ยวข้อง</li>
            <li>พื้นที่สำหรับ YouTube / Facebook / เอกสารอ้างอิง</li>
            <li>พื้นที่สำหรับลิงก์ของโครงการ</li>
          </ul>
        </section>

        {/* 8. Footer */}
        <footer className="text-center text-sm text-gray-500 py-6">
          Hainanese Dialect Dictionary — Version 0.1
        </footer>

      </div>
    </main>
  );
}

