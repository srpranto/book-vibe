export interface MarginaliaEntry {
  bookId: number;
  notes: string;
  favoriteQuotes: string[];
  finishedDate?: string;
  updatedAt: string;
}

export type MarginaliaMap = Record<number, MarginaliaEntry>;
