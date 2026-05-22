import { prisma } from "@/lib/prisma";
import { temperature, status, statusText, statusColor, daysSince } from "@/lib/temperature";
import Link from "next/link";
import AddContactForm from "./AddContactForm";
import SeedButton from "./SeedButton";

export const dynamic = "force-dynamic";

export default async function EchoPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { lastContact: "asc" },
  });

  // 按温度排序，结冰置顶
  const decorated = contacts.map((c) => {
    const temp = temperature(c.level, c.lastContact);
    return { ...c, temp, st: status(temp), days: daysSince(c.lastContact) };
  });
  const active = decorated.filter((c) => !c.archived);
  const archived = decorated.filter((c) => c.archived);
  active.sort((a, b) => a.temp - b.temp);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">联系人卡片墙</h2>
          <p className="text-sm text-black/50 mt-1">
            按温度排序 · 共 {active.length} 位活跃 / {archived.length} 位沉淀
          </p>
        </div>
        <SeedButton />
      </div>

      <AddContactForm />

      {active.length === 0 ? (
        <div className="card p-10 text-center text-black/50">
          还没有联系人，先点击右上角「重置演示数据」或上方手动添加。
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((c) => (
            <Link
              key={c.id}
              href={`/echo/contact/${c.id}`}
              className="card p-4 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`text-3xl w-12 h-12 rounded-full flex items-center justify-center bg-black/5 ${
                    c.st === "frozen" ? "frozen-avatar" : ""
                  }`}
                >
                  {c.avatar || "👤"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="text-xs text-black/50 truncate">
                    {c.tags || "未分类"}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${statusColor(c.st)}`}
                >
                  {statusText(c.st)}
                </span>
              </div>

              <div className="mt-3 text-sm text-black/60 line-clamp-2 min-h-[2.5em]">
                {c.memory || "—"}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-black/40">
                <span>已 {c.days} 天未联系</span>
                <span className="opacity-0 group-hover:opacity-100 transition">
                  打开 →
                </span>
              </div>

              {/* 温度槽 */}
              <div className="mt-2 h-1.5 rounded-full bg-black/5 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    c.st === "warm"
                      ? "bg-orange-400"
                      : c.st === "cool"
                      ? "bg-slate-400"
                      : "bg-blue-400"
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, c.temp))}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <details className="card p-4">
          <summary className="cursor-pointer text-sm text-black/60">
            🍃 自然沉淀区（{archived.length}）
          </summary>
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {archived.map((c) => (
              <div key={c.id} className="text-sm text-black/50 p-2 rounded bg-black/[0.02]">
                {c.avatar} {c.name} · 沉睡 {c.days} 天
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
