"use client";

import { useRef, useState } from "react";
import type { ReactElement } from "react";
import { Download, Upload, FileText, Check, AlertCircle } from "lucide-react";
import { useReadingStatus } from "@/context/ReadingStatusContext";
import { useWishlist } from "@/context/WishlistContext";
import { useMarginalia } from "@/context/MarginaliaContext";
import type { Book } from "@/types/book.type";
import type { ReadingStatusValue } from "@/types/reading-status.type";

interface LibraryDataToolsProps {
  allBooks: Book[];
}

const LibraryDataTools = ({ allBooks }: LibraryDataToolsProps): ReactElement => {
  const { statusMap, setStatus } = useReadingStatus();
  const { ids: wishlistIds, toggle } = useWishlist();
  const { marginaliaMap, importMap } = useMarginalia();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(
    null,
  );

  const showToast = (msg: string, type: "success" | "error" = "success"): void => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleExportMarkdown = (): void => {
    const trackedBookIds = Object.keys(statusMap).map(Number);
    const savedIds = Array.from(new Set([...trackedBookIds, ...wishlistIds]));

    if (savedIds.length === 0) {
      showToast("No books on your shelf yet to export.", "error");
      return;
    }

    const booksToExport = allBooks.filter((b) => savedIds.includes(b.bookId));

    let md = `# My Book Vibe Library\n\n`;
    md += `*Exported on ${new Date().toLocaleDateString(undefined, { dateStyle: "long" })}*\n\n`;
    md += `Total Books: ${booksToExport.length}\n\n`;
    md += `---\n\n`;

    booksToExport.forEach((book) => {
      const status = statusMap[book.bookId] || (wishlistIds.includes(book.bookId) ? "wishlist" : "untracked");
      const entry = marginaliaMap[book.bookId];

      md += `## ${book.bookName}\n`;
      md += `**Author:** ${book.author}  \n`;
      md += `**Category:** ${book.category}  \n`;
      md += `**Status:** ${status.replace(/_/g, " ").toUpperCase()}  \n`;
      md += `**Rating:** ${book.rating} / 5.0  \n`;
      md += `**Pages:** ${book.totalPages}  \n`;
      md += `**Publisher:** ${book.publisher} (${book.yearOfPublishing})  \n\n`;

      if (entry?.finishedDate) {
        md += `**Date Finished:** ${entry.finishedDate}  \n\n`;
      }

      if (entry?.notes?.trim()) {
        md += `### Personal Reflections\n`;
        md += `${entry.notes.trim()}\n\n`;
      }

      if (entry?.favoriteQuotes && entry.favoriteQuotes.length > 0) {
        md += `### Underlined Passages\n`;
        entry.favoriteQuotes.forEach((q) => {
          md += `> "${q}"\n\n`;
        });
      }

      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Book-Vibe-Library-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Downloaded formatted Markdown journal!");
  };

  const handleBackupJSON = (): void => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      readingStatus: statusMap,
      wishlist: wishlistIds,
      marginalia: marginaliaMap,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `book-vibe-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Backup saved to JSON file!");
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== "string") return;
        const parsed = JSON.parse(content);

        if (parsed.readingStatus && typeof parsed.readingStatus === "object") {
          for (const [idStr, stat] of Object.entries(parsed.readingStatus)) {
            if (typeof stat === "string") {
              setStatus(Number(idStr), stat as ReadingStatusValue);
            }
          }
        }

        if (Array.isArray(parsed.wishlist)) {
          parsed.wishlist.forEach((bId: number) => {
            if (!wishlistIds.includes(bId)) {
              toggle(bId);
            }
          });
        }

        if (parsed.marginalia && typeof parsed.marginalia === "object") {
          importMap(parsed.marginalia);
        }

        showToast("Library successfully restored!");
      } catch {
        showToast("Invalid backup file. Could not restore.", "error");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl ring-1 ${
            toast.type === "error"
              ? "bg-red-950 text-red-200 ring-red-800"
              : "bg-[#241812] text-[#EFE4D8] ring-[#D4A373]/30"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-400" />
          ) : (
            <Check className="h-4 w-4 text-[#D4A373]" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#5B3315]">
              Reader&apos;s Sovereignty & Library Tools
            </h3>
            <p className="text-xs text-[#6F5B50]">
              Export your shelf to Markdown (Obsidian/Notion ready) or backup and restore your offline data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCC8B6] bg-white px-3 py-1.5 text-xs font-bold text-[#4A2E18] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
            >
              <FileText className="h-3.5 w-3.5 text-[#8B5A2B]" />
              <span>Export to Markdown</span>
            </button>

            <button
              type="button"
              onClick={handleBackupJSON}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCC8B6] bg-white px-3 py-1.5 text-xs font-bold text-[#4A2E18] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
            >
              <Download className="h-3.5 w-3.5 text-[#8B5A2B]" />
              <span>Backup JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCC8B6] bg-white px-3 py-1.5 text-xs font-bold text-[#4A2E18] shadow-xs transition hover:border-[#8B5A2B] hover:bg-[#F5ECE3] hover:text-[#8B5A2B]"
            >
              <Upload className="h-3.5 w-3.5 text-[#8B5A2B]" />
              <span>Restore</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryDataTools;
