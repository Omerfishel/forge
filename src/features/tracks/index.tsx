import { PageHeader, Empty } from "@/components/ui";

export default function TracksPage() {
  return (
    <div data-testid="page-tracks">
      <PageHeader title="Tracks" sub="This view is being built." />
      <Empty>Placeholder — the tracks feature will render here.</Empty>
    </div>
  );
}
