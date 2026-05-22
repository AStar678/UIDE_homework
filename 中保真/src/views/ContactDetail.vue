<template>
  <div v-if="!c" class="placeholder">联系人不存在 · <router-link to="/echo">返回</router-link></div>
  <div v-else class="col" style="gap:16px">
    <router-link to="/echo" class="muted">← 返回卡片墙</router-link>

    <!-- 联系人信息卡 -->
    <div class="box">
      <div class="row" style="gap:16px">
        <div class="avatar avatar-lg" :class="{ frozen: st === 'frozen' }">{{ c.avatar }}</div>
        <div style="flex:1">
          <div class="row">
            <h2 class="title">{{ c.name }}</h2>
            <span class="tag" :class="`tag-${st}`">{{ STATUS_LABEL[st] }}</span>
            <span class="tag tag-cool">{{ LEVEL_LABEL[c.level] }}</span>
          </div>
          <div class="muted" style="margin-top:4px">{{ c.tags || "未分类" }} · 已 {{ days }} 天未联系</div>
          <div style="margin-top:10px; padding:10px; background:#f8f8f8; border-left:2px solid #aaa; font-size:13px">
            <span class="muted">记忆锚点 · </span>{{ c.memory || "（无）" }}
          </div>
        </div>
      </div>
      <div class="bar" style="margin-top:14px"><div class="bar-fill" :class="st" :style="{ width: Math.max(5, Math.min(100, temp)) + '%' }" /></div>
      <div class="muted" style="margin-top:4px">温度 {{ Math.round(temp) }} / 100</div>
    </div>

    <!-- ta 的最近动态 -->
    <div v-if="c.latestMoment" class="box box-dashed">
      <div class="muted" style="margin-bottom:6px">— ta 最近的朋友圈 —</div>
      <div style="font-size:14px; line-height:1.6">"{{ c.latestMoment }}"</div>
    </div>

    <!-- 破冰投喂面板 -->
    <div class="box">
      <div class="row" style="justify-content:space-between; margin-bottom:10px">
        <div style="font-weight:600">破冰投喂</div>
        <div class="muted">已忽略 {{ c.ignoreCount }}/3 次<span v-if="c.ignoreCount >= 2"> · 再忽略一次将自然沉淀</span></div>
      </div>
      <label>触发理由</label>
      <textarea v-model="trigger" rows="2" />

      <div class="row" style="margin-top:10px">
        <button class="btn btn-primary" @click="onGenerate" :disabled="loading">
          {{ loading ? "生成中..." : drafts ? "重新生成" : "生成破冰文案" }}
        </button>
        <button v-if="drafts" class="btn" @click="onIgnore">都不合适</button>
      </div>

      <div v-if="drafts" style="margin-top:14px">
        <div v-for="t in TONES" :key="t.key" class="draft">
          <div class="draft-tone">[ {{ t.label }} ]</div>
          <div style="margin-bottom:8px; line-height:1.7">{{ drafts[t.key] }}</div>
          <div class="row" style="justify-content:flex-end">
            <button class="btn btn-sm btn-primary" @click="onUse(t.key)">
              {{ copiedTone === t.key ? "✓ 已复制" : "复制并跳转" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史记录 -->
    <details v-if="c.history.length > 0" class="box">
      <summary class="muted" style="cursor:pointer">历史互动记录（{{ c.history.length }}）</summary>
      <div style="margin-top:10px">
        <div v-for="(h, i) in c.history" :key="i" style="padding:8px 0; border-bottom:1px dashed #eee; font-size:13px">
          <div class="muted" style="font-size:11px">
            {{ formatTime(h.ts) }} · {{ h.trigger }} ·
            {{ h.used ? "✓ 已使用" : h.ignored ? "✗ 已忽略" : "—" }}
          </div>
          <div v-if="h.drafts && h.tone">{{ h.drafts[h.tone] }}</div>
          <div v-if="h.note">{{ h.note }}</div>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, findContact, markUsed, markIgnored } from "../store.js";
import { temperature, statusOf, daysSince, STATUS_LABEL, LEVEL_LABEL, generateDrafts } from "../utils.js";

const props = defineProps(["id"]);

const TONES = [
  { key: "respect", label: "尊敬版" },
  { key: "neutral", label: "平和版" },
  { key: "casual", label: "随意版" },
];

const c = computed(() => findContact(props.id));
const temp = computed(() => (c.value ? temperature(c.value.level, c.value.lastContact) : 0));
const st = computed(() => statusOf(temp.value));
const days = computed(() => (c.value ? daysSince(c.value.lastContact) : 0));

const trigger = ref(c.value?.latestMoment ? `ta 发了朋友圈："${c.value.latestMoment}"` : "天气转凉，想起了你");
const drafts = ref(null);
const loading = ref(false);
const copiedTone = ref(null);

function onGenerate() {
  loading.value = true;
  // 模拟异步：800ms 出结果（中保真感）
  setTimeout(() => {
    drafts.value = generateDrafts({
      name: c.value.name,
      level: c.value.level,
      memory: c.value.memory,
      trigger: trigger.value,
    });
    loading.value = false;
    copiedTone.value = null;
  }, 600);
}

async function onUse(tone) {
  const text = drafts.value[tone];
  try { await navigator.clipboard.writeText(text); } catch (e) {}
  markUsed(c.value.id, drafts.value, trigger.value, tone);
  copiedTone.value = tone;
}

function onIgnore() {
  markIgnored(c.value.id, drafts.value, trigger.value);
  drafts.value = null;
  alert(c.value.ignoreCount >= 3 ? "已移入自然沉淀区，不再提醒～" : `已忽略（${c.value.ignoreCount}/3）`);
}

function formatTime(ts) {
  return new Date(ts).toLocaleString("zh-CN");
}
</script>
