"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Book } from "@/types/book.type";

const BookDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [readMarked, setReadMarked] = useState<boolean>(false);
  const [wishlistMarked, setWishlistMarked] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch("/booksData.json")
      .then((res) => res.json())
      .then((data: Book[]) => {
        const found = data.find((b) => String(b.bookId) === String(id));
        setBook(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

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

  // Loading skeleton
  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-6xl animate-pulse">
          <div className="mb-6 h-6 w-32 rounded-lg bg-[#EFE6DC]" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="h-96 rounded-3xl bg-[#EFE6DC] lg:col-span-5" />
            <div className="space-y-4 lg:col-span-7">
              <div className="h-10 w-3/4 rounded-xl bg-[#EFE6DC]" />
              <div className="h-6 w-1/3 rounded-lg bg-[#EFE6DC]" />
              <div className="h-8 w-24 rounded-full bg-[#EFE6DC]" />
              <div className="h-28 w-full rounded-xl bg-[#EFE6DC]" />
              <div className="h-32 w-2/3 rounded-xl bg-[#EFE6DC]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Not found
  if (!book) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="max-w-md rounded-3xl border border-[#EADBCE] bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5ECE3] text-2xl text-[#8B5A2B]">
            ☕
          </div>
          <h2 className="text-2xl font-bold text-[#241812]">Book Not Found</h2>
          <p className="mt-2 text-sm text-[#7A6A60]">
            We couldn&apos;t find the book you were looking for. It may have
            been moved or does not exist.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-xl border border-[#DCC8B6] px-5 py-2.5 text-sm font-semibold text-[#4A2E18] transition hover:bg-[#F5ECE3]"
            >
              ← Go Back
            </button>
            <Link
              href="/listed-books"
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
        {/* Navigation & Back Action (Next.js Client History) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 rounded-xl border border-[#DCC8B6] bg-white px-4 py-2 text-sm font-semibold text-[#4A2E18] shadow-xs transition duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#7A6A60] md:text-sm">
            <Link href="/" className="hover:text-[#8B5A2B]">
              Home
            </Link>
            <span>/</span>
            <Link href="/listed-books" className="hover:text-[#8B5A2B]">
              Listed Books
            </Link>
            <span>/</span>
            <span className="max-w-48 truncate font-bold text-[#241812] md:max-w-xs">
              {book.bookName}
            </span>
          </nav>
        </div>

        {/* Details Grid: Left Image, Right Content */}
        <div className="grid grid-cols-1 items-start gap-10 rounded-3xl border border-[#EADBCE] bg-white p-6 shadow-xs md:p-10 lg:grid-cols-12 lg:gap-14">
          {/* LEFT: Book Image with warm parchment & latte gradient */}
          <div className="relative flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#FAF6F0] via-[#F5ECE3] to-[#EFE4D6] p-8 shadow-inner lg:col-span-5">
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

            {/* Rating badge on image */}
            <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#241812] shadow-md ring-1 ring-[#E8D5C4] backdrop-blur-md">
              <span className="text-[#E5A93C]">★</span> {book.rating}
            </span>
          </div>

          {/* RIGHT: Book Details */}
          <div className="flex flex-col lg:col-span-7">
            {/* Book Name */}
            <h1 className="text-3xl font-extrabold tracking-tight text-[#241812] md:text-4xl">
              {book.bookName}
            </h1>

            {/* Author */}
            <p className="mt-2 text-base font-medium text-[#7A6A60] md:text-lg">
              By :{" "}
              <span className="font-semibold text-[#3D281C]">
                {book.author}
              </span>
            </p>

            {/* Category with divider above & below */}
            <div className="my-4 border-y border-[#F0E4D8] py-3">
              <span className="text-sm font-bold text-[#8B5A2B]">
                {book.category}
              </span>
            </div>

            {/* Review */}
            <div className="text-sm leading-relaxed text-[#5A473C] md:text-base">
              <p>
                <strong className="font-bold text-[#241812]">Review : </strong>
                {book.review}
              </p>
            </div>

            {/* Tags */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-bold text-[#241812]">Tag</span>
              {book.tags &&
                book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#F5ECE3] px-3 py-1 text-xs font-semibold text-[#7A4B22] ring-1 ring-[#E8D5C4]"
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-[#F0E4D8]" />

            {/* Metadata Table / Key-Value Specs */}
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-6 font-normal text-[#7A6A60] sm:col-span-5">
                  Number of Pages:
                </span>
                <span className="col-span-6 font-bold text-[#241812] sm:col-span-7">
                  {book.totalPages}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-6 font-normal text-[#7A6A60] sm:col-span-5">
                  Publisher:
                </span>
                <span className="col-span-6 font-bold text-[#241812] sm:col-span-7">
                  {book.publisher}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-6 font-normal text-[#7A6A60] sm:col-span-5">
                  Year of Publishing:
                </span>
                <span className="col-span-6 font-bold text-[#241812] sm:col-span-7">
                  {book.yearOfPublishing}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-6 font-normal text-[#7A6A60] sm:col-span-5">
                  Rating:
                </span>
                <span className="col-span-6 flex items-center gap-1.5 font-bold text-[#241812] sm:col-span-7">
                  {book.rating}
                  <span className="text-[#E5A93C]">★</span>
                </span>
              </div>
            </div>

            {/* Action Buttons: Read & Wishlist */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleReadClick}
                className={`rounded-xl px-7 py-3 text-sm font-bold transition duration-200 ${
                  readMarked
                    ? "bg-[#8B5A2B] text-white shadow-md shadow-[#8B5A2B]/20 hover:bg-[#6F4420]"
                    : "border-2 border-[#DCC8B6] bg-white text-[#4A2E18] hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                }`}
              >
                {readMarked ? "✓ Read" : "Read"}
              </button>

              <button
                type="button"
                onClick={handleWishlistClick}
                className={`rounded-xl px-7 py-3 text-sm font-bold shadow-md transition duration-200 ${
                  wishlistMarked
                    ? "bg-[#583518] text-white shadow-[#583518]/20 hover:bg-[#3E2310]"
                    : "bg-[#C17937] text-white shadow-[#C17937]/20 hover:bg-[#A96327]"
                }`}
              >
                {wishlistMarked ? "★ In Wishlist" : "Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookDetailsPage;
