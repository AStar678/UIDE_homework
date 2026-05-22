import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateIcebreakers } from "@/lib/llm";
import { daysSince } from "@/lib/temperature";

export async function POST(req: NextRequest) {
  const { contactId, trigger } = await req.json();
  const c = await prisma.contact.findUnique({ where: { id: contactId } });
  if (!c) return NextResponse.json({ error: "not found" }, { status: 404 });

  const drafts = await generateIcebreakers({
    name: c.name,
    level: c.level,
    memory: c.memory,
    tags: c.tags,
    daysSilent: daysSince(c.lastContact),
    trigger: trigger || "好久不见，想起你",
  });

  const ib = await prisma.icebreaker.create({
    data: {
      contactId,
      trigger: trigger || "默认",
      respect: drafts.respect,
      neutral: drafts.neutral,
      casual: drafts.casual,
    },
  });

  return NextResponse.json({ id: ib.id, drafts });
}
