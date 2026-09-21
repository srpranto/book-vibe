"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";

const KEY = "book-vibe-wishlist";

interface WishlistCtx {
  ids: number[];
  toggle: (bookId: number) => void;
  isWishlisted: (bookId: number) => boolean;
  remove: (bookId: number) => void;
}

const WishlistContext = createContext<WishlistCtx>({
  ids: [],
  toggle: () => {},
  isWishlisted: () => false,
  remove: () => {},
});

function parseNumberArray(raw: string): number[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.every((item): item is number => typeof item === "number")
    ) {
      return parsed;
    }
  } catch {
    return [];
  }
  return [];
}

export function WishlistProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = parseNumberArray(raw);
        queueMicrotask(() => {
          setIds(parsed);
        });
      }
    } catch {
      return;
    }
  }, []);

  const toggle = useCallback((bookId: number): void => {
    setIds((prev) => {
      const next = prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        return next;
      }
      return next;
    });
  }, []);

  const remove = useCallback((bookId: number): void => {
    setIds((prev) => {
      const next = prev.filter((id) => id !== bookId);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        return next;
      }
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (bookId: number): boolean => ids.includes(bookId),
    [ids],
  );

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = (): WishlistCtx => useContext(WishlistContext);
