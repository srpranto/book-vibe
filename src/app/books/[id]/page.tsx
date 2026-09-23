import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getAllBooks, getBookById } from "@/lib/books";
import { getOpenLibraryBookByWorkId } from "@/lib/openLibrary";
import BookCoverShowcase from "@/components/books/BookCoverShowcase";
import BookMetaGrid from "@/components/books/BookMetaGrid";
import BookTagsSection from "@/components/books/BookTagsSection";
import {
  ShareBookButton,
  BookTrackAction,
} from "@/components/books/BookActions";
import LiteraryKinshipSection from "@/components/books/LiteraryKinshipSection";
import type { Book } from "@/types/book.type";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const books = getAllBooks();
  const set = new Set<string>();
  for (const book of books) {
    set.add(String(book.bookId));
    if (book.workId) set.add(book.workId);
  }
  return Array.from(set).map((id) => ({ id }));
}

async function resolveBook(id: string): Promise<Book | undefined> {
  const staticBook = getBookById(id);
  if (staticBook) return staticBook;
  return await getOpenLibraryBookByWorkId(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await resolveBook(id);
  if (!book) {
    return { title: "Book Not Found | Book Vibe" };
  }
  return {
    title: `${book.bookName} - ${book.author} | Book Vibe`,
    description: book.review,
    openGraph: {
      title: `${book.bookName} | Book Vibe`,
      description: book.review,
      images: book.image ? [{ url: book.image, alt: book.bookName }] : [],
    },
  };
}

const BookDetailsPage = async ({ params }: Props): Promise<ReactElement> => {
  const { id } = await params;
  const book = await resolveBook(id);

  if (!book) notFound();

  const estimatedHours = Math.max(1, Math.round((book.totalPages * 1.5) / 60));

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/allbooks"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#DCC8B6] bg-white px-4 py-2 text-sm font-semibold text-[#4A2E18] shadow-xs transition-all duration-200 hover:border-primary hover:bg-muted hover:text-primary active:scale-[0.98]"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back to Library
          </Link>

          <nav className="flex items-center gap-2 text-xs font-medium text-[#4A3528] md:text-sm">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/allbooks" className="hover:text-primary">
              Library
            </Link>
            <span>/</span>
            <span className="max-w-30 sm:max-w-48 md:max-w-xs truncate font-bold text-foreground">
              {book.bookName}
            </span>
          </nav>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-xs">
          <div className="grid grid-cols-1 items-start gap-6 sm:gap-10 p-4 sm:p-6 md:p-10 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col items-center lg:col-span-5 w-full">
              <BookCoverShowcase book={book} estimatedHours={estimatedHours} />

              <ShareBookButton />
            </div>

            <div className="flex flex-col lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                  {book.category}
                </span>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-[#4A2E18]">
                  Published {book.yearOfPublishing}
                </span>
                {book.openLibraryKey ? (
                  <a
                    href={`https://openlibrary.org${book.openLibraryKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100 transition"
                  >
                    <span>Open Library Record</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-[#4A2E18]">
                    Catalog #{book.bookId}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-2xl min-[380px]:text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
                {book.bookName}
              </h1>

              <p className="mt-2 text-base font-semibold text-[#4A2E18] md:text-lg">
                By :{" "}
                <span className="font-extrabold text-foreground underline decoration-secondary/60 underline-offset-4">
                  {book.author}
                </span>
              </p>

              <div className="my-5 border-t border-border-subtle" />

              <BookMetaGrid book={book} />

              <div className="mt-6">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#5B3315]">
                  Review &amp; Literary Synopsis
                </h2>
                <div className="mt-2 rounded-2xl border border-border/80 bg-background/80 p-4 text-sm leading-relaxed text-[#2D1D15] md:text-base">
                  <p>
                    <strong className="font-extrabold text-foreground">
                      Synopsis :{" "}
                    </strong>
                    {book.review}
                  </p>
                </div>
              </div>

              <BookTagsSection tags={book.tags} />

              <div className="my-6 border-t border-border-subtle" />

              <BookTrackAction book={book} />
            </div>
          </div>
        </div>

        <LiteraryKinshipSection
          bookId={book.bookId}
          bookName={book.bookName}
          category={book.category}
        />
      </div>
    </main>
  );
};

export default BookDetailsPage;
