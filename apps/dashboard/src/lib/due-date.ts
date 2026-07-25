export type DueUrgency = "none" | "onTrack" | "dueSoon" | "overdue";

const DUE_SOON_WINDOW_MS = 1000 * 60 * 60 * 24 * 2; // 2 days

/**
 * Maps a task's dueDate + status to the Steam status palette:
 * success (#a3e035) / warning (#feab2d) / alert (#f04747) — design.md.
 */
export function getDueUrgency(
  dueDate: string | null,
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"
): DueUrgency {
  if (!dueDate) return "none";
  if (status === "DONE") return "onTrack";

  const due = new Date(dueDate).getTime();
  const now = Date.now();

  if (due < now) return "overdue";
  if (due - now <= DUE_SOON_WINDOW_MS) return "dueSoon";
  return "onTrack";
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return "NO DEADLINE";
  return new Date(dueDate)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    .toUpperCase();
}
