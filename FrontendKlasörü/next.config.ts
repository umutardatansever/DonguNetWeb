import type { NextConfig } from "next";

// GitHub Pages serves this repo under /DonguNetWeb (not repo root), so the built
// assets need that basePath baked in. Local dev and the eco-match-application-main
// monorepo handoff (bkz. BURAYIOKU.md) run at the domain root, so basePath is only
// set when NEXT_BASE_PATH is provided -- the GH Pages workflow sets it, nothing
// else does.
const basePath = process.env.NEXT_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["172.20.10.2", "localhost:3000", "172.20.10.2:3000"],
};

export default nextConfig;
