<template>
  <div class="app-shell">
    <nav class="nav">
      <router-link to="/" class="brand">[ 社交回声 · 中保真 ]</router-link>
      <div class="links">
        <router-link to="/" :class="{ active: $route.path === '/' }">首页</router-link>
        <router-link to="/echo" :class="{ active: $route.path.startsWith('/echo') }">主产品</router-link>
        <router-link to="/notifications" :class="{ active: $route.path === '/notifications' }" class="with-badge">
          通知<span v-if="frozenCount > 0" class="badge">{{ frozenCount }}</span>
        </router-link>
        <router-link to="/social" :class="{ active: $route.path === '/social' }">朋友圈</router-link>
        <router-link to="/report" :class="{ active: $route.path === '/report' }">报告</router-link>
        <router-link to="/settings" :class="{ active: $route.path === '/settings' }">设置</router-link>
      </div>
    </nav>
    <router-view />
    <div class="muted" style="text-align:center; margin-top:30px; padding-top:14px; border-top:1px dashed #ddd">
      Social Echo · Vue 3 中保真原型 · 数据存于浏览器 localStorage
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { store } from "./store.js";
import { temperature, statusOf } from "./utils.js";

const frozenCount = computed(() =>
  store.contacts
    .filter((c) => !c.archived)
    .filter((c) => statusOf(temperature(c.level, c.lastContact)) === "frozen").length
);
</script>

<style scoped>
.with-badge {
  position: relative;
}
.badge {
  display: inline-block;
  margin-left: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  color: #fff;
  background: #a04a3f;
  border-radius: 8px;
  vertical-align: 1px;
}
</style>
