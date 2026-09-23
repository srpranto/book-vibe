"use client";

import type { ReactElement } from "react";
import type { Book } from "@/types/book.type";
import { AestheticBookCover } from "@/components/ui/AestheticBookCover";

interface BookCoverShowcaseProps {
  book: Book;
  estimatedHours: number;
}

const BookCoverShowcase = ({
  book,
  estimatedHours,
}: BookCoverShowcaseProps): ReactElement => {
  return (
    <div className="relative flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#FAF6F0] via-muted to-[#EFE4D6] p-4 shadow-inner ring-1 ring-border/60 sm:p-8">
      <div className="relative flex h-full max-h-120 w-full items-center justify-center">
        <AestheticBookCover
          title={book.bookName}
          author={book.author}
          coverUrl={book.image}
          category={book.category}
          size="large"
          priority
        />
      </div>

      <div className="absolute right-3 top-3 sm:right-4 sm:top-4 flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-foreground shadow-md backdrop-blur-md">
        <span className="text-[#D48B1B]">★</span> {book.rating}
        <span className="text-[10px] sm:text-xs font-semibold text-[#4A2E18]">
          / 5.0
        </span>
      </div>

      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-1 rounded-full border border-white/80 bg-white/95 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-[#3D2310] shadow-md backdrop-blur-md">
        <span>⏱</span> ~{estimatedHours}h read
      </div>
    </div>
  );
};

export default BookCoverShowcase;
