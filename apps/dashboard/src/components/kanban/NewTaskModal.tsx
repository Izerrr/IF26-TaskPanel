"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Member {
  id: string;
  username: string;
}

interface NewTaskModalProps {
  guildId: string;
  onClose: () => void;
  onCreate: (input: { title: string; description: string; assignedTo: string | null; dueDate: string | null }) => void;
}

export function NewTaskModal({ guildId, onClose, onCreate }: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/members`)
      .then((res) => (res.ok ? res.json() : { members: [] }))
      .then((data: { members: Member[] }) => setMembers(data.members))
      .catch(() => setMembers([]));
  }, [guildId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    onCreate({
      title,
      description,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
    });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-sm border border-steam-surface bg-steam-card p-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="steam-meta text-steam-text">New Task</h2>
          <button type="button" onClick={onClose} className="text-steam-text/40 hover:text-steam-text">
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label className="steam-meta mb-1 block text-steam-text/40">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to get done?"
              className="w-full rounded-sm border border-steam-surface bg-steam-bg px-3 py-2 text-sm text-steam-text placeholder:text-steam-text/30 focus:border-steam-accent/50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="steam-meta mb-1 block text-steam-text/40">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={3}
              className="w-full resize-none rounded-sm border border-steam-surface bg-steam-bg px-3 py-2 text-sm text-steam-text placeholder:text-steam-text/30 focus:border-steam-accent/50 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="steam-meta mb-1 block text-steam-text/40">Assignee</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-sm border border-steam-surface bg-steam-bg px-2 py-2 text-sm text-steam-text focus:border-steam-accent/50 focus:outline-none"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="steam-meta mb-1 block text-steam-text/40">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-sm border border-steam-surface bg-steam-bg px-2 py-2 text-sm text-steam-text focus:border-steam-accent/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm px-4 py-2 text-sm text-steam-text/60 transition-colors hover:text-steam-text"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="rounded-sm bg-steam-accent px-4 py-2 text-sm font-medium text-steam-bg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
