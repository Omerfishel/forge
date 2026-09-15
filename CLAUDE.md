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
- `src/store/index.ts` — the persisted store (`useForge`). Actions: `setStatus`, `toggleDone`, `setPercent`, `logHours`, `setLinks`, `toggleCriterion`, `logDrill/unlogDrill`, notes CRUD, `gradeCard`, `updateSettings`, `setPomodoro`, `setUi`, `setLibraryFilters`, `toggleExpanded/Collapsed`, `importState/exportState/resetAll`.
- `src/lib/` — pure logic: `dates`, `plan` (DAG/unblocked, phases, pace, weekPlan, trackStats), `streaks` (streaks, cadence, heatmap), `srs` (SM-2), `budget`, `achievements`, `labels` (all display strings/icons), `hooks` (`useContent`, `usePlan`, `usePace`, `useOverall`, `useStreak`, `useTrackStats`, `useActivePath`, `useToday`).
- `src/components/ui/index.tsx` — primitives: `ToastProvider/useToast`, `Modal`, `Chip`, `Bdg`, `TrackBdg`, `PriorityBdg`, `CostBdg`, `FreshBdg`, `DiffDots`, `Bar`, `Switch`, `Seg`, `Empty`, `PageHeader`, `Card`, `Accordion`, `Md`, `useConfirm`.
- `src/components/layout/` — `Header`, `SideNav`, `Rail` (coach + Pomodoro + glance + drills due), `Layout`.
- `src/features/<key>/index.tsx` — one folder per view, default-exported page component. Registered in `src/features/registry.tsx` (nav order, icon, route). Routes: `/today /paths /tracks(/:trackId) /library /projects /drills /review /reading /notes /assess /compass /progress /budget /freshness /settings`.
- `src/styles/app.css` — the whole design system. **Reuse these classes** (`card`, `item`, `chip`, `bdg`, `phase`, `stat`, `kanban`, `heat`, `srs-card`, `tbl`, `modal`, `toast`, …) before adding new CSS. If a feature truly needs new CSS, add a small `<feature>.css` inside its folder and import it from the page.
- `tests/unit/**` (Vitest) · `tests/e2e/**` (Playwright).

## Design language (from the reference app — keep the feel)
Dark "control-room" dashboard. Deep navy panels (`--panel`, `--panel2`) on `--bg`, thin 1px `--line-solid` borders, 12px radii, **amber accent** `--acc` for selected/primary, monospace (`--mono`) for micro-labels/counts/uppercase section headers, sans (`--sans`) for body at 13–14px. Track colour stripes on the left edge of item rows (`--tc`). Sticky header with an overall progress bar and a one-line context strip; collapsible icon rail on the left (expands on hover); optional right rail. Chips for filters, pills for counts, badges for metadata. Light theme via `html[data-theme="light"]`. Dense but calm; no gradients beyond the accent bar; emoji as icons.

## Conventions
- Every interactive control gets a stable `data-testid`. Prefer semantic HTML (`button`, `label`, `role=`), keyboard-operable.
- Content IDs are stable slugs; never rename an existing ID (progress is keyed by ID).
- Never `Date.now()` in `src/lib` pure functions without a `now` parameter (tests inject dates).
- No new runtime dependencies without a strong reason.
- Feature folders own only their folder. Shared changes (types/store/lib/ui/css) must be minimal and backward compatible.
- Links to external resources open in a new tab (`target="_blank" rel="noreferrer"`).
- Run `npm run typecheck && npm test` before declaring work done.
