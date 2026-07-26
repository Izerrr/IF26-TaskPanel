import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@if26/database";
import { syncGuildMembers } from "@/lib/discord";

interface RouteParams {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const accessToken = (session as any)?.accessToken;

    if (!session || !accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Ambil daftar server user dari Discord v10
    const discordRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!discordRes.ok) {
      return NextResponse.json({ error: "Failed to verify guild membership" }, { status: 502 });
    }

    const guilds = (await discordRes.json()) as { id: string; name: string; icon: string | null }[];
    const guild = guilds.find((g) => g.id === params.id);

    if (!guild) {
      return NextResponse.json({ error: "You're not a member of that server" }, { status: 403 });
    }

    // Upsert Guild ke Supabase
    await prisma.guild.upsert({
      where: { id: guild.id },
      create: {
        id: guild.id,
        name: guild.name,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
      },
      update: {
        name: guild.name,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
      },
    });

    // Best-effort member sync
    await syncGuildMembers(guild.id).catch(() => []);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/guilds/[id]/sync Error]:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
