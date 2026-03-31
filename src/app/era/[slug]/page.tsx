import type { Metadata } from "next";
import { getEras, getEraBySlug, getImagesByEra } from "@/lib/data";
import PhotoGrid from "@/components/ui/PhotoGrid";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getEras().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const era = getEraBySlug(slug);
  return {
    title: `${era?.label ?? slug} — Lost America`,
    description: `American photographs from ${era?.label ?? slug}. ${era?.description ?? ""}`,
  };
}

export default async function EraPage({ params }: Props) {
  const { slug } = await params;
  const era = getEraBySlug(slug);
  const images = getImagesByEra(slug);

  if (!era) return <div className="p-20 text-center">Era not found.</div>;

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-syne text-3xl sm:text-5xl font-bold text-dark-earth mb-2">
        {era.label}
      </h1>
      <h2 className="font-syne text-lg text-desert-sunset mb-4">{era.subtitle}</h2>
      <p className="text-dark-earth/80 font-newsreader max-w-2xl leading-relaxed mb-10">
        {era.description}
      </p>
      <p className="text-coyote font-syne text-sm mb-6">
        {images.length} photographs
      </p>
      <PhotoGrid images={images} />
    </div>
  );
}
