import type { Resource } from "@/types";

// Seeded from the curriculum spec, TRACK 4 — Forward-Deployed Engineer / Solutions
// Engineering (priorityRank 2). Spec IDs are used verbatim (t4-fde-explainers, t4-psc,
// t4-demo2win, t4-naase, t4-wtse); bundled mentions are additionally split into
// individual records. urlVerifiedDate "2026-09-01" = URL appears in the research doc;
// "2026-09-16" = verified at seed time.
export const t4Resources: Resource[] = [
  // -------------------------------------------------------------------------
  // FDE role fluency
  // -------------------------------------------------------------------------
  {
    id: "t4-fde-explainers",
    title: "FDE Playbook Analyses (Palantir origin → OpenAI / Anthropic / Databricks / Cohere / Google Cloud)",
    creator: "getperspective.ai; AI Engineer Insights",
    url: "https://getperspective.ai/blog/palantir-forward-deployed-engineering-playbook-anthropic-openai-copying",
    urlVerified: true,
    urlVerifiedDate: "2026-09-01",
    resourceType: "article",
    format: "reading",
    cost: { model: "free" },
    estHours: 1.5,
    timeBucket: "lt_2h",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "Role fluency: the FDE operating model (Palantir origin, 2005 → copied by OpenAI, Anthropic, Databricks, Cohere, Google Cloud), the 30–40% customer-discovery workload, and the customer-specific-ontology value unlock.",
    whyForHim:
      "FDE / founding SE is his first-choice seat by end of 2026 — the plan's 'best bridge' to a product-oriented CTO/CPO. These two pieces give him the vocabulary to interview like an insider and to map his solutions-architect / post-sales background onto the role's 2026 shape.",
    priority: "must_do",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE"],
    skillIds: ["fde-playbook", "technical-discovery", "customer-ontology"],
    roleRelevance: ["FDE", "SE", "PM", "CTO"],
    tags: ["fde", "playbook", "role_fluency", "phase1", "variant_a"],
    freshness: "current",
    qualitySignal:
      "Curriculum: must-read for role fluency. Key Finding #4: FDE is 'a hot, well-documented 2025–2026 category' — playbooks exist. Key insight: AI FDEs in 2026 spend 30–40% of the week on conversational customer discovery; the value unlock is building a customer-specific ontology.",
    notes:
      "Umbrella record for the two sources (also seeded individually as t4-fde-playbook-perspective and t4-fde-role-guide-aiei). Context: OpenAI stood up its FDE team in late 2024; Anthropic runs the function under its Applied AI group. Caveat from the research: FDE-market pieces are partly marketing — treat market-sizing/hype claims as press, not independently verified.",
    links: [
      { label: "getperspective.ai — Palantir FDE playbook (Anthropic/OpenAI copying it)", url: "https://getperspective.ai/blog/palantir-forward-deployed-engineering-playbook-anthropic-openai-copying" },
      { label: "AI Engineer Insights — Forward-Deployed AI Engineer role guide", url: "https://aiengineerinsights.com/blog/forward-deployed-ai-engineer/" },
    ],
  },
  {
    id: "t4-fde-playbook-perspective",
    title: "Palantir's Forward-Deployed Engineering Playbook — and How Anthropic/OpenAI Copy It",
    creator: "getperspective.ai",
    url: "https://getperspective.ai/blog/palantir-forward-deployed-engineering-playbook-anthropic-openai-copying",
    urlVerified: true,
    urlVerifiedDate: "2026-09-01",
    resourceType: "article",
    format: "reading",
    cost: { model: "free" },
    estHours: 0.75,
    timeBucket: "lt_2h",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "The Palantir-origin FDE playbook — embedded engineers, on-site delivery loops, product feedback ownership — and how the AI labs re-implemented it.",
    whyForHim:
      "The origin story he will be asked about in every FDE interview. Lets him explain why AI labs and his target Israeli startups (e.g. Tenzai, explicitly hiring FDEs) are staffing this role, and where his customer-facing post-sales muscle already fits.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE"],
    skillIds: ["fde-playbook"],
    roleRelevance: ["FDE", "SE", "CTO"],
    tags: ["fde", "playbook", "palantir"],
    freshness: "current",
    qualitySignal: "One of the two sources the curriculum names for the must-read FDE explainer set (t4-fde-explainers).",
    notes: "Part of t4-fde-explainers. Vendor/analyst blog — partly marketing per the research caveats.",
  },
  {
    id: "t4-fde-role-guide-aiei",
    title: "Forward-Deployed AI Engineer: Role Guide",
    creator: "AI Engineer Insights (aiengineerinsights.com)",
    url: "https://aiengineerinsights.com/blog/forward-deployed-ai-engineer/",
    urlVerified: true,
    urlVerifiedDate: "2026-09-01",
    resourceType: "article",
    format: "reading",
    cost: { model: "free" },
    estHours: 0.75,
    timeBucket: "lt_2h",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "What an AI FDE does week to week (30–40% conversational discovery), the customer-specific-ontology deliverable, and how the role differs from a classic SE or AI engineer.",
    whyForHim:
      "Turns the job title into a checklist he can benchmark himself against — discovery, ontology-building, shipping at the customer — and shows which of his existing solutions-architecture skills already count toward it.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE"],
    skillIds: ["fde-playbook", "customer-ontology", "technical-discovery"],
    roleRelevance: ["FDE", "SE", "PM"],
    tags: ["fde", "role_guide", "customer_ontology"],
    freshness: "current",
    qualitySignal: "One of the two sources the curriculum names for the must-read FDE explainer set (t4-fde-explainers).",
    notes: "Part of t4-fde-explainers. Treat market claims as press, not independently verified.",
  },

  // -------------------------------------------------------------------------
  // Community: PreSales Collective
  // -------------------------------------------------------------------------
  {
    id: "t4-psc",
    title: "PreSales Collective (PSC)",
    creator: "PreSales Collective",
    url: "https://www.presalescollective.com",
    urlVerified: true,
    urlVerifiedDate: "2026-09-01",
    resourceType: "community",
    format: "self_paced",
    cost: {
      model: "freemium",
      note: "Free membership (Slack + content library). Paid programs (discovery, demoing, objection handling; cohort) priced separately — see t4-psc-programs.",
    },
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "Presales craft by immersion — discovery, demoing and objection-handling patterns traded by a large SE/FDE practitioner community — plus a referral network into FDE / founding-SE roles.",
    whyForHim:
      "Free membership sits in Phase 1 / Variant A and in the Days 30–90 recommendation ('join PreSales Collective'). He has no presales peer group inside Tel Aviv's cyber scene; PSC's Slack is where the demo/discovery playbooks he needs are discussed daily, and T8 lists it as an accountability community.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE", "T8_META"],
    skillIds: ["demo-craft", "technical-discovery", "objection-handling", "accountability"],
    roleRelevance: ["FDE", "SE", "PM"],
    tags: ["community", "presales", "network", "phase1", "variant_a", "accountability"],
    freshness: "current",
    qualitySignal:
      "51,000+ members (15,973 in Slack, 39,000+ LinkedIn followers) per PSC's own 'How to get involved' page (research, Sept 2026); homepage at seed time shows '50,000+ professionals' and '15,000+ presales pros' in Slack.",
    notes:
      "Also runs Demo Days competitions (t4-psc-demo-days) — the model for the T4 public proof. Paid programs: discovery, demoing, objection handling; 10-week cohort (t4-psc-programs).",
    links: [
      { label: "Join free", url: "https://presalescollective.com/sign-up" },
      { label: "Community overview / how to get involved", url: "https://presalescollective.com/community-overview" },
      { label: "Slack community guidelines", url: "https://presalescollective.com/slack" },
      { label: "PreSales Academy (paid programs)", url: "https://presalescollective.com/academy" },
      { label: "Demo Days", url: "https://www.presalescollective.com/demo-days" },
    ],
  },
  {
    id: "t4-psc-programs",
    title: "PreSales Collective Paid Programs (PreSales Academy / Presales Foundations)",
    creator: "PreSales Collective",
    url: "https://presalescollective.com/academy",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "course",
    format: "cohort",
    cost: {
      model: "one_time",
      amount: 479,
      currency: "USD",
      note: "Price not captured in the research. Site at seed time (2026-09-16): PreSales Academy $479 (10 weeks, self-paced on-demand + mentorship); Presales Foundations (4-week cohort: discovery, demoing, objection handling) price not shown — re-verify.",
      freeAlternativeId: "t4-demo2win",
    },
    estHours: 25,
    timeBucket: "10_30h",
    difficulty: "foundational",
    prerequisites: ["t4-psc"],
    buildsSkill:
      "Structured presales fundamentals — discovery, demoing, objection handling, storytelling — with coaching and a rubric, instead of learning only by osmosis.",
    whyForHim:
      "He is senior, not junior: the Academy's job-search track is pitched below his level. Worth it only for the Foundations cohort's structured demo / objection-handling reps and the cohort accountability (T8); otherwise the demo books (t4-demo2win) plus the weekly demo drill cover the same ground for free.",
    priority: "optional",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE", "T8_META"],
    skillIds: ["technical-discovery", "demo-craft", "objection-handling", "accountability"],
    roleRelevance: ["SE", "FDE"],
    tags: ["cohort", "presales", "paid", "objection_handling", "demo"],
    freshness: "current",
    qualitySignal: "Run by PSC (51,000+ member community); no independent rating captured in the research.",
    notes:
      "Research describes PSC's paid programs as 'discovery, demoing, objection handling; 10-week cohort'; at seed time the 10-week Academy is self-paced and the 4-week Foundations course is the cohort — re-verify format and price. Hours are an estimate. Spend discipline: the plan's paid budget is reserved for HTB AI Red Teamer, one cohort (Aman Khan AI-PM or Hamel evals) and books — this is not on that list.",
    links: [
      { label: "Presales Foundations (4-week cohort)", url: "https://presalescollective.com/programs/foundations" },
      { label: "PSC Pro membership", url: "https://www.presalescollective.com/pro" },
    ],
  },
  {
    id: "t4-psc-demo-days",
    title: "PSC Demo Days (global presales demo competition)",
    creator: "PreSales Collective",
    url: "https://www.presalescollective.com/demo-days",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "conference",
    format: "event",
    cost: { model: "free", note: "Free to enter (site, Sept 2026)." },
    estHours: 8,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: ["t4-psc", "t4-great-demo"],
    buildsSkill:
      "Delivering a scored demo against a fictitious-product customer scenario and a published rubric — the exact muscle the T4 'ready when' (a 15-min demo that survives objections) tests.",
    whyForHim:
      "The T4 assessment's public proof is 'a PSC Demo Days-style recorded demo'. Even if no edition is open, reuse the scenario + rubric format to produce the demo reel the Phase 1 milestone requires for FDE applications, and to self-grade the weekly d-demo-week drill.",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T4_FDE_SE"],
    skillIds: ["demo-craft", "objection-handling"],
    roleRelevance: ["FDE", "SE"],
    tags: ["demo", "competition", "public_proof", "demo_reel"],
    freshness: "aging",
    qualitySignal:
      "PSC's flagship demo competition: two-stage (video submission → live finals) with a published rubric; the 2022 edition drew 37 global teams and $7,500+ in prizes; a Demo Days India edition ran in 2025. Named in the curriculum as the model for T4 public proof.",
    notes:
      "The page's most recent global edition is 2022 (finale July 19, 2022); re-verify whether a 2026 global edition is open. PSC's current flagship event is Sol/Con 2026. The format is reusable solo regardless — record a 15-min demo against a made-up scenario and grade it with the rubric.",
    links: [
      { label: "Sol/Con 2026", url: "https://presalescollective.com/solcon-2026" },
      { label: "Masterclass: How to Build an Award-Winning Demo (webinar)", url: "https://www.presalescollective.com/content/masterclass-how-to-build-an-award-winning-demo" },
    ],
  },

  // -------------------------------------------------------------------------
  // Demo craft canon
  // -------------------------------------------------------------------------
  {
    id: "t4-demo2win",
    title: "Demo Craft Canon: Great Demo! + Mastering Technical Sales",
    creator: "Peter Cohan; John Care",
    url: "https://greatdemo.com",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "book",
    format: "book",
    cost: { model: "one_time", note: "Two paperbacks; prices not captured in the research — re-verify at purchase." },
    estHours: 18,
    timeBucket: "10_30h",
    difficulty: "intermediate",
    prerequisites: ["t4-fde-explainers"],
    buildsSkill:
      "Demo craft (Great Demo!) and the SE operating manual (Mastering Technical Sales): structuring a demo around the customer's outcome, discovery before demo, POC/evaluation scoping, and objection handling mid-demo.",
    whyForHim:
      "He has post-sales / solutions-architecture reps, but the FDE bar is a 15-minute demo that survives objections (T4 ready-when). These two books are the methodology behind that bar; pair them with the weekly d-demo-week recording drill and the PSC Demo Days rubric.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE", "T5_SALES_GTM"],
    skillIds: ["demo-craft", "poc-scoping", "objection-handling", "technical-discovery"],
    roleRelevance: ["FDE", "SE", "CEO"],
    tags: ["book", "demo", "methodology", "bundle"],
    freshness: "current",
    qualitySignal:
      "Curriculum: 'High for FDE'. Mastering Technical Sales: '45,000+ students trained' (research). Great Demo! is the methodology PSC itself hosts webinars on (greatdemo.com carries a PSC webinar recording).",
    notes:
      "Bundle record; each book is also seeded individually (t4-great-demo, t4-mastering-technical-sales). Read Great Demo! first; MTS is the broader SE career manual. Also the free alternative to t4-psc-programs.",
    links: [
      { label: "Great Demo! (Peter Cohan / The Second Derivative)", url: "https://greatdemo.com" },
      { label: "Mastering Technical Sales (John Care)", url: "https://www.masteringtechnicalsales.com" },
    ],
  },
  {
    id: "t4-great-demo",
    title: "Great Demo!",
    creator: "Peter Cohan (The Second Derivative / Great Demo! LLC)",
    url: "https://greatdemo.com",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "book",
    format: "book",
    cost: { model: "one_time", note: "Price not captured in the research — re-verify at purchase." },
    estHours: 8,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "Demo craft: building the demo around the customer's specific situation, showing the payoff early, and running demos as discovery rather than feature tours.",
    whyForHim:
      "His weekly d-demo-week drill needs a method to self-review against; Great Demo! supplies the structure and PSC's Demo Days rubric supplies the scoring. This is the shortest route from 'can present' to 'can demo like an FDE'.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE"],
    skillIds: ["demo-craft"],
    roleRelevance: ["FDE", "SE", "CEO", "PM"],
    tags: ["book", "demo"],
    freshness: "current",
    qualitySignal:
      "Named in the curriculum as one of the two demo-craft texts (High for FDE); the Great Demo! methodology is taught commercially via The Second Derivative and in PSC-hosted webinars.",
    notes:
      "Site verified 2026-09-16 (methodology/training site; the book itself is not listed on the homepage — buy via a bookseller). Price not captured in the research.",
  },
  {
    id: "t4-mastering-technical-sales",
    title: "Mastering Technical Sales: The Sales Engineer's Handbook",
    creator: "John Care",
    url: "https://www.masteringtechnicalsales.com",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "book",
    format: "book",
    cost: { model: "one_time", note: "Price not captured in the research — re-verify at purchase." },
    estHours: 10,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: [],
    buildsSkill:
      "The SE operating manual: discovery, demo and POC/evaluation management, RFP handling, objection handling, and working alongside sales — the day-to-day of a solutions engineer.",
    whyForHim:
      "He is moving from post-sales / solutions architecture into a pre-sales-shaped FDE seat; MTS fills in the pre-sales half (POC scoping, evaluation criteria, objection handling) that his background under-indexes on.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE", "T5_SALES_GTM"],
    skillIds: ["poc-scoping", "objection-handling", "technical-discovery", "demo-craft"],
    roleRelevance: ["SE", "FDE"],
    tags: ["book", "presales", "poc", "objection_handling"],
    freshness: "current",
    qualitySignal:
      "'45,000+ students trained' per the research; the author's site at seed time claims '200,000+ Sales Engineers trained worldwide'. Editions 2002, 2008, 2014, 2022 — a long-running standard.",
    notes: "Buy the latest (2022) edition. Price not captured in the research — re-verify. The trained-students figure differs between the research (45,000+) and the site (200,000+).",
  },

  // -------------------------------------------------------------------------
  // Certification (skip) and staying current
  // -------------------------------------------------------------------------
  {
    id: "t4-naase",
    title: "NAASE Certified Sales Engineer (CSE) designation",
    creator: "North American Association of Sales Engineers (NAASE)",
    url: "https://sales-engineering.org/cse/",
    urlVerified: false,
    urlVerifiedDate: "2026-09-16",
    resourceType: "certification",
    format: "self_paced",
    cost: { model: "one_time", note: "Membership + certification fees not captured — re-verify (fee structure unknown)." },
    timeBucket: "2_10h",
    difficulty: "foundational",
    prerequisites: ["3+ years in a sales-engineering role (NAASE eligibility)"],
    buildsSkill: "A generic SE credential (CSE) — signals baseline sales-engineering competence to employers that screen for it.",
    whyForHim:
      "Certifications are deliberately de-emphasized in his plan ('artifacts > certs'); a generic SE badge adds nothing to a seed-stage FDE application, where a demo reel and shipped repos decide. Skip unless a specific target employer asks for it.",
    priority: "skip_unless_relevant",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE"],
    skillIds: ["technical-discovery", "demo-craft"],
    roleRelevance: ["SE"],
    tags: ["certification", "skip", "presales"],
    freshness: "unknown",
    qualitySignal: "Research verdict: optional/skip. NAASE founded 2020 (Stratham, NH); CSE requires 3+ years of SE experience.",
    notes:
      "URL surfaced via search as NAASE's official domain but did not resolve (DNS) at seed time 2026-09-16 — re-verify. Membership/certification fees not captured.",
  },
  {
    id: "t4-wtse",
    title: "We The Sales Engineers (podcast + blog)",
    creator: "Ramzi Marjaba",
    url: "https://wethesalesengineers.com",
    urlVerified: true,
    urlVerifiedDate: "2026-09-16",
    resourceType: "podcast",
    format: "self_paced",
    cost: { model: "free", note: "Content is free; the site also sells 1:1 coaching ('the hotline') — not needed." },
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: [],
    buildsSkill:
      "Practitioner-level view of the SE job — discovery, demos, POCs, career moves — as interviews with working SEs; a staying-current feed for the craft.",
    whyForHim:
      "A low-effort way to absorb SE vocabulary and war stories during commutes while he job-hunts; use it to pre-load interview answers on POC scoping and objection handling. Keep it inside the 4–6 feed cap the plan sets for staying current.",
    priority: "optional",
    producesArtifact: false,
    trackIds: ["T4_FDE_SE"],
    skillIds: ["fde-playbook", "poc-scoping", "objection-handling"],
    roleRelevance: ["SE", "FDE"],
    tags: ["podcast", "blog", "staying_current", "presales"],
    freshness: "current",
    qualitySignal: "Listed in the curriculum as the free SE practitioner podcast/blog; no rating captured. Long-running show with blog and webinar archives (site, Sept 2026).",
  },
];
