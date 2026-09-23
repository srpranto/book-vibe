"use client";

import { useState, useMemo } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import {
  PenLine,
  Star,
  Quote,
  Calendar as CalendarIcon,
  Search,
  BookOpen,
  Sparkles,
  BookMarked,
  Filter,
} from "lucide-react";
import { useMarginalia } from "@/context/MarginaliaContext";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import type { Book } from "@/types/book.type";
import { AestheticBookCover } from "@/components/ui/AestheticBookCover";
import { BookReviewModal } from "@/components/books/BookReviewModal";
import { READING_STATUS_OPTIONS } from "@/types/reading-status.type";
import { Button } from "@/components/ui/button";

interface ReviewsJournalViewProps {
  allBooks: Book[];
  onSwitchToShelf: () => void;
}

type RatingFilter = "all" | "5" | "4" | "3" | "quotes" | "notes";

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Masterpiece",
};

export function ReviewsJournalView({
  allBooks,
  onSwitchToShelf,
}: ReviewsJournalViewProps): ReactElement {
  const { marginaliaMap, isMounted } = useMarginalia();
  const { statusMap } = useReadingStatus();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<RatingFilter>("all");

  // Filter books that have any review/journal entry
  const reviewedBooks = useMemo(() => {
    if (!isMounted) return [];

    return allBooks.filter((b) => {
      const entry = marginaliaMap[b.bookId];
      if (!entry) return false;
      const hasRating = Boolean(entry.userRating && entry.userRating > 0);
      const hasNotes = Boolean(entry.notes && entry.notes.trim().length > 0);
      const hasQuotes = Boolean(
        entry.favoriteQuotes && entry.favoriteQuotes.length > 0,
      );
      const hasDate = Boolean(entry.finishedDate);
      const hasPage = Boolean(entry.currentPage && entry.currentPage > 0);
      return hasRating || hasNotes || hasQuotes || hasDate || hasPage;
    });
  }, [allBooks, marginaliaMap, isMounted]);

  // Review statistics
  const stats = useMemo(() => {
    let totalRatings = 0;
    let ratingSum = 0;
    let totalQuotes = 0;
    let masterpieces = 0;
    let withNotes = 0;

    reviewedBooks.forEach((b) => {
      const entry = marginaliaMap[b.bookId];
      if (!entry) return;
      if (entry.userRating && entry.userRating > 0) {
        totalRatings += 1;
        ratingSum += entry.userRating;
        if (entry.userRating === 5) masterpieces += 1;
      }
      if (entry.favoriteQuotes && entry.favoriteQuotes.length > 0) {
        totalQuotes += entry.favoriteQuotes.length;
      }
      if (entry.notes && entry.notes.trim().length > 0) {
        withNotes += 1;
      }
    });

    const avgRating =
      totalRatings > 0 ? (ratingSum / totalRatings).toFixed(1) : "—";

    return {
      totalReviews: reviewedBooks.length,
      avgRating,
      totalQuotes,
      masterpieces,
      withNotes,
    };
  }, [reviewedBooks, marginaliaMap]);

  // Filter & Search
  const filteredReviewedBooks = useMemo(() => {
    return reviewedBooks.filter((b) => {
      const entry = marginaliaMap[b.bookId];
      if (!entry) return false;

      // Filter check
      if (selectedFilter === "5" && entry.userRating !== 5) return false;
      if (selectedFilter === "4" && entry.userRating !== 4) return false;
      if (selectedFilter === "3" && entry.userRating !== 3) return false;
      if (
        selectedFilter === "quotes" &&
        (!entry.favoriteQuotes || entry.favoriteQuotes.length === 0)
      )
        return false;
      if (selectedFilter === "notes" && (!entry.notes || !entry.notes.trim()))
        return false;

      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = b.bookName.toLowerCase().includes(q);
        const matchesAuthor = b.author.toLowerCase().includes(q);
        const matchesNotes = entry.notes
          ? entry.notes.toLowerCase().includes(q)
          : false;
        const matchesQuotes = entry.favoriteQuotes
          ? entry.favoriteQuotes.some((quote) =>
              quote.toLowerCase().includes(q),
            )
          : false;

        return matchesTitle || matchesAuthor || matchesNotes || matchesQuotes;
      }

      return true;
    });
  }, [reviewedBooks, marginaliaMap, selectedFilter, searchQuery]);

  if (!isMounted) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-xs font-bold text-[#8B6E5A]">
          Loading your reading journal...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Header & Summary Stats */}
      <div className="rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D5C4] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#7A4B22] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Personal Reviews &amp; Notes</span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              My Reading{" "}
              <span className="text-primary">Reviews &amp; Notes</span>
            </h2>

            <p className="mt-1.5 max-w-xl text-xs sm:text-sm font-medium text-muted-foreground">
              Your ratings, personal reflections, and saved passages recorded
              across books on your shelf. Stored locally on your device.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="rounded-2xl border border-border bg-white p-2.5 sm:p-3.5 shadow-2xs text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8B6E5A] uppercase tracking-wider block">
                Reviewed
              </span>
              <span className="text-lg sm:text-2xl font-black text-foreground mt-0.5 block">
                {stats.totalReviews}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-primary">
                Books with notes
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-white p-2.5 sm:p-3.5 shadow-2xs text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8B6E5A] uppercase tracking-wider block">
                Avg Rating
              </span>
              <span className="text-lg sm:text-2xl font-black text-amber-600 mt-0.5 block">
                {stats.avgRating} <span className="text-xs font-bold">★</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-primary">
                Personal score
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-white p-2.5 sm:p-3.5 shadow-2xs text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8B6E5A] uppercase tracking-wider block">
                Masterpieces
              </span>
              <span className="text-lg sm:text-2xl font-black text-primary mt-0.5 block">
                {stats.masterpieces}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-primary">
                5-Star books
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-white p-2.5 sm:p-3.5 shadow-2xs text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8B6E5A] uppercase tracking-wider block">
                Quotes
              </span>
              <span className="text-lg sm:text-2xl font-black text-foreground mt-0.5 block">
                {stats.totalQuotes}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-primary">
                Passages saved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Rating Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-0.5 scrollbar-none w-full sm:w-auto -mx-1 px-1">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`shrink-0 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedFilter === "all"
                ? "bg-primary text-white shadow-xs"
                : "border border-border bg-white text-[#5B3315] hover:bg-[#FAF4EE]"
            }`}
          >
            All Entries ({reviewedBooks.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("5")}
            className={`shrink-0 whitespace-nowrap flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedFilter === "5"
                ? "bg-primary text-white shadow-xs"
                : "border border-border bg-white text-[#5B3315] hover:bg-[#FAF4EE]"
            }`}
          >
            <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
            <span>5★ Masterpieces</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("4")}
            className={`shrink-0 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedFilter === "4"
                ? "bg-primary text-white shadow-xs"
                : "border border-border bg-white text-[#5B3315] hover:bg-[#FAF4EE]"
            }`}
          >
            4★ Great
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("quotes")}
            className={`shrink-0 whitespace-nowrap flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedFilter === "quotes"
                ? "bg-primary text-white shadow-xs"
                : "border border-border bg-white text-[#5B3315] hover:bg-[#FAF4EE]"
            }`}
          >
            <Quote className="h-3 w-3 shrink-0" />
            <span>Has Quotes</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("notes")}
            className={`shrink-0 whitespace-nowrap flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedFilter === "notes"
                ? "bg-primary text-white shadow-xs"
                : "border border-border bg-white text-[#5B3315] hover:bg-[#FAF4EE]"
            }`}
          >
            <PenLine className="h-3 w-3 shrink-0" />
            <span>Has Review Text</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B6E5A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews or quotes..."
            className="w-full rounded-xl border border-[#DCC8B6] bg-white py-2 pl-10 pr-4 text-xs font-medium text-foreground placeholder-[#8B6E5A]/70 shadow-2xs focus:border-primary focus:outline-hidden"
          />
        </div>
      </div>

      {/* 3. Empty State: No Reviews At All */}
      {reviewedBooks.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border bg-background/60 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xs text-primary">
            <PenLine className="h-8 w-8" />
          </div>

          <h3 className="mt-4 text-lg font-extrabold text-foreground">
            No reviews yet
          </h3>

          <p className="mt-2 mx-auto max-w-md text-xs sm:text-sm font-medium leading-relaxed text-muted-foreground">
            You haven&apos;t added any reviews, notes, or quotes yet. Head over
            to your bookshelf, and click{" "}
            <strong className="text-primary">
              &ldquo;Review &amp; Notes&rdquo;
            </strong>{" "}
            on any book to start writing.
          </p>

          <Button
            type="button"
            onClick={onSwitchToShelf}
            className="mt-6 gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-hover"
          >
            <BookMarked className="h-4 w-4" />
            <span>Go to My Bookshelf</span>
          </Button>
        </div>
      ) : filteredReviewedBooks.length === 0 ? (
        /* Empty State: Search/Filter returned 0 */
        <div className="rounded-3xl border border-border bg-white p-10 text-center shadow-xs">
          <Filter className="mx-auto h-8 w-8 text-[#8B6E5A]" />
          <h3 className="mt-3 text-base font-bold text-foreground">
            No reviews match this filter
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search query or selecting &ldquo;All
            Entries&rdquo;.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedFilter("all");
              setSearchQuery("");
            }}
            className="mt-4 rounded-xl border-[#DCC8B6] text-xs font-bold text-[#5B3315]"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        /* 4. Journal Review Entries Stream */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredReviewedBooks.map((book) => {
            const entry = marginaliaMap[book.bookId];
            if (!entry) return null;

            const userRating = entry.userRating || 0;
            const ratingLabel =
              userRating > 0 ? RATING_LABELS[userRating] : null;
            const statusKey = statusMap[book.bookId];
            const statusMeta = statusKey
              ? READING_STATUS_OPTIONS.find((o) => o.value === statusKey)
              : null;
            const quotes = entry.favoriteQuotes || [];
            const notes = entry.notes?.trim();

            const href = book.workId
              ? `/books/${book.workId}`
              : `/books/${book.bookId}`;

            return (
              <div
                key={book.bookId}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  {/* Card Header: Cover, Title, Status & Actions */}
                  <div className="flex gap-4">
                    <Link
                      href={href}
                      className="shrink-0 w-16 h-24 aspect-2/3 rounded-xl overflow-hidden shadow-xs hover:opacity-90 transition"
                    >
                      <AestheticBookCover
                        title={book.bookName}
                        author={book.author}
                        coverUrl={book.image}
                        size="compact"
                        className="h-24! w-16!"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        {statusMeta && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border ${statusMeta.color} ${statusMeta.textColor} ${statusMeta.borderColor}`}
                          >
                            <span>{statusMeta.emoji}</span>
                            <span>{statusMeta.label}</span>
                          </span>
                        )}
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-[#7A4B22]">
                          {book.category}
                        </span>
                      </div>

                      <Link href={href}>
                        <h4 className="text-base font-extrabold text-foreground hover:text-primary transition line-clamp-1">
                          {book.bookName}
                        </h4>
                      </Link>

                      <p className="text-xs font-medium text-muted-foreground line-clamp-1">
                        by {book.author}
                      </p>

                      {/* Star Rating Badge */}
                      {userRating > 0 && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= userRating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-[#DCC8B6]"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-extrabold text-primary">
                            {userRating}/5 {ratingLabel && `(${ratingLabel})`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date or Page Progress indicator */}
                  {(entry.finishedDate ||
                    (entry.currentPage && entry.currentPage > 0)) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      {entry.finishedDate && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF4EE] px-2 py-0.5 font-semibold text-[#5C4537] border border-border">
                          <CalendarIcon className="h-3 w-3 text-primary" />
                          Finished: {entry.finishedDate}
                        </span>
                      )}
                      {entry.currentPage && entry.currentPage > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 font-semibold text-blue-800 border border-blue-100">
                          <BookOpen className="h-3 w-3 text-blue-600" />
                          Page {entry.currentPage}
                          {book.totalPages ? ` of ${book.totalPages}` : ""}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Personal Review Text */}
                  {notes ? (
                    <div className="mt-4 rounded-2xl border border-border/80 bg-background p-4 text-xs sm:text-sm leading-relaxed text-[#2D1D15] shadow-2xs">
                      <p className="whitespace-pre-wrap font-medium">
                        &ldquo;{notes}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs italic text-[#9E8A7C]">
                      No review text written yet. Click &ldquo;Edit
                      Review&rdquo; to record your thoughts.
                    </p>
                  )}

                  {/* Quotes Section */}
                  {quotes.length > 0 && (
                    <div className="mt-3.5 space-y-1.5">
                      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Quote className="h-3 w-3 text-primary" />
                        Saved Passages ({quotes.length})
                      </span>
                      <div className="space-y-1.5">
                        {quotes.slice(0, 2).map((q, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-border/70 bg-white/90 px-3 py-2 text-[11px] italic leading-relaxed text-[#35231A]"
                          >
                            &ldquo;{q}&rdquo;
                          </div>
                        ))}
                        {quotes.length > 2 && (
                          <p className="text-[10px] font-semibold text-primary pl-1">
                            +{quotes.length - 2} more quotes recorded
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-3.5">
                  <span className="text-[10px] font-medium text-[#8B6E5A]">
                    {entry.updatedAt
                      ? `Updated ${new Date(entry.updatedAt).toLocaleDateString()}`
                      : "Saved in journal"}
                  </span>

                  <BookReviewModal book={book} variant="card" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
