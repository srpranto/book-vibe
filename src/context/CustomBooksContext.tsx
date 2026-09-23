"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactElement, ReactNode } from "react";
import type { Book } from "@/types/book.type";
import {
  getDeterministicWorkBookId,
  type OpenLibraryBook,
} from "@/lib/openLibrary";
import type { ReadingStatusValue } from "@/types/reading-status.type";
import { useReadingStatus } from "@/context/ReadingStatusContext";

const STORAGE_KEY = "book-vibe-custom-books";

interface CustomBooksContextType {
  customBooks: Book[];
  addOpenLibraryBook: (
    olBook: OpenLibraryBook,
    initialStatus?: ReadingStatusValue,
  ) => Book;
  saveCustomBook: (book: Book, initialStatus?: ReadingStatusValue) => void;
  removeCustomBook: (bookId: number) => void;
  isBookTracked: (openLibraryKey: string) => boolean;
  getTrackedBookByOpenLibraryKey: (openLibraryKey: string) => Book | undefined;
  isMounted: boolean;
}

const CustomBooksContext = createContext<CustomBooksContextType>({
  customBooks: [],
  addOpenLibraryBook: () => ({
    bookId: 0,
    bookName: "",
    author: "",
    image: "",
    review: "",
    totalPages: 0,
    rating: 0,
    category: "",
    tags: [],
    publisher: "",
    yearOfPublishing: 0,
  }),
  saveCustomBook: () => {},
  removeCustomBook: () => {},
  isBookTracked: () => false,
  getTrackedBookByOpenLibraryKey: () => undefined,
  isMounted: false,
});

function loadCustomBooksFromStorage(): Book[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (b): b is Book =>
          typeof b === "object" &&
          b !== null &&
          typeof b.bookId === "number" &&
          typeof b.bookName === "string",
      );
    }
  } catch {
    return [];
  }
  return [];
}

function saveCustomBooksToStorage(books: Book[]): void {
  if (typeof window === "undefined") return;
  try {
    const currentOnDisk = loadCustomBooksFromStorage();
    const diskMap = new Map<number, Book>();
    currentOnDisk.forEach((b) => diskMap.set(b.bookId, b));
    books.forEach((b) => diskMap.set(b.bookId, b));
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(diskMap.values())),
    );
  } catch {
    return;
  }
}

export const CustomBooksProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [customBooks, setCustomBooks] = useState<Book[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { setStatus } = useReadingStatus();

  useEffect(() => {
    const loaded = loadCustomBooksFromStorage();
    queueMicrotask(() => {
      setCustomBooks(loaded);
      setIsMounted(true);
    });

    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEY) {
        const fresh = loadCustomBooksFromStorage();
        setCustomBooks(fresh);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isBookTracked = useCallback(
    (openLibraryKey: string): boolean => {
      const cleanKey = openLibraryKey.startsWith("/works/")
        ? openLibraryKey
        : `/works/${openLibraryKey}`;
      const detId = getDeterministicWorkBookId(openLibraryKey);
      return customBooks.some(
        (b) => b.openLibraryKey === cleanKey || b.bookId === detId,
      );
    },
    [customBooks],
  );

  const getTrackedBookByOpenLibraryKey = useCallback(
    (openLibraryKey: string): Book | undefined => {
      const cleanKey = openLibraryKey.startsWith("/works/")
        ? openLibraryKey
        : `/works/${openLibraryKey}`;
      const detId = getDeterministicWorkBookId(openLibraryKey);
      return customBooks.find(
        (b) => b.openLibraryKey === cleanKey || b.bookId === detId,
      );
    },
    [customBooks],
  );

  const addOpenLibraryBook = useCallback(
    (
      olBook: OpenLibraryBook,
      initialStatus: ReadingStatusValue = "plan_to_read",
    ): Book => {
      const newBookId = getDeterministicWorkBookId(olBook.key);

      const existing = customBooks.find(
        (b) => b.openLibraryKey === olBook.key || b.bookId === newBookId,
      );
      if (existing) {
        setStatus(existing.bookId, initialStatus);
        return existing;
      }

      const isBengali = olBook.languages.some(
        (l) => l.toLowerCase() === "ben" || l.toLowerCase() === "bengali",
      );

      const cleanWorkId = olBook.key.replace("/works/", "");
      const newBook: Book = {
        bookId: newBookId,
        bookName: olBook.title,
        author: olBook.authorName || "Unknown Author",
        image: olBook.coverUrl || "",
        review:
          olBook.review ||
          `Tracked from Open Library catalog (${olBook.editionCount} editions published).`,
        totalPages: olBook.totalPages || 320,
        rating: olBook.rating || 4.8,
        category:
          olBook.category ||
          (isBengali ? "Bengali Literature" : "World Literature"),
        tags: isBengali
          ? ["Open Library", "Bengali", "Classics"]
          : ["Open Library", "Classics"],
        publisher: "Open Library Record",
        yearOfPublishing: olBook.firstPublishYear || new Date().getFullYear(),
        source: "openlibrary",
        openLibraryKey: olBook.key,
        workId: cleanWorkId,
        iaId: olBook.iaId,
        readOnlineUrl:
          olBook.readOnlineUrl ||
          `https://openlibrary.org/works/${cleanWorkId}?mode=read`,
        hasFulltext: olBook.hasFulltext ?? Boolean(olBook.iaId),
        isCustom: true,
      };

      setCustomBooks((prev) => {
        const next = [...prev, newBook];
        saveCustomBooksToStorage(next);
        return next;
      });

      setStatus(newBookId, initialStatus);

      return newBook;
    },
    [customBooks, setStatus],
  );

  const saveCustomBook = useCallback(
    (book: Book, initialStatus?: ReadingStatusValue): void => {
      setCustomBooks((prev) => {
        const exists = prev.some(
          (b) =>
            b.bookId === book.bookId ||
            (b.openLibraryKey &&
              book.openLibraryKey &&
              b.openLibraryKey === book.openLibraryKey),
        );
        if (exists) {
          if (initialStatus) {
            setStatus(book.bookId, initialStatus);
          }
          return prev;
        }

        const cleanWorkId =
          book.workId ||
          (book.openLibraryKey
            ? book.openLibraryKey.replace("/works/", "")
            : undefined);
        const newBook: Book = {
          ...book,
          workId: cleanWorkId,
          isCustom: true,
        };
        const next = [...prev, newBook];
        saveCustomBooksToStorage(next);
        if (initialStatus) {
          setStatus(book.bookId, initialStatus);
        }
        return next;
      });
    },
    [setStatus],
  );

  const removeCustomBook = useCallback(
    (bookId: number): void => {
      setCustomBooks((prev) => {
        const next = prev.filter((b) => b.bookId !== bookId);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {
            return next;
          }
        }
        return next;
      });
      setStatus(bookId, null);
    },
    [setStatus],
  );

  return (
    <CustomBooksContext.Provider
      value={{
        customBooks,
        addOpenLibraryBook,
        saveCustomBook,
        removeCustomBook,
        isBookTracked,
        getTrackedBookByOpenLibraryKey,
        isMounted,
      }}
    >
      {children}
    </CustomBooksContext.Provider>
  );
};

export const useCustomBooks = (): CustomBooksContextType =>
  useContext(CustomBooksContext);
