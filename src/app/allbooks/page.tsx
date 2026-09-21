import type { Metadata } from "next";
import type { ReactElement } from "react";
import AllBooksView from "@/components/books/AllBooksView";
import { getAllBooks } from "@/lib/books";

export const metadata: Metadata = {
  title: "All Books | Book Vibe Library",
  description:
    "Some books are read once and forgotten. Some stay somewhere inside you for a little longer. Here are 100 books worth spending some quiet time with.",
};

const AllBooksPage = (): ReactElement => {
  const books = getAllBooks();

  return (
    <main className="min-h-screen px-4 py-10 md:py-16">
      <AllBooksView initialBooks={books} />
    </main>
  );
};

export default AllBooksPage;
