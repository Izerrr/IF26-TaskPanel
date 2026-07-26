"use client";

import { useEffect, useMemo, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { SteamKanbanColumn } from "./SteamKanbanColumn";
import { NewTaskModal } from "./NewTaskModal";
import { BoardHero } from "../layout/BoardHero";
import { FilterPills, type FilterAssignee } from "../layout/FilterPills";
import { COLUMN_LABELS, COLUMN_ORDER, type TaskCardData } from "./types";
import type { TaskStatus } from "@if26/database";

interface SteamKanbanBoardProps {
  guildId: string;
  guildName: string;
}

export function SteamKanbanBoard({ guildId, guildName }: SteamKanbanBoardProps) {
  const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?guildId=${guildId}`);
      if (res.ok) {
        const data = await res.json();
        // Defensive check: handle array langsung maupun object { tasks: [] }
        const taskList = Array.isArray(data) ? data : (data.tasks ?? []);
        setTasks(taskList);
      }
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const assignees = useMemo<FilterAssignee[]>(() => {
    const map = new Map<string, FilterAssignee>();
    for (const task of tasks) {
      if (task.assignee) map.set(task.assignee.id, { id: task.assignee.id, username: task.assignee.username });
    }
    return Array.from(map.values());
  }, [tasks]);

  const visibleTasks = assigneeFilter ? tasks.filter((t) => t.assignee?.id === assigneeFilter) : tasks;

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    const previous = tasks;

    // Optimistic update — flip locally first, then persist.
    setTasks((current) => current.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t)));

    const res = await fetch(`/api/tasks/${draggableId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      // Roll back on failure so the board never silently drifts from the DB.
      setTasks(previous);
    }
  }

  async function handleCreateTask(input: { title: string; description: string; assignedTo: string | null; dueDate: string | null }) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guildId, ...input }),
    });
    if (res.ok) {
      const data = (await res.json()) as { task: TaskCardData };
      setTasks((current) => [data.task, ...current]);
    }
    setModalOpen(false);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <BoardHero guildName={guildName} tasks={tasks} onNewTask={() => setModalOpen(true)} />
      <FilterPills assignees={assignees} selected={assigneeFilter} onSelect={setAssigneeFilter} />

      <div className="flex-1 overflow-x-auto px-6 pb-6">
        {loading ? (
          <p className="steam-meta text-steam-text/30">Loading board...</p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-3">
              {COLUMN_ORDER.map((status) => (
                <SteamKanbanColumn key={status} status={status} label={COLUMN_LABELS[status]} tasks={visibleTasks.filter((t) => t.status === status)} />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {modalOpen && <NewTaskModal guildId={guildId} onClose={() => setModalOpen(false)} onCreate={handleCreateTask} />}
    </div>
  );
}
