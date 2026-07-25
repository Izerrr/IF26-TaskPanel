import clsx from "clsx";
import { formatDueDate, getDueUrgency, type DueUrgency } from "../../lib/due-date";
import type { TaskCardData } from "./types";

const URGENCY_STYLES: Record<DueUrgency, string> = {
  none: "text-steam-text/50 border-steam-text/20",
  onTrack: "text-steam-success border-steam-success/40",
  dueSoon: "text-steam-warning border-steam-warning/40",
  overdue: "text-steam-alert border-steam-alert/40",
};

interface TaskDueBadgeProps {
  dueDate: TaskCardData["dueDate"];
  status: TaskCardData["status"];
}

export function TaskDueBadge({ dueDate, status }: TaskDueBadgeProps) {
  const urgency = getDueUrgency(dueDate, status);

  return (
    <span
      className={clsx(
        "steam-meta rounded-sm border px-1.5 py-0.5",
        URGENCY_STYLES[urgency]
      )}
    >
      {formatDueDate(dueDate)}
    </span>
  );
}
