import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        // Profile images (avatar)
        protocol: "https",
        hostname: "pbs.twimg.com",
        pathname: "/profile_images/**",
      },
      {
        // Tweet media photos returned by the syndication API
        protocol: "https",
        hostname: "pbs.twimg.com",
        pathname: "/media/**",
      },
      {
        // Tweet card / ext_tw_video_thumb thumbnails
        protocol: "https",
        hostname: "pbs.twimg.com",
        pathname: "/ext_tw_video_thumb/**",
      },
      {
        // Occasional card images served from ton.twimg.com
        protocol: "https",
        hostname: "ton.twimg.com",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["10.127.149.51"],
};

export default nextConfig;
