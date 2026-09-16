import type { Resource } from "@/types";

// ============================================================================
// TRACK 8 — Meta-skills / Learning System (priorityRank 7)
// Seeded from docs/curriculum-spec.md ("TRACK 8", Hands-On Work, Sequenced
// Learning Paths, Dashboard Features, Recommendations, Caveats) and, for the
// person-specific rationale, docs/five-year-plan.md.
//
// The spec lists four bundled items (t8-learning-public, t8-pkm,
// t8-deliberate-practice, t8-accountability). Bundled mentions are split into
// individual records below (Notion, Anki, time-boxing, Israeli meetups); the
// spec's own IDs are kept verbatim for the primary record of each bundle.
//
// The "Staying current" feeds and the certifications assessment sit under
// TRACK 7 in the spec and are seeded in t7.ts (t7-simon-willison, t7-htb-ai,
// ...), so they are deliberately NOT duplicated here.
//
// URL verification: none of the Track 8 primary URLs are written out in the
// docs, so each was fetched on 2026-09-16 (urlVerified: true only where the
// page loaded). The one URL that could not be verified is flagged in `notes`.
// Sub-links that do appear in the docs (Primer repo, PSC, YC matching, the
// two Maven cohorts, the TAU conferences) are used as `links`.
// ============================================================================

const VERIFIED = "2026-09-16";

export const t8Resources: Resource[] = [
  // --------------------------------------------------------------------------
  // t8-learning-public — the ethos every other track hangs off
  // --------------------------------------------------------------------------
  {
    id: "t8-learning-public",
    title: "Learn In Public",
    creator: "Shawn Wang (swyx)",
    url: "https://www.swyx.io/learn-in-public",
    urlVerified: true,
    urlVerifiedDate: VERIFIED,
    resourceType: "article",
    format: "reading",
    cost: { model: "free" },
    estHours: 1,
    timeBucket: "lt_2h",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "A building-to-learn operating system: turn every course, paper and project into a public artifact (repo, post, demo, talk), so learning compounds into reputation instead of private notes.",
    whyForHim:
      "The spec's #1 key finding is that your ROI is in demonstrable artifacts and a public reputation, not exams: a senior cyber generalist without a developer title gets hired as FDE/founding SE on visible proof, and the five-year plan says you need a visible reputation ('FOMO') before founding. Learning in public turns each track into a repo plus a post, feeds the weekly d-tech-post-week drill and the Phase 1 threshold ('one public repo + one post live'), and lets you tell the failed-founding story on your own terms — the plan's 'reframe the failed attempt as a lesson learned' positioning.",
    priority: "must_do",
    producesArtifact: true,
    trackIds: ["T8_META"],
    skillIds: ["learning-in-public", "accountability"],
    roleRelevance: ["FDE", "SE", "Developer", "CTO", "CEO", "PM"],
    tags: ["learning_in_public", "portfolio", "reputation", "writing", "ethos"],
    freshness: "current",
    qualitySignal:
      "Spec: 'Must-adopt'. Key Finding #1 — 'you should learn by building in public, not by collecting credentials' — anchors every track to portfolio outputs. swyx's 2018 essay (verified live 2026-09-16) is the canonical statement of the idea: create 'learning exhaust' by sharing what you learn as you learn it.",
    notes:
      "Pairs with drill d-tech-post-week (one technical post per week) and d-demo-week (record + self-review a 5-min demo). Publish targets from the spec's projects: repo + blog post + short demo video per portfolio piece. Practical rule from the essay: share as you learn (posts, repos, talks) and credit the people whose work you learned from.",
  },

  // --------------------------------------------------------------------------
  // t8-pkm — Obsidian, the spec's free PKM pick ("writing to think")
  // --------------------------------------------------------------------------
  {
    id: "t8-pkm",
    title: "Obsidian — personal knowledge management ('writing to think')",
    creator: "Obsidian",
    url: "https://obsidian.md",
    urlVerified: true,
    urlVerifiedDate: VERIFIED,
    resourceType: "tool",
    format: "tool",
    cost: {
      model: "free",
      note: "Free without limits for personal use (homepage, 2026-09-16). Obsidian Sync and Publish are optional paid add-ons — prices not shown on the homepage and not captured in the docs.",
    },
    estHours: 3,
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "A local-first markdown vault for paper summaries, PRD rewrites, system-design write-ups and post drafts — the 'writing to think' habit that turns consumption into understanding and into publishable drafts.",
    whyForHim:
      "You are running a ~12 h/week curriculum across 8 tracks beside a day job and will produce a 200-word paper summary (d-paper-week), a PRD rewrite (d-prd-rewrite) and a post draft (d-tech-post-week) every week or two. One searchable, linkable vault keeps that pipeline in a single place, links notes to Forge resource/project IDs, and stays free — matching the spec's spend discipline (stay free/OSS wherever possible). The spec names Obsidian first and marks it free; Notion is the alternative.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META"],
    skillIds: ["pkm", "learning-in-public"],
    roleRelevance: ["PM", "FDE", "SE", "Developer", "CTO", "CEO"],
    tags: ["pkm", "writing_to_think", "notes", "markdown", "local_first"],
    freshness: "current",
    qualitySignal:
      "The spec's named PKM pick ('Obsidian (free) or Notion; writing to think'); Dashboard feature #8 'Notes / PKM — markdown notes linked to Resource/Project IDs' mirrors this workflow. Homepage verified 2026-09-16.",
    notes:
      "Keep long-form thinking in the vault and short linked notes in Forge's Notes view (both are markdown, so either exports to the other). Alternative if you prefer databases/shared pages: t8-notion. Anki (t8-anki) handles recall; Obsidian handles synthesis. Pick one PKM and stop — the spec's Track 8 rule is 'curate lightweight; don't over-invest'.",
  },

  // --------------------------------------------------------------------------
  // t8-notion — the spec's alternative PKM
  // --------------------------------------------------------------------------
  {
    id: "t8-notion",
    title: "Notion — PKM alternative (databases, shared pages)",
    creator: "Notion Labs",
    url: "https://www.notion.com",
    urlVerified: true,
    urlVerifiedDate: VERIFIED,
    resourceType: "tool",
    format: "tool",
    cost: {
      model: "freemium",
      note: "Free plan advertised on the homepage ('Get Notion free', 2026-09-16); team and AI features are paid — prices not captured in the docs.",
      freeAlternativeId: "t8-pkm",
    },
    estHours: 2,
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "A shareable workspace for structured notes, reading databases and kanban boards — the same 'writing to think' habit as Obsidian, with collaboration instead of local-first markdown.",
    whyForHim:
      "The spec offers Notion as the alternative to Obsidian. It earns its place only if you want databases/kanban and pages you can share — e.g., a co-founder trial-project workspace (the Phase 3 milestone), design-partner interview notes from d-customer-interview-week, or a PRD you co-edits with a founder once you are inside a seed-stage startup. Otherwise Obsidian (free, local) is the default.",
    priority: "optional",
    producesArtifact: false,
    trackIds: ["T8_META"],
    skillIds: ["pkm"],
    roleRelevance: ["PM", "CEO", "CTO", "FDE"],
    tags: ["pkm", "writing_to_think", "notes", "collaboration"],
    freshness: "current",
    qualitySignal:
      "Named in the spec alongside Obsidian as the PKM option ('Obsidian (free) or Notion'); a free plan is advertised on the homepage (verified 2026-09-16).",
    notes:
      "Free substitute: t8-pkm (Obsidian). Do not run both — the doc's intent is one PKM plus Anki for recall.",
  },

  // --------------------------------------------------------------------------
  // t8-anki — spaced repetition, paired with the System Design Primer decks
  // --------------------------------------------------------------------------
  {
    id: "t8-anki",
    title: "Anki — spaced repetition (pairs with the System Design Primer decks)",
    creator: "Ankitects (Damien Elmes)",
    url: "https://apps.ankiweb.net",
    urlVerified: true,
    urlVerifiedDate: VERIFIED,
    resourceType: "tool",
    format: "tool",
    cost: {
      model: "free",
      note: "Per the homepage (2026-09-16): the computer version is free on all major platforms and AnkiDroid (Android) is free; AnkiMobile (iOS) is a paid purchase that funds development — price not captured in the docs.",
    },
    estHours: 2,
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "Durable recall of canonical vocabulary and trade-offs — system-design patterns, transformer/tokenization/KV-cache concepts, eval terms, OWASP/ATLAS categories — via daily 10–15 minute reviews.",
    whyForHim:
      "The System Design Primer (T2 must-do, 368k GitHub stars) ships its own Anki decks and the spec explicitly pairs Anki with them, so the vocabulary sticks between weekly d-sysdesign-week drills. T2 is your CTO-credibility track and the T1/T2 self-tests ('explain attention, tokenization, KV cache, DPO vs RLHF to a peer'; '5 canonical system-design questions') are recall tests — recall is what fails under interview and customer pressure.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META", "T2_BACKEND_SYSTEMS"],
    skillIds: ["spaced-repetition", "system-design"],
    roleRelevance: ["Developer", "CTO", "FDE", "SE"],
    tags: ["spaced_repetition", "flashcards", "system_design", "transformers", "evals", "habit"],
    freshness: "current",
    qualitySignal:
      "The spec names Anki as the spaced-repetition tool ('Spaced repetition via Anki (pairs with System Design Primer decks)') and notes the Primer 'includes Anki spaced-repetition decks'; Dashboard feature #6 is an 'Anki-style deck' seeded with Primer + transformer/eval concepts. Homepage verified 2026-09-16.",
    notes:
      "Start with the .apkg decks in the System Design Primer repo (t2-sysdesign-primer) — no prerequisite, but that is the first deck to import. Forge's Review view ships its own SM-2 deck (Primer + transformer/eval/agent-security concepts); use Anki for imported decks beyond that. Keep the daily review short so it never competes with build time.",
    links: [
      { label: "System Design Primer repo (ships Anki decks)", url: "https://github.com/donnemartin/system-design-primer" },
    ],
  },

  // --------------------------------------------------------------------------
  // t8-deliberate-practice — the frame behind every drill
  // --------------------------------------------------------------------------
  {
    id: "t8-deliberate-practice",
    title: "Deliberate practice — a lightweight primer for a 10–15 h/week side curriculum",
    creator: "James Clear (summarising K. Anders Ericsson's research)",
    url: "https://jamesclear.com/beginners-guide-deliberate-practice",
    urlVerified: true,
    urlVerifiedDate: VERIFIED,
    resourceType: "framework",
    format: "reading",
    cost: { model: "free" },
    estHours: 1,
    timeBucket: "lt_2h",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "Designing practice as feedback loops — specific goal, focused reps, measurement, immediate correction — rather than passive consumption; the frame that makes the spec's drills and soft-skill workouts work.",
    whyForHim:
      "You are fitting 10–15 h/week of learning around a day job and, by your own request, the library over-collects ('gather and organize the most you can'). Deliberate practice explains why the spec's drills (record and self-review a 5-minute demo, AI-roleplay a skeptical CISO, rewrite a real PRD) beat another course: each is a rep with feedback. Read once, then treat every drill and workout as a measured rep. The spec's instruction is explicit — curate lightweight, don't over-invest here.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META"],
    skillIds: ["deliberate-practice"],
    roleRelevance: ["PM", "FDE", "SE", "Developer", "CTO", "CEO"],
    tags: ["deliberate_practice", "feedback_loops", "drills", "habit"],
    freshness: "current",
    qualitySignal:
      "The spec lists 'Deliberate-practice + time-boxing for 10–15h/wk alongside a day job' as a Track 8 item with the caveat 'curate lightweight; don't over-invest'. The doc names no specific source; James Clear's free primer was chosen at seed time as the lightest credible reference (page verified 2026-09-16).",
    notes:
      "No source is named in the docs for this item — the URL is a seed-time choice, not a spec citation. Apply, don't study: every drill in the Drills view (d-demo-week, d-negotiation-roleplay, d-prd-rewrite, d-sysdesign-week) is a deliberate-practice rep with a built-in self-review step. Companion habit: t8-timeboxing.",
  },

  // --------------------------------------------------------------------------
  // t8-timeboxing — the second half of the spec's bundle (Forge has a Pomodoro)
  // --------------------------------------------------------------------------
  {
    id: "t8-timeboxing",
    title: "Time-boxing with Pomodoro blocks (10–15 h/week alongside a day job)",
    creator: "Francesco Cirillo (Pomodoro Technique)",
    url: "https://en.wikipedia.org/wiki/Pomodoro_Technique",
    urlVerified: false,
    urlVerifiedDate: VERIFIED,
    resourceType: "framework",
    format: "reading",
    cost: { model: "free" },
    estHours: 0.5,
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "Protecting fixed 25-minute blocks for courses, projects and drills; logging honest hours; and capping weekly load so the path's 8–15 h/week budget is real rather than aspirational.",
    whyForHim:
      "Every path in the spec assumes a weekly hour budget (Primary ~12 h, Variant A ~15 h, Variant B ~12 h, Variant C ~8 h), and its Caveats warn that the deliberately over-collected library becomes overwhelm unless you pick ONE variant and treats the rest as backlog. Time-boxing is the mechanism: Forge's right rail ships a Pomodoro timer for exactly this, and the Progress/Pace views only mean something if hours are logged per block.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META"],
    skillIds: ["deliberate-practice", "accountability"],
    roleRelevance: ["PM", "FDE", "SE", "Developer", "CTO", "CEO"],
    tags: ["time_boxing", "pomodoro", "habit", "pace", "focus"],
    freshness: "current",
    qualitySignal:
      "Bundled with deliberate practice in the spec's Track 8 list ('Deliberate-practice + time-boxing for 10–15h/wk alongside a day job'). The doc names no source; the Pomodoro Technique is the de-facto time-boxing method and Forge's rail implements it.",
    notes:
      "FLAG: no source in the docs, and the URL is NOT verified. Francesco Cirillo's official page (francescocirillo.com/pages/pomodoro-technique) answered with a 301 redirect at seed time (2026-09-16) and was not followed; the Wikipedia entry is used as a stable reference — re-verify and swap for the official page. Use with the Pomodoro timer in Forge's rail and log hours per session.",
  },

  // --------------------------------------------------------------------------
  // t8-accountability — cohorts & communities (Maven, PSC, YC matching, local)
  // --------------------------------------------------------------------------
  {
    id: "t8-accountability",
    title: "Cohorts & communities as accountability (Maven, PreSales Collective, YC matching, Israeli meetups)",
    creator: "Curated — Maven, PreSales Collective, Y Combinator, local meetups",
    url: "https://maven.com",
    urlVerified: true,
    urlVerifiedDate: VERIFIED,
    resourceType: "community",
    format: "cohort",
    cost: {
      model: "freemium",
      note: "Free tiers: PSC membership, YC co-founder matching, meetups. Paid: at most ONE Maven cohort per the spec's spend rule — Aman Khan's AI-PM (price not confirmed — re-verify) or Hamel/Shreya's evals ($4,200 USD; ideally employer-funded).",
    },
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "External deadlines, peers and public commitments that keep a solo, side-of-a-day-job curriculum moving — and a network that doubles as job pipeline, design-partner source and co-founder discovery surface.",
    whyForHim:
      "The spec names cohorts/communities as your accountability mechanism, and the five-year plan's co-founder strategy says Israeli founders overwhelmingly meet co-founders via unit, prior company and VC programs — so community is not a nice-to-have, it is where your documented failure mode (co-founder selection) gets fixed. Sequence from the paths: PSC free membership in Phase 1 (FDE role fluency, Demo Days), one Maven cohort in Phase 2 if it is funded, YC co-founder matching plus a structured trial project in Phase 3.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META", "T6_FOUNDER", "T4_FDE_SE"],
    skillIds: ["accountability", "cofounder", "learning-in-public"],
    roleRelevance: ["FDE", "SE", "PM", "CEO", "CTO"],
    tags: ["accountability", "community", "cohort", "cofounder", "network"],
    freshness: "current",
    qualitySignal:
      "Spec Track 8 item ('Cohorts/communities as accountability'); the individual communities carry their own doc signals — PSC 51,000+ members (15,973 in Slack), YC matching median 3–6 months to a signed agreement, Maven evals cohort rated 4.7 (901 reviews), Aman Khan cohort rated 4.8. Maven homepage verified 2026-09-16.",
    notes:
      "Umbrella record; the individual communities live in their own tracks: t4-psc (PreSales Collective), t6-yc-cofounder (YC matching + equity essays), t1-evals-course and t3-aipm-khan (the two Maven cohorts the spec says to choose between), t7-cyberweek / t7-bsides-tlv and t8-israeli-meetups (local). Spend discipline from the spec: skip Reforge ($1,995/yr) and Lenny's PM Fundamentals cohort (aimed at <2-yr PMs) unless you want the network.",
    links: [
      { label: "Maven (cohort-based courses)", url: "https://maven.com" },
      { label: "Maven — AI Evals for Engineers & PMs (Hamel & Shreya)", url: "https://maven.com/parlance-labs/evals" },
      { label: "Maven — The AI PM Playbook (Aman Khan)", url: "https://maven.com/aman-khan/thriving-as-an-ai-pm" },
      { label: "PreSales Collective", url: "https://www.presalescollective.com" },
      { label: "YC Co-Founder Matching", url: "https://www.ycombinator.com/cofounder-matching" },
      { label: "Cyber Week TAU", url: "https://cyberweektau.com" },
      { label: "BSides TLV", url: "https://bsidestlv.com" },
    ],
  },

  // --------------------------------------------------------------------------
  // t8-israeli-meetups — your geography as an accountability + discovery loop
  // (the conferences themselves are T7 records; this is the cadence/habit)
  // --------------------------------------------------------------------------
  {
    id: "t8-israeli-meetups",
    title: "Israeli security meetups as an accountability loop — BSides TLV + the TAU conference week",
    creator: "Security BSides Tel Aviv community",
    url: "https://bsidestlv.com",
    urlVerified: true,
    urlVerifiedDate: VERIFIED,
    resourceType: "community",
    format: "event",
    cost: {
      model: "freemium",
      note: "BSides TLV describes itself as '100% non-profit' (ticket price not shown on the site); Cyber Week TAU is free/paid per the spec; DefenseTech Week and Cybertech prices not captured in the docs.",
    },
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "A local, in-person accountability loop — CFP deadlines to ship against, hallway feedback on your agent/NHI-security work, and face time with 8200-alumni founders, VC talent partners and prospective co-founders.",
    whyForHim:
      "Your geography is an asset: the five-year plan says Israeli founders overwhelmingly meet co-founders via unit, prior company and VC programs, and tells you to talk to talent partners at Cyberstarts, Team8, YL and Glilot — a local conference week is where those conversations happen in person. BSides TLV's 11 Nov 2026 date at Tel Aviv University falls inside the spec's Cyber Week TAU window (Nov 9–12, 2026, must-attend), so one week covers the AI-hacking-village crowd, the conference and co-founder scouting. Variant B ends with 'present at BSides TLV / Cyber Week' — a CFP deadline is the best external forcing function for finishing p-redteam-writeup or p-nhi-prototype.",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T8_META", "T7_DOMAIN", "T6_FOUNDER"],
    skillIds: ["accountability", "israeli-ecosystem", "learning-in-public"],
    roleRelevance: ["FDE", "SE", "CEO", "CTO"],
    tags: ["community", "israeli_ecosystem", "conference", "cofounder", "defense_tech", "meetup"],
    freshness: "current",
    qualitySignal:
      "Spec Track 8 lists 'Israeli meetups' as accountability and Variant B's output is 'present at BSides TLV / Cyber Week'. bsidestlv.com (verified 2026-09-16) lists the 2026 edition 'Alice in AI Land' for 11 November 2026 at Smolarz Auditorium, Tel Aviv University, with AI Hacking, Hardware and Bug Bounty villages plus a CTF (54h in 2025); self-reported: '10+ years running', '12k+ participants per event', '100% non-profit'.",
    notes:
      "The BSides site does not itself mention Cyber Week — co-location is inferred from the dates (spec: Cyber Week TAU Nov 9–12, 2026); dates drift yearly, re-verify each autumn. The conferences live in T7: t7-bsides-tlv (speaking target), t7-cyberweek (Nov 9–12, 2026), t7-defensetech-week (Dec 2–3, 2026), t7-cybertech (Jan 25–27, 2027). This record is the cadence: one local event per quarter, one CFP submission per year built from the T7 projects, and d-demo-week as the rehearsal until a talk is accepted.",
    links: [
      { label: "Cyber Week TAU", url: "https://cyberweektau.com" },
      { label: "DefenseTech Week TAU", url: "https://en-cyber.tau.ac.il/events/DTWeek" },
      { label: "Cybertech Global Tel Aviv", url: "https://www.cybertechisrael.com" },
    ],
  },
];
