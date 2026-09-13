import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow portfolio/blog images stored in Supabase Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xzolxbgvqxnaklgldfgj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;