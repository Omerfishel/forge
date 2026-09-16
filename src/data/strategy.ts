// Strategy ("Compass") content — seeded with full fidelity from
// docs/five-year-plan.md ("From Cyber Generalist to Founder: A 5-Year Plan (2026–2031)").
// Numbers, quotes and sources are kept verbatim from the document.
import type { Strategy } from "@/types";

export const strategy: Strategy = {
  // ---------------------------------------------------------------------------
  // TL;DR (the 3 bullets)
  // ---------------------------------------------------------------------------
  tldr: [
    "Target the AI×cyber intersection where your 8200 + solutions-architect background is an unfair advantage — specifically agent/non-human identity security, AI-native SOC / AI-for-cyber, and cyber-for-physical-AI — and join a top-tier-VC-backed Israeli seed startup in one of these lanes by end of 2026.",
    "Aim for a Forward-Deployed Engineer / founding Solutions Engineer role first (not PM) — a16z (Joe Schmidt, June 2025) called it \"the hottest job in startups,\" postings grew more than 800% between January and September 2025 (Indeed/Financial Times analysis), it fits your post-sales background, and it is the best bridge to a product-oriented CTO/CPO seat in 2029–30.",
    "Your comp targets are realistic; your equity target is at the high end — 35–50k ILS/month is in-band for a senior core-team hire, but 0.25%+ is achievable mainly at true employee #1–5 seed startups, not the $60–75M mega-seeds that now launch with 30–80 staff.",
  ],

  // ---------------------------------------------------------------------------
  // Key Findings (every subsection of the doc's "Key Findings")
  // ---------------------------------------------------------------------------
  keyFindings: [
    {
      id: "kf-macro-backdrop",
      title: "The macro backdrop is unusually favorable",
      body: "AI security is the fastest-forming subsector in cybersecurity history. Per Crunchbase News (Jan 2026), investors put $18 billion into cybersecurity across seed- through growth-stage rounds in 2025, up about 26% from 2024, with early-stage (Series A/B) up 63% to $7.5B — with AI-native security overtaking identity as the fastest-growing VC category. Israel is the #2 global hub for AI security (roughly 90 of ~400 vendors on the Prompt Security AI-security map). At the same time, 2025 cyber M&A was roughly $96B across 400 transactions — a wave that includes many Israeli AI-security startups (Cyera→Oasis $1B; Cisco→Astrix ~$400M; Palo Alto→Koi ~$300M; Silverfort→Fabrix; SailPoint→Entro ~$200M). This means core-team seats at the next cohort of seed startups carry real acquisition-driven upside.",
    },
    {
      id: "kf-domain-verdicts",
      title: "Your three canvas domains — verdicts",
      body: "- Cyber for AI / AI security (STRONGEST FIT). Securing AI agents is \"the defining cybersecurity challenge of 2026\" (Bessemer). Sub-lanes: agent/non-human identity (NHI), AI-SPM, prompt-injection/guardrails/runtime, MCP/tool-use security, AI supply chain. Huge Israeli density and top-tier VC backing. This is your best home base.\n- AI for cyber (STRONG FIT). AI-native SOC, autonomous pentesting/red-teaming, AI security analysts. \"Corma\" (your canvas example) is real: a San Francisco + 8200 defensive-cyber foundation-model lab that raised a $60M seed led by Sequoia (with Khosla and Coatue, Aug 2026). Very fundable, but the deep-ML versions need a research co-founder.\n- AI infra (WEAKEST FIT for you). Compute/GPU/inference is capital-heavy and late-stage-dominated; software layers (evals, observability, RL environments) are viable for small teams but crowded and SF/YC-dominated — and require hands-on ML you lack. Not your unfair advantage.\n- Physical AI (SELECTIVE FIT via cyber + defense). World models/robotics foundation models are hot but ML-research-heavy. Your wedge is cyber-for-physical-AI / OT security for robots and Israeli defense tech, which is booming.",
    },
    {
      id: "kf-defense-tech",
      title: "Israeli defense tech is a real, fast-growing adjacent domain",
      body: "Per Globes (Dec 2025), MAFAT-linked Israeli defense-tech startups raised \"over $1 billion... greater than all previous years combined\" in 2025, versus about $150 million in 2024. The Jerusalem Post (2026) reports they raised \"nearly $3 billion in the first six months of 2026... three times the $1b. raised during 2025,\" and that \"defense-tech and dual-use companies accounted for almost 30% of the $8.4b. in private investment in Israel's hi-tech sector\" in H1 2026, with roughly 800 startups on direct Ministry of Defense procurement orders. For an 8200 alumnus this is a natural, high-tailwind lane, especially at the cyber/autonomy intersection.",
    },
    {
      id: "kf-role-strategy",
      title: "Role strategy: FDE > PM > Developer for you now",
      body: "- PM at seed is often NOT a core-team seat. Most seed founders are their own PMs and hire the first PM around Series A. Founding-PM roles exist but are scarce and usually go to domain experts — which you can leverage (8200 + security expertise), but it's a harder door than FDE.\n- FDE / founding solutions engineer is the best bridge. The role exploded (>800% more postings Jan–Sept 2025; a16z called it \"the hottest job in startups\"), pays a premium ($300–550k+ total comp in the US, per multiple 2026 hiring reports), and — per Palantir's own job description — \"responsibilities look similar to those of a hands-on AI startup CTO.\" It maps directly onto your solutions-architect/post-sales background while giving you customer discovery, product feedback ownership, and technical shipping — exactly the muscles a product-oriented CTO/CPO needs.\n- Developer employee #1 is common but not credible for you given no professional dev experience; security research is available but you explicitly won't/can't do it.",
    },
    {
      id: "kf-founder-role",
      title: "Founder role in 2029–30: CPO most realistic, product-oriented CTO possible with proof",
      body: "Your ~70% lean toward an outbound/product CTO is achievable only if you demonstrably closes the technical-credibility gap (ships real product surfaces, can architect, shows AI fluency). Absent that, investors expect a CTO to be the technical anchor. The more realistic 2029–30 outcome is CPO in a CEO/CTO/CPO trio or product-oriented CTO in a 2-founder team where you pair with a strong technical co-founder. The CEO/CTO/CPO trio is common enough in Israeli seed startups (e.g., Oasis Security: CEO Danny Brickman + CPO Amit Zimerman, both Unit 81 veterans), though VCs prefer lean 2-person founding teams and scrutinize a third non-technical co-founder.",
    },
    {
      id: "kf-comp-reality",
      title: "Compensation reality check",
      body: "Per GotFriends (Jerusalem Post, July 2026), \"the average tech salary climbed to NIS 39,810, a 7.4% increase over the previous year, which stood at NIS 37,071,\" and LLM/RAG/NLP specialists earn \"an average of NIS 43,212, about nine percent more than other technological roles.\" Your 35–50k ILS target is realistic for a senior core-team hire; 45–50k is top-quartile, and the AI premium helps. On equity, per a TLV Partners survey (Aug 2025), at Israeli seed startups senior engineers typically get over 0.5% and mid-level 0.15–0.25%; the first five hires get the most generous packages. So 0.25%+ is attainable at a true early seed startup, but the $60–75M mega-seeds that launch with dozens of staff will offer less.",
    },
    {
      id: "kf-strategic-recommendation",
      title: "Strategic recommendation (summary)",
      body: "- Domains: (1) Agent/non-human identity & agent security; (2) AI-for-cyber (AI-native SOC / autonomous pentest delivery); (3) cyber-for-physical-AI + Israeli defense tech as the differentiated adjacent bet.\n- Role now: FDE/founding Solutions Engineer (1st choice) > founding/SME PM (2nd) > developer (avoid).\n- Founder role 2029–30: CPO or product-oriented CTO paired with a strong technical co-founder; prove it by shipping product surfaces, demonstrating AI fluency, and building a public reputation.\n- Target startups (Israel-based / Israel-founded; seed–Series B; top-tier VC; several 8200-heavy): Tenzai (autonomous pentest; explicit FDE hiring — best documented match), Corma (defensive AI foundation model; 8200), Rein Security ($8M seed, 8200 — true early-stage), Offroad ($7M seed, 8200), NewCore (NHI, 8200 CTO), Onyx Security (agent control plane, 8200 CEO — hiring), Act Security, Oak, Neo, Mate Security (AI-SOC), Enigma (physical AI, 8200); plus watch Tenet, Capsule, Willow (very-early seeds).",
    },
  ],

  // ---------------------------------------------------------------------------
  // Domains (exactly 4) with sub-lanes from the Expanded Domain Tree
  // ---------------------------------------------------------------------------
  domains: [
    {
      id: "dom-cyber-for-ai",
      name: "Cyber for AI / AI security",
      fit: "strongest",
      verdict:
        "STRONGEST FIT. Securing AI agents is \"the defining cybersecurity challenge of 2026\" (Bessemer). Gartner projects 40% of enterprise apps will embed task-specific AI agents by 2026 (up from <5% in 2025). The attack surface (prompt injection, MCP vulnerabilities, data exfiltration via assistants, memory poisoning, tool misuse) is expanding faster than defenses; OWASP published the first Top 10 for Agentic Applications in Dec 2025 (top risks: prompt injection, memory poisoning, tool/plugin misuse). Sub-lanes: agent/non-human identity (NHI), AI-SPM, prompt-injection/guardrails/runtime, MCP/tool-use security, AI supply chain. Huge Israeli density and top-tier VC backing. 2028–29 bet: identity + runtime governance for autonomous agents becomes a default layer of the security stack; consolidation into platforms continues; open problems remain in agent authorization, MCP/tool-use security, and cross-agent (bot-to-bot) injection. This is your best home base.",
      fitRationale:
        "Fit: excellent. Product-and-customer-facing, threat-model-driven, not ML-research-heavy — your 8200 + solutions-architect background compounds here.",
      subLanes: [
        {
          id: "sl-agent-nhi",
          name: "Agent / Non-Human Identity (NHI)",
          examples: ["NewCore", "Oak", "Offroad", "Astrix (acq)", "Oasis (acq)"],
          bet: "NHI + agent authz = default stack layer",
          note: "The hottest Israeli sub-lane. Cyera acquired Oasis (~$1B); Cisco acquired Astrix (~$400M); SailPoint acquired Entro (~$200M) and Savvy; Silverfort acquired Fabrix. New entrants: NewCore ($66M, Zohar Alon of Dome9 + 8200 CTO Amihai Neiderman, $300M valuation, Cyberstarts/Index/Evolution), Oak ($60M seed, serial founder Shai Morag, Accel/Greylock/CRV), Offroad ($7M seed, 8200 CTO Philip Shteyn, Ibex/Skywell), Act Security ($60M, Medigate team, Team8/Bessemer/Notable).",
        },
        {
          id: "sl-agent-control-plane",
          name: "Agent security / control plane",
          examples: ["Zenity", "Onyx", "Neo"],
          bet: "Runtime governance for autonomous agents",
          note: "Zenity ($125M Series C, 8200 founders Ben Kliger + Michael Bargury), Onyx Security ($113M Series B at $640M valuation, 8200 CEO Maxim Bar Kogan, Cyberstarts→Conviction→Bessemer), Neo ($100M, a16z + Bessemer, ex-SentinelOne).",
        },
        {
          id: "sl-ai-spm-guardrails-mcp",
          name: "AI-SPM / guardrails / MCP",
          examples: ["Prompt Security", "Lasso", "Operant", "Mindgard"],
          bet: "Consolidation into platforms",
          note: "Platform consolidation underway (Palo Alto Prisma AIRS + Protect AI; Check Point→Lakera; CrowdStrike→Pangea).",
        },
        {
          id: "sl-ai-supply-chain",
          name: "AI supply chain",
          examples: ["Endor", "Chainguard"],
          bet: "SBOM + regs (EU CRA 2027)",
        },
      ],
    },
    {
      id: "dom-ai-for-cyber",
      name: "AI for cyber",
      fit: "strong",
      verdict:
        "STRONG FIT. AI-native SOC (Exaforce $125M Series B at $725M valuation; Dropzone; Prophet; Mate Security $35M Series A, Wiz/Microsoft alumni), autonomous pentesting (XBOW $120M Series C at $1B+; Horizon3 $117M; Tenzai $75M seed; A Security $37M), and defensive foundation models (Corma $60M seed, Sequoia). \"Corma\" (your canvas example) is real: a San Francisco + 8200 defensive-cyber foundation-model lab that raised a $60M seed led by Sequoia (with Khosla and Coatue, Aug 2026). 2028–29 bet: autonomous SOC and continuous autonomous pentesting become mainstream; domain-specific security models beat generalist LLMs. Very fundable, but the deep-ML versions need a research co-founder.",
      fitRationale:
        "Fit: strong, especially the delivery/FDE side. Deep-ML plays need a research co-founder; workflow/deployment plays (SOC, pentest delivery) fit you well.",
      subLanes: [
        {
          id: "sl-ai-native-soc",
          name: "AI-native SOC",
          examples: ["Exaforce", "Dropzone", "Mate"],
          bet: "Autonomous SOC mainstream",
          note: "Exaforce $125M Series B at $725M valuation; Dropzone; Prophet; Mate Security $35M Series A (Wiz/Microsoft alumni).",
        },
        {
          id: "sl-autonomous-pentest",
          name: "Autonomous pentest / red-team",
          examples: ["Tenzai", "XBOW", "A Security"],
          bet: "Continuous offensive testing",
          note: "XBOW $120M Series C at $1B+; Horizon3 $117M; Tenzai $75M seed; A Security $37M.",
        },
        {
          id: "sl-defensive-foundation-models",
          name: "Defensive foundation models",
          examples: ["Corma"],
          bet: "Domain-specific > generalist models",
          note: "Corma: $60M seed led by Sequoia (with Khosla and Coatue, Aug 2026); San Francisco + 8200 defensive-cyber foundation-model lab. Deep-ML versions need a research co-founder.",
        },
      ],
    },
    {
      id: "dom-ai-infra",
      name: "AI infra",
      fit: "weak",
      verdict:
        "WEAKEST FIT for you. Private AI companies raised ~$225.8B in 2025 (CB Insights); infra spending ~$318B (IDC). Compute/chips/neoclouds are late-stage and capital-heavy (top 10 infra startups captured ~55% of funding). Software layers — inference optimization, evals/observability (Arize, Braintrust, LangSmith), agent orchestration, RL environments — are the realistic small-team wedges but are crowded and SF/YC-dominated; RL environments in particular are already consolidating (40+ tracked startups; a Mercor acquisition of an a16z-backed player in mid-2026). Requires hands-on ML you lack. Not your unfair advantage.",
      fitRationale:
        "Fit: weak for you (requires hands-on ML; not your edge). Useful only as knowledge, or as the \"thing your startup secures.\"",
      subLanes: [
        {
          id: "sl-compute-neoclouds",
          name: "Compute / chips / neoclouds",
          examples: ["CoreWeave", "Groq"],
          bet: "Capital-heavy, late-stage (avoid)",
          note: "Top 10 infra startups captured ~55% of funding.",
        },
        {
          id: "sl-evals-observability-rl",
          name: "Evals / observability / RL envs",
          examples: ["Arize", "Braintrust"],
          bet: "Crowded, SF/YC-led",
          note: "Also LangSmith. RL environments already consolidating (40+ tracked startups; a Mercor acquisition of an a16z-backed player in mid-2026).",
        },
      ],
    },
    {
      id: "dom-physical-ai",
      name: "Physical AI",
      fit: "selective",
      verdict:
        "SELECTIVE FIT via cyber + defense. World models & robotics foundation models are booming (Physical Intelligence $600M Series B; Yann LeCun's lab ~$1B seed; NVIDIA Cosmos; Israel's Enigma $71M seed, 8200 founders Jonathan Jacobi + Gal Niv, Index/Ribbit/Conviction). Physical-AI startups raised ~$47.4B in H1 2026 (+80% YoY), concentrated in defense/industrial. Cyber-for-physical-AI (securing robots as cyber-physical/OT endpoints) is a nascent but real niche (e.g., Alias Robotics in Europe). 2028–29 bet: \"ChatGPT moment for physical AI\" (Jensen Huang, CES 2026); robots become networked OT endpoints that must be secured; defense autonomy scales.",
      fitRationale:
        "Fit: selective — your wedge is cyber/OT-security for physical AI and defense autonomy (Israeli defense tech is booming), not the ML-research-heavy core.",
      subLanes: [
        {
          id: "sl-robotics-world-models",
          name: "Robotics / world foundation models",
          examples: ["Enigma", "Physical Intelligence", "NVIDIA Cosmos"],
          bet: "\"ChatGPT moment\" for physical AI",
          note: "Physical Intelligence $600M Series B; Yann LeCun's lab ~$1B seed; Enigma $71M seed (8200 founders Jonathan Jacobi + Gal Niv; Index/Ribbit/Conviction). ML-research-heavy — not your core.",
        },
        {
          id: "sl-cyber-for-physical-ai",
          name: "Cyber for physical AI / OT",
          examples: ["Alias Robotics (nascent)"],
          bet: "Robots = OT endpoints to secure",
          note: "Nascent but real niche; uses your threat-model thinking.",
        },
        {
          id: "sl-defense-autonomy",
          name: "Defense autonomy",
          examples: ["Kela", "Heven", "D-Fend (Israeli boom)"],
          bet: "Dual-use scaling",
          note: "Kela ~$1B valuation; Heven first defense unicorn; D-Fend→Motorola $1.5B.",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // Adjacent domains worth adding (the 6 best, ranked)
  // ---------------------------------------------------------------------------
  adjacentDomains: [
    {
      id: "adj-nhi-agent-authz",
      rank: 1,
      name: "Non-human / agent identity & authorization",
      rationale: "Arguably the single hottest Israeli lane; perfect fit.",
      examples: ["NewCore", "Oak", "Offroad", "Astrix (acq. Cisco)", "Oasis (acq. Cyera)"],
    },
    {
      id: "adj-defense-tech",
      rank: 2,
      name: "Defense tech / autonomous defense systems",
      rationale: "Massive Israeli tailwind; natural for 8200 (Kela ~$1B valuation; Heven first defense unicorn; D-Fend→Motorola $1.5B).",
      examples: ["Kela", "Heven", "D-Fend"],
    },
    {
      id: "adj-cyber-physical-ai",
      rank: 3,
      name: "Cyber for physical AI / OT & robotics security",
      rationale: "Nascent, defensible, uses your threat-model thinking.",
      examples: ["Alias Robotics"],
    },
    {
      id: "adj-ai-governance",
      rank: 4,
      name: "AI governance / compliance (AI-SPM, guardrails, evals-for-safety)",
      rationale: "Budget forming first in regulated industries.",
    },
    {
      id: "adj-deepfake-identity-fraud",
      rank: 5,
      name: "Deepfake / identity-fraud defense",
      rationale: "Social-engineering surge. Adaptive Security ($63M, OpenAI Startup Fund), Reality Defender.",
      examples: ["Adaptive Security", "Reality Defender"],
    },
    {
      id: "adj-pqc-ot-ics",
      rank: 6,
      name: "Post-quantum crypto & OT/ICS/critical-infrastructure security",
      rationale: "Real but slower-burn; PQC federal deadlines (~2029) create a migration market (e.g., QIZ Security $17M seed, Bessemer/Merlin). Lower fit unless paired with your cyber base.",
      examples: ["QIZ Security"],
    },
  ],

  // ---------------------------------------------------------------------------
  // Role ladder — (iii) with fallback
  // ---------------------------------------------------------------------------
  roleLadder: [
    {
      id: "rl-now",
      horizon: "Now",
      title: "FDE / founding Solutions Engineer",
      detail: "The clear recommendation: FDE/founding Solutions Engineer (1st choice) > founding/SME PM (2nd) > developer (avoid). The role is \"a hands-on AI startup CTO\" analog (per Palantir's own posting) — customer-facing, technical, product-feedback-owning — and maps directly onto your solutions-architect/post-sales background. Best bridge to product-oriented CTO/CPO.",
      fallback: "SME/founding PM — the proven path is \"subject-matter-expert PM\" (security/8200 expertise) at a startup where domain knowledge outweighs PM tenure, or an internal transfer after joining in another role. Ask for Senior PM / Head of Product framing only at true seed.",
    },
    {
      id: "rl-1-2-yrs",
      horizon: "1–2 yrs",
      title: "Own metric + product surface + US customers + hiring",
      detail: "Deliberately extract customer conversations (esp. US customers), ship an owned product surface, own a metric, join first hiring, build references, scout co-founders and ideas.",
    },
    {
      id: "rl-3-4-yrs",
      horizon: "3–4 yrs",
      title: "Pre-founder (co-founder + domain + VC FOMO)",
      detail: "Pre-founding checklist — validated idea/domain, co-founder trial projects, live VC relationships, improved resume/reputation, FOMO built.",
    },
    {
      id: "rl-2029-30",
      horizon: "2029–30",
      title: "CPO or product-oriented CTO (with technical co-founder)",
      detail: "Product-oriented CTO in a 2-founder team paired with a strong technical co-founder — achievable only if you demonstrably closes the technical-credibility gap (ships real product surfaces, can architect, shows AI fluency). Investors expect a CTO to be the technical anchor. Prove it by shipping product surfaces, demonstrating AI fluency, and building a public reputation.",
      fallback: "CPO in a CEO/CTO/CPO trio (the more realistic outcome; e.g., Oasis Security: CEO Danny Brickman + CPO Amit Zimerman). VCs scrutinize a non-technical third founder, so the CPO must own something hard (product + GTM motion or deep domain).",
    },
  ],

  // ---------------------------------------------------------------------------
  // Role strategy (evidence-based) — section 2 bullets as findings
  // ---------------------------------------------------------------------------
  roleStrategy: [
    {
      id: "rs-founding-pm",
      title: "Founding / first PM",
      body: "Hard to get without a PM title, but the proven path for you is \"subject-matter-expert PM\" (security/8200 expertise) at a startup where domain knowledge outweighs PM tenure, or an internal transfer after joining in another role. Ask for Senior PM / Head of Product framing only at true seed.",
    },
    {
      id: "rs-fde-founding-se",
      title: "FDE / founding SE",
      body: "The clear recommendation. US total comp $300–550k+ (staff/principal higher); the role is \"a hands-on AI startup CTO\" analog (per Palantir's own posting) — customer-facing, technical, product-feedback-owning. Best bridge to product-oriented CTO/CPO.",
    },
    {
      id: "rs-product-cto-vs-vp-rd",
      title: "Product-oriented CTO vs VP R&D CTO",
      body: "The product/outbound CTO sets technical strategy, owns the roadmap and customer-facing technical narrative, and represents engineering to investors; the VP-R&D-type runs the team and delivery. A cyber generalist who \"can develop but isn't a developer\" can credibly be the former only with a strong technical co-founder and demonstrated shipping. Investors expect a CTO to be the technical anchor.",
    },
    {
      id: "rs-cpo-third-cofounder",
      title: "CPO as third co-founder",
      body: "The CEO/CTO/CPO trio exists at Israeli seed startups, but VCs prefer lean teams and scrutinize a non-technical third founder; the CPO must own something hard (product + GTM motion or deep domain).",
    },
    {
      id: "rs-comp-benchmarks",
      title: "Comp benchmarks",
      body: "Salary 35–50k ILS/month realistic (45–50k top-quartile, AI premium helps); equity 0.25%+ attainable at true early seed (mid-level 0.15–0.25%, senior 0.5%+, first-5 hires most).",
    },
    {
      id: "rs-top-tier-vcs",
      title: "Top-tier Israeli seed cyber/AI VCs",
      body: "Cyberstarts (Sunrise program — note the 2024 CISO-advisory controversy that led it to suspend Sunrise payments), Team8 (foundry/venture-creation model), YL Ventures, Glilot, Aleph, Vertex, Entrée, TLV Partners, Grove; plus US funds active in Israel (Sequoia, a16z, Lightspeed, Accel, Greylock, Index, Bessemer, Notable, Conviction). Foundry/venture-creation models (Team8) and inception investing (Cyberstarts) are the fastest routes to core-team seats.",
    },
  ],

  // ---------------------------------------------------------------------------
  // Timeline — (iv) Timeline Additions + section 5 fill-ins
  // ---------------------------------------------------------------------------
  timeline: [
    {
      id: "tl-this-month",
      horizon: "This month",
      items: [
        "Write the positioning statement (reframe the failed attempt as \"learned the co-founder-fit lesson the hard way\")",
        "Pick 2 target domains",
        "Talk to 3–5 VCs' talent partners (Cyberstarts, Team8, YL, Glilot)",
        "Talk to a specialist recruiter (e.g., GotFriends)",
        "Start the AI up-skilling track + a public build",
      ],
    },
    {
      id: "tl-end-2026",
      horizon: "End 2026",
      items: [
        "Short vacation",
        "Join a seed startup in a target domain in an FDE/SE or founding-PM seat",
      ],
    },
    {
      id: "tl-1-2-yrs",
      horizon: "1–2 yrs",
      items: [
        "Deliberately extract customer conversations (esp. US customers)",
        "Ship an owned product surface",
        "Own a metric",
        "Join first hiring / help hire",
        "Build references; grow network",
        "Scout co-founders and ideas",
      ],
    },
    {
      id: "tl-3-4-yrs",
      horizon: "3–4 yrs",
      items: [
        "Pre-founding checklist: validated idea/domain",
        "Co-founder trial projects",
        "Live VC relationships",
        "Improved resume/reputation",
        "Build FOMO",
      ],
    },
    {
      id: "tl-5-plus-yrs",
      horizon: "5+ yrs",
      items: ["Post-exit optionality", "Relocate (NYC/London)"],
    },
  ],

  // ---------------------------------------------------------------------------
  // Skills pool — (ii)
  // ---------------------------------------------------------------------------
  skillsPool: [
    {
      id: "sp-all",
      title: "All skills (core-team / future CTO-CPO)",
      kind: "all",
      skills: ["backend", "DevOps", "architecture", "security research", "product", "AI/ML hands-on", "sales", "people mgmt", "GTM", "fundraising", "storytelling"],
    },
    {
      id: "sp-have",
      title: "Skills I have",
      kind: "have",
      skills: ["cyber breadth", "threat/attack thinking", "security-research literacy", "solutions architecture", "technical pre/post-sales", "customer-facing", "product sense", "basic coding", "frontend"],
    },
    {
      id: "sp-want",
      title: "Skills I want (close myself, 12–24 months)",
      kind: "want",
      skills: [
        "hands-on AI fluency: run/fine-tune models, build agents, understand RL/inference/MCP basics (enough to be credible and to demo) — via structured courses (e.g., DeepLearning.AI, Hugging Face, fast.ai) + shipping a real demo/POC",
        "backend & system-design fundamentals (to be a credible product-CTO)",
        "PM craft: discovery, PRDs, roadmapping, metrics ownership (Lenny's Newsletter/Reforge-type resources; do it live inside the startup you join)",
        "founder-led sales (enough to sell without being CEO)",
        "technical storytelling + fundraising narrative (including how to tell the failed-founding story as a strength)",
        "people management basics",
      ],
    },
    {
      id: "sp-cofounder",
      title: "Skills to find in a co-founder",
      kind: "cofounder",
      skills: ["deep ML/research", "deep backend/infra eng", "CEO-style GTM + fundraising (the gap that sank your last attempt)"],
    },
  ],

  // ---------------------------------------------------------------------------
  // Target startups — (v) + section 6 shortlist
  // ---------------------------------------------------------------------------
  targetStartups: [
    {
      id: "ts-tenzai",
      name: "Tenzai",
      domain: "Autonomous pentest (AI for cyber)",
      funding: "$75M seed",
      investors: "Not named in the plan (shortlist criterion: top-tier VC)",
      signals: ["hiring FDE", "ex-Guardicore", "8200-adjacent"],
      stage: "seed",
      fitNote: "Autonomous pentest; explicit FDE hiring — the best documented match for an FDE/founding-SE seat.",
      isBestMatch: true,
    },
    {
      id: "ts-corma",
      name: "Corma",
      domain: "Defensive AI foundation model (AI for cyber)",
      funding: "$60M seed",
      investors: "Sequoia (lead), Khosla, Coatue (Aug 2026)",
      signals: ["8200", "SF-headquartered"],
      stage: "seed",
      fitNote: "Defensive-cyber foundation-model lab; 8200-linked team. Deep-ML play — the workflow/deployment side is where you fit.",
      caveat: "Corma is SF-headquartered (with an 8200-linked team) and said in 2026 it was \"not in a hurry to recruit\" — a fit/timing caveat.",
    },
    {
      id: "ts-rein-security",
      name: "Rein Security",
      domain: "AppSec + AI",
      funding: "$8M seed",
      investors: "Glilot",
      signals: ["8200", "true early-stage"],
      stage: "true_early",
      fitNote: "True early-stage — where an employee #1–5 seat with 0.25%+ equity is most attainable.",
    },
    {
      id: "ts-offroad",
      name: "Offroad",
      domain: "AI identity team (agent / non-human identity)",
      funding: "$7M seed",
      investors: "Ibex, Skywell",
      signals: ["8200 CTO Philip Shteyn", "true early-stage"],
      stage: "true_early",
      fitNote: "AI identity team in your sharpest wedge (NHI); true early-stage — employee #1–5 equity plausible.",
    },
    {
      id: "ts-newcore",
      name: "NewCore",
      domain: "Non-human identity",
      funding: "$66M ($300M valuation)",
      investors: "Cyberstarts, Index, Evolution",
      signals: ["8200 CTO Amihai Neiderman", "founder Zohar Alon of Dome9"],
      stage: "seed",
      fitNote: "NHI — the hottest Israeli sub-lane; 8200 CTO. Mega-seed: expect a core-team seat, not employee #1 equity.",
    },
    {
      id: "ts-onyx-security",
      name: "Onyx Security",
      domain: "Agent security / control plane",
      funding: "$113M Series B at $640M valuation",
      investors: "Cyberstarts → Conviction → Bessemer",
      signals: ["8200 CEO Maxim Bar Kogan", "hiring"],
      stage: "series_a_plus",
      fitNote: "Agent control plane; 8200 CEO; hiring. Later-stage — lower equity, but strong logo/network in your core domain.",
    },
    {
      id: "ts-oak",
      name: "Oak",
      domain: "Agent / non-human identity",
      funding: "$60M seed",
      investors: "Accel, Greylock, CRV",
      signals: ["serial founder Shai Morag", "well-funded"],
      stage: "seed",
      fitNote: "Identity/agent security; well-funded mega-seed — accept lower equity for the network/logo if it's the only seat.",
    },
    {
      id: "ts-act-security",
      name: "Act Security",
      domain: "Agent / non-human identity",
      funding: "$60M",
      investors: "Team8, Bessemer, Notable",
      signals: ["Medigate team", "well-funded"],
      stage: "seed",
      fitNote: "Identity/agent security; Medigate team; well-funded.",
      caveat: "Round stage is not labeled in the plan; treated as a mega-seed by size.",
    },
    {
      id: "ts-neo",
      name: "Neo",
      domain: "Agent security / control plane",
      funding: "$100M",
      investors: "a16z, Bessemer",
      signals: ["ex-SentinelOne", "well-funded"],
      stage: "series_a_plus",
      fitNote: "Agent security; well-funded — Onyx-scale, so expect a core-team seat rather than employee #1 equity.",
      caveat: "Round stage is not labeled in the plan; classified by Onyx-scale funding.",
    },
    {
      id: "ts-mate-security",
      name: "Mate Security",
      domain: "AI-native SOC",
      funding: "$35M Series A",
      investors: "Team8, Insight, M12",
      signals: ["Wiz/Microsoft alumni"],
      stage: "series_a_plus",
      fitNote: "AI-native SOC — the delivery/FDE side of AI-for-cyber fits you well.",
    },
    {
      id: "ts-enigma",
      name: "Enigma",
      domain: "Physical AI / robot foundation models",
      funding: "$71M seed",
      investors: "Index, Ribbit, Conviction",
      signals: ["8200 founders Jonathan Jacobi + Gal Niv"],
      stage: "seed",
      fitNote: "Physical AI; 8200 founders. Selective fit — the ML core is research-heavy; your wedge would be cyber-for-physical-AI.",
    },
    {
      id: "ts-tenet",
      name: "Tenet",
      domain: "Very-early seed (lane not specified in the plan)",
      funding: "$6–7M seed (very early)",
      investors: "Not named in the plan",
      signals: ["very-early seed", "watch list"],
      stage: "watch",
      fitNote: "Watch: very-early seed where a true employee #1–5 seat (and 0.25%+ equity) is most plausible.",
      caveat: "Not detailed in the plan beyond the watch list; verify lane, team and investors before outreach.",
    },
    {
      id: "ts-capsule",
      name: "Capsule",
      domain: "Very-early seed (lane not specified in the plan)",
      funding: "$6–7M seed (very early)",
      investors: "Not named in the plan",
      signals: ["very-early seed", "watch list"],
      stage: "watch",
      fitNote: "Watch: very-early seed where a true employee #1–5 seat (and 0.25%+ equity) is most plausible.",
      caveat: "Not detailed in the plan beyond the watch list; verify lane, team and investors before outreach.",
    },
    {
      id: "ts-willow",
      name: "Willow",
      domain: "Very-early seed (lane not specified in the plan)",
      funding: "$6–7M seed (very early)",
      investors: "Not named in the plan",
      signals: ["very-early seed", "watch list"],
      stage: "watch",
      fitNote: "Watch: very-early seed where a true employee #1–5 seat (and 0.25%+ equity) is most plausible.",
      caveat: "Not detailed in the plan beyond the watch list; verify lane, team and investors before outreach.",
    },
  ],

  // ---------------------------------------------------------------------------
  // Co-founder strategy — section 4
  // ---------------------------------------------------------------------------
  cofounderStrategy: [
    "Your failure mode (couldn't find CEO+CTO) is best solved by joining an 8200-heavy, top-tier-VC startup where organic co-founders and first hires cluster.",
    "Israeli founders overwhelmingly meet co-founders via unit (8200/81), prior company, and VC programs.",
    "Per an Ibex Investors study, nearly 50% of $100M+ Israeli cyber exits had 8200-trained founders, and startups founded by 8200 alumni averaged $317M acquisition prices.",
    "Fill CPO/product + some technical yourself; recruit a CEO-type (or, if you become CTO/CPO, a strong technical or GTM complement).",
    "Foundry/EIR routes: Team8 foundry (co-found with them — explicit sign-up program), Cyberstarts inception model. Foundry/venture-creation models and inception investing are the fastest routes to core-team seats.",
    "Build visible reputation (\"FOMO\") before founding.",
    "Run co-founder trial projects; found only when you have (a) a co-founder who fills your gaps, (b) a domain/idea with design-partner pull, (c) VC FOMO.",
  ],

  // ---------------------------------------------------------------------------
  // Compensation — with sources
  // ---------------------------------------------------------------------------
  compensation: [
    {
      id: "comp-salary-band",
      label: "Target salary band (senior core-team hire)",
      value: "35–50k ILS/month",
      source: "5-year plan — realistic for a senior core-team hire; the AI premium helps",
    },
    {
      id: "comp-top-quartile",
      label: "Top-quartile salary",
      value: "45–50k ILS/month",
      source: "5-year plan — role-strategy comp benchmarks",
    },
    {
      id: "comp-avg-tech-salary",
      label: "Average Israeli tech salary",
      value: "NIS 39,810 (a 7.4% increase over the previous year, which stood at NIS 37,071)",
      source: "GotFriends, via Jerusalem Post (July 2026)",
    },
    {
      id: "comp-llm-specialists",
      label: "LLM/RAG/NLP specialists (average)",
      value: "NIS 43,212 — about nine percent more than other technological roles",
      source: "GotFriends, via Jerusalem Post (July 2026)",
    },
    {
      id: "comp-equity-mid",
      label: "Equity — mid-level at Israeli seed startups",
      value: "0.15–0.25%",
      source: "TLV Partners survey (Aug 2025)",
    },
    {
      id: "comp-equity-senior",
      label: "Equity — senior engineers at Israeli seed startups",
      value: "over 0.5%",
      source: "TLV Partners survey (Aug 2025)",
    },
    {
      id: "comp-equity-first-5",
      label: "Equity — first five hires",
      value: "Most generous packages; 0.25%+ is attainable at a true early seed startup, but $60–75M mega-seeds that launch with dozens of staff will offer less",
      source: "TLV Partners survey (Aug 2025); 5-year plan",
    },
    {
      id: "comp-fde-us",
      label: "FDE total comp (US)",
      value: "$300–550k+ (staff/principal higher)",
      source: "Multiple 2026 hiring reports — US-centric and role-loose; Israeli comp will be lower and the title is applied inconsistently",
    },
  ],

  // ---------------------------------------------------------------------------
  // VCs
  // ---------------------------------------------------------------------------
  vcs: [
    {
      tier: "Top-tier Israeli seed cyber/AI",
      names: ["Cyberstarts", "Team8", "YL Ventures", "Glilot", "Aleph", "Vertex", "Entrée", "TLV Partners", "Grove"],
    },
    {
      tier: "US funds active in Israel",
      names: ["Sequoia", "a16z", "Lightspeed", "Accel", "Greylock", "Index", "Bessemer", "Notable", "Conviction"],
    },
  ],

  // ---------------------------------------------------------------------------
  // Recommendations — staged, with thresholds
  // ---------------------------------------------------------------------------
  recommendations: [
    {
      id: "rec-now-this-month",
      stage: "Now → this month",
      action: "Lock a one-line positioning statement and a 2-domain focus (agent/NHI security + AI-for-cyber). Reach out to talent partners at Cyberstarts, Team8, YL, Glilot, and a recruiter (GotFriends). Start an AI up-skilling track and a public build.",
      threshold: "Threshold to change: if 2+ VCs signal a founding-PM seat is available in a target domain, prioritize that over FDE.",
    },
    {
      id: "rec-end-2026",
      stage: "By end of 2026",
      action: "Join a seed/pre-A startup in a target domain as FDE/SE or founding PM, prioritizing (a) 8200-heavy team, (b) top-tier VC, (c) a role close to founders, (d) 35k+ ILS and ≥0.15–0.25% equity.",
      threshold: "Threshold: if only a $60–75M mega-seed offers a seat, accept lower equity for the network/logo; if a true employee-#1 seed offers ≥0.25%+ and a credible team, prefer it.",
    },
    {
      id: "rec-1-2-years-in",
      stage: "1–2 years in",
      action: "Own a metric, ship a customer-facing surface, run US customer discovery, join first hires.",
      threshold: "Threshold to start founding earlier: if you've found a complementary co-founder + a validated wedge + a warm top-tier VC, compress the timeline.",
    },
    {
      id: "rec-3-4-years",
      stage: "3–4 years",
      action: "Execute the pre-founding checklist; run co-founder trial projects; keep a live VC pipeline.",
      threshold: "Found when you have (a) a co-founder who fills your gaps, (b) a domain/idea with design-partner pull, (c) VC FOMO.",
    },
    {
      id: "rec-bootstrap-alternative",
      stage: "On the bootstrap / POV alternative",
      action: "Only pursue with a defined end goal (a fundable demo + design-partner LOIs) — worthwhile only as a skills-and-credibility builder or to validate a specific idea.",
      threshold: "Otherwise the job path wins: the startup job dominates on network, references, and co-founder discovery.",
    },
  ],

  // ---------------------------------------------------------------------------
  // Caveats (all 7)
  // ---------------------------------------------------------------------------
  caveats: [
    {
      id: "cv-funding-aggregators",
      text: "Several funding figures come from market-map/blog aggregators (softwarestrategiesblog, buildmvpfast, newmarketpitch) rather than primary filings; treat totals as directional. Company-specific rounds are corroborated by named outlets (Calcalist, Times of Israel, TechCrunch, SecurityWeek, Globes, Jerusalem Post).",
    },
    {
      id: "cv-mega-seeds",
      text: "The Israeli AI×cyber market in 2026 is producing mega-seeds that launch with 30–80 staff and product already GA — so \"employee #1\" is increasingly rare; core-team seats are the realistic target.",
    },
    {
      id: "cv-fde-comp-us-centric",
      text: "FDE comp figures are US-centric and role-loose; Israeli comp will be lower and the title is applied inconsistently.",
    },
    {
      id: "cv-defense-tech-figures",
      text: "Defense-tech funding figures vary by definition (Crunchbase vs PitchBook vs MAFAT data); the growth trend is robust, the absolute numbers less so.",
    },
    {
      id: "cv-corma-timing",
      text: "Corma is SF-headquartered (with an 8200-linked team) and said in 2026 it was \"not in a hurry to recruit\" — a fit/timing caveat.",
    },
    {
      id: "cv-acquired-targets",
      text: "Some target companies (Fabrix→Silverfort, Koi→Palo Alto) have already been acquired and are no longer standalone employers; Mesh Security is older (2022) and less of a fit than the canvas note implied.",
    },
    {
      id: "cv-cyberstarts-sunrise",
      text: "Cyberstarts' Sunrise program drew a 2024 conflict-of-interest controversy; mention is for completeness, not endorsement.",
    },
  ],
};
