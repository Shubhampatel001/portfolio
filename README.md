# Shubham Patel — Portfolio

A premium, dark-mode personal portfolio built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Lenis smooth scrolling. All content is sourced from `src/data/resume.ts`, populated from the attached resume (including real project/social links pulled from the PDF's embedded hyperlinks).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> **Note on fonts:** this project uses `next/font/google` (Space Grotesk, Inter, JetBrains Mono), which downloads font files from Google Fonts at build time. This needs normal internet access — fine on your machine and on Vercel, but it will fail in a fully sandboxed/offline environment.

## Project structure

```
src/
  app/
    layout.tsx        # Root layout, metadata, OG tags, font loading
    page.tsx           # Assembles all sections
    sitemap.ts          # sitemap.xml
    globals.css        # Design tokens (color, type) + base styles
  components/
    layout/            # Navbar, Footer, SmoothScrollProvider
    sections/           # Hero, About, Experience, Projects, Skills, Certifications, Achievements, Contact
    ui/                 # Reusable primitives (Button, Badge, Card, SectionHeading, brand icons)
  data/
    resume.ts           # Single source of truth for all content
  lib/
    fonts.ts            # next/font/google config
    utils.ts             # cn() class-merge helper
public/
  resume.pdf            # Downloadable resume (linked from the Hero CTA)
  favicon.svg
  robots.txt
```

## Editing content

Everything text-based — experience, projects, skills, certifications, achievements — lives in **`src/data/resume.ts`**. Edit that file and the whole site updates; no need to touch components for content changes.

## Notable implementation details

- **Projects section**: each project gets an original abstract SVG visualization (a retrieval-graph diagram for the RAG project, a path-optimization diagram for EvoDrive, a neural-net diagram for the NEAT project) instead of a fabricated screenshot, since no real product screenshots were available.
- **Flappy Bird project**: includes a real playable `<canvas>` recreation of the game (`src/components/sections/flappy-demo.tsx`) with two modes — manual play (space/tap to flap) and a simple reactive "autopilot" heuristic. The autopilot is explicitly labeled as a lightweight heuristic, not the actual trained NEAT network from the original Python project, to avoid overstating what it does.
- **Brand icons**: `lucide-react`'s current version no longer ships GitHub/LinkedIn marks, so those are hand-rolled SVGs in `src/components/ui/brand-icons.tsx`.
- **Accessibility**: visible focus rings, `prefers-reduced-motion` respected globally (disables Lenis smooth scroll and shortens all animations).

## Before deploying

1. Replace `siteUrl` in `src/app/layout.tsx` and `src/app/sitemap.ts` with your real domain.
2. Add a real `public/og-image.png` (1200×630) for social share previews — currently referenced but not generated.
3. Double check `public/resume.pdf` is your latest version.
4. Decide whether to expose a phone number in the Contact section (currently omitted per your preference).

## Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo directly in the Vercel dashboard — zero config needed beyond the domain swap above.
# portfolio
