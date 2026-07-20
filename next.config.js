/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// Temporarily disabled for build testing
// import "./src/env.js";

/** @type {import("next").NextConfig} */

const config = {
  eslint: {
    // Temporarily disable ESLint during builds to focus on TypeScript errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily disable to test build
    ignoreBuildErrors: true,
  },
  // Fix multiple lockfiles warning
  outputFileTracingRoot: process.cwd(),

  // ── Large-scale programmatic SEO build tuning (~23.6k static pages) ──────
  // Each static-generation worker is a *separate Node process* that loads the
  // entire compiled server bundle (all content generators + the ~250KB of
  // inline pSEO keyword data). Left at the default (os.cpus() - 1), a build
  // machine with 8 CPUs spins up 7 of these simultaneously, which multiplies
  // peak memory 7x and is what was causing the build to die partway through
  // (~11k/23.6k pages) with an unhelpful, un-logged worker crash (OOM kill —
  // Node just disappears, no JS stack trace, which matches "it stops").
  // Capping concurrency trades a bit of parallelism for a much smaller,
  // predictable memory footprint. Raise this if you build on a machine/CI
  // with more RAM (e.g. Vercel's Enhanced Build Machine: 8 CPU / 16GB).
  experimental: {
    cpus: Number(process.env.NEXT_BUILD_WORKERS ?? 2),
    // workerThreads (postMessage/structured-clone based workers) stays off —
    // the default child_process-based workers are used instead, which is
    // both more memory-tolerant and the only thing that's been validated
    // against this codebase's content generators.
    workerThreads: false,
  },

  // Increase build timeout for large sites — 5000+ pages need more time
  staticPageGenerationTimeout: 300, // 5 minutes per page batch

  // Skip webpack's persistent filesystem cache for production builds. It
  // exists to speed up *repeated local dev/incremental* builds, but on a
  // fresh CI/Vercel checkout there is nothing to reuse it from, so it's pure
  // overhead — and with ~250KB of inline keyword data compiled into the
  // bundle, serializing it to a cache pack file on disk after every build
  // ("Serializing big strings... impacts deserialization performance") costs
  // real time and memory for zero benefit here.
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Permanent redirects for retired paths — avoids indexed 404s
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/blog', destination: '/', permanent: true },
      { source: '/blog/:path*', destination: '/', permanent: true },
      // "ai humanizer" is the homepage's primary keyword — the old spun
      // /ai-humanizer pSEO page was removed from the dataset and now
      // 301s here so link equity and any existing indexing consolidate
      // onto the homepage instead of splitting between two pages.
      { source: '/ai-humanizer', destination: '/', permanent: true },
    ];
  },

  async headers() {
    const xmlHeaders = [
      { key: 'Content-Type', value: 'application/xml' },
      { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' },
    ];
    return [
      // Security headers sitewide
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/BingSiteAuth.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      // Sitemap index + all cluster sitemaps (sitemap.xml, sitemap-*.xml)
      { source: '/sitemap.xml', headers: xmlHeaders },
      { source: '/:sitemap(sitemap-.*\\.xml)', headers: xmlHeaders },
      { source: '/sitemaps/:path*', headers: xmlHeaders },
    ];
  },
};

export default config;
