# 📐 社交回声 · 中保真原型（Vue 3）

> 纯前端线框风格，与高保真版本（`../`）共存。

## 特点

- ✅ **纯 Vue 3 + Vite**，无后端依赖
- ✅ **线框灰阶风格**，强调结构与流程而非视觉表现
- ✅ **localStorage 持久化**，刷新数据不丢
- ✅ **本地模板生成文案**，不依赖 LLM API
- ✅ 完整复刻高保真版本的 5 个页面与 3 个核心机制

## 运行

```bash
cd vue3-midfi
npm install
npm run dev
```

打开 http://localhost:5173

## 页面结构

| 路径 | 文件 | 说明 |
|------|------|------|
| `/` | `views/Home.vue` | 产品介绍 |
| `/echo` | `views/Echo.vue` | 联系人卡片墙 |
| `/echo/contact/:id` | `views/ContactDetail.vue` | 详情 + 破冰投喂 |
| `/social` | `views/Social.vue` | 模拟朋友圈 |
| `/report` | `views/Report.vue` | 能量报告 |

## 中保真 vs 高保真

| 维度 | 中保真（本目录） | 高保真（上级目录） |
|------|----------------|------------------|
| 视觉 | 灰阶 + 虚线 + `[占位]` | 配色 + 阴影 + emoji |
| 框架 | Vue 3 单一前端 | Next.js 全栈 |
| 数据 | localStorage | SQLite + Prisma |
| AI | 本地模板 | DeepSeek 真实 LLM |
| 路由 | hash 路由 | App Router |
| 用途 | 演示交互流程与信息架构 | 演示完整产品体验 |

## 重置数据

主产品页右上角「重置数据」按钮，或在浏览器控制台执行：
```js
localStorage.removeItem("social-echo-midfi-v1");
location.reload();
```
