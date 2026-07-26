"use client";

import clsx from "clsx";

export interface FilterAssignee {
  id: string;
  username: string;
}

interface FilterPillsProps {
  assignees: FilterAssignee[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function FilterPills({ assignees, selected, onSelect }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-2 px-6 pb-4">
      <span className="steam-meta mr-1 text-steam-text/30">FILTER BY</span>
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          "steam-meta rounded-sm border px-3 py-1.5 transition-colors",
          selected === null
            ? "border-steam-accent bg-steam-accent/10 text-steam-accent"
            : "border-steam-surface text-steam-text/50 hover:border-steam-text/30 hover:text-steam-text"
        )}
      >
        All
      </button>
      {assignees.map((a) => (
        <button
          key={a.id}
          onClick={() => onSelect(a.id)}
          className={clsx(
            "steam-meta rounded-sm border px-3 py-1.5 transition-colors",
            selected === a.id
              ? "border-steam-accent bg-steam-accent/10 text-steam-accent"
              : "border-steam-surface text-steam-text/50 hover:border-steam-text/30 hover:text-steam-text"
          )}
        >
          {a.username}
        </button>
      ))}
    </div>
  );
}
