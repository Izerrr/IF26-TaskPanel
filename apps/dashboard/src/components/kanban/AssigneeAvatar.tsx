import type { TaskCardData } from "./types";

interface AssigneeAvatarProps {
  assignee: TaskCardData["assignee"];
}

export function AssigneeAvatar({ assignee }: AssigneeAvatarProps) {
  if (!assignee) {
    return (
      <div
        className="h-6 w-6 rounded-sm border border-dashed border-steam-text/30"
        title="Unassigned"
      />
    );
  }

  if (assignee.avatar) {
    return (
      <img
        src={assignee.avatar}
        alt={assignee.username}
        title={assignee.username}
        className="h-6 w-6 rounded-sm border border-steam-surface object-cover"
      />
    );
  }

  return (
    <div
      title={assignee.username}
      className="flex h-6 w-6 items-center justify-center rounded-sm border border-steam-surface bg-steam-surface text-[10px] font-mono uppercase text-steam-accent"
    >
      {assignee.username.slice(0, 2)}
    </div>
  );
}
