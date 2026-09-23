"use client";

import { useState, useMemo } from "react";
import type { ReactElement } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export function parseDateParts(
  dateStr?: string,
): { year: number; month: number; day: number } | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

export function formatDateString(
  year: number,
  month: number,
  day: number,
): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return "";
  const parts = parseDateParts(dateStr);
  if (!parts) return dateStr;
  const monthAbbrs = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthAbbrs[parts.month]} ${parts.day}, ${parts.year}`;
}

export interface CalendarProps {
  value?: string; // "YYYY-MM-DD"
  onChange?: (dateString: string) => void;
  className?: string;
  onClose?: () => void;
}

interface CalendarDay {
  year: number;
  month: number;
  day: number;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export function Calendar({
  value,
  onChange,
  className,
  onClose,
}: CalendarProps): ReactElement {
  const selectedParts = useMemo(() => parseDateParts(value), [value]);

  const today = useMemo(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      dateString: formatDateString(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ),
    };
  }, []);

  // Current viewed month and year
  const [viewDate, setViewDate] = useState<{ year: number; month: number }>(
    () => {
      if (selectedParts) {
        return { year: selectedParts.year, month: selectedParts.month };
      }
      return { year: today.year, month: today.month };
    },
  );

  const prevMonth = (): void => {
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const nextMonth = (): void => {
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleSelectDay = (day: CalendarDay): void => {
    onChange?.(day.dateString);
    onClose?.();
  };

  const handleSelectToday = (): void => {
    onChange?.(today.dateString);
    setViewDate({ year: today.year, month: today.month });
    onClose?.();
  };

  const handleSelectYesterday = (): void => {
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const dateStr = formatDateString(
      yest.getFullYear(),
      yest.getMonth(),
      yest.getDate(),
    );
    onChange?.(dateStr);
    setViewDate({ year: yest.getFullYear(), month: yest.getMonth() });
    onClose?.();
  };

  const handleClear = (): void => {
    onChange?.("");
    onClose?.();
  };

  // Generate day matrix
  const days = useMemo<CalendarDay[]>(() => {
    const { year, month } = viewDate;
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 for Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const result: CalendarDay[] = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevY = month === 0 ? year - 1 : year;
      const prevM = month === 0 ? 11 : month - 1;
      const dateString = formatDateString(prevY, prevM, day);
      result.push({
        year: prevY,
        month: prevM,
        day,
        dateString,
        isCurrentMonth: false,
        isToday: dateString === today.dateString,
        isSelected: dateString === value,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateString = formatDateString(year, month, day);
      result.push({
        year,
        month,
        day,
        dateString,
        isCurrentMonth: true,
        isToday: dateString === today.dateString,
        isSelected: dateString === value,
      });
    }

    // Next month padding days to complete a multiple of 7 (up to 35 or 42 cells)
    const totalCells = result.length <= 35 ? 35 : 42;
    const remaining = totalCells - result.length;
    for (let day = 1; day <= remaining; day++) {
      const nextY = month === 11 ? year + 1 : year;
      const nextM = month === 11 ? 0 : month + 1;
      const dateString = formatDateString(nextY, nextM, day);
      result.push({
        year: nextY,
        month: nextM,
        day,
        dateString,
        isCurrentMonth: false,
        isToday: dateString === today.dateString,
        isSelected: dateString === value,
      });
    }

    return result;
  }, [viewDate, today.dateString, value]);

  return (
    <div
      className={cn(
        "w-[270px] select-none p-1 font-sans text-foreground",
        className,
      )}
    >
      {/* Calendar Header with Month/Year & Navigation */}
      <div className="flex items-center justify-between px-1 pb-3 pt-0.5 border-b border-border/70">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#2C1810]">
            {MONTH_NAMES[viewDate.month]}
          </span>
          <span className="text-xs font-semibold text-[#8B6E5A]">
            {viewDate.year}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-border/80 bg-white text-[#5B3315] shadow-2xs hover:bg-[#FAF4EE] hover:text-primary transition active:scale-95"
            aria-label="Previous Month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-border/80 bg-white text-[#5B3315] shadow-2xs hover:bg-[#FAF4EE] hover:text-primary transition active:scale-95"
            aria-label="Next Month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 pt-2 pb-1 text-center text-[10px] font-bold uppercase tracking-wider text-[#8B6E5A]/80">
        {WEEKDAYS.map((wd) => (
          <span key={wd} className="h-6 flex items-center justify-center">
            {wd}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 pt-1 pb-2">
        {days.map((d) => {
          return (
            <button
              key={d.dateString}
              type="button"
              onClick={() => handleSelectDay(d)}
              className={cn(
                "relative flex h-8 w-8 mx-auto items-center justify-center rounded-xl text-xs transition-all duration-150 active:scale-95",
                // Selected Day
                d.isSelected &&
                  "bg-primary text-white font-bold shadow-xs hover:bg-primary-hover",
                // Today (not selected)
                !d.isSelected &&
                  d.isToday &&
                  "ring-1 ring-primary font-bold text-primary bg-primary/10",
                // Current Month Regular Day
                !d.isSelected &&
                  !d.isToday &&
                  d.isCurrentMonth &&
                  "font-medium text-[#35231A] hover:bg-[#FAF4EE] hover:text-primary",
                // Outside Month Day
                !d.isSelected &&
                  !d.isToday &&
                  !d.isCurrentMonth &&
                  "text-[#A68F80]/50 hover:bg-[#FAF4EE] hover:text-[#5B3315]",
              )}
            >
              {d.day}
              {d.isToday && !d.isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Presets & Clear Footer */}
      <div className="flex items-center justify-between border-t border-border/70 pt-2.5 px-0.5 text-xs">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSelectToday}
            className="h-6.5 px-2 rounded-lg text-[11px] font-bold text-primary hover:bg-[#FAF4EE] hover:text-primary"
          >
            <Sparkles className="h-3 w-3 mr-1 text-primary" />
            Today
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSelectYesterday}
            className="h-6.5 px-2 rounded-lg text-[11px] font-medium text-[#5B3315] hover:bg-[#FAF4EE]"
          >
            Yesterday
          </Button>
        </div>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6.5 px-1.5 rounded-lg text-[11px] font-semibold text-[#8B6E5A] hover:text-rose-600 hover:bg-rose-50"
            title="Clear date"
          >
            <RotateCcw className="h-3 w-3 mr-0.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
