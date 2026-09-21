"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookMarked,
  BookOpen,
  Library,
  Trash2,
  ChevronDown,
  Check,
  Search,
  BookCheck,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import {
  READING_STATUS_OPTIONS,
  type ReadingStatusValue,
  type ReadingStatusOption,
} from "@/types/reading-status.type";
import type { Book } from "@/types/book.type";

interface PlanToReadViewProps {
  allBooks: Book[];
}

interface InlineStatusDropdownProps {
  bookId: number;
  bookName: string;
  currentStatus: ReadingStatusValue | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onStatusChange: (status: ReadingStatusValue | null) => void;
}

const InlineStatusDropdown = ({
  bookId,
  bookName,
  currentStatus,
  isOpen,
  onToggle,
  onClose,
  onStatusChange,
}: InlineStatusDropdownProps): ReactElement => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        !dropdownRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const activeOption: ReadingStatusOption | undefined =
    READING_STATUS_OPTIONS.find((opt) => opt.value === currentStatus);

  return (
    <div
      id={`reading-status-${bookId}`}
      className="relative inline-block text-left"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center justify-between gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-xs transition-all duration-150 hover:shadow-sm active:scale-[0.98] ${
          activeOption
            ? `${activeOption.color} ${activeOption.textColor} ${activeOption.borderColor}`
            : "border-[#DCC8B6] bg-white text-[#5B3315] hover:border-[#8B5A2B] hover:bg-[#F5ECE3]"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Select reading status for ${bookName}`}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-sm">
            {activeOption ? activeOption.emoji : "🔖"}
          </span>
          <span>{activeOption ? activeOption.label : "Set Status"}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-70 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 origin-top-right rounded-2xl border border-[#DCC8B6] bg-white p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8B6E5A]">
            Select Reading Status
          </div>
          <div className="my-1 border-t border-[#F0E4D8]" />
          <ul role="menu" className="space-y-0.5">
            {READING_STATUS_OPTIONS.map((option) => {
              const isSelected = currentStatus === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onStatusChange(isSelected ? null : option.value);
                      onClose();
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors ${
                      isSelected
                        ? `${option.color} ${option.textColor} font-bold`
                        : "text-[#3D2310] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-[#8B5A2B]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {currentStatus && (
            <>
              <div className="my-1 border-t border-[#F0E4D8]" />
              <button
                type="button"
                onClick={() => {
                  onStatusChange(null);
                  onClose();
                }}
                className="flex w-full items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Status</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

type FilterTab = "all" | "plan_to_read" | "reading" | "completed" | "other";

interface TrackedBook extends Book {
  currentStatus: ReadingStatusValue;
}

const PlanToReadView = ({ allBooks }: PlanToReadViewProps): ReactElement => {
  const { statusMap, setStatus, isMounted } = useReadingStatus();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openDropdownBookId, setOpenDropdownBookId] = useState<number | null>(
    null,
  );

  const trackedBooks: TrackedBook[] = useMemo(() => {
    return allBooks.flatMap((b) => {
      const currentStatus = statusMap[b.bookId];
      if (currentStatus) {
        return [{ ...b, currentStatus }];
      }
      return [];
    });
  }, [allBooks, statusMap]);

  const counts = useMemo(() => {
    return {
      all: trackedBooks.length,
      plan_to_read: trackedBooks.filter(
        (b) => b.currentStatus === "plan_to_read",
      ).length,
      reading: trackedBooks.filter((b) => b.currentStatus === "reading").length,
      completed: trackedBooks.filter((b) => b.currentStatus === "completed")
        .length,
      other: trackedBooks.filter(
        (b) =>
          b.currentStatus === "on_hold" ||
          b.currentStatus === "dropped" ||
          b.currentStatus === "re_reading",
      ).length,
    };
  }, [trackedBooks]);

  const filteredBooks = useMemo(() => {
    return trackedBooks.filter((book) => {
      let matchesTab = true;
      if (activeTab === "plan_to_read") {
        matchesTab = book.currentStatus === "plan_to_read";
      } else if (activeTab === "reading") {
        matchesTab = book.currentStatus === "reading";
      } else if (activeTab === "completed") {
        matchesTab = book.currentStatus === "completed";
      } else if (activeTab === "other") {
        matchesTab =
          book.currentStatus === "on_hold" ||
          book.currentStatus === "dropped" ||
          book.currentStatus === "re_reading";
      }

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        book.bookName.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [trackedBooks, activeTab, searchQuery]);

  const totalTrackedPages = useMemo(() => {
    return filteredBooks.reduce((sum, b) => sum + (b.totalPages || 0), 0);
  }, [filteredBooks]);

  return (
    <div className="container mx-auto max-w-5xl pb-32">
      <div className="mb-8 text-center md:text-left">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F5ECE3] px-4 py-1.5 text-xs font-semibold text-[#7A4B22] ring-1 ring-[#E8D5C4] md:text-sm">
          <BookMarked className="h-3.5 w-3.5" />A Little Shelf for Later
        </span>

        <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-[#241812] md:text-5xl">
          Plan to <span className="text-[#8B5A2B]">Read</span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A3528] md:text-base">
          Some books are not meant for today. Keep the ones you want to come
          back to here, and read them when the time feels right.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[#EADBCE] bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5ECE3] text-[#8B5A2B]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black text-[#241812]">
              {isMounted ? counts.all : 0}
            </div>
            <div className="text-[11px] font-medium text-[#6F5B50]">
              Total Saved
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#EADBCE] bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black text-blue-800">
              {isMounted ? counts.reading : 0}
            </div>
            <div className="text-[11px] font-medium text-[#6F5B50]">
              Reading Now
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#EADBCE] bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF6F0] text-[#8B5A2B]">
            <BookMarked className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black text-[#8B5A2B]">
              {isMounted ? counts.plan_to_read : 0}
            </div>
            <div className="text-[11px] font-medium text-[#6F5B50]">
              Plan to Read
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#EADBCE] bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <BookCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black text-green-800">
              {isMounted ? counts.completed : 0}
            </div>
            <div className="text-[11px] font-medium text-[#6F5B50]">
              Completed
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#EADBCE] bg-white p-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-[#8B5A2B] text-white shadow-xs"
                : "text-[#5B3315] hover:bg-[#F5ECE3]"
            }`}
          >
            <span>All Books</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-[#F5ECE3] text-[#7A4B22]"
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("plan_to_read")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "plan_to_read"
                ? "bg-[#8B5A2B] text-white shadow-xs"
                : "text-[#5B3315] hover:bg-[#F5ECE3]"
            }`}
          >
            <span>🔖 Plan to Read</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === "plan_to_read"
                  ? "bg-white/20 text-white"
                  : "bg-[#F5ECE3] text-[#7A4B22]"
              }`}
            >
              {counts.plan_to_read}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reading")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "reading"
                ? "bg-[#8B5A2B] text-white shadow-xs"
                : "text-[#5B3315] hover:bg-[#F5ECE3]"
            }`}
          >
            <span>📖 Reading</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === "reading"
                  ? "bg-white/20 text-white"
                  : "bg-[#F5ECE3] text-[#7A4B22]"
              }`}
            >
              {counts.reading}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "completed"
                ? "bg-[#8B5A2B] text-white shadow-xs"
                : "text-[#5B3315] hover:bg-[#F5ECE3]"
            }`}
          >
            <span>✅ Completed</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === "completed"
                  ? "bg-white/20 text-white"
                  : "bg-[#F5ECE3] text-[#7A4B22]"
              }`}
            >
              {counts.completed}
            </span>
          </button>

          {counts.other > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("other")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "other"
                  ? "bg-[#8B5A2B] text-white shadow-xs"
                  : "text-[#5B3315] hover:bg-[#F5ECE3]"
              }`}
            >
              <span>Other</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === "other"
                    ? "bg-white/20 text-white"
                    : "bg-[#F5ECE3] text-[#7A4B22]"
                }`}
              >
                {counts.other}
              </span>
            </button>
          )}
        </div>

        {counts.all > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B6E5A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your shelf..."
              className="w-full rounded-2xl border border-[#EADBCE] bg-white py-2 pl-9 pr-3 text-xs font-medium text-[#241812] placeholder-[#8B6E5A] shadow-xs transition-colors focus:border-[#8B5A2B] focus:outline-hidden"
            />
          </div>
        )}
      </div>

      {filteredBooks.length > 0 ? (
        <div className="space-y-3">
          {filteredBooks.map((book) => {
            const isDropdownOpen = openDropdownBookId === book.bookId;
            return (
              <div
                key={book.bookId}
                className={`relative flex flex-col gap-4 rounded-2xl border bg-white p-4 transition-all duration-150 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
                  isDropdownOpen
                    ? "z-30 border-[#8B5A2B] shadow-md ring-2 ring-[#8B5A2B]/15"
                    : "z-0 border-[#EADBCE] shadow-xs hover:border-[#D4A373]"
                }`}
              >
                <div className="flex items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
                  <Link
                    href={`/books/${book.bookId}`}
                    className="relative flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#FAF6F0] to-[#EFE4D6] p-1 shadow-xs transition-transform duration-200 hover:scale-105 sm:h-24 sm:w-16"
                  >
                    <Image
                      src={book.image}
                      alt={book.bookName}
                      fill
                      sizes="64px"
                      className="object-contain drop-shadow-xs"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold tracking-tight text-[#241812] transition-colors duration-150 hover:text-[#8B5A2B] sm:text-base">
                      <Link href={`/books/${book.bookId}`}>
                        {book.bookName}
                      </Link>
                    </h3>

                    <p className="mt-0.5 text-xs font-medium text-[#6F5B50] sm:text-sm">
                      By{" "}
                      <span className="font-semibold text-[#3D2310]">
                        {book.author}
                      </span>
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-[#F5ECE3] px-2.5 py-0.5 font-bold uppercase tracking-wider text-[#7A4B22]">
                        {book.category}
                      </span>

                      <span className="flex items-center gap-1 text-[#6F5B50]">
                        <Clock className="h-3 w-3" />
                        <span>{book.totalPages} pages</span>
                      </span>

                      <span className="flex items-center gap-1 font-bold text-[#241812]">
                        <span className="text-[#D48B1B]">★</span>
                        <span>{book.rating}</span>
                      </span>

                      <span className="hidden text-[#6F5B50] sm:inline">
                        • {book.yearOfPublishing}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2.5 border-t border-[#F5ECE3] pt-2.5 sm:border-t-0 sm:pt-0 sm:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#8B6E5A] sm:hidden">
                      Status:
                    </span>
                    <InlineStatusDropdown
                      bookId={book.bookId}
                      bookName={book.bookName}
                      currentStatus={book.currentStatus}
                      isOpen={isDropdownOpen}
                      onToggle={() => {
                        setOpenDropdownBookId((prev) =>
                          prev === book.bookId ? null : book.bookId,
                        );
                      }}
                      onClose={() => {
                        if (openDropdownBookId === book.bookId) {
                          setOpenDropdownBookId(null);
                        }
                      }}
                      onStatusChange={(newStatus) => {
                        setStatus(book.bookId, newStatus);
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/books/${book.bookId}`}
                      className="flex h-8 items-center gap-1 rounded-xl border border-[#DCC8B6] bg-white px-2.5 text-xs font-semibold text-[#4A2E18] shadow-2xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                      title="View full details"
                    >
                      <span className="hidden sm:inline">Details</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setStatus(book.bookId, null)}
                      title={`Remove "${book.bookName}" from shelf`}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DCC8B6] bg-white text-[#8B6E5A] shadow-2xs transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between px-2 pt-2 text-xs font-medium text-[#6F5B50]">
            <span>
              Showing {filteredBooks.length} of {counts.all} tracked book
              {counts.all === 1 ? "" : "s"}
            </span>
            <span>{totalTrackedPages.toLocaleString()} total pages</span>
          </div>
        </div>
      ) : counts.all > 0 ? (
        <div className="rounded-3xl border border-[#EADBCE] bg-white p-10 text-center shadow-xs">
          <p className="text-base font-bold text-[#241812]">
            No books found matching this filter
          </p>
          <p className="mt-1 text-xs text-[#6F5B50]">
            Try clearing your search query or selecting the &quot;All
            Books&quot; tab.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setSearchQuery("");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#8B5A2B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#6F4420]"
          >
            Show All Tracked Books
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-[#EADBCE] bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5ECE3] text-[#8B5A2B]">
            <BookMarked className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-[#241812]">
            There is nothing here yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-[#4A3528]">
            Maybe the book you are looking for is still waiting for you. Go back
            to the library and choose one whenever you feel like it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/allbooks"
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B5A2B] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#8B5A2B]/20 transition-all duration-200 hover:bg-[#6F4420] hover:shadow-lg active:scale-[0.98]"
            >
              <Library className="h-4 w-4" />
              Go to the Library
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[#DCC8B6] bg-white px-5 py-3 text-sm font-semibold text-[#4A2E18] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3]"
            >
              Back Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanToReadView;
