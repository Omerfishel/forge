import type { Milestone } from "@/types";

// Milestones per path/phase. Criteria come from the spec's "Milestone:" sentences.
export const milestones: Milestone[] = [
  // ---- Primary: "Product-CTO in 18 months" --------------------------------
  {
    id: "m-primary-1",
    pathId: "path-primary",
    phase: 1,
    title: "Phase 1 exit · credibility kit",
    targetWeek: 13,
    criteria: "2 published projects (secured MCP agent + red-team write-up), a demo reel, and FDE / founding-SE applications out.",
    dependsOn: ["p-secure-mcp-agent", "p-redteam-writeup"],
  },
  {
    id: "m-primary-2",
    pathId: "path-primary",
    phase: 2,
    title: "Phase 2 exit · shipping in the seed-stage job",
    targetWeek: 52,
    criteria: "Shipping real FDE/PM work, p-nhi-prototype started, and a recognized public post or two.",
    dependsOn: ["p-eval-harness", "p-ai-soc-triage"],
  },
  {
    id: "m-primary-3",
    pathId: "path-primary",
    phase: 3,
    title: "Phase 3 exit · pre-founding checklist",
    targetWeek: 78,
    criteria: "A co-founder trial completed with a written agreement, a positioning + pitch deck, and a domain reputation.",
    dependsOn: ["p-fullstack-ai", "p-finetune-security", "t6-yc-cofounder"],
  },

  // ---- Variant A: "Fast credibility for an FDE role in 90 days" ----------
  {
    id: "m-a-1",
    pathId: "path-variant-a",
    phase: 1,
    title: "90-day exit · 2 repos + demo reel",
    targetWeek: 13,
    criteria: "2 shippable repos, a recorded demo reel, and FDE / founding-SE applications out.",
    dependsOn: ["p-secure-mcp-agent", "p-eval-harness"],
  },

  // ---- Variant B: "Deep domain expert in agent security" -----------------
  {
    id: "m-b-1",
    pathId: "path-variant-b",
    phase: 1,
    title: "Frameworks internalised · first write-up",
    targetWeek: 13,
    criteria: "OWASP LLM/Agentic + MITRE ATLAS + NIST AI RMF read; Gandalf → HackAPrompt → HTB done; red-team write-up published mapped to ATLAS.",
    dependsOn: ["p-redteam-writeup"],
  },
  {
    id: "m-b-2",
    pathId: "path-variant-b",
    phase: 2,
    title: "NHI prototype public",
    targetWeek: 30,
    criteria: "Secured MCP agent + NHI/agent-permissions prototype published (SPIFFE/SPIRE, least privilege, audited tool calls).",
    dependsOn: ["p-nhi-prototype"],
  },
  {
    id: "m-b-3",
    pathId: "path-variant-b",
    phase: 3,
    title: "Recognized body of work",
    targetWeek: 43,
    criteria: "Autonomous-pentest benchmark write-up published and a talk proposal submitted to BSides TLV / Cyber Week.",
    dependsOn: ["p-autonomous-pentest"],
  },

  // ---- Variant C: "Minimum viable founder skills" ------------------------
  {
    id: "m-c-1",
    pathId: "path-variant-c",
    phase: 1,
    title: "Positioning + narrative",
    targetWeek: 13,
    criteria: "Positioning canvas done (Dunford) and a Raskin-style 5-part narrative pitch recorded and self-reviewed.",
    dependsOn: ["t5-obviously-awesome", "t6-andy-raskin"],
  },
  {
    id: "m-c-2",
    pathId: "path-variant-c",
    phase: 2,
    title: "Co-founder search structured",
    targetWeek: 26,
    criteria: "Co-founder search underway with a structured trial project + written agreement (vesting/cliff), and a pitch deck.",
    dependsOn: ["t6-yc-cofounder"],
  },
];
