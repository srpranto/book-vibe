"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Library, BookMarked, Search } from "lucide-react";

interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navLinks: readonly NavLinkItem[] = [
  { href: "/", label: "Library & Discover", icon: Library },
  { href: "/plan-to-read", label: "My Shelf & Journeys", icon: BookMarked },
] as const;

interface SliderState {
  left: number;
  width: number;
}

const Navbar = (): ReactElement => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeHref, setActiveHref] = useState<string>(pathname);
  const [slider, setSlider] = useState<SliderState>({ left: 0, width: 0 });
  const [ready, setReady] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const isLinkActive = useCallback(
    (href: string): boolean => {
      const current = activeHref;
      if (href === "/") {
        return (
          current === "/" ||
          current === "/allbooks" ||
          current.startsWith("/books")
        );
      }
      if (href === "/plan-to-read") {
        return (
          current === "/plan-to-read" ||
          current === "/journeys" ||
          current === "/listed-books"
        );
      }
      return current === href;
    },
    [activeHref],
  );

  const updateSlider = useCallback((): void => {
    const activeIndex = navLinks.findIndex((link) => isLinkActive(link.href));
    const activeLi = linkRefs.current[activeIndex];

    if (activeLi && activeLi.offsetWidth > 0) {
      setSlider({
        left: activeLi.offsetLeft,
        width: activeLi.offsetWidth,
      });
      setReady(true);
    }
  }, [isLinkActive]);

  const handleLinkPress = (href: string, index: number): void => {
    setActiveHref(href);
    const activeLi = linkRefs.current[index];
    if (activeLi && activeLi.offsetWidth > 0) {
      setSlider({
        left: activeLi.offsetLeft,
        width: activeLi.offsetWidth,
      });
      setReady(true);
    }
  };

  useEffect(() => {
    updateSlider();
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(updateSlider);
    }
  }, [updateSlider]);

  const [prevPathname, setPrevPathname] = useState<string>(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveHref(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    window.addEventListener("resize", updateSlider, { passive: true });
    return () => window.removeEventListener("resize", updateSlider);
  }, [updateSlider]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="container mx-auto max-w-7xl rounded-2xl border border-border bg-background/90 px-4 shadow-sm backdrop-blur-md lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex w-10 items-center justify-start md:hidden">
            <Link
              href="/"
              aria-label="Book Vibe Home"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-border-subtle p-2 text-primary shadow-xs transition-all duration-200 hover:bg-[#E8D8CA] active:scale-95"
            >
              <Image
                src="/icons/coffee.svg"
                alt="Book Vibe logo"
                width={20}
                height={20}
                className="h-5 w-5"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
          </div>

          <Link
            href="/"
            className="text-lg min-[360px]:text-xl font-extrabold tracking-tight text-primary transition-colors duration-200 hover:text-primary-hover active:scale-95 md:hidden"
          >
            Book <span className="text-[#2C1810]">Vibe</span>
          </Link>

          <div className="flex w-10 items-center justify-end md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-[#4A2E18] shadow-xs transition-all duration-200 hover:bg-muted active:scale-95"
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

          <Link
            href="/"
            className="hidden items-center gap-2 text-xl font-extrabold tracking-tight text-primary transition hover:text-primary-hover md:flex lg:text-2xl"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-border-subtle p-2 text-base text-primary shadow-xs">
              <Image
                src="/icons/coffee.svg"
                alt="Book Vibe logo"
                width={20}
                height={20}
                className="h-5 w-5"
                style={{ width: "auto", height: "auto" }}
              />
            </span>
            Book <span className="text-[#2C1810]">Vibe</span>
          </Link>

          <div className="hidden md:flex">
            <ul
              ref={containerRef}
              className="relative flex items-center gap-1 rounded-full bg-[#EFE6DC]/70 p-1 lg:gap-1.5"
            >
              <span
                data-allow-motion="true"
                className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-white shadow-sm ring-1 ring-border/50"
                style={{
                  transform: `translateX(${slider.left}px)`,
                  width: `${slider.width}px`,
                  opacity: ready ? 1 : 0,
                  transition: ready
                    ? "transform 350ms cubic-bezier(0.25, 1, 0.5, 1), width 350ms cubic-bezier(0.25, 1, 0.5, 1)"
                    : "none",
                  willChange: "transform, width",
                }}
              />

              {navLinks.map((link, i) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href);
                return (
                  <li
                    key={link.href}
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    className="relative z-10"
                  >
                    <Link
                      href={link.href}
                      prefetch={true}
                      onClick={() => handleLinkPress(link.href, i)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 lg:px-4 lg:py-2 lg:text-sm ${
                        active
                          ? "font-bold text-[#2C1810]"
                          : "font-semibold text-[#4A2E18] hover:text-primary"
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 shrink-0 transition-colors duration-200 lg:h-4 lg:w-4 ${
                          active ? "text-primary" : "text-muted-foreground"
                        }`}
                        strokeWidth={active ? 2.5 : 2}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden items-center gap-2 md:flex lg:gap-2.5">
            <Button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-command-palette"))
              }
              className="inline-flex items-center gap-2 rounded-xl border border-[#DCC8B6] bg-white px-3 py-2 text-xs font-semibold text-[#4A2E18] shadow-xs transition-all duration-200 hover:border-primary hover:bg-muted active:scale-[0.98]"
              title="Find in Library"
            >
              <Search className="h-3.5 w-3.5 text-primary" />
              <span className="hidden xl:inline">Find in Library</span>
              <kbd className="hidden lg:inline rounded bg-background px-1.5 py-0.5 font-mono text-[10px] text-[#8B6E5A] ring-1 ring-[#DCC8B6]">
                Ctrl K
              </kbd>
            </Button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            mobileOpen ? "max-h-96 pb-4 pt-2" : "max-h-0"
          }`}
        >
          <div className="rounded-2xl border border-border/80 bg-background/95 p-3.5 shadow-md">
            <div className="flex flex-col divide-y divide-border/60 rounded-xl border border-border/60 bg-white/80 overflow-hidden">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    onClick={() => {
                      handleLinkPress(link.href, i);
                      setMobileOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
                      active
                        ? "bg-primary/10 font-bold text-primary"
                        : "text-[#5A381E] hover:bg-muted/70 hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          active
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon
                          className="h-4 w-4"
                          strokeWidth={active ? 2.5 : 2}
                        />
                      </span>
                      <span>{link.label}</span>
                    </div>

                    {active && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="my-3 flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-xs text-[#9B887D]">☕</span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <Button
              onClick={() => {
                setMobileOpen(false);
                window.dispatchEvent(new CustomEvent("open-command-palette"));
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCC8B6] bg-white py-2.5 text-center text-sm font-semibold text-[#4A2E18] shadow-xs transition-all duration-200 hover:border-primary hover:bg-muted active:scale-[0.98]"
            >
              <Search className="h-4 w-4 text-primary" />
              <span>Search Catalog</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
