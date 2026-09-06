/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep native/CJS-only server SDKs out of any bundling Next attempts —
    // they must only ever run in API routes, never ship to the client.
    serverComponentsExternalPackages: ['better-sqlite3', 'plaid', '@anthropic-ai/sdk'],
  },
  webpack: (config) => {
    // react-plaid-link's package.json "browser" field points webpack at its
    // UMD build, whose module.exports/define.amd interop wrapper breaks
    // webpack 5's module runtime in the App Router (surfaces as
    // "__webpack_require__.n is not a function"). Force the ESM build instead.
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-plaid-link': require.resolve('react-plaid-link/dist/index.esm.js'),
    };
    return config;
  },
};

module.exports = nextConfig;
