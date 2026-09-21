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

  // Show only 9 best selling books on the homepage
  const bestSellingBooks = books.slice(0, 9);

  return (
    <section id="books" className="px-4 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F5ECE3] px-4 py-1.5 text-xs font-semibold text-[#7A4B22] ring-1 ring-[#E8D5C4] md:text-sm">
              <span>☕</span> Best Selling Books
            </span>

            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-[#241812] md:text-4xl">
              Our Top <span className="text-[#8B5A2B]">Best Selling</span>{" "}
              Collection
            </h2>

            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#3E2D22] md:text-base">
              Discover 9 of our most loved, highest-rated literary masterpieces.
              Pour a fresh brew and explore the books that captivate our
              readers.
            </p>
          </div>

          <Link
            href="/allbooks"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B5A2B] transition hover:text-[#6F4420] md:self-end"
          >
            View All ({books.length}) →
          </Link>
        </div>

        {/* Books Grid - 9 best sellers */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bestSellingBooks.map((book, index) => (
            <BookCard key={book.bookId} book={book} index={index} />
          ))}
        </div>

        {/* View All Action */}
        <div className="mt-12 text-center">
          <Link
            href="/allbooks"
            className="inline-flex items-center justify-center rounded-xl bg-[#8B5A2B] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-[#8B5A2B]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#6F4420] hover:shadow-lg"
          >
            Explore All {books.length} Books in Library →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Books;
