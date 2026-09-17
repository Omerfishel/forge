# Forge · Product-CTO Track

A single-user learning **and doing** platform: eight tracks of curated resources, nine portfolio projects, recurring drills, spaced-repetition flashcards, readiness rubrics, a strategy compass, and progress tracking, all in one place. Content comes from two research documents in `docs/` (the curriculum spec and the five-year plan).

**Live:** https://omerfishel.github.io/forge/ — deployed automatically from `main` by `.github/workflows/pages.yml` (typecheck → unit tests → news feed → build → GitHub Pages). The same workflow runs twice a day (05:20 and 15:20 UTC) to refresh the news feed from ~26 curated RSS sources; `npm run feed` refreshes it locally.

Everything runs in the browser; progress is stored in `localStorage` (key `forge_v1`) of whichever browser you use, so export a JSON backup from **Settings** before switching devices and import it on the other one.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build and preview:

```bash
npm run build
npm run preview    # http://localhost:4173
```

The build is static (`dist/`), so it can be hosted on any static host (GitHub Pages, Netlify, Vercel). Routing uses the URL hash, so no server rewrites are needed.

## Tests

```bash
npm run typecheck   # TypeScript strict
npm test            # Vitest: logic, store, content integrity, component views
npm run test:e2e    # Playwright (builds + serves on 4173 automatically)
npm run verify      # all of the above
```

To run the Playwright suite against an already-running dev server: `PW_BASE_URL=http://localhost:5173 npx playwright test`.

## Views

| Route | What it does |
| --- | --- |
| `/today` | This week's next unblocked items from the active path, today's queue (lesson, drill, flashcards), blocked items, milestones, pace |
| `/paths` | Path switcher (primary 18-month path + three variants) and the sequenced plan per phase |
| `/tracks` | Eight track cards ranked by priority; detail page groups resources by priority with a role filter |
| `/library` | All 154 resources with search and filters; expand a row for the "why", status, progress, hours and notes |
| `/projects` | Portfolio kanban (drag or arrows), project modal with step checklist, hours and publish links |
| `/drills` | Recurring habits with streaks, backfill and history; soft-skill roleplay workouts; activity heatmap |
| `/review` | Anki-style spaced repetition over 183 cards (Space reveals, 1–4 grades) |
| `/reading` | One-paper-a-week tracker with summaries, plus the reading queue |
| `/feed` | News: the day's top stories in cyber, AI security, AI/ML, startups and Israeli tech (≤8 a day, 2 per source, 14-day window) with read/saved state; the rail's Radar shows three unread picks |
| `/notes` | Markdown notes linked to resources, projects, drills or rubrics; export to Markdown |
| `/assess` | Per-track "ready when" rubrics, self-tests and public-proof links |
| `/compass` | The five-year strategy: domains, roles, target startups, timeline, skills, money, playbook, caveats |
| `/progress` | Stats, pace, daily goal, per-track bars, achievements, activity |
| `/budget` | Cost of the library, planned purchases, free alternatives, spend discipline |
| `/freshness` | What to re-verify and when (frameworks, prices, conference dates) |
| `/settings` | Profile, plan parameters, Pomodoro, backup export/import, reset |

Keyboard: `/` focuses the library search, `Space` reveals a flashcard, `1`–`4` grade it, `Esc` closes dialogs. Double-click the left menu to pin it open.

## Code map

See `CLAUDE.md` for the layout of the code, the design language and the conventions (stable content IDs, pure logic in `src/lib`, one folder per view under `src/features`).
