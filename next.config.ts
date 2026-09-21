import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    // Serve modern formats — AVIF first, WebP fallback, then JPEG
    formats: ["image/avif", "image/webp"],

    // Only generate these widths — matches our actual grid slot sizes.
    // Mobile card: ~195px, sm card: ~256px, md card: ~320px, lg/xl: ~380px
    // Detail page cover: up to 480px. Avoids wasteful 1080px downloads.
    deviceSizes: [390, 640, 768, 1024, 1280, 1536],
    imageSizes: [64, 128, 196, 256, 320, 384, 480],

    // Cache optimized images for 7 days (OpenLibrary covers rarely change)
    minimumCacheTTL: 604800,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "archive.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.archive.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/books/content",
      },
    ],
  },

  async rewrites() {
    return [
      { source: "/icon.png", destination: "/icons/icon.png" },
      { source: "/icon.svg", destination: "/icons/icon.svg" },
      { source: "/apple-icon.png", destination: "/icons/apple-icon.png" },
    ];
  },
};

export default nextConfig;
