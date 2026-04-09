// next.config.ts — оновлений
import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // ✅ Turbopack config
  turbopack: {},

  // Prevent pg (and its Node.js-only deps like dns/net) from being
  // bundled into the server bundle — use native require instead.
  serverExternalPackages: ["pg"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },

  // ✅ Оптимізації для production
  experimental: {
    optimizePackageImports: ["@reduxjs/toolkit", "react-redux"],
  },

  // ✅ Webpack оптимізації
  webpack: (config, { isServer }) => {
    // Аналізуємо bundle
    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: isServer
            ? "../analyze/server.html"
            : "../analyze/client.html",
        }),
      );
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
