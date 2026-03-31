"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import PhotoCard from "@/components/ui/PhotoCard";
import type { ImageData } from "@/lib/data";

const PAGE_SIZE = 50;

export default function GalleryClient({
  images,
  cities,
  eras,
}: {
  images: ImageData[];
  cities: { name: string; slug: string }[];
  eras: { slug: string; label: string }[];
}) {
  const [city, setCity] = useState("");
  const [era, setEra] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () => new Fuse(images, { keys: ["title", "cityName"], threshold: 0.4 }),
    [images]
  );

  const filtered = useMemo(() => {
    let result = images;
    if (city) result = result.filter((img) => img.citySlug === city);
    if (era) result = result.filter((img) => img.displayEra === era);
    if (search.trim()) {
      const ids = new Set(fuse.search(search, { limit: 200 }).map((r) => r.item.id));
      result = result.filter((img) => ids.has(img.id));
    }
    return result;
  }, [images, city, era, search, fuse]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [city, era, search]);

  // Infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && visibleCount < filtered.length) {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
      }
    },
    [visibleCount, filtered.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "400px" });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search photographs..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-sand bg-white/80 text-dark-earth placeholder:text-coyote/50 font-newsreader focus:outline-none focus:ring-2 focus:ring-desert-sunset/40 transition"
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-sand bg-white/80 text-dark-earth font-syne text-sm focus:outline-none focus:ring-2 focus:ring-desert-sunset/40 transition"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select
          value={era}
          onChange={(e) => setEra(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-sand bg-white/80 text-dark-earth font-syne text-sm focus:outline-none focus:ring-2 focus:ring-desert-sunset/40 transition"
        >
          <option value="">All Eras</option>
          {eras.map((e) => (
            <option key={e.slug} value={e.slug}>{e.label}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-coyote text-sm mb-4 font-syne">
        {filtered.length} photograph{filtered.length !== 1 ? "s" : ""}
        {city || era || search ? " found" : ""}
      </p>

      {/* Grid */}
      <div className="masonry-grid">
        {visible.map((img) => (
          <PhotoCard key={img.id} image={img} />
        ))}
      </div>

      {/* Loader sentinel */}
      {visibleCount < filtered.length && (
        <div ref={loaderRef} className="py-12 text-center">
          <p className="text-coyote/50 font-syne text-sm">Loading more photographs...</p>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-coyote font-newsreader text-lg italic">No photographs found.</p>
        </div>
      )}
    </div>
  );
}
