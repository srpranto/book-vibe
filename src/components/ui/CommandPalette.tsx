"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BookMarked,
  ArrowRight,
  X,
  BookOpen,
  Loader2,
  User,
  Compass,
  CornerDownLeft,
} from "lucide-react";
import { getAllBooks } from "@/lib/books";
import { searchOpenLibrary, type OpenLibraryBook } from "@/lib/openLibrary";
import { AestheticBookCover } from "@/components/ui/AestheticBookCover";

export const CommandPalette = (): ReactElement | null => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const allBooks = useMemo(() => getAllBooks(), []);

  const [olResults, setOlResults] = useState<OpenLibraryBook[]>([]);
  const [olLoading, setOlLoading] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const openPalette = (): void => {
    setQuery("");
    setOlResults([]);
    setSelectedIndex(0);
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  const closePalette = (): void => {
    setIsOpen(false);
    setQuery("");
    setOlResults([]);
  };

  // Perform live search suggestion fetching from Open Library as user types
  const performLiveSearch = useCallback((q: string): void => {
    const trimmed = q.trim();
    if (!trimmed) {
      setOlResults([]);
      setOlLoading(false);
      return;
    }

    setOlLoading(true);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await searchOpenLibrary(trimmed, { limit: 8 });
        setOlResults(res.books);
      } catch {
        setOlResults([]);
      } finally {
        setOlLoading(false);
      }
    }, 280);
  }, []);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setQuery("");
            setOlResults([]);
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 60);
            return true;
          }
          return false;
        });
      }
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "Escape") {
        closePalette();
      }
    };

    const handleOpenTrigger = (): void => openPalette();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenTrigger);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenTrigger);
    };
  }, []);

  const handleQueryChange = (val: string): void => {
    setQuery(val);
    setSelectedIndex(0);
    performLiveSearch(val);
  };

  // Generate Google-style autocomplete query suggestions from local database & popular queries
  const autocompleteSuggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const suggestions: { text: string; type: "search" | "author" | "title" }[] =
      [];

    // 1. Primary search query suggestion
    suggestions.push({
      text: query.trim(),
      type: "search",
    });

    // 2. Author suggestions matching input
    const seenAuthors = new Set<string>();
    allBooks.forEach((b) => {
      if (
        b.author.toLowerCase().includes(trimmed) &&
        !seenAuthors.has(b.author.toLowerCase())
      ) {
        seenAuthors.add(b.author.toLowerCase());
        suggestions.push({ text: b.author, type: "author" });
      }
    });

    // 3. Title suggestions matching input
    const seenTitles = new Set<string>();
    allBooks.forEach((b) => {
      if (
        b.bookName.toLowerCase().includes(trimmed) &&
        !seenTitles.has(b.bookName.toLowerCase())
      ) {
        seenTitles.add(b.bookName.toLowerCase());
        suggestions.push({ text: b.bookName, type: "title" });
      }
    });

    return suggestions.slice(0, 5);
  }, [query, allBooks]);

  const handleSelectSuggestion = (text: string): void => {
    setQuery(text);
    performLiveSearch(text);
    inputRef.current?.focus();
  };

  const handleSelectBook = (workKeyOrId: string | number): void => {
    setIsOpen(false);
    const id = String(workKeyOrId).replace("/works/", "");
    router.push(`/books/${id}`);
  };

  const handleNavigate = (path: string): void => {
    setIsOpen(false);
    router.push(path);
  };

  // Total selectable items for ArrowUp/ArrowDown
  const totalItems = autocompleteSuggestions.length + olResults.length;

  const handleInputKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (totalItems > 0) {
        setSelectedIndex((prev) => (prev + 1) % totalItems);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (totalItems > 0) {
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (
        autocompleteSuggestions.length > 0 &&
        selectedIndex < autocompleteSuggestions.length
      ) {
        handleSelectSuggestion(autocompleteSuggestions[selectedIndex].text);
      } else if (olResults.length > 0) {
        const bookIndex = selectedIndex - autocompleteSuggestions.length;
        const book = olResults[bookIndex >= 0 ? bookIndex : 0];
        if (book) {
          handleSelectBook(book.key);
        }
      } else if (query.trim()) {
        // Direct search
        setIsOpen(false);
        router.push(`/#library`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={closePalette}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-[#DCC8B6] bg-background shadow-2xl animate-in zoom-in-95 duration-150 text-foreground">
        {/* Search Header */}
        <div className="flex items-center border-b border-border px-4 py-3.5 sm:px-5 bg-white">
          <Search className="h-5 w-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type to search books, authors, or topics..."
            className="flex-1 bg-transparent px-3.5 text-sm sm:text-base font-semibold text-foreground placeholder-[#8B6E5A]/70 focus:outline-hidden"
            autoFocus
          />
          {olLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-primary mr-2 shrink-0" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="mr-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-border-subtle text-[10px] font-bold text-[#5B3315] hover:bg-[#E2D0C0] transition"
              title="Clear text"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            onClick={closePalette}
            className="rounded-xl p-1 text-[#8B6E5A] hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
          {/* EMPTY STATE: Do not show hardcoded books. Show Google-style search prompts & topics */}
          {!query.trim() ? (
            <div className="py-2 px-1">
              {/* Quick Navigation Links */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8B6E5A] mb-2.5">
                  Quick Navigation
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavigate("/plan-to-read")}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3 text-left hover:border-primary hover:bg-[#FAF4EE] transition"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                      <BookMarked className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        My Bookshelf
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        View tracked books &amp; reading list
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate("/journeys")}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3 text-left hover:border-primary hover:bg-[#FAF4EE] transition"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                      <Compass className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Reading Journeys
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Curated thematic book trails
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE TYPING: Google-style Search Suggestions as you type */
            <div className="space-y-4">
              {/* 1. Autocomplete Search Query Suggestions */}
              {autocompleteSuggestions.length > 0 && (
                <div>
                  <p className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-[#8B6E5A] mb-1.5">
                    Search Suggestions
                  </p>
                  <ul className="space-y-1">
                    {autocompleteSuggestions.map((item, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <li key={`${item.type}-${item.text}`}>
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(item.text)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs sm:text-sm font-semibold transition ${
                              isSelected
                                ? "bg-muted text-primary"
                                : "text-foreground hover:bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {item.type === "author" ? (
                                <User className="h-3.5 w-3.5 text-primary shrink-0" />
                              ) : item.type === "title" ? (
                                <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                              ) : (
                                <Search className="h-3.5 w-3.5 text-[#8B6E5A] shrink-0" />
                              )}
                              <span className="truncate">
                                {item.text}
                                {item.type === "author" && (
                                  <span className="ml-1.5 text-[10px] font-bold text-[#8B6E5A] uppercase">
                                    (Author)
                                  </span>
                                )}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#8B6E5A] shrink-0 flex items-center gap-1 opacity-75">
                              <span>Search</span>
                              <CornerDownLeft className="h-3 w-3" />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* 2. Live Matching Book Results */}
              <div>
                <p className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-[#8B6E5A] mb-1.5">
                  Matching Books
                </p>

                {olLoading && olResults.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8B6E5A]">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
                    <span>Searching Open Library...</span>
                  </div>
                ) : olResults.length > 0 ? (
                  <ul className="space-y-1.5">
                    {olResults.map((book, idx) => {
                      const itemIdx = autocompleteSuggestions.length + idx;
                      const isSelected = selectedIndex === itemIdx;
                      return (
                        <li key={book.key}>
                          <button
                            type="button"
                            onClick={() => handleSelectBook(book.key)}
                            onMouseEnter={() => setSelectedIndex(itemIdx)}
                            className={`flex w-full items-center justify-between rounded-2xl p-2.5 text-left transition ${
                              isSelected
                                ? "bg-muted ring-1 ring-[#DCC8B6]"
                                : "hover:bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <AestheticBookCover
                                title={book.title}
                                author={book.authorName}
                                coverUrl={book.coverUrl}
                                category={book.category}
                                size="compact"
                                className="h-13! w-9! shrink-0"
                              />

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs sm:text-sm font-bold text-foreground">
                                  {book.title}
                                </p>
                                <p className="truncate text-xs font-medium text-muted-foreground mt-0.5">
                                  By {book.authorName}
                                  {book.firstPublishYear && (
                                    <span> &bull; {book.firstPublishYear}</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 pl-3">
                              <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#7A4B22] ring-1 ring-border">
                                {book.category || "Book"}
                              </span>
                              <ArrowRight className="h-4 w-4 text-primary" />
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  !olLoading && (
                    <div className="py-6 text-center text-xs text-[#8B6E5A] rounded-2xl border border-dashed border-border bg-white/50">
                      <p className="font-semibold text-sm text-foreground">
                        No direct book matches found
                      </p>
                      <p className="mt-1">
                        Try searching with author surname or title keyword.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between border-t border-border bg-[#FAF4EE] px-4 py-2.5 text-[11px] text-muted-foreground">
          <div className="hidden sm:flex items-center gap-3">
            <span>
              <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold shadow-2xs">
                ↑
              </kbd>{" "}
              <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold shadow-2xs">
                ↓
              </kbd>{" "}
              to navigate
            </span>
            <span>
              <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold shadow-2xs">
                ↵
              </kbd>{" "}
              to select
            </span>
            <span>
              <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold shadow-2xs">
                esc
              </kbd>{" "}
              to close
            </span>
          </div>

          <span className="text-[10px] font-bold text-primary w-full sm:w-auto text-center sm:text-right">
            Open Library Live Suggestions
          </span>
        </div>
      </div>
    </div>
  );
};
