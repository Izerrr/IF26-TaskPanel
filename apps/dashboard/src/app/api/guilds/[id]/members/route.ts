import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@if26/database";

interface RouteParams {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const guild = await prisma.guild.findUnique({ where: { id: params.id } });
    if (!guild) {
      return NextResponse.json({ error: "Guild not synced yet" }, { status: 404 });
    }

    // Ambil semua cached member dari tabel User
    const members = await prisma.user.findMany({
      orderBy: { username: "asc" },
    });

    return NextResponse.json({ members });
  } catch (err) {
    console.error("[GET /api/guilds/[id]/members Error]:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
