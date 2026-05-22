"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SocialActions({
  contactId,
  contactName,
}: {
  contactId: string;
  contactName: string;
}) {
  const r = useRouter();
  const [liked, setLiked] = useState(false);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);

  async function send() {
    if (!reply.trim()) return;
    await fetch(`/api/contacts/${contactId}/interact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "chat", content: reply }),
    });
    setSent(true);
    setReply("");
    setTimeout(() => {
      setSent(false);
      r.refresh();
    }, 1500);
  }

  async function like() {
    setLiked(true);
    await fetch(`/api/contacts/${contactId}/interact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "like" }),
    });
    setTimeout(() => r.refresh(), 500);
  }

  return (
    <div className="mt-4 border-t border-black/5 pt-3 space-y-2">
      <div className="flex gap-2 items-center text-sm">
        <button
          onClick={like}
          disabled={liked}
          className="btn-ghost border border-black/10"
        >
          {liked ? "❤️ 已点赞" : "🤍 点赞"}
        </button>
        <Link
          href={`/echo/contact/${contactId}`}
          className="btn-ghost border border-black/10"
        >
          🍵 让回声给我个开口理由
        </Link>
      </div>

      <div className="flex gap-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={`回复 ${contactName}（可粘贴破冰文案）`}
          className="flex-1 px-3 py-2 rounded-lg border border-black/10 bg-white text-sm"
        />
        <button onClick={send} className="btn-primary">
          {sent ? "✅ 已发送" : "发送"}
        </button>
      </div>
    </div>
  );
}
