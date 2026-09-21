"use client";

import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book.type";

type BookCardProps = {
  book: Book;
  index: number;
};

const BookCard = ({ book, index }: BookCardProps) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#EADBCE] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-[#D4A373] hover:shadow-xl">
      {/* Book Image with Warm Parchment / Latte Gradient */}
      <Link
        href={`/books/${book.bookId}`}
        className="relative flex h-72 items-center justify-center overflow-hidden bg-linear-to-br from-[#FAF6F0] via-[#F5ECE3] to-[#EFE4D6] p-6"
      >
        <Image
          src={book.image}
          alt={book.bookName}
          width={220}
          height={280}
          quality={80}
          priority={index === 0}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-auto max-w-full rounded-xl object-contain drop-shadow-md transition duration-500 group-hover:scale-105"
        />

        {/* Category Badge */}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#5B3315] shadow-xs ring-1 ring-[#E8D5C4] backdrop-blur-md">
          {book.category}
        </span>
      </Link>

      {/* Book Content */}
      <div className="p-5">
        {/* Title & Author */}
        <div>
          <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-[#241812] transition-colors duration-200 group-hover:text-[#8B5A2B]">
            <Link href={`/books/${book.bookId}`}>{book.bookName}</Link>
          </h3>

          <div className="mt-2.5 flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5ECE3] px-3 py-1 text-xs font-semibold text-[#7A4B22] ring-1 ring-[#E8D5C4]">
              <span>✍</span> By :{" "}
              <span className="font-bold text-[#241812]">{book.author}</span>
            </span>
          </div>
        </div>

        {/* Review */}
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#35231A]">
          {book.review}
        </p>

        {/* Meta */}
        <div className="mt-5 flex items-center justify-between border-t border-[#F0E4D8] pt-4">
          {/* Genre */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#6F5B50]">
              Genre
            </p>

            <p className="mt-1 text-sm font-bold text-[#241812]">
              {book.category}
            </p>
          </div>

          {/* Rating */}
          <div className="text-right">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#6F5B50]">
              Rating
            </p>

            <div className="mt-1 flex items-center justify-end gap-1.5">
              <span className="text-sm text-[#D48B1B]">★</span>

              <span className="text-sm font-extrabold text-[#241812]">
                {book.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/books/${book.bookId}`}
          className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#8B5A2B] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#8B5A2B]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#6F4420] hover:shadow-lg"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
};

export default BookCard;
