import { prisma } from "@/lib/prisma";
import { temperature, status, statusText, statusColor, daysSince } from "@/lib/temperature";
import Link from "next/link";
import { notFound } from "next/navigation";
import IcebreakerPanel from "./IcebreakerPanel";

export const dynamic = "force-dynamic";

export default async function ContactDetail({
  params,
}: {
  params: { id: string };
}) {
  const c = await prisma.contact.findUnique({
    where: { id: params.id },
    include: {
      moments: { orderBy: { createdAt: "desc" }, take: 3 },
      icebreakers: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!c) notFound();

  const temp = temperature(c.level, c.lastContact);
  const st = status(temp);
  const days = daysSince(c.lastContact);
  const latestMoment = c.moments[0]?.content || "";

  return (
    <div className="space-y-6">
      <Link href="/echo" className="text-sm text-black/50 hover:text-black">
        ← 返回卡片墙
      </Link>

      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div
            className={`text-5xl w-20 h-20 rounded-full flex items-center justify-center bg-black/5 ${
              st === "frozen" ? "frozen-avatar" : ""
            }`}
          >
            {c.avatar || "👤"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{c.name}</h2>
              <span className={`text-xs px-2 py-1 rounded-full border ${statusColor(st)}`}>
                {statusText(st)}
              </span>
            </div>
            <div className="text-sm text-black/50 mt-1">
              {c.tags || "未分类"} · 已 {days} 天未联系
            </div>
            <div className="mt-3 text-sm text-black/70">
              📌 记忆锚点：{c.memory || "（无）"}
            </div>
          </div>
        </div>

        {/* 温度槽 */}
        <div className="mt-5 h-2 rounded-full bg-black/5 overflow-hidden">
          <div
            className={`h-full ${
              st === "warm" ? "bg-orange-400" : st === "cool" ? "bg-slate-400" : "bg-blue-400"
            }`}
            style={{ width: `${Math.max(5, Math.min(100, temp))}%` }}
          />
        </div>
        <div className="text-xs text-black/40 mt-1">温度 {Math.round(temp)} / 100</div>
      </div>

      {latestMoment && (
        <div className="card p-5">
          <div className="text-sm text-black/50 mb-2">📰 ta 最近的动态</div>
          <div className="text-base">"{latestMoment}"</div>
        </div>
      )}

      <IcebreakerPanel
        contactId={c.id}
        ignoreCount={c.ignoreCount}
        defaultTrigger={
          latestMoment
            ? `ta 发了朋友圈："${latestMoment}"`
            : "天气转凉，想起了你"
        }
      />

      {c.icebreakers.length > 0 && (
        <details className="card p-4">
          <summary className="cursor-pointer text-sm text-black/60">
            历史破冰建议（{c.icebreakers.length}）
          </summary>
          <ul className="mt-3 space-y-2 text-sm">
            {c.icebreakers.map((i) => (
              <li key={i.id} className="p-3 rounded-lg bg-black/[0.02]">
                <div className="text-xs text-black/40 mb-1">
                  {new Date(i.createdAt).toLocaleString()} · {i.trigger} ·{" "}
                  {i.used ? "✅ 已使用" : i.ignored ? "🙈 已忽略" : "—"}
                </div>
                <div>{i.neutral}</div>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
