"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { ChevronDown, Check } from "lucide-react";
import {
  READING_STATUS_OPTIONS,
  type ReadingStatusValue,
} from "@/types/reading-status.type";
import { useReadingStatus } from "@/context/ReadingStatusContext";

interface ReadingStatusTrackerProps {
  bookId: number;
  bookName: string;
}

const ReadingStatusTracker = ({
  bookId,
  bookName,
}: ReadingStatusTrackerProps): ReactElement => {
  const { getStatus, setStatus } = useReadingStatus();
  const status = getStatus(bookId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const showToast = (msg: string): void => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelect = (value: ReadingStatusValue): void => {
    const option = READING_STATUS_OPTIONS.find((o) => o.value === value);
    if (!option) return;

    if (status === value) {
      setStatus(bookId, null);
      showToast(`Cleared reading status for "${bookName}"`);
    } else {
      setStatus(bookId, value);
      showToast(`${option.emoji} Marked "${bookName}" as ${option.label}!`);
    }
    setOpen(false);
  };

  const activeOption = status
    ? (READING_STATUS_OPTIONS.find((o) => o.value === status) ?? null)
    : null;

  return (
    <>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce rounded-2xl bg-[#241812] px-5 py-3 text-sm font-semibold text-[#EFE4D8] shadow-2xl ring-1 ring-[#D4A373]/30">
          ☕ {toastMessage}
        </div>
      )}

      <div className="mt-5 w-full rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#5B3315]">
          📚 Reading Status
        </p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`mt-2 flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 hover:shadow-sm active:scale-[0.99] ${
            activeOption
              ? `${activeOption.color} ${activeOption.textColor} ${activeOption.borderColor}`
              : "border-[#DCC8B6] bg-white text-[#6F5B50] hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
          }`}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">
              {activeOption ? activeOption.emoji : "🔖"}
            </span>
            <span>
              {activeOption ? activeOption.label : "Set Reading Status"}
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="mt-2 overflow-hidden rounded-xl border border-[#EADBCE] bg-white shadow-lg ring-1 ring-black/5">
            <div className="border-b border-[#F0E4D8] px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-[#8B6E5A]">
              How are you reading this?
            </div>
            <ul role="listbox" className="py-1">
              {READING_STATUS_OPTIONS.map((option) => {
                const isActive = status === option.value;
                return (
                  <li key={option.value} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? `${option.color} ${option.textColor} font-semibold`
                          : "text-[#3D2310] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                      {isActive && (
                        <Check className="ml-auto h-4 w-4 text-[#8B5A2B]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            {status && (
              <div className="border-t border-[#F0E4D8] px-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    setStatus(bookId, null);
                    setOpen(false);
                    showToast(`Cleared status for "${bookName}"`);
                  }}
                  className="text-xs font-medium text-[#8B6E5A] hover:text-[#6F4420] hover:underline"
                >
                  Clear status
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ReadingStatusTracker;
