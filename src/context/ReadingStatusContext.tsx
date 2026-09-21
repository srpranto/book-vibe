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

const STORAGE_KEY = "book-vibe-reading-status";

type StatusMap = Record<number, ReadingStatusValue>;

interface ReadingStatusContextType {
  statusMap: StatusMap;
  getStatus: (bookId: number) => ReadingStatusValue | null;
  setStatus: (bookId: number, status: ReadingStatusValue | null) => void;
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
      return;
    }
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  const setStatus = useCallback(
    (bookId: number, status: ReadingStatusValue | null): void => {
      setStatusMap((prev) => {
        const next: StatusMap = { ...prev };
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
    },
    [],
  );

  const getStatus = useCallback(
    (bookId: number): ReadingStatusValue | null => {
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
