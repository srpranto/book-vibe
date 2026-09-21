import booksData from "../../public/booksData.json";
import type { Book } from "@/types/book.type";

const books: Book[] = booksData;

export function getAllBooks(): Book[] {
  return books;
}

export function getBookById(id: string | number): Book | undefined {
  return books.find((b) => String(b.bookId) === String(id));
}

export function getRelatedBooks(book: Book, limit = 3): Book[] {
  const sameCat = books.filter(
    (b) => b.bookId !== book.bookId && b.category === book.category,
  );
  if (sameCat.length >= limit) return sameCat.slice(0, limit);

  const others = books.filter(
    (b) => b.bookId !== book.bookId && b.category !== book.category,
  );
  return [...sameCat, ...others].slice(0, limit);
}
