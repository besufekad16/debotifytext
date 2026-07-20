# Implementation Plan: SEO/PSEO Enhancement & Expansion Project (v2 — Aligned to Actual Codebase)

## Overview

This plan replaces the original microservices-based task list, which did not match
the deployed stack. The actual production system is:

**Actual Technology Stack**: TypeScript, Next.js (App Router) on Vercel,
Prisma + Neon Postgres (app data only — pSEO data is compiled-in), fully static
pSEO pages via `generateStaticParams`, deterministic template-based content
generation (zero AI-API cost), XML sitemaps in `public/`.

**Architecture decision (agreed)**: extend the existing `/[keyword]` pSEO system
with a new v5 dataset + content generators — the same proven pattern as the
existing 23,546 pages (v1–v4 + geo). No Kubernetes, Redis, S3, or OpenAI API.

Legend: [x] done · [ ] pending

---

## Phase 1: Build Stability (COMPLETE)

- [x] 1. Fix the production build that died at ~11k/23.6k pages
  - [x] 1.1 Root-cause the hang: infinite loop in `src/lib/related-links.ts`
        (`pickFromPool` walked with a keyword-derived step that was not coprime
        with the pool length, so the walk never visited all indices and the
        loop never exited)
  - [x] 1.2 Rewrite `pickIndices` / `pickFromPool` / `getRelatedLinks` as
        bounded forward walks — always terminate in ≤ length steps
  - [x] 1.3 Cap static-generation worker concurrency (`experimental.cpus`, default 2
        via `NEXT_BUILD_WORKERS`) and raise Node heap to 4GB in the build script
  - [x] 1.4 Disable webpack persistent cache for production builds (pure overhead
        on fresh CI checkouts with ~250KB inline keyword data)
  - [x] 1.5 Deduplicate per-page work: wrap all content generators and
        `resolveEntry` in `React.cache()` so `generateMetadata` + page render
        compute each page once instead of twice

## Phase 2: v5 Dataset — ~18.3k New Pages (COMPLETE)

- [x] 2. Design 5 new clusters targeting whitespace intent (no overlap with v1–v4)
  - [x] 2.1 `city` — hyperlocal "ai humanizer in {city}" (~150 cities × 28 templates, cap 4,200)
  - [x] 2.2 `question` — interrogative Q&A intent for featured snippets (~129 topics × 35 stems, cap 4,500)
  - [x] 2.3 `feature` — product-capability commercial intent (~166 features × 24 templates, cap 4,000)
  - [x] 2.4 `length` — word-count-specific intent (20 counts × 35 content types × 6 modifiers, cap 3,500)
  - [x] 2.5 `scenario` — pre-submission anxiety/reassurance queries (~104 contexts × 20 templates, cap 3,500)
- [x] 3. Implement `src/lib/pseo-data-v5.ts`
  - [x] 3.1 Combinatorial keyword generators per cluster
  - [x] 3.2 Global slug dedupe against v1+v2+v3+v4+geo and within v5
  - [x] 3.3 Entity extraction per cluster (longest-match-first for word counts)
  - [x] 3.4 Memoized assembly + slug index (`getAllV5Entries`, `getV5KeywordBySlug`,
        `getV5ClusterKeywords`)
- [x] 4. Content generators (reuse `V4PageData` + `content-combinator.ts` pools)
  - [x] 4.1 `city-content.ts` (features + stats)
  - [x] 4.2 `question-content.ts` (snippet-style lead answer + features)
  - [x] 4.3 `feature-content.ts` (features + steps)
  - [x] 4.4 `length-content.ts` (steps + stats)
  - [x] 4.5 `scenario-content.ts` (reassurance-first lead answer + steps)
- [x] 5. Wire v5 into the render pipeline
  - [x] 5.1 Register 5 clusters in `pseo-clusters.ts` (registry, `AnyClusterKey`,
        `CLUSTER_ORDER`) — hub pages at `/topics/{cluster}` and internal links
        pick them up automatically
  - [x] 5.2 `src/app/[keyword]/page.tsx`: add v5 to `generateStaticParams`,
        `resolveEntry`, `generateMetadata`, keyword maps, and a V5 render block
        on `V4Template`
- [x] 6. Verification (`scripts/verify-v5-dedup.ts`)
  - [x] 6.1 Result: 18,264 unique new pages (city 4,200 / question 4,500 /
        feature 3,984 / length 3,500 / scenario 2,080), 0 collisions with prior
        datasets, 0 internal dupes, 0 bad slugs, content smoke test 79/79 pass
  - Site total after v5: **41,810 pSEO pages**

## Phase 3: Sitemaps & Discovery (COMPLETE)

- [x] 7. Extend `scripts/generate-all-sitemaps.ts` with the 5 v5 clusters
  - [x] 7.1 Per-cluster sitemap files (all v5 clusters ≤ 4,500 URLs — under the
        50k/50MB sitemap limits, no chunking needed)
  - [x] 7.2 Priorities: question/scenario 0.8 (higher commercial intent),
        city/feature/length 0.7
  - [x] 7.3 Regenerated: 36 sitemaps, 41,855 total URLs, index updated
  - `robots.txt` already points to the sitemap index — no change needed

## Phase 4: Build & Deploy Validation (IN PROGRESS)

- [x] 8. Full production build with all ~41.8k pages
  - [x] 8.1 Build with capped concurrency + 4GB heap
  - [x] 8.2 All 41,877 pages generated, exit code 0, ~25.5 min, no OOM/hangs
  - [x] 8.3 Spot-checked one rendered page per v5 cluster — all present with
        correct titles; found and fixed awkward scenario titles by adding a
        `statement` keyword type to `content-combinator.ts` (first-person
        keywords now get "…? Here Is the Fix"-style framing); revalidation
        build run after the fix
- [ ] 9. Deploy
  - [ ] 9.1 Push to production (Vercel) — consider the Enhanced Build Machine
        (8 CPU / 16GB) and raising `NEXT_BUILD_WORKERS` accordingly
  - [ ] 9.2 Submit updated sitemap index in Google Search Console
  - [ ] 9.3 Monitor GSC Page Indexing report over the following weeks

## Phase 5: SEO Remediation & Continuous Optimization (PENDING)

- [ ] 10. Lightweight site audit script (no external infra)
  - [ ] 10.1 Broken internal links across generated pages
  - [ ] 10.2 Duplicate meta titles/descriptions across the 41.8k pages
  - [ ] 10.3 Title-length / description-length outliers report
- [ ] 11. GSC-driven iteration (requires user's GSC access — cannot be automated
      from this repo without API credentials)
  - [ ] 11.1 Identify crawled-not-indexed clusters; strengthen internal links to them
  - [ ] 11.2 Prune or improve zero-impression pages after 60–90 days
- [ ] 12. Future dataset growth (optional)
  - [ ] 12.1 Raise v5 caps (generators can yield well above current caps for
        city/question/feature) once existing pages index well
  - [ ] 12.2 Additional cluster candidates: pricing-comparison ("X vs Y price"),
        model-specific ("humanize gpt-5 output"), seasonal ("finals week")

---

## What Changed From the Original Plan (v1)

The original tasks.md prescribed PostgreSQL/Redis/S3 microservices, OpenAI-based
content generation, and Kubernetes infrastructure. None of that exists in the
deployed codebase, and per the agreed decisions it was replaced with:

| Original (v1 plan)              | Implemented (this plan)                        |
|---------------------------------|------------------------------------------------|
| Microservices + K8s + Redis     | Existing Next.js/Vercel static generation      |
| OpenAI GPT-4 content            | Deterministic template combinators ($0, instant)|
| PostgreSQL keyword store        | Compiled-in combinatorial datasets (v1–v5)     |
| S3 + CloudFront sitemaps        | Static `public/*.xml` sitemaps on Vercel CDN   |
| Separate `/pseo_pages/*` routes | Existing `/[keyword]` route (proven, indexed)  |
