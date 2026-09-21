"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Compass, BookMarked, Coffee, ArrowRight, X } from "lucide-react";
import { getAllBooks } from "@/lib/books";
import type { Book } from "@/types/book.type";

export const CommandPalette = (): ReactElement | null => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [allBooks] = useState<Book[]>(() => getAllBooks());

  const openPalette = (): void => {
    setQuery("");
    setSelectedIndex(0);
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closePalette = (): void => {
    setIsOpen(false);
    setQuery("");
  };

  // Global hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
            return true;
          }
          return false;
        });
      }
      // '/' key when not focused in an input
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

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default: Top curated recommendations
      return allBooks.slice(0, 7);
    }

    const tokens = q.split(/\s+/).filter(Boolean);
    return allBooks
      .filter((b) => {
        const searchable = [
          b.bookName,
          b.author,
          b.category,
          b.publisher,
          b.review,
          ...(b.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        return tokens.every((token) => searchable.includes(token));
      })
      .slice(0, 8);
  }, [allBooks, query]);

  const handleSelectBook = (bookId: number): void => {
    setIsOpen(false);
    router.push(`/books/${bookId}`);
  };

  const handleNavigate = (path: string): void => {
    setIsOpen(false);
    router.push(path);
  };

  const handleKeyDownInMenu = (e: React.KeyboardEvent): void => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredResults.length - 1) : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredResults[selectedIndex];
      if (selected) {
        handleSelectBook(selected.bookId);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-[#DCC8B6] bg-[#FAF7F2] shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center border-b border-[#EADBCE] px-4 py-3.5 sm:px-5">
          <Search className="h-5 w-5 text-[#8B5A2B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInMenu}
            placeholder="Search across 100 books, master authors, philosophy, or quotes..."
            className="flex-1 bg-transparent px-3.5 text-sm font-semibold text-[#241812] placeholder-[#8B6E5A] focus:outline-hidden"
          />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-xl p-1 text-[#8B6E5A] hover:bg-[#F5ECE3] hover:text-[#241812]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Navigation Chips */}
        {!query && (
          <div className="flex items-center gap-2 border-b border-[#EADBCE]/60 bg-white/60 px-4 py-2 text-xs">
            <span className="text-[11px] font-bold text-[#8B6E5A]">Quick Aisles:</span>
            <button
              type="button"
              onClick={() => handleNavigate("/journeys")}
              className="flex items-center gap-1 rounded-lg border border-[#EADBCE] bg-white px-2.5 py-1 font-semibold text-[#4A2E18] transition hover:border-[#8B5A2B]"
            >
              <Compass className="h-3 w-3 text-[#8B5A2B]" />
              <span>Reading Journeys</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("/plan-to-read")}
              className="flex items-center gap-1 rounded-lg border border-[#EADBCE] bg-white px-2.5 py-1 font-semibold text-[#4A2E18] transition hover:border-[#8B5A2B]"
            >
              <BookMarked className="h-3 w-3 text-[#8B5A2B]" />
              <span>Plan to Read</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new CustomEvent("open-ambient-room"));
              }}
              className="flex items-center gap-1 rounded-lg border border-[#EADBCE] bg-white px-2.5 py-1 font-semibold text-[#4A2E18] transition hover:border-[#8B5A2B]"
            >
              <Coffee className="h-3 w-3 text-[#8B5A2B]" />
              <span>Ambient Room</span>
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3">
          {filteredResults.length > 0 ? (
            <ul className="space-y-1">
              {filteredResults.map((book, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <li key={book.bookId}>
                    <button
                      type="button"
                      onClick={() => handleSelectBook(book.bookId)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between rounded-2xl p-2.5 text-left transition ${
                        isSelected
                          ? "bg-[#F5ECE3] ring-1 ring-[#DCC8B6]"
                          : "hover:bg-white/80"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-[#FAF7F2] p-0.5 shadow-2xs">
                          <Image
                            src={book.image}
                            alt={book.bookName}
                            fill
                            sizes="36px"
                            className="object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#241812]">
                            {book.bookName}
                          </p>
                          <p className="truncate text-[11px] font-medium text-[#6F5B50]">
                            By {book.author}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pl-3">
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#7A4B22] ring-1 ring-[#EADBCE]">
                          {book.category}
                        </span>
                        <div className="flex items-center gap-0.5 text-xs font-bold text-[#241812]">
                          <span className="text-[#D48B1B]">★</span>
                          <span>{book.rating}</span>
                        </div>
                        {isSelected && (
                          <ArrowRight className="h-4 w-4 text-[#8B5A2B]" />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-10 text-center text-xs text-[#8B6E5A]">
              <p className="font-semibold text-sm text-[#241812]">
                No books matching &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1">
                Try searching by author name (e.g. Kafka, Ghazali, Tagore) or genre.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-[#EADBCE] bg-white/50 px-4 py-2 text-[11px] text-[#8B6E5A]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-2xs">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-2xs">
                Enter
              </kbd>{" "}
              Open Book
            </span>
            <span>
              <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-2xs">
                Esc
              </kbd>{" "}
              Close
            </span>
          </div>
          <span>Book Vibe Spotlight</span>
        </div>
      </div>
    </div>
  );
};
