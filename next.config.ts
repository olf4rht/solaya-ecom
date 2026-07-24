import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
