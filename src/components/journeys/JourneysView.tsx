"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import {
  Compass,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookmarkPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookShelfButton } from "@/components/books/BookShelfButton";
import { BookReviewModal } from "@/components/books/BookReviewModal";
import { READING_JOURNEYS, type ReadingJourney } from "@/lib/readingJourneys";
import { getAllBooks } from "@/lib/books";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import { useCustomBooks } from "@/context/CustomBooksContext";
import { useFeedback } from "@/context/FeedbackContext";
import type { Book } from "@/types/book.type";
import { AestheticBookCover } from "@/components/ui/AestheticBookCover";

interface JourneysViewProps {
  initialJourneys?: ReadingJourney[];
  embedded?: boolean;
}

export const JourneysView = ({
  initialJourneys,
  embedded = false,
}: JourneysViewProps): ReactElement => {
  const journeys =
    initialJourneys && initialJourneys.length > 0
      ? initialJourneys
      : READING_JOURNEYS;
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(
    journeys[0].id,
  );
  const { statusMap, setStatus, isMounted } = useReadingStatus();
  const { saveCustomBook } = useCustomBooks();
  const { showSuccess } = useFeedback();

  const allBooks = getAllBooks();
  const bookMap = new Map<number, Book>(allBooks.map((b) => [b.bookId, b]));

  const activeJourney =
    journeys.find((j) => j.id === selectedJourneyId) || journeys[0];

  const completedSteps = activeJourney.steps.filter((step) => {
    const status = statusMap[step.bookId];
    return status === "completed";
  }).length;

  const readingSteps = activeJourney.steps.filter((step) => {
    const status = statusMap[step.bookId];
    return status === "reading";
  }).length;

  const progressPercent = Math.round(
    (completedSteps / activeJourney.steps.length) * 100,
  );

  const handleAddAllToShelf = (): void => {
    activeJourney.steps.forEach((step) => {
      const b = bookMap.get(step.bookId);
      if (b) {
        saveCustomBook(b, "plan_to_read");
        setStatus(step.bookId, "plan_to_read");
      }
    });
    showSuccess(
      `Added all ${activeJourney.steps.length} books in this journey to "Want to Read"!`,
    );
  };

  return (
    <div
      className={
        embedded ? "w-full pb-12" : "container mx-auto max-w-6xl pb-24"
      }
    >
      {!embedded ? (
        <div className="mb-10 text-center md:text-left">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 text-xs font-semibold text-[#7A4B22] ring-1 ring-[#E8D5C4] md:text-sm">
            <Compass className="h-3.5 w-3.5" /> Reading Journeys &amp;
            Collections
          </span>

          <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Reading <span className="text-primary">Journeys</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A3528] md:text-base">
            Explore curated reading lists across classic literature, philosophy,
            and history. Track books individually or add entire lists to your
            shelf.
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-xs sm:text-sm font-medium text-[#5C4537]">
            Thematic reading lists connected to your shelf. Track your progress
            across each list or add individual books to your shelf.
          </p>
        </div>
      )}

      <div className="mb-8 flex items-center gap-2 border-b border-border pb-4 overflow-x-auto scrollbar-none flex-nowrap sm:flex-wrap">
        {journeys.map((j) => {
          const isSelected = j.id === selectedJourneyId;
          const completedInThis = isMounted
            ? j.steps.filter((s) => statusMap[s.bookId] === "completed").length
            : 0;

          return (
            <Button
              key={j.id}
              onClick={() => setSelectedJourneyId(j.id)}
              variant={isSelected ? "default" : "outline"}
              className={`whitespace-nowrap shrink-0 flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all duration-150 active:scale-95 sm:text-sm ${
                isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "border-[#DCC8B6] bg-white text-[#4A2E18] hover:border-primary hover:bg-muted"
              }`}
            >
              <span>{j.emoji}</span>
              <span>{j.title}</span>
              {completedInThis > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {completedInThis}/{j.steps.length}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="bg-linear-to-r from-[#FAF6F0] via-muted to-[#EFE4D6] p-4 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {activeJourney.badge}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
                {activeJourney.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#7A4B22]">
                {activeJourney.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 rounded-2xl border border-[#DCC8B6] bg-white/90 p-4 shadow-xs backdrop-blur-xs">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm font-bold text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>~{activeJourney.estimatedTotalHours}h</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8B6E5A]">
                    Total Reading
                  </div>
                </div>

                <div className="h-8 w-px bg-border" />

                <div className="text-center">
                  <div className="text-sm font-extrabold text-foreground">
                    {isMounted ? completedSteps : 0} /{" "}
                    {activeJourney.steps.length}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8B6E5A]">
                    {isMounted && readingSteps > 0
                      ? `${readingSteps} Reading`
                      : "Completed"}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddAllToShelf}
                className="w-full sm:w-auto rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold shadow-xs"
              >
                <BookmarkPlus className="h-4 w-4 mr-1.5" />
                <span>Add Whole Trail to Shelf</span>
              </Button>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#3D2310]">
            {activeJourney.description}
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>Journey Completion Progress</span>
              <span>{isMounted ? progressPercent : 0}%</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/80 ring-1 ring-[#DCC8B6]">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${isMounted ? progressPercent : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="border-b border-border-subtle bg-background px-4 py-3.5 text-xs italic text-[#5B3315] sm:px-8">
          <strong className="not-italic font-bold">
            Curator&apos;s Advice:{" "}
          </strong>
          {activeJourney.curatorNote}
        </div>

        <div className="p-4 sm:p-8">
          <div className="space-y-6">
            {activeJourney.steps.map((step) => {
              const book = bookMap.get(step.bookId);
              if (!book) return null;

              const status = isMounted ? statusMap[step.bookId] : null;
              const isDone = status === "completed";
              const isCurrent = status === "reading";

              return (
                <div
                  key={step.stepNumber}
                  className={`flex flex-col gap-4 rounded-3xl border p-4 sm:p-6 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between shadow-xs ${
                    isDone
                      ? "border-green-200 bg-green-50/40"
                      : isCurrent
                        ? "border-blue-200 bg-blue-50/40 ring-1 ring-blue-300"
                        : "border-border bg-white hover:border-secondary hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold ${
                          isDone
                            ? "bg-green-600 text-white"
                            : isCurrent
                              ? "bg-blue-600 text-white"
                              : "bg-muted text-[#7A4B22]"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isCurrent ? (
                          <Circle className="h-5 w-5 fill-current" />
                        ) : (
                          `#${step.stepNumber}`
                        )}
                      </div>
                      <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#8B6E5A]">
                        Step {step.stepNumber}
                      </span>
                    </div>

                    <Link
                      href={`/books/${book.bookId}`}
                      className="shrink-0 focus:outline-hidden"
                    >
                      <AestheticBookCover
                        title={book.bookName}
                        author={book.author}
                        coverUrl={book.image}
                        category={book.category}
                        size="compact"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {step.stageTitle}
                        </span>
                        {isDone && (
                          <span className="rounded-full bg-green-100 px-2 py-0.2 text-[10px] font-bold text-green-800">
                            Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.2 text-[10px] font-bold text-blue-800">
                            Reading Now
                          </span>
                        )}
                      </div>

                      <h4 className="truncate text-sm font-bold text-foreground transition hover:text-primary sm:text-base">
                        <Link href={`/books/${book.bookId}`}>
                          {book.bookName}
                        </Link>
                      </h4>

                      <p className="text-xs font-medium text-muted-foreground">
                        By{" "}
                        <span className="font-semibold text-[#3D2310]">
                          {book.author}
                        </span>
                      </p>

                      <div className="mt-2 rounded-xl bg-background p-2.5 text-xs text-[#35231A]">
                        <span className="font-bold text-[#7A4B22]">
                          Inquiry:{" "}
                        </span>
                        <span className="italic text-[#4A3528]">
                          &ldquo;{step.reflectionPrompt}&rdquo;
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch justify-center gap-2 border-t border-border/60 pt-3.5 sm:border-t-0 sm:pt-0 shrink-0 sm:w-44 sm:pl-4 w-full">
                    <BookShelfButton
                      book={book}
                      size="sm"
                      className="w-full h-9 text-xs font-bold justify-between px-3 shadow-2xs"
                    />
                    <BookReviewModal
                      book={book}
                      variant="button"
                      size="sm"
                      className="w-full h-8.5 justify-center text-xs font-bold"
                    />
                    <Link
                      href={`/books/${book.bookId}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#DCC8B6] bg-white px-3 py-1.5 text-xs font-bold text-[#4A2E18] shadow-xs transition hover:border-primary hover:bg-muted hover:text-primary"
                    >
                      <span>Examine Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneysView;
