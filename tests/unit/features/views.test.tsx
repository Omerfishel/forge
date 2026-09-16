// Component-level tests for the feature views (Testing Library + real content).
import { screen, within, waitFor } from "@testing-library/react";
import { renderPage, resetStore } from "../renderPage";
import { useForge } from "@/store";
import { content } from "@/data";
import { todayKey } from "@/lib/dates";
import DashboardPage from "@/features/dashboard";
import LibraryPage from "@/features/library";
import PathsPage from "@/features/paths";
import TracksPage from "@/features/tracks";
import ProjectsPage from "@/features/projects";
import DrillsPage from "@/features/drills";
import ReviewPage from "@/features/review";
import ReadingPage from "@/features/reading";
import NotesPage from "@/features/notes";
import AssessmentsPage from "@/features/assessments";
import CompassPage from "@/features/compass";
import ProgressPage from "@/features/progress";
import BudgetPage from "@/features/budget";
import FreshnessPage from "@/features/freshness";
import SettingsPage from "@/features/settings";

beforeEach(() => resetStore());

describe("Today", () => {
  it("renders the first unblocked items and completes one", async () => {
    const { user } = renderPage(<DashboardPage />, { route: "/today" });
    expect(screen.getByTestId("week-item-t1-karpathy-zth")).toBeInTheDocument();
    expect(screen.getByTestId("queue-lesson")).toHaveTextContent("Neural Networks");
    await user.click(screen.getByTestId("week-done-t1-karpathy-zth"));
    expect(useForge.getState().progress["t1-karpathy-zth"].status).toBe("done");
    // stays visible for the session, and its dependent is now unblocked
    expect(screen.getByTestId("week-item-t1-karpathy-zth")).toHaveClass("done");
    expect(screen.getByTestId("week-item-t1-hf-llm-course")).toBeInTheDocument();
  });
  it("logs the queued drill and shows blocked items on demand", async () => {
    const { user } = renderPage(<DashboardPage />, { route: "/today" });
    await user.click(screen.getByTestId("queue-drill-log"));
    expect(useForge.getState().drillLog["d-paper-week"]).toEqual([todayKey()]);
    await user.click(screen.getByTestId("blocked-toggle-h"));
    expect(screen.getByTestId("blocked-list")).toHaveTextContent("Blocked by");
  });
});

describe("Library", () => {
  it("filters by search and chips, and expands a row with controls", async () => {
    const { user } = renderPage(<LibraryPage />, { route: "/library" });
    expect(screen.getByTestId("lib-count")).toHaveTextContent(`${content.resources.length} of ${content.resources.length}`);
    await user.type(screen.getByTestId("lib-search"), "gandalf");
    expect(screen.getByTestId("lib-count")).toHaveTextContent(/^1 of/);
    await user.click(screen.getByTestId("lib-expand-t7-gandalf"));
    expect(screen.getByTestId("lib-detail-t7-gandalf")).toHaveTextContent("Why for you");
    await user.selectOptions(screen.getByTestId("lib-status-t7-gandalf"), "skipped");
    expect(useForge.getState().progress["t7-gandalf"].status).toBe("skipped");
    await user.click(screen.getByTestId("lib-clear"));
    expect(useForge.getState().ui.libraryFilters.q).toBe("");
    await user.click(screen.getByTestId("lib-chip-track-T2_BACKEND_SYSTEMS"));
    await user.click(screen.getByTestId("lib-chip-cost-free"));
    const n = Number(screen.getByTestId("lib-count").textContent!.split(" ")[0]);
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(content.resources.length);
  });
  it("presets the search from ?q=", () => {
    renderPage(<LibraryPage />, { route: "/library?q=Founding%20Sales", path: "/library" });
    expect(screen.getByTestId("lib-search")).toHaveValue("Founding Sales");
    expect(screen.getByTestId("lib-row-t5-founding-sales")).toBeInTheDocument();
  });
});

describe("Paths & Tracks", () => {
  it("activates a variant and shows readiness badges", async () => {
    const { user } = renderPage(<PathsPage />, { route: "/paths" });
    expect(screen.getByTestId("path-item-t1-karpathy-zth")).toHaveTextContent("Ready");
    expect(screen.getByTestId("path-item-t1-hf-llm-course")).toHaveTextContent("Blocked by");
    await user.click(screen.getByTestId("path-activate-path-variant-b"));
    expect(useForge.getState().settings.activePathId).toBe("path-variant-b");
    expect(screen.getByTestId("path-plan")).toHaveTextContent("Deep domain expert");
  });
  it("track detail groups resources by priority and honours the role filter", async () => {
    const { user } = renderPage(<TracksPage />, { route: "/tracks/T7_DOMAIN", path: "/tracks/:trackId" });
    expect(screen.getByTestId("track-detail")).toBeInTheDocument();
    expect(screen.getByTestId("track-group-must_do")).toBeInTheDocument();
    await user.click(screen.getByTestId("role-chip-CEO"));
    expect(useForge.getState().settings.roleFilter).toBe("CEO");
  });
  it("unknown track shows an empty state", () => {
    renderPage(<TracksPage />, { route: "/tracks/NOPE", path: "/tracks/:trackId" });
    expect(screen.getByTestId("page-tracks")).toHaveTextContent("Unknown track");
  });
});

describe("Projects", () => {
  it("moves cards with the arrows and derives status from steps in the modal", async () => {
    const { user } = renderPage(<ProjectsPage />, { route: "/projects" });
    expect(within(screen.getByTestId("kanban-col-todo")).getAllByText(/Open/)).toHaveLength(9);
    await user.click(screen.getByTestId("kcard-move-p-eval-harness-in_progress"));
    expect(useForge.getState().progress["p-eval-harness"].status).toBe("in_progress");
    await user.click(screen.getByTestId("kcard-open-p-secure-mcp-agent"));
    expect(screen.getByTestId("proj-modal")).toBeInTheDocument();
    const steps = content.projects.find((p) => p.id === "p-secure-mcp-agent")!.steps.length;
    for (let i = 0; i < steps; i++) await user.click(screen.getByTestId(`proj-step-${i}`));
    expect(useForge.getState().progress["p-secure-mcp-agent"].status).toBe("done");
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByTestId("proj-modal")).not.toBeInTheDocument();
  });
});

describe("Drills", () => {
  it("logs, undoes and shows workout scripts", async () => {
    const { user } = renderPage(<DrillsPage />, { route: "/drills" });
    await user.click(screen.getByTestId("drill-log-d-tech-post-week"));
    expect(screen.getByTestId("drill-row-d-tech-post-week")).toHaveTextContent("Done this period");
    await user.click(screen.getByTestId("drill-undo-d-tech-post-week"));
    expect(screen.getByTestId("drill-row-d-tech-post-week")).toHaveTextContent("Due now");
    await user.click(screen.getByTestId("workout-expand-d-workout-pitch"));
    expect(screen.getByTestId("workout-script-d-workout-pitch")).toBeInTheDocument();
  });
});

describe("Review", () => {
  it("runs a session with keyboard grading and re-queues Again", async () => {
    const { user } = renderPage(<ReviewPage />, { route: "/review" });
    await user.click(screen.getByTestId("deck-chip-fde"));
    expect(screen.getByTestId("srs-progress")).toHaveTextContent("Card 1 of");
    await user.keyboard(" ");
    expect(screen.getByTestId("srs-back")).toBeInTheDocument();
    await user.keyboard("1");
    expect(screen.getByTestId("srs-progress")).toHaveTextContent("again");
    await user.click(screen.getByTestId("srs-show"));
    await user.click(screen.getByTestId("srs-grade-3"));
    expect(Object.keys(useForge.getState().srs)).toHaveLength(2);
  });
});

describe("Reading & Notes", () => {
  it("logs a paper: note + weekly drill", async () => {
    const { user } = renderPage(<ReadingPage />, { route: "/reading" });
    await user.click(screen.getByTestId("paper-log-open"));
    await user.type(screen.getByTestId("paper-title"), "HPTSA");
    await user.type(screen.getByTestId("paper-summary"), "Hierarchical planning agents exploit zero-days.");
    await user.click(screen.getByTestId("paper-save"));
    const s = useForge.getState();
    expect(s.notes[0].tags).toContain("paper");
    expect(s.drillLog["d-paper-week"]).toHaveLength(1);
    expect(screen.getByTestId("paper-tracker")).toHaveTextContent("Done this week");
  });
  it("creates and filters notes with a link", async () => {
    const { user } = renderPage(<NotesPage />, { route: "/notes" });
    await user.click(screen.getByTestId("notes-new"));
    await user.type(screen.getByTestId("note-title"), "SPIFFE idea");
    await user.type(screen.getByTestId("note-body"), "Use **SVIDs**");
    await user.type(screen.getByTestId("note-tags"), "nhi, idea");
    await user.selectOptions(screen.getByTestId("note-link"), "resource:t7-spiffe");
    await user.click(screen.getByTestId("note-save"));
    const n = useForge.getState().notes[0];
    expect(n.resourceId).toBe("t7-spiffe");
    expect(n.tags).toEqual(["nhi", "idea"]);
    expect(screen.getByTestId(`note-card-${n.id}`).querySelector(".md b")).toHaveTextContent("SVIDs");
    await user.click(screen.getByTestId("notes-tag-nhi"));
    expect(screen.getByTestId("notes-count")).toHaveTextContent("1 of 1");
  });
});

describe("Ready-when, Compass, Progress", () => {
  it("rubric criteria complete a track", async () => {
    const { user } = renderPage(<AssessmentsPage />, { route: "/assess" });
    const a = content.assessments.find((x) => x.id === "a-t1-rubric")!;
    for (let i = 0; i < a.criteria.length; i++) await user.click(screen.getByTestId(`assess-crit-a-t1-rubric-${i}`));
    expect(useForge.getState().progress["a-t1-rubric"].status).toBe("done");
    expect(screen.getByTestId("assess-summary-T1_AI_ML")).toHaveTextContent("Ready");
  });
  it("compass tabs render strategy content", async () => {
    const { user } = renderPage(<CompassPage />, { route: "/compass" });
    expect(screen.getByTestId("compass-tldr")).toBeInTheDocument();
    await user.click(screen.getByTestId("compass-tab-startups"));
    expect(screen.getByTestId("page-compass")).toHaveTextContent("Tenzai");
    await user.click(screen.getByTestId("startup-filter-watch"));
    expect(screen.getByTestId("startup-count")).toHaveTextContent(/^3 of/);
    expect(useForge.getState().ui.compassTab).toBe("startups");
  });
  it("progress unlocks badges and toasts once", async () => {
    useForge.getState().setStatus("t1-karpathy-zth", "resource", "done");
    renderPage(<ProgressPage />, { route: "/progress" });
    expect(screen.getByTestId("badge-first")).toHaveClass("got");
    await waitFor(() => expect(useForge.getState().celebrated.first).toBe(true));
    expect(screen.getByTestId("stat-done")).toHaveTextContent("1/");
  });
});

describe("Budget, Freshness, Settings", () => {
  it("budget plans a purchase", async () => {
    const { user } = renderPage(<BudgetPage />, { route: "/budget" });
    expect(screen.getByTestId("budget-planned")).toHaveTextContent("$0");
    await user.click(screen.getByTestId("budget-plan-t1-evals-course"));
    expect(useForge.getState().progress["t1-evals-course"].status).toBe("in_progress");
    expect(screen.getByTestId("budget-planned")).toHaveTextContent("4,200");
  });
  it("freshness records a check", async () => {
    const { user } = renderPage(<FreshnessPage />, { route: "/freshness" });
    await user.click(screen.getByTestId("fresh-mark-checked"));
    expect(useForge.getState().settings.freshnessCheckedAt).toBe(todayKey());
  });
  it("settings save and import rejects garbage", async () => {
    const { user } = renderPage(<SettingsPage />, { route: "/settings" });
    await user.clear(screen.getByTestId("set-hours"));
    await user.type(screen.getByTestId("set-hours"), "20");
    expect(useForge.getState().settings.hoursPerWeek).toBe(20);
    await user.selectOptions(screen.getByTestId("set-path"), "path-variant-c");
    expect(useForge.getState().settings.activePathId).toBe("path-variant-c");
    await user.type(screen.getByTestId("set-import-text"), "{{nope");
    await user.click(screen.getByTestId("set-import"));
    expect(screen.getAllByTestId("toast").pop()).toHaveTextContent("Invalid JSON");
  });
});
