"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/shared/BookCard";
import type { Book } from "@/types/book.type";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("/booksData.json")
      .then((res) => res.json())
      .then((data: Book[]) => setBooks(data));
  }, []);

  return (
    <section className="px-4 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-8 md:mb-10">
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

        {/* Books Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => (
            <BookCard key={book.bookId} book={book} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;
