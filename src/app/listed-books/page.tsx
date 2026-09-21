"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import BookCard from "@/components/shared/BookCard";
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

const ListedBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortValue>("default");
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/booksData.json")
      .then((res) => res.json())
      .then((data: Book[]) => setBooks(data));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.category));
    return ["All", ...Array.from(set)];
  }, [books]);

  // Robust multi-word search & category filtering
  const filteredBooks = useMemo(() => {
    const tokens = searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return books
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
  }, [books, selectedCategory, searchQuery, sortBy]);

  const activeSort =
    SORT_OPTIONS.find((opt) => opt.value === sortBy) || SORT_OPTIONS[0];

  return (
    <main className="min-h-screen px-4 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F5ECE3] px-4 py-1.5 text-xs font-semibold text-[#7A4B22] ring-1 ring-[#E8D5C4] md:text-sm">
            ☕ Complete Library Catalog
          </span>

          <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-[#241812] md:text-5xl">
            All <span className="text-[#8B5A2B]">Listed Books</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B5141] md:text-base">
            Explore our complete curated catalog of {books.length} existential
            and philosophical classics, essays, and literary masterpieces.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 md:text-sm ${
                  selectedCategory === cat
                    ? "bg-[#8B5A2B] text-white shadow-md shadow-[#8B5A2B]/20"
                    : "border border-[#DCC8B6] bg-white text-[#5A381E] hover:border-[#8B5A2B] hover:text-[#8B5A2B]"
                }`}
              >
                {cat} {cat === "All" && `(${books.length})`}
              </button>
            ))}
          </div>

          {/* Controls: Search & Custom Styled Sort Dropdown */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#9B887D]">
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
                className="w-full rounded-xl border border-[#DCC8B6] bg-white py-2.5 pl-10 pr-9 text-sm font-medium text-[#241812] placeholder-[#9B887D] shadow-xs transition duration-200 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/20"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9B887D] hover:text-[#4A2E18]"
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

            {/* Styled Sort Dropdown */}
            <div ref={dropdownRef} className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setSortOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-[#DCC8B6] bg-white px-4 py-2.5 text-sm font-semibold text-[#3D281C] shadow-xs transition duration-200 hover:border-[#8B5A2B] hover:bg-[#F5ECE3]/40 focus:border-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/20 sm:w-auto"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#8B5A2B]">{activeSort.icon}</span>
                  <span className="text-[#9B887D] text-xs uppercase tracking-wider font-medium">
                    Sort:
                  </span>
                  <span className="text-[#241812]">{activeSort.label}</span>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-[#9B887D] transition-transform duration-200 ${
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

              {/* Dropdown Menu Panel */}
              {sortOpen && (
                <div className="absolute right-0 z-30 mt-2 w-full min-w-56 rounded-2xl border border-[#EADBCE] bg-white p-2 shadow-xl ring-1 ring-black/5 sm:w-60">
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9B887D]">
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

        {/* Count banner */}
        <div className="mb-6 flex items-center justify-between text-xs text-[#7A6A60] md:text-sm">
          <span>
            Showing{" "}
            <strong className="text-[#241812]">{filteredBooks.length}</strong>{" "}
            of <strong className="text-[#241812]">{books.length}</strong> books
            {searchQuery && (
              <span className="ml-1 text-[#8B5A2B] font-medium">
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

        {/* Books Grid - 42 books in 3 columns */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book, index) => (
              <BookCard key={book.bookId} book={book} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#EADBCE] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5ECE3] text-2xl text-[#8B5A2B]">
              ☕
            </div>
            <p className="text-base font-bold text-[#241812]">No books found</p>
            <p className="mt-1 text-sm text-[#7A6A60]">
              We couldn&apos;t find anything matching &ldquo;{searchQuery}
              &rdquo;. Try searching by author name, title keyword, or tag.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSortBy("default");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8B5A2B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6F4420]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ListedBooksPage;
