import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    // Keep the existing alias
    config.resolve.alias["@"] = path.resolve(__dirname);

    // Add modules resolution for better path handling
    config.resolve.modules.push(path.resolve("./"));

    return config;
  },
  // Add experimental flag to ensure proper module resolution
  experimental: {
    esmExternals: "loose", // This might help with ESM/CJS interop issues
  },
};

export default nextConfig;
