// 温度算法（同高保真版本）
const THRESHOLDS = {
  senior: { warm: 60, frozen: 120 },
  bestie: { warm: 30, frozen: 60 },
  casual: { warm: 90, frozen: 180 },
};

export function daysSince(date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

export function temperature(level, lastContact) {
  const t = THRESHOLDS[level] || THRESHOLDS.casual;
  const days = daysSince(lastContact);
  if (days <= t.warm) return Math.max(60, 100 - (days / t.warm) * 40);
  if (days >= t.frozen) return Math.max(0, 20 - (days - t.frozen) / 10);
  const ratio = (days - t.warm) / (t.frozen - t.warm);
  return 60 - ratio * 40;
}

export function statusOf(temp) {
  if (temp >= 60) return "warm";
  if (temp >= 25) return "cool";
  return "frozen";
}

export const STATUS_LABEL = { warm: "温热", cool: "常温", frozen: "结冰" };
export const LEVEL_LABEL = { senior: "前辈", bestie: "死党", casual: "泛交" };

// 中保真版本：本地模板生成三种语气文案（不调用 LLM）
export function generateDrafts({ name, level, memory, trigger }) {
  const m = memory || "之前的事";
  const t = trigger || "想起了你";
  const templates = {
    senior: {
      respect: `${name}好，刚看到${t}，让我想起当年${m}的时候。不用专门回我，看到就好~`,
      neutral: `${name}！${t}让我突然想起你，还记得${m}吗？最近怎么样，有空再聊。`,
      casual: `哈喽${name}，${t}你看了吗？瞬间想起${m}哈哈，有空唠两句。`,
    },
    bestie: {
      respect: `诶${name}，${t}让我想起${m}那段日子，挺感慨的。回不回都行~`,
      neutral: `${name}！${t}是不是又戳中你了哈哈，记得${m}吗？冒个泡。`,
      casual: `${name}！！${t}有没有！${m}那时候我俩也是绝了哈哈，唠会儿不？`,
    },
    casual: {
      respect: `${name}你好，看到${t}，想起之前${m}，问候一下。看到不用回。`,
      neutral: `${name}，${t}让我想到你，记得${m}，最近还好吗？随便聊聊。`,
      casual: `Hi ${name}，${t}让我想起${m}哈哈，最近咋样？看到再说。`,
    },
  };
  return templates[level] || templates.casual;
}
