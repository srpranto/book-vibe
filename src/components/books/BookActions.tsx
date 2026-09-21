"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import type { Book } from "@/types/book.type";

export const ShareBookButton = (): ReactElement => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = (): void => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCC8B6] bg-white py-2.5 text-xs font-semibold text-[#4A2E18] shadow-xs transition-all duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B] active:scale-[0.98]"
    >
      <span>{copied ? "✓" : "🔗"}</span>
      <span>{copied ? "Link Copied to Clipboard!" : "Share this Book"}</span>
    </button>
  );
};

interface ReadWishlistButtonsProps {
  book: Book;
}

export const ReadWishlistButtons = ({
  book,
}: ReadWishlistButtonsProps): ReactElement => {
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { getStatus, setStatus } = useReadingStatus();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const status = getStatus(book.bookId);
  const readMarked = status === "reading" || status === "completed";
  const wishlistMarked = isWishlisted(book.bookId);

  const showToast = (msg: string): void => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReadClick = (): void => {
    if (readMarked) {
      setStatus(book.bookId, null);
      showToast(`Removed "${book.bookName}" from Read list`);
    } else {
      setStatus(book.bookId, "reading");
      showToast(`📖 Marked "${book.bookName}" as Reading!`);
    }
  };

  const handleWishlistClick = (): void => {
    toggleWishlist(book.bookId);
    showToast(
      wishlistMarked
        ? `Removed "${book.bookName}" from Bucket`
        : `🛍️ Added "${book.bookName}" to your Bucket!`,
    );
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce rounded-2xl bg-[#241812] px-5 py-3 text-sm font-semibold text-[#EFE4D8] shadow-2xl ring-1 ring-[#D4A373]/30">
          ☕ {toastMessage}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleReadClick}
          className={`flex-1 rounded-xl px-7 py-3.5 text-center text-sm font-bold transition-all duration-200 active:scale-[0.98] sm:flex-initial ${
            readMarked
              ? "bg-[#C17937] text-white shadow-md shadow-[#C17937]/30 hover:bg-[#A96327]"
              : "border-2 border-[#DCC8B6] bg-white text-[#4A2E18] hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
          }`}
        >
          {readMarked ? "✓ Currently Reading" : "Read"}
        </button>

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`flex-1 rounded-xl px-7 py-3.5 text-center text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.98] sm:flex-initial ${
            wishlistMarked
              ? "bg-[#8B5A2B] text-white shadow-[#8B5A2B]/30 hover:bg-[#6F4420]"
              : "bg-[#241812] text-white shadow-black/20 hover:bg-[#35231A]"
          }`}
        >
          {wishlistMarked ? "🛍️ In Your Bucket" : "Add to Bucket"}
        </button>
      </div>
    </>
  );
};
