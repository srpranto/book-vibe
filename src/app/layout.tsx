import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WishlistFAB from "@/components/ui/WishlistFAB";
import { Providers } from "@/context/Providers";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Book Vibe — Coffee & Books",
  description:
    "A cozy sanctuary for book discovery, classic literature, and coffee lovers",
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
}: Readonly<{ children: ReactNode }>): React.ReactElement {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="flex min-h-full flex-col bg-[#FAF7F2] text-[#241812] font-sans antialiased">
        <Providers>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <WishlistFAB />
        </Providers>
      </body>
    </html>
  );
}
