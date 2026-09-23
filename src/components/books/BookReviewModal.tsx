"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import {
  PenLine,
  Star,
  BookOpen,
  Quote,
  Trash2,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { useMarginalia } from "@/context/MarginaliaContext";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import { useCustomBooks } from "@/context/CustomBooksContext";
import type { Book } from "@/types/book.type";
import { AestheticBookCover } from "@/components/ui/AestheticBookCover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, formatDisplayDate } from "@/components/ui/calendar";
import { toast } from "sonner";
import { READING_STATUS_OPTIONS } from "@/types/reading-status.type";

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Masterpiece",
};

interface BookReviewModalProps {
  book: Book;
  size?: "sm" | "default" | "lg";
  variant?: "button" | "icon" | "card";
  className?: string;
}

export function BookReviewModal({
  book,
  size = "sm",
  variant = "button",
  className = "",
}: BookReviewModalProps): ReactElement {
  const {
    getEntry,
    updateNotes,
    addQuote,
    removeQuote,
    setFinishedDate,
    setUserRating,
    setCurrentPage,
    clearEntry,
  } = useMarginalia();

  const { getStatus } = useReadingStatus();
  const { saveCustomBook } = useCustomBooks();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Form states
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [finishedDate, setDateVal] = useState<string>("");
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [newQuoteText, setNewQuoteText] = useState<string>("");
  const [showAddQuote, setShowAddQuote] = useState<boolean>(false);

  const currentStatus = getStatus(book.bookId);
  const statusMeta = currentStatus
    ? READING_STATUS_OPTIONS.find((o) => o.value === currentStatus)
    : null;

  const currentEntry = getEntry(book.bookId);
  const existingQuotes = currentEntry?.favoriteQuotes || [];
  const totalPages =
    book.totalPages && book.totalPages > 0 ? book.totalPages : 350;

  const hasReviewData = Boolean(
    (currentEntry?.userRating && currentEntry.userRating > 0) ||
    currentEntry?.notes?.trim() ||
    (currentEntry?.favoriteQuotes && currentEntry.favoriteQuotes.length > 0) ||
    currentEntry?.finishedDate ||
    (currentEntry?.currentPage && currentEntry.currentPage > 0),
  );

  const ensureSavedCustomBook = (): void => {
    if (book && (book.isCustom || book.openLibraryKey)) {
      saveCustomBook(book);
    }
  };

  const handleOpen = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const entry = getEntry(book.bookId);
    setRating(entry?.userRating || 0);
    setHoverRating(null);
    setNotes(entry?.notes || "");
    setPage(entry?.currentPage || 0);
    setDateVal(entry?.finishedDate || "");
    setDatePickerOpen(false);
    setShowAddQuote(false);
    setNewQuoteText("");
    setIsOpen(true);
  };

  const handleSave = (): void => {
    ensureSavedCustomBook();
    updateNotes(book.bookId, notes);
    setUserRating(book.bookId, rating > 0 ? rating : undefined);
    setCurrentPage(book.bookId, page > 0 ? page : undefined);
    setFinishedDate(book.bookId, finishedDate || undefined);
    toast.success(`Saved reading journal for "${book.bookName}"`);
    setIsOpen(false);
  };

  const handleClear = (): void => {
    clearEntry(book.bookId);
    setRating(0);
    setNotes("");
    setPage(0);
    setDateVal("");
    toast.info(`Cleared journal review for "${book.bookName}"`);
    setIsOpen(false);
  };

  const handleAddQuoteSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;
    ensureSavedCustomBook();
    addQuote(book.bookId, newQuoteText.trim());
    setNewQuoteText("");
    setShowAddQuote(false);
    toast.success("Quote added to your journal!");
  };

  const handleSetToday = (): void => {
    const today = new Date().toISOString().split("T")[0];
    setDateVal(today);
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;
  const progressPct =
    totalPages > 0 ? Math.min(100, Math.round((page / totalPages) * 100)) : 0;

  return (
    <>
      {/* Trigger Button Variants */}
      {variant === "button" && (
        <Button
          type="button"
          onClick={handleOpen}
          variant="outline"
          size={size}
          className={`h-8 gap-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
            hasReviewData
              ? "border-amber-400/80 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:border-amber-500"
              : "border-[#DCC8B6] bg-white text-[#5B3315] hover:border-primary hover:bg-muted"
          } ${className}`}
          title="Open personal review & reading journal"
        >
          {currentEntry?.userRating ? (
            <>
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{currentEntry.userRating}/5 Review</span>
            </>
          ) : hasReviewData ? (
            <>
              <PenLine className="h-3.5 w-3.5 text-amber-700" />
              <span>Reviewed</span>
            </>
          ) : (
            <>
              <PenLine className="h-3.5 w-3.5 text-primary" />
              <span>Review &amp; Notes</span>
            </>
          )}
        </Button>
      )}

      {variant === "icon" && (
        <button
          type="button"
          onClick={handleOpen}
          className={`relative flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
            hasReviewData
              ? "border-amber-400 bg-amber-50 text-amber-900 shadow-2xs hover:bg-amber-100"
              : "border-[#DCC8B6] bg-white text-[#8B6E5A] hover:border-primary hover:bg-muted hover:text-primary"
          } ${className}`}
          title={
            hasReviewData
              ? `Review: ${currentEntry?.userRating ? `${currentEntry.userRating}★ - ` : ""}${currentEntry?.notes?.slice(0, 40) || "Journal entries saved"}`
              : "Write personal review & journal notes"
          }
          aria-label="Book review and journal notes"
        >
          <PenLine
            className={`h-4 w-4 ${
              hasReviewData ? "text-amber-700" : "text-current"
            }`}
          />
          {hasReviewData && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 ring-2 ring-white" />
            </span>
          )}
        </button>
      )}

      {variant === "card" && (
        <button
          type="button"
          onClick={handleOpen}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-[#DCC8B6] bg-white px-3 py-1.5 text-xs font-bold text-[#5B3315] shadow-xs transition hover:border-primary hover:bg-[#FAF4EE] ${className}`}
        >
          <PenLine className="h-3.5 w-3.5 text-primary" />
          <span>Edit Review &amp; Notes</span>
        </button>
      )}

      {/* The Review & Journal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-7 rounded-3xl bg-background border-border shadow-2xl text-foreground">
          <DialogHeader className="border-b border-border pb-4 text-left">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-18 aspect-2/3 rounded-lg overflow-hidden bg-[#FAF4EE] shadow-xs">
                <AestheticBookCover
                  title={book.bookName}
                  author={book.author}
                  coverUrl={book.image}
                  size="compact"
                  className="h-18! w-12!"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    <Sparkles className="h-3 w-3" />
                    Personal Journal
                  </span>
                  {statusMeta && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border ${statusMeta.color} ${statusMeta.textColor} ${statusMeta.borderColor}`}
                    >
                      <span>{statusMeta.emoji}</span>
                      <span>{statusMeta.label}</span>
                    </span>
                  )}
                </div>

                <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground leading-tight line-clamp-1">
                  {book.bookName}
                </DialogTitle>
                <p className="text-xs font-medium text-muted-foreground mt-0.5 line-clamp-1">
                  by {book.author} &bull; {book.category}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* 1. Star Rating */}
            <div className="rounded-2xl border border-border bg-white p-4 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  My Rating
                </span>
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setRating(0);
                      setHoverRating(null);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    <X className="h-3 w-3" />
                    <span>Clear rating</span>
                  </button>
                )}
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-hidden"
                      title={`Rate ${star} star${star > 1 ? "s" : ""} (${RATING_LABELS[star]})`}
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= activeRating
                            ? "text-amber-500 fill-amber-500"
                            : "text-[#DCC8B6] hover:text-amber-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {activeRating > 0 ? (
                  <span className="text-sm font-bold text-primary">
                    ★ {activeRating} / 5 &mdash; {RATING_LABELS[activeRating]}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-[#9E8A7C]">
                    Click a star to rate
                  </span>
                )}
              </div>
            </div>

            {/* 2. Reading Progress Tracker */}
            <div className="rounded-2xl border border-border bg-white p-4 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-foreground">
                      Reading Progress
                    </span>
                    <span className="ml-2 text-xs font-semibold text-[#8B6E5A]">
                      Page {page} of {totalPages} ({progressPct}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Page
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={totalPages}
                      value={page || ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!Number.isNaN(val)) {
                          setPage(Math.min(totalPages, Math.max(0, val)));
                        } else {
                          setPage(0);
                        }
                      }}
                      className="w-16 rounded-lg border border-[#DCC8B6] bg-background px-2 py-0.5 text-center text-xs font-bold text-foreground focus:border-primary focus:outline-hidden"
                    />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      / {totalPages}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setPage(Math.max(0, page - 10))}
                      className="rounded-lg border border-[#DCC8B6] px-2 py-0.5 font-semibold text-[#5B3315] hover:bg-muted transition"
                      title="Back 10 pages"
                    >
                      -10
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage(Math.min(totalPages, page + 10))}
                      className="rounded-lg border border-[#DCC8B6] px-2 py-0.5 font-semibold text-[#5B3315] hover:bg-muted transition"
                      title="Forward 10 pages"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage(Math.min(totalPages, page + 25))}
                      className="rounded-lg border border-[#DCC8B6] px-2 py-0.5 font-semibold text-[#5B3315] hover:bg-muted transition"
                      title="Forward 25 pages"
                    >
                      +25
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 relative h-2.5 w-full overflow-hidden rounded-full bg-border/50">
                <div
                  className="h-full bg-linear-to-r from-primary to-[#C17937] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* 3. Personal Notes & Review */}
            <div>
              <label
                htmlFor="journal-notes"
                className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
              >
                Personal Reflections &amp; Review
              </label>
              <textarea
                id="journal-notes"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your thoughts, literary critique, reflections, or takeaways about this book..."
                className="mt-2 w-full rounded-2xl border border-[#DCC8B6] bg-white p-3.5 text-sm leading-relaxed text-foreground placeholder-[#8B6E5A]/60 shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-hidden"
              />
            </div>

            {/* 4. Saved Quotes */}
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  <Quote className="h-3.5 w-3.5 text-primary" />
                  Saved Quotes ({existingQuotes.length})
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddQuote((prev) => !prev)}
                  className="h-7 gap-1 rounded-xl border-[#DCC8B6] bg-white px-2.5 text-xs font-semibold text-[#5B3315] hover:border-primary hover:bg-muted"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Quote</span>
                </Button>
              </div>

              {showAddQuote && (
                <form
                  onSubmit={handleAddQuoteSubmit}
                  className="mt-3 flex gap-2"
                >
                  <input
                    type="text"
                    value={newQuoteText}
                    onChange={(e) => setNewQuoteText(e.target.value)}
                    placeholder="Type or paste a quote..."
                    className="flex-1 rounded-xl border border-[#DCC8B6] bg-white px-3.5 py-2 text-xs font-medium text-foreground shadow-xs focus:border-primary focus:outline-hidden"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-hover"
                  >
                    Add
                  </Button>
                </form>
              )}

              {existingQuotes.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {existingQuotes.map((q, idx) => (
                    <li
                      key={idx}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border bg-white/90 p-3 shadow-2xs"
                    >
                      <blockquote className="text-xs italic leading-relaxed text-[#35231A]">
                        &ldquo;{q}&rdquo;
                      </blockquote>
                      <button
                        type="button"
                        onClick={() => removeQuote(book.bookId, idx)}
                        title="Remove quote"
                        className="text-[#9E8A7C] hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs italic text-[#8B6E5A]">
                  No quotes saved yet. Click &ldquo;Add Quote&rdquo; above to
                  record memorable lines.
                </p>
              )}
            </div>

            {/* 5. Date Finished & Offline status */}
            <div className="border-t border-border pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#5C4537] flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                  Date Finished:
                </span>

                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`h-8 gap-1.5 rounded-xl border-[#DCC8B6] bg-white px-2.5 text-xs font-semibold shadow-2xs transition-all hover:border-primary hover:bg-[#FAF4EE] ${
                        finishedDate
                          ? "text-[#2C1810] font-bold border-primary/40 bg-primary/5"
                          : "text-[#8B6E5A]"
                      }`}
                    >
                      <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {finishedDate
                          ? formatDisplayDate(finishedDate)
                          : "Pick a date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="p-3 border-[#DCC8B6] bg-background"
                  >
                    <Calendar
                      value={finishedDate}
                      onChange={(date) => {
                        setDateVal(date);
                        setDatePickerOpen(false);
                      }}
                      onClose={() => setDatePickerOpen(false)}
                    />
                  </PopoverContent>
                </Popover>

                <button
                  type="button"
                  onClick={handleSetToday}
                  className="rounded-xl border border-[#DCC8B6] bg-white px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-[#FAF4EE] transition"
                >
                  Today
                </button>

                {finishedDate && (
                  <button
                    type="button"
                    onClick={() => setDateVal("")}
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-xs text-[#9E8A7C] hover:bg-rose-50 hover:text-rose-600 transition"
                    title="Clear date"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#8B6E5A]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Saved locally on your device</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border pt-4">
              {hasReviewData ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="rounded-xl border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  <span>Clear All Review Data</span>
                </Button>
              ) : (
                <span />
              )}

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border-[#DCC8B6] text-xs font-bold text-[#5B3315] hover:bg-[#FAF4EE]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  className="rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-md hover:bg-primary-hover"
                >
                  Save Review
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
