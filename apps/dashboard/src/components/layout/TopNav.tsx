"use client";

import { useState } from "react";
import { Bell, Search } from "lucide-react";
import clsx from "clsx";
import { ProfileMenu } from "./ProfileMenu";

const TABS = ["TASKS", "BOARDS", "MEMBERS"] as const;

export function TopNav() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("TASKS");

  return (
    <header className="flex h-14 shrink-0 items-center gap-6 border-b border-steam-surface bg-steam-bg px-6">
      <nav className="flex h-full items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "steam-meta h-full border-b-2 px-3 text-[11px] transition-colors",
              activeTab === tab
                ? "border-steam-accent text-steam-text"
                : "border-transparent text-steam-text/40 hover:text-steam-text/70"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="relative ml-auto flex w-64 items-center">
        <Search size={14} className="pointer-events-none absolute left-2.5 text-steam-text/30" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full rounded-sm border border-steam-surface bg-steam-card py-1.5 pl-8 pr-3 text-xs text-steam-text placeholder:text-steam-text/30 focus:border-steam-accent/50 focus:outline-none"
        />
      </div>

      <button className="flex h-8 w-8 items-center justify-center rounded-sm text-steam-text/50 transition-colors hover:bg-steam-surface hover:text-steam-text">
        <Bell size={16} />
      </button>

      <ProfileMenu />
    </header>
  );
}
