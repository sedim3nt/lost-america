import type { Metadata } from "next";
import Link from "next/link";
import { getUniqueCities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cities — Lost America",
  description: "Browse historical photographs by American city.",
};

export default function CitiesPage() {
  const cities = getUniqueCities();

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-syne text-3xl sm:text-4xl font-bold text-dark-earth mb-2">
        Cities & Collections
      </h1>
      <p className="text-coyote font-newsreader mb-10">
        {cities.length} collections of American photography
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/city/${city.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-sm"
          >
            <img
              src={city.sample.photoUrl}
              alt={city.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-3 sm:p-4">
              <p className="font-syne font-bold text-bone text-sm sm:text-base">
                {city.name}
              </p>
              <p className="text-sand/70 text-xs">{city.count} photographs</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
