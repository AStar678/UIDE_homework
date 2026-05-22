import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "社交回声 Social Echo",
  description: "终结改天请你吃饭，提供无压力破冰话题的私人社交助理",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="sticky top-0 z-50 glass border-b border-black/5">
          <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">
              <span className="text-xl">📡 社交回声</span>
            </Link>
            <nav className="flex gap-1 text-sm">
              <Link href="/echo" className="btn-ghost">主产品</Link>
              <Link href="/social" className="btn-ghost">模拟朋友圈</Link>
              <Link href="/echo/report" className="btn-ghost">能量报告</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-5 py-6">{children}</main>
        <footer className="text-center text-xs text-black/40 py-8">
          Social Echo · MVP for class demo
        </footer>
      </body>
    </html>
  );
}
