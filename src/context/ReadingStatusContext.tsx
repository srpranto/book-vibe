"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";
import {
  READING_STATUS_OPTIONS,
  type ReadingStatusValue,
} from "@/types/reading-status.type";
import { useFeedback } from "@/context/FeedbackContext";
import { getDeterministicWorkBookId } from "@/lib/openLibrary";

const STORAGE_KEY = "book-vibe-reading-status";

type StatusMap = Record<number, ReadingStatusValue>;

export function normalizeBookId(val: number | string): number {
  if (typeof val === "number") return val;
  const trimmed = val.trim();
  const num = Number(trimmed);
  if (!Number.isNaN(num) && /^\d+$/.test(trimmed)) {
    return num;
  }
  return getDeterministicWorkBookId(trimmed);
}

interface ReadingStatusContextType {
  statusMap: StatusMap;
  getStatus: (bookId: number | string) => ReadingStatusValue | null;
  setStatus: (
    bookId: number | string,
    status: ReadingStatusValue | null,
  ) => void;
  isMounted: boolean;
}

const ReadingStatusContext = createContext<ReadingStatusContextType>({
  statusMap: {},
  getStatus: () => null,
  setStatus: () => {},
  isMounted: false,
});

function isReadingStatusValue(value: unknown): value is ReadingStatusValue {
  return (
    typeof value === "string" &&
    READING_STATUS_OPTIONS.some((opt) => opt.value === value)
  );
}

function parseStatusMap(raw: string): StatusMap {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      const result: StatusMap = {};
      for (const [key, value] of Object.entries(parsed)) {
        const numKey = Number(key);
        if (!Number.isNaN(numKey) && isReadingStatusValue(value)) {
          result[numKey] = value;
        }
      }
      return result;
    }
  } catch {
    return {};
  }
  return {};
}

export function ReadingStatusProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { notify } = useFeedback();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsedMap = parseStatusMap(raw);
        queueMicrotask(() => {
          setStatusMap(parsedMap);
        });
      }
    } catch {
      queueMicrotask(() => {
        setStatusMap({});
      });
    }
    queueMicrotask(() => {
      setIsMounted(true);
    });

    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEY) {
        if (!e.newValue) {
          setStatusMap({});
          return;
        }
        setStatusMap(parseStatusMap(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setStatus = useCallback(
    (bookIdOrKey: number | string, status: ReadingStatusValue | null): void => {
      const bookId = normalizeBookId(bookIdOrKey);

      setStatusMap((prev) => {
        let currentDiskMap: StatusMap = {};
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) currentDiskMap = parseStatusMap(raw);
        } catch {
          currentDiskMap = prev;
        }

        const next: StatusMap = { ...currentDiskMap };
        if (status === null) {
          delete next[bookId];
        } else {
          next[bookId] = status;
        }

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          return next;
        }
        return next;
      });

      if (status) {
        const option = READING_STATUS_OPTIONS.find(
          (opt) => opt.value === status,
        );
        const label = option ? option.label : status;
        notify(`Moved to "${label}" shelf`, "success");
      } else {
        notify("Removed from your shelf", "info");
      }
    },
    [notify],
  );

  const getStatus = useCallback(
    (bookIdOrKey: number | string): ReadingStatusValue | null => {
      const bookId = normalizeBookId(bookIdOrKey);
      return statusMap[bookId] ?? null;
    },
    [statusMap],
  );

  return (
    <ReadingStatusContext.Provider
      value={{ statusMap, getStatus, setStatus, isMounted }}
    >
      {children}
    </ReadingStatusContext.Provider>
  );
}

export const useReadingStatus = (): ReadingStatusContextType =>
  useContext(ReadingStatusContext);
