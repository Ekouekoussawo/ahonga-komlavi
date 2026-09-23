import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

// Using process.env.NODE_ENV to gate dev-only options is not reliable —
// this machine has NODE_ENV=production set system-wide, which leaks into
// `next dev` too and made every local route 404. Next's own build phase
// constant is immune to that. No basePath: the domain is served at its own
// root on HostGator (not from a URL subfolder), so page/asset paths must
// start at "/".
export default (phase: string) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  const nextConfig: NextConfig = {
    output: "export",
    ...(isDev ? { allowedDevOrigins: ["127.0.0.1", "localhost"] } : {}),
    trailingSlash: true,
    experimental: {
      optimizeCss: true,
      optimizePackageImports: ["@radix-ui/*"],
    },
    images: {
      unoptimized: false,
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      formats: ["image/webp", "image/avif"],
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
          port: "3000",
        },
        {
          protocol: "http",
          hostname: "localhost",
          port: "3001",
        },
        {
          protocol: "https",
          hostname: "**.hostgator.com",
        },
        {
          protocol: "https",
          hostname: "evangelisteahongankomlavi.com",
        },
      ],
    },
  };

  return withNextIntl(nextConfig);
};
