import type { TaskStatus } from "@if26/database";

// Presentation-layer shape — a trimmed view of the Prisma `Task` model
// (see .context/SCHEMA.md) plus the resolved assignee, as returned by
// the dashboard's task-list API route.
export interface TaskCardData {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null; // ISO string once serialized over the API
  assignee: {
    id: string;
    username: string;
    avatar: string | null;
  } | null;
}

export const COLUMN_ORDER: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
];

export const COLUMN_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
};
