import type { ReactElement } from "react";
import BookGridSkeleton from "./BookGridSkeleton";

const AllBooksSkeleton = (): ReactElement => {
  return (
    <main
      aria-hidden="true"
      aria-label="Loading library catalog"
      className="min-h-screen px-4 py-10 md:py-16"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 text-center md:text-left animate-pulse">
          <div className="mx-auto mb-3 h-6 w-44 rounded-full bg-[#F5ECE3] ring-1 ring-[#E8D5C4] md:mx-0" />
          <div className="mx-auto h-10 w-56 rounded-xl bg-[#E8D8C8] md:mx-0 md:h-12 md:w-64" />
          <div className="mx-auto mt-3 h-4 w-full max-w-lg rounded bg-[#F5ECE3] md:mx-0" />
          <div className="mx-auto mt-2 h-4 w-3/4 max-w-md rounded bg-[#F5ECE3] md:mx-0" />
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-pulse">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="h-10 w-24 rounded-xl bg-[#8B5A2B]/25" />
            <div className="h-10 w-36 rounded-xl border border-[#DCC8B6] bg-white shadow-xs" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="h-10 w-full rounded-xl border border-[#DCC8B6] bg-white shadow-xs sm:w-72" />
            <div className="h-10 w-full rounded-xl border border-[#DCC8B6] bg-white shadow-xs sm:w-48" />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between animate-pulse">
          <div className="h-4 w-44 rounded bg-[#F5ECE3]" />
        </div>

        <BookGridSkeleton
          count={12}
          className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
        />
      </div>
    </main>
  );
};

export default AllBooksSkeleton;
