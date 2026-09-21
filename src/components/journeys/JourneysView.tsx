"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, Clock, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { READING_JOURNEYS, type ReadingJourney } from "@/lib/readingJourneys";
import { getAllBooks } from "@/lib/books";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import type { Book } from "@/types/book.type";

interface JourneysViewProps {
  initialJourneys?: ReadingJourney[];
}

export const JourneysView = ({}: JourneysViewProps): ReactElement => {
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(
    READING_JOURNEYS[0].id,
  );
  const { statusMap, isMounted } = useReadingStatus();
  const allBooks = getAllBooks();
  const bookMap = new Map<number, Book>(allBooks.map((b) => [b.bookId, b]));

  const activeJourney =
    READING_JOURNEYS.find((j) => j.id === selectedJourneyId) ||
    READING_JOURNEYS[0];

  // Calculate progress for active journey
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

  return (
    <div className="container mx-auto max-w-6xl pb-24">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F5ECE3] px-4 py-1.5 text-xs font-semibold text-[#7A4B22] ring-1 ring-[#E8D5C4] md:text-sm">
          <Compass className="h-3.5 w-3.5" /> Curated Syllabi & Thematic Trails
        </span>

        <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-[#241812] md:text-5xl">
          Reading <span className="text-[#8B5A2B]">Journeys</span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A3528] md:text-base">
          Reading is not merely consumption; it is an expedition. These sequenced journeys guide you through philosophical disputes, emotional evolutions, and timeless dialogues between master thinkers.
        </p>
      </div>

      {/* Journey Selector Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-[#EADBCE] pb-4">
        {READING_JOURNEYS.map((j) => {
          const isSelected = j.id === selectedJourneyId;
          const completedInThis = isMounted
            ? j.steps.filter((s) => statusMap[s.bookId] === "completed").length
            : 0;

          return (
            <button
              key={j.id}
              type="button"
              onClick={() => setSelectedJourneyId(j.id)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                isSelected
                  ? "bg-[#8B5A2B] text-white shadow-md shadow-[#8B5A2B]/25"
                  : "border border-[#DCC8B6] bg-white text-[#4A2E18] hover:border-[#8B5A2B] hover:bg-[#F5ECE3]"
              }`}
            >
              <span>{j.emoji}</span>
              <span>{j.title}</span>
              {completedInThis > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {completedInThis}/{j.steps.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Journey Overview Card */}
      <div className="overflow-hidden rounded-3xl border border-[#EADBCE] bg-white shadow-sm">
        <div className="bg-linear-to-r from-[#FAF6F0] via-[#F5ECE3] to-[#EFE4D6] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="rounded-full bg-[#8B5A2B] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {activeJourney.badge}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-[#241812] sm:text-3xl">
                {activeJourney.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#7A4B22]">
                {activeJourney.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#DCC8B6] bg-white/90 p-4 shadow-xs backdrop-blur-xs">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#6F5B50]">
                  <Clock className="h-3.5 w-3.5 text-[#8B5A2B]" />
                  <span>~{activeJourney.estimatedTotalHours}h</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#8B6E5A]">
                  Total Reading
                </div>
              </div>

              <div className="h-8 w-px bg-[#EADBCE]" />

              <div className="text-center">
                <div className="text-sm font-extrabold text-[#241812]">
                  {isMounted ? completedSteps : 0} / {activeJourney.steps.length}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#8B6E5A]">
                  {isMounted && readingSteps > 0 ? `${readingSteps} Reading` : "Completed"}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#3D2310]">
            {activeJourney.description}
          </p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold text-[#6F5B50]">
              <span>Journey Completion Progress</span>
              <span>{isMounted ? progressPercent : 0}%</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/80 ring-1 ring-[#DCC8B6]">
              <div
                className="h-full rounded-full bg-[#8B5A2B] transition-all duration-500"
                style={{ width: `${isMounted ? progressPercent : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Curator Note */}
        <div className="border-b border-[#F0E4D8] bg-[#FAF7F2] px-6 py-3.5 text-xs italic text-[#5B3315] sm:px-8">
          <strong className="not-italic font-bold">Curator&apos;s Advice: </strong>
          {activeJourney.curatorNote}
        </div>

        {/* Journey Steps */}
        <div className="p-6 sm:p-8 space-y-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6F5B50]">
            The Journey Traversal ({activeJourney.steps.length} Sequential Milestones)
          </h3>

          <div className="space-y-4">
            {activeJourney.steps.map((step) => {
              const book = bookMap.get(step.bookId);
              if (!book) return null;

              const status = isMounted ? statusMap[step.bookId] : null;
              const isDone = status === "completed";
              const isCurrent = status === "reading";

              return (
                <div
                  key={step.bookId}
                  className={`relative flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
                    isDone
                      ? "border-green-300 bg-green-50/40"
                      : isCurrent
                        ? "border-blue-300 bg-blue-50/40 shadow-xs"
                        : "border-[#EADBCE] bg-white hover:border-[#D4A373]"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    {/* Step Icon / Number */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs shadow-xs ${
                          isDone
                            ? "bg-green-600 text-white"
                            : isCurrent
                              ? "bg-blue-600 text-white animate-pulse"
                              : "bg-[#F5ECE3] text-[#7A4B22]"
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

                    {/* Book Thumbnail */}
                    <Link
                      href={`/books/${book.bookId}`}
                      className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-[#FAF6F0] to-[#EFE4D6] p-1 shadow-xs transition hover:scale-105"
                    >
                      <Image
                        src={book.image}
                        alt={book.bookName}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    </Link>

                    {/* Information & Reflection */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5A2B]">
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

                      <h4 className="truncate text-sm font-bold text-[#241812] transition hover:text-[#8B5A2B] sm:text-base">
                        <Link href={`/books/${book.bookId}`}>
                          {book.bookName}
                        </Link>
                      </h4>

                      <p className="text-xs font-medium text-[#6F5B50]">
                        By <span className="font-semibold text-[#3D2310]">{book.author}</span>
                      </p>

                      <div className="mt-2 rounded-xl bg-[#FAF7F2] p-2.5 text-xs text-[#35231A]">
                        <span className="font-bold text-[#7A4B22]">Inquiry: </span>
                        <span className="italic text-[#4A3528]">
                          &ldquo;{step.reflectionPrompt}&rdquo;
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center justify-end border-t border-[#F5ECE3] pt-2 sm:border-t-0 sm:pt-0 shrink-0 sm:pl-4">
                    <Link
                      href={`/books/${book.bookId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCC8B6] bg-white px-3.5 py-2 text-xs font-bold text-[#4A2E18] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                    >
                      <span>Examine Book</span>
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
