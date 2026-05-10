# FaceSculpt

Next.js 15 (App Router) site for FaceSculpt by The Wellness.

## Stack

- **Next.js 15** + React 19, App Router, TypeScript strict
- **Styling:** CSS Modules per component + a small global stylesheet (`app/globals.css`) holding design tokens, resets, and a few shared utility classes (`.container`, section primitives). No CSS framework — the original brand CSS is preserved.
- **Fonts:** `next/font/google` for Inter + Tinos italic (self-hosted, no FOUT).
- **Routing:** Server Components by default. Client Components only where state is needed: nav menu, FAQ accordion, shop filter, booking form, newsletter, assessment quiz.

## Pages

| Route          | Source HTML                       |
|----------------|-----------------------------------|
| `/`            | `face-sculpt-home.html`           |
| `/about`       | `face-sculpt-about.html`          |
| `/workouts`    | `face-sculpt-services.html`       |
| `/membership`  | `face-sculpt-membership.html`     |
| `/shop`        | `face-sculpt-products.html`       |
| `/assessment`  | `face-sculpt-assessment.html` (full-bleed, no nav/footer) |

## Architecture

```
app/                        layouts, page-level routes, robots/sitemap
  layout.tsx                fonts + RootLayout, wraps in ChromeFrame
  globals.css               design tokens + resets + shared utilities
  page.tsx                  Home
  about/page.tsx            About
  workouts/page.tsx         Workouts (services)
  membership/page.tsx       Membership
  shop/page.tsx             Shop (products)
  assessment/
    layout.tsx              metadata only; ChromeFrame skips chrome here
    page.tsx

components/
  layout/                   ChromeFrame, Announcement, SiteNav (+ mobile menu),
                            SiteFooter, Wordmark, NewsletterForm
  ui/                       Button, Hero, SectionHead, FAQAccordion, BecomeMember
  home/                     BestsellersCarousel, TwoTiles, FindStudio
  about/                    Split, TeamGrid, RecordSection
  workouts/                 WhatWeDo, ExpectGrid, WorkoutsGrid,
                            BoostersGrid, ProgrammesGrid, BookingForm
  membership/               TiersGrid, MathSection, HowItWorks, JoinBlock
  shop/                     ProductFilter, ProductCategory, ProductCard,
                            PreorderNote, ShopCallout
  assessment/               Assessment (state machine: welcome → 8×(question→learning) →
                            lead → compute → result), keyboard-driven (Enter, ↑/↓, A–F)

lib/
  content.ts                static data: workouts, boosters, programmes, products,
                            FAQs, tiers, team, founders, expect steps, how steps
  recommend.ts              static decision tree for the assessment
                            (pure function, easy to test)
  quiz.ts                   ordered question schema for the assessment
  types.ts                  shared TypeScript types
```

## Mobile / responsive

The original CSS is mobile-first. Everything ports across:

- `clamp()` for fluid typography and section padding
- Per-component `@media (min-width: …)` breakpoints (700, 800, 900, 1080)
- Sticky nav collapses to hamburger below 900px; mobile menu locks body scroll
- Carousels use `scroll-snap-type` with hidden scrollbars

## Accessibility

- `<a className="skip-link">` to `#main`
- Mobile menu uses `aria-controls`, `aria-expanded`, Esc to close
- FAQ accordion uses `aria-expanded` / `aria-controls` between button and panel
- Buttons (icon-only) have `aria-label`s
- `:focus-visible` ring globally
- Assessment supports keyboard: Enter to advance, ↑/↓ to navigate, A–F to pick

## SEO

- `metadata` exported on every page (title, description)
- JSON-LD `MedicalBusiness` on home
- `app/robots.ts` and `app/sitemap.ts`

## Slack notifications

Four endpoints post to a single incoming webhook (`SLACK_WEBHOOK_URL`, shared with `thewellness`). Helpers live in `lib/slack.ts` (`postSlack`, `postWithRetry`) and `lib/api.ts` (rate limit, honeypot, IP/UA, validation, JSON shorthands).

| Endpoint | Triggered by | Format |
|----------|--------------|--------|
| `POST /api/booking/started` | `BookingForm`: first blur of any contact field once a valid email is present (fired once per page mount) | Plain text |
| `POST /api/booking/submit` | `BookingForm` submit | Block Kit (workout, boosters, total, date, time, contact, allergies, notes) |
| `POST /api/assessment/submit` | `Assessment` lead-capture submit (fire-and-forget — UX continues to compute/result regardless) | Block Kit (recommendation + reasoning + protocol + the 8 answers) |
| `POST /api/newsletter` | `NewsletterForm` submit | Plain text (email, source page) |

Spam controls per request: in-memory IP rate limit + `_hp` honeypot field + boundary validation. The honeypot is silently 200'd. Rate-limit returns 429.

### Local setup

Copy `.env.example` → `.env.local` and paste the webhook URL (same as wellness).

```bash
cp .env.example .env.local
# edit SLACK_WEBHOOK_URL=…
npm run dev
```

When the env var is missing the routes still 200 — they just log "skipping notification" rather than failing. This keeps local/dev/preview from posting noise.

## Scripts

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint
npm run build      # production build
npm start          # serve build
```
