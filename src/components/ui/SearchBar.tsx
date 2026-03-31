"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import type { ImageData } from "@/lib/data";

export default function SearchBar({ images }: { images: ImageData[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ImageData[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const fuseRef = useRef<Fuse<ImageData> | null>(null);

  useEffect(() => {
    fuseRef.current = new Fuse(images, {
      keys: ["title", "cityName"],
      threshold: 0.4,
    });
  }, [images]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const res = fuseRef.current?.search(value, { limit: 8 }) ?? [];
    setResults(res.map((r) => r.item));
    setOpen(true);
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search 1,000 photographs..."
        className="w-full px-5 py-3 rounded-full border border-sand bg-white/80 text-dark-earth placeholder:text-coyote/60 font-newsreader text-lg focus:outline-none focus:ring-2 focus:ring-desert-sunset/40 focus:border-desert-sunset transition"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-sand/50 overflow-hidden z-50">
          {results.map((img) => (
            <Link
              key={img.id}
              href={`/photo/${img.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-bone transition-colors"
            >
              <img
                src={img.photoUrl}
                alt={img.title}
                className="w-12 h-12 object-cover rounded-sm flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-syne font-medium text-dark-earth truncate">
                  {img.title}
                </p>
                <p className="text-xs text-coyote">
                  {img.cityName} · {img.year}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
