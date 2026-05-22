import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const b = await req.json();
  const ib = await prisma.icebreaker.findUnique({ where: { id: params.id } });
  if (!ib) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (b.action === "use") {
    await prisma.icebreaker.update({
      where: { id: params.id },
      data: { used: true },
    });
    // 视为完成互动
    await prisma.contact.update({
      where: { id: ib.contactId },
      data: { lastContact: new Date(), ignoreCount: 0, archived: false },
    });
    await prisma.interaction.create({
      data: {
        contactId: ib.contactId,
        type: "icebreak",
        content: b.tone ? `[${b.tone}] 已发送` : "已使用破冰",
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (b.action === "ignore") {
    await prisma.icebreaker.update({
      where: { id: params.id },
      data: { ignored: true },
    });
    const c = await prisma.contact.findUnique({ where: { id: ib.contactId } });
    if (!c) return NextResponse.json({ ok: true });
    const newCount = c.ignoreCount + 1;
    // 体面放弃：连续 3 次忽略 → 移入沉淀区
    await prisma.contact.update({
      where: { id: c.id },
      data: {
        ignoreCount: newCount,
        archived: newCount >= 3,
      },
    });
    return NextResponse.json({ ok: true, archived: newCount >= 3 });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
