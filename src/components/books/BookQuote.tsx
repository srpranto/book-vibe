import type { ReactElement } from "react";

interface BookQuoteProps {
  quote: string;
  attribution: string;
}

const BookQuote = ({ quote, attribution }: BookQuoteProps): ReactElement => {
  return (
    <div className="mt-5 w-full rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[#5B3315]">
        ✨ From the Pages
      </p>
      <blockquote className="mt-2">
        <p className="text-xs italic leading-relaxed text-[#35231A] sm:text-sm">
          &ldquo;{quote}&rdquo;
        </p>
        <footer className="mt-2 text-[10px] font-semibold text-[#8B6E5A]">
          — {attribution}
        </footer>
      </blockquote>
    </div>
  );
};

export default BookQuote;
