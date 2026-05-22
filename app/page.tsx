import Link from "next/link";

export default function HomePage() {
  return (
    <div className="py-10">
      <section className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          📡 社交回声
        </h1>
        <p className="mt-3 text-lg text-black/60">
          终结"改天请你吃饭"——你的私人社交助理
        </p>
        <p className="mt-6 text-sm text-black/50 leading-relaxed">
          通讯录里那些熟悉又陌生的名字，因为找不到自然的开口理由而沉睡。
          <br />
          社交回声为你提供"顺手的破冰借口"，让重要的关系不因时间而消散。
        </p>

        <div className="mt-10 flex justify-center gap-3">
          <Link href="/echo" className="btn-primary">进入主产品</Link>
          <Link href="/social" className="btn-ghost border border-black/10">查看模拟朋友圈</Link>
        </div>
      </section>

      <section className="mt-16 grid md:grid-cols-3 gap-4">
        {[
          { icon: "❄️", title: "结冰预警", desc: "重要联系人 3 个月未互动，头像视觉化结冰" },
          { icon: "🍵", title: "破冰投喂", desc: "基于动态/天气/资讯，生成 3 种语气文案" },
          { icon: "🍃", title: "体面放弃", desc: "连续 3 次忽略后，自然沉淀，消除负罪感" },
        ].map((f) => (
          <div key={f.title} className="card p-5">
            <div className="text-2xl">{f.icon}</div>
            <div className="mt-2 font-semibold">{f.title}</div>
            <div className="mt-1 text-sm text-black/60 leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </section>

      <section className="mt-16 card p-6 text-sm text-black/60 leading-relaxed">
        <div className="font-semibold text-black/80 mb-2">🎬 课堂演示动线</div>
        <ol className="list-decimal pl-5 space-y-1">
          <li>打开「模拟朋友圈」→ 看到老同学发了动态，但不知如何开口</li>
          <li>切到「主产品」→ 这位同学卡片正在结冰</li>
          <li>点击 → AI 生成尊敬/平和/随意三种文案</li>
          <li>选一条复制 → 回模拟朋友圈完成"发送"</li>
          <li>查看「能量报告」→ 升华情感价值</li>
        </ol>
      </section>
    </div>
  );
}
