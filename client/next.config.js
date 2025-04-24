/* eslint-disable @typescript-eslint/no-require-imports */
const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tell Next.js to transpile the @lazorkit/wallet module
  transpilePackages: ["@lazorkit/wallet"],
  experimental: {
    esmExternals: true,
  },
  webpack: (config, { isServer }) => {
    // Add polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      url: require.resolve("url"),
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser"),
    };

    // Add buffer polyfill
    if (!isServer) {
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
