"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book.type";
import { BookShelfButton } from "@/components/books/BookShelfButton";
import { Check, Share2 } from "lucide-react";

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
    <Button
      variant="outline"
      onClick={handleShare}
      aria-label={copied ? "Link copied to clipboard" : "Share this book link"}
      className="mt-3 w-full gap-2 rounded-xl border-[#DCC8B6] bg-white py-2.5 text-xs font-bold text-[#4A2E18] shadow-2xs hover:border-primary hover:bg-muted hover:text-primary"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600 stroke-3" />
          <span className="text-emerald-700">Link Copied to Clipboard!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-primary" />
          <span>Share this Book</span>
        </>
      )}
    </Button>
  );
};

interface BookTrackActionProps {
  book: Book;
}

export const BookTrackAction = ({
  book,
}: BookTrackActionProps): ReactElement => {
  return (
    <div className="mt-8 flex items-center justify-center w-full">
      <BookShelfButton
        book={book}
        size="lg"
        className="w-full sm:w-auto min-w-60 h-12 text-sm font-extrabold shadow-md"
      />
    </div>
  );
};