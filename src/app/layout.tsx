import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lostamerica.spirittree.dev"),
  title: "Lost America — Historical Photography Archive",
  openGraph: { title: 'Lost America — Historical Photography', description: '1000 photographs from the Library of Congress. Every photo is a time machine.', images: ['https://raw.githubusercontent.com/sedim3nt/spirittree-assets/main/og/lostamerica-og.png'], type: 'website' }, twitter: { card: 'summary_large_image', images: ['https://raw.githubusercontent.com/sedim3nt/spirittree-assets/main/og/lostamerica-og.png'] }, description:
    "A museum-quality digital exhibition of American history through 1,000 public domain photographs from the Library of Congress.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏛️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <nav className="border-b border-sand/50 bg-bone/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-[1220px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
            <Link
              href="/"
              className="font-syne text-xl sm:text-2xl font-bold tracking-tight text-dark-earth hover:text-desert-sunset transition-colors"
            >
              Lost America
            </Link>
            <div className="flex items-center gap-4 sm:gap-8 text-sm font-syne">
              <Link
                href="/gallery"
                className="text-coyote hover:text-desert-sunset transition-colors"
              >
                Gallery
              </Link>
              <Link
                href="/cities"
                className="text-coyote hover:text-desert-sunset transition-colors hidden sm:block"
              >
                Cities
              </Link>
              <Link
                href="/eras"
                className="text-coyote hover:text-desert-sunset transition-colors hidden sm:block"
              >
                Eras
              </Link>
              <Link
                href="/about"
                className="text-coyote hover:text-desert-sunset transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="bg-charcoal text-sand/70 mt-auto">
          <div className="max-w-[1220px] mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <p className="font-syne text-lg text-bone/90 mb-1">
                  Lost America
                </p>
                <p className="text-sm">
                  Photographs from the Library of Congress, public domain.
                </p>
              </div>
              <div className="flex gap-6 text-sm font-syne">
                <Link
                  href="/gallery"
                  className="hover:text-bone transition-colors"
                >
                  Gallery
                </Link>
                <Link
                  href="/cities"
                  className="hover:text-bone transition-colors"
                >
                  Cities
                </Link>
                <Link
                  href="/eras"
                  className="hover:text-bone transition-colors"
                >
                  Eras
                </Link>
                <Link
                  href="/about"
                  className="hover:text-bone transition-colors"
                >
                  About
                </Link>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-sand/40">
              © {new Date().getFullYear()} Lost America. Built by SpiritTree.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
