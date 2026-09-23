"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  Dices,
  LayoutGrid,
  List,
  ArrowRight,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import {
  getRandomOpenLibraryBooks,
  searchOpenLibrary,
  type OpenLibraryBook,
} from "@/lib/openLibrary";
import { AestheticBookCover } from "@/components/ui/AestheticBookCover";
import { BookShelfButton } from "@/components/books/BookShelfButton";
import { Button } from "@/components/ui/button";
import BookGridSkeleton from "@/components/ui/BookGridSkeleton";

interface BooksProps {
  initialBooks?: OpenLibraryBook[];
}

export default function Books({ initialBooks }: BooksProps): ReactElement {
  const [books, setBooks] = useState<OpenLibraryBook[]>(
    () => initialBooks ?? [],
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<OpenLibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(
    !initialBooks || initialBooks.length === 0,
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch 12 random books on user shuffle
  const handleShuffle = useCallback(async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      const res = await getRandomOpenLibraryBooks(12);
      if (res.books.length > 0) {
        setBooks(res.books);
      }
    } catch {
      // Handled gracefully
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load: Only fetch if initialBooks was not provided or empty
  useEffect(() => {
    if (books.length > 0) {
      return;
    }

    let ignore = false;

    getRandomOpenLibraryBooks(12)
      .then((res) => {
        if (!ignore) {
          if (res.books.length > 0) {
            setBooks(res.books);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [books.length]);

  const handleSearchChange = (val: string): void => {
    setSearchQuery(val);
    const trimmed = val.trim();

    if (!trimmed) {
      setSearchResults([]);
      setIsLoading(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    setIsLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchOpenLibrary(trimmed, { limit: 12 });
        setSearchResults(res.books);
      } catch {
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);
  };

  const displayedBooks = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    return books;
  }, [searchQuery, searchResults, books]);

  // Ensure exactly 12 books are shown in the grid (3 rows of 4 on tablet/pc, 6 rows of 2 on mobile)
  const gridBooks = useMemo(() => {
    return displayedBooks.slice(0, 12);
  }, [displayedBooks]);

  return (
    <section
      id="library"
      className="scroll-mt-20 md:scroll-mt-24 px-4 py-8 md:py-14"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3.5 py-1 text-xs font-bold text-[#7A4B22] ring-1 ring-[#E8D5C4]">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Book Catalog</span>
            </span>
            <span className="text-xs font-semibold text-[#8B6E5A]">
              • Millions of titles from Open Library
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Explore the <span className="text-primary">Catalog</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Search and discover books from Open Library. Track titles to your
            shelf, organize your reading, or shuffle for new recommendations.
          </p>
        </div>

        {/* Aesthetic Search & Controls Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Aesthetic Elevated Search Input */}
          <div className="relative flex-1 max-w-2xl group">
            <div className="relative flex items-center rounded-2xl border border-border bg-white shadow-2xs transition-all duration-200 focus-within:border-primary focus-within:shadow-md focus-within:ring-3 focus-within:ring-primary/10 hover:border-secondary">
              <div className="flex items-center pl-4 pr-1 text-[#8B6E5A] group-focus-within:text-primary transition-colors">
                <Search className="h-4 w-4" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search millions of books by title, author, or subject..."
                className="w-full bg-transparent py-2.5 sm:py-3 pr-10 lg:pr-20 text-xs sm:text-sm font-medium text-foreground placeholder-[#8B6E5A]/70 focus:outline-hidden"
              />

              {/* Inset Controls: Loader, Clear & Ctrl+K Shortcut */}
              <div className="absolute right-3 flex items-center gap-1.5">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-border text-[10px] font-bold text-[#5B3315] hover:bg-[#DCC8B6] transition"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("open-command-palette"),
                    )
                  }
                  className="hidden lg:inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-0.5 text-[10px] font-bold text-[#8B6E5A] hover:bg-muted hover:text-[#5B3315] transition"
                  title="Quick search (Ctrl+K)"
                >
                  <span>⌘K</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions: Shuffle & View Mode */}
          <div className="flex items-center gap-2 justify-between sm:justify-end shrink-0 w-full sm:w-auto">
            <Button
              onClick={handleShuffle}
              disabled={isRefreshing}
              variant="outline"
              className="flex-1 sm:flex-none justify-center h-10 sm:h-11 rounded-2xl border-secondary bg-[#FAF4EE] px-4 text-xs font-bold text-primary hover:bg-muted transition-colors shadow-2xs"
              title="Fetch 12 fresh books from Open Library"
            >
              <Dices
                className={`h-4 w-4 mr-1.5 text-primary ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span>{isRefreshing ? "Loading..." : "🎲 Shuffle"}</span>
            </Button>

            <div className="flex items-center rounded-2xl border border-border bg-white p-1 shadow-2xs h-10 sm:h-11">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-xl transition ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "text-[#8B6E5A] hover:bg-muted"
                }`}
                title="Grid view (4 columns)"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-xl transition ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "text-[#8B6E5A] hover:bg-muted"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Books Content */}
        {isLoading ? (
          searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-xs text-[#8B6E5A]">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-bold text-foreground">
                Searching Open Library Catalog...
              </p>
              <p className="mt-1">
                Connecting directly to Open Library&apos;s public catalog.
              </p>
            </div>
          ) : (
            <BookGridSkeleton count={12} />
          )
        ) : displayedBooks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#DCC8B6] bg-white/60 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-primary opacity-50" />
            <h3 className="mt-3 text-lg font-bold text-foreground">
              No books found
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try another search query, or click below to shuffle books.
            </p>
            <Button
              onClick={handleShuffle}
              variant="default"
              className="mt-4 rounded-xl"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              <span>Shuffle Books</span>
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          /* Responsive Grid Mode: 2 cols on mobile, 3 on small tablets (640px), 4 on md+ (768px+) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
            {gridBooks.map((book) => {
              const workId = book.key.replace("/works/", "");
              const href = `/books/${workId}`;

              return (
                <article
                  key={book.key}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white shadow-xs transition-colors duration-150 hover:border-secondary hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-center p-3 sm:p-4 bg-background/50 w-full">
                      <Link
                        href={href}
                        className="relative mx-auto flex items-center justify-center w-full max-w-37.5 aspect-2/3"
                      >
                        <AestheticBookCover
                          title={book.title}
                          author={book.authorName}
                          coverUrl={book.coverUrl}
                          category={book.category}
                          size="normal"
                        />
                      </Link>
                    </div>

                    <div className="p-4 pt-2 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#7A4B22]">
                          {book.category || "Open Library"}
                        </span>
                        {book.firstPublishYear && (
                          <span className="text-[10px] text-[#8B6E5A]">
                            • {book.firstPublishYear}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 line-clamp-1 text-xs sm:text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        <Link href={href} title={book.title}>
                          {book.title}
                        </Link>
                      </h3>

                      <p className="mt-0.5 truncate text-[11px] sm:text-xs font-semibold text-muted-foreground">
                        By{" "}
                        <span className="text-[#3D2310]">
                          {book.authorName}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border-subtle p-2 sm:p-2.5 bg-background/40 flex flex-col gap-1.5">
                    <BookShelfButton
                      book={book}
                      size="sm"
                      className="w-full text-xs font-bold h-8 justify-between"
                    />
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full h-8 gap-1.5 rounded-xl border-[#DCC8B6] bg-white px-3 text-xs font-bold text-[#5B3315] shadow-2xs hover:border-primary hover:bg-muted hover:text-primary justify-center"
                    >
                      <Link
                        href={href}
                        title={`View details for ${book.title}`}
                        className="flex items-center justify-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-2">
            {gridBooks.map((book) => {
              const workId = book.key.replace("/works/", "");
              const href = `/books/${workId}`;

              return (
                <div
                  key={book.key}
                  className="flex items-center justify-between gap-2.5 sm:gap-4 rounded-2xl border border-border bg-white p-2.5 sm:p-3 shadow-2xs hover:bg-background transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                    <Link href={href} className="shrink-0">
                      <AestheticBookCover
                        title={book.title}
                        author={book.authorName}
                        coverUrl={book.coverUrl}
                        size="compact"
                        className="h-14! w-10!"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors">
                        <Link href={href}>{book.title}</Link>
                      </h4>
                      <p className="truncate text-[11px] sm:text-xs text-muted-foreground">
                        By {book.authorName}
                        {book.firstPublishYear
                          ? ` • ${book.firstPublishYear}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <BookShelfButton book={book} size="sm" />

                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-xl border-[#DCC8B6] bg-white px-2 sm:px-3 text-xs font-bold text-[#5B3315] hover:border-primary hover:bg-muted hover:text-primary"
                    >
                      <Link
                        href={href}
                        title="View full details"
                        className="flex items-center gap-1"
                      >
                        <span className="hidden sm:inline">Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
