"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, BookText, ShoppingBag, Check } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import type { Book } from "@/types/book.type";

interface BookCardProps {
  book: Book;
  index: number;
}

const BookCard = ({ book, index }: BookCardProps): ReactElement => {
  const isAboveFold = index < 4;
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { getStatus, setStatus } = useReadingStatus();

  const wishlisted = isWishlisted(book.bookId);
  const status = getStatus(book.bookId);
  const isReading = status === "reading";

  const handleRead = (): void => {
    setStatus(book.bookId, isReading ? null : "reading");
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#EADBCE] bg-white shadow-xs transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#D4A373] hover:shadow-xl">
      <Link
        href={`/books/${book.bookId}`}
        className="relative flex h-36 items-center justify-center overflow-hidden bg-linear-to-br from-[#FAF6F0] via-[#F5ECE3] to-[#EFE4D6] p-2 transition-colors duration-300 sm:h-52 sm:p-4"
        aria-label={`View details of ${book.bookName}`}
      >
        <Image
          src={book.image}
          alt={book.bookName}
          width={220}
          height={300}
          quality={85}
          loading={isAboveFold ? "eager" : "lazy"}
          fetchPriority={isAboveFold ? "high" : "low"}
          sizes="(max-width: 640px) 45vw, (max-width: 768px) 44vw, (max-width: 1024px) 30vw, 240px"
          className="h-full w-auto max-w-full rounded-lg object-contain drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-[#5B3315] shadow-xs ring-1 ring-[#E8D5C4] backdrop-blur-md sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
          {book.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-4">
        <div>
          <h3 className="line-clamp-1 text-[11px] font-bold tracking-tight text-[#241812] transition-colors duration-200 group-hover:text-[#8B5A2B] sm:text-sm">
            <Link
              href={`/books/${book.bookId}`}
              className="focus:outline-hidden"
            >
              {book.bookName}
            </Link>
          </h3>

          <p className="mt-0.5 truncate text-[10px] font-semibold text-[#7A4B22] sm:text-xs">
            <span className="text-[#6F5B50]">By</span> {book.author}
          </p>

          <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[#35231A] sm:text-xs sm:leading-5">
            {book.review}
          </p>
        </div>

        <div className="mt-2 border-t border-[#F0E4D8] pt-1.5 sm:pt-2.5">
          <div className="flex items-center justify-between">
            <span className="truncate text-[9px] font-bold uppercase tracking-wide text-[#6F5B50] sm:text-xs">
              {book.category}
            </span>
            <div className="flex shrink-0 items-center gap-0.5 font-extrabold text-[#241812] sm:gap-1">
              <span className="text-[10px] text-[#D48B1B] sm:text-sm">★</span>
              <span className="text-[10px] sm:text-sm">{book.rating}</span>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5 sm:mt-2.5 sm:gap-2">
            <button
              type="button"
              onClick={handleRead}
              className={`flex h-8 items-center justify-center gap-1 rounded-xl border text-[10px] font-bold shadow-xs transition-colors duration-150 active:scale-[0.98] sm:h-9 sm:gap-1.5 sm:text-xs ${
                isReading
                  ? "border-[#C17937] bg-[#C17937] text-white shadow-[#C17937]/30"
                  : "border-[#DCC8B6] bg-[#F5ECE3] text-[#5B3315] hover:border-[#8B5A2B] hover:bg-[#EADBCE] hover:text-[#3D2310]"
              }`}
            >
              {isReading ? (
                <Check className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              ) : (
                <BookOpen className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              )}
              <span className="whitespace-nowrap">
                {isReading ? "Reading" : "Read"}
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(book.bookId);
              }}
              className={`flex h-8 items-center justify-center gap-1 rounded-xl border text-[10px] font-bold shadow-xs transition-colors duration-150 active:scale-[0.98] sm:h-9 sm:gap-1.5 sm:text-xs ${
                wishlisted
                  ? "border-[#8B5A2B] bg-[#8B5A2B] text-white shadow-[#8B5A2B]/30"
                  : "border-[#DCC8B6] bg-white text-[#4A2E18] hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
              }`}
            >
              {wishlisted ? (
                <Check className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              ) : (
                <ShoppingBag className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              )}
              <span className="whitespace-nowrap">
                {wishlisted ? "Saved" : "Wishlist"}
              </span>
            </button>

            <Link
              href={`/books/${book.bookId}`}
              className="col-span-2 flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#8B5A2B] bg-[#8B5A2B] text-[11px] font-bold text-white shadow-xs shadow-[#8B5A2B]/20 transition-colors duration-150 hover:border-[#6F4420] hover:bg-[#6F4420] hover:shadow-md active:scale-[0.98] sm:h-9 sm:text-sm"
            >
              <BookText className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">Book Details</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
