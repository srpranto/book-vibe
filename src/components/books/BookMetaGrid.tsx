import type { ReactElement } from "react";
import type { Book } from "@/types/book.type";

interface BookMetaGridProps {
  book: Book;
}

const BookMetaGrid = ({ book }: BookMetaGridProps): ReactElement => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-3 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
            Pages
          </p>
          <p className="mt-1 text-lg font-extrabold text-[#241812]">
            {book.totalPages}
          </p>
          <p className="text-xs font-medium text-[#4A3528]">Full Text</p>
        </div>

        <div className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-3 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
            Rating
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-lg font-extrabold text-[#241812]">
            {book.rating}
            <span className="text-sm text-[#D48B1B]">★</span>
          </p>
          <p className="text-xs font-medium text-[#4A3528]">Out of 5.0</p>
        </div>

        <div className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-3 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
            Year
          </p>
          <p className="mt-1 text-lg font-extrabold text-[#241812]">
            {book.yearOfPublishing}
          </p>
          <p className="text-xs font-medium text-[#4A3528]">First Edition</p>
        </div>

        <div className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-3 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
            Publisher
          </p>
          <p className="mt-1 line-clamp-1 text-sm font-bold text-[#241812]">
            {book.publisher}
          </p>
          <p className="text-xs font-medium text-[#4A3528]">Original House</p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5 text-sm">
        <div className="flex items-center justify-between border-b border-[#F0E4D8]/60 pb-2">
          <span className="font-semibold text-[#4A3528]">Number of Pages:</span>
          <span className="font-extrabold text-[#241812]">
            {book.totalPages}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#F0E4D8]/60 pb-2">
          <span className="font-semibold text-[#4A3528]">Publisher:</span>
          <span className="font-extrabold text-[#241812]">
            {book.publisher}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#F0E4D8]/60 pb-2">
          <span className="font-semibold text-[#4A3528]">
            Year of Publishing:
          </span>
          <span className="font-extrabold text-[#241812]">
            {book.yearOfPublishing}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#F0E4D8]/60 pb-2">
          <span className="font-semibold text-[#4A3528]">Rating:</span>
          <span className="flex items-center gap-1.5 font-extrabold text-[#241812]">
            {book.rating}
            <span className="text-[#D48B1B]">★</span>
          </span>
        </div>
      </div>
    </>
  );
};

export default BookMetaGrid;
