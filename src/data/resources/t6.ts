import type { Resource } from "@/types";

// TRACK 6 — Fundraising & Founder Skills (priorityRank 5; the co-founder
// sub-workstream is must-do). Seeded from docs/curriculum-spec.md (TRACK 6,
// Hands-On Work, Assessments) and docs/five-year-plan.md (co-founder strategy,
// Israeli VC map, comp/equity norms). Bundled spec entries are split into
// individual records where that makes them separately trackable; spec IDs are
// kept verbatim.
//
// URL verification: "2026-09-01" = URL appears in the source docs.
// "2026-09-16" = fetched during seeding (urlVerified true) or recorded from
// memory (urlVerified false — see notes).

export const t6Resources: Resource[] = [
  // ---------------------------------------------------------------------------
  // YC canon
  // ---------------------------------------------------------------------------
  {
    id: "t6-yc-startup-school",
    title: "YC Startup School + YC Library",
    creator: "Y Combinator",
    url: "https://www.ycombinator.com/library",
    urlVerified: true,
    urlVerifiedDate: "2026-09-01",
    resourceType: "course",
    format: "self_paced",
    cost: { model: "free" },
    estHours: 20,
    timeBucket: "10_30h",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "Working fluency in how startups are financed and built: SAFEs and dilution, seed fundraising mechanics, first hires, and the YC founder playbook end-to-end.",
    whyForHim:
      "His last founding attempt died on team formation and GTM leadership, not on the idea. Startup School gives him the CEO-side vocabulary (SAFEs, fundraising, hiring) he needs to co-found credibly as CPO or product-CTO next to a CEO-type — and it is free, so it sits in Phase 3 (months 12–18) of the primary path and in Variant C without touching the budget.",
    priority: "must_do",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["fundraising", "safes", "hiring", "cofounder"],
    roleRelevance: ["CEO", "CTO", "PM"],
    tags: ["fundraising", "safes", "hiring", "yc", "free_canon", "phase_3"],
    freshness: "current",
    qualitySignal:
      "The canonical free founder curriculum; the spec marks it must-do and anchors Phase 3 and Variant C on it.",
    notes:
      "Spec: course/articles, free, must-do; covers SAFEs, fundraising, hiring. Startup School (startupschool.org, verified 2026-09-16) is YC's free online platform with instruction from YC partners and also hosts the co-founder matching tool (t6-yc-cofounder). The SAFE documents themselves are split out as t6-yc-safe-docs.",
    links: [
      { label: "YC Startup School (free course platform)", url: "https://www.startupschool.org" },
      { label: "YC Library (essays + videos)", url: "https://www.ycombinator.com/library" },
    ],
  },
  {
    id: "t6-yc-cofounder",
    title: "YC Co-Founder Matching",
    creator: "Y Combinator",
    url: "https://www.ycombinator.com/cofounder-matching",
    urlVerified: true,
    urlVerifiedDate: "2026-09-01",
    resourceType: "community",
    format: "tool",
    cost: { model: "free" },
    timeBucket: "ongoing",
    difficulty: "intermediate",
    prerequisites: ["t6-cofounder-equity-essays"],
    buildsSkill:
      "A structured co-founder search: a profile, matching beyond his own network, a time-boxed trial project, and a written equity/vesting agreement instead of a handshake.",
    whyForHim:
      "His documented failure mode is co-founder selection — he could not assemble the CEO+CTO pairing last time. The spec makes this a dedicated must-do workstream, not vibes: use matching to widen the pool beyond his 8200 circle, run a trial project before committing, and close with a written agreement (roughly equal split, 4-year vesting, 1-year cliff). The Phase 3 milestone is literally 'a co-founder trial completed with written agreement'.",
    priority: "must_do",
    producesArtifact: true,
    trackIds: ["T6_FOUNDER", "T8_META"],
    skillIds: ["cofounder", "cap-table", "accountability"],
    roleRelevance: ["CEO", "CTO", "PM"],
    tags: ["cofounder", "equity", "vesting", "trial_project", "community", "phase_3"],
    freshness: "current",
    qualitySignal:
      "Spec: MUST-DO given his failure mode; the platform's median is 3–6 months from first contact to a signed agreement.",
    notes:
      "Standard per the spec: ~equal splits, 4-yr vesting / 1-yr cliff; run a trial project before committing. Artifact: a signed co-founder agreement after the trial. Combine with the Israeli structural routes (t6-team8-foundry, t6-cyberstarts) — Israeli founders overwhelmingly meet co-founders via unit (8200/81), prior company and VC programs. The 'co-founder prenup' talk is a soft-skill workout: AI-roleplay both sides.",
    links: [
      {
        label: "How to Split Equity Among Co-Founders (YC)",
        url: "https://www.ycombinator.com/library/5x-how-to-split-equity-among-co-founders",
      },
      {
        label: "Co-Founder Equity Mistakes to Avoid (YC)",
        url: "https://www.ycombinator.com/library/LP-co-founder-equity-mistakes-to-avoid",
      },
    ],
  },
  {
    id: "t6-cofounder-equity-essays",
    title: "YC Essays: Splitting Equity & Co-Founder Equity Mistakes",
    creator: "Y Combinator Library",
    url: "https://www.ycombinator.com/library/5x-how-to-split-equity-among-co-founders",
    urlVerified: true,
    urlVerifiedDate: "2026-09-01",
    resourceType: "article",
    format: "reading",
    cost: { model: "free" },
    estHours: 1,
    timeBucket: "lt_2h",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "A defensible equity-split and vesting rationale — equal-ish splits, 4-year vesting with a 1-year cliff — and the mistakes (unvested, lopsided or undocumented splits) that blow founding teams apart.",
    whyForHim:
      "One hour of reading aimed squarely at the thing that sank his last attempt. He should have the split/vesting/cliff norms memorised before any co-founder conversation, and use them to reframe the failed attempt as 'learned the co-founder-fit lesson the hard way' in his positioning statement (five-year plan, this month).",
    priority: "must_do",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["cofounder", "cap-table"],
    roleRelevance: ["CEO", "CTO", "PM"],
    tags: ["cofounder", "equity", "vesting", "yc", "quick_read", "phase_3"],
    freshness: "current",
    qualitySignal:
      "Named in the spec as the must-do companion reading to YC co-founder matching; YC Library is the standard reference on founder equity.",
    notes:
      "Split out of the spec's t6-yc-cofounder bundle so the reading can be ticked off separately from the months-long search. Read before t6-yc-cofounder.",
    links: [
      {
        label: "How to Split Equity Among Co-Founders",
        url: "https://www.ycombinator.com/library/5x-how-to-split-equity-among-co-founders",
      },
      {
        label: "Co-Founder Equity Mistakes to Avoid",
        url: "https://www.ycombinator.com/library/LP-co-founder-equity-mistakes-to-avoid",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Strategic narrative / pitching
  // ---------------------------------------------------------------------------
  {
    id: "t6-andy-raskin",
    title: "The Greatest Sales Deck I've Ever Seen",
    creator: "Andy Raskin",
    url: "https://medium.com/the-mission/the-greatest-sales-deck-ive-ever-seen-4f4ef3391ba0",
    urlVerified: true,
    urlVerifiedDate: "2026-09-01",
    resourceType: "article",
    format: "reading",
    cost: { model: "free" },
    estHours: 0.5,
    timeBucket: "lt_2h",
    difficulty: "foundational",
    prerequisites: ["t5-obviously-awesome"],
    buildsSkill:
      "The five-part strategic narrative: name a big shift in the world → show winners and losers → tease the Promised Land → present product capabilities as 'magic gifts' → offer evidence. Reusable for sales decks, VC pitches and the company story.",
    whyForHim:
      "He needs one story that works for three audiences — VCs, CISO buyers and future co-founders — and this is the template the spec ties to both the T5 ready-when ('deliver a Raskin-narrative pitch') and the T6 one ('pitch to a VC'). It is also the natural frame for telling the failed-founding story as a strength. Soft-skill workout: record the 5-part narrative for his own idea and self-review weekly.",
    priority: "must_do",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER", "T5_SALES_GTM"],
    skillIds: ["narrative", "strategic-narrative", "fundraising", "positioning"],
    roleRelevance: ["CEO", "CTO", "SE", "FDE", "PM"],
    tags: ["strategic_narrative", "pitch", "sales_deck", "fundraising", "quick_read", "phase_3"],
    freshness: "current",
    qualitySignal:
      "Reported 2M+ views (per the spec); the most-cited strategic-narrative piece in B2B. Must-read for pitching/fundraising.",
    notes:
      "~30 min read. Spec sequences it after Dunford's Obviously Awesome + Sales Pitch (t5-obviously-awesome, t5-sales-pitch) so the narrative sits on a real positioning. Follow-up per spec: 'The Making of a Great Strategic Narrative' (Uberflip case study) — linked; URL located by search on 2026-09-16.",
    links: [
      {
        label: "Follow-up: The Making of a Great Strategic Narrative",
        url: "https://medium.com/the-mission/the-making-of-a-great-sales-narrative-978938b3926",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // People leadership (spec bundle t6-managers-path, split into three)
  // ---------------------------------------------------------------------------
  {
    id: "t6-managers-path",
    title: "The Manager's Path",
    creator: "Camille Fournier (O'Reilly)",
    url: "https://www.oreilly.com/library/view/the-managers-path/9781491973882/",
    urlVerified: false,
    urlVerifiedDate: "2026-09-16",
    resourceType: "book",
    format: "book",
    cost: { model: "one_time", note: "Book; price not captured in the research — re-verify at purchase." },
    estHours: 8,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "The engineering-leadership ladder from tech lead to CTO: managing people and teams, running 1:1s, handling underperformance, and what a CTO actually owns versus a VP R&D.",
    whyForHim:
      "He has never run an engineering org, and the five-year plan is explicit that a product-oriented CTO still has to represent engineering to investors and set technical strategy. Fournier's book is the one written for the tech-lead → manager → CTO path, so it is the first of the three people-leadership books in the spec, scheduled for Phase 3 ('The Manager's Path / High Output Management').",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["leadership", "hiring"],
    roleRelevance: ["CTO", "CEO"],
    tags: ["people_management", "engineering_leadership", "cto", "book", "phase_3"],
    freshness: "current",
    qualitySignal:
      "Spec: 'People leadership. High for CTO.' Widely regarded as the standard text on the engineering-management path.",
    notes:
      "One of the three people-management books bundled in the spec's t6-managers-path (with High Output Management and Radical Candor) — split into separate records. O'Reilly URL from memory; the site returned 403 to automated fetch on 2026-09-16, so open in a browser to confirm. Feeds the 'Running 1:1s and giving feedback' soft-skill workout.",
  },
  {
    id: "t6-high-output-management",
    title: "High Output Management",
    creator: "Andrew S. Grove",
    url: "https://www.penguinrandomhouse.com/books/86942/high-output-management-by-andrew-s-grove/",
    urlVerified: false,
    urlVerifiedDate: "2026-09-16",
    resourceType: "book",
    format: "book",
    cost: { model: "one_time", note: "Book; price not captured in the research — re-verify at purchase." },
    estHours: 8,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "Managerial leverage: output-oriented management, delegation, meetings and 1:1s as production tools, task-relevant maturity — the operating-system view of running a team.",
    whyForHim:
      "'People management basics' is a named gap in the five-year plan's skills analysis. Grove's book is the classic every Israeli and US VC expects a founder to have internalised; for a first-time CTO/CPO it turns management from instinct into a system of leverage, and its output/indicator thinking carries straight into owning a metric in his first year at the seed startup.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["leadership", "hiring"],
    roleRelevance: ["CTO", "CEO", "PM"],
    tags: ["people_management", "leadership", "classic", "book", "phase_3"],
    freshness: "current",
    qualitySignal:
      "Spec: bundled with The Manager's Path as 'High for CTO'; the canonical management text cited across YC, a16z and First Round content.",
    notes:
      "Split from the spec's t6-managers-path bundle. Publisher URL recorded from memory (not fetch-verified) — any edition works; the book is evergreen despite its age.",
  },
  {
    id: "t6-radical-candor",
    title: "Radical Candor",
    creator: "Kim Scott",
    url: "https://www.radicalcandor.com/the-book/",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "book",
    format: "book",
    cost: { model: "one_time", note: "Book; price not captured in the research — re-verify at purchase." },
    estHours: 7,
    timeBucket: "2_10h",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "Giving feedback that is both caring and direct; running 1:1s and career conversations; recognising ruinous empathy and obnoxious aggression in himself and others.",
    whyForHim:
      "As a customer-facing solutions architect he is practised at being diplomatic with buyers; a CTO/CPO has to be direct with reports and co-founders. Radical Candor is the frame the spec names for the 'running 1:1s and giving feedback' and 'saying no' workouts, and it doubles as the vocabulary for the co-founder 'prenup' conversation.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["leadership", "cofounder"],
    roleRelevance: ["CTO", "CEO", "PM"],
    tags: ["feedback", "people_management", "one_on_ones", "book", "phase_3"],
    freshness: "current",
    qualitySignal:
      "Spec: part of the 'High for CTO' people-leadership trio; official book page verified 2026-09-16.",
    notes: "Split from the spec's t6-managers-path bundle.",
  },

  // ---------------------------------------------------------------------------
  // VC content canon (spec bundle t6-first-round, split into three)
  // ---------------------------------------------------------------------------
  {
    id: "t6-first-round",
    title: "First Round Review",
    creator: "First Round Capital",
    url: "https://review.firstround.com",
    urlVerified: true,
    urlVerifiedDate: "2026-09-01",
    resourceType: "article",
    format: "reading",
    cost: { model: "free" },
    timeBucket: "ongoing",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "Company-building craft from operators: fundraising narratives, first hires, founder-led sales, product and management playbooks — plus a rubric to review his own pitch deck against.",
    whyForHim:
      "The spec's public proof for T6 is 'a real pitch deck reviewed against a First Round-style rubric'. First Round Review is the densest free source of tactical founder content and also hosts Pete Kazanjy's founder-led-selling material that pairs with Founding Sales (t5-founding-sales). Use it as the curation source for SaaS metrics (t6-saas-metrics) rather than reading it front-to-back.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER", "T5_SALES_GTM"],
    skillIds: ["fundraising", "hiring", "narrative", "saas-metrics", "founder-led-sales"],
    roleRelevance: ["CEO", "CTO", "PM"],
    tags: ["fundraising", "company_building", "vc_content", "free", "ongoing", "phase_3"],
    freshness: "current",
    qualitySignal:
      "Spec: 'Fundraising/company-building. High.' Named with a16z and Sequoia as the free VC-content canon.",
    notes:
      "Bundled in the spec with a16z and Sequoia content (split into t6-a16z and t6-sequoia). Spec guidance: curate 4–6 feeds max in total — this is the one T6 feed worth subscribing to.",
  },
  {
    id: "t6-a16z",
    title: "a16z Content (Enterprise, Fundraising & the FDE Essays)",
    creator: "Andreessen Horowitz",
    url: "https://a16z.com",
    urlVerified: false,
    urlVerifiedDate: "2026-09-16",
    resourceType: "article",
    format: "reading",
    cost: { model: "free" },
    timeBucket: "ongoing",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "The investor-side view of company building and category narratives: how a top-tier fund thinks about enterprise/AI startups, and the definitive framing of the forward-deployed-engineer role.",
    whyForHim:
      "a16z is one of the US funds active in Israeli AI×cyber (five-year plan) and the source of the Joe Schmidt piece (June 2025) calling FDE 'the hottest job in startups' — the role he is targeting first. Reading a16z gives him investor vocabulary for the 2029–30 raise and the framing for his FDE story now.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER", "T4_FDE_SE"],
    skillIds: ["fundraising", "narrative", "fde-playbook"],
    roleRelevance: ["CEO", "CTO", "FDE", "PM"],
    tags: ["vc_content", "fde", "fundraising", "free", "ongoing"],
    freshness: "current",
    qualitySignal:
      "Spec bundles a16z with First Round Review as 'High'; the five-year plan cites a16z's FDE analysis as a primary source (FDE postings +800% Jan–Sept 2025 per Indeed/FT).",
    notes:
      "Split from the spec's t6-first-round bundle. URL is the fund's main site, recorded from memory (not fetch-verified). Treat as a reference to search, not another subscription (spec: 4–6 feeds max).",
  },
  {
    id: "t6-sequoia",
    title: "Sequoia Capital Content (Pitch Outline & Founder Essays)",
    creator: "Sequoia Capital",
    url: "https://www.sequoiacap.com",
    urlVerified: false,
    urlVerifiedDate: "2026-09-16",
    resourceType: "article",
    format: "reading",
    cost: { model: "free" },
    estHours: 3,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "The investor-standard pitch skeleton (problem, why now, solution, market, competition, product, business model, team, financials) and how a top-tier fund evaluates seed companies.",
    whyForHim:
      "Sequoia led Corma's $60M seed and is active in Israeli AI×cyber; its pitch outline is the de-facto deck structure VCs expect. Layer the Raskin narrative (t6-andy-raskin) on top of it to produce the Phase 3 pitch deck the T6 assessment asks for.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["fundraising", "narrative"],
    roleRelevance: ["CEO", "CTO"],
    tags: ["vc_content", "pitch_deck", "fundraising", "free", "phase_3"],
    freshness: "current",
    qualitySignal: "Spec bundles Sequoia with First Round Review as 'High'.",
    notes:
      "Split from the spec's t6-first-round bundle. Main-site URL and the pitch-outline sub-link are from memory (not fetch-verified) — re-verify. Treat as a reference, not a feed.",
    links: [
      {
        label: "Writing a Business Plan (pitch deck outline)",
        url: "https://www.sequoiacap.com/article/writing-a-business-plan/",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SaaS finance / SAFEs / cap tables
  // ---------------------------------------------------------------------------
  {
    id: "t6-yc-safe-docs",
    title: "YC SAFE Documents & User Guide",
    creator: "Y Combinator",
    url: "https://www.ycombinator.com/documents",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "template",
    format: "reading",
    cost: { model: "free" },
    estHours: 2,
    timeBucket: "2_10h",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "How post-money SAFEs work — valuation cap vs discount vs uncapped MFN, pro-rata side letters — and how they convert and dilute at the priced round.",
    whyForHim:
      "SAFEs are how Israeli seed rounds with US funds get papered; the spec's YC Library entry 'covers SAFEs' and the T6 ready-when requires he can 'explain SAFEs/dilution'. Two hours with the actual documents and the user guide beats any summary, and it is the prerequisite for the cap-table exercise in t6-saas-metrics.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["safes", "cap-table", "fundraising"],
    roleRelevance: ["CEO", "CTO"],
    tags: ["safes", "fundraising", "legal_docs", "yc", "free", "phase_3"],
    freshness: "current",
    qualitySignal:
      "The industry-standard financing instrument, published by its author (YC); page verified 2026-09-16 listing the cap / discount / MFN variants, the pro-rata side letter and the user guide.",
    notes:
      "Split out of the spec's YC Library entry so it can be sequenced before t6-saas-metrics. Non-US variants exist (Canada, Cayman Islands, Singapore); Israeli companies typically adapt the US form — confirm with counsel.",
  },
  {
    id: "t6-saas-metrics",
    title: "SaaS Finance Literacy: ARR, NRR, CAC, Magic Number, Burn Multiple, Cap Tables",
    creator: "Curated (First Round Review + Carta)",
    url: "https://carta.com/learn/",
    urlVerified: false,
    urlVerifiedDate: "2026-09-16",
    resourceType: "framework",
    format: "reading",
    cost: { model: "free" },
    estHours: 8,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: ["t6-yc-safe-docs"],
    buildsSkill:
      "Reading and building the numbers a seed/Series A investor asks about — ARR and NRR, CAC and payback, the magic number, burn multiple — and modelling dilution across SAFEs and priced rounds by building a cap table from scratch.",
    whyForHim:
      "The T6 ready-when opens with 'I can build a cap table, explain SAFEs/dilution'. As a future CPO/product-CTO he will own metrics conversations with the CEO and board; as an FDE at a seed startup, NRR and burn multiple tell him which customers and features actually matter. It is also the language for negotiating his own 0.25%+ equity (five-year plan comp targets).",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["saas-metrics", "cap-table", "safes", "fundraising"],
    roleRelevance: ["CEO", "CTO", "PM", "FDE"],
    tags: ["saas_metrics", "cap_table", "dilution", "finance", "phase_3"],
    freshness: "current",
    qualitySignal:
      "Spec: 'Curate via First Round + Carta resources. High.' Carta is the de-facto cap-table platform; First Round Review the standard operator source.",
    notes:
      "Carta Learn URL from memory; the site returned 403 to automated fetch on 2026-09-16 — open in a browser to confirm. Artifact: a spreadsheet cap table for a hypothetical Israeli seed (founders + option pool + two SAFEs + priced seed) showing dilution per round. Equity context (TLV Partners survey, Aug 2025, via the five-year plan): senior engineers at Israeli seed startups typically >0.5%, mid-level 0.15–0.25%; the first five hires get the most generous packages.",
    links: [
      { label: "First Round Review", url: "https://review.firstround.com" },
      { label: "YC SAFE documents + user guide", url: "https://www.ycombinator.com/documents" },
    ],
  },

  // ---------------------------------------------------------------------------
  // Israeli ecosystem (spec: t6-israeli-fundraising; five-year plan §2, §4)
  // ---------------------------------------------------------------------------
  {
    id: "t6-israeli-fundraising",
    title: "Israeli Fundraising Norms & the Seed VC Map",
    creator: "Curated (five-year plan; Startup Nation Central, Cyber Week TAU)",
    url: "https://finder.startupnationcentral.org",
    urlVerified: false,
    urlVerifiedDate: "2026-09-16",
    resourceType: "framework",
    format: "reading",
    cost: { model: "free" },
    timeBucket: "ongoing",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "A working map of how Israeli seed rounds happen: the 8200/81 network effect, the serial-founder premium, which local and US funds lead AI×cyber seeds, the foundry/inception routes to core-team seats, and local comp/equity norms.",
    whyForHim:
      "This is his geography and his network. The five-year plan's first action is to talk to talent partners at Cyberstarts, Team8, YL and Glilot this month; the same relationships become his fundraising pipeline in 3–4 years ('keep a live VC pipeline', 'build FOMO'). He should know each fund's model (Cyberstarts inception, Team8 foundry) and the equity/comp norms before negotiating his seed-startup offer — and before pitching in 2029–30.",
    priority: "must_do",
    producesArtifact: true,
    trackIds: ["T6_FOUNDER", "T7_DOMAIN"],
    skillIds: ["israeli-ecosystem", "fundraising", "cofounder"],
    roleRelevance: ["CEO", "CTO", "FDE", "PM"],
    tags: ["israel", "vc", "8200", "seed", "ecosystem", "phase_1", "ongoing"],
    freshness: "current",
    qualitySignal:
      "Sourced from the five-year plan (Sept 2026): the top-tier Israeli seed cyber/AI VC list, TLV Partners equity survey (Aug 2025), the Ibex Investors 8200 study and GotFriends comp data (Jerusalem Post, July 2026).",
    notes:
      "Artifact: a tracked list of 8–10 funds with talent-partner contacts plus the one-line positioning statement. Local top-tier seed cyber/AI funds: Cyberstarts, Team8, YL Ventures, Glilot, Aleph, Vertex, Entrée, TLV Partners, Grove; US funds active in Israel: Sequoia, a16z, Lightspeed, Accel, Greylock, Index, Bessemer, Notable, Conviction. Norms: nearly 50% of $100M+ Israeli cyber exits had 8200-trained founders and 8200-founded startups averaged $317M acquisition prices (Ibex Investors); founders overwhelmingly meet co-founders via unit, prior company and VC programs. Comp (GotFriends via Jerusalem Post, July 2026): average tech salary NIS 39,810; LLM/RAG/NLP specialists NIS 43,212 — his 35–50k target is in-band, 45–50k top-quartile. Equity (TLV Partners, Aug 2025): senior >0.5%, mid-level 0.15–0.25%. Caveats: $60–75M mega-seeds launching with 30–80 staff offer less equity; Cyberstarts' Sunrise program drew a 2024 conflict-of-interest controversy — mentioned for completeness, not endorsement. Finder URL (Startup Nation Central's startup/investor database) from memory — not fetch-verified; the spec says to curate via Track 7 ecosystem sources (Cyber Week TAU etc.).",
    links: [
      { label: "Cyber Week TAU (ecosystem source, Track 7)", url: "https://cyberweektau.com" },
      { label: "Team8", url: "https://team8.vc" },
      { label: "Cyberstarts", url: "https://cyberstarts.com" },
      { label: "YL Ventures", url: "https://www.ylventures.com" },
      { label: "Glilot Capital", url: "https://www.glilotcapital.com" },
      { label: "Aleph", url: "https://aleph.vc" },
    ],
  },
  {
    id: "t6-team8-foundry",
    title: "Team8 Foundry (Venture Creation)",
    creator: "Team8",
    url: "https://team8.vc",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "community",
    format: "tool",
    cost: { model: "free" },
    timeBucket: "ongoing",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "How the foundry / venture-creation model works: co-founding a company with a fund that supplies the problem thesis, first customers (its CISO network) and early capital — and what that costs in equity and control.",
    whyForHim:
      "The five-year plan names Team8's foundry as an explicit co-found-with-them sign-up route and one of the 'fastest routes to core-team seats' — a structural fix for his co-founder-finding failure mode rather than another networking hope. It is also on this month's talent-partner call list, and Mate Security (AI-native SOC, a target startup) is Team8-backed.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["cofounder", "israeli-ecosystem", "fundraising"],
    roleRelevance: ["CEO", "CTO", "PM", "FDE"],
    tags: ["israel", "foundry", "venture_creation", "cofounder", "vc", "phase_1"],
    freshness: "current",
    qualitySignal:
      "Site verified 2026-09-16: 'Venture-Creation and Venture-Capital Fund' with a ProFounders program across cybersecurity, software infrastructure, fintech and digital health. Named in the five-year plan as a foundry/EIR route.",
    notes:
      "Foundry equity and control terms are not in the research — ask directly. Pair with t6-yc-cofounder: matching finds the person, the foundry supplies the problem and first customers.",
  },
  {
    id: "t6-cyberstarts",
    title: "Cyberstarts (Inception-Stage Cyber VC)",
    creator: "Cyberstarts",
    url: "https://cyberstarts.com",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "community",
    format: "tool",
    cost: { model: "free" },
    timeBucket: "ongoing",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "The inception-investing model: how a cyber-only seed fund forms founding teams around a validated CISO problem, and how to approach its talent partners for a core-team seat.",
    whyForHim:
      "Cyberstarts backs NewCore and Onyx Security (two of his target startups, both 8200-led) and is the first talent-partner call in the five-year plan's 'this month' list. Inception investing is the other Israeli structural route to a core-team seat besides Team8's foundry — exactly where his 8200 + solutions-architect profile clusters with organic co-founders.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T6_FOUNDER"],
    skillIds: ["israeli-ecosystem", "fundraising", "cofounder"],
    roleRelevance: ["CEO", "CTO", "FDE", "PM"],
    tags: ["israel", "vc", "inception", "cyber", "phase_1"],
    freshness: "aging",
    qualitySignal:
      "Named in the five-year plan as a top-tier Israeli seed cyber VC and an inception-model route; site verified 2026-09-16.",
    notes:
      "Caveat (five-year plan): the Sunrise program (CISO advisory network) drew a 2024 conflict-of-interest controversy that led Cyberstarts to suspend Sunrise payments — mentioned for completeness, not endorsement. As of 2026-09-16 the site does not mention Sunrise or 'inception' by name (it describes itself as 'the day one partner' for cybersecurity companies) — re-verify the current program structure before referencing it in conversation.",
  },
];
