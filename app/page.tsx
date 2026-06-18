"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function loadWords() {
      const { data, error } = await supabase
        .from("hainan_dictionary")
        .select(
          "id, meaning_th, simplified, traditional, hainan_pronunciation, hainan_pinyin, hainan_audio"
        )
        .lte("id", 121)
.order("sort_key", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setWords(data || []);
      }
    }

    loadWords();
  }, []);

  const filteredWords = words.filter((word) => {
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
  });

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          พจนานุกรมภาษาไหหลำ
        </h1>

        <input
          className="border p-3 w-full mb-6"
          placeholder="ค้นหาคำศัพท์..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredWords.map((word) => (
          <div
            key={word.id}
            className="border rounded p-4 mb-4"
          >
            <div className="text-sm text-gray-500">
              #{word.id}
            </div>

            <div className="text-xl font-bold">
              {word.meaning_th}
            </div>

            <div>{word.simplified}</div>

            <div>{word.traditional}</div>

            <div>{word.hainan_pronunciation}</div>

            <div>{word.hainan_pinyin}</div>

            {word.hainan_audio && (
              <audio
                controls
                className="mt-2"
                src={word.hainan_audio}
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
