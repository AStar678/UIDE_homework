// 全局响应式 store + localStorage 持久化
import { reactive, watch } from "vue";

const SEED = [
  { name: "陈学长", avatar: "🧑‍🎓", level: "senior", memory: "毕设导师组里带过我，研究脑机接口", tags: "科研,前辈", daysAgo: 120, moment: "新论文 accepted，感谢实验室的小伙伴！" },
  { name: "林晓棠", avatar: "🌸", level: "bestie", memory: "一起熬夜写过 MySQL 大作业的队友", tags: "旧友,大学", daysAgo: 95, moment: "今天的咖啡有点苦，像我赶 ddl 的人生。" },
  { name: "Kevin", avatar: "🎮", level: "bestie", memory: "周末固定开黑搭子，国服韦恩", tags: "游戏,死党", daysAgo: 18, moment: "新赛季出了，谁跟我五黑！" },
  { name: "周老师", avatar: "👔", level: "senior", memory: "实习时的 mentor，分享过很多产品方法论", tags: "职场,前辈", daysAgo: 200, moment: "推荐一篇关于大模型 Agent 综述的好文。" },
  { name: "小鱼", avatar: "🐟", level: "casual", memory: "去年行业大会上聊过一次脑机接口", tags: "泛交,行业", daysAgo: 150, moment: "初雪了，城市突然变得很安静。" },
  { name: "阿哲", avatar: "🎸", level: "casual", memory: "民谣音乐节上认识，互留微信后再没说过话", tags: "泛交", daysAgo: 300, moment: "新歌 demo 录完了，emo 中。" },
  { name: "Tina", avatar: "💼", level: "senior", memory: "校招面试官，后来加了好友", tags: "职场,前辈", daysAgo: 75, moment: "招人ing，欢迎推荐做产品的同学。" },
  { name: "大白", avatar: "🐻", level: "bestie", memory: "高中同桌，互相抄过物理作业", tags: "旧友,死党", daysAgo: 40, moment: "回了趟老家，老妈做的红烧肉永远天花板。" },
];

const KEY = "social-echo-midfi-v1";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function buildSeed() {
  const now = Date.now();
  return SEED.map((s) => ({
    id: makeId(),
    name: s.name,
    avatar: s.avatar,
    level: s.level,
    memory: s.memory,
    tags: s.tags,
    lastContact: new Date(now - s.daysAgo * 86400000).toISOString(),
    ignoreCount: 0,
    archived: false,
    latestMoment: s.moment,
    momentTime: new Date(now - Math.random() * 7 * 86400000).toISOString(),
    history: [], // [{trigger, drafts, used, ignored, ts}]
  }));
}

const DEFAULT_SETTINGS = {
  onboarded: false,
  notifyEnabled: true,
  ignoreLimit: 3, // 体面放弃阈值
  thresholds: {
    senior: { warm: 60, frozen: 120 },
    bestie: { warm: 30, frozen: 60 },
    casual: { warm: 90, frozen: 180 },
  },
  privacy: {
    cloudSync: false,
    readContacts: false,
  },
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      data.settings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
      return data;
    }
  } catch (e) {}
  return { contacts: buildSeed(), settings: { ...DEFAULT_SETTINGS } };
}

export const store = reactive(load());

export function clearAllData() {
  store.contacts = buildSeed();
  store.settings = { ...DEFAULT_SETTINGS, onboarded: true };
}

// 自动持久化
watch(
  () => store,
  (v) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
    } catch (e) {}
  },
  { deep: true }
);

// —— 操作方法 ——
export function resetSeed() {
  store.contacts = buildSeed();
}

export function addContact(form) {
  const c = {
    id: makeId(),
    name: form.name,
    avatar: form.avatar || "👤",
    level: form.level || "casual",
    memory: form.memory || "",
    tags: form.tags || "",
    lastContact: new Date(Date.now() - (Number(form.daysAgo) || 0) * 86400000).toISOString(),
    ignoreCount: 0,
    archived: false,
    latestMoment: "",
    momentTime: new Date().toISOString(),
    history: [],
  };
  store.contacts.unshift(c);
  return c;
}

export function findContact(id) {
  return store.contacts.find((c) => c.id === id);
}

export function markUsed(id, drafts, trigger, tone) {
  const c = findContact(id);
  if (!c) return;
  c.history.unshift({
    trigger,
    drafts,
    tone,
    used: true,
    ignored: false,
    ts: new Date().toISOString(),
  });
  c.lastContact = new Date().toISOString();
  c.ignoreCount = 0;
  c.archived = false;
}

export function markIgnored(id, drafts, trigger) {
  const c = findContact(id);
  if (!c) return;
  c.history.unshift({
    trigger,
    drafts,
    tone: null,
    used: false,
    ignored: true,
    ts: new Date().toISOString(),
  });
  c.ignoreCount = (c.ignoreCount || 0) + 1;
  if (c.ignoreCount >= 3) c.archived = true;
}

export function interact(id, type, content) {
  const c = findContact(id);
  if (!c) return;
  c.lastContact = new Date().toISOString();
  c.ignoreCount = 0;
  c.archived = false;
  c.history.unshift({
    trigger: type === "like" ? "点赞动态" : "回复动态",
    drafts: null,
    tone: null,
    used: type !== "ignore",
    ignored: false,
    ts: new Date().toISOString(),
    note: content || "",
  });
}
