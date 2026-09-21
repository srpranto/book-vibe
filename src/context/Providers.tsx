"use client";

import type { ReactElement, ReactNode } from "react";
import { WishlistProvider } from "./WishlistContext";
import { ReadingStatusProvider } from "./ReadingStatusContext";
import { MarginaliaProvider } from "./MarginaliaContext";

export function Providers({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <WishlistProvider>
      <ReadingStatusProvider>
        <MarginaliaProvider>{children}</MarginaliaProvider>
      </ReadingStatusProvider>
    </WishlistProvider>
  );
}

