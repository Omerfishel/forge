// Tag taxonomy — one Tag per entry in the spec's "Taxonomy of Tags/Enums".
// IDs are the spec's strings verbatim (underscore taxonomy for skill areas; the
// enum values themselves for role/difficulty/cost/time/priority) so a resource
// can be matched to a tag by comparing ids directly. The spec's "Skill areas
// (domain tags)" list is split: general skill areas → "skill", the Track 7
// security-domain areas → "domain".
import type { Tag } from "@/types";

export const tags: Tag[] = [
  // ------------------------------------------------ skill areas (AI/ML)
  { id: "transformers", label: "Transformers", category: "skill" },
  { id: "tokenization", label: "Tokenization", category: "skill" },
  { id: "rag", label: "RAG", category: "skill" },
  { id: "embeddings", label: "Embeddings", category: "skill" },
  { id: "agents", label: "Agents", category: "skill" },
  { id: "mcp", label: "MCP", category: "skill" },
  { id: "evals", label: "Evals", category: "skill" },
  { id: "observability", label: "Observability", category: "skill" },
  { id: "finetuning", label: "Fine-tuning", category: "skill" },
  { id: "lora", label: "LoRA", category: "skill" },
  { id: "dpo", label: "DPO", category: "skill" },
  { id: "grpo", label: "GRPO", category: "skill" },
  { id: "rlhf", label: "RLHF", category: "skill" },
  { id: "inference", label: "Inference", category: "skill" },
  { id: "serving", label: "Serving", category: "skill" },
  { id: "quantization", label: "Quantization", category: "skill" },

  // ------------------------------------------------ skill areas (backend)
  { id: "system_design", label: "System design", category: "skill" },
  { id: "distributed_data", label: "Distributed data", category: "skill" },
  { id: "cloud", label: "Cloud", category: "skill" },
  { id: "kubernetes", label: "Kubernetes", category: "skill" },

  // ------------------------------------------------ domain areas (security wedge)
  { id: "appsec", label: "AppSec", category: "domain" },
  { id: "nhi", label: "Non-human identity", category: "domain" },
  { id: "workload_identity", label: "Workload identity", category: "domain" },
  { id: "spiffe", label: "SPIFFE/SPIRE", category: "domain" },
  { id: "oauth_oidc", label: "OAuth / OIDC", category: "domain" },
  { id: "zero_trust", label: "Zero trust", category: "domain" },
  { id: "ai_soc", label: "AI SOC", category: "domain" },
  { id: "autonomous_pentest", label: "Autonomous pentest", category: "domain" },
  { id: "prompt_injection", label: "Prompt injection", category: "domain" },
  { id: "red_teaming", label: "Red teaming", category: "domain" },
  { id: "ot_ics", label: "OT / ICS", category: "domain" },
  { id: "defense_tech", label: "Defense tech", category: "domain" },

  // ------------------------------------------------ skill areas (product)
  { id: "discovery", label: "Discovery", category: "skill" },
  { id: "jtbd", label: "Jobs to be done", category: "skill" },
  { id: "prd", label: "PRD", category: "skill" },
  { id: "metrics", label: "Metrics", category: "skill" },
  { id: "ab_testing", label: "A/B testing", category: "skill" },
  { id: "b2b_pm", label: "B2B PM", category: "skill" },
  { id: "ai_pm", label: "AI PM", category: "skill" },

  // ------------------------------------------------ skill areas (sales / GTM)
  { id: "positioning", label: "Positioning", category: "skill" },
  { id: "founder_led_sales", label: "Founder-led sales", category: "skill" },
  { id: "meddic", label: "MEDDIC", category: "skill" },
  { id: "negotiation", label: "Negotiation", category: "skill" },

  // ------------------------------------------------ skill areas (founder)
  { id: "fundraising", label: "Fundraising", category: "skill" },
  { id: "safes", label: "SAFEs", category: "skill" },
  { id: "cap_table", label: "Cap table", category: "skill" },
  { id: "cofounder", label: "Co-founder", category: "skill" },
  { id: "hiring", label: "Hiring", category: "skill" },
  { id: "leadership", label: "Leadership", category: "skill" },
  { id: "narrative", label: "Narrative", category: "skill" },

  // ------------------------------------------------ skill areas (meta)
  { id: "pkm", label: "PKM", category: "skill" },
  { id: "learning_in_public", label: "Learning in public", category: "skill" },

  // ------------------------------------------------ role relevance
  { id: "PM", label: "PM", category: "role" },
  { id: "FDE", label: "FDE", category: "role" },
  { id: "SE", label: "SE", category: "role" },
  { id: "Developer", label: "Developer", category: "role" },
  { id: "CTO", label: "CTO", category: "role" },
  { id: "CEO", label: "CEO", category: "role" },

  // ------------------------------------------------ difficulty
  { id: "foundational", label: "Foundational", category: "difficulty" },
  { id: "intermediate", label: "Intermediate", category: "difficulty" },
  { id: "advanced", label: "Advanced", category: "difficulty" },

  // ------------------------------------------------ cost
  { id: "free", label: "Free", category: "cost" },
  { id: "one_time", label: "One-time", category: "cost" },
  { id: "subscription", label: "Subscription", category: "cost" },
  { id: "freemium", label: "Freemium", category: "cost" },

  // ------------------------------------------------ time buckets
  { id: "lt_2h", label: "< 2h", category: "time" },
  { id: "2_10h", label: "2–10h", category: "time" },
  { id: "10_30h", label: "10–30h", category: "time" },
  { id: "30_100h", label: "30–100h", category: "time" },
  { id: "gt_100h", label: "100h+", category: "time" },
  { id: "ongoing", label: "Ongoing", category: "time" },

  // ------------------------------------------------ priority
  { id: "must_do", label: "Must do", category: "priority" },
  { id: "high", label: "High", category: "priority" },
  { id: "optional", label: "Optional", category: "priority" },
  { id: "skip_unless_relevant", label: "Skip unless relevant", category: "priority" },
];
