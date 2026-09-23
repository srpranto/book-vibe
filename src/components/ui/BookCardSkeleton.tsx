import type { ReactElement } from "react";

const BookCardSkeleton = (): ReactElement => {
  return (
    <article
      aria-hidden="true"
      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white shadow-xs animate-pulse"
    >
      <div>
        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br from-[#FAF6F0] via-muted to-[#EFE4D6] p-3 sm:h-52 sm:p-4">
          <div className="h-28 w-20 rounded-lg bg-[#E8D8C8]/80 shadow-inner sm:h-40 sm:w-28" />
          <div className="absolute left-2.5 top-2.5 h-4 w-14 rounded-full bg-white/90 ring-1 ring-[#E8D5C4]/60 sm:left-3 sm:top-3 sm:h-5 sm:w-18" />
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#E8D8C8]" />
              <div className="h-3 w-6 rounded bg-muted" />
            </div>
          </div>

          <div className="mt-2 h-4 w-3/4 rounded-md bg-[#E8D8C8]" />
          <div className="mt-1.5 h-3 w-1/2 rounded bg-muted" />

          <div className="mt-2 space-y-1">
            <div className="h-2.5 w-full rounded bg-muted/70" />
            <div className="h-2.5 w-4/5 rounded bg-muted/70" />
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle p-3 bg-background/50 flex items-center gap-2">
        <div className="h-8 flex-1 rounded-xl bg-primary/20" />
        <div className="h-8 w-18 shrink-0 rounded-xl border border-[#DCC8B6] bg-white" />
      </div>
    </article>
  );
};

export default BookCardSkeleton;
