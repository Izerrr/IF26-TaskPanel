"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ClipboardList, LayoutGrid, Users2, Settings2 } from "lucide-react";
import clsx from "clsx";

export interface GuildOption {
  id: string;
  name: string;
  iconUrl: string | null;
}

// 📁 apps/dashboard/src/components/layout/Sidebar.tsx

export interface SidebarProps {
  guilds: Array<{ id: string; name: string; iconUrl: string | null }>;
  currentGuild?: { id: string; name: string; iconUrl: string | null } | null; // 👈 TAMBAHKAN BARIS INI
  onSelectGuild?: (guild: any) => void;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
}

const NAV_ITEMS = [
  { icon: ClipboardList, label: "My Tasks" },
  { icon: LayoutGrid, label: "All Boards" },
  { icon: Users2, label: "Members" },
  { icon: Settings2, label: "Settings" },
];

export function Sidebar({ guilds, currentGuild }: SidebarProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const router = useRouter();

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 border-r border-steam-surface bg-steam-bg p-4">
      {/* Guild switcher — plays the role of the gift-card widget in the reference */}
      <div className="relative">
        <button onClick={() => setSwitcherOpen((v) => !v)} className="flex w-full items-center gap-2 rounded-sm border border-steam-surface bg-steam-card px-3 py-2.5 text-left transition-colors hover:border-steam-accent/40">
          {currentGuild?.iconUrl ? (
            <img src={currentGuild.iconUrl} alt="" className="h-7 w-7 rounded-sm" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-steam-surface steam-meta text-steam-accent">{currentGuild?.name.slice(0, 2) ?? "--"}</div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-steam-text">{currentGuild?.name ?? "Select a server"}</p>
            <p className="steam-meta text-steam-text/40">Workspace</p>
          </div>
          <ChevronDown size={14} className="text-steam-text/40" />
        </button>

        {switcherOpen && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-sm border border-steam-surface bg-steam-card py-1 shadow-xl shadow-black/40">
            {guilds.length === 0 && <p className="px-3 py-2 text-xs text-steam-text/40">No manageable servers found.</p>}
            {guilds.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setSwitcherOpen(false);
                  router.push(`/dashboard?guild=${g.id}`);
                }}
                className={clsx("flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-steam-surface", g.id === currentGuild?.id ? "text-steam-accent" : "text-steam-text")}
              >
                {g.iconUrl ? <img src={g.iconUrl} alt="" className="h-5 w-5 rounded-sm" /> : <div className="h-5 w-5 rounded-sm bg-steam-surface" />}
                <span className="truncate">{g.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label }, i) => (
          <button
            key={label}
            className={clsx("flex items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm transition-colors", i === 1 ? "bg-steam-surface text-steam-accent" : "text-steam-text/60 hover:bg-steam-surface hover:text-steam-text")}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-sm border border-steam-surface bg-steam-card p-3">
        <p className="steam-meta text-steam-accent">Bot Status</p>
        <p className="mt-1 text-xs text-steam-text/50">Slash commands sync from the VPS worker — changes made via Discord appear here on refresh.</p>
      </div>
    </aside>
  );
}
