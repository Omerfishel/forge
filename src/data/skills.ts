// Canonical skills — one record per skill id referenced by tracks and resources.
// IDs are the hyphenated canonical set (docs/curriculum-spec.md taxonomy, kebab-cased).
// Optional parentSkillId groups sub-skills under their umbrella skill.
import type { Skill } from "@/types";

export const skills: Skill[] = [
  // ---------------------------------------------------------------- T1 AI/ML
  {
    id: "transformers",
    trackId: "T1_AI_ML",
    name: "Transformer architecture",
    description:
      "Attention, transformer blocks and building a GPT from scratch (nanoGPT/micrograd/makemore). Enough intuition to explain attention and the KV cache to a peer.",
  },
  {
    id: "tokenization",
    trackId: "T1_AI_ML",
    name: "Tokenization",
    description:
      "How text becomes tokens (BPE and friends), why tokenizers shape model behaviour, and building a tokenizer yourself.",
    parentSkillId: "transformers",
  },
  {
    id: "rag",
    trackId: "T1_AI_ML",
    name: "Retrieval-augmented generation",
    description:
      "Grounding LLM outputs in retrieved documents, including agentic RAG patterns (LlamaIndex) and RAG over detection docs for the AI-SOC project.",
  },
  {
    id: "embeddings",
    trackId: "T1_AI_ML",
    name: "Embeddings & vector retrieval",
    description:
      "Embedding models, similarity search and vector stores as the retrieval layer under RAG and memory systems.",
    parentSkillId: "rag",
  },
  {
    id: "agents",
    trackId: "T1_AI_ML",
    name: "Agent frameworks",
    description:
      "Tool-using LLM agents with smolagents, LangGraph and LlamaIndex: function calling, planning loops, agent memory and agentic RAG.",
  },
  {
    id: "mcp",
    trackId: "T1_AI_ML",
    name: "Model Context Protocol (MCP)",
    description:
      "Building and wiring MCP servers/tools into agents, plus the MCP authorization spec (OAuth 2.1 resource-server model) that makes agent tool access securable.",
    parentSkillId: "agents",
  },
  {
    id: "evals",
    trackId: "T1_AI_ML",
    name: "AI evals",
    description:
      "Error analysis, LLM-as-judge, CI regression gates and red-team evals for LLM apps — both an AI-engineering skill and product work (the #1 FDE/AI-PM skill).",
  },
  {
    id: "observability",
    trackId: "T1_AI_ML",
    name: "LLM observability & tracing",
    description:
      "Tracing, logging and monitoring LLM/agent apps with Langfuse, Arize Phoenix (OpenTelemetry-native), Braintrust or LangSmith.",
    parentSkillId: "evals",
  },
  {
    id: "finetuning",
    trackId: "T1_AI_ML",
    name: "Fine-tuning (SFT)",
    description:
      "Supervised fine-tuning of open models with Hugging Face Trainer/TRL, and knowing when fine-tuning beats prompting or RAG.",
  },
  {
    id: "lora",
    trackId: "T1_AI_ML",
    name: "LoRA / QLoRA",
    description:
      "Parameter-efficient fine-tuning with LoRA, QLoRA and Unsloth so a small model can be adapted to a security task on modest hardware.",
    parentSkillId: "finetuning",
  },
  {
    id: "dpo",
    trackId: "T1_AI_ML",
    name: "DPO preference alignment",
    description:
      "Direct Preference Optimization as the practical preference-alignment recipe (smol-course/TRL), and how it differs from RLHF.",
    parentSkillId: "finetuning",
  },
  {
    id: "grpo",
    trackId: "T1_AI_ML",
    name: "GRPO",
    description:
      "Group Relative Policy Optimization — the DeepSeek R1 reasoning recipe as taught in the Hugging Face LLM Course.",
    parentSkillId: "finetuning",
  },
  {
    id: "rlhf",
    trackId: "T1_AI_ML",
    name: "RLHF",
    description:
      "Reinforcement learning from human feedback: reward models and policy optimization, mainly to explain DPO vs RLHF tradeoffs credibly.",
    parentSkillId: "finetuning",
  },
  {
    id: "inference",
    trackId: "T1_AI_ML",
    name: "Inference internals",
    description:
      "KV cache, batching, latency/throughput and cost tradeoffs of running LLMs — learned by doing with Ollama and vLLM.",
  },
  {
    id: "serving",
    trackId: "T1_AI_ML",
    name: "Model serving",
    description:
      "Running and serving open models locally or on a server with Ollama and vLLM, or calling hosted APIs, as the model layer of a shipped product.",
    parentSkillId: "inference",
  },
  {
    id: "quantization",
    trackId: "T1_AI_ML",
    name: "Quantization",
    description:
      "Reducing model precision to fit memory and speed budgets, and understanding what it costs in quality.",
    parentSkillId: "inference",
  },
  {
    id: "ai-coding-tools",
    trackId: "T1_AI_ML",
    name: "Agentic coding tools",
    description:
      "Claude Code and Cursor mastery: spec-driven development (CLAUDE.md/AGENTS.md, plan mode, hooks). A force multiplier because he will build everything with AI assistance.",
  },

  // ------------------------------------------------------- T2 Backend/Systems
  {
    id: "system-design",
    trackId: "T2_BACKEND_SYSTEMS",
    name: "System design",
    description:
      "Designing scalable services end-to-end (System Design Primer / ByteByteGo): load balancing, caching, queues, data partitioning, ML/GenAI system design.",
  },
  {
    id: "distributed-data",
    trackId: "T2_BACKEND_SYSTEMS",
    name: "Distributed data systems",
    description:
      "Storage engines, replication, partitioning, consistency and stream processing as taught in Designing Data-Intensive Applications.",
    parentSkillId: "system-design",
  },
  {
    id: "cloud",
    trackId: "T2_BACKEND_SYSTEMS",
    name: "Cloud essentials",
    description:
      "AWS/GCP essentials and IaC (Terraform) — just enough to deploy and secure a product; depth optional.",
  },
  {
    id: "kubernetes",
    trackId: "T2_BACKEND_SYSTEMS",
    name: "Docker & Kubernetes basics",
    description:
      "Containerising services and running them on Kubernetes at a working level; also the substrate for SPIFFE/SPIRE workload identity.",
    parentSkillId: "cloud",
  },
  {
    id: "backend-python",
    trackId: "T2_BACKEND_SYSTEMS",
    name: "Backend Python (FastAPI)",
    description:
      "Python-first backend development with FastAPI, the primary language path because of the AI ecosystem.",
  },
  {
    id: "backend-typescript",
    trackId: "T2_BACKEND_SYSTEMS",
    name: "Backend TypeScript (Node/Next.js)",
    description:
      "TypeScript on Node/Next.js as the second language path, for full-stack demos and POCs.",
  },
  {
    id: "fullstack",
    trackId: "T2_BACKEND_SYSTEMS",
    name: "Full-stack shipping",
    description:
      "Shipping an end-to-end product solo with Next.js plus a backend and a model, deployed on Vercel / Fly.io / Railway.",
  },
  {
    id: "devops-cicd",
    trackId: "T2_BACKEND_SYSTEMS",
    name: "DevOps, CI/CD & observability",
    description:
      "GitHub Actions pipelines, deployment automation and service observability — the minimum to run what he ships.",
  },

  // --------------------------------------------------------------- T3 Product
  {
    id: "discovery",
    trackId: "T3_PRODUCT",
    name: "Customer discovery",
    description:
      "Mom-Test-style customer interviews and continuous discovery habits (Teresa Torres): interviewing without lying to yourself, opportunity solution trees.",
  },
  {
    id: "jtbd",
    trackId: "T3_PRODUCT",
    name: "Jobs to be done",
    description:
      "Framing customer needs as jobs, outcomes and opportunities rather than feature requests; feeds the opportunity solution tree.",
    parentSkillId: "discovery",
  },
  {
    id: "prd",
    trackId: "T3_PRODUCT",
    name: "PRD & spec writing",
    description:
      "Writing a crisp PRD/spec — problem, scope, success metrics, eval plan — and rewriting real products' specs as practice.",
  },
  {
    id: "metrics",
    trackId: "T3_PRODUCT",
    name: "Product metrics",
    description:
      "Defining a north-star metric and the input metrics around it, including an eval plan for an AI feature.",
  },
  {
    id: "ab-testing",
    trackId: "T3_PRODUCT",
    name: "Experimentation / A-B testing",
    description:
      "Running and reading experiments honestly: hypotheses, guardrail metrics, statistical sanity.",
    parentSkillId: "metrics",
  },
  {
    id: "b2b-pm",
    trackId: "T3_PRODUCT",
    name: "B2B product management",
    description:
      "Empowered-team product craft for B2B (INSPIRED/SVPG, Escaping the Build Trap): outcomes over output, working with sales and customers.",
  },
  {
    id: "ai-pm",
    trackId: "T3_PRODUCT",
    name: "AI product management",
    description:
      "Taking AI features from prototype to production: evals as product work, PM–eng collaboration, building agents in Cursor (Aman Khan's AI PM Playbook).",
  },
  {
    id: "prototyping",
    trackId: "T3_PRODUCT",
    name: "Prototyping",
    description:
      "Prototyping as a non-designer with Figma, v0, Lovable and Claude artifacts to show ideas instead of describing them.",
  },

  // ---------------------------------------------------------------- T4 FDE/SE
  {
    id: "fde-playbook",
    trackId: "T4_FDE_SE",
    name: "FDE playbook",
    description:
      "How forward-deployed engineering works (Palantir origin → OpenAI/Anthropic/Databricks/Cohere/Google Cloud) and what the role actually does week to week.",
  },
  {
    id: "technical-discovery",
    trackId: "T4_FDE_SE",
    name: "Technical discovery",
    description:
      "Conversational customer discovery from the technical side — 30–40% of an AI FDE's week — uncovering data, systems, constraints and success criteria.",
    parentSkillId: "fde-playbook",
  },
  {
    id: "demo-craft",
    trackId: "T4_FDE_SE",
    name: "Demo craft",
    description:
      "Delivering a 15-minute demo that survives objections (Great Demo!, Mastering Technical Sales, PSC Demo Days) and self-reviewing recorded demos weekly.",
  },
  {
    id: "poc-scoping",
    trackId: "T4_FDE_SE",
    name: "POC scoping",
    description:
      "Scoping a proof of concept with clear success criteria, timeline and exit criteria so it converts rather than sprawls.",
    parentSkillId: "fde-playbook",
  },
  {
    id: "objection-handling",
    trackId: "T4_FDE_SE",
    name: "Objection handling",
    description:
      "Handling technical, security and procurement objections live in demos and discovery calls; practiced via AI roleplay.",
    parentSkillId: "demo-craft",
  },
  {
    id: "customer-ontology",
    trackId: "T4_FDE_SE",
    name: "Customer-specific ontology",
    description:
      "Modelling a customer's entities, data and workflows into a customer-specific ontology — the value unlock of AI forward deployment.",
    parentSkillId: "fde-playbook",
  },

  // -------------------------------------------------------------- T5 Sales/GTM
  {
    id: "positioning",
    trackId: "T5_SALES_GTM",
    name: "Positioning",
    description:
      "April Dunford's positioning method (Obviously Awesome, Positioning Canvas): find the product's secret sauce and the market frame where it wins.",
  },
  {
    id: "founder-led-sales",
    trackId: "T5_SALES_GTM",
    name: "Founder-led sales",
    description:
      "Running the early-stage sales motion yourself (Founding Sales, Pete Kazanjy): prospecting, discovery calls, pipeline and closing without a sales team.",
  },
  {
    id: "meddic",
    trackId: "T5_SALES_GTM",
    name: "MEDDIC / MEDDPICC",
    description:
      "Enterprise deal qualification frameworks (MEDDPICC most relevant to security deals), with SPIN Selling and The Challenger Sale as selective reading.",
    parentSkillId: "founder-led-sales",
  },
  {
    id: "negotiation",
    trackId: "T5_SALES_GTM",
    name: "Negotiation",
    description:
      "Tactical empathy and principled negotiation (Never Split the Difference, Getting to Yes), drilled through biweekly AI roleplay.",
  },
  {
    id: "ciso-selling",
    trackId: "T5_SALES_GTM",
    name: "Selling to CISOs",
    description:
      "Enterprise security buying: budget cycles, procurement, champions and POCs. No canonical book — curated from CISO newsletters, practitioner blogs and his own network.",
    parentSkillId: "founder-led-sales",
  },
  {
    id: "strategic-narrative",
    trackId: "T5_SALES_GTM",
    name: "Sales pitch narrative",
    description:
      "Crafting a pitch story that stands out (Dunford's Sales Pitch eight-step structure, Raskin's shift → winners/losers → Promised Land arc) for sales calls.",
    parentSkillId: "positioning",
  },

  // ---------------------------------------------------------------- T6 Founder
  {
    id: "fundraising",
    trackId: "T6_FOUNDER",
    name: "Fundraising",
    description:
      "How seed rounds work and how to pitch a VC, via YC Startup School / YC Library, First Round Review, a16z and Sequoia content.",
  },
  {
    id: "safes",
    trackId: "T6_FOUNDER",
    name: "SAFEs",
    description:
      "SAFE mechanics — caps, discounts, post-money conversion — and how they dilute founders.",
    parentSkillId: "fundraising",
  },
  {
    id: "cap-table",
    trackId: "T6_FOUNDER",
    name: "Cap table & dilution",
    description:
      "Building a cap table and modelling dilution across rounds; curated via First Round and Carta resources.",
    parentSkillId: "fundraising",
  },
  {
    id: "cofounder",
    trackId: "T6_FOUNDER",
    name: "Co-founder selection & agreements",
    description:
      "The must-do fix for his documented failure mode: YC co-founder matching, a trial project before committing, equal-ish splits with 4-year vesting / 1-year cliff, a written founder prenup.",
  },
  {
    id: "hiring",
    trackId: "T6_FOUNDER",
    name: "Hiring",
    description:
      "Recruiting and closing early engineers and first hires, drawing on the YC Library and First Round company-building content.",
  },
  {
    id: "leadership",
    trackId: "T6_FOUNDER",
    name: "People leadership",
    description:
      "Managing and leading engineers as a CTO: The Manager's Path, High Output Management, Radical Candor; running 1:1s and giving feedback.",
  },
  {
    id: "narrative",
    trackId: "T6_FOUNDER",
    name: "Strategic narrative",
    description:
      "Andy Raskin's strategic narrative for pitching and fundraising: name a big shift → winners/losers → Promised Land → capabilities as magic gifts → evidence.",
  },
  {
    id: "saas-metrics",
    trackId: "T6_FOUNDER",
    name: "SaaS metrics & finance literacy",
    description:
      "ARR, NRR, CAC, magic number, burn multiple and how investors read them.",
  },
  {
    id: "israeli-ecosystem",
    trackId: "T6_FOUNDER",
    name: "Israeli startup ecosystem",
    description:
      "Israeli-specific fundraising norms — the 8200 network, the serial-founder premium, local VCs — plus the Tel Aviv conference and meetup circuit.",
  },

  // ---------------------------------------------------------------- T7 Domain
  {
    id: "appsec",
    trackId: "T7_DOMAIN",
    name: "Application security",
    description:
      "Web/app security fundamentals (PortSwigger Web Security Academy, DVWA) as the base layer under AI-app security and the autonomous pentest targets.",
  },
  {
    id: "nhi",
    trackId: "T7_DOMAIN",
    name: "Non-human identity (NHI)",
    description:
      "Identity, secrets and permissions for machines and agents — his sharpest wedge; the NHI vendor landscape via nhimg.org, Aembit and HashiCorp Vault.",
  },
  {
    id: "workload-identity",
    trackId: "T7_DOMAIN",
    name: "Workload identity",
    description:
      "Short-lived, attested identities for workloads and agents: SVIDs, attestation, mTLS, RFC 8693 token exchange, the IETF WIMSE working group.",
    parentSkillId: "nhi",
  },
  {
    id: "spiffe",
    trackId: "T7_DOMAIN",
    name: "SPIFFE / SPIRE",
    description:
      "The CNCF-graduated workload identity standard and runtime: issuing SVIDs to agents and enforcing least privilege with OPA and mTLS.",
    parentSkillId: "workload-identity",
  },
  {
    id: "oauth-oidc",
    trackId: "T7_DOMAIN",
    name: "OAuth 2.1 / OIDC",
    description:
      "OAuth 2.1, OIDC and token exchange as applied to agent and tool authorization, including the MCP authorization spec's resource-server model and A2A.",
    parentSkillId: "nhi",
  },
  {
    id: "zero-trust",
    trackId: "T7_DOMAIN",
    name: "Zero trust",
    description:
      "Least-privilege, continuously verified access for humans, workloads and agents; the architectural frame around NHI controls.",
  },
  {
    id: "ai-soc",
    trackId: "T7_DOMAIN",
    name: "AI-native SOC",
    description:
      "LLM-driven alert triage, enrichment and summarisation with a human in the loop; curated from vendor engineering blogs and practitioner newsletters (needs curation).",
  },
  {
    id: "autonomous-pentest",
    trackId: "T7_DOMAIN",
    name: "Autonomous pentesting / offensive AI",
    description:
      "Agents that find and exploit vulnerabilities: XBOW, PentestGPT, HPTSA, CVE-Bench, Google Big Sleep — studied as a category and reproduced against authorized targets.",
  },
  {
    id: "prompt-injection",
    trackId: "T7_DOMAIN",
    name: "Prompt injection",
    description:
      "LLM01 in the OWASP LLM Top 10 and the 'lethal trifecta' framing (Simon Willison); practiced via Gandalf, HackAPrompt and other prompt-injection ranges.",
  },
  {
    id: "red-teaming",
    trackId: "T7_DOMAIN",
    name: "AI red teaming",
    description:
      "Structured adversarial testing of LLM/agent apps (OWASP GenAI Red Teaming Guide, Promptfoo, DeepTeam, HTB AI Red Teamer) with reports mapped to MITRE ATLAS.",
  },
  {
    id: "ot-ics",
    trackId: "T7_DOMAIN",
    name: "OT/ICS & robotics security",
    description:
      "Cyber for physical AI: OT/ICS fundamentals, ROS security and the robot attack surface (Alias Robotics research). Optional depending on wedge choice.",
  },
  {
    id: "defense-tech",
    trackId: "T7_DOMAIN",
    name: "Defense tech (Israel)",
    description:
      "The fast-growing Israeli defense-tech sector (160 → 312 companies, per Startup Nation Central) and its conference circuit: Cyber Week TAU, DefenseTech Week, Cybertech.",
  },
  {
    id: "ai-governance",
    trackId: "T7_DOMAIN",
    name: "AI governance & risk frameworks",
    description:
      "NIST AI RMF 1.0 and the GenAI Profile (Govern/Map/Measure/Manage) — the procurement and enterprise language for AI risk.",
  },
  {
    id: "threat-modeling",
    trackId: "T7_DOMAIN",
    name: "Threat modeling agentic apps",
    description:
      "Threat-modelling an agentic application against the OWASP Agentic Top 10 and MITRE ATLAS (tactics, techniques, mitigations, case studies).",
  },

  // ------------------------------------------------------------------ T8 Meta
  {
    id: "pkm",
    trackId: "T8_META",
    name: "Personal knowledge management",
    description:
      "Writing to think in Obsidian or Notion: notes linked to resources and projects, captured as he learns.",
  },
  {
    id: "learning-in-public",
    trackId: "T8_META",
    name: "Learning in public",
    description:
      "swyx's 'Learn in Public' and the build-to-learn ethos: publish weekly, ship repos, let the artifacts build the reputation.",
  },
  {
    id: "deliberate-practice",
    trackId: "T8_META",
    name: "Deliberate practice & time-boxing",
    description:
      "Structured, feedback-driven practice fitted into 10–15h/week alongside a day job. Keep it lightweight; don't over-invest.",
  },
  {
    id: "spaced-repetition",
    trackId: "T8_META",
    name: "Spaced repetition",
    description:
      "Anki-style review of system-design, transformer, eval and agent-security concepts (pairs with the System Design Primer decks).",
    parentSkillId: "pkm",
  },
  {
    id: "accountability",
    trackId: "T8_META",
    name: "Accountability via cohorts & communities",
    description:
      "Using cohorts and communities — Maven cohorts, PreSales Collective, YC co-founder matching, Israeli meetups — to keep the cadence honest.",
  },
];
