"use client";

import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Target, Trophy, Edit3, Check, Sparkles } from "lucide-react";

interface ReadingGoalCardProps {
  completedCount: number;
}

const STORAGE_KEY = "book-vibe-reading-goal";
const DEFAULT_TARGET = 12;

function parseGoalTarget(raw: unknown): number | null {
  if (
    typeof raw === "object" &&
    raw !== null &&
    "target" in raw &&
    typeof (raw as { target: unknown }).target === "number" &&
    (raw as { target: number }).target > 0
  ) {
    return (raw as { target: number }).target;
  }
  return null;
}

export const ReadingGoalCard = ({
  completedCount,
}: ReadingGoalCardProps): ReactElement => {
  const currentYear = new Date().getFullYear();
  const [target, setTarget] = useState<number>(DEFAULT_TARGET);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempTarget, setTempTarget] = useState<string>(String(DEFAULT_TARGET));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        const validTarget = parseGoalTarget(parsed);
        if (validTarget !== null) {
          queueMicrotask(() => {
            setTarget(validTarget);
            setTempTarget(String(validTarget));
          });
        }
      }
    } catch {
      return;
    }

    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed: unknown = JSON.parse(e.newValue);
          const validTarget = parseGoalTarget(parsed);
          if (validTarget !== null) {
            setTarget(validTarget);
            setTempTarget(String(validTarget));
          }
        } catch {
          return;
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSaveTarget = (): void => {
    const val = parseInt(tempTarget, 10);
    if (!Number.isNaN(val) && val > 0) {
      setTarget(val);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ target: val, year: currentYear }),
        );
      } catch {
        return;
      }
    }
    setIsEditing(false);
  };

  const pct = Math.min(100, Math.round((completedCount / target) * 100));
  const isCompleted = completedCount >= target;
  const remaining = Math.max(0, target - completedCount);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-xs sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-xs ${
              isCompleted
                ? "bg-amber-100 text-amber-800 ring-2 ring-amber-400"
                : "bg-muted text-primary"
            }`}
          >
            {isCompleted ? (
              <Trophy className="h-6 w-6" />
            ) : (
              <Target className="h-6 w-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-foreground">
                Reading Goal Challenge
              </h2>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                  <Sparkles className="h-3 w-3" /> Goal Reached!
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              {isCompleted
                ? `Congratulations! You accomplished your reading goal of ${target} books!`
                : `${completedCount} of ${target} books completed (${pct}%) — ${remaining} more to go`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveTarget();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-[#DCC8B6] bg-background p-1"
            >
              <input
                type="number"
                min={1}
                max={500}
                value={tempTarget}
                onChange={(e) => setTempTarget(e.target.value)}
                aria-label="Reading goal target number"
                className="w-16 rounded-lg bg-white px-2 py-1 text-center text-xs font-bold text-foreground focus:outline-hidden"
                autoFocus
              />
              <button
                type="submit"
                aria-label="Save goal target"
                className="rounded-lg bg-primary p-1.5 text-white shadow-xs hover:bg-primary-hover transition active:scale-95"
                title="Save goal (Enter)"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <Button
              onClick={() => {
                setTempTarget(String(target));
                setIsEditing(true);
              }}
              aria-label={`Change reading goal target, current target is ${target}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCC8B6] bg-white px-3 py-1.5 text-xs font-semibold text-[#5B3315] shadow-2xs transition hover:border-primary hover:bg-muted"
              title="Change reading goal target"
            >
              <Edit3 className="h-3 w-3 text-primary" />
              <span>Target: {target}</span>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isCompleted
                ? "bg-linear-to-r from-amber-500 to-amber-600 shadow-sm"
                : "bg-linear-to-r from-primary to-[#C17937]"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-[#8B6E5A]">
          <span>0 books</span>
          <span className="font-extrabold text-foreground">{pct}% complete</span>
          <span>{target} books target</span>
        </div>
      </div>
    </div>
  );
};

export default ReadingGoalCard;
