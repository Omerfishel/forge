# Forge — Product-CTO learning platform

Single-user, local-first learning + doing platform for Omer (Tel Aviv cyber generalist → FDE/founding SE → product-CTO/CPO). Content comes from two research docs in `docs/`:

- `docs/curriculum-spec.md` — the data model, 8 tracks of resources, projects, drills, assessments, paths, dashboard features. **This is the content of the website.**
- `docs/five-year-plan.md` — strategy: domains, role ladder, target startups, timeline, comp, co-founder strategy. Rendered in the **Compass** view.

## Stack
Vite 6 + React 18 + TypeScript (strict) · react-router (HashRouter) · zustand (persist → localStorage key `forge_v1`) · zod (data validation in tests) · Vitest + Testing Library (unit) · Playwright (e2e, Chromium).

Commands: `npm run dev` (5173) · `npm run build` · `npm run preview` (4173) · `npm run typecheck` · `npm test` · `npm run test:e2e` · `npm run verify` (all).

## Layout of the code
- `src/types/index.ts` — **the schema contract**. Do not change enums without updating data + labels.
- `src/data/*` — content. `resources/t1.ts … t8.ts` (one per track), `tracks.ts`, `skills.ts`, `projects.ts`, `drills.ts`, `assessments.ts`, `paths.ts`, `milestones.ts`, `cards.ts` (flashcards), `tags.ts`, `strategy.ts`, aggregated by `index.ts` → `content: ContentBundle`.
- `src/store/index.ts` — the persisted store (`useForge`). Actions: `setStatus`, `toggleDone`, `setPercent`, `logHours`, `setLinks`, `toggleCriterion` (assessment rubrics + project steps; a done project stays done), `logDrill/unlogDrill`, notes CRUD, `gradeCard`, `togglePlanned` (Budget "plan to buy", separate from learning status), `updateSettings`, `setPomodoro`, `setUi`, `setLibraryFilters`, `toggleExpanded`, `setCollapsed(key, collapsed)` (use this, not toggleCollapsed, for sections with a default-open state), `importState` (runs `sanitizeImport` — untrusted JSON is repaired, never trusted) / `exportState` / `resetAll`. Persisted state is deep-merged with defaults on load.
- `src/lib/` — pure logic: `dates`, `plan` (DAG/unblocked, phases, pace, weekPlan, trackStats), `streaks` (streaks, cadence, heatmap), `srs` (SM-2), `budget`, `achievements`, `labels` (all display strings/icons), `routes` (`routeForItem` — which view owns an item), `feed` (`useFeed` loads `feed.json`, caches, refreshes every 30 min; `radarPicks`, `unreadRecent`, `groupByDay`), `hooks` (`useContent`, `usePlan`, `usePace`, `useOverall`, `useStreak`, `useTrackStats`, `useActivePath`, `useToday`, `useOpen`).
- `src/components/ui/index.tsx` — primitives: `ToastProvider/useToast`, `Modal`, `Chip`, `Bdg`, `TrackBdg`, `PriorityBdg`, `CostBdg`, `FreshBdg`, `DiffDots`, `Bar`, `Switch`, `Seg`, `Empty`, `PageHeader`, `Card`, `Accordion`, `Md`, `useConfirm`.
- `src/components/ResourceRow.tsx` — the shared resource row (expand → why/builds/signal, status, progress, hours, note, Focus). Used by Library, Tracks, Reading.
- `src/components/layout/` — `Header`, `SideNav`, `Rail` (coach + Pomodoro + glance + drills due; a finished focus block logs its minutes on the attached task), `AchievementWatcher` (global, toasts newly unlocked badges once, batched), `Layout`.
- `src/features/<key>/index.tsx` — one folder per view, default-exported page component. Registered in `src/features/registry.tsx` (nav order, icon, route). Routes: `/today /paths /tracks(/:trackId) /library /projects /drills /review /reading /feed /notes /assess /compass /progress /budget /freshness /settings`.
- `src/styles/app.css` — the whole design system. **Reuse these classes** (`card`, `item`, `chip`, `bdg`, `phase`, `stat`, `kanban`, `heat`, `srs-card`, `tbl`, `modal`, `toast`, …) before adding new CSS. If a feature truly needs new CSS, add a small `<feature>.css` inside its folder and import it from the page.
- `scripts/feed-lib.mjs` (+ `feed-lib.d.mts`) — the news feed: curated `SOURCES`, RSS/Atom parser, relevance `score`, `select` (14-day window, ≤8/day, ≤2 per source per day, min score, top picks). `scripts/build-feed.mjs` fetches everything, merges the live archive and writes `public/feed.json`; it runs in `.github/workflows/pages.yml` on every deploy and twice a day by cron (no bot commits — the site is rebuilt). `npm run feed` refreshes locally. Never bulk-add sources: the whole point is a small, high-signal feed.
- `tests/unit/**` (Vitest) · `tests/e2e/**` (Playwright; feed specs stub `**/feed.json*` with `page.route`).

## Design language (from the reference app — keep the feel)
Dark "control-room" dashboard. Deep navy panels (`--panel`, `--panel2`) on `--bg`, thin 1px `--line-solid` borders, 12px radii, **amber accent** `--acc` for selected/primary surfaces and `--acc-text` for accent-coloured text (links, numbers, labels — it darkens in the light theme; never use `--acc` as a text colour), monospace (`--mono`) for micro-labels/counts/uppercase section headers, sans (`--sans`) for body at 13–14px. Status/track tokens (`--ok --bad --warn --info --t1…--t8`) are remapped for the light theme, so always use the tokens, never hex. Track colour stripes on the left edge of item rows (`--tc`). Sticky header with an overall progress bar and a one-line context strip; collapsible icon rail on the left (expands on hover); optional right rail. Chips for filters, pills for counts, badges for metadata. Light theme via `html[data-theme="light"]`. Dense but calm; no gradients beyond the accent bar; emoji as icons.

## Conventions
- Every interactive control gets a stable `data-testid`. Prefer semantic HTML (`button`, `label`, `role=`), keyboard-operable.
- Content IDs are stable slugs; never rename an existing ID (progress is keyed by ID).
- Content is written in the second person ("you/your"); the schema field is still `whyForHim`.
- Below 940px the layout is a single column: every grid child needs `min-width: 0` (already set on `.wrap > *`); never let a flex row set the page width.
- Never `Date.now()` in `src/lib` pure functions without a `now` parameter (tests inject dates).
- No new runtime dependencies without a strong reason.
- Feature folders own only their folder. Shared changes (types/store/lib/ui/css) must be minimal and backward compatible.
- Links to external resources open in a new tab (`target="_blank" rel="noreferrer"`).
- Run `npm run typecheck && npm test` before declaring work done.
