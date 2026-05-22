"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeedButton() {
  const r = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => {
        if (!confirm("将清空现有数据并注入演示数据，确定吗？")) return;
        setLoading(true);
        await fetch("/api/seed", { method: "POST" });
        setLoading(false);
        r.refresh();
      }}
      className="btn-ghost border border-black/10"
    >
      {loading ? "注入中..." : "🔄 重置演示数据"}
    </button>
  );
}
