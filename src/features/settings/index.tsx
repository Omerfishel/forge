import { PageHeader, Empty } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div data-testid="page-settings">
      <PageHeader title="Settings" sub="This view is being built." />
      <Empty>Placeholder — the settings feature will render here.</Empty>
    </div>
  );
}
