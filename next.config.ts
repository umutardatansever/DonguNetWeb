import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/DonguNetWeb",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
