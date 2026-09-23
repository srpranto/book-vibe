"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import Image from "next/image";

interface AestheticBookCoverProps {
  title: string;
  author: string;
  coverUrl?: string | null;
  category?: string;
  size?: "compact" | "normal" | "large" | "fill";
  className?: string;
  priority?: boolean;
}

export const AestheticBookCover = ({
  title,
  author,
  coverUrl,
  category,
  size = "normal",
  className = "",
  priority = false,
}: AestheticBookCoverProps): ReactElement => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [prevCoverUrl, setPrevCoverUrl] = useState<string | null | undefined>(
    coverUrl,
  );

  if (prevCoverUrl !== coverUrl) {
    setPrevCoverUrl(coverUrl);
    setHasError(false);
  }

  const cleanUrl = coverUrl && coverUrl.trim() ? coverUrl : null;
  const canShowImage = Boolean(cleanUrl) && !hasError;

  if (size === "compact") {
    if (!canShowImage || !cleanUrl) {
      return (
        <div
          className={`relative flex h-16 w-11 shrink-0 flex-col items-center justify-between overflow-hidden rounded-md border border-secondary/40 bg-linear-to-br from-[#2E1D13] via-[#3E2719] to-[#24170F] p-1 text-center shadow-xs select-none ${className}`}
          title={`${title} by ${author}`}
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-black/40 rounded-l-md" />
          <span className="text-[6px] font-bold text-secondary">✦</span>
          <p className="line-clamp-2 font-serif text-[8px] font-bold leading-tight text-background">
            {title}
          </p>
          <p className="line-clamp-1 text-[6px] font-medium text-[#D8C7B8]">
            {author}
          </p>
        </div>
      );
    }

    return (
      <div
        className={`relative h-16 w-11 shrink-0 overflow-hidden rounded-md bg-muted shadow-xs ${className}`}
      >
        <Image
          src={cleanUrl}
          alt={title}
          fill
          unoptimized
          sizes="48px"
          className="object-cover"
          priority={priority}
          onError={() => setHasError(true)}
          onLoad={(e) => {
            if (
              e.currentTarget.naturalWidth <= 1 ||
              e.currentTarget.naturalHeight <= 1
            ) {
              setHasError(true);
            }
          }}
        />
      </div>
    );
  }

  if (size === "large") {
    if (!canShowImage || !cleanUrl) {
      return (
        <div
          className={`relative flex aspect-3/4 max-h-120 w-full max-w-sm flex-col items-center justify-between rounded-2xl border-2 border-secondary/60 bg-linear-to-br from-[#2E1D13] via-[#3E2719] to-[#1F120A] p-6 text-center text-background shadow-2xl ring-1 ring-inset ring-secondary/30 select-none sm:p-8 ${className}`}
        >
          <div className="absolute inset-y-0 left-0 w-3.5 bg-linear-to-r from-black/50 to-transparent rounded-l-2xl" />

          <div className="pt-2">
            <span className="inline-block rounded-full border border-secondary/40 bg-secondary/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-secondary">
              {category || "Open Library Masterwork"}
            </span>
          </div>

          <div className="my-auto px-4 py-6">
            <span className="mb-2 block text-sm text-secondary">✦ ✦ ✦</span>
            <h2 className="font-serif text-2xl font-black tracking-tight text-background sm:text-3xl leading-snug drop-shadow-md">
              {title}
            </h2>
            <div className="mx-auto my-3 h-px w-16 bg-secondary/40" />
            <p className="text-sm font-semibold uppercase tracking-widest text-[#E8D5C4]">
              {author}
            </p>
          </div>

          <div className="pb-2 text-[9px] uppercase tracking-widest text-[#A68F80]">
            Book Vibe • Quiet Reading Collection
          </div>
        </div>
      );
    }

    return (
      <div
        className={`relative flex h-full max-h-120 w-full items-center justify-center ${className}`}
      >
        <Image
          src={cleanUrl}
          alt={title}
          fill
          unoptimized
          priority={priority}
          quality={90}
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 40vw, 420px"
          className="rounded-xl object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
          onError={() => setHasError(true)}
          onLoad={(e) => {
            if (
              e.currentTarget.naturalWidth <= 1 ||
              e.currentTarget.naturalHeight <= 1
            ) {
              setHasError(true);
            }
          }}
        />
      </div>
    );
  }

  if (!canShowImage || !cleanUrl) {
    return (
      <div
        className={`relative mx-auto flex h-full w-full min-h-45 flex-col items-center justify-between overflow-hidden rounded-xl border border-secondary/50 bg-linear-to-br from-[#2E1D13] via-[#3A2417] to-[#22150D] p-3 text-center shadow-md transition-transform duration-300 group-hover:scale-105 select-none sm:p-4 ${className}`}
      >
        <div className="absolute inset-y-0 left-0 w-2.5 bg-linear-to-r from-black/50 to-transparent rounded-l-xl" />

        <div className="pt-1 max-w-full px-1">
          <span className="line-clamp-1 text-[8px] font-bold uppercase tracking-[0.2em] text-secondary">
            {category || "Classic Record"}
          </span>
        </div>

        <div className="my-auto px-2">
          <span className="block text-[10px] text-secondary/80">✦</span>
          <p className="line-clamp-3 font-serif text-xs sm:text-sm font-bold leading-tight text-background drop-shadow-sm">
            {title}
          </p>
          <div className="mx-auto my-1.5 h-px w-8 bg-secondary/30" />
          <p className="line-clamp-1 text-[10px] font-medium text-[#E8D5C4]">
            {author}
          </p>
        </div>

        <div className="pb-0.5 text-[7px] font-semibold uppercase tracking-widest text-[#A68F80]">
          Open Library Edition
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative mx-auto flex h-full w-full min-h-45 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#FAF6F0] via-muted to-[#EFE4D6] p-2 transition-colors duration-300 ${className}`}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <Image
          src={cleanUrl}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 640px) 45vw, (max-width: 768px) 44vw, (max-width: 1024px) 30vw, 240px"
          className="rounded-lg object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          priority={priority}
          onError={() => setHasError(true)}
          onLoad={(e) => {
            if (
              e.currentTarget.naturalWidth <= 1 ||
              e.currentTarget.naturalHeight <= 1
            ) {
              setHasError(true);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AestheticBookCover;
