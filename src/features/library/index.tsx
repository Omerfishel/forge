import { PageHeader, Empty } from "@/components/ui";

export default function LibraryPage() {
  return (
    <div data-testid="page-library">
      <PageHeader title="Library" sub="This view is being built." />
      <Empty>Placeholder — the library feature will render here.</Empty>
    </div>
  );
}
