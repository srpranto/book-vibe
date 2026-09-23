import type { ReactElement } from "react";
import Link from "next/link";
import { GitCommit, ArrowRight, Sparkles } from "lucide-react";
import { getKinshipForBook } from "@/lib/literaryKinship";
import { AestheticBookCover } from "@/components/ui/AestheticBookCover";

interface LiteraryKinshipSectionProps {
  bookId: number;
  bookName: string;
  category?: string;
}

const LiteraryKinshipSection = ({
  bookId,
  bookName,
  category,
}: LiteraryKinshipSectionProps): ReactElement | null => {
  const kinshipList = getKinshipForBook(bookId, category, bookName);

  if (!kinshipList || kinshipList.length === 0) return null;

  return (
    <section className="mt-12 rounded-3xl border border-border bg-background/90 p-6 shadow-xs md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#7A4B22] ring-1 ring-[#E8D5C4]">
            <Sparkles className="h-3 w-3 text-primary" /> Related Books
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            More Books Like &ldquo;{bookName}&rdquo;
          </h2>
          <p className="mt-1 max-w-2xl text-xs font-medium leading-relaxed text-[#5C4537] sm:text-sm">
            Discover books with similar themes, genres, and narrative styles.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {kinshipList.map(({ book, connectionType, rationale }) => (
          <div
            key={book.bookId}
            className="flex flex-col justify-between rounded-2xl border border-border bg-white p-4 shadow-xs transition hover:border-secondary sm:p-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-[#7A4B22]">
                  <GitCommit className="h-3 w-3 text-primary" />
                  {connectionType}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                  <span className="text-[#D48B1B]">★</span>
                  <span>{book.rating}</span>
                </div>
              </div>

              <div className="mt-3.5 flex gap-3.5">
                <Link
                  href={`/books/${book.bookId}`}
                  className="shrink-0 focus:outline-hidden"
                >
                  <AestheticBookCover
                    title={book.bookName}
                    author={book.author}
                    coverUrl={book.image}
                    category={book.category}
                    size="compact"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-foreground transition hover:text-primary">
                    <Link href={`/books/${book.bookId}`}>{book.bookName}</Link>
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground">
                    By{" "}
                    <span className="font-semibold text-[#3D2310]">
                      {book.author}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8B6E5A]">
                    {book.category} &bull; {book.yearOfPublishing}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-border-subtle bg-background p-3 text-xs leading-relaxed text-[#35231A]">
                <p className="italic text-[#4A3528]">
                  &ldquo;{rationale}&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-muted flex justify-end">
              <Link
                href={`/books/${book.bookId}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary transition hover:text-primary-hover"
              >
                <span>Explore Connection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiteraryKinshipSection;
