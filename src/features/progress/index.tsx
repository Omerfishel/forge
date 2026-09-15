import { PageHeader, Empty } from "@/components/ui";

export default function ProgressPage() {
  return (
    <div data-testid="page-progress">
      <PageHeader title="Progress" sub="This view is being built." />
      <Empty>Placeholder — the progress feature will render here.</Empty>
    </div>
  );
}
