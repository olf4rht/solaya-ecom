import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "pub-b09a781e649c4a3facf5c63382f0302d.r2.dev",
      },
    ],
  },
  async headers() {
    return [
      {
        // Enable SharedArrayBuffer for Gaussian Splat Web Workers
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/solaya-models/:path*",
        destination: "https://assets-bear.solaya-app.com/:path*",
      },
      {
        source: "/api/r2-files/:path*",
        destination: "https://pub-b09a781e649c4a3facf5c63382f0302d.r2.dev/:path*",
      },
    ];
  },
};

export default nextConfig;
