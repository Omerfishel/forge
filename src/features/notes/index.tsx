import { PageHeader, Empty } from "@/components/ui";

export default function NotesPage() {
  return (
    <div data-testid="page-notes">
      <PageHeader title="Notes" sub="This view is being built." />
      <Empty>Placeholder — the notes feature will render here.</Empty>
    </div>
  );
}
