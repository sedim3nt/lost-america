import type { Metadata } from "next";
import Link from "next/link";
import { getAllImages, getImageById, getRelatedImages, getAdjacentImages } from "@/lib/data";
import PhotoCard from "@/components/ui/PhotoCard";
import GhostNarrator from "@/components/features/GhostNarrator";
import ghostNarratives from "@/lib/ghost-narratives.json";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAllImages().map((img) => ({ id: String(img.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const image = getImageById(Number(id));
  if (!image) return { title: "Photo — Lost America" };
  return {
    title: `${image.title} — Lost America`,
    description: `${image.title}, ${image.year}. ${image.cityName}. From the Library of Congress.`,
    openGraph: {
      images: [{ url: image.photoUrl }],
    },
  };
}

export default async function PhotoPage({ params }: Props) {
  const { id } = await params;
  const image = getImageById(Number(id));
  if (!image) return <div className="p-20 text-center">Photo not found.</div>;

  const related = getRelatedImages(image);
  const { prev, next } = getAdjacentImages(image.id);

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 py-10">
      <div className="relative">
        <img
          src={image.photoUrl}
          alt={image.title}
          className="max-w-full max-h-[80vh] object-contain bg-charcoal/5 rounded-sm mx-auto"
        />
      </div>

      <div className="mt-8 max-w-3xl">
        <h1 className="font-syne text-2xl sm:text-3xl font-bold text-dark-earth">
          {image.title}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-coyote font-syne">
          <span>{image.year}</span>
          <Link href={`/city/${image.citySlug}`} className="hover:text-desert-sunset transition-colors">
            {image.cityName}
          </Link>
          <Link href={`/era/${image.displayEra}`} className="hover:text-desert-sunset transition-colors">
            {image.displayEra}
          </Link>
        </div>

        <p className="mt-6 text-dark-earth/80 font-newsreader leading-relaxed">
          This photograph, titled <em>{image.title}</em>, was taken in {image.year} in{" "}
          {image.cityName}. It is part of the Library of Congress collection documenting
          American life during the {image.displayEra} era.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm font-syne">
          <a
            href={image.loc_id}
            target="_blank"
            rel="noopener noreferrer"
            className="text-desert-sunset hover:underline"
          >
            View on Library of Congress →
          </a>
        </div>

        <p className="mt-4 text-xs text-coyote/60">
          Photographs from the Library of Congress, public domain.
        </p>

        <GhostNarrator
          name={image.title}
          location={image.cityName}
          era={image.displayEra}
          description={`A photograph titled "${image.title}" from ${image.year} in ${image.cityName}.`}
          prewrittenNarrative={(ghostNarratives as Record<string, string>)[image.citySlug]}
        />
      </div>

      <div className="mt-10 flex justify-between items-center border-t border-sand/50 pt-6">
        {prev ? (
          <Link
            href={`/photo/${prev.id}`}
            className="font-syne text-sm text-coyote hover:text-desert-sunset transition-colors"
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/photo/${next.id}`}
            className="font-syne text-sm text-coyote hover:text-desert-sunset transition-colors"
          >
            Next →
          </Link>
        ) : (
          <span />
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-syne text-xl font-bold text-dark-earth mb-6">
            Related Photographs
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((img) => (
              <PhotoCard key={img.id} image={img} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
