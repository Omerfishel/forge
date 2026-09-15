import { PageHeader, Empty } from "@/components/ui";

export default function BudgetPage() {
  return (
    <div data-testid="page-budget">
      <PageHeader title="Budget" sub="This view is being built." />
      <Empty>Placeholder — the budget feature will render here.</Empty>
    </div>
  );
}
