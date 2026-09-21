import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";

export const metadata: Metadata = {
  title: "Book Vibe",
  description: "Book discovery and reading inspiration",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar/>
        {children}
        <h2 className="font-bold text-5xl bg-amber-400 py-7">Footer</h2>
      </body>
    </html>
  );
}
