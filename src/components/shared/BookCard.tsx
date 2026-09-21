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
    <article className="group overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Book Image */}
      <div className="relative flex h-72 items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 to-emerald-50/40 p-6">
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
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-gray-200/60 backdrop-blur-md">
          {book.category}
        </span>
      </div>

      {/* Book Content */}
      <div className="p-5">
        {/* Title & Author */}
        <div>
          <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-emerald-600">
            {book.bookName}
          </h3>

          <p className="mt-1 text-sm font-medium text-gray-500">
            by {book.author}
          </p>
        </div>

        {/* Review */}
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">
          {book.review}
        </p>

        {/* Meta */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          {/* Genre */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Genre
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {book.category}
            </p>
          </div>

          {/* Rating */}
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Rating
            </p>

            <div className="mt-1 flex items-center justify-end gap-1.5">
              <span className="text-sm text-yellow-500">★</span>

              <span className="text-sm font-bold text-gray-900">
                {book.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <Link
          href={`/books/${book.bookId}`}
          className="mt-5 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
};

export default BookCard;
