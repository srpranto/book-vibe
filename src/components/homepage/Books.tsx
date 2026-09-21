import type { ReactElement } from "react";
import Link from "next/link";
import BookCard from "@/components/ui/BookCard";
import { getAllBooks } from "@/lib/books";

const Books = (): ReactElement => {
  const books = getAllBooks();
  const bestSellingBooks = books.slice(0, 9);

  return (
    <section id="books" className="px-4 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl">
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
              Discover our most loved, highest-rated literary masterpieces. Pour
              a fresh brew and explore the books that captivate our readers.
            </p>
          </div>

          <Link
            href="/allbooks"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B5A2B] transition hover:text-[#6F4420] md:self-end"
          >
            View All ({books.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 md:grid-cols-3">
          {bestSellingBooks.map((book, index) => (
            <div
              key={book.bookId}
              className={index === 8 ? "hidden sm:block" : ""}
            >
              <BookCard book={book} index={index} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/allbooks"
            className="inline-flex items-center justify-center rounded-xl bg-[#8B5A2B] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-[#8B5A2B]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6F4420] hover:shadow-lg active:scale-[0.98]"
          >
            Explore All {books.length} Books in Library →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Books;
