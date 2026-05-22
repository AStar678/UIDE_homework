// 社交温度算法：根据距离上次联系的天数 + 期待值，得到 0~100 的温度
// 数值越低代表越"冷"
export type Level = "senior" | "bestie" | "casual";

const THRESHOLDS: Record<Level, { warm: number; frozen: number }> = {
  // 单位：天
  senior: { warm: 60, frozen: 120 }, // 前辈：>2 月降温，>4 月结冰
  bestie: { warm: 30, frozen: 60 },  // 死党：>1 月降温，>2 月结冰
  casual: { warm: 90, frozen: 180 }, // 泛交：>3 月降温，>6 月结冰
};

export function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

export function temperature(level: string, lastContact: Date): number {
  const lv = (level as Level) in THRESHOLDS ? (level as Level) : "casual";
  const { warm, frozen } = THRESHOLDS[lv];
  const days = daysSince(lastContact);
  if (days <= warm) return Math.max(60, 100 - (days / warm) * 40);
  if (days >= frozen) return Math.max(0, 20 - (days - frozen) / 10);
  // 线性下降区间
  const ratio = (days - warm) / (frozen - warm);
  return 60 - ratio * 40; // 60 → 20
}

export function status(temp: number): "warm" | "cool" | "frozen" {
  if (temp >= 60) return "warm";
  if (temp >= 25) return "cool";
  return "frozen";
}

export function statusText(s: ReturnType<typeof status>): string {
  return { warm: "🔥 温热", cool: "🌤 常温", frozen: "❄️ 结冰" }[s];
}

export function statusColor(s: ReturnType<typeof status>): string {
  return {
    warm: "bg-orange-100 text-orange-700 border-orange-200",
    cool: "bg-slate-100 text-slate-600 border-slate-200",
    frozen: "bg-blue-100 text-blue-700 border-blue-200",
  }[s];
}
