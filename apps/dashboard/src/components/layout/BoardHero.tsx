"use client";

import { Plus } from "lucide-react";
import type { TaskCardData } from "@/components/kanban/types";
import { getDueUrgency } from "@/lib/due-date";

interface BoardHeroProps {
  guildName: string;
  tasks: TaskCardData[];
  onNewTask: () => void;
}

export function BoardHero({ guildName, tasks, onNewTask }: BoardHeroProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const overdue = tasks.filter((t) => getDueUrgency(t.dueDate, t.status) === "overdue").length;
  const completion = total === 0 ? 0 : Math.round((done / total) * 100);

  const urgent = tasks
    .filter((t) => t.status !== "DONE" && t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 2);

  return (
    <div className="grid grid-cols-[1fr_260px] gap-3 p-6 pb-4">
      {/* Main banner */}
      <div className="relative overflow-hidden rounded-sm border border-steam-surface bg-gradient-to-br from-steam-card via-steam-card to-steam-surface p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(135deg, #66c0f4 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <p className="steam-meta text-steam-accent">Active Board</p>
            <h1 className="mt-1 text-2xl font-semibold text-steam-text">{guildName}</h1>
            <p className="mt-2 max-w-md text-sm text-steam-text/50">{total === 0 ? "No tasks yet — create one to get the board moving." : `${done} of ${total} tasks complete${overdue > 0 ? ` · ${overdue} overdue` : ""}.`}</p>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-40 overflow-hidden rounded-sm bg-steam-surface">
                <div className="h-full bg-steam-success transition-all" style={{ width: `${completion}%` }} />
              </div>
              <span className="steam-meta text-steam-text/50">{completion}% DONE</span>
            </div>

            <button onClick={onNewTask} className="flex items-center gap-1.5 rounded-sm bg-steam-accent px-4 py-2 text-sm font-medium text-steam-bg transition-opacity hover:opacity-90">
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Side preview stack — most urgent upcoming tasks */}
      <div className="flex flex-col gap-3">
        {urgent.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-sm border border-dashed border-steam-surface p-4 text-center">
            <p className="steam-meta text-steam-text/30">No upcoming deadlines</p>
          </div>
        )}
        {urgent.map((task) => (
          <div key={task.id} className="flex-1 rounded-sm border border-steam-surface bg-steam-card p-3 transition-colors hover:border-steam-accent/40">
            <p className="steam-meta text-steam-warning">Due Soon</p>
            <p className="mt-1 line-clamp-2 text-sm text-steam-text">{task.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
