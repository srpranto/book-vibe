"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BookCard from "@/components/shared/BookCard";
import type { Book } from "@/types/book.type";

const BookDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [readMarked, setReadMarked] = useState<boolean>(false);
  const [wishlistMarked, setWishlistMarked] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/booksData.json")
      .then((res) => res.json())
      .then((data: Book[]) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const book = useMemo(() => {
    if (!id || books.length === 0) return null;
    return books.find((b) => String(b.bookId) === String(id)) || null;
  }, [books, id]);

  // Find up to 3 related books by same category or author
  const relatedBooks = useMemo(() => {
    if (!book) return [];
    const sameCat = books.filter(
      (b) => b.bookId !== book.bookId && b.category === book.category,
    );
    if (sameCat.length >= 3) return sameCat.slice(0, 3);

    // If fewer than 3 in same category, fill with others
    const others = books.filter(
      (b) => b.bookId !== book.bookId && b.category !== book.category,
    );
    return [...sameCat, ...others].slice(0, 3);
  }, [books, book]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReadClick = () => {
    setReadMarked((prev) => !prev);
    showToast(
      readMarked
        ? `Removed "${book?.bookName}" from Read list`
        : `Marked "${book?.bookName}" as Read!`,
    );
  };

  const handleWishlistClick = () => {
    setWishlistMarked((prev) => !prev);
    showToast(
      wishlistMarked
        ? `Removed "${book?.bookName}" from Wishlist`
        : `Added "${book?.bookName}" to your Wishlist!`,
    );
  };

  const handleShareClick = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Book link copied to clipboard!");
    }
  };

  // Approximate reading time (average 200 words/page, ~1.5 mins per page)
  const estimatedHours = book
    ? Math.max(1, Math.round((book.totalPages * 1.5) / 60))
    : 1;

  // Loading skeleton
  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-6xl animate-pulse">
          <div className="mb-6 h-7 w-48 rounded-lg bg-[#EFE6DC]" />
          <div className="grid grid-cols-1 gap-10 rounded-3xl border border-[#EADBCE] bg-white p-8 lg:grid-cols-12">
            <div className="h-120 rounded-2xl bg-[#EFE6DC] lg:col-span-5" />
            <div className="space-y-5 lg:col-span-7">
              <div className="h-10 w-3/4 rounded-xl bg-[#EFE6DC]" />
              <div className="h-6 w-1/3 rounded-lg bg-[#EFE6DC]" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="h-16 rounded-xl bg-[#EFE6DC]" />
                <div className="h-16 rounded-xl bg-[#EFE6DC]" />
                <div className="h-16 rounded-xl bg-[#EFE6DC]" />
                <div className="h-16 rounded-xl bg-[#EFE6DC]" />
              </div>
              <div className="h-32 w-full rounded-xl bg-[#EFE6DC]" />
              <div className="h-12 w-1/2 rounded-xl bg-[#EFE6DC]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Not found
  if (!book) {
    return (
      <main className="flex min-h-120 items-center justify-center px-4 py-12">
        <div className="max-w-md rounded-3xl border border-[#EADBCE] bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5ECE3] text-2xl text-[#8B5A2B]">
            ☕
          </div>
          <h2 className="text-2xl font-bold text-[#241812]">Book Not Found</h2>
          <p className="mt-2 text-sm font-medium text-[#4A3528]">
            We couldn&apos;t locate this book in our library. It may have been
            re-cataloged or does not exist.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-xl border border-[#DCC8B6] px-5 py-2.5 text-sm font-semibold text-[#4A2E18] transition hover:bg-[#F5ECE3]"
            >
              ← Go Back
            </button>
            <Link
              href="/allbooks"
              className="rounded-xl bg-[#8B5A2B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6F4420]"
            >
              Browse All Books
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce rounded-2xl bg-[#241812] px-5 py-3 text-sm font-semibold text-[#EFE4D8] shadow-2xl ring-1 ring-[#D4A373]/30">
          ☕ {toastMessage}
        </div>
      )}

      <div className="container mx-auto max-w-6xl">
        {/* Top Navigation & Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 rounded-xl border border-[#DCC8B6] bg-white px-4 py-2 text-sm font-semibold text-[#4A2E18] shadow-xs transition duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back to Library
          </button>

          {/* Breadcrumbs */}
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

        {/* Main Details Card */}
        <div className="overflow-hidden rounded-3xl border border-[#EADBCE] bg-white shadow-xs">
          <div className="grid grid-cols-1 items-start gap-10 p-6 md:p-10 lg:grid-cols-12 lg:gap-14">
            {/* LEFT COLUMN: Book Cover Showcase & Quick Stats */}
            <div className="flex flex-col items-center lg:col-span-5">
              {/* Cover Canvas with warm latte gradient */}
              <div className="relative flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#FAF6F0] via-[#F5ECE3] to-[#EFE4D6] p-8 shadow-inner ring-1 ring-[#EADBCE]/60">
                <div className="relative h-full max-h-120 w-full">
                  <Image
                    src={book.image}
                    alt={book.bookName}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 380px"
                    className="rounded-xl object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
                  />
                </div>

                {/* Floating Rating Pill */}
                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-xs font-bold text-[#241812] shadow-md backdrop-blur-md">
                  <span className="text-[#D48B1B]">★</span> {book.rating}
                  <span className="text-xs font-semibold text-[#4A3528]">
                    / 5.0
                  </span>
                </div>

                {/* Floating Reading Time Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-xs font-bold text-[#3D2310] shadow-md backdrop-blur-md">
                  <span>⏱</span> ~{estimatedHours}h read
                </div>
              </div>

              {/* Coffee Pairing Recommendation */}
              <div className="mt-5 w-full rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-[#5B3315]">
                  ☕ Reader&apos;s Coffee Pairing
                </p>
                <p className="mt-1 text-xs italic leading-relaxed text-[#35231A]">
                  Best enjoyed with a warm dark roast pour-over or a creamy
                  cortado in a quiet reading nook.
                </p>
              </div>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShareClick}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCC8B6] bg-white py-2.5 text-xs font-semibold text-[#4A2E18] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
              >
                <span>🔗</span> Share this Book
              </button>
            </div>

            {/* RIGHT COLUMN: Rich Book Details & Metadata */}
            <div className="flex flex-col lg:col-span-7">
              {/* Category & Badge Bar */}
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

              {/* Book Name */}
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#241812] sm:text-4xl lg:text-5xl">
                {book.bookName}
              </h1>

              {/* Author */}
              <p className="mt-2 text-base font-semibold text-[#4A3528] md:text-lg">
                By :{" "}
                <span className="font-extrabold text-[#241812] underline decoration-[#D4A373]/60 underline-offset-4">
                  {book.author}
                </span>
              </p>

              {/* Divider */}
              <div className="my-5 border-t border-[#F0E4D8]" />

              {/* 4-Item Visual Specs Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {/* Pages */}
                <div className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-3 text-center">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
                    Pages
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[#241812]">
                    {book.totalPages}
                  </p>
                  <p className="text-xs font-medium text-[#4A3528]">
                    Full Text
                  </p>
                </div>

                {/* Rating */}
                <div className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-3 text-center">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
                    Rating
                  </p>
                  <p className="mt-1 flex items-center justify-center gap-1 text-lg font-extrabold text-[#241812]">
                    {book.rating}
                    <span className="text-sm text-[#D48B1B]">★</span>
                  </p>
                  <p className="text-xs font-medium text-[#4A3528]">
                    Out of 5.0
                  </p>
                </div>

                {/* Published */}
                <div className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-3 text-center">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
                    Year
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[#241812]">
                    {book.yearOfPublishing}
                  </p>
                  <p className="text-xs font-medium text-[#4A3528]">
                    First Edition
                  </p>
                </div>

                {/* Publisher */}
                <div className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-3 text-center">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
                    Publisher
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm font-bold text-[#241812]">
                    {book.publisher}
                  </p>
                  <p className="text-xs font-medium text-[#4A3528]">
                    Original House
                  </p>
                </div>
              </div>

              {/* Review & Literary Synopsis */}
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

              {/* Tags Section */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
                  Tag :
                </span>
                {book.tags &&
                  book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F5ECE3] px-3.5 py-1 text-xs font-bold text-[#5B3315] ring-1 ring-[#E8D5C4] transition hover:bg-[#E8D5C4]"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-[#F0E4D8]" />

              {/* Detailed Specs Key-Value Table */}
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between border-b border-[#F0E4D8]/60 pb-2">
                  <span className="font-semibold text-[#4A3528]">
                    Number of Pages:
                  </span>
                  <span className="font-extrabold text-[#241812]">
                    {book.totalPages}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#F0E4D8]/60 pb-2">
                  <span className="font-semibold text-[#4A3528]">
                    Publisher:
                  </span>
                  <span className="font-extrabold text-[#241812]">
                    {book.publisher}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#F0E4D8]/60 pb-2">
                  <span className="font-semibold text-[#4A3528]">
                    Year of Publishing:
                  </span>
                  <span className="font-extrabold text-[#241812]">
                    {book.yearOfPublishing}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#F0E4D8]/60 pb-2">
                  <span className="font-semibold text-[#4A3528]">Rating:</span>
                  <span className="flex items-center gap-1.5 font-extrabold text-[#241812]">
                    {book.rating}
                    <span className="text-[#D48B1B]">★</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Read & Wishlist */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleReadClick}
                  className={`flex-1 rounded-xl px-7 py-3.5 text-center text-sm font-bold transition duration-200 sm:flex-initial ${
                    readMarked
                      ? "bg-[#8B5A2B] text-white shadow-md shadow-[#8B5A2B]/20 hover:bg-[#6F4420]"
                      : "border-2 border-[#DCC8B6] bg-white text-[#4A2E18] hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                  }`}
                >
                  {readMarked ? "✓ Marked as Read" : "Read"}
                </button>

                <button
                  type="button"
                  onClick={handleWishlistClick}
                  className={`flex-1 rounded-xl px-7 py-3.5 text-center text-sm font-bold shadow-md transition duration-200 sm:flex-initial ${
                    wishlistMarked
                      ? "bg-[#583518] text-white shadow-[#583518]/20 hover:bg-[#3E2310]"
                      : "bg-[#C17937] text-white shadow-[#C17937]/20 hover:bg-[#A96327]"
                  }`}
                >
                  {wishlistMarked ? "★ In Your Wishlist" : "Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books Section */}
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
                <span>Browse All 42 Books</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
