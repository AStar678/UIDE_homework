# 📡 社交回声 Social Echo · MVP

> 终结"改天请你吃饭"——课堂演示版（自建社交平台代替微信）

## 🚀 快速开始（3 步启动）

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库 + 注入演示数据
npm run setup

# 3. 启动
npm run dev
```

打开 http://localhost:3000 即可。

## 🗂 路由说明

| 路径 | 说明 |
|------|------|
| `/` | 首页 / 产品介绍 |
| `/echo` | 主产品 - 联系人卡片墙 |
| `/echo/contact/[id]` | 联系人详情 + 破冰投喂 |
| `/echo/report` | 社交能量报告 |
| `/social` | 模拟朋友圈（替代微信） |

## 🎬 课堂演示动线

1. 打开 `/social` → 看到老同学发了动态
2. 点击「让回声给我个开口理由」→ 跳转主产品
3. 点击「✨ 生成破冰文案」→ AI 给出尊敬/平和/随意三版
4. 点「复制并跳转」→ 回 `/social` 粘贴 → 完成闭环
5. 切换到 `/echo/report` → 展示能量环、温度分布

## 🔧 接入真实 LLM（可选）

默认使用 `mock` 模式，无需 API Key 即可演示。如需接入真模型，编辑 `.env`：

```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-chat
```

支持 OpenAI / DeepSeek / 通义千问 等所有兼容 OpenAI 协议的模型。

## 🧱 技术栈

- Next.js 14 App Router（前后端一体）
- Prisma + SQLite（本地数据库，零配置）
- Tailwind CSS
- OpenAI SDK

## 📐 核心算法

**温度算法**（`lib/temperature.ts`）：根据期待值 + 距上次联系天数计算 0~100 的温度
- 死党：30/60 天 降温/结冰
- 前辈：60/120 天
- 泛交：90/180 天

**Prompt 模板**（`lib/llm.ts`）：`[问候] + [记忆锚点] + [触发理由] + [免压结尾]`，含 Respect/Casual 权重。

## 🧊 体面放弃机制

连续 3 次「都不合适」后，联系人自动移入「自然沉淀区」，不再生成提醒。

## 🛠 常用命令

```bash
npm run dev          # 启动开发
npm run db:push      # 重置数据库结构
npm run db:seed      # 重新注入演示数据
npm run build        # 生产构建
```

## 🎓 项目结构

```
app/
├─ page.tsx                    # 首页
├─ layout.tsx                  # 全局布局
├─ echo/                       # 主产品
│  ├─ page.tsx                 # 卡片墙
│  ├─ AddContactForm.tsx       # 录入表单
│  ├─ SeedButton.tsx           # 重置数据按钮
│  ├─ contact/[id]/            # 联系人详情
│  │  ├─ page.tsx
│  │  └─ IcebreakerPanel.tsx   # 破冰投喂面板
│  └─ report/page.tsx          # 能量报告
├─ social/                     # 模拟朋友圈
│  ├─ page.tsx
│  └─ SocialActions.tsx
└─ api/                        # API 路由
   ├─ contacts/
   ├─ icebreaker/
   └─ seed/

lib/
├─ prisma.ts                   # Prisma 客户端单例
├─ temperature.ts              # 温度算法
└─ llm.ts                      # LLM 调用 + Mock

prisma/
├─ schema.prisma               # 数据模型
└─ seed.ts                     # 种子数据
```
