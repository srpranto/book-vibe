export interface MarginaliaEntry {
  bookId: number;
  notes: string;
  favoriteQuotes: string[];
  finishedDate?: string;
  userRating?: number;
  currentPage?: number;
  updatedAt: string;
}

export type MarginaliaMap = Record<number, MarginaliaEntry>;
