import { PageHeader, Empty } from "@/components/ui";

export default function FreshnessPage() {
  return (
    <div data-testid="page-freshness">
      <PageHeader title="Freshness" sub="This view is being built." />
      <Empty>Placeholder — the freshness feature will render here.</Empty>
    </div>
  );
}
