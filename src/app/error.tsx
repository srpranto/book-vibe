"use client";

import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({
  error,
  reset,
}: ErrorProps): ReactElement {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md w-full rounded-3xl border border-border bg-white p-8 text-center shadow-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-200">
          <AlertCircle className="h-7 w-7 stroke-[2]" />
        </div>

        <h1 className="text-xl font-extrabold text-foreground tracking-tight sm:text-2xl">
          Something went quiet here
        </h1>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {error.message ||
            "An unexpected issue interrupted this page. You can try reloading or head back to the main catalog."}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={reset}
            variant="default"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-primary-hover active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCC8B6] bg-white px-5 py-2.5 text-sm font-bold text-[#4A2E18] shadow-xs transition hover:border-primary hover:bg-muted active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
