"use client";

import { useMemo } from "react";
import type { ReactElement } from "react";
import {
  BarChart3,
  BookOpen,
  Star,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";
import type { Book } from "@/types/book.type";
import { useMarginalia } from "@/context/MarginaliaContext";
import { useReadingStatus } from "@/context/ReadingStatusContext";

interface ReadingStatsInsightsProps {
  allBooks: Book[];
}

export const ReadingStatsInsights = ({
  allBooks,
}: ReadingStatsInsightsProps): ReactElement | null => {
  const { marginaliaMap, isMounted } = useMarginalia();
  const { statusMap } = useReadingStatus();

  const stats = useMemo(() => {
    if (!isMounted) {
      return {
        totalPagesRead: 0,
        completedCount: 0,
        readingCount: 0,
        uniqueWritersCount: 0,
        avgUserRating: 0,
        ratedCount: 0,
        topCategories: [] as { category: string; count: number }[],
      };
    }

    const completedBooks: Book[] = [];
    const readingBooks: Book[] = [];
    const categoryMap: Record<string, number> = {};
    const writersSet = new Set<string>();

    allBooks.forEach((book) => {
      const status = statusMap[book.bookId];
      if (status === "completed") {
        completedBooks.push(book);
        categoryMap[book.category] = (categoryMap[book.category] || 0) + 1;
        if (book.author) writersSet.add(book.author.trim());
      } else if (status === "reading") {
        readingBooks.push(book);
        categoryMap[book.category] = (categoryMap[book.category] || 0) + 1;
        if (book.author) writersSet.add(book.author.trim());
      }
    });

    const totalPagesRead = completedBooks.reduce(
      (sum, b) => sum + (b.totalPages || 0),
      0,
    );

    let ratingSum = 0;
    let ratedCount = 0;
    Object.values(marginaliaMap).forEach((entry) => {
      if (entry.userRating && entry.userRating > 0) {
        ratingSum += entry.userRating;
        ratedCount += 1;
      }
    });

    const avgUserRating =
      ratedCount > 0 ? Number((ratingSum / ratedCount).toFixed(1)) : 0;

    const topCategories = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return {
      totalPagesRead,
      completedCount: completedBooks.length,
      readingCount: readingBooks.length,
      uniqueWritersCount: writersSet.size,
      avgUserRating,
      ratedCount,
      topCategories,
    };
  }, [allBooks, marginaliaMap, statusMap, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background p-5 shadow-xs sm:p-6">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-primary shadow-2xs">
            <BarChart3 className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-extrabold text-foreground">
            My Reading Stats &amp; Insights
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-[#8B6E5A]">
          Calculated from your shelf
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>Pages Read</span>
          </div>
          <p className="mt-1 text-xl font-black text-foreground">
            {stats.totalPagesRead.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">
            across {stats.completedCount} completed{" "}
            {stats.completedCount === 1 ? "book" : "books"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>Writers</span>
          </div>
          <p className="mt-1 text-xl font-black text-foreground">
            {stats.uniqueWritersCount}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">authors explored</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Star className="h-3.5 w-3.5 text-[#D48B1B]" />
            <span>Avg Rating</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xl font-black text-foreground">
            {stats.avgUserRating > 0 ? `${stats.avgUserRating}★` : "—"}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">
            {stats.ratedCount > 0
              ? `from ${stats.ratedCount} rated books`
              : "No personal ratings yet"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>In Progress</span>
          </div>
          <p className="mt-1 text-xl font-black text-blue-900">
            {stats.readingCount}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">actively being read</p>
        </div>

        <div className="col-span-2 rounded-2xl border border-border bg-white p-3.5 shadow-2xs sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>Top Category</span>
          </div>
          <p className="mt-1 line-clamp-1 text-sm font-extrabold text-foreground">
            {stats.topCategories.length > 0
              ? stats.topCategories[0].category
              : "—"}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">
            {stats.topCategories.length > 0
              ? `${stats.topCategories[0].count} books tracked`
              : "Start tracking to see"}
          </p>
        </div>
      </div>

      {stats.topCategories.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 text-xs">
          <span className="text-[11px] font-bold text-[#8B6E5A]">
            Genre distribution:
          </span>
          {stats.topCategories.map((cat) => (
            <span
              key={cat.category}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2 py-0.5 text-[11px] font-semibold text-[#4A2E18]"
            >
              <span>{cat.category}</span>
              <span className="rounded-full bg-background px-1 text-[9px] font-bold text-primary">
                {cat.count}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingStatsInsights;
