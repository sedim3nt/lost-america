"use client";

import SearchBar from "@/components/ui/SearchBar";
import type { ImageData } from "@/lib/data";

export default function HomeSearch({ images }: { images: ImageData[] }) {
  return <SearchBar images={images} />;
}
