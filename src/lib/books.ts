import type { Book } from "@/types/book.type";
import {
  OPEN_LIBRARY_FEATURED_BOOKS,
  convertOpenLibraryBookToBook,
  getDeterministicWorkBookId,
} from "./openLibrary";

const books: Book[] = OPEN_LIBRARY_FEATURED_BOOKS.map(
  convertOpenLibraryBookToBook,
);

export function getAllBooks(): Book[] {
  return books;
}

export function getBookById(id: string | number): Book | undefined {
  if (id === undefined || id === null) return undefined;
  const strId = String(id).trim();

  // 1. Direct match by numeric bookId
  const byId = books.find((b) => String(b.bookId) === strId);
  if (byId) return byId;

  // 2. Match by workId or Open Library key (/works/OL...)
  const cleanSearch = strId.replace("/works/", "");
  const byOlKey = books.find((b) => {
    if (b.workId === cleanSearch) return true;
    if (!b.openLibraryKey) return false;
    const cleanKey = b.openLibraryKey.replace("/works/", "");
    return (
      b.openLibraryKey === strId ||
      b.openLibraryKey === `/works/${cleanSearch}` ||
      cleanKey === cleanSearch
    );
  });
  if (byOlKey) return byOlKey;

  // 3. Match by deterministic hash
  const hashId = getDeterministicWorkBookId(strId);
  const byHash = books.find((b) => b.bookId === hashId);
  if (byHash) return byHash;

  // 4. 1-based index fallback for legacy routes
  const numericVal = Number(strId);
  if (
    !Number.isNaN(numericVal) &&
    numericVal >= 1 &&
    numericVal <= books.length
  ) {
    return books[numericVal - 1];
  }

  return undefined;
}
