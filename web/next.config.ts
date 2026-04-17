import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ticketbay_tracker",
  images: { unoptimized: true },
};

export default nextConfig;
