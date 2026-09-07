/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep native/CJS-only server SDKs out of any bundling Next attempts —
    // they must only ever run in API routes, never ship to the client.
    serverComponentsExternalPackages: ['better-sqlite3', 'plaid', '@anthropic-ai/sdk'],
  },
  webpack: (config, { dev }) => {
    // react-plaid-link's package.json "browser" field points webpack at its
    // UMD build, whose module.exports/define.amd interop wrapper breaks
    // webpack 5's module runtime in the App Router (surfaces as
    // "__webpack_require__.n is not a function"). Force the ESM build instead.
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-plaid-link': require.resolve('react-plaid-link/dist/index.esm.js'),
    };

    if (dev) {
      // Next's dev server persists webpack's compiled module cache to disk
      // (.next/cache/webpack) so restarts are fast. A Codespace pause/resume
      // can leave that cache corrupted or stale, which has reintroduced the
      // "__webpack_require__.n is not a function" error even with the alias
      // above in place, previously only fixable with a manual `rm -rf .next`.
      // Disabling the cache in dev trades a slower cold start for a dev
      // server that can never resurrect a corrupted on-disk cache.
      config.cache = false;
    }

    return config;
  },
};

module.exports = nextConfig;
