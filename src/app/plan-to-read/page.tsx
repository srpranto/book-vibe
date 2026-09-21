import type { ReactElement } from "react";
import { getAllBooks } from "@/lib/books";
import PlanToReadView from "@/components/books/PlanToReadView";

const PlanToReadPage = (): ReactElement => {
  const books = getAllBooks();
  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <PlanToReadView allBooks={books} />
    </main>
  );
};

export default PlanToReadPage;
