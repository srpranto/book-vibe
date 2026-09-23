"use client";

import { useState, useMemo, useCallback } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import {
  BookMarked,
  ArrowRight,
  BookOpen,
  Compass,
  ChevronRight,
} from "lucide-react";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import { useCustomBooks } from "@/context/CustomBooksContext";
import { getAllBooks } from "@/lib/books";
import { AestheticBookCover } from "@/components/ui/AestheticBookCover";
import { BookShelfButton } from "@/components/books/BookShelfButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Book } from "@/types/book.type";
import { normalizeBookId } from "@/context/ReadingStatusContext";

type TrayTab = "reading" | "queue" | "finished";

const WishlistFAB = (): ReactElement | null => {
  const { statusMap, isMounted: isStatusMounted } = useReadingStatus();
  const { customBooks, isMounted: isCustomMounted } = useCustomBooks();
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TrayTab>("reading");

  const isMounted = isStatusMounted && isCustomMounted;

  const allBooks = useMemo(() => getAllBooks(), []);

  const combinedBooks = useMemo(() => {
    const map = new Map<number, Book>();
    allBooks.forEach((b) => map.set(b.bookId, b));
    customBooks.forEach((b) => map.set(b.bookId, b));
    return Array.from(map.values());
  }, [allBooks, customBooks]);

  const getBookStatus = useCallback(
    (b: Book): string | null => {
      if (statusMap[b.bookId]) return statusMap[b.bookId];
      if (b.workId) {
        const id = normalizeBookId(b.workId);
        if (statusMap[id]) return statusMap[id];
      }
      if (b.openLibraryKey) {
        const id = normalizeBookId(b.openLibraryKey);
        if (statusMap[id]) return statusMap[id];
      }
      return null;
    },
    [statusMap],
  );

  const currentlyReadingBooks = useMemo(() => {
    return combinedBooks.filter((b) => getBookStatus(b) === "reading");
  }, [combinedBooks, getBookStatus]);

  const wantToReadBooks = useMemo(() => {
    return combinedBooks.filter((b) => getBookStatus(b) === "plan_to_read");
  }, [combinedBooks, getBookStatus]);

  const completedBooks = useMemo(() => {
    return combinedBooks.filter((b) => getBookStatus(b) === "completed");
  }, [combinedBooks, getBookStatus]);

  const totalTracked = useMemo(() => {
    return Object.values(statusMap).filter(Boolean).length;
  }, [statusMap]);

  if (!isMounted || totalTracked === 0) {
    return null;
  }

  const activeList =
    activeTab === "reading"
      ? currentlyReadingBooks
      : activeTab === "queue"
        ? wantToReadBooks
        : completedBooks;

  return (
    <>
      <aside
        aria-label="Reader Shelf Quick Hub"
        className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2 sm:gap-2.5 rounded-full border border-secondary/60 bg-[#1F120A] px-3 py-2 sm:px-4 sm:py-2.5 text-white shadow-xl shadow-black/40 transition-all duration-200 hover:scale-105 hover:bg-[#2A180E] active:scale-95 ring-1 ring-white/10"
          aria-label={`Open Reader Shelf Quick Hub (${totalTracked} tracked)`}
        >
          <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-xs">
            <BookMarked className="h-3.5 w-3.5" />
            {currentlyReadingBooks.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 ring-1 ring-[#1F120A]" />
              </span>
            )}
          </div>

          <div className="flex flex-col text-left leading-tight pr-0.5">
            <span className="text-[9px] min-[360px]:text-[10px] font-extrabold uppercase tracking-wider text-secondary">
              My Shelf Tray
            </span>
            <span className="text-[11px] min-[360px]:text-xs font-bold text-white">
              {currentlyReadingBooks.length > 0
                ? `${currentlyReadingBooks.length} Reading`
                : `${totalTracked} On Shelf`}
            </span>
          </div>
        </button>
      </aside>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-lg max-h-[88vh] p-4 sm:p-6 rounded-3xl bg-background border-border shadow-2xl flex flex-col overflow-hidden text-foreground">
          <DialogHeader className="border-b border-border pb-3 pr-10 sm:pr-12 text-left shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                  <BookMarked className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <DialogTitle className="text-base sm:text-lg font-extrabold text-foreground truncate">
                    My Shelf Quick Tray
                  </DialogTitle>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Instant access to your personal shelf
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-border bg-[#FAF4EE] px-2.5 py-1 text-[11px] font-bold text-primary">
                {totalTracked} {totalTracked === 1 ? "book" : "books"}
              </span>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-3 pt-2 min-h-0 flex-1 overflow-hidden">
            {/* Quick Tray Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 rounded-2xl border border-border bg-[#FAF4EE] p-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("reading")}
                className={`flex flex-col min-[380px]:flex-row items-center justify-center gap-1 rounded-xl py-2 px-1 text-center transition-all ${
                  activeTab === "reading"
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "text-[#5B3315] hover:bg-white/60 font-semibold"
                }`}
              >
                <span className="text-[11px] sm:text-xs">Reading</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    activeTab === "reading"
                      ? "bg-white/20 text-white"
                      : "bg-muted text-primary"
                  }`}
                >
                  {currentlyReadingBooks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("queue")}
                className={`flex flex-col min-[380px]:flex-row items-center justify-center gap-1 rounded-xl py-2 px-1 text-center transition-all ${
                  activeTab === "queue"
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "text-[#5B3315] hover:bg-white/60 font-semibold"
                }`}
              >
                <span className="text-[11px] sm:text-xs">Want to Read</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    activeTab === "queue"
                      ? "bg-white/20 text-white"
                      : "bg-muted text-primary"
                  }`}
                >
                  {wantToReadBooks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("finished")}
                className={`flex flex-col min-[380px]:flex-row items-center justify-center gap-1 rounded-xl py-2 px-1 text-center transition-all ${
                  activeTab === "finished"
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "text-[#5B3315] hover:bg-white/60 font-semibold"
                }`}
              >
                <span className="text-[11px] sm:text-xs">Finished</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    activeTab === "finished"
                      ? "bg-white/20 text-white"
                      : "bg-muted text-primary"
                  }`}
                >
                  {completedBooks.length}
                </span>
              </button>
            </div>

            {/* Book List for Selected Tab */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
              {activeList.length > 0 ? (
                activeList.map((book) => {
                  const href = book.workId
                    ? `/books/${book.workId}`
                    : book.openLibraryKey
                      ? `/books/${book.openLibraryKey.replace("/works/", "")}`
                      : `/books/${book.bookId}`;

                  return (
                    <div
                      key={book.bookId}
                      className="flex items-center justify-between gap-2.5 rounded-2xl border border-border bg-white p-2.5 shadow-2xs hover:border-secondary transition-colors"
                    >
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 min-w-0 flex-1 group"
                      >
                        <AestheticBookCover
                          title={book.bookName}
                          author={book.author}
                          coverUrl={book.image}
                          category={book.category}
                          size="compact"
                          className="h-14! w-10! shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {book.bookName}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {book.author}
                          </p>
                          {book.category && (
                            <span className="mt-0.5 inline-block text-[9px] font-semibold text-[#8B6E5A]">
                              {book.category}
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="flex items-center gap-1 shrink-0">
                        <BookShelfButton book={book} size="sm" compact={true} />
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-[#8B6E5A] hover:text-primary hover:bg-muted rounded-xl"
                        >
                          <Link
                            href={href}
                            onClick={() => setOpen(false)}
                            title="View details"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-white/60 p-6 sm:p-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary mb-2">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground">
                    No books in &ldquo;
                    {activeTab === "reading"
                      ? "Reading"
                      : activeTab === "queue"
                        ? "Want to Read"
                        : "Finished"}
                    &rdquo;
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground max-w-xs mx-auto">
                    Add books from the library to build your personal reading
                    list!
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-4 rounded-xl border-[#DCC8B6] text-xs font-bold text-[#5B3315] hover:bg-[#FAF4EE]"
                  >
                    <Link href="/" onClick={() => setOpen(false)}>
                      Browse Library
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Footer Navigation CTA */}
            <div className="pt-3 border-t border-border shrink-0 flex flex-col gap-2">
              <Button
                asChild
                size="sm"
                className="w-full justify-between rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold py-2.5 h-auto shadow-xs"
              >
                <Link href="/plan-to-read" onClick={() => setOpen(false)}>
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Open Full Bookshelf &amp; Stats</span>
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                <span className="hidden lg:inline">
                  Tip: Press Ctrl+K anytime to search
                </span>
                <span className="lg:hidden">
                  Explore your reading sanctuary
                </span>
                <Link
                  href="/plan-to-read?tab=journeys"
                  onClick={() => setOpen(false)}
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Compass className="h-3 w-3" />
                  <span>Journeys</span>
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WishlistFAB;
