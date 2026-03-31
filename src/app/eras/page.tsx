import type { Metadata } from "next";
import Link from "next/link";
import { getEras, getImagesByEra } from "@/lib/data";

export const metadata: Metadata = {
  title: "Eras — Lost America",
  description: "Browse historical photographs by era of American history.",
};

export default function ErasPage() {
  const eras = getEras();

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-syne text-3xl sm:text-4xl font-bold text-dark-earth mb-2">
        Eras
      </h1>
      <p className="text-coyote font-newsreader mb-10">
        100 years of American history in four chapters
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {eras.map((era) => {
          const images = getImagesByEra(era.slug);
          const sample = images[Math.floor(images.length / 3)];
          return (
            <Link
              key={era.slug}
              href={`/era/${era.slug}`}
              className="group relative aspect-[3/2] overflow-hidden rounded-sm"
            >
              {sample && (
                <img
                  src={sample.photoUrl}
                  alt={era.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="font-syne font-bold text-bone text-2xl sm:text-3xl">
                  {era.label}
                </p>
                <p className="text-desert-sunset font-syne text-sm mt-1">
                  {era.subtitle}
                </p>
                <p className="text-sand/70 text-sm mt-2 max-w-md font-newsreader">
                  {era.description}
                </p>
                <p className="text-sand/50 text-xs mt-2">
                  {images.length} photographs
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
