"use client";

import { useEffect, useState, useMemo } from "react";
import BookCard from "@/components/shared/BookCard";
import type { Book } from "@/types/book.type";

const ListedBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    fetch("/booksData.json")
      .then((res) => res.json())
      .then((data: Book[]) => setBooks(data));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.category));
    return ["All", ...Array.from(set)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesCategory =
          selectedCategory === "All" || book.category === selectedCategory;
        const matchesSearch =
          book.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          );
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "pages") return b.totalPages - a.totalPages;
        if (sortBy === "year") return b.yearOfPublishing - a.yearOfPublishing;
        return a.bookId - b.bookId;
      });
  }, [books, selectedCategory, searchQuery, sortBy]);

  return (
    <main className="min-h-screen px-4 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <span className="mb-3 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100">
            Listed Books Collection
          </span>

          <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            All <span className="text-emerald-600">Listed Books</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
            Explore our complete curated catalog of {books.length} existential
            and philosophical classics, essays, and literary masterpieces.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 md:text-sm ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                {cat} {cat === "All" && `(${books.length})`}
              </button>
            ))}
          </div>

          {/* Controls: Search & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64 md:flex-initial">
              <input
                type="text"
                placeholder="Search by title, author, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="default">Default Order</option>
              <option value="rating">Highest Rated</option>
              <option value="pages">Most Pages</option>
              <option value="year">Publication Year</option>
            </select>
          </div>
        </div>

        {/* Count banner */}
        <div className="mb-6 flex items-center justify-between text-xs text-gray-500 md:text-sm">
          <span>
            Showing <strong className="text-gray-900">{filteredBooks.length}</strong>{" "}
            of <strong className="text-gray-900">{books.length}</strong> books
          </span>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book, index) => (
              <BookCard key={book.bookId} book={book} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-base font-semibold text-gray-800">
              No books matched your filter
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSortBy("default");
              }}
              className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
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
