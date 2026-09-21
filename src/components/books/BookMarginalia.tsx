"use client";

import { useState, useRef } from "react";
import type { ReactElement } from "react";
import { PenLine, Quote, Trash2, Plus, Calendar, CheckCircle2 } from "lucide-react";
import { useMarginalia } from "@/context/MarginaliaContext";

interface BookMarginaliaProps {
  bookId: number;
  bookName: string;
}

const BookMarginalia = ({
  bookId,
  bookName,
}: BookMarginaliaProps): ReactElement => {
  const {
    getEntry,
    updateNotes,
    addQuote,
    removeQuote,
    setFinishedDate,
    isMounted,
  } = useMarginalia();

  const entry = isMounted ? getEntry(bookId) : null;
  const [draftNotes, setDraftNotes] = useState<string | null>(null);
  const [newQuoteText, setNewQuoteText] = useState<string>("");
  const [showAddQuote, setShowAddQuote] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("Saved offline");

  const notes = draftNotes !== null ? draftNotes : entry?.notes || "";
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNotesChange = (val: string): void => {
    setDraftNotes(val);
    setSaveStatus("Saving...");
    updateNotes(bookId, val);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(
      () => setSaveStatus("Saved to personal shelf"),
      600,
    );
  };

  const handleAddQuote = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;
    addQuote(bookId, newQuoteText);
    setNewQuoteText("");
    setShowAddQuote(false);
  };

  const quotes = entry?.favoriteQuotes || [];

  return (
    <section className="mt-8 rounded-3xl border border-[#EADBCE] bg-[#FAF7F2] p-5 shadow-xs sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#8B5A2B] shadow-xs">
            <PenLine className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-[#241812]">
              Reader&apos;s Marginalia & Notebook
            </h2>
            <p className="text-xs font-medium text-[#6F5B50]">
              Private reflections, underlined passages, and thoughts on{" "}
              <span className="font-semibold text-[#3D2310]">{bookName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#8B6E5A]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#8B5A2B]" />
          <span>{saveStatus}</span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="reader-notes"
            className="block text-xs font-bold uppercase tracking-wider text-[#6F5B50]"
          >
            Personal Reflections & Margin Notes
          </label>
          <textarea
            id="reader-notes"
            rows={4}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write what this book provoked in you... thoughts on a chapter, questions for yourself, or ideas to revisit later."
            className="mt-2 w-full rounded-2xl border border-[#DCC8B6] bg-white p-3.5 text-sm leading-relaxed text-[#241812] placeholder-[#8B6E5A]/70 shadow-xs transition focus:border-[#8B5A2B] focus:outline-hidden focus:ring-2 focus:ring-[#8B5A2B]/15"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6F5B50]">
              <Quote className="h-3.5 w-3.5 text-[#8B5A2B]" />
              Underlined Passages ({quotes.length})
            </span>

            <button
              type="button"
              onClick={() => setShowAddQuote((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-xl border border-[#DCC8B6] bg-white px-3 py-1 text-xs font-semibold text-[#5B3315] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3]"
            >
              <Plus className="h-3 w-3" />
              <span>Save a Passage</span>
            </button>
          </div>

          {showAddQuote && (
            <form onSubmit={handleAddQuote} className="mt-3 flex gap-2">
              <input
                type="text"
                value={newQuoteText}
                onChange={(e) => setNewQuoteText(e.target.value)}
                placeholder="Type or paste a memorable sentence from the book..."
                className="flex-1 rounded-xl border border-[#DCC8B6] bg-white px-3.5 py-2 text-xs font-medium text-[#241812] shadow-xs focus:border-[#8B5A2B] focus:outline-hidden"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-xl bg-[#8B5A2B] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#6F4420]"
              >
                Add
              </button>
            </form>
          )}

          {quotes.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {quotes.map((q, idx) => (
                <li
                  key={idx}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-[#EADBCE] bg-white/90 p-3 shadow-xs"
                >
                  <blockquote className="text-xs italic leading-relaxed text-[#35231A]">
                    &ldquo;{q}&rdquo;
                  </blockquote>
                  <button
                    type="button"
                    onClick={() => removeQuote(bookId, idx)}
                    title="Remove passage"
                    className="opacity-60 transition hover:opacity-100 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs italic text-[#8B6E5A]">
              No passages saved yet. Click &ldquo;Save a Passage&rdquo; above to record sentences you want to carry with you.
            </p>
          )}
        </div>

        <div className="border-t border-[#EADBCE] pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#6F5B50]">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-[#8B5A2B]" />
            <span>Date Finished:</span>
            <input
              type="date"
              value={entry?.finishedDate || ""}
              onChange={(e) => setFinishedDate(bookId, e.target.value || undefined)}
              className="rounded-lg border border-[#DCC8B6] bg-white px-2 py-1 text-xs text-[#241812] shadow-xs focus:border-[#8B5A2B] focus:outline-hidden"
            />
          </div>

          <span className="text-[11px] text-[#8B6E5A]">
            Stored securely in your private browser sanctuary.
          </span>
        </div>
      </div>
    </section>
  );
};

export default BookMarginalia;
