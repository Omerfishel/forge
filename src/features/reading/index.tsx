import { PageHeader, Empty } from "@/components/ui";

export default function ReadingPage() {
  return (
    <div data-testid="page-reading">
      <PageHeader title="Reading" sub="This view is being built." />
      <Empty>Placeholder — the reading feature will render here.</Empty>
    </div>
  );
}
