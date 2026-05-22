<template>
  <div class="col" style="gap:16px">
    <h2 class="title">社交能量报告</h2>

    <!-- 能量环 -->
    <div class="box energy-ring" style="padding:30px">
      <svg viewBox="0 0 100 100" width="160" height="160" style="transform:rotate(-90deg)">
        <circle cx="50" cy="50" r="42" stroke="#e8e8e8" stroke-width="8" fill="none" />
        <circle cx="50" cy="50" r="42" stroke="#888" stroke-width="8" fill="none"
          stroke-linecap="round" :stroke-dasharray="`${(energy / 100) * 264} 264`" />
      </svg>
      <div style="margin-top:-110px">
        <div class="energy-num">{{ energy }}</div>
        <div class="muted" style="text-align:center">本周能量</div>
      </div>
      <div style="margin-top:80px; max-width:400px; text-align:center; color:#555; line-height:1.7">
        {{ energyText }}
      </div>
    </div>

    <!-- 温度分布 -->
    <div class="section-title">— 温度分布 —</div>
    <div class="grid">
      <div class="box">
        <div class="muted">温热</div>
        <div style="font-size:24px; font-weight:600; margin:4px 0">{{ stats.warm }}</div>
        <div class="bar"><div class="bar-fill warm" :style="{ width: ratio(stats.warm) + '%' }" /></div>
      </div>
      <div class="box">
        <div class="muted">常温</div>
        <div style="font-size:24px; font-weight:600; margin:4px 0">{{ stats.cool }}</div>
        <div class="bar"><div class="bar-fill cool" :style="{ width: ratio(stats.cool) + '%' }" /></div>
      </div>
      <div class="box">
        <div class="muted">结冰</div>
        <div style="font-size:24px; font-weight:600; margin:4px 0">{{ stats.frozen }}</div>
        <div class="bar"><div class="bar-fill frozen" :style="{ width: ratio(stats.frozen) + '%' }" /></div>
      </div>
    </div>

    <!-- 互动统计 -->
    <div class="section-title">— 互动统计 —</div>
    <div class="grid">
      <div class="box" style="text-align:center">
        <div style="font-size:24px; font-weight:600">{{ totalIcebreakers }}</div>
        <div class="muted">生成的破冰建议</div>
      </div>
      <div class="box" style="text-align:center">
        <div style="font-size:24px; font-weight:600">{{ usedCount }}</div>
        <div class="muted">实际使用</div>
      </div>
      <div class="box" style="text-align:center">
        <div style="font-size:24px; font-weight:600">{{ archivedCount }}</div>
        <div class="muted">自然沉淀</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../store.js";
import { temperature, statusOf } from "../utils.js";

const active = computed(() => store.contacts.filter((c) => !c.archived));
const stats = computed(() => {
  const s = { warm: 0, cool: 0, frozen: 0 };
  active.value.forEach((c) => s[statusOf(temperature(c.level, c.lastContact))]++);
  return s;
});
const total = computed(() => active.value.length || 1);
function ratio(v) { return (v / total.value) * 100; }

const allHistory = computed(() => store.contacts.flatMap((c) => c.history.filter((h) => h.drafts)));
const totalIcebreakers = computed(() => allHistory.value.length);
const usedCount = computed(() => allHistory.value.filter((h) => h.used).length);
const ignoredCount = computed(() => allHistory.value.filter((h) => h.ignored).length);
const archivedCount = computed(() => store.contacts.filter((c) => c.archived).length);

const energy = computed(() => {
  const warmRate = stats.value.warm / total.value;
  const useRate = totalIcebreakers.value > 0 ? usedCount.value / totalIcebreakers.value : 0.5;
  const ignoreRate = totalIcebreakers.value > 0 ? ignoredCount.value / totalIcebreakers.value : 0;
  return Math.round((warmRate * 0.6 + useRate * 0.3 + (1 - ignoreRate) * 0.1) * 100);
});
const energyText = computed(() => {
  if (energy.value >= 70) return "你这周维护了很多重要的关系，继续保持~";
  if (energy.value >= 40) return "有一些联系人正在降温，找几个顺手的理由聊聊吧。";
  return "通讯录里很多关系正在结冰，但别有压力——挑你最想维护的开始就好。";
});
</script>
