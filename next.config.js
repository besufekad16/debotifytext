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

  // ── Programmatic SEO: 40k ISR pages (480 priority URLs pre-rendered) ──
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
      // Known old PSEO landing URLs — send people to the hub, not a 1:1 new clone
      // (a 301 onto /guides/{same-slug} would transfer the old URL's identity).
      { source: '/bypass-turnitin', destination: '/topics/bypass', permanent: true },
      { source: '/bypass-turnitin-ai-detection', destination: '/topics/bypass', permanent: true },
      { source: '/free-ai-humanizer', destination: '/topics/humanizer', permanent: true },
      { source: '/best-ai-humanizer', destination: '/topics/humanizer', permanent: true },
      { source: '/best-ai-humanizer-2026', destination: '/topics/humanizer', permanent: true },
      { source: '/best-ai-humanizer-for-essays', destination: '/topics/humanizer', permanent: true },
      { source: '/best-ai-humanizer-for-students', destination: '/topics/humanizer', permanent: true },
      { source: '/chatgpt-humanizer', destination: '/topics/humanizer', permanent: true },
      { source: '/claude-humanizer', destination: '/topics/humanizer', permanent: true },
      { source: '/gemini-humanizer', destination: '/topics/humanizer', permanent: true },
      { source: '/essay-humanizer', destination: '/topics/essay', permanent: true },
      { source: '/chatgpt-essay-humanizer', destination: '/topics/essay', permanent: true },
      { source: '/ai-text-humanizer', destination: '/topics/humanizer', permanent: true },
      { source: '/ai-to-human-converter', destination: '/topics/humanizer', permanent: true },
      { source: '/ai-to-human-text-converter', destination: '/topics/humanizer', permanent: true },
      { source: '/ai-paraphraser', destination: '/topics/writing', permanent: true },
      { source: '/ai-humanizer-no-sign-up', destination: '/topics/humanizer', permanent: true },
      { source: '/humanize-chatgpt', destination: '/topics/humanizer', permanent: true },
      { source: '/humanize-chatgpt-text', destination: '/topics/humanizer', permanent: true },
      { source: '/make-ai-text-undetectable', destination: '/topics/humanizer', permanent: true },
      { source: '/bypass-gptzero', destination: '/topics/bypass', permanent: true },
      { source: '/bypass-originality-ai', destination: '/topics/bypass', permanent: true },
      { source: '/bypass-copyleaks', destination: '/topics/bypass', permanent: true },
      { source: '/bypass-zerogpt', destination: '/topics/bypass', permanent: true },
      { source: '/bypass-winston-ai', destination: '/topics/bypass', permanent: true },
      { source: '/bypass-ai-detection', destination: '/topics/bypass', permanent: true },
      { source: '/bypass-turnitin-2026', destination: '/topics/bypass', permanent: true },
      { source: '/gptzero-bypass', destination: '/topics/bypass', permanent: true },
      { source: '/turnitin-ai-bypass', destination: '/topics/bypass', permanent: true },
      { source: '/originality-ai-bypass', destination: '/topics/bypass', permanent: true },
      { source: '/make-chatgpt-undetectable-turnitin', destination: '/topics/bypass', permanent: true },
      { source: '/does-turnitin-detect-chatgpt', destination: '/topics/detectors', permanent: true },
      { source: '/how-to-humanize-ai-text', destination: '/topics/guides', permanent: true },
      { source: '/how-to-bypass-turnitin', destination: '/topics/guides', permanent: true },
      { source: '/how-to-bypass-turnitin-for-beginners', destination: '/topics/guides', permanent: true },
      { source: '/how-to-bypass-turnitin-in-2026', destination: '/topics/guides', permanent: true },
      { source: '/how-to-make-chatgpt-undetectable', destination: '/topics/guides', permanent: true },
      { source: '/how-to-bypass-gptzero-for-beginners', destination: '/topics/guides', permanent: true },
      { source: '/how-to-bypass-gptzero-in-2026', destination: '/topics/guides', permanent: true },
      { source: '/how-to-bypass-originality-ai-for-beginners', destination: '/topics/guides', permanent: true },
      { source: '/how-to-bypass-originality-ai-in-2026', destination: '/topics/guides', permanent: true },
      { source: '/how-to-bypass-ai-detection', destination: '/topics/guides', permanent: true },
      { source: '/humanifylab-vs-undetectable-ai', destination: '/topics/compare', permanent: true },
      { source: '/humanifylab-vs-stealthgpt', destination: '/topics/compare', permanent: true },
      { source: '/undetectable-ai-alternative', destination: '/topics/compare', permanent: true },
      { source: '/stealthgpt-alternative', destination: '/topics/compare', permanent: true },
      { source: '/bypassgpt-alternative', destination: '/topics/compare', permanent: true },
      { source: '/ai-humanizer-usa', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-uk', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-canada', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-europe', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-australia', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-south-africa', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-asia', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-for-students', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-for-teachers', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-for-journalists', destination: '/topics/usecases', permanent: true },
      { source: '/ai-humanizer-pricing', destination: '/pricing', permanent: true },
      { source: '/topics/howto', destination: '/topics/guides', permanent: true },
      { source: '/topics/score', destination: '/topics/detectors', permanent: true },
      { source: '/topics/detector', destination: '/topics/detectors', permanent: true },
      { source: '/topics/geo', destination: '/topics/usecases', permanent: true },
      { source: '/topics/glossary', destination: '/topics/guides', permanent: true },
      { source: '/topics/usecase', destination: '/topics/usecases', permanent: true },
      { source: '/topics/competitor', destination: '/topics/compare', permanent: true },
      { source: '/topics/academic', destination: '/topics/essay', permanent: true },
      { source: '/topics/professional', destination: '/topics/usecases', permanent: true },
      { source: '/topics/language', destination: '/topics/usecases', permanent: true },
      { source: '/topics/niche', destination: '/topics/writing', permanent: true },
      { source: '/topics/pricing', destination: '/pricing', permanent: true },
      { source: '/topics/industry', destination: '/topics/usecases', permanent: true },
      { source: '/topics/format', destination: '/topics/writing', permanent: true },
      { source: '/topics/speed', destination: '/topics/humanizer', permanent: true },
      { source: '/topics/quality', destination: '/topics/humanizer', permanent: true },
      { source: '/topics/tool', destination: '/topics/writing', permanent: true },
      { source: '/topics/problem', destination: '/topics/bypass', permanent: true },
      { source: '/topics/workflow', destination: '/topics/usecases', permanent: true },
      { source: '/topics/region', destination: '/topics/usecases', permanent: true },
      { source: '/topics/comparison', destination: '/topics/compare', permanent: true },
      { source: '/topics/alternative', destination: '/topics/compare', permanent: true },
      { source: '/topics/review', destination: '/topics/compare', permanent: true },
      { source: '/topics/free', destination: '/topics/humanizer', permanent: true },
      { source: '/topics/detection', destination: '/topics/detectors', permanent: true },
      { source: '/topics/education', destination: '/topics/essay', permanent: true },
      { source: '/topics/platform', destination: '/topics/writing', permanent: true },
      { source: '/topics/output', destination: '/topics/humanizer', permanent: true },
      { source: '/topics/bulk', destination: '/topics/writing', permanent: true },
      { source: '/topics/city', destination: '/topics/usecases', permanent: true },
      { source: '/topics/question', destination: '/topics/guides', permanent: true },
      { source: '/topics/feature', destination: '/topics/humanizer', permanent: true },
      { source: '/topics/length', destination: '/topics/essay', permanent: true },
      { source: '/topics/scenario', destination: '/topics/usecases', permanent: true },
      { source: '/topics/versus', destination: '/topics/compare', permanent: true },
      { source: '/topics/detectorshowdown', destination: '/topics/detectors', permanent: true },
      { source: '/topics/brandquery', destination: '/topics/humanizer', permanent: true },
      { source: '/topics/bestlist', destination: '/topics/compare', permanent: true },
      { source: '/topics/modelsource', destination: '/topics/writing', permanent: true },
      { source: '/topics/aeoqa', destination: '/topics/guides', permanent: true },
      { source: '/topics/rolework', destination: '/topics/usecases', permanent: true },
      { source: '/topics/voiceedit', destination: '/topics/writing', permanent: true },
      { source: '/topics/tasktype', destination: '/topics/writing', permanent: true },
      { source: '/sitemap-workflow.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-voiceedit.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-versus.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-usecase.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-tool.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-tasktype.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-speed.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-score.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-scenario.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-rolework.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-review.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-region.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-question.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-quality.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-professional.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-problem.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-pricing.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-platform-v4.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-output.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-niche.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-modelsource.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-length.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-language.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-industry.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-howto.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-glossary.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-free.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-format.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-feature.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-education.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-detectorshowdown.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-detector.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-detection.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-competitor.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-comparison.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-city.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-bulk.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-brandquery.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-bestlist.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-alternative.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-aeoqa.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-academic.xml', destination: '/sitemap.xml', permanent: true },
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
