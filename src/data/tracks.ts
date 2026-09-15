// The 8 tracks of the curriculum (docs/curriculum-spec.md). Names/goals come from
// the spec's track headings and "ready-when" statements; `why` paragraphs are
// grounded in the spec's Key Findings. priorityRank follows the spec's ordering
// (T1=1, T4=2, T7 "tied" → 3, then T2, T3, T6, T5, T8) with unique ranks 1..8.
import type { Track } from "@/types";

export const tracks: Track[] = [
  {
    id: "T1_AI_ML",
    code: "T1",
    name: "Hands-on AI/ML Fluency",
    goal:
      "Build working fluency with transformers, fine-tuning, agents and evals by shipping code: a GPT from scratch, a LoRA fine-tune on the Hub, and an eval harness that gates a change. Speak credibly about the stack without becoming a researcher.",
    why:
      "The single highest-leverage move is hands-on AI/agent fluency fused with his existing security edge (Track 7). Free canon — Karpathy's Zero to Hero, Hugging Face's LLM/Agents/smol courses, DeepLearning.AI short courses — covers roughly 70% of this track and is current; pay selectively for at most one evals course. Evals are both an AI-engineering skill and product work, a two-track twofer directly relevant to AI-SOC quality. Since he will build with AI assistance, mastery of agentic coding tools is a force multiplier.",
    skillIds: [
      "transformers",
      "tokenization",
      "rag",
      "embeddings",
      "agents",
      "mcp",
      "evals",
      "observability",
      "finetuning",
      "lora",
      "dpo",
      "grpo",
      "rlhf",
      "inference",
      "serving",
      "quantization",
      "ai-coding-tools",
    ],
    priorityRank: 1,
    color: "#22d3ee",
    icon: "🧠",
    readyWhen:
      "I can build a small GPT from scratch, fine-tune an open model with LoRA, and stand up an eval harness that gates a change.",
  },
  {
    id: "T2_BACKEND_SYSTEMS",
    code: "T2",
    name: "Backend Engineering & System Design",
    goal:
      "Design and deploy production-shaped systems solo: Python (FastAPI) for the AI ecosystem, TypeScript (Node/Next.js) for full-stack demos, and just enough cloud, containers, IaC and CI/CD to deploy and secure an end-to-end POC.",
    why:
      "Free canon covers most of this track: the System Design Primer (368k GitHub stars, the most popular system-design learning resource on the internet, with Anki decks) is the free primary; ByteByteGo is the paid alternative. Designing Data-Intensive Applications is the deep reference and a high-priority read for CTO credibility. Python-first for the AI ecosystem plus TypeScript for full-stack demos gives him the ability to ship end-to-end POCs alone, which is the CTO credibility signal behind the full-stack AI portfolio project.",
    skillIds: [
      "system-design",
      "distributed-data",
      "cloud",
      "kubernetes",
      "backend-python",
      "backend-typescript",
      "fullstack",
      "devops-cicd",
    ],
    priorityRank: 4,
    color: "#38bdf8",
    icon: "🏗️",
    readyWhen:
      "I can design and deploy a multi-tenant AI SaaS with sensible cost/latency tradeoffs and explain the data model.",
  },
  {
    id: "T3_PRODUCT",
    code: "T3",
    name: "Product Management Craft",
    goal:
      "Master discovery interviews, opportunity solution trees, crisp PRDs, north-star metrics and AI-feature eval plans — the product craft of a founding PM / product-CTO — through books and targeted cohorts rather than PM-ladder certifications.",
    why:
      "He is aiming at founding/technical roles, not climbing a PM ladder, so heavy PM certifications and Reforge ($1,995 USD/year) are overrated for him; the spec says prefer books plus targeted cohorts. The Mom Test, INSPIRED and Continuous Discovery Habits carry the core craft, Lenny's Newsletter keeps it current (about half of 2026 content is AI-adjacent), and Aman Khan's AI PM Playbook is the one cohort worth considering for AI-PM credibility. Prototyping tools let a non-designer show rather than tell.",
    skillIds: ["discovery", "jtbd", "prd", "metrics", "ab-testing", "b2b-pm", "ai-pm", "prototyping"],
    priorityRank: 5,
    color: "#a78bfa",
    icon: "🧭",
    readyWhen:
      "I can run 5 discovery interviews, synthesize an opportunity solution tree, write a crisp PRD, and define a north-star metric + eval plan for an AI feature.",
  },
  {
    id: "T4_FDE_SE",
    code: "T4",
    name: "Forward-Deployed Engineer / Solutions Engineering",
    goal:
      "Learn the FDE playbook — conversational customer discovery, customer-specific ontology, POC scoping, demo craft and objection handling — well enough to land a seed-stage FDE / founding-SE role by end of 2026.",
    why:
      "The FDE role he is targeting is a hot, well-documented 2025–2026 category: Palantir origin (2005), now explicitly copied by OpenAI, Anthropic, Databricks, Cohere and Google Cloud. Playbooks exist, so this is learnable and the timing is excellent. AI FDEs in 2026 spend 30–40% of the week on conversational customer discovery, and the value unlock is building a customer-specific ontology — a natural fit for a solutions-architect background. PreSales Collective (51,000+ members) and the demo-craft canon (Great Demo!, Mastering Technical Sales) turn this into practiced skills and a recorded demo as public proof.",
    skillIds: [
      "fde-playbook",
      "technical-discovery",
      "demo-craft",
      "poc-scoping",
      "objection-handling",
      "customer-ontology",
    ],
    priorityRank: 2,
    color: "#34d399",
    icon: "🚀",
    readyWhen:
      "I can run technical discovery, scope a POC, and deliver a 15-min demo that survives objections.",
  },
  {
    id: "T5_SALES_GTM",
    code: "T5",
    name: "Sales, GTM & Founder-Led Sales",
    goal:
      "Position a product (Dunford canvas), deliver a Raskin-narrative pitch, negotiate, and run founder-led enterprise-security sales calls end-to-end — including selling to CISOs.",
    why:
      "His unfair advantage is the intersection: most AI engineers cannot speak CISO. Founder-led sales is the canonical early-stage motion and Founding Sales (free online) is its handbook; April Dunford's Obviously Awesome and Sales Pitch give him positioning and pitch structure; MEDDPICC is the framework most relevant to enterprise security deals; Never Split the Difference and Getting to Yes cover negotiation. Selling to CISOs (budget cycles, procurement, champions, POCs) has no single canonical book — it is a gap to fill via practitioner blogs and his own network.",
    skillIds: ["positioning", "founder-led-sales", "meddic", "negotiation", "ciso-selling", "strategic-narrative"],
    priorityRank: 7,
    color: "#fb923c",
    icon: "🤝",
    readyWhen:
      "I can position a product (Dunford canvas), deliver a Raskin-narrative pitch, and run a founder-led sales call end-to-end.",
  },
  {
    id: "T6_FOUNDER",
    code: "T6",
    name: "Fundraising & Founder Skills",
    goal:
      "Build the founder toolkit — SAFEs, dilution and cap tables, fundraising narrative, SaaS metrics, hiring and people leadership, Israeli fundraising norms — with a structured, must-do co-founder selection workstream.",
    why:
      "His documented failure mode (co-founder selection) needs a dedicated, structured workstream — not vibes. YC co-founder matching, trial projects, equity/vesting frameworks (roughly equal splits, 4-year vesting with a 1-year cliff) and the founder-prenup essays are must-do here. YC Startup School and the YC Library cover SAFEs, fundraising and hiring for free; Andy Raskin's strategic-narrative essay is the must-read for pitching; First Round Review, a16z and Sequoia content plus Carta resources cover company-building and SaaS finance literacy; The Manager's Path, High Output Management and Radical Candor cover people leadership for a CTO.",
    skillIds: [
      "fundraising",
      "safes",
      "cap-table",
      "cofounder",
      "hiring",
      "leadership",
      "narrative",
      "saas-metrics",
      "israeli-ecosystem",
    ],
    priorityRank: 6,
    color: "#f472b6",
    icon: "🌱",
    readyWhen:
      "I can build a cap table, explain SAFEs/dilution, run a co-founder trial project with a written agreement, and pitch to a VC.",
  },
  {
    id: "T7_DOMAIN",
    code: "T7",
    name: "Domain Expertise: AI Security & His Wedge",
    goal:
      "Own the wedge — securing agents, non-human identity / workload identity, AI-native SOC and autonomous offense — proven by shipped projects, hands-on labs/CTFs and published red-team write-ups mapped to OWASP, MITRE ATLAS and NIST, not certifications.",
    why:
      "His unfair advantage is the intersection, not any single track: most AI engineers cannot speak CISO, most security people cannot build agents. The wedge 'securing agents / non-human identity / AI-for-SOC' is where his 8200 + solutions-architect background compounds — Track 7 is his moat. The frameworks (OWASP LLM and Agentic Top 10, MITRE ATLAS, NIST AI RMF) are free must-reads; SPIFFE/SPIRE with OAuth 2.1 token exchange, the MCP authorization spec and WIMSE are his sharpest wedge; Gandalf, HackAPrompt and HTB's AI Red Teamer path build hands-on credibility. Certifications are deliberately de-emphasized (CISSP/OSCP skip); HTB Certified AI Red Teamer is the one credential worth considering. Tel Aviv gives him Cyber Week TAU, DefenseTech Week and Cybertech on his doorstep in a defense-tech sector that grew from 160 to 312 companies in under a year.",
    skillIds: [
      "appsec",
      "nhi",
      "workload-identity",
      "spiffe",
      "oauth-oidc",
      "zero-trust",
      "ai-soc",
      "autonomous-pentest",
      "prompt-injection",
      "red-teaming",
      "ot-ics",
      "defense-tech",
      "ai-governance",
      "threat-modeling",
    ],
    priorityRank: 3,
    color: "#f6c453",
    icon: "🛡️",
    readyWhen:
      "I can threat-model an agentic app against OWASP Agentic Top 10 + MITRE ATLAS, and demonstrate an NHI/agent-auth control.",
  },
  {
    id: "T8_META",
    code: "T8",
    name: "Meta-skills / Learning System",
    goal:
      "Sustain a learn-in-public, build-to-learn system — PKM and writing to think, spaced repetition, deliberate practice with time-boxing, and cohorts/communities for accountability — at 10–15 hours a week alongside a day job.",
    why:
      "He should learn by building in public, not by collecting credentials: his profile (senior, generalist, not a researcher, product-oriented) means his ROI is in demonstrable artifacts and a public reputation, so every other track is anchored to portfolio outputs and weekly published posts. This library over-collects by design, so he must choose depth over breadth — pick one path variant and treat the rest as backlog. Keep this track lightweight: curate, don't over-invest.",
    skillIds: ["pkm", "learning-in-public", "deliberate-practice", "spaced-repetition", "accountability"],
    priorityRank: 8,
    color: "#94a3b8",
    icon: "🔁",
    // The spec gives no T8 ready-when; this is derived from the Track 8 items
    // (learn in public, PKM + Anki, deliberate practice at 10–15h/wk, accountability cohorts).
    readyWhen:
      "I publish one technical post a week, keep a PKM with spaced-repetition reviews, and sustain 10–15h/week of deliberate practice alongside a day job with a cohort or community holding me accountable.",
  },
];
