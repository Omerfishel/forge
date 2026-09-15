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
// URL verification: none of the Track 8 URLs are written out in the docs, so
// each was fetched on 2026-09-16 (urlVerified: true only where the page
// loaded). The one URL that could not be verified is flagged in `notes`.
// ============================================================================

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
    urlVerifiedDate: "2026-09-16",
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
      "The spec's #1 key finding is that his ROI is in demonstrable artifacts and a public reputation, not exams: a senior cyber generalist without a developer title gets hired as FDE/founding SE on visible proof. Learning in public turns each track into a repo plus a post, feeds the weekly d-tech-post-week drill, and builds the 'FOMO' the five-year plan says he needs before founding. It also lets him tell the failed-founding story on his own terms.",
    priority: "must_do",
    producesArtifact: true,
    trackIds: ["T8_META", "T7_DOMAIN"],
    skillIds: ["learning-in-public", "accountability"],
    roleRelevance: ["FDE", "SE", "Developer", "CTO", "CEO", "PM"],
    tags: ["learning_in_public", "portfolio", "reputation", "writing", "ethos"],
    freshness: "current",
    qualitySignal:
      "Marked 'must-adopt' by the spec; its Key Finding #1 ('learn by building in public, not by collecting credentials') anchors every track to portfolio outputs. swyx's essay is the canonical statement of the idea.",
    notes:
      "Pairs with drill d-tech-post-week (one technical post per week) and the Phase 1 threshold 'one public repo + one post live'. Practical rule from the essay: share what you learn as you learn it (posts, repos, talks) and credit the people whose work you learned from. Publish targets from the spec: repo + blog post + short demo video per portfolio project.",
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
    urlVerifiedDate: "2026-09-16",
    resourceType: "tool",
    format: "tool",
    cost: {
      model: "free",
      note: "Free for personal use ('free without limits'); Sync/Publish are optional paid add-ons — prices not captured in the docs.",
    },
    estHours: 3,
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "A local-first markdown vault for paper summaries, PRD rewrites, system-design write-ups and post drafts — the 'writing to think' habit that turns consumption into understanding and into publishable drafts.",
    whyForHim:
      "He is running a ~12 h/week curriculum across 8 tracks beside a day job and will produce a 200-word paper summary (d-paper-week), a PRD rewrite (d-prd-rewrite) and a post draft (d-tech-post-week) every week or two. One searchable, linkable vault keeps that pipeline in a single place, links notes to Forge resource/project IDs, and stays free — matching the spec's spend discipline (stay free/OSS wherever possible).",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META"],
    skillIds: ["pkm", "learning-in-public"],
    roleRelevance: ["PM", "FDE", "SE", "Developer", "CTO", "CEO"],
    tags: ["pkm", "writing_to_think", "notes", "markdown", "local_first"],
    freshness: "current",
    qualitySignal:
      "The spec's named PKM pick ('Obsidian (free) or Notion'); Dashboard feature #8 'Notes / PKM — markdown notes linked to Resource/Project IDs' mirrors this workflow. Homepage verified 2026-09-16.",
    notes:
      "Keep long-form thinking in the vault and short linked notes in Forge's Notes view (or export from either — both are markdown). Alternative if he prefers databases/shared pages: t8-notion. Anki (t8-anki) handles recall; Obsidian handles synthesis.",
  },

  // --------------------------------------------------------------------------
  // t8-notion — the spec's alternative PKM
  // --------------------------------------------------------------------------
  {
    id: "t8-notion",
    title: "Notion — PKM alternative (databases, shared pages)",
    creator: "Notion Labs",
    url: "https://www.notion.com/",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "tool",
    format: "tool",
    cost: {
      model: "freemium",
      note: "Free personal plan; team and AI features are paid — prices not captured in the docs.",
      freeAlternativeId: "t8-pkm",
    },
    estHours: 2,
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "A shareable workspace for structured notes, reading databases and kanban boards — the same 'writing to think' habit as Obsidian, with collaboration instead of local-first markdown.",
    whyForHim:
      "The spec offers Notion as the alternative to Obsidian. It earns its place only if he wants databases/kanban and pages he can share — e.g., a co-founder trial-project workspace, design-partner interview notes, or a PRD he co-edits with a founder. Pick one PKM and stop; the spec warns against over-investing in meta-tooling.",
    priority: "optional",
    producesArtifact: false,
    trackIds: ["T8_META"],
    skillIds: ["pkm"],
    roleRelevance: ["PM", "CEO", "CTO", "FDE"],
    tags: ["pkm", "writing_to_think", "notes", "collaboration"],
    freshness: "current",
    qualitySignal:
      "Named in the spec alongside Obsidian as the PKM option; a free plan is advertised on the homepage (verified 2026-09-16).",
    notes:
      "notion.so redirects to notion.com (checked 2026-09-16). Free substitute: t8-pkm (Obsidian). Do not run both — the doc's intent is one PKM plus Anki for recall.",
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
    urlVerifiedDate: "2026-09-16",
    resourceType: "tool",
    format: "tool",
    cost: {
      model: "free",
      note: "Desktop (Windows/macOS/Linux), AnkiWeb and AnkiDroid are free; the iOS app (AnkiMobile) is a separate paid purchase — price not captured in the docs.",
    },
    estHours: 2,
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [
      "None — but import the System Design Primer's Anki decks (t2-sysdesign-primer) as the first deck",
    ],
    buildsSkill:
      "Durable recall of canonical vocabulary and trade-offs — system-design patterns, transformer/tokenization/KV-cache concepts, eval terms, OWASP/ATLAS categories — via daily 10–15 minute reviews.",
    whyForHim:
      "The System Design Primer (T2 must-do) ships its own Anki decks and the spec explicitly pairs Anki with them, so the vocabulary sticks between weekly d-sysdesign-week drills. T2 is his CTO-credibility track: the T1/T2 self-tests ('explain attention, tokenization, KV cache, DPO vs RLHF to a peer'; '5 canonical system-design questions') are recall tests, and recall is what fails under interview and customer pressure.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META", "T2_BACKEND_SYSTEMS"],
    skillIds: ["spaced-repetition", "system-design"],
    roleRelevance: ["Developer", "CTO", "FDE", "SE"],
    tags: ["spaced_repetition", "flashcards", "system_design", "transformers", "evals", "habit"],
    freshness: "current",
    qualitySignal:
      "The spec names Anki as the spaced-repetition tool and notes the Primer (368k GitHub stars) 'includes Anki spaced-repetition decks'; Dashboard feature #6 is an 'Anki-style deck' seeded with Primer + transformer/eval concepts. Homepage verified 2026-09-16.",
    notes:
      "Forge's Review view ships its own SM-2 deck (Primer + transformer/eval/agent-security concepts); use Anki for imported decks beyond that — start with the .apkg files in the System Design Primer repo. Keep the daily review short so it never competes with build time.",
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
    urlVerifiedDate: "2026-09-16",
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
      "He is fitting 10–15 h/week of learning around a day job and, by his own request, the library over-collects. Deliberate practice explains why the spec's drills (record and self-review a 5-minute demo, AI-roleplay a skeptical CISO, rewrite a real PRD) beat another course: each is a rep with feedback. Read once, then treat every drill and workout as a measured rep. The spec's instruction is explicit — curate lightweight, don't over-invest here.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META"],
    skillIds: ["deliberate-practice"],
    roleRelevance: ["PM", "FDE", "SE", "Developer", "CTO", "CEO"],
    tags: ["deliberate_practice", "feedback_loops", "drills", "habit"],
    freshness: "current",
    qualitySignal:
      "The spec lists deliberate practice + time-boxing as a Track 8 item with the caveat 'curate lightweight; don't over-invest'. The doc names no specific source; James Clear's free primer was chosen at seed time as the lightest credible reference (page verified 2026-09-16).",
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
    urlVerifiedDate: "2026-09-16",
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
      "Every path in the spec assumes a weekly hour budget (Primary ~12 h, Variant A ~15 h, Variant C ~8 h), and its Caveats warn that the deliberately over-collected library becomes overwhelm unless he picks one variant and treats the rest as backlog. Time-boxing is the mechanism: Forge's right rail ships a Pomodoro timer for exactly this, and the Progress/Pace views only mean something if hours are logged per block.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META"],
    skillIds: ["deliberate-practice", "accountability"],
    roleRelevance: ["PM", "FDE", "SE", "Developer", "CTO", "CEO"],
    tags: ["time_boxing", "pomodoro", "habit", "pace", "focus"],
    freshness: "unknown",
    qualitySignal:
      "Bundled with deliberate practice in the spec's Track 8 list ('Deliberate-practice + time-boxing for 10–15h/wk alongside a day job'). The doc names no source; the Pomodoro Technique is the de-facto time-boxing method and Forge's rail implements it.",
    notes:
      "FLAG: no source in the docs. Francesco Cirillo's official Pomodoro page (francescocirillo.com/pages/pomodoro-technique) returned HTTP 404 at seed time (2026-09-16); the Wikipedia entry is used as a stable reference — re-verify and swap for the official page if it returns. Use with the Pomodoro timer in Forge's rail and log hours per session.",
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
    urlVerifiedDate: "2026-09-16",
    resourceType: "community",
    format: "cohort",
    cost: {
      model: "freemium",
      note: "Free tiers: PSC membership, YC co-founder matching, meetups. Paid: at most ONE Maven cohort per the spec's spend rule — Aman Khan's AI-PM (price not confirmed, re-verify) or Hamel/Shreya's evals ($4,200 USD, ideally employer-funded).",
    },
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "External deadlines, peers and public commitments that keep a solo, side-of-a-day-job curriculum moving — and a network that doubles as job pipeline, design-partner source and co-founder discovery surface.",
    whyForHim:
      "The spec names cohorts/communities as his accountability mechanism, and the five-year plan's co-founder strategy says Israeli founders overwhelmingly meet co-founders via unit, prior company and VC programs — so community is not a nice-to-have, it is where his documented failure mode (co-founder selection) gets fixed. Sequence: PSC free membership in Phase 1 (FDE role fluency, Demo Days), one Maven cohort in Phase 2 if it is funded, YC co-founder matching plus a structured trial project in Phase 3.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T8_META", "T6_FOUNDER", "T4_FDE_SE"],
    skillIds: ["accountability", "cofounder", "learning-in-public"],
    roleRelevance: ["FDE", "SE", "PM", "CEO", "CTO"],
    tags: ["accountability", "community", "cohort", "cofounder", "network"],
    freshness: "current",
    qualitySignal:
      "Spec Track 8 item; the individual communities carry their own signals — PSC 51,000+ members (15,973 in Slack), YC matching median 3–6 months to a signed agreement, Maven evals cohort rated 4.7 (901 reviews), Aman Khan cohort rated 4.8. Maven homepage verified 2026-09-16.",
    notes:
      "Umbrella record; the individual communities live in their own tracks: t4-psc (PreSales Collective), t6-yc-cofounder (YC matching + equity essays), t1-evals-course and t3-aipm-khan (the two Maven cohorts the spec says to choose between), t7-cyberweek and t8-israeli-meetups (local). Spend discipline from the spec: skip Reforge ($1,995/yr) and Lenny's PM Fundamentals cohort (aimed at <2-yr PMs) unless he wants the network.",
    links: [
      { label: "Maven (cohort-based courses)", url: "https://maven.com" },
      { label: "PreSales Collective", url: "https://www.presalescollective.com" },
      { label: "YC Co-Founder Matching", url: "https://www.ycombinator.com/cofounder-matching" },
      { label: "Cyber Week TAU", url: "https://cyberweektau.com" },
      { label: "BSides TLV", url: "https://bsidestlv.com" },
    ],
  },

  // --------------------------------------------------------------------------
  // t8-israeli-meetups — his geography as an accountability + discovery asset
  // --------------------------------------------------------------------------
  {
    id: "t8-israeli-meetups",
    title: "Israeli security meetups & conferences — BSides TLV (with Cyber Week / DefenseTech Week / Cybertech)",
    creator: "Security BSides Tel Aviv community",
    url: "https://bsidestlv.com",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "community",
    format: "event",
    cost: {
      model: "freemium",
      note: "BSides TLV is a non-profit, community-run event; Cyber Week TAU is free/paid per the spec. Ticket prices not captured in the docs.",
    },
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "A local, in-person accountability loop — CFP deadlines to ship against, hallway feedback on his agent/NHI-security work, and face time with 8200-alumni founders, VC talent partners and prospective co-founders.",
    whyForHim:
      "His geography is an asset: BSides TLV runs at Tel Aviv University in the same November week as Cyber Week TAU (which the spec marks must-attend), so one week covers the local AI-security community, the talent partners the five-year plan tells him to contact (Cyberstarts, Team8, YL, Glilot) and co-founder scouting. Variant B's endpoint is literally 'present at BSides TLV / Cyber Week' — a talk built from p-redteam-writeup or p-nhi-prototype is the public proof for T7.",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T8_META", "T7_DOMAIN", "T6_FOUNDER"],
    skillIds: ["accountability", "israeli-ecosystem", "learning-in-public"],
    roleRelevance: ["FDE", "SE", "CEO", "CTO"],
    tags: ["community", "israeli_ecosystem", "conference", "cofounder", "defense_tech", "meetup"],
    freshness: "current",
    qualitySignal:
      "Spec Track 8 lists 'Israeli meetups' as accountability and Variant B ends with presenting at BSides TLV / Cyber Week. BSides TLV site (checked 2026-09-16) lists the 2026 edition 'Alice in AI Land' for Nov 11, 2026 at Smolarz Auditorium, TAU, with AI-hacking, hardware and bug-bounty villages plus a CTF; the site claims 10+ years running and 12,000+ participants annually (self-reported).",
    notes:
      "Dates drift yearly — re-verify each autumn. Companion conference records: t7-cyberweek (Nov 9–12, 2026), t7-defensetech-week (Dec 2–3, 2026), t7-cybertech (Jan 25–27, 2027). Artifact target: one accepted talk or village workshop per year from the T7 projects; until then, one 5-minute lightning-style demo recorded per d-demo-week is the rehearsal.",
    links: [
      { label: "Cyber Week TAU", url: "https://cyberweektau.com" },
      { label: "DefenseTech Week TAU", url: "https://en-cyber.tau.ac.il/events/DTWeek" },
      { label: "Cybertech Global Tel Aviv", url: "https://www.cybertechisrael.com" },
    ],
  },
];
