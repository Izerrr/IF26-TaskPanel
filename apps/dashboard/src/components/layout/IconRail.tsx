"use client";

import { LayoutGrid, Users2, Settings, HelpCircle } from "lucide-react";
import clsx from "clsx";

const RAIL_ITEMS = [
  { icon: LayoutGrid, label: "Boards", href: "#" },
  { icon: Users2, label: "Members", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
];

export function IconRail() {
  return (
    <div className="flex w-14 shrink-0 flex-col items-center border-r border-steam-surface bg-steam-bg py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-steam-accent/40 bg-steam-surface">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-steam-accent">
          <path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Zm0 2.2 7 3.1v4.7c0 4-3 7.5-7 8.1-4-.6-7-4.1-7-8.1V7.3l7-3.1Z" />
          <path d="M11 7h2v6h-2zM11 15h2v2h-2z" />
        </svg>
      </div>

      <div className="mt-6 flex flex-col gap-1">
        {RAIL_ITEMS.map(({ icon: Icon, label }, i) => (
          <button
            key={label}
            title={label}
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-sm transition-colors",
              i === 0
                ? "bg-steam-surface text-steam-accent"
                : "text-steam-text/40 hover:bg-steam-surface hover:text-steam-text"
            )}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <button
          title="Help"
          className="flex h-9 w-9 items-center justify-center rounded-sm text-steam-text/30 transition-colors hover:bg-steam-surface hover:text-steam-text"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
}
