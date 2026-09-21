import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "@/components/ui/BookCard";
import { getBookById, getAllBooks, getRelatedBooks } from "@/lib/books";
import { getBookQuote } from "@/lib/bookQuotes";
import BookCoverShowcase from "@/components/books/BookCoverShowcase";
import BookMetaGrid from "@/components/books/BookMetaGrid";
import BookTagsSection from "@/components/books/BookTagsSection";
import BookQuote from "@/components/books/BookQuote";
import {
  ShareBookButton,
  ReadWishlistButtons,
} from "@/components/books/BookActions";
import ReadingStatusTracker from "@/components/books/ReadingStatusTracker";
import BookMarginalia from "@/components/books/BookMarginalia";
import LiteraryKinshipSection from "@/components/books/LiteraryKinshipSection";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return getAllBooks().map((book) => ({
    id: String(book.bookId),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = getBookById(id);
  if (!book) {
    return { title: "Book Not Found | Book Vibe" };
  }
  return {
    title: `${book.bookName} - ${book.author} | Book Vibe`,
    description: book.review,
    openGraph: {
      title: `${book.bookName} | Book Vibe`,
      description: book.review,
      images: [{ url: book.image, alt: book.bookName }],
    },
  };
}

const BookDetailsPage = async ({ params }: Props): Promise<ReactElement> => {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) notFound();

  const relatedBooks = getRelatedBooks(book, 3);
  const estimatedHours = Math.max(1, Math.round((book.totalPages * 1.5) / 60));
  const quote = getBookQuote(book.bookId);

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/allbooks"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#DCC8B6] bg-white px-4 py-2 text-sm font-semibold text-[#4A2E18] shadow-xs transition-all duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B] active:scale-[0.98]"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back to Library
          </Link>

          <nav className="flex items-center gap-2 text-xs font-medium text-[#4A3528] md:text-sm">
            <Link href="/" className="hover:text-[#8B5A2B]">
              Home
            </Link>
            <span>/</span>
            <Link href="/allbooks" className="hover:text-[#8B5A2B]">
              All Books
            </Link>
            <span>/</span>
            <span className="max-w-48 truncate font-bold text-[#241812] md:max-w-xs">
              {book.bookName}
            </span>
          </nav>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#EADBCE] bg-white shadow-xs">
          <div className="grid grid-cols-1 items-start gap-10 p-6 md:p-10 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col items-center lg:col-span-5">
              <BookCoverShowcase book={book} estimatedHours={estimatedHours} />

              <BookQuote quote={quote.text} attribution={quote.attribution} />

              <ReadingStatusTracker
                bookId={book.bookId}
                bookName={book.bookName}
              />

              <ShareBookButton />
            </div>

            <div className="flex flex-col lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#8B5A2B] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                  {book.category}
                </span>
                <span className="rounded-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-1 text-xs font-bold text-[#4A3528]">
                  Published {book.yearOfPublishing}
                </span>
                <span className="rounded-full border border-[#EADBCE] bg-[#FAF7F2] px-3 py-1 text-xs font-bold text-[#4A3528]">
                  Catalog #{book.bookId}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#241812] sm:text-4xl lg:text-5xl">
                {book.bookName}
              </h1>

              <p className="mt-2 text-base font-semibold text-[#4A3528] md:text-lg">
                By :{" "}
                <span className="font-extrabold text-[#241812] underline decoration-[#D4A373]/60 underline-offset-4">
                  {book.author}
                </span>
              </p>

              <div className="my-5 border-t border-[#F0E4D8]" />

              <BookMetaGrid book={book} />

              <div className="mt-6">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#5B3315]">
                  Review & Literary Synopsis
                </h2>
                <div className="mt-2 rounded-2xl border border-[#EADBCE]/80 bg-[#FAF7F2]/80 p-4 text-sm leading-relaxed text-[#2D1D15] md:text-base">
                  <p>
                    <strong className="font-extrabold text-[#241812]">
                      Review :{" "}
                    </strong>
                    {book.review}
                  </p>
                </div>
              </div>

              <BookTagsSection tags={book.tags} />

              <div className="my-6 border-t border-[#F0E4D8]" />

              <ReadWishlistButtons book={book} />
            </div>
          </div>
        </div>

        <BookMarginalia bookId={book.bookId} bookName={book.bookName} />

        <LiteraryKinshipSection
          bookId={book.bookId}
          bookName={book.bookName}
        />

        {relatedBooks.length > 0 && (
          <section className="mt-16 border-t border-[#EADBCE] pt-12">
            <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
              <div>
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F5ECE3] px-4 py-1.5 text-xs font-semibold text-[#7A4B22] ring-1 ring-[#E8D5C4] md:text-sm">
                  <span>☕</span> More from the Library
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#241812] md:text-4xl">
                  You Might Also <span className="text-[#8B5A2B]">Enjoy</span>
                </h2>
                <p className="mt-2.5 max-w-xl text-sm font-medium leading-6 text-[#3E2D22] md:text-base">
                  Hand-picked selections tailored to your reading taste. Pull up
                  a chair, brew another cup, and continue your literary journey.
                </p>
              </div>

              <Link
                href="/allbooks"
                className="group inline-flex items-center gap-2 rounded-xl border border-[#DCC8B6] bg-white px-5 py-2.5 text-sm font-semibold text-[#4A2E18] shadow-xs transition duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B] md:self-end"
              >
                <span>Browse All {getAllBooks().length} Books</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
              {relatedBooks.map((relBook, index) => (
                <BookCard key={relBook.bookId} book={relBook} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default BookDetailsPage;
