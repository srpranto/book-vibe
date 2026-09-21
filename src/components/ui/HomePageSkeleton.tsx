import type { ReactElement } from "react";
import BookGridSkeleton from "./BookGridSkeleton";

const HomePageSkeleton = (): ReactElement => {
  return (
    <main aria-hidden="true" aria-label="Loading homepage">
      <section className="px-4 py-8 md:py-14">
        <div className="container mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-4xl border border-[#EADBCE] bg-linear-to-br from-[#F7EFE7] via-[#FAF6F0] to-[#ECE0D3] px-6 py-14 text-center shadow-xs ring-1 ring-[#EADBCE]/50 md:px-16 md:py-20 animate-pulse">
            <div className="relative mx-auto max-w-3xl space-y-6">
              <div className="mx-auto h-7 w-64 rounded-full border border-[#E8D5C4] bg-white/90 shadow-xs" />

              <div className="mx-auto space-y-3">
                <div className="mx-auto h-10 w-4/5 rounded-2xl bg-[#E8D8C8] md:h-14" />
                <div className="mx-auto h-10 w-3/5 rounded-2xl bg-[#E8D8C8]/80 md:h-14" />
              </div>

              <div className="mx-auto max-w-2xl space-y-2 pt-2">
                <div className="mx-auto h-4 w-full rounded bg-[#E8D8C8]/60" />
                <div className="mx-auto h-4 w-5/6 rounded bg-[#E8D8C8]/60" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <div className="h-13 w-48 rounded-xl bg-[#8B5A2B]/30" />
                <div className="h-13 w-44 rounded-xl border border-[#DCC8B6] bg-white/90 shadow-xs" />
              </div>

              <div className="pt-6">
                <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-[#EADBCE]/80 bg-white/70 px-8 py-4 shadow-xs sm:gap-12">
                  <div className="h-10 w-20 rounded-lg bg-[#F5ECE3]" />
                  <div className="h-8 w-px bg-[#EADBCE]" />
                  <div className="h-10 w-24 rounded-lg bg-[#F5ECE3]" />
                  <div className="h-8 w-px bg-[#EADBCE]" />
                  <div className="h-10 w-20 rounded-lg bg-[#F5ECE3]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end animate-pulse">
            <div>
              <div className="mb-3 h-6 w-44 rounded-full bg-[#F5ECE3] ring-1 ring-[#E8D5C4]" />
              <div className="h-8 w-72 rounded-xl bg-[#E8D8C8] md:h-10" />
              <div className="mt-3 h-4 w-96 max-w-full rounded bg-[#F5ECE3]" />
            </div>
            <div className="h-5 w-28 rounded bg-[#F5ECE3] md:self-end" />
          </div>

          <BookGridSkeleton
            count={9}
            className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3"
          />

          <div className="mt-12 flex justify-center animate-pulse">
            <div className="h-12 w-64 rounded-xl bg-[#8B5A2B]/25 shadow-xs" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePageSkeleton;
