import { Draggable, Droppable } from "@hello-pangea/dnd";
import clsx from "clsx";
import { SteamTaskCard } from "./SteamTaskCard";
import type { TaskCardData } from "./types";
import type { TaskStatus } from "@if26/database";

interface SteamKanbanColumnProps {
  status: TaskStatus;
  label: string;
  tasks: TaskCardData[];
}

export function SteamKanbanColumn({ status, label, tasks }: SteamKanbanColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-sm border border-steam-surface bg-steam-bg">
      {/* Steam Header Nav — tab style, active bottom highlight bar (design.md #3) */}
      <div className="border-b-2 border-steam-accent px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="steam-meta text-steam-text">{label}</span>
          <span className="steam-meta text-steam-text/40">{tasks.length}</span>
        </div>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              "flex flex-1 flex-col gap-2 p-2",
              "min-h-[120px] transition-colors duration-150",
              snapshot.isDraggingOver && "bg-steam-card"
            )}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <SteamTaskCard
                    task={task}
                    provided={dragProvided}
                    snapshot={dragSnapshot}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {tasks.length === 0 && (
              <p className="steam-meta py-6 text-center text-steam-text/30">
                No tasks
              </p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
