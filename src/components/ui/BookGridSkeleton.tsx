import type { ReactElement } from "react";
import BookCardSkeleton from "./BookCardSkeleton";

interface BookGridSkeletonProps {
  count?: number;
  className?: string;
}

const BookGridSkeleton = ({
  count = 8,
  className = "grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4",
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
