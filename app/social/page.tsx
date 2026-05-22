import { prisma } from "@/lib/prisma";
import { daysSince } from "@/lib/temperature";
import SocialActions from "./SocialActions";

export const dynamic = "force-dynamic";

export default async function SocialPage() {
  const moments = await prisma.moment.findMany({
    orderBy: { createdAt: "desc" },
    include: { contact: true },
    take: 30,
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold">💬 模拟朋友圈</h2>
        <p className="text-sm text-black/50 mt-1">
          这是一个仿微信的演示场景，用于代替真实微信生态
        </p>
      </div>

      {moments.length === 0 && (
        <div className="card p-10 text-center text-black/50">
          暂无动态，去主产品页点击「重置演示数据」即可看到。
        </div>
      )}

      <div className="space-y-4">
        {moments.map((m) => {
          const days = daysSince(m.contact.lastContact);
          return (
            <div key={m.id} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="text-3xl w-12 h-12 rounded-full flex items-center justify-center bg-black/5">
                  {m.contact.avatar || "👤"}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{m.contact.name}</div>
                  <div className="text-xs text-black/40">
                    {new Date(m.createdAt).toLocaleString()} · 你们已 {days} 天没聊过
                  </div>
                </div>
              </div>
              <div className="mt-3 text-base leading-relaxed">{m.content}</div>
              <SocialActions contactId={m.contactId} contactName={m.contact.name} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
