<template>
  <div class="col" style="gap:20px">
    <div class="box" style="text-align:center; padding:40px 20px">
      <div style="font-size:12px; color:#888; letter-spacing:2px">[ LOGO 占位 ]</div>
      <h1 class="title" style="font-size:32px; margin:16px 0 8px">社交回声 Social Echo</h1>
      <div class="muted" style="font-size:14px">终结"改天请你吃饭"——你的私人社交助理</div>
      <div style="margin-top:24px; display:flex; justify-content:center; gap:8px">
        <router-link to="/echo" class="btn btn-primary">进入主产品 →</router-link>
        <router-link to="/social" class="btn">查看模拟朋友圈</router-link>
      </div>
    </div>

    <div class="section-title">— 核心功能 —</div>
    <div class="grid">
      <div v-for="f in features" :key="f.title" class="box box-dashed">
        <div class="muted" style="font-size:11px">[ {{ f.tag }} ]</div>
        <div style="font-weight:600; margin:6px 0 4px">{{ f.title }}</div>
        <div class="muted" style="line-height:1.6">{{ f.desc }}</div>
      </div>
    </div>

    <div class="section-title">— 演示动线 —</div>
    <div class="box">
      <ol style="margin:0; padding-left:20px; line-height:1.9; color:#555">
        <li>打开「朋友圈」→ 看到老同学发了动态</li>
        <li>点击「让回声给我个开口理由」→ 跳转主产品</li>
        <li>点击「生成破冰文案」→ 三种语气可选（尊敬/平和/随意）</li>
        <li>选一条复制 → 回朋友圈完成发送</li>
        <li>查看「能量报告」→ 复盘本周社交健康度</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
const features = [
  { tag: "MODULE 01", title: "结冰预警", desc: "重要联系人超期未联系，头像视觉化结冰" },
  { tag: "MODULE 02", title: "破冰投喂", desc: "基于动态/天气/资讯，生成三种语气文案" },
  { tag: "MODULE 03", title: "体面放弃", desc: "连续 3 次忽略 → 自然沉淀，消除负罪感" },
];
</script>
