import type { ReactElement } from "react";
import BookCardSkeleton from "./BookCardSkeleton";

interface BookGridSkeletonProps {
  count?: number;
  className?: string;
}

const BookGridSkeleton = ({
  count = 12,
  className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6",
}: BookGridSkeletonProps): ReactElement => {
  return (
    <div
      aria-hidden="true"
      aria-label="Loading books catalog"
      className={className}
    >
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default BookGridSkeleton;
