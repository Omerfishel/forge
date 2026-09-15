# Personal Learning Platform Spec & Curriculum — "Product-CTO Track" for a Tel Aviv Cyber Generalist

## TL;DR
- This is a build-ready specification: a data model, a fully tagged resource/project/drill library across 8 tracks, sequenced 12–24 month paths, and dashboard feature specs — designed to be seeded directly into a learning-dashboard web app by Claude Code.
- The single highest-leverage move is TRACK 1 (hands-on AI/agent fluency) fused with TRACK 7 (his existing security edge): the fastest credibility wedge is "agent/non-human-identity security + AI-native SOC," proven by shipped projects, not certifications.
- For landing a seed-stage FDE/founding-SE or founding-PM role by end of 2026, prioritize free hands-on canon (Karpathy, Hugging Face, DeepLearning.AI), one paid eval course, and a public portfolio of 3–4 security-flavored AI builds; most certifications (CISSP, OSCP) are low-value for him.

## Key Findings
1. **He should learn by building in public, not by collecting credentials.** His profile (senior, generalist, not a researcher, product-oriented) means his ROI is in demonstrable artifacts and a public reputation, not exams. Every track below is anchored to portfolio outputs.
2. **His unfair advantage is the intersection, not any single track.** Most AI engineers can't speak CISO; most security people can't build agents. The wedge "securing agents / non-human identity / AI-for-SOC" is where his 8200 + solutions-architect background compounds. TRACK 7 is his moat.
3. **Free canon covers ~70% of Tracks 1–2.** Karpathy's Neural Networks: Zero to Hero, Hugging Face's LLM/Agents/smol courses, DeepLearning.AI short courses, and the System Design Primer (368k GitHub stars — the most popular system-design learning resource on the internet) are free and current. Pay selectively: one evals course, maybe one PM cohort.
4. **The FDE role he's targeting is a hot, well-documented 2025–2026 category.** Palantir-origin (2005), now explicitly copied by OpenAI, Anthropic, Databricks, Cohere, and Google Cloud. Playbooks exist. This is learnable and the timing is excellent.
5. **His documented failure mode (co-founder selection) needs a dedicated, structured workstream** — not vibes. YC co-founder matching, trial projects, equity/vesting frameworks, and "founder prenup" essays belong in TRACK 6 as must-do.
6. **Some popular paid resources are overrated for him.** Reforge ($1,995 USD/year for the Individual Plan, per Reforge's official Knowledge Base) and heavy PM certifications are lower priority given he's aiming at founding/technical roles, not climbing a PM ladder. Prefer books + targeted cohorts.

---

## The Data Model / Schema

TypeScript-interface-style schema. IDs use track-prefixed slugs (e.g., `t1-karpathy-zth`).

```typescript
// ---------- Enums ----------
type Track =
  | "T1_AI_ML" | "T2_BACKEND_SYSTEMS" | "T3_PRODUCT" | "T4_FDE_SE"
  | "T5_SALES_GTM" | "T6_FOUNDER" | "T7_DOMAIN" | "T8_META";

type ResourceType =
  | "course" | "video" | "book" | "article" | "paper" | "podcast"
  | "newsletter" | "interactive_lab" | "ctf" | "tutorial" | "repo"
  | "tool" | "community" | "conference" | "certification" | "template" | "worksheet";

type Format = "self_paced" | "cohort" | "book" | "video_series" | "hands_on_lab" | "reading";
type Difficulty = "foundational" | "intermediate" | "advanced";
type Priority = "must_do" | "high" | "optional" | "skip_unless_relevant";
type CostModel = "free" | "one_time" | "subscription" | "freemium";
type RoleRelevance = "PM" | "FDE" | "SE" | "Developer" | "CTO" | "CEO";
type TimeBucket = "lt_2h" | "2_10h" | "10_30h" | "30_100h" | "gt_100h" | "ongoing";

// ---------- Core Entities ----------
interface Resource {
  id: string;
  title: string;
  creator: string;               // author / institution
  url: string;                   // verified real URL
  urlVerified: boolean;
  urlVerifiedDate: string;       // ISO
  resourceType: ResourceType;
  format: Format;
  cost: { model: CostModel; amount?: number; currency?: string; note?: string };
  estHours?: number;
  timeBucket: TimeBucket;
  difficulty: Difficulty;
  prerequisites: string[];       // Resource IDs or free-text
  buildsSkill: string;           // outcome
  whyForHim: string;             // person-specific rationale
  priority: Priority;
  producesArtifact: boolean;
  trackIds: Track[];
  skillIds: string[];
  roleRelevance: RoleRelevance[];
  tags: string[];
  freshness: "current" | "aging" | "stale" | "unknown";
  qualitySignal: string;         // community consensus note
}

interface Skill { id: string; trackId: Track; name: string; description: string; parentSkillId?: string; }
interface Track { id: Track; name: string; goal: string; skillIds: string[]; priorityRank: number; }

interface Project {
  id: string; title: string; trackIds: Track[]; goal: string;
  steps: string[]; stack: string[]; difficulty: Difficulty; estHours: number;
  proves: string;               // credibility signal
  publishAs: string;            // blog + repo + demo video, etc.
  isPortfolioPiece: boolean; isStartupSeed: boolean;
  relatedResourceIds: string[]; roleRelevance: RoleRelevance[]; tags: string[];
}

interface Drill {
  id: string; title: string; trackIds: Track[]; cadence: "daily" | "weekly" | "biweekly" | "monthly";
  description: string; estMinutes: number; soloOrPartner: "solo" | "ai_roleplay" | "partner" | "group";
  streakable: boolean; tags: string[];
}

interface Assessment {
  id: string; trackId: Track; type: "rubric" | "checkpoint" | "self_test" | "public_proof";
  readyWhen: string;            // "You're ready when you can X"
  questions?: string[]; tags: string[];
}

interface Milestone { id: string; pathId: string; phase: 1 | 2 | 3; title: string; targetWeek: number; criteria: string; dependsOn: string[]; }
interface Path { id: string; name: string; durationMonths: number; hoursPerWeek: number; orderedItemIds: string[]; variantOf?: string; description: string; }
interface Note { id: string; resourceId?: string; projectId?: string; body: string; createdAt: string; tags: string[]; }
interface ProgressEntry { id: string; itemId: string; itemType: "resource" | "project" | "drill" | "milestone"; status: "todo" | "in_progress" | "done" | "skipped"; percentComplete?: number; hoursLogged?: number; updatedAt: string; }
interface Tag { id: string; label: string; category: "skill" | "role" | "difficulty" | "cost" | "time" | "priority" | "domain"; }
```

---

## The Curated Content (structured records + human annotations)

Verification note: URLs below were surfaced via search/fetch during research (Sept 2026). Where price or existence is uncertain, it is flagged. Prices drift — treat all as approximate and re-verify at seed time.

### TRACK 1 — Hands-on AI/ML Fluency (priorityRank 1)

**Must-do foundational (free):**
- `t1-karpathy-zth` — **Neural Networks: Zero to Hero** — Andrej Karpathy — https://karpathy.ai/zero-to-hero.html — video_series/hands_on_lab, free, ~25–30h, foundational→intermediate. Builds: backprop, tokenization, building GPT from scratch (nanoGPT/micrograd/makemore). Why: the single best intuition-builder; lets him speak credibly about transformers without becoming a researcher. Artifact: yes (his own GPT + tokenizer repos). Freshness: current; code at github.com/karpathy/nn-zero-to-hero. Consensus: near-universally recommended.
- `t1-hf-llm-course` — **Hugging Face LLM Course** — Hugging Face — https://huggingface.co/learn/llm-course — course/hands_on_lab, free, ~30–40h, intermediate. Transformers, tokenizers, fine-tuning (Trainer/TRL), LoRA, SFT, GRPO (DeepSeek R1 recipe), Gradio demos. Why: maintained by the people who ship the libraries; directly practical. Artifact: yes (fine-tuned model on the Hub).
- `t1-hf-agents` — **Hugging Face AI Agents Course** — https://huggingface.co/learn/agents-course — free, ~20–30h, intermediate. smolagents, LangGraph, LlamaIndex, function-calling fine-tuning, observability, agentic RAG, certificate. Artifact: yes.
- `t1-hf-smol` — **smol-course (fine-tuning)** — https://huggingface.co/learn/smol-course/unit0/1 — free, intermediate, fast-paced. SFT, preference alignment (DPO), evaluation, VLMs, TRL/Transformers.

**Must-do / high (short courses, free-ish):**
- `t1-dlai-shortcourses` — **DeepLearning.AI Short Courses** (catalog) — https://www.deeplearning.ai/courses — video/hands_on_lab, free (platform beta) / some certificate fees, ~1–3h each. Specific picks: Building Agentic RAG with LlamaIndex (https://www.deeplearning.ai/courses/building-agentic-rag-with-llamaindex), Retrieval Augmented Generation (RAG) (https://www.deeplearning.ai/courses/retrieval-augmented-generation), plus agent-memory and AI-coding-workflow courses. Note: some courses charge ~$49 USD for a certificate; content is generally free.
- `t1-evals-course` — **AI Evals for Engineers & PMs** — Hamel Husain & Shreya Shankar (Maven) — https://maven.com/parlance-labs/evals — cohort, one-time **$4,200 USD** (per the live course page), ~15–20h over ~4 weeks, intermediate→advanced. 15 live sessions, 200+ page reader, Discord, coding homework, certificate; rating 4.7 (901 reviews); next cohort listed "Oct 10–Nov 21, 2026." Builds: error analysis, LLM-as-judge, CI regression testing, red-teaming, observability. Why: evals are BOTH an AI-eng skill and product work — a two-track twofer directly relevant to AI-SOC quality. Page claim: "the most comprehensive AI evals course available… refined with over 5,000 engineers and PMs from teams like OpenAI, Google, Meta, Amazon, and Microsoft." FLAG: expensive; the free substitute is Hamel's writing below. Consider only if an employer funds it.
- `t1-hamel-evals-blog` — **"Your AI Product Needs Evals"** + **"A Field Guide to Rapidly Improving AI Products"** — Hamel Husain — https://hamel.dev/blog/posts/evals/ and https://hamel.dev/blog/posts/field-guide/ (Field Guide also on O'Reilly Radar) — article, free, ~2–4h. The free substitute for the paid course; must-read regardless.

**Eval/observability tooling (learn by using, mostly free/OSS):**
- `t1-langfuse` Langfuse — https://langfuse.com — OSS, self-hostable tracing/evals (now part of ClickHouse). `t1-promptfoo` Promptfoo — https://www.promptfoo.dev — OSS, red-teaming + model comparison (500+ attack vectors), strongest for security testing. `t1-deepeval` DeepEval — https://deepeval.com — OSS (MIT), pytest-style evals + agent metrics. `t1-arize-phoenix` Arize Phoenix — OpenTelemetry-native OSS tracing. `t1-braintrust` Braintrust / `t1-langsmith` LangSmith — SaaS experiment/observability with free tiers (LangSmith locks to LangChain). Recommendation: standardize on **Langfuse + Promptfoo (security angle) + DeepEval**.

**Serving / inference / coding tools:**
- `t1-ollama` Ollama (https://ollama.com), `t1-vllm` vLLM (https://docs.vllm.ai) — run/serve open models locally; learn quantization, KV cache, batching by doing.
- `t1-claude-code` **Claude Code** (Anthropic) and `t1-cursor` **Cursor** — agentic coding. Learn spec-driven development (CLAUDE.md/AGENTS.md, plan mode, hooks). Since he'll build with AI assistance, mastery here is a force multiplier. Reference: GitHub Spec Kit (github/spec-kit) — 93,000+ GitHub stars as of May 2026, hit v1.0.0 on its one-year anniversary after a Sept 2, 2025 launch; treat the star count as a demand indicator for the spec-driven-development category, not a quality rating.

### TRACK 2 — Backend Engineering & System Design (priorityRank 3)

- `t2-sysdesign-primer` — **The System Design Primer** — Donne Martin — https://github.com/donnemartin/system-design-primer — repo/reading, free, ~20–40h, intermediate. **368k GitHub stars** (repo header, Sept 2026) — the most popular system-design learning resource on the internet; includes Anki spaced-repetition decks. Must-do (free canon).
- `t2-ddia` — **Designing Data-Intensive Applications** — Martin Kleppmann (O'Reilly) — book, one-time ~$45–60 USD, ~40–60h, advanced. The deep reference on distributed data systems. A 2nd edition has been in progress; verify current edition at purchase. High priority for CTO credibility.
- `t2-bytebytego` — **ByteByteGo** — Alex Xu — https://bytebytego.com — subscription (frequent 50%-off lifetime offers) + "System Design Interview" Vol 1 & 2 books. Visual, interview-oriented, now includes ML/GenAI system design. High (pick this OR the Primer as primary; Primer is free).
- `t2-ts-python` — Primary language paths: **Python** (FastAPI) and **TypeScript** (Node/Next.js). Python-first for AI ecosystem + TS for full-stack demos.
- `t2-fullstack` — **Next.js** (https://nextjs.org/learn) + deployment via **Vercel / Fly.io / Railway** — free/usage-based. Builds ability to ship end-to-end POCs solo.
- `t2-cloud-devops` — AWS/GCP essentials, Docker, Kubernetes basics, IaC (Terraform), CI/CD (GitHub Actions), observability. Learn just enough to deploy and secure; depth optional.

### TRACK 3 — Product Management Craft (priorityRank 4)

- `t3-momtest` — **The Mom Test** — Rob Fitzpatrick — book, one-time ~$20 USD, ~4h, foundational. Must-do; customer interviews without lying to yourself.
- `t3-inspired` — **INSPIRED** (and EMPOWERED, TRANSFORMED) — Marty Cagan / SVPG — book(s), ~$25–30 each; "Product is Hard" box set exists. Must-do: INSPIRED. Others optional.
- `t3-continuous-discovery` — **Continuous Discovery Habits** — Teresa Torres — book ~$25 USD, ~6h, intermediate. Opportunity solution trees, continuous interviewing. High.
- `t3-escaping-build-trap` — **Escaping the Build Trap** — Melissa Perri — book. Optional-high.
- `t3-lennys` — **Lenny's Newsletter + Podcast** — Lenny Rachitsky — https://www.lennysnewsletter.com — newsletter/podcast, freemium (~$150/yr for full + Slack; podcast free). High; ~half of 2026 content is AI-adjacent. Annual sub bundles product-tool credits.
- `t3-lenny-course` — **Product Management Fundamentals** (Maven) — https://maven.com/lenny/product-management-fundamentals — cohort, ~3–6h/wk over 3 weeks. NOTE: aimed at <2yr PMs — likely too junior for him; skip unless he wants the network.
- `t3-reforge` — **Reforge** — subscription $1,995 USD/year (Individual Plan). Overrated for his goals; SKIP unless an employer pays.
- `t3-aipm-khan` — **Prototype to Production: The AI PM Playbook** — Aman Khan (Head of Product, Arize) — https://maven.com/aman-khan/thriving-as-an-ai-pm — cohort, rating 4.8 (price not confirmed — re-verify). Builds AI agents in Cursor, evals, PM–eng collaboration. High for AI-PM credibility. Related free: he led DeepLearning.AI's "Evaluating AI Agents." Companion Maven courses: "Cursor for PMs" (https://maven.com/aman-khan/coding-agents-for-product-managers), "Claude Code for PMs (w/ Fable)," "Build AI Product Sense."
- `t3-prototyping` — Figma, **v0** (Vercel), **Lovable**, Claude artifacts — tools, freemium. For a non-designer to prototype. High.

### TRACK 4 — Forward-Deployed Engineer / Solutions Engineering (priorityRank 2)

- `t4-fde-explainers` — FDE playbook analyses (Palantir origin → OpenAI/Anthropic/Databricks/Cohere/Google Cloud). Sources: getperspective.ai FDE playbook (https://getperspective.ai/blog/palantir-forward-deployed-engineering-playbook-anthropic-openai-copying); aiengineerinsights.com role guide (https://aiengineerinsights.com/blog/forward-deployed-ai-engineer/). article, free. Must-read for role fluency. Key insight: AI FDEs in 2026 spend 30–40% of the week on conversational customer discovery; the value unlock is building a "customer-specific ontology." OpenAI stood up its FDE team in late 2024; Anthropic runs the function under its Applied AI group.
- `t4-psc` — **PreSales Collective** — https://www.presalescollective.com — community, free membership + paid programs (discovery, demoing, objection handling; 10-week cohort). High; **51,000+ members (15,973 in Slack, 39,000+ LinkedIn followers)** per PSC's own "How to get involved" page. Also runs Demo Days competitions.
- `t4-demo2win` — **Great Demo!** (Peter Cohan) and **Mastering Technical Sales** (John Care, "45,000+ students trained") — books/methodology. Demo craft. High for FDE.
- `t4-naase` — North American Association of Sales Engineers (Certified Sales Engineer / CSE designation) — certification, optional/skip.
- `t4-wtse` — Ramzi Marjaba's "We The Sales Engineers" — podcast/blog, free.

### TRACK 5 — Sales, GTM & Founder-Led Sales (priorityRank 6)

- `t5-founding-sales` — **Founding Sales: The Early Stage Go-to-Market Handbook** — Pete Kazanjy — https://www.foundingsales.com — book, FREE online (also Kindle/print), ~10h, intermediate. Must-do; the canonical founder-led sales handbook. Pairs with his First Round Review podcast + "founder led selling" deck.
- `t5-obviously-awesome` — **Obviously Awesome** — April Dunford — https://www.aprildunford.com/books — book ~$20 USD (newer edition noted). Must-do; positioning for B2B tech ("find your product's secret sauce").
- `t5-sales-pitch` — **Sales Pitch: How to Craft a Story to Stand Out and Win** — April Dunford (2023) — https://www.aprildunford.com/books — book. Eight-step pitch structure building on Obviously Awesome; high. Free 14-page workbook (Positioning Canvas + Sales Pitch Storyboard) at aprildunford.gumroad.com. NOTE: she offers facilitated workshops + free workbook, not a standalone self-serve course — re-verify if a course later appears.
- `t5-meddic` — MEDDIC/MEDDPICC, SPIN Selling, The Challenger Sale — frameworks/books. Selective reading; MEDDPICC most relevant to enterprise security deals.
- `t5-never-split` — **Never Split the Difference** — Chris Voss; and **Getting to Yes** — Fisher & Ury. Negotiation. High.
- `t5-ciso-buying` — Selling to CISOs / enterprise security buying (budget cycles, procurement, champions, POCs). Curate via CISO-focused newsletters + his own network; no single canonical book — gap to fill via practitioner blogs.

### TRACK 6 — Fundraising & Founder Skills (priorityRank 5; co-founder sub-workstream is must-do)

- `t6-yc-startup-school` — **YC Startup School + YC Library** — https://www.ycombinator.com/library — course/articles, free. Must-do. Covers SAFEs, fundraising, hiring.
- `t6-yc-cofounder` — **YC Co-Founder Matching** — https://www.ycombinator.com/cofounder-matching — community, free. Plus YC essays: "How to Split Equity Among Co-Founders" (https://www.ycombinator.com/library/5x-how-to-split-equity-among-co-founders) and "Co-Founder Equity Mistakes to Avoid" (https://www.ycombinator.com/library/LP-co-founder-equity-mistakes-to-avoid). MUST-DO given his failure mode. Standard: ~equal splits, 4-yr vesting / 1-yr cliff; the platform's median is 3–6 months to a signed agreement; run a trial project before committing.
- `t6-andy-raskin` — **"The Greatest Sales Deck I've Ever Seen"** — Andy Raskin — https://medium.com/the-mission/the-greatest-sales-deck-ive-ever-seen-4f4ef3391ba0 — article, free, ~30 min (reported 2M+ views). Strategic narrative: name a big shift → winners/losers → tease the Promised Land → product capabilities as "magic gifts" → evidence. Must-read for pitching/fundraising. Follow-ups: "The Making of a Great Strategic Narrative."
- `t6-managers-path` — **The Manager's Path** (Camille Fournier), **High Output Management** (Andy Grove), **Radical Candor** (Kim Scott) — books. People leadership. High for CTO.
- `t6-first-round` — **First Round Review** (https://review.firstround.com) + **a16z** + **Sequoia** content — articles, free. Fundraising/company-building. High.
- `t6-saas-metrics` — SaaS finance literacy: ARR, NRR, CAC, magic number, burn multiple, dilution/cap tables. Curate via First Round + Carta resources. High.
- `t6-israeli-fundraising` — Israeli-specific norms (8200 network, serial-founder premium, local VCs). Curate via ecosystem sources (see Track 7).

### TRACK 7 — Domain Expertise: AI Security & His Wedge (priorityRank 2, tied)

**Frameworks (must-do reading, free):**
- `t7-owasp-llm` — **OWASP Top 10 for LLM Applications (2025)** — https://genai.owasp.org/llm-top-10/ — free. LLM01 prompt injection → LLM10 unbounded consumption. Must-do.
- `t7-owasp-agentic` — **OWASP Top 10 for Agentic Applications (2026)** — https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ — free (announced Black Hat Europe 2025; developed with 100+ experts). Includes the FinBot CTF companion. Must-do; directly his wedge.
- `t7-mitre-atlas` — **MITRE ATLAS** — https://atlas.mitre.org — framework, free. Per the official mitre-atlas/atlas-data v5.1.0 release notes (Nov 2025): "1 matrix, 16 tactics, 84 techniques, 56 sub-techniques, 32 mitigations, and 42 case studies" (adds a Lateral Movement / Command-and-Control tactic); v5.4.0 followed Feb 2026 with more agentic techniques. Includes ATLAS Navigator + Arsenal tools. Must-do.
- `t7-nist-airmf` — **NIST AI RMF 1.0 + GenAI Profile (AI 600-1)** — https://www.nist.gov/itl/ai-risk-management-framework — free. Four functions (Govern/Map/Measure/Manage). High; procurement/enterprise language.
- `t7-owasp-redteam` — **OWASP GenAI Red Teaming Guide** (Jan 2025) — free. High.

**Hands-on AI security labs/CTFs (must-do; builds credibility):**
- `t7-gandalf` — **Gandalf** — Lakera — https://gandalf.lakera.ai — ctf, free, ~2–4h. Prompt-injection intro (8 levels). Must-do starter.
- `t7-hackaprompt` — **HackAPrompt** — free/paid credential + research dataset. High.
- `t7-htb-ai` — **Hack The Box "AI Red Teamer" path** (built with Google's red team) + Offensive AI Security CTF + "Certified AI Red Teamer" — ~$490/yr Silver (or ~$8/mo w/ student verification). High; the one credential worth considering (aligns with his wedge).
- `t7-promptfoo-redteam` — Promptfoo red-team (see T1) — OSS. `t7-deepteam` DeepTeam (https://www.trydeepteam.com) — OSS red-teaming mapping to OWASP/ATLAS/NIST.
- `t7-other-ranges` — Wiz "Prompt Airlines," Tensor Trust, PromptTrace (free, always-live, explains why defenses fail), PortSwigger Web Security Academy (free).

**NHI / agent identity (his sharpest wedge):**
- `t7-spiffe` — **SPIFFE/SPIRE** — https://spiffe.io — CNCF graduated project; workload identity for agents (SVIDs, attestation, short-lived certs, mTLS). Must-learn. Pair with OAuth 2.1, RFC 8693 token exchange, IETF WIMSE WG, MCP authorization spec (2025-11-25, OAuth 2.1 resource-server model), and A2A protocol.
- `t7-nhi-landscape` — NHI vendor/landscape reading via nhimg.org, Aembit blog, HashiCorp Vault SPIFFE support. article, free.

**AI-for-cyber / autonomous offense:**
- `t7-xbow` — **XBOW** — https://xbow.com + academy (https://xbow.com/academy/ai-pentesting) — reading/tool. Context (per XBOW's own blog, head of security Nico Waisman): "XBOW submitted nearly 1,060 vulnerabilities" (54 critical, 242 high, 524 medium, 65 low) over ~90 days — the first autonomous system to top HackerOne's US leaderboard (June 2025); the company raised a $75M round led by Altimeter Capital; Pentest On-Demand from ~$6,000. Study the category (treat as vendor claims).
- `t7-pentest-papers` — Autonomous pentest research: PentestGPT (USENIX Security 2024), HPTSA/multi-agent, CVE-Bench, Google "Big Sleep." arXiv, free. Read 1 paper/week (see drills).
- `t7-aisoc` — AI-native SOC concepts — curate via vendor engineering blogs + practitioner newsletters (flag as needs-curation).

**Cyber for physical AI / OT & robotics:**
- `t7-ros-ot` — ROS security, OT/ICS fundamentals, robot attack surface (Alias Robotics research). Foundational reading; optional-high depending on wedge choice.

**Defense-tech + Israeli ecosystem (his geography):**
- `t7-cyberweek` — **Cyber Week TAU** — https://cyberweektau.com — conference (Nov 9–12, 2026; 16th year, ~11,000+ attendees), free/paid. Must-attend (local); runs alongside AI Week.
- `t7-defensetech-week` — **DefenseTech Week TAU** (Dec 2–3, 2026) — https://en-cyber.tau.ac.il/events/DTWeek — conference. High.
- `t7-cybertech` — **Cybertech Global Tel Aviv** (Jan 25–27, 2027) — https://www.cybertechisrael.com — conference. High.
- Context: Israel's defense-tech sector grew from **160 companies (July 2024) to 312 (April 2025)** — a ~95% jump — per Startup Nation Central's Israel Defense Tech Landscape Map; SNC CEO Avi Hasson calls it "an important and fast-growing sector" while cautioning that "defense-tech nation" is an exaggeration. The IDF/MoD opened a Directorate for AI and Autonomy in Jan 2025. (A widely-quoted "world's #3 defense-tech hub" ranking could not be tied to a named authoritative source — flag for re-verification.)

**Staying current (newsletters/feeds — ongoing):**
- Simon Willison's Weblog (simonwillison.net — origin of the "lethal trifecta" prompt-injection framing), tl;dr sec (Clint Gibler), Latent Space (AI engineering), Import AI (Jack Clark). Curate 4–6 feeds max.

**Certifications — honest assessment:**
- CISSP: skip (management cert, not his need). OSCP: skip unless he wants deep offensive hands-on (high time cost, low ROI for his path). Cloud certs (AWS/GCP): optional, only if a role demands. **HTB Certified AI Red Teamer: the one credential worth considering** — aligns with his wedge. Net: certifications are LOW value; artifacts > certs.

### TRACK 8 — Meta-skills / Learning System (priorityRank 7)

- `t8-learning-public` — "Learn in Public" (Shawn Wang/swyx) + building-to-learn ethos. article, free. Must-adopt.
- `t8-pkm` — PKM: Obsidian (free) or Notion; "writing to think." Spaced repetition via Anki (pairs with System Design Primer decks).
- `t8-deliberate-practice` — Deliberate-practice + time-boxing for 10–15h/wk alongside a day job. Curate lightweight; don't over-invest.
- `t8-accountability` — Cohorts/communities as accountability (Maven cohorts, PSC, YC co-founder matching, Israeli meetups).

---

## Hands-On Work

### Portfolio Projects (each doubles as credibility signal + potential startup seed)

1. **`p-secure-mcp-agent` — Build an agent with MCP tools and secure it.** Goal: a working multi-tool agent (MCP servers) with an explicit permission model. Stack: Python/TS, MCP, an eval harness, SPIFFE/SPIRE or OAuth token-exchange for tool auth. Difficulty: intermediate. ~30–40h. Proves: he can build agents AND reason about agent authorization (his wedge). Publish: repo + blog post mapping controls to OWASP Agentic Top 10 + short demo video. Startup seed: yes (NHI/agent-permissions).
2. **`p-eval-harness` — Build an evaluation + regression harness for an LLM app.** Stack: DeepEval/Promptfoo + Langfuse tracing, LLM-as-judge, CI gate. ~20h. Proves: production AI maturity (the #1 FDE/AI-PM skill). Publish: repo + write-up.
3. **`p-ai-soc-triage` — Mini AI-SOC triage agent.** Goal: ingest sample alerts, triage/enrich/summarize with an LLM, human-in-the-loop. Stack: Python, RAG over detection docs, evals. ~40h. Proves: AI-for-cyber domain fusion. Startup seed: yes.
4. **`p-autonomous-pentest` — Autonomous pentest agent vs. intentionally vulnerable targets.** Targets: XBOW's 104-challenge benchmark, DVWA, HackTheBox. Stack: agent loop + tools, guardrails. ~40–60h. Proves: offensive AI credibility. Publish: benchmarked write-up (careful, authorized/ethical scope only).
5. **`p-nhi-prototype` — NHI/agent-permissions prototype.** Goal: issue short-lived workload identities to agents, enforce least privilege, audit tool calls. Stack: SPIFFE/SPIRE, OPA, mTLS. ~30h. Startup seed: strong.
6. **`p-redteam-writeup` — Red-team an LLM app and publish.** Do Gandalf → HackAPrompt → a real OSS LLM app; write a structured report mapped to MITRE ATLAS. ~15h. Proves: research communication.
7. **`p-fullstack-ai` — Ship a full-stack AI product solo.** Next.js + FastAPI + a model (Ollama/vLLM or API) + Vercel/Fly deploy. ~40–60h. Proves: end-to-end shipping (CTO credibility).
8. **`p-finetune-security` — Fine-tune a small model for a security task** (e.g., classify/triage security text). Stack: HF + LoRA/QLoRA/Unsloth. ~20h. Proves: he can go beyond API calls.
9. **`p-reproduce-paper` — Reproduce one agent-security or pentest paper.** ~20–30h. Proves: research literacy.

### Drills (recurring, streakable)
- `d-paper-week` (weekly): read one AI-security/agent paper, write a 200-word summary. 90 min.
- `d-sysdesign-week` (weekly): one system-design problem end-to-end (from Primer/ByteByteGo). 60 min.
- `d-tech-post-week` (weekly): publish one technical post (learn-in-public). 90 min.
- `d-demo-week` (weekly): record + self-review one 5-min demo of something he built. 45 min.
- `d-customer-interview-week` (weekly): one Mom-Test-style discovery call (network/design partners). 45 min.
- `d-cold-outreach-day` (daily, Phase 1): one cold outreach (job hunt / design partner). 15 min.
- `d-prd-rewrite` (biweekly): rewrite a real product's PRD/spec. 60 min.
- `d-ctf-week` (weekly): one AI-security CTF level/challenge. 30–60 min.
- `d-negotiation-roleplay` (biweekly): AI-roleplay a negotiation/objection-handling scenario. 30 min.

### Soft-skill workouts (solo or AI-roleplay)
- Pitch: record the Andy Raskin 5-part narrative for his own idea; self-review weekly.
- Difficult conversations / co-founder "prenup" talk: AI-roleplay both sides.
- Discovery calls: AI-roleplay a skeptical CISO buyer; practice Mom Test.
- Objection handling: AI-roleplay enterprise-security procurement objections.
- Running 1:1s and giving feedback: script + roleplay using Radical Candor / Manager's Path frames.
- Saying no: practice prioritization/roadmap refusals.

### Assessments / self-checks (rubrics + "ready when")
- **T1 ready-when:** "I can build a small GPT from scratch, fine-tune an open model with LoRA, and stand up an eval harness that gates a change." Self-test: explain attention, tokenization, KV cache, DPO vs RLHF to a peer.
- **T2 ready-when:** "I can design and deploy a multi-tenant AI SaaS with sensible cost/latency tradeoffs and explain the data model." Self-test: 5 canonical system-design questions.
- **T3 ready-when:** "I can run 5 discovery interviews, synthesize an opportunity solution tree, write a crisp PRD, and define a north-star metric + eval plan for an AI feature."
- **T4 ready-when:** "I can run technical discovery, scope a POC, and deliver a 15-min demo that survives objections." Public proof: a PSC Demo Days-style recorded demo.
- **T5 ready-when:** "I can position a product (Dunford canvas), deliver a Raskin-narrative pitch, and run a founder-led sales call end-to-end."
- **T6 ready-when:** "I can build a cap table, explain SAFEs/dilution, run a co-founder trial project with a written agreement, and pitch to a VC." Public proof: a real pitch deck reviewed against a First Round-style rubric.
- **T7 ready-when:** "I can threat-model an agentic app against OWASP Agentic Top 10 + MITRE ATLAS, and demonstrate an NHI/agent-auth control." Public proof: published red-team write-up + secured-agent repo.

### Vulnerable/practice environments (currently available)
- AI security: Gandalf (gandalf.lakera.ai), HackAPrompt, HTB AI Red Teamer path + Offensive AI Security CTF, PromptTrace, Tensor Trust, Wiz "Prompt Airlines," OWASP FinBot CTF.
- AppSec/web: XBOW 104-challenge benchmark, DVWA, PortSwigger Web Security Academy (free), HackTheBox/TryHackMe.
- Cloud: (curate current cloud-security CTFs at seed time — flag as needs-verification).

---

## Sequenced Learning Paths

### Primary path — "Product-CTO in 18 months" (default), ~12h/week, 3 phases

**Phase 1 (Months 0–3, while job hunting):** Karpathy Zero-to-Hero → HF LLM Course (start) → HF Agents Course → Gandalf + OWASP LLM/Agentic reading → Projects `p-secure-mcp-agent` + `p-redteam-writeup` → Founding Sales (read) → start `d-tech-post-week`, `d-cold-outreach-day`, `d-paper-week`. FDE explainers + PreSales Collective free membership. Milestone: 2 published projects + a demo reel + FDE/founding-SE applications out.

**Phase 2 (Months 3–12, first year in the seed-stage job):** System Design Primer + DDIA → `p-eval-harness` + `p-ai-soc-triage` → AI Evals (Hamel's free material; paid course only if employer funds) → SPIFFE/SPIRE + NHI landscape → Aman Khan AI-PM course → Continuous Discovery Habits + Mom Test → drills continue. Attend Cyber Week TAU. Milestone: shipping real FDE/PM work + `p-nhi-prototype` started + a recognized public post or two.

**Phase 3 (Months 12–18, pre-founding):** `p-fullstack-ai` + `p-finetune-security` → YC Startup School + co-founder matching + equity/vesting essays (run a co-founder trial project) → Dunford Obviously Awesome + Sales Pitch → Andy Raskin narrative → SaaS metrics + First Round fundraising → The Manager's Path / High Output Management. Milestone: a co-founder trial completed with written agreement, a positioning + pitch deck, and a domain reputation.

### Variant A — "Fast credibility for an FDE role in 90 days" (~15h/wk)
Karpathy (skim to GPT) → HF Agents Course → DeepLearning.AI RAG + Agentic RAG → `p-secure-mcp-agent` + `p-eval-harness` → FDE explainers + PSC → demo drills + cold outreach daily → Founding Sales. Output: 2 shippable repos, a demo reel, applications out.

### Variant B — "Deep domain expert in agent security" (~12h/wk, 9–12 mo)
OWASP LLM+Agentic + MITRE ATLAS + NIST AI RMF → Gandalf → HackAPrompt → HTB AI Red Teamer → SPIFFE/SPIRE + MCP auth + WIMSE → papers weekly → `p-redteam-writeup` + `p-nhi-prototype` + `p-autonomous-pentest` → present at BSides TLV / Cyber Week. Output: a recognized public body of work in agent/NHI security.

### Variant C — "Minimum viable founder skills" (~8h/wk, 6 mo)
Founding Sales → Dunford (both books) → Andy Raskin → YC Startup School + co-founder matching + equity essays → Mom Test → SaaS metrics → Never Split the Difference. Output: co-founder search underway with a structured trial + agreement; a pitch deck.

### Dependencies (partial DAG)
- Karpathy ZTH → HF LLM/smol → `p-finetune-security`.
- HF Agents → `p-secure-mcp-agent` → `p-nhi-prototype`.
- Eval material → `p-eval-harness` → `p-ai-soc-triage`.
- System Design Primer/DDIA → `p-fullstack-ai`.
- OWASP/ATLAS reading → `p-redteam-writeup` → conference talk.

---

## Suggested Dashboard Features & UI Sections
1. **Track Progress board** — 8 track cards with % complete, priorityRank ordering, role-relevance filter chips (PM/FDE/SE/Developer/CTO/CEO).
2. **"What should I do this week" view** — auto-assembles from the active Path phase + due Drills + next unblocked Resource/Project (respecting the dependency DAG).
3. **Today's Queue** — next resource lesson, one drill, spaced-repetition reviews due.
4. **Project Portfolio** — kanban of Projects with `producesArtifact`/`isStartupSeed` badges and publish links (repo/blog/demo).
5. **Drill Streaks** — streak counters + calendar heatmap for daily/weekly drills.
6. **Spaced-Repetition Review** — Anki-style deck (seed with System Design Primer + transformer/eval concepts).
7. **Reading List / Papers** — queue with a "1 paper/week" tracker and note capture.
8. **Notes / PKM** — markdown notes linked to Resource/Project IDs; "writing to think."
9. **Self-Assessment Rubrics** — per-track "ready-when" checkpoints with public-proof links.
10. **Path Switcher** — toggle between Primary and Variants A–C; recomputes the weekly plan.
11. **Budget/Cost view** — total spend by CostModel; flags paid items and their free alternatives.
12. **Freshness monitor** — surfaces resources tagged `aging`/`stale`/`unknown` for re-verification (esp. OWASP/ATLAS/NIST versions, quarterly).

## Taxonomy of Tags/Enums
- **Skill areas (domain tags):** transformers, tokenization, rag, embeddings, agents, mcp, evals, observability, finetuning, lora, dpo, grpo, rlhf, inference, serving, quantization, system_design, distributed_data, cloud, kubernetes, appsec, nhi, workload_identity, spiffe, oauth_oidc, zero_trust, ai_soc, autonomous_pentest, prompt_injection, red_teaming, ot_ics, defense_tech, discovery, jtbd, prd, metrics, ab_testing, b2b_pm, ai_pm, positioning, founder_led_sales, meddic, negotiation, fundraising, safes, cap_table, cofounder, hiring, leadership, narrative, pkm, learning_in_public.
- **Role relevance:** PM, FDE, SE, Developer, CTO, CEO.
- **Difficulty:** foundational, intermediate, advanced.
- **Cost:** free, one_time, subscription, freemium.
- **Time buckets:** lt_2h, 2_10h, 10_30h, 30_100h, gt_100h, ongoing.
- **Priority:** must_do, high, optional, skip_unless_relevant.

## Recommendations (staged, with thresholds)
1. **Next 30 days:** Start Karpathy ZTH + HF Agents; do Gandalf; read OWASP Agentic Top 10; ship `p-secure-mcp-agent` v0; begin weekly tech posts + daily outreach. Threshold to move on: one public repo + one post live.
2. **Days 30–90:** Finish HF LLM course; build `p-eval-harness`; read Founding Sales + FDE playbooks; join PreSales Collective; apply to seed-stage FDE/founding-SE roles. Threshold: 2 portfolio projects + a demo reel + interviews booked. If interviews stall, switch to Variant A intensity and double down on demos.
3. **In the job (Months 3–12):** Layer System Design Primer/DDIA + SPIFFE/NHI + AI-PM course; ship `p-ai-soc-triage` + `p-nhi-prototype`; attend Cyber Week TAU. Threshold to enter pre-founding: a recognized public reputation in agent/NHI security + shipped FDE work.
4. **Pre-founding (Months 12–18):** Run a structured co-founder trial (this is the direct fix for his past failure) with a written agreement + vesting; build positioning + Raskin narrative + pitch deck; learn SaaS metrics/cap tables. Threshold to found: co-founder trial passed + a design partner + a crisp wedge.
5. **Spend discipline:** Stay free/OSS for Tracks 1–2 and most of 7. Pay only for: (a) HTB AI Red Teamer (~$490/yr) if he wants a credential in his wedge; (b) one cohort — either Aman Khan's AI-PM or Hamel's evals ($4,200; ideally employer-funded); (c) books. Skip Reforge ($1,995/yr) and CISSP/OSCP.

## Caveats
- **Prices/existence drift.** All prices are approximate as of Sept 2026 and should be re-verified at seed time; flagged items especially (April Dunford "course" — only workshops + free workbook confirmed; Aman Khan course price not captured; DDIA 2nd edition status; ByteByteGo subscription price; current cloud-security CTFs).
- **Speculative/hype content flagged.** FDE-market pieces and vendor blogs (XBOW, eval vendors) are partly marketing; treat capability claims (e.g., XBOW's "nearly 1,060 vulnerabilities" and top-of-leaderboard status) as vendor/press claims, not independently verified.
- **The "world's #3 defense-tech hub" claim is unverified** to a named authoritative source; the Startup Nation Central company-count growth (160→312) and Tel Aviv's 2025 funding figures are better-sourced anchors.
- **AI security moves weekly.** OWASP/ATLAS/NIST versions update frequently (ATLAS moved from v5.1.0 in Nov 2025 to v5.4.0 by Feb 2026); the dashboard's freshness monitor should re-check these quarterly.
- **He must choose depth over breadth despite wanting volume.** This library over-collects by design (his explicit request: "gather and organize the most you can — I would choose what to learn"); the paths exist to prevent overwhelm — he should pick ONE variant and treat the rest as backlog.
- **Certifications are deliberately de-emphasized** — this is a judgment call; if a specific target employer requires one, override it.