import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import coffeeIcon from "@/assets/coffee.svg";

export const metadata: Metadata = {
  title: "Book Vibe — Coffee & Books",
  description:
    "A cozy sanctuary for book discovery, classic literature, and coffee lovers",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#FAF7F2] text-[#241812]">
        <Navbar />
        <div className="flex-1">{children}</div>

        {/* Cozy Coffee & Books Footer */}
        <footer className="mt-16 border-t border-[#E8DCCF] bg-[#1E140F] text-[#EFE4D8]">
          <div className="container mx-auto max-w-7xl px-4 py-12 lg:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {/* Brand & Coffee Vibe */}
              <div className="md:col-span-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#D4A373] transition hover:text-[#E8BC91]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#35231A] p-2 text-lg text-[#D4A373]">
                    <Image
                      src={coffeeIcon}
                      alt="Book Vibe logo"
                      width={18}
                      height={18}
                      className="h-4.5 w-4.5 invert"
                    />
                  </span>
                  Book <span className="text-white">Vibe</span>
                </Link>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#D8C7BA]">
                  A cozy sanctuary for passionate readers and coffee thinkers.
                  Grab a warm cup, sink into a comfortable armchair, and
                  discover your next literary companion.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-[#C4B2A5]">
                  <span>☕ Fresh Brew</span>
                  <span>•</span>
                  <span>📖 Classic Pages</span>
                  <span>•</span>
                  <span>🕯️ Cozy Ambience</span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A373]">
                  Navigation
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-[#D8C7BA]">
                  <li>
                    <Link href="/" className="transition hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/allbooks"
                      className="transition hover:text-white"
                    >
                      All Books (42)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pages-to-read"
                      className="transition hover:text-white"
                    >
                      Pages to Read
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Café Hours & Reading Time */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A373]">
                  Reading Room
                </h4>
                <p className="mt-3 text-sm text-[#D8C7BA]">
                  Open 24/7 for late-night thinkers and early morning espresso
                  readers.
                </p>
                <p className="mt-2 text-xs italic text-[#C4B2A5]">
                  &ldquo;A cup of coffee and a great book is the shortest escape
                  to another world.&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-[#332219] pt-6 text-center text-xs text-[#C4B2A5]">
              © {new Date().getFullYear()} Book Vibe. Crafted with ☕ and warm
              stories.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
