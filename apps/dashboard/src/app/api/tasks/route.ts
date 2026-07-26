import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@if26/database";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { guildId, title, description, assignedTo, dueDate } = body;

    if (!guildId || !title) {
      return NextResponse.json({ error: "guildId and title are required" }, { status: 400 });
    }

    // 💡 FIX UTAMA P2003: Pastikan Guild ID terdaftar dulu di Supabase!
    await prisma.guild.upsert({
      where: { id: guildId },
      create: {
        id: guildId,
        name: "Discord Workspace", // Fallback name
      },
      update: {},
    });

    // 🚀 Buat Task baru
    const task = await prisma.task.create({
      data: {
        guildId,
        title,
        description: description || null,
        assignedTo: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "TODO",
      },
      include: {
        assignee: true,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tasks Error]:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
