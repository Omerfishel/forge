import { PageHeader, Empty } from "@/components/ui";

export default function DashboardPage() {
  return (
    <div data-testid="page-dashboard">
      <PageHeader title="Dashboard" sub="This view is being built." />
      <Empty>Placeholder — the dashboard feature will render here.</Empty>
    </div>
  );
}
