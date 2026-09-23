"use client";

import type { ReactElement, ReactNode } from "react";
import { ReadingStatusProvider } from "./ReadingStatusContext";
import { MarginaliaProvider } from "./MarginaliaContext";
import { CustomBooksProvider } from "./CustomBooksContext";
import { FeedbackProvider } from "./FeedbackContext";

export function Providers({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <FeedbackProvider>
      <ReadingStatusProvider>
        <CustomBooksProvider>
          <MarginaliaProvider>{children}</MarginaliaProvider>
        </CustomBooksProvider>
      </ReadingStatusProvider>
    </FeedbackProvider>
  );
}
