import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma, TaskStatus } from "@if26/database";

interface RouteParams {
  params: { id: string };
}

interface UpdateTaskBody {
  status?: TaskStatus;
  title?: string;
  description?: string | null;
  assignedTo?: string | null;
  dueDate?: string | null;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = (await req.json()) as UpdateTaskBody;

  if (body.status && !Object.values(TaskStatus).includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
      },
      include: { assignee: true },
    });

    return NextResponse.json({ task });
  } catch {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    await prisma.task.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
}
