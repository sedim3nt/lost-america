import Link from "next/link";
import {
  getAllImages,
  getFeaturedImage,
  getUniqueCities,
  getEras,
  getLatestImages,
  getImagesByEra,
  TOTAL_IMAGES,
  TOTAL_CITIES,
} from "@/lib/data";
import HeroImage from "@/components/ui/HeroImage";
import PhotoGrid from "@/components/ui/PhotoGrid";
import HomeSearch from "@/components/features/HomeSearch";

export default function HomePage() {
  const featured = getFeaturedImage();
  const cities = getUniqueCities().slice(0, 12);
  const eras = getEras();
  const latest = getLatestImages(8);
  const allImages = getAllImages();

  return (
    <div>
      <HeroImage
        image={featured}
        title="Lost America"
        subtitle="Every photograph is a time machine"
      />

      {/* Search */}
      <section className="max-w-[1220px] mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <HomeSearch images={allImages} />
      </section>

      {/* Browse by City */}
      <section className="max-w-[1220px] mx-auto px-4 sm:px-6 mt-20">
        <h2 className="font-syne text-2xl sm:text-3xl font-bold text-dark-earth mb-8">
          Browse by City
        </h2>
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
                <p className="text-sand/70 text-xs">
                  {city.count} photographs
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/cities"
            className="font-syne text-sm text-desert-sunset hover:underline"
          >
            View all {TOTAL_CITIES} collections →
          </Link>
        </div>
      </section>

      {/* Browse by Era */}
      <section className="max-w-[1220px] mx-auto px-4 sm:px-6 mt-20">
        <h2 className="font-syne text-2xl sm:text-3xl font-bold text-dark-earth mb-8">
          Browse by Era
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {eras.map((era) => {
            const eraImages = getImagesByEra(era.slug);
            const sample = eraImages[Math.floor(eraImages.length / 3)];
            return (
              <Link
                key={era.slug}
                href={`/era/${era.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-sm"
              >
                {sample && (
                  <img
                    src={sample.photoUrl}
                    alt={era.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                  <p className="font-syne font-bold text-bone text-xl sm:text-2xl">
                    {era.label}
                  </p>
                  <p className="text-sand/80 text-sm mt-1">{era.subtitle}</p>
                  <p className="text-sand/50 text-xs mt-1">
                    {eraImages.length} photographs
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Additions */}
      <section className="max-w-[1220px] mx-auto px-4 sm:px-6 mt-20">
        <h2 className="font-syne text-2xl sm:text-3xl font-bold text-dark-earth mb-8">
          Recent Additions
        </h2>
        <PhotoGrid images={latest} />
      </section>

      {/* Stats */}
      <section className="max-w-[1220px] mx-auto px-4 sm:px-6 mt-20 mb-20 text-center">
        <p className="font-newsreader text-coyote text-lg italic">
          {TOTAL_IMAGES.toLocaleString()} photographs · {TOTAL_CITIES} cities ·
          100 years of American history
        </p>
      </section>
    </div>
  );
}
