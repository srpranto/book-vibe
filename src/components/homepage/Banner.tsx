import type { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";

const Banner = (): ReactElement => {
  return (
    <section className="px-4 py-8 md:py-14">
      <div className="container mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-4xl border border-[#EADBCE] bg-linear-to-br from-[#F7EFE7] via-[#FAF6F0] to-[#ECE0D3] px-6 py-14 text-center shadow-xs ring-1 ring-[#EADBCE]/50 md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#D4A373]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#B87333]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5ECE3]/60 blur-2xl" />

          <div className="relative mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D5C4] bg-white/90 px-4 py-1.5 shadow-xs backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5ECE3] p-1 text-[#8B5A2B]">
                <Image
                  src="/icons/coffee.svg"
                  alt="Coffee"
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5"
                />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A4B22] md:text-sm">
                A Quiet Corner for Coffee & Books
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#241812] sm:text-5xl lg:text-6xl">
              Books to freshen up{" "}
              <span className="bg-linear-to-r from-[#8B5A2B] via-[#B87333] to-[#6F4420] bg-clip-text text-transparent">
                your bookshelf.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-[#3E2D22] md:text-lg">
              Sink into a warm armchair with a fresh brew. Explore our curated
              collection of 100 timeless literary, philosophical, and Islamic
              masterworks crafted to inspire and stay with you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/allbooks"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-[#8B5A2B] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#8B5A2B]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6F4420] hover:shadow-xl hover:shadow-[#8B5A2B]/30 active:scale-[0.98]"
              >
                <span>Browse All Books</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="#books"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DCC8B6] bg-white/90 px-7 py-4 text-base font-bold text-[#4A2E18] shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B] active:scale-[0.98]"
              >
                <span>Explore Bestsellers</span>
                <span className="text-xs text-[#8B5A2B]">↓</span>
              </Link>
            </div>

            <div className="pt-6">
              <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-[#EADBCE]/80 bg-white/70 px-8 py-4 shadow-xs backdrop-blur-md sm:gap-12">
                <div>
                  <p className="text-2xl font-extrabold text-[#241812]">100</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5C4537]">
                    Curated Books
                  </p>
                </div>

                <div className="h-8 w-px bg-[#EADBCE]" />

                <div>
                  <p className="text-2xl font-extrabold text-[#241812]">30+</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5C4537]">
                    Master Authors
                  </p>
                </div>

                <div className="h-8 w-px bg-[#EADBCE]" />

                <div>
                  <div className="flex items-center justify-center gap-1.5">
                    <p className="text-2xl font-extrabold text-[#241812]">
                      4.9
                    </p>
                    <span className="text-sm text-[#E5A93C]">★</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5C4537]">
                    Reader Rating
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
