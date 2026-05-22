import { prisma } from "@/lib/prisma";
import { temperature, status } from "@/lib/temperature";

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  const contacts = await prisma.contact.findMany({ where: { archived: false } });
  const icebreakers = await prisma.icebreaker.findMany({});

  const stats = { warm: 0, cool: 0, frozen: 0 };
  contacts.forEach((c) => {
    const s = status(temperature(c.level, c.lastContact));
    stats[s]++;
  });
  const total = contacts.length || 1;
  const used = icebreakers.filter((i) => i.used).length;
  const ignored = icebreakers.filter((i) => i.ignored).length;
  const archivedCount = await prisma.contact.count({ where: { archived: true } });

  // 能量分：暖色占比 60% + 已使用破冰 30% + (1 - 忽略率) 10%
  const warmRate = stats.warm / total;
  const useRate = icebreakers.length > 0 ? used / icebreakers.length : 0.5;
  const ignoreRate = icebreakers.length > 0 ? ignored / icebreakers.length : 0;
  const energy = Math.round(
    (warmRate * 0.6 + useRate * 0.3 + (1 - ignoreRate) * 0.1) * 100
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">⚡ 社交能量报告</h2>

      <div className="card p-8 flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" stroke="#eee" strokeWidth="10" fill="none" />
            <circle
              cx="50" cy="50" r="42"
              stroke="#FFB07A" strokeWidth="10" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(energy / 100) * 264} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold">{energy}</div>
            <div className="text-xs text-black/50 mt-1">本周能量</div>
          </div>
        </div>
        <p className="mt-6 text-sm text-black/60 text-center max-w-md">
          {energy >= 70
            ? "你这周维护了很多重要的关系，继续保持~"
            : energy >= 40
            ? "有一些联系人正在降温，找几个顺手的理由聊聊吧。"
            : "通讯录里很多关系正在结冰，但别有压力——挑你最想维护的开始就好。"}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="🔥 温热" value={stats.warm} total={total} color="bg-orange-400" />
        <Stat label="🌤 常温" value={stats.cool} total={total} color="bg-slate-400" />
        <Stat label="❄️ 结冰" value={stats.frozen} total={total} color="bg-blue-400" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Mini label="生成的破冰建议" value={icebreakers.length} />
        <Mini label="实际使用" value={used} />
        <Mini label="自然沉淀" value={archivedCount} />
      </div>
    </div>
  );
}

function Stat({ label, value, total, color }: any) {
  const ratio = total === 0 ? 0 : (value / total) * 100;
  return (
    <div className="card p-5">
      <div className="text-sm text-black/60">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      <div className="mt-3 h-1.5 rounded-full bg-black/5 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${ratio}%` }} />
      </div>
    </div>
  );
}

function Mini({ label, value }: any) {
  return (
    <div className="card p-5 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs text-black/50 mt-1">{label}</div>
    </div>
  );
}
