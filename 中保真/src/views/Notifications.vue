<template>
  <div class="col" style="gap:16px">
    <div class="row" style="justify-content:space-between">
      <div>
        <h2 class="title">通知中心</h2>
        <div class="muted">无打扰式提醒 · 仅展示需要你关注的</div>
      </div>
      <div v-if="frozenList.length > 0" class="muted">{{ frozenList.length }} 条待处理</div>
    </div>

    <!-- 空状态 -->
    <div v-if="frozenList.length === 0 && pendingHistory.length === 0" class="placeholder" style="padding:40px">
      [ 暂无新通知 ]<br><br>
      <span class="muted" style="font-size:12px">通讯录里的关系都还在合理温度内 ✨</span>
    </div>

    <!-- 结冰预警 -->
    <div v-if="frozenList.length > 0">
      <div class="section-title">— 结冰预警 ❄ —</div>
      <div class="col" style="gap:8px">
        <router-link
          v-for="c in frozenList" :key="c.id"
          :to="`/echo/contact/${c.id}`"
          class="box"
          style="display:block; color:inherit"
        >
          <div class="row" style="justify-content:space-between">
            <div class="row">
              <div class="avatar frozen">{{ c.avatar }}</div>
              <div>
                <div style="font-weight:600">{{ c.name }} <span class="tag tag-frozen">已结冰</span></div>
                <div class="muted">已 {{ c.days }} 天未联系 · {{ c.memory || c.tags || "未分类" }}</div>
              </div>
            </div>
            <span class="btn btn-sm btn-primary">去破冰 →</span>
          </div>
          <div v-if="c.suggestedTrigger" class="box-dashed" style="margin-top:8px; padding:8px 10px; border:1px dashed #ccc; border-radius:3px; font-size:12px; color:#666">
            <b>触发建议：</b>{{ c.suggestedTrigger }}
          </div>
        </router-link>
      </div>
    </div>

    <!-- 待复盘的破冰建议 -->
    <div v-if="pendingHistory.length > 0">
      <div class="section-title">— 最近的破冰建议 —</div>
      <div class="col" style="gap:8px">
        <div v-for="h in pendingHistory" :key="h.ts" class="box" style="font-size:13px">
          <div class="row" style="justify-content:space-between">
            <div>
              <div><b>{{ h.contactName }}</b> <span class="muted" style="margin-left:6px">{{ formatTime(h.ts) }}</span></div>
              <div class="muted" style="margin-top:2px">{{ h.trigger }}</div>
            </div>
            <span v-if="h.used" class="tag tag-warm">已使用</span>
            <span v-else-if="h.ignored" class="tag tag-cool">已忽略</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 触发器说明 -->
    <details class="box box-dashed">
      <summary class="muted" style="cursor:pointer; font-size:12px">[ 系统会基于哪些事件提醒你？ ]</summary>
      <div class="col" style="gap:6px; margin-top:10px; font-size:12px; color:#666; line-height:1.7">
        <div>· <b>时间维度：</b>超过期待值阈值未联系（默认前辈 60 天 / 死党 30 天 / 泛交 90 天）</div>
        <div>· <b>资讯维度：</b>对方关注领域出现新论文 / 行业热点</div>
        <div>· <b>动态维度：</b>对方发布朋友圈 / 状态更新</div>
        <div>· <b>环境维度：</b>初雪、节假日、共同游戏赛季等</div>
      </div>
    </details>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../store.js";
import { temperature, statusOf, daysSince } from "../utils.js";

const frozenList = computed(() =>
  store.contacts
    .filter((c) => !c.archived)
    .map((c) => ({
      ...c,
      temp: temperature(c.level, c.lastContact),
      days: daysSince(c.lastContact),
    }))
    .filter((c) => statusOf(c.temp) === "frozen")
    .sort((a, b) => b.days - a.days)
    .map((c) => ({
      ...c,
      suggestedTrigger: c.latestMoment ? `ta 最近发了："${c.latestMoment}"` : "好久不见，借天气问候一下",
    }))
);

const pendingHistory = computed(() => {
  const all = [];
  store.contacts.forEach((c) => {
    c.history
      .filter((h) => h.drafts) // 只看真实生成的破冰记录
      .slice(0, 2)
      .forEach((h) => all.push({ ...h, contactName: c.name }));
  });
  return all.sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 5);
});

function formatTime(ts) {
  return new Date(ts).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}
</script>
