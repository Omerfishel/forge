import { PageHeader, Empty } from "@/components/ui";

export default function ReviewPage() {
  return (
    <div data-testid="page-review">
      <PageHeader title="Review" sub="This view is being built." />
      <Empty>Placeholder — the review feature will render here.</Empty>
    </div>
  );
}
