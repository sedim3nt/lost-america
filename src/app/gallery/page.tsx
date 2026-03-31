import type { Metadata } from "next";
import { getAllImages, getUniqueCities, getEras } from "@/lib/data";
import GalleryClient from "@/components/features/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery — Lost America",
  description: "Browse 1,000 historical photographs of American cities, people, and landscapes from the Library of Congress.",
};

export default function GalleryPage() {
  const images = getAllImages();
  const cities = getUniqueCities();
  const eras = getEras();

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-syne text-3xl sm:text-4xl font-bold text-dark-earth mb-2">
        Gallery
      </h1>
      <p className="text-coyote mb-8 font-newsreader">
        {images.length.toLocaleString()} photographs from across America
      </p>
      <GalleryClient
        images={images}
        cities={cities.map((c) => ({ name: c.name, slug: c.slug }))}
        eras={eras.map((e) => ({ slug: e.slug, label: e.label }))}
      />
    </div>
  );
}
