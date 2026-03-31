import Link from "next/link";
import type { ImageData } from "@/lib/data";

export default function PhotoCard({ image }: { image: ImageData }) {
  return (
    <Link href={`/photo/${image.id}`} className="group block relative overflow-hidden rounded-sm">
      <img
        src={image.photoUrl}
        alt={image.title}
        loading="lazy"
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div>
          <p className="text-bone text-sm font-syne font-semibold leading-tight">
            {image.title}
          </p>
          <p className="text-sand/80 text-xs mt-1">{image.year}</p>
        </div>
      </div>
    </Link>
  );
}
