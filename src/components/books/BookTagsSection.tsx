import type { ReactElement } from "react";

interface BookTagsSectionProps {
  tags: string[];
}

const BookTagsSection = ({
  tags,
}: BookTagsSectionProps): ReactElement | null => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span className="text-xs font-extrabold uppercase tracking-wider text-[#5C4537]">
        Tag :
      </span>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-muted px-3.5 py-1 text-xs font-bold text-[#5B3315] ring-1 ring-[#E8D5C4] transition hover:bg-[#E8D5C4]"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default BookTagsSection;
