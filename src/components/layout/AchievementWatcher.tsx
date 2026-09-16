// Watches the store and celebrates newly unlocked achievements once, from any
// view. Many unlocks at once (e.g. after an import) collapse into one toast.
import { useEffect, useMemo } from "react";
import { content } from "@/data";
import { useForge } from "@/store";
import { achievements } from "@/lib/achievements";
import { usePace } from "@/lib/hooks";
import { useToast } from "@/components/ui";

export function AchievementWatcher() {
  const progress = useForge((s) => s.progress);
  const completions = useForge((s) => s.completions);
  const drillLog = useForge((s) => s.drillLog);
  const pomoCount = useForge((s) => s.pomoCount);
  const notesCount = useForge((s) => s.notes.length);
  const reviewed = useForge((s) => s.srsReviewedToday);
  const celebrated = useForge((s) => s.celebrated);
  const markCelebrated = useForge((s) => s.markCelebrated);
  const pace = usePace();
  const toast = useToast();
  const srsReviewed = useMemo(() => Object.values(reviewed).reduce((a, b) => a + (Number(b) || 0), 0), [reviewed]);
  const list = useMemo(
    () => achievements({ bundle: content, progress, completions, drillLog, pomoCount, notesCount, srsReviewed, paceAhead: pace.cls === "ahead" && pace.delta >= 3 }),
    [progress, completions, drillLog, pomoCount, notesCount, srsReviewed, pace.cls, pace.delta],
  );

  useEffect(() => {
    const fresh = list.filter((a) => a.done && !celebrated[a.id]);
    if (fresh.length === 0) return;
    fresh.forEach((a) => markCelebrated(a.id));
    if (fresh.length === 1) toast(<>🏆 <b>Achievement unlocked:</b> {fresh[0].name}</>, "ok");
    else if (fresh.length <= 3) toast(<>🏆 <b>Achievements unlocked:</b> {fresh.map((a) => a.name).join(" · ")}</>, "ok");
    else toast(<>🏆 <b>{fresh.length} achievements unlocked.</b> See Progress.</>, "ok");
  }, [list, celebrated, markCelebrated, toast]);

  return null;
}
