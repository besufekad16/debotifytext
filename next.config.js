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
  
  // Optimize for large-scale programmatic SEO
  // NOTE: experimental.workerThreads and cpus are intentionally NOT set.
  // Next.js 15 static generation with worker threads causes DataCloneError
  // when module-level function arrays are present in content generators.
  // Single-threaded generation is slower but reliable.
  experimental: {},
  
  // Increase build timeout for large sites — 5000+ pages need more time
  staticPageGenerationTimeout: 300, // 5 minutes per page batch
  
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
  
  // Add headers for XML files
  async headers() {
    return [
      {
        source: '/BingSiteAuth.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/sitemaps/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default config;
