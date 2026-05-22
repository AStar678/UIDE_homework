"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddContactForm() {
  const r = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    avatar: "👤",
    level: "casual",
    memory: "",
    tags: "",
    daysAgo: 30,
  });

  async function submit() {
    if (!form.name.trim()) return alert("请填写姓名");
    setLoading(true);
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setForm({ ...form, name: "", memory: "", tags: "" });
      setOpen(false);
      r.refresh();
    } else {
      alert("添加失败");
    }
  }

  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        ＋ 录入新联系人
      </button>
    );

  return (
    <div className="card p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className="px-3 py-2 rounded-lg border border-black/10 bg-white"
          placeholder="姓名 *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="px-3 py-2 rounded-lg border border-black/10 bg-white"
          placeholder="emoji 头像（如 🌸）"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
        />
      </div>
      <textarea
        className="w-full px-3 py-2 rounded-lg border border-black/10 bg-white"
        rows={2}
        placeholder="一句话记忆锚点：例如「一起熬夜写过 MySQL 大作业的队友」"
        value={form.memory}
        onChange={(e) => setForm({ ...form, memory: e.target.value })}
      />
      <div className="grid sm:grid-cols-3 gap-3">
        <select
          className="px-3 py-2 rounded-lg border border-black/10 bg-white"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        >
          <option value="senior">期待值：定期维护的前辈</option>
          <option value="bestie">期待值：随时抛梗的死党</option>
          <option value="casual">期待值：自然沉淀的泛交</option>
        </select>
        <input
          className="px-3 py-2 rounded-lg border border-black/10 bg-white"
          placeholder="标签（逗号分隔，如：科研,大学）"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <input
          type="number"
          className="px-3 py-2 rounded-lg border border-black/10 bg-white"
          placeholder="距上次联系天数"
          value={form.daysAgo}
          onChange={(e) =>
            setForm({ ...form, daysAgo: Number(e.target.value || 0) })
          }
        />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => setOpen(false)} className="btn-ghost">
          取消
        </button>
        <button onClick={submit} className="btn-primary" disabled={loading}>
          {loading ? "添加中..." : "保存"}
        </button>
      </div>
    </div>
  );
}
