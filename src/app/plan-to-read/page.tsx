import type { Metadata } from "next";
import { Suspense } from "react";
import type { ReactElement } from "react";
import { getAllBooks } from "@/lib/books";
import PlanToReadView from "@/components/books/PlanToReadView";
import AllBooksSkeleton from "@/components/ui/AllBooksSkeleton";

export const metadata: Metadata = {
  title: "My Shelf & Reading Goals | Book Vibe",
  description:
    "Keep track of books on your personal reading list, record current reading progress, and meet your annual reading challenge.",
};

const PlanToReadPage = (): ReactElement => {
  const books = getAllBooks();
  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <Suspense fallback={<AllBooksSkeleton />}>
        <PlanToReadView allBooks={books} />
      </Suspense>
    </main>
  );
};

export default PlanToReadPage;
