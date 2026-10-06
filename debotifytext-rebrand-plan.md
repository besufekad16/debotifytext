# DebotifyText Rebrand Plan (HumanifyLab → DebotifyText)

**Scope:** Frontend UI rebrand only.
**Design direction:** Minimal, modern, strictly green + white.

> [!CAUTION]
> **Hard boundary — do NOT touch:**
> `src/app/api/**`, `src/server/**`, `prisma/**` (schema + migrations),
> `src/middleware.ts`, Clerk config / auth flows, `src/lib/clerk-server.ts`,
> `src/lib/polar-products.ts`, webhooks, cron, `src/env.js`.
> If a brand string only lives in one of these files, **log it in
> Appendix A and leave it alone**. Do not edit it "just this once".

---

## Phase 0 — Preparation & Safety Net

- [ ] Work in the **new repo**: https://github.com/besufekad16/debotifytext (no branch needed). Make the first commit an untouched copy of the current code, so the `git diff` boundary checks in later phases have a baseline to compare against:

  ```powershell
  git remote set-url origin https://github.com/besufekad16/debotifytext.git   # or: git remote add origin ...
  git remote -v                                                              # verify
  git add -A; git commit -m "chore: baseline copy of HumanifyLab before rebrand"
  git push -u origin main
  ```

  > Check `.gitignore` first so `.env*` files (except `.env.example`) and the large root artifacts (`build-*.txt`, `human_texts_sample.json`, CSVs) aren't pushed by accident.

- [ ] Confirm a clean baseline: `npm run typecheck` and `npm run lint` pass (or record existing failures so they aren't blamed on the rebrand).
- [ ] Take "before" screenshots (desktop + mobile) of: home (`/`), `/pricing`, `/account`, `/ai-humanizer`, `/ai-detector`, `/faq`, `/contact`, `/sign-in`, one pSEO page (`/[keyword]`).
- [ ] Decide and write down the **final naming variants** (used by every phase below):

  | Old | New |
  |---|---|
  | `HumanifyLab` | `DebotifyText` |
  | `Humanify Lab` / `Humanify lab` | `Debotify Text` |
  | `humanifylab` (handles, slugs, emails) | `debotifytext` |
  | `humanify` (standalone, e.g. keyword lists) | `debotify` |
  | `HUMANIFYLAB` (constants) | `DEBOTIFYTEXT` |
  | `humanifylab.com` | **DECISION NEEDED** — new domain, e.g. `debotifytext.com` |

- [ ] **Decisions to make before Phase 1** (blockers):
  - [ ] New production domain (affects canonical URLs, OG URLs, JSON-LD, sitemaps).
  - [ ] New support email address.
  - [ ] New social handles (X, LinkedIn, Facebook, Instagram, YouTube) — or remove icons for accounts that don't exist yet.
  - [ ] Final logo/wordmark files (see Phase 2).

> [!NOTE]
> **Do NOT rename** product-feature words like "AI humanizer", "humanize text",
> "humanizer" in body copy, headings or keywords. Those are the product category
> and carry SEO value. Only the **brand name** changes. Search for the
> brand tokens (`humanifylab`, `humanify lab`, `humanify`), not `humanize*`.

---

## Phase 1 — Global Search & Replace (text)

### 1.1 Build the inventory first (no edits yet)

- [ ] Run a case-insensitive scan, excluding generated/large files, and save the output as `rebrand-inventory.txt` (untracked):

  ```powershell
  rg -i "humanify" src public scripts seo infra README.md next.config.js vercel.json `
     components.json package.json .env.example `
     --glob "!*.xml" --glob "!**/node_modules/**" --glob "!package-lock.json" `
     --glob "!human_texts_sample.json" --glob "!*.csv" -n > rebrand-inventory.txt
  ```

- [ ] Count per-file hits to prioritise:
  `rg -i -c "humanify" src | sort`
- [ ] Classify every hit into one of three buckets:
  1. **Frontend copy / UI** → safe to replace in this plan.
  2. **SEO / metadata** → handled in Phase 4.
  3. **Backend / API / DB / auth** → **skip**, record in Appendix A.

### 1.2 Replace by directory (safe zones only)

Work in this order, committing after each step so diffs stay reviewable.

- [ ] `src/components/**` (navbar, footer, popups, pricing, social proof, cookie consent, etc.)
  - Priority files: `PageNavbar.tsx`, `NavigationBar.tsx`, `ModernNavbar.tsx`, `SiteFooter.tsx`, `AnimatedLogo.tsx`, `CookieConsent.tsx`, `ExitIntentPopup.tsx`, `PricingModal.tsx`, `PricingPageClient.tsx`, `ComparisonSection.tsx`, `SocialProofNotification.tsx`, `LifetimeOfferBanner.tsx`, `LifetimeOfferBar.tsx`, `ChristmasDiscount.tsx`
- [ ] `src/components/marketing/**`, `src/components/pricing/**`, `src/components/pseo-modules/**`
- [ ] `src/app/UnifiedHomePage.tsx` (largest landing component, ~86 KB — review manually, don't blind replace)
- [ ] `src/app/page.tsx`
- [ ] Static/marketing pages: `src/app/{pricing,faq,contact,privacy,terms,responsible-use,affiliate,team,research,guides,ai-detector,ai-humanizer,bypass-ai-detectors,account,api-keys,sign-in,sign-up}/**/page.tsx` and their client components only
- [ ] `src/app/[keyword]/page.tsx` — **template/UI strings only**
- [ ] pSEO **display content** (frontend-facing text): `src/content/pseo/**`, `src/lib/content/**`, `src/lib/pseo/**`
  - Only replace brand mentions inside rendered copy / templates. Do not change slugs, keyword IDs or generation logic.
  - Regenerated JSON/CSV keyword data (`humanifylab_40000_professional_keywords.csv`) is a **filename only** — do not rename unless a script reads it; check with `rg "professional_keywords" scripts src` first.
- [ ] Legal copy: `privacy`, `terms`, `responsible-use` — replace the brand name, then flag the page for a **manual legal read** (company name, jurisdiction, contact details).

### 1.3 Variation handling (run each pattern separately, review diff)

- [ ] `HumanifyLab` → `DebotifyText`
- [ ] `Humanify Lab` → `Debotify Text`
- [ ] `humanifylab` → `debotifytext` **only** in: social URLs, email addresses, handles, UI strings. Never in import paths or DB identifiers.
- [ ] `HumanifyLab's` → `DebotifyText's` (possessives, verify grammar)
- [ ] `Humanify` / `humanify` standalone → `Debotify` / `debotify` (review each hit; often appears in keyword arrays, which are an SEO decision — see Phase 4)
- [ ] Mixed-case in sentence starts (e.g. "Humanifylab") — search with `rg -i` to catch odd casing.
- [ ] Brand in alt text, `aria-label`, `title`, tooltips, toast messages, `placeholder` props.

### 1.4 Verification

- [ ] `rg -i "humanify" src --glob "!src/app/api/**" --glob "!src/server/**" --glob "!src/middleware.ts"` returns **only** intentional leftovers (documented in Appendix A).
- [ ] `npm run typecheck` passes.
- [ ] `git diff --stat` shows **zero** changes under the hard-boundary paths.

---

## Phase 2 — Asset Replacement

### 2.1 Inventory of current assets (`public/`)

| File | Used for | Action |
|---|---|---|
| `humanify.png` (1.2 MB) | Favicon, apple-touch-icon, JSON-LD logo | Replace with `debotify.png` (optimised, see 2.3) |
| `favicon.ico`, `favicon (1).ico` | Browser tab icon | Replace; **delete the duplicate** `favicon (1).ico` |
| `forOpenGraph.png` (1.3 MB) | OG / Twitter card | Replace; target 1200×630 |
| `ui.png` (1.7 MB) | Product screenshot | Re-shoot after theming (Phase 3) |
| `logo/*.png` | Third-party detector logos (GPTZero, Turnitin, etc.) | **Keep** — not our brand; only check backgrounds look fine on white/green |
| `institutes/` | University logos | **Keep** |
| `humans.txt`, `llms.txt`, `security.txt` | Text metadata | Update brand/contact text (Phase 4) |

### 2.2 Tasks

- [ ] Receive/produce final DebotifyText logo set: wordmark (SVG), icon-only mark (SVG), monochrome-white variant (for dark/green backgrounds).
  - Colours must come from the palette in Phase 3 (green + white only).
- [ ] Create `public/brand/` and place: `logo.svg`, `logo-mark.svg`, `logo-white.svg`.
- [ ] Generate favicon set: `favicon.ico` (32×32 + 16×16), `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (180×180).
- [ ] Create new OG image `public/og-image.png` (1200×630, white background, green accent, wordmark + tagline). Keep under ~300 KB.
- [ ] Replace `ui.png` with a fresh screenshot of the rethemed UI (compressed WebP/PNG).
- [ ] Update every reference to renamed files:
  - [ ] `src/app/layout.tsx` (`icons`, `openGraph.images`, `twitter.images`, JSON-LD `logo.url`)
  - [ ] `AnimatedLogo.tsx`, navbars, footer, sign-in/sign-up pages
  - [ ] `rg "humanify\.png|forOpenGraph|ui\.png|favicon" src`
- [ ] Inline SVGs / icon components containing old brand colours (browns): search `rg -i "#5e3d2a|#8b5e3c|#a67c52|#c8922a|#e8b84b|#faf6f1" src public` and update fills/strokes to green tokens.
- [ ] Remove the old files **after** all references are updated and build passes (don't leave `humanify.png` orphaned in `public/`).
- [ ] Optimise images: replace multi-MB PNGs with compressed PNG/WebP; large public assets hurt LCP.

---

## Phase 3 — Design System & Theming (minimal green + white)

### 3.1 Current state (what we are replacing)

- `src/styles/globals.css` — warm **espresso brown / cream** HSL tokens (`--primary: 24 42% 28%`, `--background: 36 33% 97%`, etc.) plus brown `--hl-*` brand tokens, brown gradients, brown `rgba(94,61,42,…)` shadows, a gold "offer" colour, and a `.dark` theme.
- `tailwind.config.js` — maps shadcn tokens to `hsl(var(--…))`, plus a hardcoded `brand` palette (`blue`, `orange`, `peach`, `mint*`, etc.) and a `display: Playfair Display` serif font.
- `src/app/layout.tsx` loads **Outfit** + **Playfair Display** from Google Fonts.

### 3.2 Target palette

Strictly green + white. Neutrals are green-tinted so nothing reads as grey/blue/brown.

| Token | Value | Purpose |
|---|---|---|
| White | `#FFFFFF` | Page background, cards |
| Green 50 | `#F0FDF4` | Subtle surfaces, hover, section tint |
| Green 100 | `#DCFCE7` | Borders, badges, soft fills |
| Green 500 | `#22C55E` | Highlights, icons, progress |
| **Green 700 (primary)** | `#15803D` | Buttons, links, focus ring (white text = ~5:1 contrast ✅) |
| Green 800 | `#166534` | Button hover, headings accents |
| Green 950 | `#052E16` | Body text / foreground |
| Green-gray muted | `#4B6354` | Secondary text (verify ≥4.5:1 on white) |

> [!IMPORTANT]
> Don't use `#16A34A` or lighter for white-on-green **text** buttons — it
> fails WCAG AA for small text. Use `#15803D`+.
> Keep red for destructive actions only (functional, not brand).

### 3.3 `src/styles/globals.css`

- [ ] Replace `:root` HSL tokens:

  ```css
  :root {
    --radius: 0.75rem;                 /* slightly tighter = more minimal */
    --background: 0 0% 100%;
    --foreground: 142 70% 10%;
    --card: 0 0% 100%;
    --card-foreground: 142 70% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 142 70% 10%;
    --primary: 142 72% 29%;            /* #15803D */
    --primary-foreground: 0 0% 100%;
    --secondary: 138 76% 97%;          /* #F0FDF4 */
    --secondary-foreground: 142 64% 24%;
    --muted: 138 76% 97%;
    --muted-foreground: 142 14% 35%;
    --accent: 141 84% 93%;             /* #DCFCE7 */
    --accent-foreground: 142 64% 24%;
    --destructive: 0 72% 51%;
    --border: 141 40% 90%;
    --input: 141 40% 90%;
    --ring: 142 72% 29%;
    --chart-1: 142 72% 29%;
    --chart-2: 142 71% 45%;
    --chart-3: 141 79% 85%;
    --chart-4: 142 64% 24%;
    --chart-5: 143 64% 14%;
    --sidebar: 0 0% 100%;
    --sidebar-foreground: 142 70% 10%;
    --sidebar-primary: 142 72% 29%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 138 76% 97%;
    --sidebar-accent-foreground: 142 64% 24%;
    --sidebar-border: 141 40% 90%;
    --sidebar-ring: 142 72% 29%;
  }
  ```

- [ ] **Brand tokens:** rename the `--hl-*` family to `--dt-*` and repoint to green. Keep a temporary alias block so nothing breaks mid-migration:

  | Old | New |
  |---|---|
  | `--hl-ink` | `--dt-ink: #052E16` |
  | `--hl-mint` / `--hl-brown-soft` | `--dt-green: #15803D` |
  | `--hl-mint-bright` / `--hl-brown-light` | `--dt-green-bright: #22C55E` |
  | `--hl-mint-deep` / `--hl-brown` | `--dt-green-deep: #166534` |
  | `--hl-surface` / `--hl-cream` | `--dt-surface: #F0FDF4` |
  | `--hl-offer`, `--hl-offer-deep` (gold) | **Remove** — use green/white for offer UI |

- [ ] **Dark mode (`.dark`):** decide one of:
  - (Recommended for "green + white" minimal) **Remove `.dark`** and the `darkMode: ["class"]` config; ship light only. Check `next-themes` usage (`rg "next-themes|useTheme|ThemeProvider" src`) and remove toggles if any.
  - Or re-map to deep green-black (`#052E16` bg) with white text. Only if dark mode is a product requirement.
- [ ] **Focus ring:** `:focus-visible` → `ring-[var(--dt-green)] ring-offset-white`.
- [ ] **Component classes** — update, then rename `hl-` → `dt-`:
  - `.hl-gradient-text` → flat green text (`text-[var(--dt-green)]`) or a *very* subtle `#166534 → #22C55E` gradient. Minimal = prefer flat.
  - `.hl-cta` → solid `#15803D`, hover `#166534`, shadow `rgba(21,128,61,.25)`, drop heavy `-translate-y` lift.
  - `.hl-surface-mesh` → plain `#FFFFFF → #F0FDF4` linear gradient; **remove radial mesh blobs**.
- [ ] **Simplify decoration** (preserve layout, remove noise):
  - Remove/neutralise: `hero-orb-a/b/c`, `heroOrbDrift*`, `glow`, `shimmer`, `offerPulse`, `offerShine`, `hero-gradient-live`, `heroGridPulse` (static or very faint grid only).
  - Keep functional motion: `fadeIn`, `fadeInUp` (reduce distance to ~12px), `marquee` (if logo strip stays), `accordion-*`.
  - Replace all hardcoded `rgba(94,61,42,…)`, `rgba(166,124,82,…)`, `rgba(232,184,75,…)` with `rgba(21,128,61,…)` at lower opacity.
  - Keep the `prefers-reduced-motion` block; prune selectors that no longer exist.
- [ ] Remove/replace `.hover-lift` shadow colour; reduce lift from `-3px` to `-2px`.

### 3.4 `tailwind.config.js`

- [ ] Delete the old `brand` colour object (`blue`, `orange`, `peach`, `porcelain`, `graphite`, `slate`, `amber`, etc.). Replace with:

  ```js
  brand: {
    50:  "#F0FDF4",
    100: "#DCFCE7",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    950: "#052E16",
    white: "#FFFFFF",
  },
  ```

- [ ] Fix the **sidebar-token bug** while here: `popover` currently contains `primary/accent/border/ring` keys pointing at sidebar vars — remove those from `popover` (they belong in `sidebar`, which already has them). Verify nothing uses `popover-primary` first.
- [ ] Fonts: keep **Outfit** (clean, modern, fits minimal). **Remove `display: Playfair Display`** (serif) and its Google Fonts request in `layout.tsx` to cut weight and keep a single-typeface look. Check usage: `rg "font-display" src`.
- [ ] `borderRadius`: reduce base `--radius` per 3.3; confirm cards/buttons still look right.
- [ ] Verify `content` globs actually match the repo (`./src/**/*.{ts,tsx}` OK; `./pages`, `./components`, `./app` at root don't exist — harmless, can be removed).

### 3.5 Component-level sweep (hardcoded colours)

Utility classes with arbitrary colours bypass the token system and are the #1 reason rebrands look half-done.

- [ ] Find old-brand hex values and arbitrary Tailwind colours:

  ```powershell
  rg -n -i "#5e3d2a|#8b5e3c|#a67c52|#c8922a|#e8b84b|#faf6f1|#1a0f0a|#2a1a12|#0B6FFF|#FF7A3D|#FFB199|#F6F8FA|#1F2933" src
  rg -n "(bg|text|border|from|to|via|ring|fill|stroke|shadow)-\[#" src
  rg -n "hl-|--hl-" src
  rg -n "(amber|orange|yellow|rose|red|pink|purple|violet|indigo|blue|sky|cyan|teal|stone|amber|brown|zinc|slate|gray|neutral)-(50|100|200|300|400|500|600|700|800|900)" src
  ```

- [ ] For each hit: map to a token (`bg-primary`, `text-foreground`, `bg-secondary`, `border-border`, `text-muted-foreground`, `bg-brand-50`, …). **Prefer semantic tokens over `brand-*`** so future retheming is a one-file change.
- [ ] Neutral greys (`gray-*`, `slate-*`, `zinc-*`) in body text → `text-foreground` / `text-muted-foreground` to stay in the green-tinted system.
- [ ] Remove multi-colour gradients (`from-orange-… to-pink-…` etc.), coloured badges, "offer"/promo gold. Promo banners (`LifetimeOfferBanner`, `LifetimeOfferBar`, `ChristmasDiscount`, `ExitIntentPopup`, `SocialProofNotification`) → solid green or white-with-green-border.
  - Seasonal `ChristmasDiscount` is off-brand for a minimal rebrand; confirm whether to hide it (render-only change; do **not** alter pricing logic).
- [ ] shadcn primitives in `src/components/ui/**`: verify they use tokens only (button, input, select, dialog, tooltip, scroll-area). Fix any variant (`destructive`, `outline`, `ghost`, `secondary`) that still has hardcoded colours.
- [ ] Clerk components (`<SignIn/>`, `<SignUp/>`, `<UserButton/>`): theme **only via the `appearance` prop** on the frontend (e.g. `variables: { colorPrimary: "#15803D" }`). This is a UI prop, not an auth-flow change. Do not touch Clerk keys, redirect URLs or middleware.
- [ ] `sonner` Toaster: set `toastOptions` classNames to green/white.
- [ ] Logo strip / detector logos (`DetectorShowcase.tsx`): add white/green-tint container, consider grayscale → full-colour on hover for a minimal look.
- [ ] Simplify layout *without changing structure*: reduce heavy shadows, remove decorative blobs, increase whitespace, use `border` + subtle `bg-secondary` for separation instead of gradients/glows.

### 3.6 Visual QA

- [ ] Re-capture the "after" screenshots from Phase 0 and compare.
- [ ] Contrast check on: primary button, links, muted text, badges, disabled states (target WCAG AA).
- [ ] Check hover/focus/active/disabled states on buttons, inputs, selects, tabs.
- [ ] Check loading skeletons, toasts, modals, cookie banner, pricing cards (popular/featured highlight), history drawer.
- [ ] Mobile (375px), tablet (768px), desktop (1440px).
- [ ] Search for leftover brown/gold in rendered pages with the browser devtools (Rendering → emulate, or grep computed colours).

---

## Phase 4 — SEO & Metadata

### 4.1 `src/app/layout.tsx` (root metadata)

- [ ] `metadataBase` → new domain.
- [ ] `title.default` / `title.template` → e.g. `AI Humanizer: Humanize AI Text & Bypass AI Detectors | DebotifyText`, template `%s | DebotifyText`.
- [ ] `description` (and OG/Twitter descriptions) → swap brand name; keep keyword-rich wording about "AI humanizer".
- [ ] `keywords`: replace `humanifylab`, `humanify`, `humanify ai`, `humanify text`, `humanify ai text`, `humanify lab` with `debotifytext`, `debotify`, `debotify ai`, `debotify text`, `debotify lab`. Keep the generic "ai humanizer…" terms.
- [ ] `authors`, `creator`, `publisher`, `applicationName` → `DebotifyText`.
- [ ] `icons` → new favicon / apple-touch-icon paths (Phase 2).
- [ ] `openGraph`: `url`, `siteName`, `title`, `images[].url`, `images[].alt` ("DebotifyText — Professional AI Humanizer").
- [ ] `twitter`: `title`, `images`, `site` and `creator` (new handle or remove).
- [ ] `verification`: Google/Bing tokens are **tied to the old domain/property**. Add new-domain verification values (public frontend meta, safe to edit) — do not delete the old ones until the new property is verified. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is an env var → Phase 5.
- [ ] **JSON-LD `siteGraphSchema`:** update `@id` URLs, `name`, `url`, `logo.url`, `alternateName` (`Debotify`, `Debotify Text`, `DebotifyText AI Humanizer`), `description`, `email`, `contactPoint.email/url`, and every `sameAs` URL.
- [ ] Fonts: remove the Playfair Display part of the Google Fonts `<link>` (per 3.4).
- [ ] Analytics IDs (GA `G-6C1TZBERFK`, GTM `GTM-TK39PV2F`): **decide** whether to keep (continuity) or create new properties. Don't change silently.

### 4.2 Per-page metadata

- [ ] Every `generateMetadata` / `export const metadata` in `src/app/**/page.tsx` and `layout.tsx`: update `title`, `description`, `openGraph`, `alternates.canonical`, JSON-LD (`Organization`, `WebApplication`, `FAQPage`, `BreadcrumbList`, `Product/Offer`).
  - `rg -n "metadata|generateMetadata|application/ld\+json|canonical" src/app`
- [ ] `src/components/SEOBreadcrumbs.tsx` — brand name / root URL in breadcrumb schema.
- [ ] pSEO template `src/app/[keyword]/page.tsx` — title template, meta description template, canonical base, schema brand name, so all ~40k generated pages inherit the new brand.
- [ ] Heading hierarchy untouched (single `<h1>` per page) — only brand wording changes.

### 4.3 Static SEO files in `public/` (frontend-served assets)

- [ ] `robots.txt` → `Sitemap:` lines point to the new domain.
- [ ] `llms.txt`, `humans.txt`, `security.txt` → brand name, contact email, canonical URLs.
- [ ] `sitemap.xml`, `sitemap-main.xml`, `sitemap-pseo-1…8.xml` contain absolute old-domain URLs. **Regenerate** rather than edit by hand: `npm run seo:generate-sitemaps` (set the new base URL in the script/env first — see 5.3). Review `scripts/generate-all-sitemaps.ts`, `build-sitemaps.ts`, `build-pseo-index.ts`.
- [ ] `BingSiteAuth.xml`, `google-site-verification.html`, `cae535….txt` (IndexNow key) — tied to the old domain; re-issue for the new domain and replace.
- [ ] `src/app/sitemaps/**` route files: check for hardcoded base URL (frontend-visible, but they're route handlers — **read-only review; if a base URL constant is shared with server code, escalate rather than edit**).

### 4.4 Domain-migration SEO (only if the domain changes)

> [!WARNING]
> A domain change is outside "frontend text" — it needs redirects at the
> hosting layer (`vercel.json` / DNS), which is infrastructure, not UI.
> Plan it separately; do not bury it in this rebrand.

- [ ] Set up 301 redirects old domain → new domain (host-level, `vercel.json` `redirects` or Vercel domain settings). Needs explicit approval since it's a config change.
- [ ] Add new property in Google Search Console + Bing Webmaster, use **Change of Address** tool.
- [ ] Re-submit sitemaps (`npm run seo:submit-sitemap` after updating `seo/search-console-submitter.ts` site URL).
- [ ] Update IndexNow submissions (`scripts/submit-indexnow.mjs`) to the new host + key.
- [ ] Keep the old domain live with redirects for ≥ 12 months.

---

## Phase 5 — Environment, Hardcoded Links & Contact Info

### 5.1 Hardcoded links / emails / handles in UI

- [ ] Support email `humanifylab1@gmail.com` → new address. Locations include `layout.tsx` JSON-LD, `SiteFooter.tsx`, `/contact`, `/privacy`, `/terms`, `/faq`, `/responsible-use`.
  `rg -n -i "humanifylab1?@|@humanifylab|mailto:" src public`
- [ ] Social links: `x.com/humanifylab`, `linkedin.com/company/humanifylab`, `facebook.com/humanifylab`, `instagram.com/humanifylab`, `youtube.com/@humanifylab` → new URLs, or **remove** icons whose accounts don't exist yet (no dead links).
  `rg -n -i "x\.com/|twitter\.com/|linkedin\.com/|facebook\.com/|instagram\.com/|youtube\.com/" src`
- [ ] Absolute URLs `https://www.humanifylab.com/...` used in UI components (share buttons, copy-link, canonical, `href`s) → new domain. Prefer **relative links** where possible.
  `rg -n -i "humanifylab\.com" src public scripts seo`
- [ ] Affiliate UI (`src/app/affiliate/**`): referral link display strings like `humanifylab.com/?ref=CODE` → new domain (display text only; the `ref` cookie logic lives in middleware — don't touch).
- [ ] Email-style placeholders in forms (`placeholder="you@…"`) and success/error toast text mentioning the old brand.
- [ ] Cookie consent copy, footer copyright line (`© 2026 DebotifyText`), "Powered by"/attribution text.
- [ ] API-docs / `api-keys` page code samples (`curl https://www.humanifylab.com/api/...`) → new domain **in the displayed snippet only**; the API route paths themselves stay identical.
- [ ] `postman_collection.json` — base URL/variable names (dev tooling, optional).

### 5.2 Env-var *values* & non-secret config (document, don't commit secrets)

- [ ] `.env.example` line 1 comment: `# … fill with HumanifyLab credentials` → DebotifyText. (Comment only; variable names stay.)
- [ ] `NEXT_PUBLIC_*` variables that contain the brand/domain (`rg "NEXT_PUBLIC_" src .env.example`): list them and update **values** in the deployment dashboard (Vercel) — not in code. Candidates: `NEXT_PUBLIC_APP_URL` / site URL, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- [ ] **Do not rename** env variable *names* (e.g. `AISTUDIOS_API_KEY`, `POLAR_*`, `CLERK_*`); those are read by backend code.
- [ ] Check `next.config.js` for brand/domain strings (redirects, `images.remotePatterns`, headers, CSP). Config is read-only for this plan — **flag, don't edit**, unless the change is purely an image-host string for a frontend asset.
- [ ] `vercel.json` — flag domain-specific redirects/headers for the infra owner (Appendix A).
- [ ] `README.md`: update title, description, links, clone URL, screenshots (docs; safe to edit). Also fix stale content (Better Auth → Clerk, OpenAI → Gemini) while there.
- [ ] `package.json` `"name": "humanifylab"` → `"debotifytext"` (metadata only; also update `package-lock.json` `name` fields via `npm install --package-lock-only`). Optional; skip if CI/deploy tooling keys off the name.

### 5.3 Scripts & tooling referencing the brand

Not shipped UI, but they generate public output and must agree with the new brand:

- [ ] `scripts/*.ts` and `seo/search-console-submitter.ts`: base URL constants, site name used in generated pSEO copy/sitemaps.
- [ ] `cleanup-branding.ps1`, `check-clerk-config.js`, `check-webhook-config.js`, `test-*.sh`: update display strings/URLs only if you still use them; otherwise leave.
- [ ] Root clutter (`build-*.txt`, `humanized.txt`, etc.) — ignore for rebrand; consider deleting in a separate cleanup commit.

---

## Phase 6 — Final Verification & Release

- [ ] **Brand leak scan (rendered):**
  `rg -i "humanify" src public --glob "!*.xml" --glob "!src/app/api/**" --glob "!src/server/**"` → empty or documented.
- [ ] **Old colour scan:** the hex/class greps from 3.5 return nothing.
- [ ] **Boundary check:** `git diff --name-only | rg "^(src/app/api|src/server|prisma|src/middleware\.ts|src/env\.js|src/lib/(clerk-server|polar-products)\.ts)"` → **no output**.
- [ ] `npm run lint && npm run typecheck`
- [ ] `npm run build` (uses `SKIP_ENV_VALIDATION=1`; verify no missing asset imports).
- [ ] Manual smoke test (UI only): sign-in page renders and themed; home → humanize flow visually intact; pricing renders all tiers; account/credits page; API keys page; footer links resolve; 404 page (`not-found.tsx`) rebranded.
- [ ] Verify head tags in the built HTML: view-source for `<title>`, meta description, canonical, OG, Twitter, JSON-LD (use Rich Results Test / Schema validator).
- [ ] Share-preview check: OG image renders in Facebook Debugger / LinkedIn Post Inspector / X card validator.
- [ ] Lighthouse (Performance, SEO, Accessibility) — compare against baseline; no regressions.
- [ ] Open PR with before/after screenshots; request review of legal pages and copy.

---

## Appendix A — Leftover / Out-of-Scope Log

Record any brand string found in files protected by the hard boundary. These need a **separate, explicitly approved** backend task.

| File | Line | Old string | Why it's out of scope | Suggested follow-up |
|---|---|---|---|---|
| _(fill during Phase 1.1)_ | | | | |

Likely places to check (read-only): email templates (`resend` usage), Polar checkout metadata / product names, webhook handlers, `src/app/api/**` response `meta`, `src/server/adapters/**` prompts, `src/lib/polar-products.ts`, `next.config.js`, `vercel.json`.

## Appendix B — Suggested Commit Sequence

1. `chore: add rebrand inventory + decisions`
2. `feat(ui): replace HumanifyLab → DebotifyText in components`
3. `feat(ui): replace brand in pages and pSEO templates`
4. `feat(assets): new logos, favicons, OG image`
5. `feat(theme): green/white tokens in globals.css + tailwind config`
6. `refactor(ui): replace hardcoded colours with tokens; simplify decoration`
7. `feat(seo): metadata, JSON-LD, robots/llms/humans, sitemap regeneration`
8. `chore: links, emails, social handles, README`
9. `chore: verification fixes`
