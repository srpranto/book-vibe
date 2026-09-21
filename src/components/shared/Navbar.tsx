"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import coffeeIcon from "@/assets/coffee.svg";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/allbooks", label: "All Books" },
  { href: "/pages-to-read", label: "Pages to Read" },
] as const;

const Navbar = () => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [slider, setSlider] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLinkActive = useCallback(
    (href: string) => {
      if (href === pathname) return true;
      if (
        href === "/allbooks" &&
        (pathname === "/books" || pathname === "/listed-books")
      ) {
        return true;
      }
      return false;
    },
    [pathname],
  );

  const updateSlider = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeIndex = navLinks.findIndex((link) => isLinkActive(link.href));
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
  }, [isLinkActive]);

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
          {/* MOBILE ONLY (screens < md): Left Coffee Icon */}
          <div className="flex w-10 items-center justify-start md:hidden">
            <Link
              href="/"
              aria-label="Book Vibe Home"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0E4D8] p-2 text-[#8B5A2B] shadow-xs transition hover:bg-[#E8D8CA]"
            >
              <Image
                src={coffeeIcon}
                alt="Book Vibe logo"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </Link>
          </div>

          {/* MOBILE ONLY (screens < md): Centered Book Vibe Text */}
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-[#8B5A2B] transition hover:text-[#6F4420] md:hidden"
          >
            Book <span className="text-[#2C1810]">Vibe</span>
          </Link>

          {/* MOBILE ONLY (screens < md): Right Hamburger Menu Button */}
          <div className="flex w-10 items-center justify-end md:hidden">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-[#4A2E18] shadow-xs transition hover:bg-[#F5ECE3]"
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

          {/* TABLET, LAPTOP, PC (screens md and up): Standard Left Brand Logo */}
          <Link
            href="/"
            className="hidden items-center gap-2 text-xl font-extrabold tracking-tight text-[#8B5A2B] transition hover:text-[#6F4420] md:flex lg:text-2xl"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0E4D8] p-2 text-base text-[#8B5A2B] shadow-xs">
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

          {/* TABLET, LAPTOP, PC (screens md and up): Navigation with sliding cream pill */}
          <div className="hidden md:flex">
            <ul
              ref={containerRef}
              className="relative flex items-center gap-1 rounded-full bg-[#EFE6DC]/70 p-1 lg:gap-1.5"
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
                    className={`block rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 lg:px-5 lg:py-2 lg:text-sm ${
                      isLinkActive(link.href)
                        ? "font-bold text-[#2C1810]"
                        : "font-semibold text-[#4A2E18] hover:text-[#8B5A2B]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* TABLET, LAPTOP, PC (screens md and up): Action Buttons */}
          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            <button className="rounded-xl border border-[#DCC8B6] bg-white px-3.5 py-2 text-xs font-semibold text-[#4A2E18] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B] lg:px-5 lg:py-2.5 lg:text-sm">
              Sign In
            </button>

            <button className="rounded-xl bg-[#8B5A2B] px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-[#8B5A2B]/20 transition hover:bg-[#6F4420] hover:shadow-lg lg:px-5 lg:py-2.5 lg:text-sm">
              Sign Up
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU (screens < md): Centered & Aesthetic */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            mobileOpen ? "max-h-96 pb-4 pt-2" : "max-h-0"
          }`}
        >
          <div className="rounded-2xl border border-[#EADBCE]/80 bg-[#FAF7F2]/95 p-4 shadow-inner">
            {/* Centered Navigation Links */}
            <ul className="flex flex-col items-center space-y-1.5 text-center">
              {navLinks.map((link) => (
                <li key={link.href} className="w-full">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors duration-200 ${
                      isLinkActive(link.href)
                        ? "bg-[#8B5A2B] text-white shadow-md shadow-[#8B5A2B]/20"
                        : "text-[#5A381E] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Centered Decorative Coffee Divider */}
            <div className="my-3.5 flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-[#EADBCE]" />
              <span className="text-xs text-[#9B887D]">☕</span>
              <div className="h-px flex-1 bg-[#EADBCE]" />
            </div>

            {/* Centered Action Buttons */}
            <div className="flex flex-col items-center space-y-2 text-center">
              <button className="w-full rounded-xl border border-[#DCC8B6] bg-white py-2.5 text-center text-sm font-semibold text-[#4A2E18] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]">
                Sign In
              </button>

              <button className="w-full rounded-xl bg-[#8B5A2B] py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-[#8B5A2B]/20 transition hover:bg-[#6F4420]">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
