"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";
import type { MarginaliaEntry, MarginaliaMap } from "@/types/marginalia.type";

const STORAGE_KEY = "book-vibe-marginalia";

interface MarginaliaContextType {
  marginaliaMap: MarginaliaMap;
  getEntry: (bookId: number) => MarginaliaEntry | null;
  updateNotes: (bookId: number, notes: string) => void;
  addQuote: (bookId: number, quote: string) => void;
  removeQuote: (bookId: number, quoteIndex: number) => void;
  setFinishedDate: (bookId: number, date?: string) => void;
  setUserRating: (bookId: number, rating?: number) => void;
  setCurrentPage: (bookId: number, page?: number) => void;
  clearEntry: (bookId: number) => void;
  isMounted: boolean;
}

const MarginaliaContext = createContext<MarginaliaContextType>({
  marginaliaMap: {},
  getEntry: () => null,
  updateNotes: () => {},
  addQuote: () => {},
  removeQuote: () => {},
  setFinishedDate: () => {},
  setUserRating: () => {},
  setCurrentPage: () => {},
  clearEntry: () => {},
  isMounted: false,
});

function parseMarginaliaMap(raw: string): MarginaliaMap {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      const result: MarginaliaMap = {};
      for (const [key, val] of Object.entries(parsed)) {
        const numKey = Number(key);
        if (!Number.isNaN(numKey) && typeof val === "object" && val !== null) {
          const entry = val as Partial<MarginaliaEntry>;
          result[numKey] = {
            bookId: numKey,
            notes: typeof entry.notes === "string" ? entry.notes : "",
            favoriteQuotes: Array.isArray(entry.favoriteQuotes)
              ? entry.favoriteQuotes.filter(
                  (q): q is string => typeof q === "string",
                )
              : [],
            finishedDate:
              typeof entry.finishedDate === "string"
                ? entry.finishedDate
                : undefined,
            userRating:
              typeof entry.userRating === "number" &&
              !Number.isNaN(entry.userRating)
                ? Math.min(5, Math.max(1, entry.userRating))
                : undefined,
            currentPage:
              typeof entry.currentPage === "number" &&
              !Number.isNaN(entry.currentPage)
                ? Math.max(0, entry.currentPage)
                : undefined,
            updatedAt:
              typeof entry.updatedAt === "string"
                ? entry.updatedAt
                : new Date().toISOString(),
          };
        }
      }
      return result;
    }
  } catch {
    return {};
  }
  return {};
}

export function MarginaliaProvider({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  const [marginaliaMap, setMarginaliaMap] = useState<MarginaliaMap>({});
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = parseMarginaliaMap(raw);
        queueMicrotask(() => {
          setMarginaliaMap(parsed);
        });
      }
    } catch {
    }
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  const saveToStorage = (map: MarginaliaMap): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
    }
  };

  const getEntry = useCallback(
    (bookId: number): MarginaliaEntry | null => {
      return marginaliaMap[bookId] ?? null;
    },
    [marginaliaMap],
  );

  const updateNotes = useCallback((bookId: number, notes: string): void => {
    setMarginaliaMap((prev) => {
      const current = prev[bookId] || {
        bookId,
        notes: "",
        favoriteQuotes: [],
        updatedAt: new Date().toISOString(),
      };
      const next: MarginaliaMap = {
        ...prev,
        [bookId]: {
          ...current,
          notes,
          updatedAt: new Date().toISOString(),
        },
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const addQuote = useCallback((bookId: number, quote: string): void => {
    const trimmed = quote.trim();
    if (!trimmed) return;
    setMarginaliaMap((prev) => {
      const current = prev[bookId] || {
        bookId,
        notes: "",
        favoriteQuotes: [],
        updatedAt: new Date().toISOString(),
      };
      if (current.favoriteQuotes.includes(trimmed)) return prev;
      const next: MarginaliaMap = {
        ...prev,
        [bookId]: {
          ...current,
          favoriteQuotes: [...current.favoriteQuotes, trimmed],
          updatedAt: new Date().toISOString(),
        },
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeQuote = useCallback(
    (bookId: number, quoteIndex: number): void => {
      setMarginaliaMap((prev) => {
        const current = prev[bookId];
        if (!current) return prev;
        const nextQuotes = current.favoriteQuotes.filter(
          (_, idx) => idx !== quoteIndex,
        );
        const next: MarginaliaMap = {
          ...prev,
          [bookId]: {
            ...current,
            favoriteQuotes: nextQuotes,
            updatedAt: new Date().toISOString(),
          },
        };
        saveToStorage(next);
        return next;
      });
    },
    [],
  );

  const setFinishedDate = useCallback((bookId: number, date?: string): void => {
    setMarginaliaMap((prev) => {
      const current = prev[bookId] || {
        bookId,
        notes: "",
        favoriteQuotes: [],
        updatedAt: new Date().toISOString(),
      };
      const next: MarginaliaMap = {
        ...prev,
        [bookId]: {
          ...current,
          finishedDate: date,
          updatedAt: new Date().toISOString(),
        },
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const setUserRating = useCallback((bookId: number, rating?: number): void => {
    setMarginaliaMap((prev) => {
      const current = prev[bookId] || {
        bookId,
        notes: "",
        favoriteQuotes: [],
        updatedAt: new Date().toISOString(),
      };
      const next: MarginaliaMap = {
        ...prev,
        [bookId]: {
          ...current,
          userRating:
            typeof rating === "number"
              ? Math.min(5, Math.max(1, Math.round(rating)))
              : undefined,
          updatedAt: new Date().toISOString(),
        },
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const setCurrentPage = useCallback((bookId: number, page?: number): void => {
    setMarginaliaMap((prev) => {
      const current = prev[bookId] || {
        bookId,
        notes: "",
        favoriteQuotes: [],
        updatedAt: new Date().toISOString(),
      };
      const next: MarginaliaMap = {
        ...prev,
        [bookId]: {
          ...current,
          currentPage:
            typeof page === "number"
              ? Math.max(0, Math.round(page))
              : undefined,
          updatedAt: new Date().toISOString(),
        },
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearEntry = useCallback((bookId: number): void => {
    setMarginaliaMap((prev) => {
      if (!prev[bookId]) return prev;
      const next = { ...prev };
      delete next[bookId];
      saveToStorage(next);
      return next;
    });
  }, []);

  return (
    <MarginaliaContext.Provider
      value={{
        marginaliaMap,
        getEntry,
        updateNotes,
        addQuote,
        removeQuote,
        setFinishedDate,
        setUserRating,
        setCurrentPage,
        clearEntry,
        isMounted,
      }}
    >
      {children}
    </MarginaliaContext.Provider>
  );
}

export const useMarginalia = (): MarginaliaContextType =>
  useContext(MarginaliaContext);
