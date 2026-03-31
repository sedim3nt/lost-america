import type { Metadata } from "next";
import { TOTAL_IMAGES, TOTAL_CITIES } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — Lost America",
  description: "Lost America is a free, open archive of American history told through photographs from the Library of Congress.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 py-10">
      <div className="max-w-2xl">
        <h1 className="font-syne text-3xl sm:text-5xl font-bold text-dark-earth mb-8">
          About
        </h1>

        <div className="space-y-6 font-newsreader text-dark-earth/80 text-lg leading-relaxed">
          <p>
            <strong className="text-dark-earth">Lost America</strong> is a free, open archive of
            American history told through photographs. {TOTAL_IMAGES.toLocaleString()} images
            spanning {TOTAL_CITIES} cities and over 100 years — from the Civil War era to the
            dawn of the Space Age.
          </p>

          <p>
            All images are public domain, sourced from the{" "}
            <a
              href="https://www.loc.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-desert-sunset hover:underline"
            >
              Library of Congress
            </a>
            . They belong to everyone.
          </p>

          <p>
            This project exists because history deserves to be seen — not locked in archives,
            but alive and accessible. Every photograph here is a window into a world that
            shaped the one we live in now.
          </p>

          <p>
            Built by{" "}
            <strong className="text-dark-earth">SpiritTree</strong> — making the hidden visible.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-sand/50">
          <h2 className="font-syne text-xl font-bold text-dark-earth mb-4">
            Credits & Attribution
          </h2>
          <ul className="space-y-2 text-coyote font-newsreader">
            <li>
              Photographs: Library of Congress, Prints & Photographs Division
            </li>
            <li>All images are in the public domain with no known copyright restrictions.</li>
            <li>
              Fonts: Syne by Bonjour Monde, Newsreader by Production Type — via Google Fonts
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
