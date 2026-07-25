import type { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import clsx from "clsx";
import { AssigneeAvatar } from "./AssigneeAvatar";
import { TaskDueBadge } from "./TaskDueBadge";
import type { TaskCardData } from "./types";

interface SteamTaskCardProps {
  task: TaskCardData;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

// Truncated task ID shown as `#TASK-XXXXXX`, uppercase font-mono per design.md.
function shortTaskId(id: string): string {
  return `#TASK-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

export function SteamTaskCard({ task, provided, snapshot }: SteamTaskCardProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={clsx(
        "group rounded-sm border border-steam-surface bg-steam-card p-3",
        "transition-colors duration-150",
        "hover:bg-steam-surface hover:border-steam-accent/50",
        snapshot.isDragging && "border-steam-accent bg-steam-surface shadow-lg shadow-black/40"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="steam-meta text-steam-accent">{shortTaskId(task.id)}</span>
        <TaskDueBadge dueDate={task.dueDate} status={task.status} />
      </div>

      <h3 className="mt-2 text-sm font-medium leading-snug text-steam-text">
        {task.title}
      </h3>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-steam-text/60">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-steam-surface pt-2">
        <span className="steam-meta text-steam-text/40">
          {task.status.replace("_", " ")}
        </span>
        <AssigneeAvatar assignee={task.assignee} />
      </div>
    </div>
  );
}
