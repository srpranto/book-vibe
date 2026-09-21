"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookCard from "@/components/shared/BookCard";
import type { Book } from "@/types/book.type";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("/booksData.json")
      .then((res) => res.json())
      .then((data: Book[]) => setBooks(data));
  }, []);

  // Show a curated selection of 6 featured books on homepage
  const featuredBooks = books.slice(0, 6);

  return (
    <section id="books" className="px-4 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-8 md:mb-10">
          <div>
            <span className="mb-3 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100">
              Explore Collection
            </span>

            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              Discover Your Next{" "}
              <span className="text-emerald-600">Favorite Book</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 md:text-base">
              Explore our carefully selected collection and discover your next
              great read.
            </p>
          </div>

          <Link
            href="/listed-books"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 md:self-end"
          >
            View All ({books.length}) →
          </Link>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBooks.map((book, index) => (
            <BookCard key={book.bookId} book={book} index={index} />
          ))}
        </div>

        {/* View All Action */}
        <div className="mt-12 text-center">
          <Link
            href="/listed-books"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
          >
            Explore All {books.length} Listed Books →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Books;
