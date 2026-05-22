import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const b = await req.json();
  const c = await prisma.contact.findUnique({ where: { id: params.id } });
  if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.interaction.create({
    data: {
      contactId: params.id,
      type: b.type || "chat",
      content: b.content || null,
    },
  });

  // 任何互动都视为重新接触，刷新 lastContact，并清零 ignoreCount
  await prisma.contact.update({
    where: { id: params.id },
    data: {
      lastContact: new Date(),
      ignoreCount: 0,
      archived: false,
    },
  });

  return NextResponse.json({ ok: true });
}
