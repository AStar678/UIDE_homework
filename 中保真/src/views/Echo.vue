<template>
  <div class="col" style="gap:16px">
    <div class="row" style="justify-content:space-between">
      <div>
        <h2 class="title">联系人卡片墙</h2>
        <div class="muted">按温度排序 · {{ active.length }} 位活跃 / {{ archived.length }} 位沉淀</div>
      </div>
      <div class="row">
        <button class="btn" @click="showForm = !showForm">{{ showForm ? "取消" : "+ 录入" }}</button>
        <button class="btn" @click="onReset">重置数据</button>
      </div>
    </div>

    <!-- 录入表单 -->
    <div v-if="showForm" class="box col">
      <div class="row" style="gap:8px">
        <div style="flex:1"><label>姓名 *</label><input v-model="form.name" placeholder="姓名" /></div>
        <div style="width:100px"><label>头像</label><input v-model="form.avatar" placeholder="🌸" /></div>
      </div>
      <div><label>记忆锚点</label>
        <textarea v-model="form.memory" rows="2" placeholder="例如：一起熬夜写过 MySQL 大作业的队友" /></div>
      <div class="row" style="gap:8px">
        <div style="flex:1"><label>期待值</label>
          <select v-model="form.level">
            <option value="senior">前辈</option>
            <option value="bestie">死党</option>
            <option value="casual">泛交</option>
          </select></div>
        <div style="flex:1"><label>标签</label><input v-model="form.tags" placeholder="科研,大学" /></div>
        <div style="width:120px"><label>距上次联系（天）</label><input v-model.number="form.daysAgo" type="number" /></div>
      </div>
      <div class="row" style="justify-content:flex-end">
        <button class="btn btn-primary" @click="onAdd">保存</button>
      </div>
    </div>

    <!-- 卡片网格 -->
    <div v-if="active.length === 0" class="placeholder">暂无活跃联系人，点击右上角「录入」</div>
    <div class="grid">
      <router-link
        v-for="c in active" :key="c.id"
        :to="`/echo/contact/${c.id}`"
        class="box"
        style="cursor:pointer; display:block; color:inherit"
      >
        <div class="row" style="justify-content:space-between">
          <div class="row">
            <div class="avatar" :class="{ frozen: c.st === 'frozen' }">{{ c.avatar || "👤" }}</div>
            <div>
              <div style="font-weight:600">{{ c.name }}</div>
              <div class="muted">{{ c.tags || "未分类" }}</div>
            </div>
          </div>
          <span class="tag" :class="`tag-${c.st}`">{{ STATUS_LABEL[c.st] }}</span>
        </div>
        <div class="muted" style="margin:10px 0; min-height:32px; line-height:1.5">{{ c.memory || "—" }}</div>
        <div class="row" style="justify-content:space-between; font-size:12px; color:#888">
          <span>已 {{ c.days }} 天未联系</span>
          <span>温度 {{ Math.round(c.temp) }}/100</span>
        </div>
        <div class="bar" style="margin-top:6px"><div class="bar-fill" :class="c.st" :style="{ width: Math.max(5, Math.min(100, c.temp)) + '%' }" /></div>
      </router-link>
    </div>

    <!-- 沉淀区 -->
    <details v-if="archived.length > 0" class="box">
      <summary class="muted" style="cursor:pointer">自然沉淀区（{{ archived.length }}）</summary>
      <div class="grid" style="margin-top:10px">
        <div v-for="c in archived" :key="c.id" class="muted" style="padding:8px; border:1px dashed #ddd; border-radius:3px">
          {{ c.avatar }} {{ c.name }} · 沉睡 {{ c.days }} 天
        </div>
      </div>
    </details>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { store, addContact, resetSeed } from "../store.js";
import { temperature, statusOf, daysSince, STATUS_LABEL } from "../utils.js";

const showForm = ref(false);
const form = ref({ name: "", avatar: "👤", level: "casual", memory: "", tags: "", daysAgo: 30 });

const decorated = computed(() =>
  store.contacts.map((c) => {
    const temp = temperature(c.level, c.lastContact);
    return { ...c, temp, st: statusOf(temp), days: daysSince(c.lastContact) };
  })
);
const active = computed(() => [...decorated.value.filter((c) => !c.archived)].sort((a, b) => a.temp - b.temp));
const archived = computed(() => decorated.value.filter((c) => c.archived));

function onAdd() {
  if (!form.value.name.trim()) return alert("请填写姓名");
  addContact(form.value);
  form.value = { name: "", avatar: "👤", level: "casual", memory: "", tags: "", daysAgo: 30 };
  showForm.value = false;
}
function onReset() {
  if (confirm("将清空当前数据并恢复 8 个演示联系人，确定？")) resetSeed();
}
</script>
