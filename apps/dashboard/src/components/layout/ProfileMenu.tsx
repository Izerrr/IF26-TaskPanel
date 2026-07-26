"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, LogOut } from "lucide-react";

export function ProfileMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-sm px-2 py-1.5 transition-colors hover:bg-steam-surface"
      >
        {session.user.image ? (
          <img src={session.user.image} alt="" className="h-7 w-7 rounded-sm" />
        ) : (
          <div className="h-7 w-7 rounded-sm bg-steam-surface" />
        )}
        <span className="text-sm text-steam-text">{session.user.name}</span>
        <ChevronDown size={14} className="text-steam-text/40" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-sm border border-steam-surface bg-steam-card py-1 shadow-xl shadow-black/40">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-steam-text/70 transition-colors hover:bg-steam-surface hover:text-steam-alert"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
