import type { Metadata } from "next";
import type { ReactElement } from "react";
import Banner from "@/components/homepage/Banner";
import Books from "@/components/homepage/Books";
import { OPEN_LIBRARY_FEATURED_BOOKS } from "@/lib/openLibrary";

export const metadata: Metadata = {
  title: "Book Vibe — Coffee, Books & Literary Sanctuary",
  description:
    "A cozy sanctuary for book discovery, classic literature, and coffee lovers. Explore timeless masterworks and build your personal reading shelf.",
};

const Homepage = (): ReactElement => {
  const initialFeaturedBooks = OPEN_LIBRARY_FEATURED_BOOKS.slice(0, 12);

  return (
    <main>
      <Banner />
      <Books initialBooks={initialFeaturedBooks} />
    </main>
  );
};

export default Homepage;
