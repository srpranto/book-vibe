import type { ReactElement } from "react";
import BookCardSkeleton from "./BookCardSkeleton";

const BookDetailsSkeleton = (): ReactElement => {
  return (
    <main
      aria-hidden="true"
      aria-label="Loading book details"
      className="min-h-screen px-4 py-8 md:py-12"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 animate-pulse">
          <div className="h-9 w-36 rounded-xl border border-[#DCC8B6] bg-white shadow-xs" />

          <div className="flex items-center gap-2">
            <div className="h-4 w-12 rounded bg-[#F5ECE3]" />
            <span className="text-[#E8D8C8]">/</span>
            <div className="h-4 w-16 rounded bg-[#F5ECE3]" />
            <span className="text-[#E8D8C8]">/</span>
            <div className="h-4 w-28 rounded bg-[#E8D8C8]" />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#EADBCE] bg-white shadow-xs">
          <div className="grid grid-cols-1 items-start gap-10 p-6 md:p-10 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col items-center lg:col-span-5">
              <div className="relative flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#FAF6F0] via-[#F5ECE3] to-[#EFE4D6] p-8 shadow-inner ring-1 ring-[#EADBCE]/60 animate-pulse">
                <div className="h-64 w-44 rounded-xl bg-[#E8D8C8]/80 shadow-md sm:h-80 sm:w-56" />

                <div className="absolute right-4 top-4 h-7 w-20 rounded-full border border-white/80 bg-white/95 shadow-md" />

                <div className="absolute bottom-4 left-4 h-7 w-24 rounded-full border border-white/80 bg-white/95 shadow-md" />
              </div>

              <div className="mt-5 w-full rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-4 animate-pulse">
                <div className="h-3 w-28 rounded bg-[#E8D8C8]" />
                <div className="mx-auto mt-2 h-3 w-5/6 rounded bg-[#F5ECE3]" />
                <div className="mx-auto mt-1.5 h-3 w-2/3 rounded bg-[#F5ECE3]" />
                <div className="mt-2 h-2.5 w-24 rounded bg-[#E8D8C8]/60" />
              </div>

              <div className="mt-5 w-full rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-4 animate-pulse">
                <div className="h-3 w-28 rounded bg-[#E8D8C8]" />
                <div className="mt-2 h-10 w-full rounded-xl border border-[#DCC8B6] bg-white" />
              </div>

              <div className="mt-4 h-10 w-full rounded-xl border border-[#DCC8B6] bg-white shadow-xs animate-pulse" />
            </div>

            <div className="flex flex-col lg:col-span-7 animate-pulse">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-6 w-20 rounded-full bg-[#8B5A2B]/20" />
                <div className="h-6 w-28 rounded-full border border-[#EADBCE] bg-[#FAF7F2]" />
                <div className="h-6 w-24 rounded-full border border-[#EADBCE] bg-[#FAF7F2]" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-8 w-4/5 rounded-xl bg-[#E8D8C8] md:h-10" />
                <div className="h-6 w-1/2 rounded-lg bg-[#E8D8C8]/70 md:h-8" />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="h-4 w-10 rounded bg-[#F5ECE3]" />
                <div className="h-5 w-36 rounded-md bg-[#E8D8C8]" />
              </div>

              <div className="my-5 border-t border-[#F0E4D8]" />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-3 text-center"
                  >
                    <div className="mx-auto h-3 w-12 rounded bg-[#E8D8C8]" />
                    <div className="mx-auto mt-2 h-6 w-16 rounded bg-[#E8D8C8]" />
                    <div className="mx-auto mt-1 h-3 w-14 rounded bg-[#F5ECE3]" />
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="h-3.5 w-44 rounded bg-[#E8D8C8]" />
                <div className="mt-2 rounded-2xl border border-[#EADBCE]/80 bg-[#FAF7F2]/80 p-4 space-y-2">
                  <div className="h-3.5 w-full rounded bg-[#F5ECE3]" />
                  <div className="h-3.5 w-11/12 rounded bg-[#F5ECE3]" />
                  <div className="h-3.5 w-4/5 rounded bg-[#F5ECE3]" />
                  <div className="h-3.5 w-2/3 rounded bg-[#F5ECE3]" />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <div className="h-3.5 w-10 rounded bg-[#E8D8C8]" />
                <div className="h-6 w-20 rounded-full bg-[#F5ECE3] ring-1 ring-[#E8D5C4]" />
                <div className="h-6 w-24 rounded-full bg-[#F5ECE3] ring-1 ring-[#E8D5C4]" />
                <div className="h-6 w-16 rounded-full bg-[#F5ECE3] ring-1 ring-[#E8D5C4]" />
              </div>

              <div className="my-6 border-t border-[#F0E4D8]" />

              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-[#F0E4D8]/60 pb-2"
                  >
                    <div className="h-3.5 w-28 rounded bg-[#F5ECE3]" />
                    <div className="h-3.5 w-24 rounded bg-[#E8D8C8]" />
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <div className="h-11 w-full rounded-xl bg-[#8B5A2B]/25 sm:w-36" />
                <div className="h-11 w-full rounded-xl border border-[#DCC8B6] bg-white sm:w-40" />
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 border-t border-[#EADBCE] pt-12 animate-pulse">
          <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
            <div>
              <div className="mb-3 h-6 w-44 rounded-full bg-[#F5ECE3] ring-1 ring-[#E8D5C4]" />
              <div className="h-8 w-64 rounded-xl bg-[#E8D8C8] md:h-10" />
              <div className="mt-2.5 h-4 w-80 max-w-full rounded bg-[#F5ECE3]" />
            </div>
            <div className="h-10 w-44 rounded-xl border border-[#DCC8B6] bg-white shadow-xs" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default BookDetailsSkeleton;
