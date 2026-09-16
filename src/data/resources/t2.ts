import type { Resource } from "@/types";

// Seeded from docs/curriculum-spec.md — TRACK 2 (Backend Engineering & System Design),
// plus the T2-relevant items from the Hands-On Work, Staying-current and Certifications
// sections. The spec bundles several items (language paths, full-stack deploy targets,
// cloud/devops); those umbrella records are kept under the spec's IDs and the bundled
// pieces are split into individual records so each can be tracked and budgeted alone.
// urlVerifiedDate: DOC = the URL appears in the research doc (Sept 2026 research pass);
// SEED = checked (or attempted) at seed time. urlVerified=false means re-verify.
const DOC = "2026-09-01";
const SEED = "2026-09-16";

export const t2Resources: Resource[] = [
  // ---------------------------------------------------------------------------
  // System design canon (free primary + deep reference + paid alternative)
  // ---------------------------------------------------------------------------
  {
    id: "t2-sysdesign-primer",
    title: "The System Design Primer",
    creator: "Donne Martin",
    url: "https://github.com/donnemartin/system-design-primer",
    urlVerified: true,
    urlVerifiedDate: DOC,
    resourceType: "repo",
    format: "reading",
    cost: { model: "free" },
    estHours: 30,
    timeBucket: "30_100h",
    difficulty: "intermediate",
    prerequisites: ["Basic web/backend fundamentals (HTTP, databases, one language) — he has basic coding"],
    buildsSkill:
      "Scalable-system building blocks — load balancers, caching, CDNs, queues, replication, sharding, consistency/availability tradeoffs — plus interview-style problem walk-throughs and Anki decks to make them stick.",
    whyForHim:
      "The free primary for the T2 ready-when ('design and deploy a multi-tenant AI SaaS with sensible cost/latency tradeoffs and explain the data model'). Backend and system-design fundamentals are the skill the 5-year plan says he must close himself to be a credible product-CTO; this is the cheapest, most consensus-backed way to do it, and its Anki decks seed the spaced-repetition deck (T8). Feeds d-sysdesign-week and is the spec's prerequisite for p-fullstack-ai.",
    priority: "must_do",
    producesArtifact: false,
    trackIds: ["T2_BACKEND_SYSTEMS", "T8_META"],
    skillIds: ["system-design", "distributed-data", "spaced-repetition"],
    roleRelevance: ["Developer", "CTO", "FDE", "SE", "PM"],
    tags: ["system_design", "free_canon", "anki", "spaced_repetition", "interview_prep", "phase_2"],
    freshness: "current",
    qualitySignal:
      "368k GitHub stars (repo header, Sept 2026) — the most popular system-design learning resource on the internet; the spec's free canon for Track 2.",
    notes:
      "Includes Anki spaced-repetition decks (System Design, System Design Exercises, OO Design) — import them as the first deck in the Review view (see t8-pkm). Doc range ~20–40h. Phase 2 (months 3–12) pairs it with DDIA. Spec DAG: System Design Primer/DDIA → p-fullstack-ai. T2 self-test: 5 canonical system-design questions. Pick this OR ByteByteGo (t2-bytebytego) as the primary; this one is free.",
  },
  {
    id: "t2-ddia",
    title: "Designing Data-Intensive Applications",
    creator: "Martin Kleppmann (O'Reilly)",
    url: "https://dataintensive.net/",
    urlVerified: true,
    urlVerifiedDate: SEED,
    resourceType: "book",
    format: "book",
    cost: {
      model: "one_time",
      amount: 55,
      currency: "USD",
      note: "~$45–60 USD (print/ebook), approximate as of Sept 2026 — re-verify edition and price at purchase.",
    },
    estHours: 50,
    timeBucket: "30_100h",
    difficulty: "advanced",
    prerequisites: ["t2-sysdesign-primer"],
    buildsSkill:
      "Deep understanding of distributed data systems: storage engines, encoding, replication, partitioning, transactions, consistency and consensus, batch and stream processing — the reasoning behind every 'why that database?' answer.",
    whyForHim:
      "The deep reference that turns Primer vocabulary into CTO-grade judgment. The 5-year plan says investors expect a CTO to be the technical anchor and that he must show he 'can architect'; DDIA is the book a technical co-founder or investor will expect a product-CTO to have internalized. It also underpins the 'explain the data model' half of the T2 ready-when and the data layer of p-ai-soc-triage and p-fullstack-ai.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["distributed-data", "system-design"],
    roleRelevance: ["CTO", "Developer", "FDE"],
    tags: ["distributed_data", "book", "deep_reference", "cto_credibility", "paid", "phase_2"],
    freshness: "aging",
    qualitySignal:
      "The canonical deep reference on distributed data systems (spec: 'the deep reference'); spec priority high for CTO credibility.",
    notes:
      "A 2nd edition has been in progress — verify the current edition at purchase (the official site, checked at seed time, still lists only the current print/ebook edition; the doc's caveats flag 'DDIA 2nd edition status' for re-verification). The doc gives no URL; dataintensive.net is the author's official book site. Doc range 40–60h. Phase 2 read, alongside the Primer. Spec DAG: System Design Primer/DDIA → p-fullstack-ai.",
  },
  {
    id: "t2-bytebytego",
    title: "ByteByteGo",
    creator: "Alex Xu",
    url: "https://bytebytego.com",
    urlVerified: true,
    urlVerifiedDate: DOC,
    resourceType: "course",
    format: "self_paced",
    cost: {
      model: "subscription",
      note: "Subscription price not captured in the research doc — re-verify (flagged in the spec's caveats). Frequent 50%-off lifetime offers. Free alternative: the System Design Primer.",
      freeAlternativeId: "t2-sysdesign-primer",
    },
    timeBucket: "ongoing",
    difficulty: "intermediate",
    prerequisites: ["None — an alternative primary to t2-sysdesign-primer, not a follow-on"],
    buildsSkill:
      "Visual, interview-oriented system design: the classic scale-out problems plus ML/GenAI system design (serving, feature/vector stores, LLM app architectures).",
    whyForHim:
      "The paid, visual alternative to the Primer, worth it mainly because it now covers ML/GenAI system design — exactly the shape of the multi-tenant AI SaaS in his T2 ready-when — and because d-sysdesign-week needs a steady supply of worked problems. If he pays for anything in Track 2 this is it; otherwise the Primer covers the same ground for free.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["system-design", "distributed-data"],
    roleRelevance: ["Developer", "CTO", "FDE", "SE"],
    tags: ["system_design", "genai_system_design", "visual", "interview_prep", "subscription", "paid", "phase_2"],
    freshness: "current",
    qualitySignal:
      "Alex Xu's widely used system-design franchise (spec: 'Visual, interview-oriented, now includes ML/GenAI system design'); spec priority high.",
    notes:
      "Spec: 'pick this OR the Primer as primary; Primer is free.' Also sold as the System Design Interview Vol 1 & 2 books (t2-sdi-books). Spend discipline: the spec says stay free/OSS for Tracks 1–2 — treat this as optional spend.",
  },
  {
    id: "t2-sdi-books",
    title: "System Design Interview – An Insider's Guide (Vol 1 & 2)",
    creator: "Alex Xu",
    url: "https://bytebytego.com",
    urlVerified: true,
    urlVerifiedDate: DOC,
    resourceType: "book",
    format: "book",
    cost: {
      model: "one_time",
      note: "Book prices not captured in the research doc — re-verify. Free alternative: the System Design Primer.",
      freeAlternativeId: "t2-sysdesign-primer",
    },
    estHours: 25,
    timeBucket: "10_30h",
    difficulty: "intermediate",
    prerequisites: ["None — reads standalone; the Primer's vocabulary helps"],
    buildsSkill:
      "Step-by-step walkthroughs of canonical design problems (rate limiter, key-value store, news feed, chat, notification system, ...) in a repeatable interview framework.",
    whyForHim:
      "The offline, book form of the ByteByteGo material. Best used as a source of end-to-end problems for d-sysdesign-week and the T2 self-test (5 canonical questions); the repeatable framework doubles as the way he will whiteboard architecture in FDE/founding-SE interviews and design-partner calls.",
    priority: "optional",
    producesArtifact: false,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["system-design"],
    roleRelevance: ["Developer", "CTO", "FDE", "SE"],
    tags: ["system_design", "book", "interview_prep", "worked_problems", "paid"],
    freshness: "unknown",
    qualitySignal:
      "Bundled with ByteByteGo in the spec ('System Design Interview Vol 1 & 2 books'); same author and material as the subscription, which the spec rates high.",
    notes:
      "Split out from t2-bytebytego so the Budget view can treat the one-time books separately from the subscription. Hours are an estimate (not in the doc). Editions/prices: re-verify; the doc links only bytebytego.com.",
  },

  // ---------------------------------------------------------------------------
  // Language paths: Python (FastAPI) first, TypeScript (Node/Next.js) second
  // ---------------------------------------------------------------------------
  {
    id: "t2-ts-python",
    title: "Primary language paths: Python (FastAPI) + TypeScript (Node/Next.js)",
    creator: "Python.org + TypeScript (Microsoft) official docs",
    url: "https://docs.python.org/3/tutorial/",
    urlVerified: false,
    urlVerifiedDate: SEED,
    resourceType: "tutorial",
    format: "self_paced",
    cost: { model: "free" },
    timeBucket: "ongoing",
    difficulty: "foundational",
    prerequisites: ["Basic coding (he already has it per the 5-year plan skills inventory)"],
    buildsSkill:
      "Working fluency in the two languages every portfolio project uses: Python first (the AI ecosystem — HF, agents, evals, FastAPI backends), TypeScript second (Node/Next.js for full-stack demos and POCs).",
    whyForHim:
      "The spec's language decision for him: Python-first because the AI toolchain (Hugging Face, smolagents, DeepEval, Langfuse, MCP SDKs) is Python, and TypeScript for the demo surfaces an FDE ships in front of customers. He is 'basic coding + some frontend' today; these two paths are what turn that into 'can develop' — the gate between him and a product-CTO seat in the 5-year plan.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["backend-python", "backend-typescript"],
    roleRelevance: ["Developer", "FDE", "SE", "CTO"],
    tags: ["python", "typescript", "language_path", "free_canon", "foundations"],
    freshness: "current",
    qualitySignal:
      "Official language documentation; the spec's stated language strategy ('Python-first for AI ecosystem + TS for full-stack demos').",
    notes:
      "Umbrella record for the language decision (the doc gives no URL; the official Python tutorial and TypeScript handbook were added at seed time — not checked live). The concrete on-ramps are t2-fastapi (Python) and t2-nextjs-learn (TypeScript). Both are exercised by p-fullstack-ai (Next.js + FastAPI) and by every Track 1 project.",
    links: [{ label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/" }],
  },
  {
    id: "t2-fastapi",
    title: "FastAPI Tutorial – User Guide",
    creator: "Sebastián Ramírez (tiangolo)",
    url: "https://fastapi.tiangolo.com/tutorial/",
    urlVerified: true,
    urlVerifiedDate: SEED,
    resourceType: "tutorial",
    format: "hands_on_lab",
    cost: { model: "free" },
    estHours: 12,
    timeBucket: "10_30h",
    difficulty: "foundational",
    prerequisites: ["Python basics (see t2-ts-python)"],
    buildsSkill:
      "Building typed, async Python APIs with FastAPI: path/query/body params, Pydantic models, dependency injection, auth, background tasks, testing and auto-generated OpenAPI docs — the backend shape for every AI app he ships.",
    whyForHim:
      "FastAPI is the backend named in p-fullstack-ai and the natural host for the agent, eval-harness and AI-SOC projects (Python-first for the AI ecosystem). Its typed request/response models and built-in OpenAPI docs are also how an FDE hands a customer a usable API in a POC. Learning it first keeps everything in one language until the Next.js front end is needed.",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["backend-python"],
    roleRelevance: ["Developer", "FDE", "SE", "CTO"],
    tags: ["python", "fastapi", "api", "backend", "free_canon", "hands_on", "official_docs"],
    freshness: "current",
    qualitySignal:
      "Official, step-by-step user guide by the framework author; the spec names FastAPI as the Python path.",
    notes:
      "URL added at seed time (not in the doc); checked live on 2026-09-16. Hours are an estimate. Continue with the Advanced User Guide only as projects demand. Split out from t2-ts-python.",
  },
  {
    id: "t2-nextjs-learn",
    title: "Learn Next.js (App Router course)",
    creator: "Vercel",
    url: "https://nextjs.org/learn/dashboard-app",
    urlVerified: true,
    urlVerifiedDate: SEED,
    resourceType: "course",
    format: "hands_on_lab",
    cost: { model: "free" },
    estHours: 12,
    timeBucket: "10_30h",
    difficulty: "foundational",
    prerequisites: ["Basic React/JavaScript (he has some frontend); Node.js 20.9+"],
    buildsSkill:
      "Building a full-stack Next.js app end to end — App Router, styling, routing, data fetching, search and pagination, mutations, error handling, auth and metadata — by shipping a dashboard app.",
    whyForHim:
      "The TypeScript half of the spec's language path and the front end of p-fullstack-ai. A dashboard app is exactly the demo surface an FDE puts in front of a customer, and the course ends with something deployable on Vercel — his first end-to-end shipped artifact. It is also the tool for building his own prototypes instead of describing them (T3 prototyping).",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["backend-typescript", "fullstack"],
    roleRelevance: ["Developer", "FDE", "SE", "CTO", "PM"],
    tags: ["typescript", "nextjs", "react", "fullstack", "free_canon", "hands_on", "official_docs"],
    freshness: "current",
    qualitySignal:
      "Official Vercel course (the spec's Next.js link, nextjs.org/learn); builds a real full-stack app rather than toy examples.",
    notes:
      "The doc links https://nextjs.org/learn; the App Router course page was checked live on 2026-09-16. Hours are an estimate (the course is chaptered). Deploy the result via t2-vercel. Split out from t2-fullstack / t2-ts-python.",
  },

  // ---------------------------------------------------------------------------
  // Full-stack shipping: Next.js + deploy targets (Vercel / Fly.io / Railway)
  // ---------------------------------------------------------------------------
  {
    id: "t2-fullstack",
    title: "Ship end-to-end POCs solo: Next.js + deploy on Vercel / Fly.io / Railway",
    creator: "Vercel (Next.js) + Fly.io + Railway",
    url: "https://nextjs.org/learn",
    urlVerified: true,
    urlVerifiedDate: DOC,
    resourceType: "tutorial",
    format: "hands_on_lab",
    cost: {
      model: "freemium",
      note: "Next.js is free; Vercel / Fly.io / Railway are free/usage-based (free tiers, then pay as you go).",
    },
    estHours: 20,
    timeBucket: "10_30h",
    difficulty: "intermediate",
    prerequisites: ["t2-nextjs-learn", "t2-fastapi"],
    buildsSkill:
      "The ability to take an idea to a deployed, shareable URL alone: a Next.js front end, a FastAPI (or Node) backend, a model behind it, and a deployment on Vercel / Fly.io / Railway.",
    whyForHim:
      "'Ship end-to-end POCs solo' is the CTO credibility signal the spec attaches to p-fullstack-ai and the 5-year plan's condition for a product-oriented CTO seat ('ships real product surfaces'). It is also the FDE job in miniature: a working POC in a customer's hands beats a slide. This umbrella sequences the pieces; the deploy targets are split out so each can be ticked off separately.",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["fullstack", "backend-typescript", "backend-python"],
    roleRelevance: ["Developer", "FDE", "SE", "CTO"],
    tags: ["fullstack", "nextjs", "deployment", "vercel", "fly_io", "railway", "poc", "phase_3"],
    freshness: "current",
    qualitySignal:
      "Spec record t2-fullstack: 'Builds ability to ship end-to-end POCs solo'; all components are mainstream free/usage-based defaults.",
    notes:
      "Umbrella: do t2-nextjs-learn, then deploy with one of t2-vercel (default for Next.js), t2-fly-io (containers, closer to production shape) or t2-railway (simplest full-stack). Related project: p-fullstack-ai (Next.js + FastAPI + Ollama/vLLM or API + Vercel/Fly deploy, ~40–60h). Hours here are an estimate for the shipping practice itself, not the project.",
    links: [
      { label: "Vercel docs", url: "https://vercel.com/docs" },
      { label: "Fly.io docs", url: "https://fly.io/docs/" },
      { label: "Railway docs", url: "https://docs.railway.com/" },
    ],
  },
  {
    id: "t2-vercel",
    title: "Vercel — deploying Next.js",
    creator: "Vercel",
    url: "https://vercel.com/docs",
    urlVerified: false,
    urlVerifiedDate: SEED,
    resourceType: "tool",
    format: "tool",
    cost: {
      model: "freemium",
      note: "Free Hobby tier for personal projects, usage-based beyond it (spec: 'free/usage-based'). Re-verify current plan limits.",
    },
    estHours: 2,
    timeBucket: "2_10h",
    difficulty: "foundational",
    prerequisites: ["t2-nextjs-learn"],
    buildsSkill:
      "Git-push deployments of Next.js apps with preview URLs per branch, environment variables and serverless/edge functions.",
    whyForHim:
      "The zero-friction path from the Next.js course to a live URL he can put in a job application or a customer email. Preview deployments per branch are also the cheapest way to demo iterations to a design partner. Default deploy target for p-fullstack-ai's front end.",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["fullstack", "devops-cicd"],
    roleRelevance: ["Developer", "FDE", "SE"],
    tags: ["deployment", "vercel", "nextjs", "serverless", "freemium"],
    freshness: "current",
    qualitySignal: "First-party platform for Next.js (same company); named in the spec as a deploy target.",
    notes: "URL added at seed time (not in the doc) — not checked live; re-verify. Split out from t2-fullstack.",
  },
  {
    id: "t2-fly-io",
    title: "Fly.io — deploy containers close to users",
    creator: "Fly.io",
    url: "https://fly.io/docs/",
    urlVerified: false,
    urlVerifiedDate: SEED,
    resourceType: "tool",
    format: "tool",
    cost: {
      model: "freemium",
      note: "Usage-based (pay-as-you-go) with small free allowances; spec: 'free/usage-based'. Re-verify current pricing.",
    },
    estHours: 3,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: ["t2-docker"],
    buildsSkill:
      "Deploying a Dockerized backend (FastAPI, a model server) as micro-VMs in chosen regions, with volumes, secrets and a managed Postgres.",
    whyForHim:
      "Where the backend and model layer of p-fullstack-ai go when Vercel's serverless model does not fit (long-running FastAPI, Ollama/vLLM, WebSockets). Running a real container in a region of his choice is the closest a solo builder gets to production shape — the kind of deployment story a CTO must be able to tell.",
    priority: "optional",
    producesArtifact: true,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["fullstack", "cloud", "devops-cicd"],
    roleRelevance: ["Developer", "CTO", "FDE"],
    tags: ["deployment", "fly_io", "containers", "backend", "freemium"],
    freshness: "current",
    qualitySignal: "Named in the spec as a deploy target alongside Vercel and Railway.",
    notes:
      "URL added at seed time (not in the doc) — not checked live; re-verify. Split out from t2-fullstack. Pick one of Fly.io / Railway for the backend; both are fine.",
  },
  {
    id: "t2-railway",
    title: "Railway — one-click full-stack deploys",
    creator: "Railway",
    url: "https://docs.railway.com/",
    urlVerified: true,
    urlVerifiedDate: SEED,
    resourceType: "tool",
    format: "tool",
    cost: {
      model: "freemium",
      note: "Usage-based with a trial/free allowance; spec: 'free/usage-based'. Re-verify current pricing.",
    },
    estHours: 2,
    timeBucket: "2_10h",
    difficulty: "foundational",
    prerequisites: ["Something to deploy — the t2-fastapi or t2-nextjs-learn output"],
    buildsSkill:
      "Deploying a repo (front end + API + Postgres/Redis) from GitHub with minimal config, plus environment management and templates.",
    whyForHim:
      "The lowest-effort way to get a FastAPI + database + front end running together on a URL, which is what a POC or demo needs and nothing more. Ideal for the demo-a-week cadence (d-demo-week) when the point is the product, not the infrastructure.",
    priority: "optional",
    producesArtifact: true,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["fullstack", "devops-cicd"],
    roleRelevance: ["Developer", "FDE", "SE"],
    tags: ["deployment", "railway", "fullstack", "freemium", "low_friction"],
    freshness: "current",
    qualitySignal: "Named in the spec as a deploy target alongside Vercel and Fly.io.",
    notes: "URL added at seed time (not in the doc); checked live on 2026-09-16. Split out from t2-fullstack.",
  },

  // ---------------------------------------------------------------------------
  // Cloud & DevOps — "learn just enough to deploy and secure; depth optional"
  // ---------------------------------------------------------------------------
  {
    id: "t2-cloud-devops",
    title: "Cloud & DevOps essentials: AWS/GCP, Docker, Kubernetes, Terraform, GitHub Actions, observability",
    creator: "AWS / Google Cloud (official getting-started hubs)",
    url: "https://aws.amazon.com/getting-started/",
    urlVerified: false,
    urlVerifiedDate: SEED,
    resourceType: "tutorial",
    format: "self_paced",
    cost: {
      model: "freemium",
      note: "Learning material is free; cloud usage is pay-as-you-go (free tiers exist). Keep a spend cap on any account.",
    },
    estHours: 40,
    timeBucket: "30_100h",
    difficulty: "foundational",
    prerequisites: ["Comfort with a terminal and git"],
    buildsSkill:
      "Just enough cloud to deploy and secure what he ships: AWS/GCP core services (compute, storage, IAM, networking), containers, Kubernetes basics, infrastructure as code, CI/CD and service observability.",
    whyForHim:
      "The spec's instruction is explicit: learn just enough to deploy and secure; depth optional — deep backend/infra engineering is a co-founder skill in the 5-year plan, not his. But IAM, networking and secrets are also where his security instincts meet the platform, and Kubernetes is the substrate for the SPIFFE/SPIRE work in p-nhi-prototype. This umbrella is the checklist; the pieces are split into their own records.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["cloud", "kubernetes", "devops-cicd"],
    roleRelevance: ["Developer", "CTO", "FDE", "SE"],
    tags: ["cloud", "aws", "gcp", "devops", "iac", "cicd", "observability", "just_enough"],
    freshness: "current",
    qualitySignal:
      "Spec record t2-cloud-devops; the listed pieces are the mainstream defaults (Docker, Kubernetes, Terraform, GitHub Actions).",
    notes:
      "Umbrella (the doc gives no URL; the AWS/GCP getting-started hubs were added at seed time — not checked live). Sub-records: t2-docker → t2-kubernetes-basics, t2-terraform, t2-github-actions, t2-opentelemetry. Cloud certs (AWS/GCP) are optional per the spec — see t2-cloud-certs. The spec also flags 'curate current cloud-security CTFs at seed time — needs verification' (not seeded here). Related: p-nhi-prototype, p-fullstack-ai; Track 7 resources cite this as their 'Cloud/K8s basics' prerequisite.",
    links: [{ label: "Google Cloud — get started", url: "https://cloud.google.com/docs/get-started" }],
  },
  {
    id: "t2-docker",
    title: "Docker — Get started",
    creator: "Docker, Inc.",
    url: "https://docs.docker.com/get-started/",
    urlVerified: true,
    urlVerifiedDate: SEED,
    resourceType: "tutorial",
    format: "hands_on_lab",
    cost: { model: "free" },
    estHours: 8,
    timeBucket: "2_10h",
    difficulty: "foundational",
    prerequisites: ["Command-line basics"],
    buildsSkill:
      "Containerising a service: images, Dockerfiles, volumes, networking, multi-container apps with Compose, and publishing images — the packaging unit for every deploy target.",
    whyForHim:
      "Every deploy target beyond Vercel (Fly.io, Railway, Kubernetes) and every Track 7 lab (SPIRE, OPA, vulnerable targets for p-autonomous-pentest) assumes he can build and run a container. It is the single most reused skill in the whole cloud/devops bundle, so it comes first.",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["kubernetes", "devops-cicd"],
    roleRelevance: ["Developer", "CTO", "FDE", "SE"],
    tags: ["docker", "containers", "devops", "free_canon", "hands_on", "official_docs"],
    freshness: "current",
    qualitySignal: "Official Docker getting-started guide; the spec lists Docker in t2-cloud-devops.",
    notes:
      "URL added at seed time (not in the doc); checked live on 2026-09-16. Hours are an estimate. Prerequisite for t2-kubernetes-basics and t2-fly-io. Split out from t2-cloud-devops.",
  },
  {
    id: "t2-kubernetes-basics",
    title: "Learn Kubernetes Basics",
    creator: "The Kubernetes project (CNCF)",
    url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
    urlVerified: true,
    urlVerifiedDate: SEED,
    resourceType: "tutorial",
    format: "hands_on_lab",
    cost: { model: "free" },
    estHours: 6,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: ["t2-docker"],
    buildsSkill:
      "Working Kubernetes vocabulary and hands-on basics in six modules: create a cluster, deploy an app, explore it, expose it, scale it, update it.",
    whyForHim:
      "Kubernetes is where his wedge becomes concrete: SPIFFE/SPIRE (t7-spiffe) issues workload identities to pods, and p-nhi-prototype (SPIFFE/SPIRE, OPA, mTLS) needs a cluster to run on. He needs the basics to build and demo that, not to operate production clusters — the spec says depth is optional.",
    priority: "high",
    producesArtifact: false,
    trackIds: ["T2_BACKEND_SYSTEMS", "T7_DOMAIN"],
    skillIds: ["kubernetes", "cloud"],
    roleRelevance: ["Developer", "CTO", "FDE"],
    tags: ["kubernetes", "containers", "orchestration", "spiffe_substrate", "free_canon", "hands_on", "official_docs"],
    freshness: "current",
    qualitySignal:
      "Official Kubernetes tutorial (6 modules); the spec lists 'Kubernetes basics' in t2-cloud-devops.",
    notes:
      "URL added at seed time (not in the doc); checked live on 2026-09-16. Hours are an estimate. Track 7 resources cite 'Docker + Kubernetes basics (t2-cloud-devops level)' as a prerequisite. Split out from t2-cloud-devops.",
  },
  {
    id: "t2-terraform",
    title: "Terraform tutorials (Get Started on AWS / GCP)",
    creator: "HashiCorp",
    url: "https://developer.hashicorp.com/terraform/tutorials",
    urlVerified: true,
    urlVerifiedDate: SEED,
    resourceType: "tutorial",
    format: "hands_on_lab",
    cost: { model: "free" },
    estHours: 8,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: ["An AWS or GCP account plus the basics from t2-cloud-devops"],
    buildsSkill:
      "Infrastructure as code: declaring cloud resources in HCL, plan/apply workflows, state, variables and modules — so an environment is reproducible instead of click-built.",
    whyForHim:
      "IaC is how a POC environment gets rebuilt for the next customer and how a security-minded CTO proves what is actually deployed. Just enough Terraform to stand up p-fullstack-ai or a SPIRE test cluster repeatably is the target; the spec keeps this optional-depth.",
    priority: "optional",
    producesArtifact: true,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["cloud", "devops-cicd"],
    roleRelevance: ["Developer", "CTO"],
    tags: ["terraform", "iac", "cloud", "aws", "gcp", "free_canon", "hands_on", "official_docs"],
    freshness: "current",
    qualitySignal:
      "Official HashiCorp tutorials with Get Started tracks for AWS, GCP, Azure and Docker; the spec lists 'IaC (Terraform)' in t2-cloud-devops.",
    notes:
      "URL added at seed time (not in the doc); checked live on 2026-09-16. Hours are an estimate. A Terraform certification exists but is out of scope (artifacts > certs). Split out from t2-cloud-devops.",
  },
  {
    id: "t2-github-actions",
    title: "GitHub Actions documentation",
    creator: "GitHub",
    url: "https://docs.github.com/en/actions",
    urlVerified: true,
    urlVerifiedDate: SEED,
    resourceType: "tutorial",
    format: "self_paced",
    cost: { model: "free" },
    estHours: 4,
    timeBucket: "2_10h",
    difficulty: "foundational",
    prerequisites: ["A repo to automate — any portfolio project"],
    buildsSkill:
      "CI/CD workflows in YAML: run tests and linters on every push, gate merges, build/publish containers and deploy — including running an eval suite as a required check.",
    whyForHim:
      "The CI gate is a named component of p-eval-harness ('LLM-as-judge, CI gate'), so GitHub Actions is where AI evals become an engineering control rather than a notebook. It also makes every public repo look professional (green checks, automated deploys) — cheap credibility for the learn-in-public stream.",
    priority: "high",
    producesArtifact: true,
    trackIds: ["T2_BACKEND_SYSTEMS", "T1_AI_ML"],
    skillIds: ["devops-cicd"],
    roleRelevance: ["Developer", "CTO", "FDE"],
    tags: ["cicd", "github_actions", "automation", "eval_gate", "free_canon", "official_docs"],
    freshness: "current",
    qualitySignal: "Official GitHub documentation; the spec lists 'CI/CD (GitHub Actions)' in t2-cloud-devops.",
    notes:
      "URL added at seed time (not in the doc); checked live on 2026-09-16. Hours are an estimate. Pair with t1-deepeval / t1-promptfoo for the eval regression gate in p-eval-harness. Split out from t2-cloud-devops.",
  },
  {
    id: "t2-opentelemetry",
    title: "OpenTelemetry documentation (observability basics)",
    creator: "OpenTelemetry (CNCF)",
    url: "https://opentelemetry.io/docs/",
    urlVerified: false,
    urlVerifiedDate: SEED,
    resourceType: "tutorial",
    format: "self_paced",
    cost: { model: "free" },
    estHours: 6,
    timeBucket: "2_10h",
    difficulty: "intermediate",
    prerequisites: ["An app to instrument — the t2-fastapi or t2-nextjs-learn output"],
    buildsSkill:
      "Traces, metrics and logs as one vendor-neutral model: instrumenting a service, propagating context across calls and exporting to a backend.",
    whyForHim:
      "The 'observability' item in the spec's cloud/devops bundle, chosen as OpenTelemetry because the LLM tracing tools in Track 1 speak it (Arize Phoenix is OpenTelemetry-native). Knowing the substrate lets him put agent traces and service traces in one view — the operational half of running an AI-SOC or agent product.",
    priority: "optional",
    producesArtifact: false,
    trackIds: ["T2_BACKEND_SYSTEMS", "T1_AI_ML"],
    skillIds: ["devops-cicd", "observability"],
    roleRelevance: ["Developer", "CTO"],
    tags: ["observability", "opentelemetry", "tracing", "metrics", "free_canon", "official_docs"],
    freshness: "current",
    qualitySignal:
      "CNCF project and the vendor-neutral observability standard; the spec lists 'observability' in t2-cloud-devops and names OpenTelemetry via Arize Phoenix in Track 1.",
    notes:
      "The spec names the topic (observability), not this specific resource — chosen at seed time. URL not checked live; re-verify. Hours are an estimate. Split out from t2-cloud-devops.",
  },

  // ---------------------------------------------------------------------------
  // Certifications — honest assessment (spec): cloud certs optional, only if a role demands
  // ---------------------------------------------------------------------------
  {
    id: "t2-cloud-certs",
    title: "Cloud certifications (AWS / Google Cloud) — only if a role demands",
    creator: "AWS / Google Cloud",
    url: "https://aws.amazon.com/certification/",
    urlVerified: false,
    urlVerifiedDate: SEED,
    resourceType: "certification",
    format: "self_paced",
    cost: {
      model: "one_time",
      note: "Exam fees not captured in the research doc — re-verify before registering.",
    },
    estHours: 40,
    timeBucket: "30_100h",
    difficulty: "intermediate",
    prerequisites: ["t2-cloud-devops"],
    buildsSkill:
      "A structured sweep of one cloud provider's core services (compute, storage, networking, IAM, security) with an exam credential at the end.",
    whyForHim:
      "The spec's honest assessment: cloud certs are optional, only if a role demands one — his ROI is in shipped artifacts, not exams (the same verdict that skips CISSP/OSCP). Keep this in the backlog and pull it forward only if a specific target employer lists it; the syllabus can still serve as a checklist for t2-cloud-devops without sitting the exam.",
    priority: "skip_unless_relevant",
    producesArtifact: false,
    trackIds: ["T2_BACKEND_SYSTEMS"],
    skillIds: ["cloud"],
    roleRelevance: ["Developer", "FDE", "SE"],
    tags: ["certification", "aws", "gcp", "cloud", "low_roi", "backlog"],
    freshness: "unknown",
    qualitySignal:
      "Spec (Certifications — honest assessment): 'Cloud certs (AWS/GCP): optional, only if a role demands.' Net: certifications are LOW value; artifacts > certs.",
    notes:
      "URLs added at seed time (not in the doc) — not checked live. Hours are an estimate for a foundational/associate-level exam. The spec's caveat: if a specific target employer requires a certification, override the de-emphasis.",
    links: [{ label: "Google Cloud certifications", url: "https://cloud.google.com/learn/certification" }],
  },
];
