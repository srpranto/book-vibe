"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowDown,
  BookMarked,
  ShieldCheck,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Banner = (): ReactElement => {
  const handleScrollToLibrary = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ): void => {
    e.preventDefault();
    const el = document.getElementById("library");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", "#library");
    } else {
      window.location.hash = "library";
    }
  };

  return (
    <section className="px-3 sm:px-4 py-6 md:py-12">
      <div className="container mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-[#F7EFE7] via-[#FAF6F0] to-[#ECE0D3] px-4 py-8 text-center shadow-xs ring-1 ring-border/50 sm:px-8 sm:py-12 md:px-16 md:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-[#B87333]/15 blur-3xl" />

          <div className="relative mx-auto max-w-3xl space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D5C4] bg-white/90 px-3 py-1 sm:px-3.5 sm:py-1.5 shadow-2xs backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted p-1 text-primary">
                <Image
                  src="/icons/coffee.svg"
                  alt="Coffee"
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5"
                  style={{ width: "auto", height: "auto" }}
                />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#7A4B22]">
                Personal Book Tracker &amp; Library
              </span>
            </div>

            <h1 className="text-2xl min-[380px]:text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
              Track your books.{" "}
              <span className="bg-linear-to-r from-primary via-[#B87333] to-primary-hover bg-clip-text text-transparent">
                Organize your reading shelf.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base font-medium leading-relaxed text-[#5C4537]">
              Discover books from Open Library, organize what you want to read,
              and keep your personal notes, ratings, and quotes in one clean,
              quiet place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
              <Button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-command-palette"))
                }
                size="lg"
                className="w-full sm:w-auto group gap-2 rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-hover"
              >
                <Search className="h-4 w-4" />
                <span>Search Books</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-xl border-[#DCC8B6] bg-white/90 px-6 py-3 text-xs sm:text-sm font-bold text-[#4A2E18] shadow-2xs hover:border-primary hover:bg-muted"
              >
                <Link href="#library" onClick={handleScrollToLibrary}>
                  <span>Explore Library</span>
                  <ArrowDown className="ml-1 h-4 w-4 text-primary" />
                </Link>
              </Button>
            </div>

            <div className="pt-2 sm:pt-4">
              <div className="inline-grid w-full sm:w-auto grid-cols-1 divide-y divide-border rounded-2xl border border-border/80 bg-white/85 p-2 sm:p-3 shadow-2xs backdrop-blur-md sm:inline-flex sm:divide-y-0 sm:divide-x sm:divide-border sm:px-6 sm:py-3">
                <div className="px-3 py-2 text-center sm:px-5 sm:py-0">
                  <div className="flex items-center justify-center gap-1.5">
                    <BookMarked className="h-4 w-4 text-primary" />
                    <p className="text-lg font-extrabold text-foreground">
                      Easy Tracking
                    </p>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                    Reading, Want to Read, Finished &amp; Dropped
                  </p>
                </div>

                <div className="px-4 py-2 text-center sm:px-5 sm:py-0">
                  <div className="flex items-center justify-center gap-1.5">
                    <PenLine className="h-4 w-4 text-primary" />
                    <p className="text-lg font-extrabold text-foreground">
                      Personal Journal
                    </p>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                    Star ratings, notes, and favorite quotes
                  </p>
                </div>

                <div className="px-4 py-2 text-center sm:px-5 sm:py-0">
                  <div className="flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <p className="text-lg font-extrabold text-foreground">
                      100% Private
                    </p>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                    Saved directly on your device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
