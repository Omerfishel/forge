import { PageHeader, Empty } from "@/components/ui";

export default function ProjectsPage() {
  return (
    <div data-testid="page-projects">
      <PageHeader title="Projects" sub="This view is being built." />
      <Empty>Placeholder — the projects feature will render here.</Empty>
    </div>
  );
}
