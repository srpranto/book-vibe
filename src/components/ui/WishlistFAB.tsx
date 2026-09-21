"use client";

import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  X,
  BookMarked,
  Trash2,
  BookOpen,
  ChevronRight,
  Check,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import { getAllBooks } from "@/lib/books";
import type { Book } from "@/types/book.type";

interface AddToPlanButtonProps {
  bookId: number;
}

const AddToPlanButton = ({ bookId }: AddToPlanButtonProps): ReactElement => {
  const { getStatus, setStatus } = useReadingStatus();
  const status = getStatus(bookId);
  const isPlanned = status === "plan_to_read";

  return (
    <button
      type="button"
      onClick={() => {
        setStatus(bookId, isPlanned ? null : "plan_to_read");
      }}
      title={isPlanned ? "Remove from Plan to Read" : "Add to Plan to Read"}
      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-[0.97] ${
        isPlanned
          ? "bg-[#8B5A2B] text-white shadow-sm"
          : "border border-[#DCC8B6] bg-white text-[#4A2E18] hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
      }`}
    >
      {isPlanned ? (
        <Check className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <BookMarked className="h-3.5 w-3.5 shrink-0" />
      )}
      <span>{isPlanned ? "Planned ✓" : "Plan to Read"}</span>
    </button>
  );
};

const WishlistFAB = (): ReactElement => {
  const { ids, remove } = useWishlist();
  const [open, setOpen] = useState<boolean>(false);
  const [allBooks] = useState<Book[]>(() => getAllBooks());

  const wishlistBooks = allBooks.filter((b) => ids.includes(b.bookId));

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={`Open wishlist bucket (${ids.length} books)`}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#241812] shadow-2xl shadow-black/30 ring-2 ring-[#8B5A2B]/30 transition-all duration-300 hover:scale-110 hover:bg-[#35231A] hover:ring-[#D4A373]/50 active:scale-95"
        >
          <ShoppingBag className="h-6 w-6 text-[#D4A373] transition-transform duration-200 group-hover:scale-110" />

          {ids.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C17937] px-1 text-[10px] font-extrabold text-white shadow-md">
              {ids.length > 99 ? "99+" : ids.length}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-2xl rounded-t-3xl border-t border-[#EADBCE] bg-[#FAF7F2] shadow-2xl">
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-12 rounded-full bg-[#DCC8B6]" />
          </div>

          <div className="flex items-center justify-between border-b border-[#EADBCE] px-5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5ECE3] text-[#8B5A2B]">
                <ShoppingBag className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-[#241812]">
                  My Bucket
                </h2>
                <p className="text-[11px] font-medium text-[#6F5B50]">
                  {ids.length === 0
                    ? "Empty — tap the bucket icon on any book card"
                    : `${ids.length} book${ids.length === 1 ? "" : "s"} saved`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-[#4A2E18] transition hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
              aria-label="Close bucket"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[55vh] overflow-y-auto px-4 py-3">
            {wishlistBooks.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5ECE3] text-[#8B5A2B]">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <p className="text-sm font-bold text-[#241812]">
                  Your bucket is empty
                </p>
                <p className="mt-1 text-xs font-medium text-[#6F5B50]">
                  Tap the bucket icon on any book card to save it here
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#8B5A2B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#6F4420]"
                >
                  <BookOpen className="h-3.5 w-3.5" /> Browse Books
                </button>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {wishlistBooks.map((book) => (
                  <li
                    key={book.bookId}
                    className="flex items-center gap-3 rounded-2xl border border-[#EADBCE] bg-white p-3 shadow-xs transition hover:border-[#D4A373]"
                  >
                    <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-[#F5ECE3]">
                      <Image
                        src={book.image}
                        alt={book.bookName}
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#241812]">
                        {book.bookName}
                      </p>
                      <p className="truncate text-[10px] font-medium text-[#6F5B50]">
                        {book.author}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <AddToPlanButton bookId={book.bookId} />
                        <Link
                          href={`/books/${book.bookId}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-1 rounded-xl border border-[#EADBCE] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#4A2E18] transition hover:border-[#8B5A2B] hover:text-[#8B5A2B]"
                        >
                          Details <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(book.bookId)}
                      title="Remove from bucket"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#EADBCE] bg-white text-[#8B6E5A] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {wishlistBooks.length > 0 && (
            <div className="flex items-center justify-between border-t border-[#EADBCE] px-5 py-3">
              <p className="text-[11px] text-[#6F5B50]">
                Mark books above as Plan to Read
              </p>
              <Link
                href="/plan-to-read"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl bg-[#8B5A2B] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#6F4420]"
              >
                <BookMarked className="h-3.5 w-3.5" /> View Plan to Read
              </Link>
            </div>
          )}

          <div className="h-safe-area-bottom pb-4" />
        </div>
      </div>
    </>
  );
};

export default WishlistFAB;
