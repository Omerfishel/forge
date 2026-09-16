// Assessments — per-track "ready-when" rubrics, peer self-tests and public-proof
// checks (docs/curriculum-spec.md → "Assessments / self-checks"). The readyWhen
// sentences are the spec's verbatim (T1–T7) and mirror src/data/tracks.ts; T8 has
// no spec sentence, so its readyWhen is the one derived in tracks.ts from the
// Track 8 items (learn in public, PKM + Anki, deliberate practice, accountability).
// Three records per track: a-tN-rubric (criteria break the sentence into checkable
// statements), a-tN-selftest (questions + "I can explain…" criteria) and a-tN-proof
// (the spec's public proof where it names one; a sensible one otherwise).
import type { Assessment } from "@/types";

const READY_WHEN = {
  T1_AI_ML:
    "I can build a small GPT from scratch, fine-tune an open model with LoRA, and stand up an eval harness that gates a change.",
  T2_BACKEND_SYSTEMS:
    "I can design and deploy a multi-tenant AI SaaS with sensible cost/latency tradeoffs and explain the data model.",
  T3_PRODUCT:
    "I can run 5 discovery interviews, synthesize an opportunity solution tree, write a crisp PRD, and define a north-star metric + eval plan for an AI feature.",
  T4_FDE_SE: "I can run technical discovery, scope a POC, and deliver a 15-min demo that survives objections.",
  T5_SALES_GTM:
    "I can position a product (Dunford canvas), deliver a Raskin-narrative pitch, and run a founder-led sales call end-to-end.",
  T6_FOUNDER:
    "I can build a cap table, explain SAFEs/dilution, run a co-founder trial project with a written agreement, and pitch to a VC.",
  T7_DOMAIN:
    "I can threat-model an agentic app against OWASP Agentic Top 10 + MITRE ATLAS, and demonstrate an NHI/agent-auth control.",
  T8_META:
    "I publish one technical post a week, keep a PKM with spaced-repetition reviews, and sustain 10–15h/week of deliberate practice alongside a day job with a cohort or community holding me accountable.",
} as const;

export const assessments: Assessment[] = [
  // ================================================================ T1 AI/ML
  {
    id: "a-t1-rubric",
    trackId: "T1_AI_ML",
    type: "rubric",
    title: "T1 ready-when rubric",
    readyWhen: READY_WHEN.T1_AI_ML,
    criteria: [
      "I built a small GPT from scratch (micrograd → makemore → nanoGPT, per Karpathy Zero to Hero) and the code lives in my own repo.",
      "I built my own tokenizer and can explain how tokenization shapes model behaviour.",
      "I fine-tuned an open model with LoRA/QLoRA (HF LLM course / smol-course, TRL) and pushed it to the Hugging Face Hub.",
      "I stood up an eval harness (DeepEval or Promptfoo + Langfuse tracing) with error analysis and an LLM-as-judge metric.",
      "The harness gates a change: a CI regression check blocks a prompt or model change that regresses the eval set.",
      "I built a tool-using agent (smolagents / LangGraph / LlamaIndex) with tracing/observability turned on.",
      "I ran and served an open model locally (Ollama or vLLM) and can explain quantization, KV cache and batching from doing it.",
    ],
    tags: ["t1", "rubric", "ready-when", "transformers", "lora", "evals", "agents"],
  },
  {
    id: "a-t1-selftest",
    trackId: "T1_AI_ML",
    type: "self_test",
    title: "T1 self-test: explain it to a peer",
    readyWhen: READY_WHEN.T1_AI_ML,
    questions: [
      "Attention: what Q/K/V are, why softmax over scaled dot products, what multi-head buys you, and what causal masking does in a GPT.",
      "Tokenization: what BPE does, why the tokenizer (not the model) causes odd behaviour on spelling and arithmetic, and how vocabulary size trades off against sequence length.",
      "KV cache: what is cached during decoding, why it makes each new token cheap, and why it dominates memory at long context and high batch size.",
      "DPO vs RLHF: what a reward model is, how RLHF uses it, why DPO optimises preferences directly without one, and when you would pick each.",
      "LoRA: what the low-rank adapters change, why training them is cheap, what QLoRA adds, and what you give up versus full fine-tuning.",
      "Eval gating: error analysis → LLM-as-judge → CI regression test; what it means for a harness to 'gate a change' and what a noisy judge does to that gate.",
      "GRPO / the DeepSeek R1 recipe (HF LLM course): what group-relative rewards replace and why it matters for reasoning fine-tunes.",
      "RAG vs fine-tuning: when retrieval is the right tool, what embeddings and vector search do, and what agentic RAG adds.",
      "Serving: what 4-bit quantization does to weights and quality, why batching matters, and where vLLM differs from Ollama.",
    ],
    criteria: [
      "I can explain attention (Q/K/V, scaled softmax, multi-head, causal masking) to a peer.",
      "I can explain tokenization (BPE, tokenizer-caused quirks, vocab size vs sequence length) to a peer.",
      "I can explain the KV cache and why it drives decode speed and memory to a peer.",
      "I can explain DPO vs RLHF, the role of a reward model, and when to use each to a peer.",
      "I can explain LoRA/QLoRA and its tradeoffs versus full fine-tuning to a peer.",
      "I can explain how an eval harness gates a change (error analysis, LLM-as-judge, CI regression) to a peer.",
      "I can explain GRPO and the DeepSeek R1 recipe at a high level to a peer.",
      "I can explain RAG vs fine-tuning, embeddings/vector search and agentic RAG to a peer.",
      "I can explain quantization, batching and vLLM vs Ollama serving tradeoffs to a peer.",
    ],
    tags: ["t1", "self-test", "transformers", "tokenization", "inference", "dpo", "rlhf", "lora", "evals"],
  },
  {
    id: "a-t1-proof",
    trackId: "T1_AI_ML",
    type: "public_proof",
    title: "T1 public proof: shipped repos",
    readyWhen: READY_WHEN.T1_AI_ML,
    publicProof:
      "Public GPT + tokenizer repos (Karpathy Zero to Hero artifacts), a fine-tuned model on the Hugging Face Hub, and the eval-harness repo (p-eval-harness) with its write-up — all linked from a public profile.",
    criteria: [
      "My from-scratch GPT and tokenizer repos are public with a README that explains what was built and learned.",
      "A LoRA fine-tuned model (e.g. p-finetune-security) is on the Hugging Face Hub with a model card.",
      "The eval-harness repo (p-eval-harness) is public with a CI gate visible in its history and a published write-up.",
      "A secured MCP agent (p-secure-mcp-agent) repo is public with a short demo video.",
      "At least one technical post (d-tech-post-week) explains a T1 concept I built, not just read about.",
    ],
    tags: ["t1", "public-proof", "portfolio", "github", "huggingface-hub", "evals"],
  },

  // ===================================================== T2 Backend / systems
  {
    id: "a-t2-rubric",
    trackId: "T2_BACKEND_SYSTEMS",
    type: "rubric",
    title: "T2 ready-when rubric",
    readyWhen: READY_WHEN.T2_BACKEND_SYSTEMS,
    criteria: [
      "I can whiteboard a multi-tenant AI SaaS end-to-end in 45 minutes: API, auth, tenancy isolation, queue/workers, vector store, model serving, observability.",
      "I can explain the data model: tenants, users, documents and embeddings, jobs, traces — and exactly where tenant isolation is enforced.",
      "I can reason about cost/latency tradeoffs: caching, batching, model routing (small vs large), streaming, quantization and KV cache at the serving layer.",
      "I deployed a FastAPI + Next.js app with Docker and GitHub Actions CI to Vercel / Fly.io / Railway.",
      "I can explain replication, partitioning and consistency tradeoffs (DDIA) with a concrete example from my own system.",
      "I can explain observability for an AI service: traces, metrics, logs and per-tenant cost attribution.",
    ],
    tags: ["t2", "rubric", "ready-when", "system-design", "distributed-data", "fullstack", "devops-cicd"],
  },
  {
    id: "a-t2-selftest",
    trackId: "T2_BACKEND_SYSTEMS",
    type: "self_test",
    title: "T2 self-test: 5 canonical system designs",
    readyWhen: READY_WHEN.T2_BACKEND_SYSTEMS,
    questions: [
      "Design a URL shortener / Pastebin: API, key generation, storage, caching, read/write ratio, expiry and analytics (System Design Primer).",
      "Design a rate limiter: token bucket vs sliding window, gateway vs service placement, distributed state, and what the client gets back (ByteByteGo).",
      "Design a news feed / Twitter timeline and search: fan-out on write vs on read, the celebrity problem, ranking, caching and the search index (Primer + ByteByteGo).",
      "Design a distributed key-value store: partitioning, replication, quorum consistency, failure detection and conflict resolution (DDIA + ByteByteGo).",
      "Design a multi-tenant LLM/RAG serving platform: tenancy isolation, embeddings and vector store, model routing, batching and KV cache, cost and latency budgets, per-tenant tracing (ByteByteGo GenAI system design — the T2 ready-when).",
    ],
    criteria: [
      "I can explain the design of a URL shortener / Pastebin end-to-end, including the cache and storage tradeoffs.",
      "I can explain the design of a rate limiter and defend the algorithm and placement I chose.",
      "I can explain the design of a news feed / timeline with fan-out, ranking and search tradeoffs.",
      "I can explain the design of a distributed key-value store, including consistency and failure handling.",
      "I can explain the design of a multi-tenant LLM/RAG serving platform with its cost/latency tradeoffs and data model.",
    ],
    tags: ["t2", "self-test", "system-design", "distributed-data", "serving", "interview"],
  },
  {
    id: "a-t2-proof",
    trackId: "T2_BACKEND_SYSTEMS",
    type: "public_proof",
    title: "T2 public proof: full-stack AI app live",
    readyWhen: READY_WHEN.T2_BACKEND_SYSTEMS,
    publicProof:
      "A full-stack AI product shipped solo (p-fullstack-ai: Next.js + FastAPI + a model via Ollama/vLLM or API, deployed on Vercel/Fly) with a live URL, a public repo and an architecture write-up covering the data model and cost/latency choices.",
    criteria: [
      "The app is live at a public URL and survives a stranger using it.",
      "The repo is public with a README architecture diagram and the data model explained.",
      "CI (GitHub Actions) builds, tests and deploys; Docker/IaC lives in the repo.",
      "The write-up states the cost/latency tradeoffs made (model choice, caching, batching, streaming) with numbers.",
      "Eight weekly system-design drills (d-sysdesign-week) are logged and one solution is published as a post.",
    ],
    tags: ["t2", "public-proof", "fullstack", "cloud", "devops-cicd", "portfolio"],
  },

  // ============================================================== T3 Product
  {
    id: "a-t3-rubric",
    trackId: "T3_PRODUCT",
    type: "rubric",
    title: "T3 ready-when rubric",
    readyWhen: READY_WHEN.T3_PRODUCT,
    criteria: [
      "I ran 5 Mom-Test-style discovery interviews (past behaviour, no pitching) with notes captured in my PKM.",
      "I synthesized them into an opportunity solution tree (Torres): outcome → opportunities → solutions → assumption tests.",
      "I wrote a crisp PRD — problem, users, success metrics, scope and non-goals, risks — for a real or portfolio feature (d-prd-rewrite counts).",
      "I defined a north-star metric plus its input metrics for an AI feature.",
      "I wrote an eval plan for that AI feature: what 'good' means, error analysis, LLM-as-judge, launch and regression gates.",
      "I prototyped the feature with Figma, v0, Lovable or Claude artifacts to show rather than tell.",
    ],
    tags: ["t3", "rubric", "ready-when", "discovery", "prd", "metrics", "ai-pm", "prototyping"],
  },
  {
    id: "a-t3-selftest",
    trackId: "T3_PRODUCT",
    type: "self_test",
    title: "T3 self-test: product craft",
    readyWhen: READY_WHEN.T3_PRODUCT,
    questions: [
      "What is the Mom Test, and which rules keep a customer interview from lying to you (talk about their life, ask about specifics in the past, talk less)?",
      "Walk through an opportunity solution tree: outcome, opportunities, solutions, assumption tests — and how continuous interviewing (Torres) feeds it every week.",
      "What belongs in a crisp PRD and what does not? How do empowered product teams differ from feature factories (Cagan, Perri)?",
      "How do you choose a north-star metric and its input metrics for an AI feature, and how does the eval plan relate to those product metrics?",
      "How does A/B testing change for an AI feature: non-determinism, offline evals versus online experiments, guardrail metrics?",
      "What changes about PM–engineering collaboration when building with LLMs (prompts as spec, evals as acceptance criteria, building agents in Cursor per Aman Khan)?",
    ],
    criteria: [
      "I can explain the Mom Test and run an interview that follows it.",
      "I can explain an opportunity solution tree and how continuous discovery feeds it.",
      "I can explain what a crisp PRD contains and how empowered teams differ from feature factories.",
      "I can explain how to pick a north-star metric and input metrics for an AI feature and tie them to an eval plan.",
      "I can explain how A/B testing differs for AI features (offline evals vs online experiments).",
      "I can explain how PM–eng collaboration changes when building with LLMs.",
    ],
    tags: ["t3", "self-test", "discovery", "jtbd", "prd", "metrics", "ab-testing", "ai-pm"],
  },
  {
    id: "a-t3-proof",
    trackId: "T3_PRODUCT",
    type: "public_proof",
    title: "T3 public proof: published PRD + discovery",
    readyWhen: READY_WHEN.T3_PRODUCT,
    publicProof:
      "A published product case study for one portfolio project (e.g. p-ai-soc-triage): 5-interview discovery synthesis, the opportunity solution tree, a crisp PRD, the north-star metric + eval plan, and a clickable prototype link.",
    criteria: [
      "The discovery synthesis (5 interviews, anonymised) and opportunity solution tree are published.",
      "The PRD is published and states problem, users, success metrics, scope/non-goals and risks.",
      "The north-star metric, input metrics and eval plan for the AI feature are in the same document.",
      "A clickable prototype (v0 / Lovable / Claude artifact / Figma) is linked.",
      "At least one weekly customer interview (d-customer-interview-week) is logged for 5 consecutive weeks.",
    ],
    tags: ["t3", "public-proof", "prd", "discovery", "prototyping", "portfolio"],
  },

  // ============================================================== T4 FDE / SE
  {
    id: "a-t4-rubric",
    trackId: "T4_FDE_SE",
    type: "rubric",
    title: "T4 ready-when rubric",
    readyWhen: READY_WHEN.T4_FDE_SE,
    criteria: [
      "I can run a technical discovery call as conversational customer discovery and capture the customer-specific ontology (entities, workflows, data sources, constraints).",
      "I can scope a POC in writing: success criteria, timeline, data access, owners, and an explicit decision gate.",
      "I delivered a 15-minute demo of something I built to a live audience (Great Demo! / Mastering Technical Sales craft).",
      "I handled objections during the demo — security, integration, cost, 'we could build this ourselves' — without derailing.",
      "I can explain the FDE playbook (Palantir origin → OpenAI, Anthropic, Databricks, Cohere, Google Cloud) and the 30–40% discovery time split.",
      "I recorded and self-reviewed a weekly 5-minute demo (d-demo-week) for 8 consecutive weeks.",
    ],
    tags: ["t4", "rubric", "ready-when", "fde-playbook", "technical-discovery", "poc-scoping", "demo-craft"],
  },
  {
    id: "a-t4-selftest",
    trackId: "T4_FDE_SE",
    type: "self_test",
    title: "T4 self-test: the FDE loop",
    readyWhen: READY_WHEN.T4_FDE_SE,
    questions: [
      "What does a Forward-Deployed Engineer actually do in a week at an AI lab in 2026, and how does it differ from a classic SE / solutions architect?",
      "What is a customer-specific ontology and how do you build one during discovery?",
      "How do you scope a POC so it cannot drag on: success criteria, decision gate, data access, who owns what, when to walk away?",
      "How do you structure a 15-minute demo (Great Demo!: the 'wow' first, then the path) and what do you deliberately leave out?",
      "Give your answers to the three hardest objections: 'it is not secure', 'we could build this ourselves', 'it hallucinates'.",
      "How do you run technical discovery with a skeptical CISO buyer using Mom Test rules (past behaviour, not hypotheticals)?",
    ],
    criteria: [
      "I can explain what an AI-lab FDE does weekly and how it differs from a classic SE.",
      "I can explain what a customer-specific ontology is and how to build one in discovery.",
      "I can explain how to scope a POC with success criteria and a decision gate.",
      "I can explain how to structure a 15-minute demo and what to leave out.",
      "I can explain my answers to the security, build-vs-buy and hallucination objections.",
      "I can explain how to run technical discovery with a skeptical CISO using Mom Test rules.",
    ],
    tags: ["t4", "self-test", "fde-playbook", "customer-ontology", "poc-scoping", "objection-handling"],
  },
  {
    id: "a-t4-proof",
    trackId: "T4_FDE_SE",
    type: "public_proof",
    title: "T4 public proof: recorded demo",
    readyWhen: READY_WHEN.T4_FDE_SE,
    publicProof:
      "A PreSales Collective Demo Days-style recorded 15-minute demo of something I built (e.g. p-secure-mcp-agent or p-eval-harness), published publicly, including a live objection-handling segment.",
    criteria: [
      "The 15-minute demo is recorded and published (public video link) and demos something I built.",
      "The recording includes at least three objections handled live (security, integration/cost, build-vs-buy).",
      "The demo follows a Demo Days-style structure: the outcome first, then the path, with a clear ask at the end.",
      "It was shared for feedback in PreSales Collective (or entered in a Demo Days competition) and the feedback is captured.",
      "A demo reel (short cuts of the weekly d-demo-week recordings) is linked from my public profile.",
    ],
    tags: ["t4", "public-proof", "demo-craft", "presales-collective", "demo-days", "portfolio"],
  },

  // ============================================================ T5 Sales / GTM
  {
    id: "a-t5-rubric",
    trackId: "T5_SALES_GTM",
    type: "rubric",
    title: "T5 ready-when rubric",
    readyWhen: READY_WHEN.T5_SALES_GTM,
    criteria: [
      "I filled in a Dunford Positioning Canvas for a product: competitive alternatives → unique attributes → value → best-fit customers → market category.",
      "I built and delivered a Raskin-style strategic-narrative pitch: big shift → winners/losers → Promised Land → 'magic gifts' → evidence.",
      "I ran a founder-led sales call end-to-end (Founding Sales): prospecting → discovery → pitch → objections → agreed next step.",
      "I can qualify an enterprise-security deal with MEDDPICC and name the champion and economic buyer.",
      "I negotiated with Never Split the Difference / Getting to Yes techniques (labeling, calibrated questions, BATNA) in a real or roleplayed deal.",
      "I can describe how a CISO buys: budget cycles, procurement, champions, POCs — and where deals die.",
    ],
    tags: ["t5", "rubric", "ready-when", "positioning", "strategic-narrative", "founder-led-sales", "meddic", "negotiation"],
  },
  {
    id: "a-t5-selftest",
    trackId: "T5_SALES_GTM",
    type: "self_test",
    title: "T5 self-test: position, pitch, sell",
    readyWhen: READY_WHEN.T5_SALES_GTM,
    questions: [
      "Walk the Dunford positioning canvas for a product you know: competitive alternatives, unique attributes, value, best-fit customers, market category.",
      "Deliver a Raskin narrative in three minutes: what is the shift, who wins and loses, what is the Promised Land, what are the magic gifts, what is the evidence?",
      "What is MEDDPICC and how would you qualify a deal with a CISO's team using it?",
      "How does founder-led sales differ from hiring a salesperson early (Kazanjy), and what does the first repeatable sales process look like?",
      "Explain three Never Split the Difference techniques (mirroring, labeling, calibrated questions) and BATNA from Getting to Yes.",
      "How does a CISO buy — budget cycles, procurement, champions, POCs — and where do enterprise-security deals die?",
    ],
    criteria: [
      "I can explain the Dunford positioning canvas and fill it for a product I know.",
      "I can explain and deliver a Raskin strategic narrative in three minutes.",
      "I can explain MEDDPICC and use it to qualify a CISO-team deal.",
      "I can explain founder-led sales versus early sales hires and describe a first sales process.",
      "I can explain mirroring, labeling, calibrated questions and BATNA.",
      "I can explain how CISOs buy and where enterprise-security deals die.",
    ],
    tags: ["t5", "self-test", "positioning", "strategic-narrative", "meddic", "negotiation", "ciso-selling"],
  },
  {
    id: "a-t5-proof",
    trackId: "T5_SALES_GTM",
    type: "public_proof",
    title: "T5 public proof: pitch + canvas",
    readyWhen: READY_WHEN.T5_SALES_GTM,
    publicProof:
      "A recorded Raskin 5-part narrative pitch for my own idea (the pitch workout), a published positioning one-pager built on the Dunford canvas, and at least one real founder-led discovery/sales call with a design partner logged.",
    criteria: [
      "The Raskin-narrative pitch for my own idea is recorded, published and self-reviewed against the five parts.",
      "The positioning one-pager (Dunford canvas + Sales Pitch storyboard) is published.",
      "At least one real founder-led discovery/sales call with a design partner is logged with a MEDDPICC qualification sheet.",
      "Two biweekly negotiation / objection-handling roleplays (d-negotiation-roleplay) are logged with what changed.",
    ],
    tags: ["t5", "public-proof", "strategic-narrative", "positioning", "founder-led-sales"],
  },

  // ================================================================ T6 Founder
  {
    id: "a-t6-rubric",
    trackId: "T6_FOUNDER",
    type: "rubric",
    title: "T6 ready-when rubric",
    readyWhen: READY_WHEN.T6_FOUNDER,
    criteria: [
      "I built a cap table that models a SAFE round converting into a priced seed round with an option pool, showing dilution at each step.",
      "I can explain SAFEs: post-money vs pre-money, valuation cap, discount, MFN, and how they convert — and what dilution each founder takes.",
      "I ran a co-founder trial project (YC Co-Founder Matching or my network) and we signed a written agreement: split, 4-year vesting / 1-year cliff, roles, exit terms.",
      "I had the founder-prenup conversation for real (after roleplaying it) and it covered my past co-founder failure mode explicitly.",
      "I pitched to a VC (or a VC-experienced reviewer) with a deck built on the Raskin narrative and captured the feedback.",
      "I can explain SaaS metrics (ARR, NRR, CAC, magic number, burn multiple) and Israeli fundraising norms (8200 network, serial-founder premium, local VCs).",
      "I can run a 1:1 and give feedback using Radical Candor / Manager's Path / High Output Management frames.",
    ],
    tags: ["t6", "rubric", "ready-when", "cap-table", "safes", "cofounder", "fundraising", "saas-metrics", "leadership"],
  },
  {
    id: "a-t6-selftest",
    trackId: "T6_FOUNDER",
    type: "self_test",
    title: "T6 self-test: founder mechanics",
    readyWhen: READY_WHEN.T6_FOUNDER,
    questions: [
      "Given a post-money SAFE with a valuation cap and a discount, walk through what happens at the priced round: who gets diluted and by how much?",
      "What is the standard co-founder equity split and vesting (roughly equal, 4-year vesting / 1-year cliff), and why do unequal splits and no-vesting deals fail (YC essays)?",
      "What does a co-founder trial project look like — duration, deliverable, decision criteria — and what must the written agreement cover?",
      "Define ARR, NRR, CAC payback, magic number and burn multiple, and say what 'good' looks like at seed.",
      "What is different about raising in Israel: the 8200 network, the serial-founder premium, local vs US VCs?",
      "Give the Raskin narrative for your startup in two minutes and name the first three slides of the deck.",
    ],
    criteria: [
      "I can explain how a post-money SAFE converts and who is diluted.",
      "I can explain standard co-founder splits and vesting and why the alternatives fail.",
      "I can explain what a co-founder trial project and written agreement cover.",
      "I can explain ARR, NRR, CAC payback, magic number and burn multiple at seed.",
      "I can explain how raising in Israel differs from raising in the US.",
      "I can explain my startup's Raskin narrative and the opening of the deck.",
    ],
    tags: ["t6", "self-test", "safes", "cap-table", "cofounder", "saas-metrics", "israeli-ecosystem", "narrative"],
  },
  {
    id: "a-t6-proof",
    trackId: "T6_FOUNDER",
    type: "public_proof",
    title: "T6 public proof: reviewed pitch deck",
    readyWhen: READY_WHEN.T6_FOUNDER,
    publicProof:
      "A real pitch deck reviewed against a First Round-style rubric by at least one VC or experienced founder, with the feedback incorporated; backed by a cap table + SAFE scenario and a signed co-founder trial agreement (the agreement stays private, but it exists).",
    criteria: [
      "The pitch deck exists (10–15 slides) and is built on the Raskin narrative.",
      "It was reviewed against a First Round-style rubric (problem, insight, why now, team, traction, ask) by a VC or experienced founder.",
      "The review feedback is written down and a second version of the deck incorporates it.",
      "A cap table with a SAFE-to-priced-round scenario is attached as an appendix.",
      "A co-founder trial project was completed and a written agreement (split, vesting, roles) is signed.",
    ],
    tags: ["t6", "public-proof", "fundraising", "pitch-deck", "first-round", "cofounder"],
  },

  // ============================================================== T7 Domain
  {
    id: "a-t7-rubric",
    trackId: "T7_DOMAIN",
    type: "rubric",
    title: "T7 ready-when rubric",
    readyWhen: READY_WHEN.T7_DOMAIN,
    criteria: [
      "I threat-modelled an agentic app against the OWASP Top 10 for Agentic Applications (2026), mapping each risk to a control in the app.",
      "I mapped the same app's attack paths to MITRE ATLAS tactics and techniques (re-checked against the current ATLAS version — it moves quarterly).",
      "I demonstrated an NHI/agent-auth control: short-lived SPIFFE SVIDs or OAuth 2.1 / RFC 8693 token exchange for tool calls, with least privilege and an audit log.",
      "I completed Gandalf (8 levels) plus at least one HackAPrompt or HTB AI Red Teamer challenge and can explain why each defense failed.",
      "I can explain the MCP authorization spec (OAuth 2.1 resource-server model) and where the lethal trifecta (private data + untrusted content + exfiltration path) shows up in my app.",
      "I can describe the app's risks in NIST AI RMF language (Govern / Map / Measure / Manage) for an enterprise or procurement audience.",
      "I ran an automated red-team (Promptfoo or DeepTeam) against the app and fixed what it found.",
    ],
    tags: ["t7", "rubric", "ready-when", "threat-modeling", "owasp-agentic", "mitre-atlas", "nhi", "spiffe", "oauth-oidc"],
  },
  {
    id: "a-t7-selftest",
    trackId: "T7_DOMAIN",
    type: "self_test",
    title: "T7 self-test: agent security wedge",
    readyWhen: READY_WHEN.T7_DOMAIN,
    questions: [
      "Name the OWASP Top 10 for LLM Applications (2025) from LLM01 prompt injection to LLM10 unbounded consumption, and give a concrete example for three of them.",
      "What does the OWASP Top 10 for Agentic Applications (2026) add beyond the LLM list — which risks only exist once a model can use tools and act?",
      "Explain the 'lethal trifecta' (Simon Willison) and how you would break it architecturally.",
      "How does SPIFFE/SPIRE give an agent a workload identity (SVIDs, attestation, short-lived certs, mTLS), and how does that compare with OAuth 2.1 token exchange (RFC 8693) and the MCP authorization spec?",
      "Walk an attack on an LLM-backed SOC assistant through MITRE ATLAS tactics from reconnaissance to impact.",
      "What are the four NIST AI RMF functions and how would you use them in a CISO conversation?",
      "What did XBOW and PentestGPT show about autonomous pentesting, and which parts should be treated as vendor claims rather than verified results?",
    ],
    criteria: [
      "I can explain the OWASP LLM Top 10 with concrete examples.",
      "I can explain what the OWASP Agentic Top 10 adds for tool-using agents.",
      "I can explain the lethal trifecta and how to break it architecturally.",
      "I can explain SPIFFE/SPIRE workload identity versus OAuth 2.1 token exchange and the MCP auth spec.",
      "I can explain an attack on an AI-SOC assistant in MITRE ATLAS terms.",
      "I can explain the four NIST AI RMF functions in CISO language.",
      "I can explain the state of autonomous pentesting and separate evidence from vendor claims.",
    ],
    tags: ["t7", "self-test", "prompt-injection", "owasp", "mitre-atlas", "nist-ai-rmf", "nhi", "workload-identity", "autonomous-pentest"],
  },
  {
    id: "a-t7-proof",
    trackId: "T7_DOMAIN",
    type: "public_proof",
    title: "T7 public proof: red-team write-up + secured agent",
    readyWhen: READY_WHEN.T7_DOMAIN,
    publicProof:
      "A published red-team write-up (p-redteam-writeup: Gandalf → HackAPrompt → a real OSS LLM app, mapped to MITRE ATLAS) plus a public secured-agent repo (p-secure-mcp-agent) with its controls mapped to the OWASP Agentic Top 10 and a short demo video.",
    criteria: [
      "The red-team write-up is published as a structured report mapped to MITRE ATLAS techniques.",
      "The secured-agent repo is public with a blog post mapping its controls to the OWASP Agentic Top 10 and a short demo video.",
      "An NHI/agent-auth control (SPIFFE/SPIRE or OAuth token exchange for tool auth) is demonstrable in the repo or in p-nhi-prototype.",
      "Findings were disclosed responsibly and every target was authorized (CTF, intentionally vulnerable, or permissioned).",
      "A talk on the work is submitted to BSides TLV or Cyber Week TAU (or the material is ready to submit).",
    ],
    tags: ["t7", "public-proof", "red-teaming", "mitre-atlas", "owasp-agentic", "nhi", "portfolio"],
  },

  // ================================================================ T8 Meta
  {
    id: "a-t8-rubric",
    trackId: "T8_META",
    type: "rubric",
    title: "T8 ready-when rubric",
    readyWhen: READY_WHEN.T8_META,
    criteria: [
      "I published one technical post a week (d-tech-post-week) for 8 consecutive weeks — learning in public, not collecting credentials.",
      "My PKM (Obsidian or Notion) is in daily use, notes link to resource/project IDs, and I write to think before I publish.",
      "I review my spaced-repetition deck (System Design Primer + transformer/eval concepts) at least 4 days a week.",
      "I logged 10–15 hours a week of time-boxed deliberate practice for a month alongside the day job.",
      "I joined at least one accountability cohort or community (PreSales Collective, a Maven cohort, YC Co-Founder Matching, Israeli meetups) and show up.",
      "I picked ONE path variant and treat the rest of the library as backlog — depth over breadth.",
    ],
    tags: ["t8", "rubric", "ready-when", "learning-in-public", "pkm", "spaced-repetition", "deliberate-practice", "accountability"],
  },
  {
    id: "a-t8-selftest",
    trackId: "T8_META",
    type: "self_test",
    title: "T8 self-test: the learning system",
    readyWhen: READY_WHEN.T8_META,
    questions: [
      "What does 'learn in public' (swyx) mean in practice, and what is your weekly publishing cadence and channel?",
      "How is your PKM organised — how do notes link to resources and projects, and how do you 'write to think'?",
      "How does spaced repetition (SM-2 / Anki) schedule reviews, and what belongs in a card versus a note?",
      "What is deliberate practice as opposed to consuming content, and how do you time-box 10–15 hours a week around a day job?",
      "Which cohort or community holds you accountable this quarter, and what exactly is the commitment?",
      "Which ONE path variant are you on, and why is everything else backlog?",
    ],
    criteria: [
      "I can explain learning in public and state my publishing cadence.",
      "I can explain how my PKM is organised and how I write to think.",
      "I can explain how spaced repetition schedules reviews and what makes a good card.",
      "I can explain deliberate practice and my weekly time-boxing.",
      "I can explain who holds me accountable this quarter and to what.",
      "I can explain which path variant I chose and why the rest is backlog.",
    ],
    tags: ["t8", "self-test", "learning-in-public", "pkm", "spaced-repetition", "deliberate-practice", "accountability"],
  },
  {
    id: "a-t8-proof",
    trackId: "T8_META",
    type: "public_proof",
    title: "T8 public proof: public learning log",
    readyWhen: READY_WHEN.T8_META,
    publicProof:
      "A public blog or newsletter with at least 8 weekly technical posts, each linking to a repo or artifact, plus a public learning log (or 'now' page) and a visible drill streak.",
    criteria: [
      "A public blog/newsletter has at least 8 weekly technical posts.",
      "Each post links to a repo, demo or artifact I built, not just a summary of reading.",
      "A public learning log or 'now' page states the current path variant, phase and this month's focus.",
      "An 8-week streak on d-tech-post-week (and d-paper-week) is visible in the dashboard.",
    ],
    tags: ["t8", "public-proof", "learning-in-public", "blog", "streak"],
  },
];
