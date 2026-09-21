import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JourneysView } from "@/components/journeys/JourneysView";

export const metadata: Metadata = {
  title: "Reading Journeys | Book Vibe Library",
  description:
    "Curated thematic trails and literary syllabi connecting existential philosophy, Islamic classical thought, and Bengali masterworks.",
};

const JourneysPage = (): ReactElement => {
  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <JourneysView />
    </main>
  );
};

export default JourneysPage;
