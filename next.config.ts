import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    unoptimized: true,
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1536],
    imageSizes: [64, 128, 196, 256, 320, 384, 480],
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
