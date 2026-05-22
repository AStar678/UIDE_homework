<template>
  <div style="max-width: 540px; margin: 40px auto">
    <div class="box" style="padding: 28px 24px">
      <!-- 进度条 -->
      <div class="row" style="gap: 4px; margin-bottom: 24px">
        <div v-for="i in 3" :key="i" class="bar" style="flex:1; height:3px">
          <div class="bar-fill" :class="step >= i ? 'warm' : ''" :style="{ width: step >= i ? '100%' : '0%' }" />
        </div>
      </div>

      <!-- 步骤 1 -->
      <div v-if="step === 1">
        <div class="muted" style="font-size:11px; letter-spacing:2px">[ STEP 1/3 ]</div>
        <h2 class="title" style="margin:8px 0 12px">先聊聊你的"通讯录"</h2>
        <p style="color:#555; line-height:1.8">
          你的微信里，是不是也躺着一些<b>熟悉又陌生</b>的名字？<br>
          曾经一起熬夜写代码、行业活动相谈甚欢，但对话框停在了半年前。<br><br>
          社交回声不替你寒暄，只在<b>合适的时机</b>给你一个<b>顺手</b>的开口理由。
        </p>
        <div class="placeholder" style="margin-top:14px">
          [ 插画占位 · 通讯录沉睡示意图 ]
        </div>
      </div>

      <!-- 步骤 2 -->
      <div v-else-if="step === 2">
        <div class="muted" style="font-size:11px; letter-spacing:2px">[ STEP 2/3 ]</div>
        <h2 class="title" style="margin:8px 0 12px">三件事，社交回声只做这三件</h2>
        <div class="col" style="gap:10px; margin-top:14px">
          <div class="box box-dashed">
            <b>① 结冰预警</b><div class="muted" style="margin-top:4px">超期未联系 → 头像视觉化结冰，避免重要关系被遗忘</div>
          </div>
          <div class="box box-dashed">
            <b>② 破冰投喂</b><div class="muted" style="margin-top:4px">基于动态、天气、资讯，生成尊敬/平和/随意三种语气</div>
          </div>
          <div class="box box-dashed">
            <b>③ 体面放弃</b><div class="muted" style="margin-top:4px">连续 3 次忽略 → 自然沉淀，承认关系的阶段性</div>
          </div>
        </div>
      </div>

      <!-- 步骤 3 -->
      <div v-else>
        <div class="muted" style="font-size:11px; letter-spacing:2px">[ STEP 3/3 ]</div>
        <h2 class="title" style="margin:8px 0 12px">隐私承诺</h2>
        <ul style="color:#555; line-height:1.9; padding-left:20px">
          <li>所有联系人 / 记忆锚点 <b>仅存于本机</b></li>
          <li>不读取、不上传你的真实通讯录</li>
          <li>仅在你主动点击「生成文案」时调用 AI</li>
          <li>随时可在设置中清除全部数据</li>
        </ul>
        <div class="box box-dashed" style="margin-top:14px">
          <label style="display:flex; align-items:center; gap:8px; margin:0; cursor:pointer">
            <input type="checkbox" v-model="agree" style="width:auto" />
            我已阅读并同意上述隐私承诺
          </label>
        </div>
      </div>

      <!-- 操作 -->
      <div class="row" style="justify-content:space-between; margin-top:24px">
        <button v-if="step > 1" class="btn" @click="step--">← 上一步</button>
        <span v-else class="muted" style="cursor:pointer" @click="skip">跳过引导 →</span>
        <button v-if="step < 3" class="btn btn-primary" @click="step++">下一步</button>
        <button v-else class="btn btn-primary" :disabled="!agree" @click="finish">开始使用</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { store } from "../store.js";

const router = useRouter();
const step = ref(1);
const agree = ref(false);

function finish() {
  store.settings = store.settings || {};
  store.settings.onboarded = true;
  router.replace("/echo");
}
function skip() {
  store.settings = store.settings || {};
  store.settings.onboarded = true;
  router.replace("/echo");
}
</script>
