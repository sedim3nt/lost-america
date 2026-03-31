import type { ImageData } from "@/lib/data";

export default function HeroImage({
  image,
  title,
  subtitle,
}: {
  image: ImageData;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative w-full h-[60vh] sm:h-[75vh] overflow-hidden">
      <img
        src={image.photoUrl}
        alt={image.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 max-w-[1220px] mx-auto w-full">
        <h1 className="font-syne text-4xl sm:text-6xl lg:text-8xl font-bold text-bone leading-none tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sand/90 text-lg sm:text-xl mt-3 max-w-xl font-newsreader italic">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
