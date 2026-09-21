import type { Metadata } from "next";
import type { ReactElement } from "react";
import AllBooksView from "@/components/books/AllBooksView";
import { getAllBooks } from "@/lib/books";

export const metadata: Metadata = {
  title: "All Books | Book Vibe Library",
  description:
    "Explore our complete curated catalog of existential and philosophical classics, timeless essays, and literary masterpieces.",
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
