import type { ReactElement } from "react";
import type { Book } from "@/types/book.type";

interface BookMetaGridProps {
  book: Book;
}

const BookMetaGrid = ({ book }: BookMetaGridProps): ReactElement => {
  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-2xl border border-border bg-background p-2 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
            Pages
          </p>
          <p className="mt-1 text-base sm:text-lg font-extrabold text-foreground">
            {book.totalPages}
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-[#4A3528]">
            Total Pages
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-2 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
            Rating
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-base sm:text-lg font-extrabold text-foreground">
            {book.rating}
            <span className="text-sm text-[#D48B1B]">★</span>
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-[#4A3528]">
            Out of 5.0
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-2 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
            Year
          </p>
          <p className="mt-1 text-base sm:text-lg font-extrabold text-foreground">
            {book.yearOfPublishing}
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-[#4A3528]">
            First Edition
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5 text-sm">
        <div className="flex items-center justify-between border-b border-border-subtle/60 pb-2">
          <span className="font-semibold text-[#4A3528]">Number of Pages:</span>
          <span className="font-extrabold text-foreground">
            {book.totalPages}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border-subtle/60 pb-2">
          <span className="font-semibold text-[#4A3528]">
            Year of Publishing:
          </span>
          <span className="font-extrabold text-foreground">
            {book.yearOfPublishing}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border-subtle/60 pb-2">
          <span className="font-semibold text-[#4A3528]">Rating:</span>
          <span className="flex items-center gap-1.5 font-extrabold text-foreground">
            {book.rating}
            <span className="text-[#D48B1B]">★</span>
          </span>
        </div>
      </div>
    </>
  );
};

export default BookMetaGrid;
