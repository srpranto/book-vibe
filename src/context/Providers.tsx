"use client";

import type { ReactElement, ReactNode } from "react";
import { WishlistProvider } from "./WishlistContext";
import { ReadingStatusProvider } from "./ReadingStatusContext";

export function Providers({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <WishlistProvider>
      <ReadingStatusProvider>{children}</ReadingStatusProvider>
    </WishlistProvider>
  );
}
