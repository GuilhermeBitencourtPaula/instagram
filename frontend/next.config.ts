import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Render as standalone bundle for Railway (smaller, self-contained)
  output: "standalone",

  // Allow images from external sources (Instagram CDN etc.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },

  // Expose env vars to the browser at build time
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
  },

  // Suppress noisy build output in Railway logs
  reactStrictMode: true,
};

export default nextConfig;
