"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import coffeeIcon from "@/assets/coffee.svg";

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
    } else {
      setReady(false);
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
      <nav className="container mx-auto max-w-7xl rounded-2xl border border-[#EADBCE] bg-[#FAF7F2]/90 px-4 shadow-sm backdrop-blur-md lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with Coffee & Book touch */}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#8B5A2B] transition hover:text-[#6F4420]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0E4D8] p-2 text-base shadow-xs text-[#8B5A2B]">
              <Image
                src={coffeeIcon}
                alt="Book Vibe logo"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </span>
            Book <span className="text-[#2C1810]">Vibe</span>
          </Link>

          {/* Desktop Navigation with sliding coffee cream pill */}
          <div className="hidden lg:flex">
            <ul
              ref={containerRef}
              className="relative flex items-center gap-1.5 rounded-full bg-[#EFE6DC]/70 p-1"
            >
              {/* Sliding pill — warm cream card shadow */}
              <span
                className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-white shadow-sm ring-1 ring-[#EADBCE]/50"
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
                        ? "font-bold text-[#2C1810]"
                        : "text-[#6B5141] hover:text-[#8B5A2B]"
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
            <button className="rounded-xl border border-[#DCC8B6] bg-white px-5 py-2.5 text-sm font-semibold text-[#4A2E18] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]">
              Sign In
            </button>

            <button className="rounded-xl bg-[#8B5A2B] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#8B5A2B]/20 transition hover:bg-[#6F4420] hover:shadow-lg">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-[#4A2E18] transition hover:bg-[#F5ECE3]"
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
                      ? "bg-[#F5ECE3] font-bold text-[#8B5A2B]"
                      : "text-[#5A381E] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <div className="my-2 border-t border-[#EADBCE]" />

            <li>
              <button className="w-full rounded-xl px-4 py-3 text-left font-medium text-[#4A2E18] hover:bg-[#F5ECE3]">
                Sign In
              </button>
            </li>

            <li>
              <button className="w-full rounded-xl bg-[#8B5A2B] px-4 py-3 text-left font-semibold text-white hover:bg-[#6F4420]">
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
