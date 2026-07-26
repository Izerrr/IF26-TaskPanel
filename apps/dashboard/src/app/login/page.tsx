"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-steam-bg px-4">
      {/* Ambient background — faint diagonal grid, Steam's dark industrial backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#66c0f4 1px, transparent 1px), linear-gradient(90deg, #66c0f4 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-steam-accent/10 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-md border border-steam-surface bg-steam-card p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-steam-accent/40 bg-steam-surface">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-steam-accent">
              <path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Zm0 2.2 7 3.1v4.7c0 4-3 7.5-7 8.1-4-.6-7-4.1-7-8.1V7.3l7-3.1Z" />
              <path d="M11 7h2v6h-2zM11 15h2v2h-2z" />
            </svg>
          </div>

          <h1 className="steam-meta mt-4 text-base tracking-widest text-steam-text">IF26 TASK PANEL</h1>
          <p className="mt-2 text-sm text-steam-text/50">
            Sign in with your Discord account to access your server&apos;s task boards.
          </p>
        </div>

        <button
          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-sm bg-[#5865F2] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4752C4]"
        >
          <DiscordIcon />
          Continue with Discord
        </button>

        <p className="steam-meta mt-6 text-center text-steam-text/30">
          Requires membership in a server this bot manages
        </p>
      </div>
    </main>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M20.3 4.7A19.7 19.7 0 0 0 15.6 3c-.2.4-.5.9-.7 1.3a18 18 0 0 0-5.8 0A9 9 0 0 0 8.4 3a19.6 19.6 0 0 0-4.7 1.7C1 9.4.3 14 .6 18.5a20 20 0 0 0 5.9 2.9c.5-.6.9-1.3 1.3-2a13 13 0 0 1-2-1c.2-.1.3-.3.5-.4 3.8 1.7 7.9 1.7 11.6 0l.5.4c-.6.4-1.3.7-2 1 .4.7.8 1.4 1.3 2a20 20 0 0 0 5.9-2.9c.4-5.2-.8-9.7-3.3-13.8ZM8.5 15.8c-1.1 0-2-1.1-2-2.3 0-1.3.9-2.3 2-2.3s2 1 2 2.3c0 1.2-.9 2.3-2 2.3Zm7 0c-1.1 0-2-1.1-2-2.3 0-1.3.9-2.3 2-2.3s2 1 2 2.3c0 1.2-.9 2.3-2 2.3Z" />
    </svg>
  );
}
