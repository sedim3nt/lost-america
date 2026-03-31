import type { ImageData } from "@/lib/data";
import PhotoCard from "./PhotoCard";

export default function PhotoGrid({ images }: { images: ImageData[] }) {
  return (
    <div className="masonry-grid">
      {images.map((image) => (
        <PhotoCard key={image.id} image={image} />
      ))}
    </div>
  );
}
