import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        pathname: "/profile_images/**",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["10.127.149.51"],
};

export default nextConfig;
