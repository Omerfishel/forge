import { PageHeader, Empty } from "@/components/ui";

export default function CompassPage() {
  return (
    <div data-testid="page-compass">
      <PageHeader title="Compass" sub="This view is being built." />
      <Empty>Placeholder — the compass feature will render here.</Empty>
    </div>
  );
}
