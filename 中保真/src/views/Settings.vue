<template>
  <div class="col" style="gap:16px; max-width:640px">
    <div>
      <h2 class="title">设置</h2>
      <div class="muted">个性化你的提醒节奏与隐私偏好</div>
    </div>

    <!-- 提醒开关 -->
    <div class="box">
      <div class="section-title" style="margin-top:0">— 提醒 —</div>
      <div class="row" style="justify-content:space-between">
        <div>
          <div><b>启用提醒</b></div>
          <div class="muted">关闭后，不再接收任何破冰建议</div>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="s.notifyEnabled" />
          <span class="slider" />
        </label>
      </div>
      <div class="row" style="justify-content:space-between; margin-top:14px; padding-top:12px; border-top:1px dashed #ddd">
        <div>
          <div><b>「体面放弃」阈值</b></div>
          <div class="muted">连续被忽略 N 次后，自动沉淀该联系人</div>
        </div>
        <div class="row" style="gap:6px">
          <button class="btn btn-sm" @click="s.ignoreLimit = Math.max(1, s.ignoreLimit-1)">−</button>
          <b style="min-width:24px; text-align:center">{{ s.ignoreLimit }}</b>
          <button class="btn btn-sm" @click="s.ignoreLimit = Math.min(10, s.ignoreLimit+1)">+</button>
        </div>
      </div>
    </div>

    <!-- 期待值阈值 -->
    <div class="box">
      <div class="section-title" style="margin-top:0">— 关系期待值 · 结冰天数 —</div>
      <div class="muted" style="margin-bottom:10px; font-size:12px">
        超过此天数未联系，会被视为"已结冰"。请按你心中真实的"理想节奏"调整。
      </div>
      <div class="col" style="gap:10px">
        <div v-for="lv in ['senior','bestie','casual']" :key="lv" class="row" style="justify-content:space-between">
          <div style="min-width:80px">
            <b>{{ levelLabel(lv) }}</b>
            <div class="muted" style="font-size:11px">{{ levelDesc(lv) }}</div>
          </div>
          <div class="row" style="gap:8px; flex:1; max-width:280px">
            <input type="range" min="7" max="365" v-model.number="s.thresholds[lv].frozen" style="flex:1" />
            <span style="min-width:60px; text-align:right">{{ s.thresholds[lv].frozen }} 天</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐私 -->
    <div class="box">
      <div class="section-title" style="margin-top:0">— 隐私 —</div>
      <div class="row" style="justify-content:space-between">
        <div>
          <div><b>读取真实通讯录</b></div>
          <div class="muted">中保真版本：始终关闭</div>
        </div>
        <label class="switch"><input type="checkbox" :checked="false" disabled /><span class="slider" /></label>
      </div>
      <div class="row" style="justify-content:space-between; margin-top:12px; padding-top:12px; border-top:1px dashed #ddd">
        <div>
          <div><b>云端同步</b></div>
          <div class="muted">中保真版本：始终关闭，所有数据仅存于本机</div>
        </div>
        <label class="switch"><input type="checkbox" :checked="false" disabled /><span class="slider" /></label>
      </div>
    </div>

    <!-- 危险区 -->
    <div class="box" style="border-color:#c4928c">
      <div class="section-title" style="margin-top:0; color:#a04a3f">— 危险区 —</div>
      <div class="row" style="justify-content:space-between">
        <div>
          <div><b>清除全部本地数据</b></div>
          <div class="muted">联系人、记忆锚点、互动记录将无法恢复</div>
        </div>
        <button class="btn" @click="onClear" style="border-color:#a04a3f; color:#a04a3f">清除</button>
      </div>
    </div>

    <div class="muted" style="text-align:center; font-size:11px; padding:20px 0">
      Social Echo · 中保真版 v0.1 · 仅用于课堂展示
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { store, clearAllData } from "../store.js";

const s = computed(() => store.settings);
const labels = { senior: "前辈", bestie: "死党", casual: "泛交" };
const descs = {
  senior: "导师/上级",
  bestie: "挚友/家人",
  casual: "弱连接",
};
function levelLabel(lv) { return labels[lv]; }
function levelDesc(lv) { return descs[lv]; }

function onClear() {
  if (confirm("确定要清除所有数据吗？此操作不可恢复。")) {
    clearAllData();
    alert("已清除，将重置为初始种子数据。");
  }
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background: #ddd;
  border: 1px solid #bbb;
  border-radius: 22px;
  cursor: pointer;
  transition: 0.2s;
}
.slider::before {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  left: 2px;
  top: 2px;
  background: #fff;
  border: 1px solid #999;
  border-radius: 50%;
  transition: 0.2s;
}
input:checked + .slider {
  background: #6b6b6b;
}
input:checked + .slider::before {
  transform: translateX(18px);
}
input:disabled + .slider {
  opacity: 0.4;
  cursor: not-allowed;
}
input[type="range"] {
  accent-color: #555;
}
</style>
