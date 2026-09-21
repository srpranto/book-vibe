"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import bookIcon from "@/assets/book.ico";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/listed-books", label: "Listed Books" },
  { href: "/pages-to-read", label: "Pages to Read" },
] as const;

const Navbar = () => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [slider, setSlider] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateSlider = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeIndex = navLinks.findIndex((link) => link.href === pathname);
    const activeEl = linkRefs.current[activeIndex];

    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setSlider({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
      setReady(true);
    }
  }, [pathname]);

  // Recalculate on route change
  useEffect(() => {
    updateSlider();
  }, [updateSlider]);

  // Recalculate on window resize to stay accurate
  useEffect(() => {
    window.addEventListener("resize", updateSlider);
    return () => window.removeEventListener("resize", updateSlider);
  }, [updateSlider]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="container mx-auto max-w-7xl rounded-2xl border border-gray-200/70 bg-white/90 px-4 shadow-sm backdrop-blur-md lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-emerald-600 transition hover:text-emerald-700"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 p-1">
              <Image
                src={bookIcon}
                alt="Book Vibe logo"
                width={28}
                height={28}
              />
            </span>
            Book <span className="text-gray-900">Vibe</span>
          </Link>

          {/* Desktop Navigation with sliding indicator */}
          <div className="hidden lg:flex">
            <ul
              ref={containerRef}
              className="relative flex items-center gap-2 rounded-full bg-gray-50 p-1"
            >
              {/* Sliding pill — hidden until first measurement to avoid flash */}
              <span
                className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-white shadow-sm"
                style={{
                  left: slider.left,
                  width: slider.width,
                  opacity: ready ? 1 : 0,
                  transition: ready
                    ? "left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)"
                    : "none",
                }}
              />

              {navLinks.map((link, i) => (
                <li key={link.href} className="relative z-10">
                  <Link
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    href={link.href}
                    className={`block rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                      pathname === link.href
                        ? "font-semibold text-gray-900"
                        : "text-gray-600 hover:text-emerald-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <button className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600">
              Sign In
            </button>

            <button className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            mobileOpen ? "max-h-80 pb-4" : "max-h-0"
          }`}
        >
          <ul className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3 font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <div className="my-2 border-t border-gray-100" />

            <li>
              <button className="w-full rounded-xl px-4 py-3 text-left font-medium hover:bg-gray-50">
                Sign In
              </button>
            </li>

            <li>
              <button className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-left font-semibold text-white hover:bg-emerald-700">
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
