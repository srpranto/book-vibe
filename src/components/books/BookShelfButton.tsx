"use client";

import { useTransition } from "react";
import type { ReactElement, MouseEvent } from "react";
import { Plus, Check, ChevronDown, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import { useCustomBooks } from "@/context/CustomBooksContext";
import {
  READING_STATUS_OPTIONS,
  type ReadingStatusValue,
} from "@/types/reading-status.type";
import type { Book } from "@/types/book.type";
import type { OpenLibraryBook } from "@/lib/openLibrary";

interface BookShelfButtonProps {
  book: Book | OpenLibraryBook;
  size?: "sm" | "default" | "lg";
  className?: string;
  variant?: "default" | "outline" | "secondary";
  compact?: boolean;
}

function isOpenLibraryBook(
  item: Book | OpenLibraryBook,
): item is OpenLibraryBook {
  return "authorName" in item && !("author" in item);
}

export function BookShelfButton({
  book,
  size = "sm",
  className = "",
  variant = "default",
  compact = false,
}: BookShelfButtonProps): ReactElement {
  const [, startTransition] = useTransition();
  const { getStatus, setStatus } = useReadingStatus();
  const { addOpenLibraryBook, saveCustomBook, removeCustomBook } =
    useCustomBooks();

  const bookKeyOrId = isOpenLibraryBook(book) ? book.key : book.bookId;
  const currentStatus = getStatus(bookKeyOrId);

  const activeOption = currentStatus
    ? READING_STATUS_OPTIONS.find((opt) => opt.value === currentStatus)
    : null;

  const handleSelectStatus = (
    e: Event | MouseEvent,
    status: ReadingStatusValue | null,
  ): void => {
    e.stopPropagation();

    startTransition(() => {
      if (isOpenLibraryBook(book)) {
        if (status) {
          addOpenLibraryBook(book, status);
        } else {
          setStatus(book.key, null);
        }
      } else {
        if (status) {
          saveCustomBook(book, status);
        } else {
          setStatus(book.bookId, null);
          if (book.isCustom) {
            removeCustomBook(book.bookId);
          }
        }
      }
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          size={size}
          variant={activeOption ? "secondary" : variant}
          className={`group font-bold transition-colors duration-150 justify-between select-none ${
            compact ? "h-7! px-2! text-xs!" : ""
          } ${
            activeOption
              ? `${activeOption.color} ${activeOption.textColor} border ${activeOption.borderColor} shadow-xs font-bold`
              : "shadow-2xs"
          } ${className}`}
          aria-label={`Reading status: ${activeOption ? activeOption.label : "Track to shelf"}`}
          title={`Status: ${activeOption ? activeOption.label : "Track Book"}`}
        >
          {compact ? (
            <>
              <span className="flex items-center gap-1 min-w-0 flex-1 text-left overflow-hidden">
                {activeOption ? (
                  <>
                    <span className="text-xs shrink-0 leading-none">
                      {activeOption.emoji}
                    </span>
                    <span className="truncate text-[11px] font-bold leading-none">
                      {activeOption.label}
                    </span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 stroke-[2.5] shrink-0" />
                    <span className="truncate text-[11px] font-bold leading-none">
                      Track
                    </span>
                  </>
                )}
              </span>
              <ChevronDown className="h-3 w-3 opacity-60 shrink-0 ml-1.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5 min-w-0 flex-1 text-left overflow-hidden">
                {activeOption ? (
                  <>
                    <span className="text-sm shrink-0 leading-none">
                      {activeOption.emoji}
                    </span>
                    <span className="truncate text-xs font-bold leading-none">
                      {activeOption.label}
                    </span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5 stroke-[2.5] shrink-0" />
                    <span className="truncate text-xs font-bold leading-none">
                      Track Book
                    </span>
                  </>
                )}
              </span>
              <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        sideOffset={6}
        className="w-56 max-w-[calc(100vw-2rem)] p-2 shadow-2xl z-[70] border border-[#DCC8B6] bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#8B6E5A]">
          Move to Shelf
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/60 my-1" />

        <div className="space-y-1">
          {READING_STATUS_OPTIONS.map((opt) => {
            const isSelected = currentStatus === opt.value;
            return (
              <DropdownMenuItem
                key={opt.value}
                onClick={(e) => handleSelectStatus(e, opt.value)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected
                    ? `${opt.color} ${opt.textColor} font-bold ring-1 ring-border`
                    : "text-[#3D2310] hover:bg-muted hover:text-primary"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base shrink-0">{opt.emoji}</span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </span>
                {isSelected && (
                  <Check className="h-4 w-4 text-primary stroke-[2.5]" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>

        {currentStatus && (
          <>
            <DropdownMenuSeparator className="bg-border/60 my-1" />
            <DropdownMenuItem
              onClick={(e) => handleSelectStatus(e, null)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove from Shelf</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
