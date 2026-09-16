// Budget / cost aggregation — pure.
import type { ContentBundle, CostModel, ProgressEntry, Resource } from "@/types";

export interface CostLine {
  resource: Resource;
  amountUsd: number | null;
  recurring: boolean;
  freeAlternative?: Resource;
  planned: boolean; // in progress or done
}

const FX_TO_USD: Record<string, number> = { USD: 1, EUR: 1.08, GBP: 1.27, ILS: 0.27 };

export function toUsd(amount: number | undefined, currency: string | undefined): number | null {
  if (amount === undefined || amount === null) return null;
  const fx = FX_TO_USD[(currency ?? "USD").toUpperCase()] ?? 1;
  return Math.round(amount * fx);
}

export function costLines(bundle: ContentBundle, progress: Record<string, ProgressEntry>, planned: Record<string, boolean> = {}): CostLine[] {
  return bundle.resources
    .filter((r) => r.cost.model !== "free")
    .map((r) => ({
      resource: r,
      amountUsd: toUsd(r.cost.amount, r.cost.currency),
      recurring: r.cost.model === "subscription",
      freeAlternative: r.cost.freeAlternativeId ? bundle.resources.find((x) => x.id === r.cost.freeAlternativeId) : undefined,
      planned: !!planned[r.id] || progress[r.id]?.status === "done",
    }));
}

export interface BudgetSummary {
  byModel: Record<CostModel, { count: number; usd: number }>;
  totalUsd: number;
  plannedUsd: number;
  recurringUsd: number;
  freeCount: number;
  paidCount: number;
  withFreeAlt: number;
  unpriced: number;
}

export function budgetSummary(bundle: ContentBundle, progress: Record<string, ProgressEntry>, planned: Record<string, boolean> = {}): BudgetSummary {
  const lines = costLines(bundle, progress, planned);
  const byModel: BudgetSummary["byModel"] = { free: { count: 0, usd: 0 }, one_time: { count: 0, usd: 0 }, subscription: { count: 0, usd: 0 }, freemium: { count: 0, usd: 0 } };
  let totalUsd = 0, plannedUsd = 0, recurringUsd = 0, withFreeAlt = 0, unpriced = 0;
  for (const r of bundle.resources) byModel[r.cost.model].count += 1;
  for (const l of lines) {
    if (l.freeAlternative) withFreeAlt += 1;
    if (l.amountUsd === null) { unpriced += 1; continue; }
    byModel[l.resource.cost.model].usd += l.amountUsd;
    totalUsd += l.amountUsd;
    if (l.planned) plannedUsd += l.amountUsd;
    if (l.recurring) recurringUsd += l.amountUsd;
  }
  return { byModel, totalUsd, plannedUsd, recurringUsd, freeCount: byModel.free.count, paidCount: lines.length, withFreeAlt, unpriced };
}
