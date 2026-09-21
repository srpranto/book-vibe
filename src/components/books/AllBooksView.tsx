"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { ReactElement } from "react";
import BookCard from "@/components/ui/BookCard";
import type { Book } from "@/types/book.type";

const SORT_OPTIONS = [
  { value: "default", label: "Default Order", icon: "▤" },
  { value: "rating-desc", label: "Highest Rated", icon: "★" },
  { value: "rating-asc", label: "Lowest Rated", icon: "☆" },
  { value: "pages-desc", label: "Most Pages", icon: "📖" },
  { value: "pages-asc", label: "Fewest Pages", icon: "📄" },
  { value: "year-desc", label: "Newest Published", icon: "📅" },
  { value: "year-asc", label: "Oldest Published", icon: "⏳" },
  { value: "title-asc", label: "Title (A to Z)", icon: "🔤" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const GENRE_ICONS: Record<string, string> = {
  All: "📚",
  Classic: "📜",
  Philosophy: "🧠",
  Philosophical: "💭",
  Fiction: "📖",
  Literature: "🖋️",
  Drama: "🎭",
  "Historical Fiction": "🏛️",
  "Magical Realism": "✨",
  Allegory: "⚖️",
  "Social Drama": "🌾",
  "War Fiction": "⚔️",
  Psychological: "🧩",
  "Young Adult": "🎒",
  Islamic: "🕌",
};

const BOOKS_PER_PAGE = 20;

const getPageNumbers = (
  current: number,
  total: number,
): (number | string)[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }
  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
};

interface AllBooksViewProps {
  initialBooks: Book[];
}

const AllBooksView = ({ initialBooks }: AllBooksViewProps): ReactElement => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortValue>("default");
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [genreOpen, setGenreOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const genreDropdownRef = useRef<HTMLDivElement>(null);
  const catalogSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (e.target instanceof Node) {
        if (
          sortDropdownRef.current &&
          !sortDropdownRef.current.contains(e.target)
        ) {
          setSortOpen(false);
        }
        if (
          genreDropdownRef.current &&
          !genreDropdownRef.current.contains(e.target)
        ) {
          setGenreOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialBooks.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, [initialBooks]);

  const genreList = useMemo(() => {
    const unique = Array.from(new Set(initialBooks.map((b) => b.category)));
    return unique.sort(
      (a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0),
    );
  }, [initialBooks, categoryCounts]);

  const filteredBooks = useMemo(() => {
    const tokens = searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return initialBooks
      .filter((book) => {
        const matchesCategory =
          selectedCategory === "All" ||
          book.category.toLowerCase() === selectedCategory.toLowerCase();

        const searchable = [
          book.bookName,
          book.author,
          book.category,
          book.publisher,
          ...(book.tags || []),
          book.review,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          tokens.length === 0 ||
          tokens.every((token) => searchable.includes(token));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "rating-desc":
            return b.rating - a.rating;
          case "rating-asc":
            return a.rating - b.rating;
          case "pages-desc":
            return b.totalPages - a.totalPages;
          case "pages-asc":
            return a.totalPages - b.totalPages;
          case "year-desc":
            return b.yearOfPublishing - a.yearOfPublishing;
          case "year-asc":
            return a.yearOfPublishing - b.yearOfPublishing;
          case "title-asc":
            return a.bookName.localeCompare(b.bookName);
          default:
            return a.bookId - b.bookId;
        }
      });
  }, [initialBooks, selectedCategory, searchQuery, sortBy]);

  const activeSort =
    SORT_OPTIONS.find((opt) => opt.value === sortBy) || SORT_OPTIONS[0];

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / BOOKS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageBooks = filteredBooks.slice(
    (safeCurrentPage - 1) * BOOKS_PER_PAGE,
    safeCurrentPage * BOOKS_PER_PAGE,
  );

  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    catalogSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const pageNumbers = getPageNumbers(safeCurrentPage, totalPages);

  return (
    <div
      ref={catalogSectionRef}
      className="container mx-auto max-w-7xl scroll-mt-24"
    >
      <div className="mb-10 text-center md:text-left">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F5ECE3] px-4 py-1.5 text-xs font-semibold text-[#7A4B22] ring-1 ring-[#E8D5C4] md:text-sm">
          ☕ The Complete Collection
        </span>

        <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-[#241812] md:text-5xl">
          All <span className="text-[#8B5A2B]">Books</span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A3528] md:text-base">
          Explore our curated catalog of {initialBooks.length} existential and
          philosophical classics, timeless essays, and literary masterpieces.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 md:text-sm ${
              selectedCategory === "All"
                ? "bg-[#8B5A2B] font-bold text-white shadow-md shadow-[#8B5A2B]/20"
                : "border border-[#DCC8B6] bg-white text-[#4A2E18] hover:border-[#8B5A2B] hover:text-[#8B5A2B]"
            }`}
          >
            <span>📚</span>
            <span>All ({initialBooks.length})</span>
          </button>

          <div ref={genreDropdownRef} className="relative">
            {selectedCategory === "All" ? (
              <button
                type="button"
                onClick={() => setGenreOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#DCC8B6] bg-white px-4 py-2 text-xs font-semibold text-[#4A2E18] shadow-xs transition duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3]/50 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/20 md:text-sm"
                aria-haspopup="listbox"
                aria-expanded={genreOpen}
              >
                <span className="text-[#8B5A2B]">🏷️</span>
                <span>Filter by Genre</span>
                <span className="rounded-full bg-[#F5ECE3] px-2 py-0.5 text-xs font-bold text-[#7A4B22]">
                  {genreList.length}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-[#6F5B50] transition-transform duration-200 ${
                    genreOpen ? "rotate-180 text-[#8B5A2B]" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ) : (
              <div className="inline-flex items-center rounded-xl bg-[#8B5A2B] text-white shadow-md shadow-[#8B5A2B]/20">
                <button
                  type="button"
                  onClick={() => setGenreOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-l-xl py-2 pl-4 pr-2 text-xs font-bold transition hover:bg-[#6F4420] md:text-sm"
                  aria-haspopup="listbox"
                  aria-expanded={genreOpen}
                >
                  <span>{GENRE_ICONS[selectedCategory] || "🏷️"}</span>
                  <span>Genre: {selectedCategory}</span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white">
                    {categoryCounts[selectedCategory] || 0}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-white/80 transition-transform duration-200 ${
                      genreOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="flex h-full items-center justify-center rounded-r-xl border-l border-white/20 px-2.5 py-2 text-xs font-bold text-white/90 transition hover:bg-[#6F4420] hover:text-white"
                  title="Clear genre filter"
                >
                  ✕
                </button>
              </div>
            )}

            {genreOpen && (
              <div className="absolute left-0 z-30 mt-2 w-72 rounded-2xl border border-[#EADBCE] bg-white p-2 shadow-xl ring-1 ring-black/5 sm:w-80">
                <div className="flex items-center justify-between border-b border-[#F0E4D8] px-3 pb-2 pt-1 text-xs font-extrabold uppercase tracking-wider text-[#6F5B50]">
                  <span>Select Literary Genre</span>
                  <span className="font-bold text-[#8B5A2B]">
                    ☕ {genreList.length} Genres
                  </span>
                </div>

                <div className="max-h-80 space-y-1 overflow-y-auto pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All");
                      setGenreOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition duration-150 ${
                      selectedCategory === "All"
                        ? "bg-[#F5ECE3] font-semibold text-[#7A4B22]"
                        : "text-[#5A381E] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">📚</span>
                      <span>All Genres</span>
                    </span>
                    <span className="rounded-full bg-[#EFE4D6] px-2 py-0.5 text-xs font-bold text-[#5B3315]">
                      {initialBooks.length}
                    </span>
                  </button>

                  {genreList.map((genre) => {
                    const isSelected = selectedCategory === genre;
                    const count = categoryCounts[genre] || 0;
                    const icon = GENRE_ICONS[genre] || "🏷️";
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(genre);
                          setGenreOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition duration-150 ${
                          isSelected
                            ? "bg-[#F5ECE3] font-semibold text-[#7A4B22]"
                            : "text-[#5A381E] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base">{icon}</span>
                          <span>{genre}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[#EFE4D6] px-2 py-0.5 text-xs font-bold text-[#5B3315]">
                            {count}
                          </span>
                          {isSelected && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[#8B5A2B]"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6F5B50]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search by title, author, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#DCC8B6] bg-white py-2.5 pl-10 pr-9 text-sm font-semibold text-[#241812] placeholder-[#735D50] shadow-xs transition duration-200 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/20"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6F5B50] hover:text-[#241812]"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          <div ref={sortDropdownRef} className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-[#DCC8B6] bg-white px-4 py-2.5 text-sm font-semibold text-[#241812] shadow-xs transition duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3]/40 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/20 sm:w-auto"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
            >
              <div className="flex items-center gap-2">
                <span className="text-[#8B5A2B]">{activeSort.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6F5B50]">
                  Sort:
                </span>
                <span className="text-[#241812]">{activeSort.label}</span>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-[#6F5B50] transition-transform duration-200 ${
                  sortOpen ? "rotate-180 text-[#8B5A2B]" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {sortOpen && (
              <div className="absolute right-0 z-30 mt-2 w-full min-w-56 rounded-2xl border border-[#EADBCE] bg-white p-2 shadow-xl ring-1 ring-black/5 sm:w-60">
                <div className="px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#6F5B50]">
                  Sort books by
                </div>
                <div className="space-y-1">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition duration-150 ${
                        sortBy === option.value
                          ? "bg-[#F5ECE3] text-[#7A4B22] font-semibold"
                          : "text-[#5A381E] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{option.icon}</span>
                        <span>{option.label}</span>
                      </span>

                      {sortBy === option.value && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#8B5A2B]"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between text-xs font-medium text-[#4A3528] md:text-sm">
        <span>
          Showing{" "}
          <strong className="text-[#241812]">
            {Math.min(
              (currentPage - 1) * BOOKS_PER_PAGE + 1,
              filteredBooks.length,
            )}
            {filteredBooks.length > 1 &&
              `–${Math.min(currentPage * BOOKS_PER_PAGE, filteredBooks.length)}`}
          </strong>{" "}
          of <strong className="text-[#241812]">{filteredBooks.length}</strong>{" "}
          books
          {selectedCategory !== "All" && (
            <span className="ml-1 font-semibold text-[#8B5A2B]">
              in genre &ldquo;{selectedCategory}&rdquo;
            </span>
          )}
          {searchQuery && (
            <span className="ml-1 font-semibold text-[#8B5A2B]">
              matching &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </span>

        {(searchQuery ||
          selectedCategory !== "All" ||
          sortBy !== "default") && (
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setSortBy("default");
            }}
            className="font-medium text-[#8B5A2B] hover:text-[#6F4420] hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {filteredBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {pageBooks.map((book, index) => (
              <BookCard key={book.bookId} book={book} index={index} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Book catalog pagination"
              className="mt-10 flex flex-col items-center gap-4"
            >
              <p className="text-xs font-medium text-[#6F5B50]">
                Page{" "}
                <span className="font-extrabold text-[#241812]">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-extrabold text-[#241812]">
                  {totalPages}
                </span>
              </p>

              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-sm font-bold text-[#4A2E18] shadow-xs transition-all duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#DCC8B6] disabled:hover:bg-white disabled:hover:text-[#4A2E18]"
                >
                  ←
                </button>

                {pageNumbers.map((page, idx) => {
                  if (typeof page === "string") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="flex h-9 w-9 items-center justify-center text-sm font-bold text-[#8B6E5A]"
                      >
                        …
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                      aria-label={`Go to page ${page}`}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${
                        currentPage === page
                          ? "bg-[#8B5A2B] text-white shadow-md shadow-[#8B5A2B]/25"
                          : "border border-[#DCC8B6] bg-white text-[#4A2E18] shadow-xs hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-sm font-bold text-[#4A2E18] shadow-xs transition-all duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#DCC8B6] disabled:hover:bg-white disabled:hover:text-[#4A2E18]"
                >
                  →
                </button>
              </div>

              {totalPages > 5 && (
                <div className="flex items-center gap-2 text-xs font-medium text-[#6F5B50]">
                  <span>Jump to</span>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          className={`h-6 min-w-6 rounded-md px-1.5 text-xs font-bold transition-all duration-150 ${
                            currentPage === p
                              ? "bg-[#8B5A2B] text-white"
                              : "bg-[#F5ECE3] text-[#5B3315] hover:bg-[#E8D5C4]"
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-[#EADBCE] bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5ECE3] text-2xl text-[#8B5A2B]">
            ☕
          </div>
          <p className="text-base font-bold text-[#241812]">No books found</p>
          <p className="mt-1 text-sm font-medium text-[#4A3528]">
            We couldn&apos;t find anything matching &ldquo;{searchQuery}
            &rdquo;. Try searching by author name, title keyword, or tag.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setSortBy("default");
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8B5A2B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#6F4420] active:scale-[0.98]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllBooksView;
