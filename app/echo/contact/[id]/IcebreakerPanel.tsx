"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Drafts = { respect: string; neutral: string; casual: string };

const TONES: { key: keyof Drafts; label: string; emoji: string }[] = [
  { key: "respect", label: "尊敬版", emoji: "🌿" },
  { key: "neutral", label: "平和版", emoji: "🌤" },
  { key: "casual", label: "随意版", emoji: "🍻" },
];

export default function IcebreakerPanel({
  contactId,
  ignoreCount,
  defaultTrigger,
}: {
  contactId: string;
  ignoreCount: number;
  defaultTrigger: string;
}) {
  const r = useRouter();
  const [trigger, setTrigger] = useState(defaultTrigger);
  const [drafts, setDrafts] = useState<Drafts | null>(null);
  const [icebreakerId, setIcebreakerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/icebreaker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, trigger }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) return alert(data.error);
    setDrafts(data.drafts);
    setIcebreakerId(data.id);
  }

  async function markUsed(tone: string) {
    if (!icebreakerId || !drafts) return;
    const text = drafts[tone as keyof Drafts];
    await navigator.clipboard.writeText(text).catch(() => {});
    await fetch(`/api/icebreaker/${icebreakerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "use", tone }),
    });
    setCopied(tone);
    setTimeout(() => r.refresh(), 600);
  }

  async function ignore() {
    if (!icebreakerId) return;
    await fetch(`/api/icebreaker/${icebreakerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ignore" }),
    });
    setDrafts(null);
    setIcebreakerId(null);
    r.refresh();
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">🍵 破冰投喂</div>
        <div className="text-xs text-black/40">
          已忽略 {ignoreCount}/3 次
          {ignoreCount >= 2 && " · 再忽略一次将自然沉淀"}
        </div>
      </div>

      <label className="text-sm text-black/60">触发理由</label>
      <textarea
        rows={2}
        className="w-full mt-1 px-3 py-2 rounded-lg border border-black/10 bg-white text-sm"
        value={trigger}
        onChange={(e) => setTrigger(e.target.value)}
      />

      <div className="mt-3 flex gap-2">
        <button onClick={generate} className="btn-primary" disabled={loading}>
          {loading ? "生成中..." : drafts ? "🔄 重新生成" : "✨ 生成破冰文案"}
        </button>
        {drafts && (
          <button onClick={ignore} className="btn-ghost border border-black/10">
            🙈 都不合适
          </button>
        )}
      </div>

      {drafts && (
        <div className="mt-5 space-y-3">
          {TONES.map((t) => {
            const text = drafts[t.key];
            const isCopied = copied === t.key;
            return (
              <div
                key={t.key}
                className="p-4 rounded-xl bg-echo-paper border border-black/5"
              >
                <div className="text-xs text-black/50 mb-2">
                  {t.emoji} {t.label}
                </div>
                <div className="text-base leading-relaxed">{text}</div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => markUsed(t.key)}
                    className="btn-primary"
                  >
                    {isCopied ? "✅ 已复制" : "复制并跳转"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
