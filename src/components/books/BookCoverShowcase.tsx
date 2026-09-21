import type { ReactElement } from "react";
import Image from "next/image";
import type { Book } from "@/types/book.type";

interface BookCoverShowcaseProps {
  book: Book;
  estimatedHours: number;
}

const BookCoverShowcase = ({
  book,
  estimatedHours,
}: BookCoverShowcaseProps): ReactElement => {
  return (
    <div className="relative flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#FAF6F0] via-[#F5ECE3] to-[#EFE4D6] p-8 shadow-inner ring-1 ring-[#EADBCE]/60">
      <div className="relative h-full max-h-120 w-full">
        <Image
          src={book.image}
          alt={book.bookName}
          fill
          priority
          fetchPriority="high"
          quality={90}
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 40vw, 420px"
          className="rounded-xl object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
        />
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-xs font-bold text-[#241812] shadow-md backdrop-blur-md">
        <span className="text-[#D48B1B]">★</span> {book.rating}
        <span className="text-xs font-semibold text-[#4A3528]">/ 5.0</span>
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-xs font-bold text-[#3D2310] shadow-md backdrop-blur-md">
        <span>⏱</span> ~{estimatedHours}h read
      </div>
    </div>
  );
};

export default BookCoverShowcase;
