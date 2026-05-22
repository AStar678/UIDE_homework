<template>
  <div class="feed">
    <div style="text-align:center; margin-bottom:16px">
      <h2 class="title">模拟朋友圈</h2>
      <div class="muted">替代微信的演示场景</div>
    </div>

    <div v-if="moments.length === 0" class="placeholder">暂无动态</div>

    <div class="box" style="padding:0 16px">
      <div v-for="m in moments" :key="m.id" class="feed-item">
        <div class="row">
          <div class="avatar">{{ m.avatar }}</div>
          <div style="flex:1">
            <div style="font-weight:600">{{ m.name }}</div>
            <div class="muted">{{ formatTime(m.momentTime) }} · 你们已 {{ m.days }} 天没聊</div>
          </div>
          <span v-if="m.st === 'frozen'" class="tag tag-frozen">结冰</span>
        </div>
        <div style="margin:10px 0; line-height:1.7">{{ m.latestMoment }}</div>

        <div class="row" style="justify-content:flex-end; gap:6px">
          <button class="btn btn-sm" :disabled="m.liked" @click="onLike(m.id)">
            {{ m.liked ? "♥ 已赞" : "♡ 点赞" }}
          </button>
          <router-link :to="`/echo/contact/${m.id}`" class="btn btn-sm">让回声给我个开口理由</router-link>
        </div>

        <div class="row" style="margin-top:8px; gap:6px">
          <input v-model="replyMap[m.id]" :placeholder="`回复 ${m.name}（可粘贴破冰文案）`" />
          <button class="btn btn-sm btn-primary" @click="onReply(m.id)">{{ sentMap[m.id] ? "✓ 已发送" : "发送" }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { store, interact } from "../store.js";
import { temperature, statusOf, daysSince } from "../utils.js";

const replyMap = reactive({});
const sentMap = reactive({});
const liked = reactive({});

const moments = computed(() =>
  store.contacts
    .filter((c) => c.latestMoment)
    .map((c) => {
      const t = temperature(c.level, c.lastContact);
      return {
        ...c,
        temp: t,
        st: statusOf(t),
        days: daysSince(c.lastContact),
        liked: liked[c.id] || false,
      };
    })
    .sort((a, b) => new Date(b.momentTime) - new Date(a.momentTime))
);

function onLike(id) {
  liked[id] = true;
  interact(id, "like");
}
function onReply(id) {
  const txt = replyMap[id];
  if (!txt || !txt.trim()) return;
  interact(id, "chat", txt);
  sentMap[id] = true;
  replyMap[id] = "";
  setTimeout(() => (sentMap[id] = false), 2000);
}
function formatTime(ts) {
  return new Date(ts).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}
</script>
