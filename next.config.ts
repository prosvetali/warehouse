import type { NextConfig } from "next";

interface FileLoaderRule {
  test?: RegExp;
  issuer?: unknown;
  exclude?: RegExp;
  resourceQuery?: unknown;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    // Дефолтне правило Next.js, що обробляє SVG як ассет
    const rules = config.module.rules as Array<FileLoaderRule | unknown>;
    const fileLoaderRule = rules.find(
      (rule): rule is FileLoaderRule =>
        typeof rule === "object" &&
        rule !== null &&
        "test" in rule &&
        (rule as FileLoaderRule).test instanceof RegExp &&
        ((rule as FileLoaderRule).test as RegExp).test(".svg"),
    );

    if (fileLoaderRule) {
      rules.push(
        // *.svg?url → залишається file-loader (URL)
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        // інакше — React-компонент через @svgr/webpack
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [/url/] },
          use: ["@svgr/webpack"],
        },
      );
      fileLoaderRule.exclude = /\.svg$/i;
    } else {
      rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      });
    }

    return config;
  },
};

export default nextConfig;
