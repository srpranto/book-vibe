import type { ReactElement } from "react";

const BookCardSkeleton = (): ReactElement => {
  return (
    <article
      aria-hidden="true"
      className="flex flex-col overflow-hidden rounded-2xl border border-[#EADBCE] bg-white shadow-xs animate-pulse"
    >
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-linear-to-br from-[#FAF6F0] via-[#F5ECE3] to-[#EFE4D6] p-2 sm:h-52 sm:p-4">
        <div className="h-28 w-20 rounded-lg bg-[#E8D8C8]/80 shadow-inner sm:h-40 sm:w-28" />
        <div className="absolute left-2.5 top-2.5 h-4 w-14 rounded-full bg-white/90 ring-1 ring-[#E8D5C4]/60 sm:left-3 sm:top-3 sm:h-5 sm:w-18" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-4">
        <div>
          <div className="h-3.5 w-3/4 rounded-md bg-[#E8D8C8] sm:h-4" />
          <div className="mt-1.5 flex items-center">
            <div className="h-3 w-1/2 rounded-full bg-[#F5ECE3] ring-1 ring-[#E8D5C4]/50 sm:h-3.5 sm:w-3/5" />
          </div>
          <div className="mt-2 space-y-1 sm:mt-2.5 sm:space-y-1.5">
            <div className="h-2.5 w-full rounded bg-[#F5ECE3]" />
            <div className="h-2.5 w-4/5 rounded bg-[#F5ECE3]" />
          </div>
        </div>

        <div className="mt-2 border-t border-[#F0E4D8] pt-1.5 sm:pt-2.5">
          <div className="flex items-center justify-between">
            <div className="h-3 w-14 rounded bg-[#F5ECE3] sm:w-16" />
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#E8D8C8]" />
              <div className="h-3 w-6 rounded bg-[#F5ECE3]" />
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5 sm:mt-2.5 sm:gap-2">
            <div className="h-7 w-full rounded-xl bg-[#F5ECE3] sm:h-8" />
            <div className="h-7 w-full rounded-xl bg-[#F5ECE3] sm:h-8" />
            <div className="col-span-2 h-8 w-full rounded-xl bg-[#8B5A2B]/20 sm:h-9" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default BookCardSkeleton;
