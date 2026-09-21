import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { GitCommit, ArrowRight, Sparkles } from "lucide-react";
import { getKinshipForBook } from "@/lib/literaryKinship";

interface LiteraryKinshipSectionProps {
  bookId: number;
  bookName: string;
}

const LiteraryKinshipSection = ({
  bookId,
  bookName,
}: LiteraryKinshipSectionProps): ReactElement | null => {
  const kinshipList = getKinshipForBook(bookId);

  if (!kinshipList || kinshipList.length === 0) return null;

  return (
    <section className="mt-12 rounded-3xl border border-[#EADBCE] bg-[#FAF7F2]/90 p-6 shadow-xs md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#7A4B22] ring-1 ring-[#E8D5C4]">
            <Sparkles className="h-3 w-3 text-[#8B5A2B]" /> Literary Kinship & Dialogue
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-[#241812] sm:text-2xl">
            Books in Conversation with &ldquo;{bookName}&rdquo;
          </h2>
          <p className="mt-1 max-w-2xl text-xs font-medium leading-relaxed text-[#5C4537] sm:text-sm">
            Great books do not exist in isolation. These works share intellectual lineage, philosophical dialogue, or kindred psychological sensibilities.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {kinshipList.map(({ book, connectionType, rationale }) => (
          <div
            key={book.bookId}
            className="flex flex-col justify-between rounded-2xl border border-[#EADBCE] bg-white p-4 shadow-xs transition hover:border-[#D4A373] sm:p-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F5ECE3] px-2.5 py-0.5 text-[11px] font-bold text-[#7A4B22]">
                  <GitCommit className="h-3 w-3 text-[#8B5A2B]" />
                  {connectionType}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-[#241812]">
                  <span className="text-[#D48B1B]">★</span>
                  <span>{book.rating}</span>
                </div>
              </div>

              <div className="mt-3.5 flex gap-3.5">
                <Link
                  href={`/books/${book.bookId}`}
                  className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-[#FAF6F0] to-[#EFE4D6] p-1 shadow-xs transition hover:scale-105"
                >
                  <Image
                    src={book.image}
                    alt={book.bookName}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-[#241812] transition hover:text-[#8B5A2B]">
                    <Link href={`/books/${book.bookId}`}>
                      {book.bookName}
                    </Link>
                  </h3>
                  <p className="text-xs font-medium text-[#6F5B50]">
                    By <span className="font-semibold text-[#3D2310]">{book.author}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8B6E5A]">
                    {book.category} &bull; {book.yearOfPublishing}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-[#F0E4D8] bg-[#FAF7F2] p-3 text-xs leading-relaxed text-[#35231A]">
                <p className="italic text-[#4A3528]">
                  &ldquo;{rationale}&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F5ECE3] flex justify-end">
              <Link
                href={`/books/${book.bookId}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#8B5A2B] transition hover:text-[#6F4420]"
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
