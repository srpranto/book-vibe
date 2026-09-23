"use client";

import { useState, useMemo, useCallback } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookMarked,
  BookOpen,
  Library,
  Search,
  ArrowRight,
  LayoutGrid,
  List,
  Columns,
  Compass,
  Trophy,
  Calendar as CalendarIcon,
  PenLine,
} from "lucide-react";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import { useCustomBooks } from "@/context/CustomBooksContext";
import { useMarginalia } from "@/context/MarginaliaContext";
import ReadingGoalCard from "@/components/books/ReadingGoalCard";
import ReadingStatsInsights from "@/components/books/ReadingStatsInsights";
import { JourneysView } from "@/components/journeys/JourneysView";
import { BookReviewModal } from "@/components/books/BookReviewModal";
import { ReviewsJournalView } from "@/components/books/ReviewsJournalView";
import { READING_JOURNEYS } from "@/lib/readingJourneys";
import {
  READING_STATUS_OPTIONS,
  type ReadingStatusValue,
} from "@/types/reading-status.type";
import type { Book } from "@/types/book.type";
import { AestheticBookCover } from "@/components/ui/AestheticBookCover";
import { BookShelfButton } from "@/components/books/BookShelfButton";
import { Button } from "@/components/ui/button";

interface PlanToReadViewProps {
  allBooks: Book[];
}

type DashboardSection = "shelf" | "journal" | "journeys" | "goals";
type FilterTab =
  | "all"
  | "reading"
  | "plan_to_read"
  | "completed"
  | "on_hold"
  | "dropped"
  | "reviewed";
type ViewMode = "bookshelf" | "grid" | "list";

interface TrackedBook extends Book {
  currentStatus: ReadingStatusValue;
}

const PlanToReadView = ({ allBooks }: PlanToReadViewProps): ReactElement => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") as DashboardSection;
  const activeSection: DashboardSection = [
    "shelf",
    "journal",
    "journeys",
    "goals",
  ].includes(tabParam)
    ? tabParam
    : "shelf";

  const initialFilter = (searchParams.get("filter") as FilterTab) || "all";
  const initialQuery = searchParams.get("q") || "";

  const { statusMap, isMounted: isReadingStatusMounted } = useReadingStatus();
  const { customBooks, isMounted: isCustomBooksMounted } = useCustomBooks();
  const { marginaliaMap } = useMarginalia();

  const [activeTab, setActiveTab] = useState<FilterTab>(
    [
      "all",
      "reading",
      "plan_to_read",
      "completed",
      "on_hold",
      "dropped",
      "reviewed",
    ].includes(initialFilter)
      ? initialFilter
      : "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [viewMode, setViewMode] = useState<ViewMode>("bookshelf");

  const isMounted = isReadingStatusMounted && isCustomBooksMounted;

  const handleSectionSwitch = (sec: DashboardSection): void => {
    const params = new URLSearchParams(window.location.search);
    if (sec === "shelf") {
      params.delete("tab");
    } else {
      params.set("tab", sec);
    }
    const qStr = params.toString();
    router.replace(qStr ? `?${qStr}` : window.location.pathname, {
      scroll: false,
    });
  };

  const updateUrlParams = useCallback(
    (tab: FilterTab, query: string) => {
      const params = new URLSearchParams(window.location.search);
      if (tab !== "all") params.set("filter", tab);
      else params.delete("filter");
      if (query.trim()) params.set("q", query.trim());
      else params.delete("q");
      const queryString = params.toString();
      router.replace(
        queryString ? `?${queryString}` : window.location.pathname,
        { scroll: false },
      );
    },
    [router],
  );

  const handleTabSelect = (tab: FilterTab): void => {
    setActiveTab(tab);
    updateUrlParams(tab, searchQuery);
  };

  const handleSearchChange = (val: string): void => {
    setSearchQuery(val);
    updateUrlParams(activeTab, val);
  };

  const combinedCatalog = useMemo(() => {
    const seen = new Set<number>();
    const result: Book[] = [];
    allBooks.forEach((b) => {
      seen.add(b.bookId);
      result.push(b);
    });
    customBooks.forEach((b) => {
      if (!seen.has(b.bookId)) {
        seen.add(b.bookId);
        result.push(b);
      }
    });
    return result;
  }, [allBooks, customBooks]);

  const trackedBooks: TrackedBook[] = useMemo(() => {
    return combinedCatalog.flatMap((b) => {
      const currentStatus = statusMap[b.bookId];
      if (currentStatus) {
        return [{ ...b, currentStatus }];
      }
      return [];
    });
  }, [combinedCatalog, statusMap]);

  const reviewedCount = useMemo(() => {
    return combinedCatalog.filter((b) => {
      const entry = marginaliaMap[b.bookId];
      if (!entry) return false;
      return Boolean(
        (entry.userRating && entry.userRating > 0) ||
        (entry.notes && entry.notes.trim().length > 0) ||
        (entry.favoriteQuotes && entry.favoriteQuotes.length > 0) ||
        entry.finishedDate ||
        (entry.currentPage && entry.currentPage > 0),
      );
    }).length;
  }, [combinedCatalog, marginaliaMap]);

  const counts = useMemo(() => {
    return {
      all: trackedBooks.length,
      reading: trackedBooks.filter((b) => b.currentStatus === "reading").length,
      plan_to_read: trackedBooks.filter(
        (b) => b.currentStatus === "plan_to_read",
      ).length,
      completed: trackedBooks.filter((b) => b.currentStatus === "completed")
        .length,
      on_hold: trackedBooks.filter((b) => b.currentStatus === "on_hold").length,
      dropped: trackedBooks.filter((b) => b.currentStatus === "dropped").length,
      reviewed: trackedBooks.filter((b) => {
        const entry = marginaliaMap[b.bookId];
        if (!entry) return false;
        return Boolean(
          (entry.userRating && entry.userRating > 0) ||
          (entry.notes && entry.notes.trim().length > 0) ||
          (entry.favoriteQuotes && entry.favoriteQuotes.length > 0) ||
          entry.finishedDate ||
          (entry.currentPage && entry.currentPage > 0),
        );
      }).length,
    };
  }, [trackedBooks, marginaliaMap]);

  const filteredBooks = useMemo(() => {
    return trackedBooks.filter((book) => {
      if (activeTab === "reading" && book.currentStatus !== "reading")
        return false;
      if (activeTab === "plan_to_read" && book.currentStatus !== "plan_to_read")
        return false;
      if (activeTab === "completed" && book.currentStatus !== "completed")
        return false;
      if (activeTab === "on_hold" && book.currentStatus !== "on_hold")
        return false;
      if (activeTab === "dropped" && book.currentStatus !== "dropped")
        return false;
      if (activeTab === "reviewed") {
        const entry = marginaliaMap[book.bookId];
        const hasEntry =
          entry &&
          Boolean(
            (entry.userRating && entry.userRating > 0) ||
            (entry.notes && entry.notes.trim().length > 0) ||
            (entry.favoriteQuotes && entry.favoriteQuotes.length > 0) ||
            entry.finishedDate ||
            (entry.currentPage && entry.currentPage > 0),
          );
        if (!hasEntry) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = book.bookName.toLowerCase().includes(q);
        const matchesAuthor = book.author.toLowerCase().includes(q);
        const matchesCat = book.category.toLowerCase().includes(q);
        return matchesName || matchesAuthor || matchesCat;
      }
      return true;
    });
  }, [trackedBooks, activeTab, searchQuery, marginaliaMap]);

  const getBookHref = (book: Book): string => {
    if (book.workId) return `/books/${book.workId}`;
    return `/books/${book.bookId}`;
  };

  if (!isMounted) {
    return (
      <div className="container mx-auto max-w-7xl py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm font-bold text-[#8B6E5A]">
          Arranging your personal bookshelf...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-6 pb-24">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D5C4] bg-muted px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#7A4B22]">
            <BookMarked className="h-3.5 w-3.5" />
            <span>Personal Bookshelf</span>
          </div>

          <h1 className="mt-3 text-2xl min-[380px]:text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            My Shelf &amp; <span className="text-primary">Journeys</span>
          </h1>

          <p className="mt-2 max-w-2xl text-xs sm:text-sm font-medium leading-relaxed text-[#5C4537]">
            Track your reading status, record personal notes and ratings, and
            view your reading progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary-hover"
          >
            <Library className="h-4 w-4" />
            <span>Explore Library</span>
          </Link>
        </div>
      </div>

      {/* Main Dashboard Navigation Switcher */}
      <div className="mb-8 grid grid-cols-2 gap-1.5 rounded-2xl border border-border bg-[#FAF4EE] p-1.5 shadow-2xs sm:flex sm:flex-wrap sm:gap-2">
        <button
          type="button"
          onClick={() => handleSectionSwitch("shelf")}
          className={`flex items-center justify-center sm:justify-start gap-1.5 rounded-xl px-2.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-bold transition-all ${
            activeSection === "shelf"
              ? "bg-primary text-white shadow-xs"
              : "text-[#5B3315] hover:bg-border/50"
          }`}
        >
          <BookMarked className="h-4 w-4 shrink-0" />
          <span className="truncate">
            <span className="sm:hidden">Bookshelf ({counts.all})</span>
            <span className="hidden sm:inline">
              My Bookshelf ({counts.all})
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSectionSwitch("journal")}
          className={`flex items-center justify-center sm:justify-start gap-1.5 rounded-xl px-2.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-bold transition-all ${
            activeSection === "journal"
              ? "bg-primary text-white shadow-xs"
              : "text-[#5B3315] hover:bg-border/50"
          }`}
        >
          <PenLine className="h-4 w-4 shrink-0" />
          <span className="truncate">
            <span className="sm:hidden">Journal ({reviewedCount})</span>
            <span className="hidden sm:inline">
              My Reviews &amp; Journal ({reviewedCount})
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSectionSwitch("journeys")}
          className={`flex items-center justify-center sm:justify-start gap-1.5 rounded-xl px-2.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-bold transition-all ${
            activeSection === "journeys"
              ? "bg-primary text-white shadow-xs"
              : "text-[#5B3315] hover:bg-border/50"
          }`}
        >
          <Compass className="h-4 w-4 shrink-0" />
          <span className="truncate">
            <span className="sm:hidden">
              Journeys ({READING_JOURNEYS.length})
            </span>
            <span className="hidden sm:inline">
              Curated Journeys ({READING_JOURNEYS.length})
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSectionSwitch("goals")}
          className={`flex items-center justify-center sm:justify-start gap-1.5 rounded-xl px-2.5 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-bold transition-all ${
            activeSection === "goals"
              ? "bg-primary text-white shadow-xs"
              : "text-[#5B3315] hover:bg-border/50"
          }`}
        >
          <Trophy className="h-4 w-4 shrink-0" />
          <span className="truncate">
            <span className="sm:hidden">Goals &amp; Stats</span>
            <span className="hidden sm:inline">Goals &amp; Reading Stats</span>
          </span>
        </button>
      </div>

      {/* SECTION: MY REVIEWS & JOURNAL */}
      {activeSection === "journal" && (
        <ReviewsJournalView
          allBooks={combinedCatalog}
          onSwitchToShelf={() => handleSectionSwitch("shelf")}
        />
      )}

      {/* SECTION 2: READING JOURNEYS */}
      {activeSection === "journeys" && (
        <div className="animate-in fade-in-50 duration-200">
          <JourneysView embedded={true} />
        </div>
      )}

      {/* SECTION 3: GOALS & INSIGHTS */}
      {activeSection === "goals" && (
        <div className="animate-in fade-in-50 duration-200 mb-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ReadingGoalCard completedCount={counts.completed} />
          </div>
          <div className="lg:col-span-7">
            <ReadingStatsInsights allBooks={combinedCatalog} />
          </div>
        </div>
      )}

      {/* SECTION 1: MY BOOKSHELF */}
      {activeSection === "shelf" && (
        <div className="animate-in fade-in-50 duration-200">
          {/* Quick Reading Goal Progress Pill */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-primary">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Annual Reading Progress
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {counts.completed} completed &bull; {counts.reading} currently
                  reading
                  {counts.dropped > 0 && ` • ${counts.dropped} dropped`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSectionSwitch("goals")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>View full stats</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Control Bar: Tabs, Search, View Mode */}
          <div className="mb-6 flex flex-col gap-3.5 border-b border-border pb-5">
            {/* Shelf Tabs (including Dropped & Reviewed) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none w-full -mx-1 px-1">
              {(
                [
                  { id: "all", label: "All", count: counts.all, emoji: "📚" },
                  {
                    id: "reading",
                    label: "Reading",
                    count: counts.reading,
                    emoji: "📖",
                  },
                  {
                    id: "plan_to_read",
                    label: "Want to Read",
                    count: counts.plan_to_read,
                    emoji: "🔖",
                  },
                  {
                    id: "completed",
                    label: "Finished",
                    count: counts.completed,
                    emoji: "✅",
                  },
                  {
                    id: "on_hold",
                    label: "On Hold",
                    count: counts.on_hold,
                    emoji: "⏸️",
                  },
                  {
                    id: "dropped",
                    label: "Dropped",
                    count: counts.dropped,
                    emoji: "🚫",
                  },
                  {
                    id: "reviewed",
                    label: "Reviewed",
                    count: counts.reviewed,
                    emoji: "✍️",
                  },
                ] as const
              ).map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabSelect(tab.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 h-8.5 whitespace-nowrap rounded-xl px-3 text-xs font-bold transition-all select-none ${
                      isSelected
                        ? "bg-primary text-white shadow-xs"
                        : "border border-border bg-white text-[#5B3315] hover:border-primary hover:bg-muted"
                    }`}
                  >
                    <span className="text-sm shrink-0 leading-none">
                      {tab.emoji}
                    </span>
                    <span className="leading-none">{tab.label}</span>
                    <span
                      className={`inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-extrabold leading-none ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-muted text-[#7A4B22]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter Toolbar: Active Info & Compact Search + View Modes */}
            <div className="flex items-center justify-between gap-2.5 pt-0.5">
              <span className="text-[11px] font-bold text-[#8B6E5A] truncate">
                Showing {filteredBooks.length}{" "}
                {filteredBooks.length === 1 ? "book" : "books"}
                {searchQuery ? ` matching "${searchQuery}"` : ""}
              </span>

              {/* Search & View Modes - Extra Compact */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative w-32 min-[420px]:w-36 sm:w-44">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8B6E5A]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Filter..."
                    className="h-8 w-full rounded-xl border border-border bg-white pl-7.5 pr-6 text-xs font-medium text-foreground placeholder-[#8B6E5A] placeholder:text-[11px] shadow-2xs focus:border-primary focus:outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#8B6E5A] hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center rounded-xl border border-border bg-white p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("bookshelf")}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                      viewMode === "bookshelf"
                        ? "bg-primary text-white"
                        : "text-[#8B6E5A] hover:bg-muted"
                    }`}
                    title="Tactile Bookshelf view"
                  >
                    <Columns className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-primary text-white"
                        : "text-[#8B6E5A] hover:bg-muted"
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-primary text-white"
                        : "text-[#8B6E5A] hover:bg-muted"
                    }`}
                    title="Compact list view"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Shelf Content */}
          {filteredBooks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#DCC8B6] bg-background/50 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-primary">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">
                {searchQuery
                  ? "No matching books on this shelf"
                  : activeTab === "dropped"
                    ? "No dropped books on your shelf"
                    : "This shelf is empty"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {searchQuery
                  ? "Try clearing your search query to see other books on this shelf."
                  : activeTab === "dropped"
                    ? "Books you mark as Dropped will appear here so you can keep track of titles you didn't finish."
                    : "Explore the library to find books and add them to your shelf."}
              </p>
              <div className="mt-6 flex justify-center">
                {searchQuery ? (
                  <Button
                    onClick={() => handleSearchChange("")}
                    variant="outline"
                    className="rounded-xl border-[#DCC8B6]"
                  >
                    Clear Filter
                  </Button>
                ) : (
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-hover transition-colors"
                  >
                    <span>Explore Library &amp; Add Books</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ) : viewMode === "bookshelf" ? (
            /* Tactile Bookshelf Mode */
            <div className="space-y-10">
              <div className="relative rounded-3xl border border-border bg-linear-to-b from-[#FAF4EE] to-[#EFE6DC] p-3 sm:p-7 shadow-sm">
                <div className="grid grid-cols-2 gap-2.5 min-[440px]:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-6 items-end pb-5">
                  {filteredBooks.map((book) => {
                    const href = getBookHref(book);
                    const entry = marginaliaMap[book.bookId];

                    return (
                      <div
                        key={book.bookId}
                        className="group relative flex flex-col items-center rounded-2xl border border-border/80 bg-white/85 p-2.5 sm:p-3.5 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:border-secondary hover:bg-white hover:shadow-md hover:-translate-y-1"
                      >
                        <Link
                          href={href}
                          className="relative block w-full aspect-2/3 max-w-28 min-[440px]:max-w-32 rounded-xl overflow-hidden shadow-xs transition-transform duration-200 group-hover:scale-102"
                        >
                          <AestheticBookCover
                            title={book.bookName}
                            author={book.author}
                            coverUrl={book.image}
                            category={book.category}
                            size="normal"
                          />
                        </Link>

                        {/* Book Metadata & Actions */}
                        <div className="w-full mt-3 flex flex-col items-center text-center">
                          <Link
                            href={href}
                            className="line-clamp-1 w-full text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors"
                            title={book.bookName}
                          >
                            {book.bookName}
                          </Link>
                          <span className="truncate w-full text-[11px] text-muted-foreground mt-0.5">
                            {book.author}
                          </span>

                          {entry?.userRating ? (
                            <span className="mt-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                              ★ {entry.userRating}/5
                            </span>
                          ) : entry?.finishedDate ? (
                            <span className="mt-1 text-[10px] font-semibold text-[#8B6E5A] bg-[#FAF4EE] px-2 py-0.5 rounded-full border border-[#DCC8B6]/60">
                              📅 {entry.finishedDate}
                            </span>
                          ) : null}

                          {/* Action Column: Stacked up-down with full-width status and big review button */}
                          <div className="mt-3 w-full flex flex-col gap-2 pt-2 border-t border-border/60">
                            <BookShelfButton
                              book={book}
                              size="sm"
                              className="w-full text-xs font-bold h-9 justify-between px-2.5 sm:px-3 shadow-2xs"
                            />
                            <BookReviewModal
                              book={book}
                              variant="button"
                              size="sm"
                              className="w-full h-8.5 justify-center text-xs font-bold"
                            />
                            <Link
                              href={href}
                              className="w-full py-1 text-[11px] font-bold text-[#5B3315] hover:text-primary hover:bg-[#FAF4EE] text-center rounded-xl border border-border/60 transition flex items-center justify-center gap-1"
                            >
                              <span>Details</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Tactile Wood plank styling */}
                <div className="h-4 w-full rounded-md bg-linear-to-r from-primary via-[#A8713D] to-primary shadow-md border-t border-secondary/40" />
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid Mode */
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredBooks.map((book) => {
                const href = getBookHref(book);
                const statusOption = READING_STATUS_OPTIONS.find(
                  (o) => o.value === book.currentStatus,
                );
                const entry = marginaliaMap[book.bookId];

                return (
                  <div
                    key={book.bookId}
                    className="flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-secondary hover:shadow-lg"
                  >
                    <div>
                      <div className="relative mx-auto aspect-2/3 max-h-48 w-full overflow-hidden rounded-2xl bg-background flex items-center justify-center">
                        <Link
                          href={href}
                          className="relative flex items-center justify-center w-full h-full"
                        >
                          <AestheticBookCover
                            title={book.bookName}
                            author={book.author}
                            coverUrl={book.image}
                            category={book.category}
                            size="normal"
                          />
                        </Link>
                      </div>

                      <div className="mt-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-[#7A4B22]">
                            {book.category}
                          </span>
                          {statusOption && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusOption.color} ${statusOption.textColor}`}
                            >
                              {statusOption.emoji} {statusOption.label}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 line-clamp-1 font-bold text-foreground hover:text-primary transition-colors">
                          <Link href={href}>{book.bookName}</Link>
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {book.author}
                        </p>

                        {/* Note & Calendar Pill Preview if exists */}
                        {(entry?.finishedDate || entry?.notes) && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                            {entry.finishedDate && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF4EE] px-1.5 py-0.5 font-semibold text-primary">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{entry.finishedDate}</span>
                              </span>
                            )}
                            {entry.notes && (
                              <span className="truncate max-w-35 italic text-muted-foreground">
                                &ldquo;{entry.notes}&rdquo;
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-border-subtle pt-3.5 flex flex-col gap-2">
                      <BookShelfButton
                        book={book}
                        size="sm"
                        className="w-full text-xs font-bold h-9 justify-between px-3 shadow-2xs"
                      />
                      <BookReviewModal
                        book={book}
                        variant="button"
                        size="sm"
                        className="w-full h-9 justify-center text-xs font-bold"
                      />
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full h-8.5 gap-1.5 rounded-xl border-[#DCC8B6] bg-white px-3 text-xs font-bold text-[#5B3315] shadow-2xs hover:border-primary hover:bg-muted hover:text-primary justify-center"
                      >
                        <Link
                          href={href}
                          title="View full details"
                          className="flex items-center justify-center gap-1.5"
                        >
                          <span>Examine Book Details</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List Mode */
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-160 text-left text-xs">
                  <thead className="border-b border-border bg-background font-bold text-foreground">
                    <tr>
                      <th className="px-4 py-3">Book</th>
                      <th className="px-4 py-3">Author</th>
                      <th className="px-4 py-3">Genre</th>
                      <th className="px-4 py-3">Finished Date</th>
                      <th className="px-4 py-3">Shelf Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredBooks.map((book) => {
                      const href = getBookHref(book);
                      const entry = marginaliaMap[book.bookId];

                      return (
                        <tr
                          key={book.bookId}
                          className="hover:bg-background/80 transition-colors"
                        >
                          <td className="px-4 py-3 font-bold text-foreground">
                            <Link
                              href={href}
                              className="hover:text-primary transition-colors"
                            >
                              {book.bookName}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {book.author}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-[#7A4B22]">
                              {book.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-[#4A3528]">
                            {entry?.finishedDate ? (
                              <span className="inline-flex items-center gap-1 rounded bg-[#FAF4EE] px-2 py-0.5 text-[11px] font-bold text-primary">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{entry.finishedDate}</span>
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <BookShelfButton book={book} size="sm" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <BookReviewModal
                                book={book}
                                variant="button"
                                size="sm"
                              />
                              <Link
                                href={href}
                                className="inline-flex items-center gap-1 font-bold text-primary hover:underline ml-1"
                              >
                                <span>View</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanToReadView;
