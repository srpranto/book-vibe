"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";
import type {
  MarginaliaEntry,
  MarginaliaMap,
} from "@/types/marginalia.type";

const STORAGE_KEY = "book-vibe-marginalia";

interface MarginaliaContextType {
  marginaliaMap: MarginaliaMap;
  getEntry: (bookId: number) => MarginaliaEntry | null;
  updateNotes: (bookId: number, notes: string) => void;
  addQuote: (bookId: number, quote: string) => void;
  removeQuote: (bookId: number, quoteIndex: number) => void;
  setFinishedDate: (bookId: number, date?: string) => void;
  clearEntry: (bookId: number) => void;
  importMap: (imported: MarginaliaMap) => void;
  isMounted: boolean;
}

const MarginaliaContext = createContext<MarginaliaContextType>({
  marginaliaMap: {},
  getEntry: () => null,
  updateNotes: () => {},
  addQuote: () => {},
  removeQuote: () => {},
  setFinishedDate: () => {},
  clearEntry: () => {},
  importMap: () => {},
  isMounted: false,
});

function parseMarginaliaMap(raw: string): MarginaliaMap {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      const result: MarginaliaMap = {};
      for (const [key, val] of Object.entries(parsed)) {
        const numKey = Number(key);
        if (!Number.isNaN(numKey) && typeof val === "object" && val !== null) {
          const entry = val as Partial<MarginaliaEntry>;
          result[numKey] = {
            bookId: numKey,
            notes: typeof entry.notes === "string" ? entry.notes : "",
            favoriteQuotes: Array.isArray(entry.favoriteQuotes)
              ? entry.favoriteQuotes.filter((q): q is string => typeof q === "string")
              : [],
            finishedDate:
              typeof entry.finishedDate === "string"
                ? entry.finishedDate
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
      // Ignore storage errors
    }
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  const saveToStorage = (map: MarginaliaMap): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      // Ignore storage errors
    }
  };

  const getEntry = useCallback(
    (bookId: number): MarginaliaEntry | null => {
      return marginaliaMap[bookId] ?? null;
    },
    [marginaliaMap],
  );

  const updateNotes = useCallback(
    (bookId: number, notes: string): void => {
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
    },
    [],
  );

  const addQuote = useCallback(
    (bookId: number, quote: string): void => {
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
    },
    [],
  );

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

  const setFinishedDate = useCallback(
    (bookId: number, date?: string): void => {
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
    },
    [],
  );

  const clearEntry = useCallback((bookId: number): void => {
    setMarginaliaMap((prev) => {
      if (!prev[bookId]) return prev;
      const next = { ...prev };
      delete next[bookId];
      saveToStorage(next);
      return next;
    });
  }, []);

  const importMap = useCallback((imported: MarginaliaMap): void => {
    setMarginaliaMap((prev) => {
      const next = { ...prev, ...imported };
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
        clearEntry,
        importMap,
        isMounted,
      }}
    >
      {children}
    </MarginaliaContext.Provider>
  );
}

export const useMarginalia = (): MarginaliaContextType =>
  useContext(MarginaliaContext);
