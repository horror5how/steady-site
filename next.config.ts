import type { NextConfig } from "next";

// GH_PAGES=1 → static export mirror at horror5how.github.io/steady-site
// (temporary while the Vercel account is fair-use blocked)
const ghPages = process.env.GH_PAGES === "1";

const nextConfig: NextConfig = {
  ...(ghPages && {
    output: "export" as const,
    basePath: "/steady-site",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
