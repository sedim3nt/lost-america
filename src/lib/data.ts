import rawImages from "@/data/images.json";

export interface ImageData {
  id: number;
  title: string;
  date: string;
  loc_id: string;
  image_url: string;
  query: string;
  era: string;
  filename: string;
  local_path: string;
  photoUrl: string;
  year: number;
  displayEra: string;
  cityName: string;
  citySlug: string;
}

const ERA_RANGES = [
  { slug: "1860-1899", label: "1860–1899", subtitle: "The Gilded Age", min: 1860, max: 1899, description: "From the aftermath of the Civil War through the explosive growth of industry, railroads, and cities. America transformed from an agrarian republic into an industrial powerhouse, while immigrants poured through Ellis Island seeking a new life." },
  { slug: "1900-1919", label: "1900–1919", subtitle: "The Progressive Era", min: 1900, max: 1919, description: "The dawn of the American century — skyscrapers rose, automobiles replaced horses, and the nation grappled with labor rights, women's suffrage, and a world war that would reshape the globe." },
  { slug: "1920-1939", label: "1920–1939", subtitle: "Boom & Bust", min: 1920, max: 1939, description: "The roaring twenties gave way to the Great Depression. Jazz, prohibition, and speculation defined the era's highs; breadlines, dust storms, and migration defined its lows." },
  { slug: "1940-1960", label: "1940–1960", subtitle: "The Modern Age", min: 1940, max: 1960, description: "World War II galvanized the nation, and the postwar boom built the suburbs, the highway system, and the American middle class. A new world was taking shape." },
] as const;

export type EraInfo = (typeof ERA_RANGES)[number];

function capitalize(s: string): string {
  return s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-");
}

function getDisplayEra(year: number): string {
  for (const era of ERA_RANGES) {
    if (year >= era.min && year <= era.max) return era.slug;
  }
  if (year < 1860) return "1860-1899";
  return "1940-1960";
}

const images: ImageData[] = rawImages
  .map((img, index) => {
    const year = new Date(img.date).getFullYear();
    return {
      id: index,
      ...img,
      photoUrl: `/photos/${img.filename}`,
      year,
      displayEra: getDisplayEra(year),
      cityName: capitalize(img.query),
      citySlug: slugify(img.query),
    };
  })
  .sort((a, b) => a.date.localeCompare(b.date));

export function getAllImages(): ImageData[] {
  return images;
}

export function getImageById(id: number): ImageData | undefined {
  return images.find((img) => img.id === id);
}

export function getImagesByCity(slug: string): ImageData[] {
  return images.filter((img) => img.citySlug === slug);
}

export function getImagesByEra(eraSlug: string): ImageData[] {
  return images.filter((img) => img.displayEra === eraSlug);
}

export function getUniqueCities(): { name: string; slug: string; count: number; sample: ImageData }[] {
  const cityMap = new Map<string, { name: string; slug: string; images: ImageData[] }>();
  for (const img of images) {
    if (!cityMap.has(img.citySlug)) {
      cityMap.set(img.citySlug, { name: img.cityName, slug: img.citySlug, images: [] });
    }
    cityMap.get(img.citySlug)!.images.push(img);
  }
  return Array.from(cityMap.values())
    .map((c) => ({ name: c.name, slug: c.slug, count: c.images.length, sample: c.images[0] }))
    .sort((a, b) => b.count - a.count);
}

export function getEras(): readonly EraInfo[] {
  return ERA_RANGES;
}

export function getEraBySlug(slug: string): EraInfo | undefined {
  return ERA_RANGES.find((e) => e.slug === slug);
}

export function getRelatedImages(image: ImageData, limit = 4): ImageData[] {
  const sameCity = images.filter((img) => img.id !== image.id && img.citySlug === image.citySlug);
  if (sameCity.length >= limit) return sameCity.slice(0, limit);
  const sameEra = images.filter(
    (img) => img.id !== image.id && img.displayEra === image.displayEra && img.citySlug !== image.citySlug
  );
  return [...sameCity, ...sameEra].slice(0, limit);
}

export function getAdjacentImages(id: number): { prev: ImageData | undefined; next: ImageData | undefined } {
  const idx = images.findIndex((img) => img.id === id);
  return {
    prev: idx > 0 ? images[idx - 1] : undefined,
    next: idx < images.length - 1 ? images[idx + 1] : undefined,
  };
}

export function getFeaturedImage(): ImageData {
  // Pick a dramatic NYC or Chicago image
  const candidates = images.filter(
    (img) =>
      (img.query === "new york" || img.query === "chicago") &&
      img.title.length > 10
  );
  return candidates[Math.floor(candidates.length / 2)] || images[0];
}

export function getLatestImages(count = 8): ImageData[] {
  return [...images].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count);
}

export const TOTAL_IMAGES = images.length;
export const TOTAL_CITIES = getUniqueCities().length;
