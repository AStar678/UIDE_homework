import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const list = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const lastContact = new Date(Date.now() - (Number(b.daysAgo) || 0) * 86400000);
  const c = await prisma.contact.create({
    data: {
      name: b.name,
      avatar: b.avatar || "👤",
      level: b.level || "casual",
      memory: b.memory || "",
      tags: b.tags || "",
      lastContact,
    },
  });
  return NextResponse.json(c);
}
