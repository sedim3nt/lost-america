import type { Metadata } from "next";
import { getUniqueCities, getImagesByCity } from "@/lib/data";
import PhotoGrid from "@/components/ui/PhotoGrid";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getUniqueCities().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cities = getUniqueCities();
  const city = cities.find((c) => c.slug === slug);
  return {
    title: `${city?.name ?? slug} — Lost America`,
    description: `Historical photographs of ${city?.name ?? slug} from the Library of Congress.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const cities = getUniqueCities();
  const city = cities.find((c) => c.slug === slug);
  const images = getImagesByCity(slug);

  if (!city) return <div className="p-20 text-center">City not found.</div>;

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-syne text-3xl sm:text-5xl font-bold text-dark-earth mb-2">
        {city.name}
      </h1>
      <p className="text-coyote font-newsreader mb-10">
        {images.length} photographs
      </p>
      <PhotoGrid images={images} />
    </div>
  );
}
