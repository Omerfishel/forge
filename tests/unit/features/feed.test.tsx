import { screen, waitFor } from "@testing-library/react";
import { renderPage, resetStore } from "../renderPage";
import { useForge } from "@/store";
import { resetFeedCache } from "@/lib/feed";
import FeedPage from "@/features/feed";
import { Rail } from "@/components/layout/Rail";

const now = Date.now();
const payload = {
  updated: new Date(now - 3600e3).toISOString(),
  count: 3, days: 2,
  sources: [{ name: "Src A", site: "https://a.example", category: "Cyber", ok: true }, { name: "Src B", site: "https://b.example", category: "AI & ML", ok: false }],
  items: [
    { id: "f1", title: "Agent identity is the new perimeter", url: "https://a.example/1", source: "Src A", category: "AI security", date: new Date(now - 2 * 3600e3).toISOString(), summary: "Why NHI matters.", score: 50, top: true },
    { id: "f2", title: "A model release", url: "https://b.example/2", source: "Src B", category: "AI & ML", date: new Date(now - 5 * 3600e3).toISOString(), summary: "", score: 20, top: false },
    { id: "f3", title: "Yesterday's exploit", url: "https://a.example/3", source: "Src A", category: "Cyber", date: new Date(now - 30 * 3600e3).toISOString(), summary: "CVE.", score: 30, top: true },
  ],
};

function mockFetch(body: unknown, status = 200) {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: status < 400, status, json: async () => body })));
}

beforeEach(() => { resetStore(); resetFeedCache(); });
afterEach(() => { vi.unstubAllGlobals(); });

describe("News view", () => {
  it("renders top picks and day groups, marks read/saved and filters", async () => {
    mockFetch(payload);
    const { user } = renderPage(<FeedPage />, { route: "/feed" });
    await waitFor(() => expect(screen.getByTestId("feed-item-f1")).toBeInTheDocument());
    expect(screen.getByTestId("feed-top")).toHaveTextContent("Agent identity");
    expect(screen.getByTestId("feed-count")).toHaveTextContent("3 shown · 3 unread");
    expect(useForge.getState().feed.seenAt).toBeTruthy();
    await user.click(screen.getByTestId("feed-read-f1"));
    expect(useForge.getState().feed.read.f1).toBe(true);
    expect(screen.getByTestId("feed-item-f1")).toHaveClass("read");
    await user.click(screen.getByTestId("feed-save-f2"));
    expect(useForge.getState().feed.saved.f2).toBe(true);
    await user.click(screen.getByTestId("feed-cat-saved"));
    expect(screen.queryByTestId("feed-item-f1")).not.toBeInTheDocument();
    expect(screen.getByTestId("feed-item-f2")).toBeInTheDocument();
    await user.click(screen.getByTestId("feed-cat-all"));
    await user.click(screen.getByTestId("feed-unread"));
    expect(screen.queryByTestId("feed-item-f1")).not.toBeInTheDocument();
    expect(screen.getByTestId("feed-item-f3")).toBeInTheDocument();
  });
  it("marks a whole day as read", async () => {
    mockFetch(payload);
    const { user } = renderPage(<FeedPage />, { route: "/feed" });
    await waitFor(() => expect(screen.getByTestId("feed-item-f1")).toBeInTheDocument());
    const dayButtons = screen.getAllByRole("button", { name: /mark day as read/ });
    await user.click(dayButtons[0]);
    const read = useForge.getState().feed.read;
    expect(read.f1 && read.f2).toBe(true);
    expect(read.f3).toBeUndefined();
  });
  it("shows the not-published state on 404", async () => {
    mockFetch({}, 404);
    renderPage(<FeedPage />, { route: "/feed" });
    await waitFor(() => expect(screen.getByTestId("page-feed")).toHaveTextContent("hasn't been published yet"));
  });
});

describe("Rail radar", () => {
  it("lists unread top picks and marks one read", async () => {
    mockFetch(payload);
    const { user } = renderPage(<Rail />, { route: "/today" });
    await waitFor(() => expect(screen.getByTestId("radar-f1")).toBeInTheDocument());
    expect(screen.getByTestId("radar-f3")).toBeInTheDocument();
    await user.click(screen.getByTestId("radar-read-f1"));
    expect(useForge.getState().feed.read.f1).toBe(true);
    await waitFor(() => expect(screen.queryByTestId("radar-f1")).not.toBeInTheDocument());
  });
});
