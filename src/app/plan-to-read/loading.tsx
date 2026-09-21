import type { ReactElement } from "react";
import AllBooksSkeleton from "@/components/ui/AllBooksSkeleton";

export default function PlanToReadLoading(): ReactElement {
  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <AllBooksSkeleton />
    </main>
  );
}
