import type { Metadata } from "next";
import type { ReactNode, ReactElement } from "react";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WishlistFAB from "@/components/ui/WishlistFAB";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Providers } from "@/context/Providers";
import { Toaster } from "@/components/ui/sonner";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Book Vibe — Coffee & Books Sanctuary",
  description:
    "A cozy sanctuary for book discovery, classic literature, and coffee lovers. Powered by Open Library and Internet Archive.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icons/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased">
        <Providers>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <WishlistFAB />
          <CommandPalette />
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
