import type { ReactElement } from "react";
import BookDetailsSkeleton from "@/components/ui/BookDetailsSkeleton";

export default function Loading(): ReactElement {
  return <BookDetailsSkeleton />;
}
