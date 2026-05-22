import OpenAI from "openai";

export type IcebreakerInput = {
  name: string;
  level: string; // senior/bestie/casual
  memory: string;
  tags: string;
  daysSilent: number;
  trigger: string; // 触发理由文本
};

export type IcebreakerOutput = {
  respect: string;
  neutral: string;
  casual: string;
};

const SYSTEM_PROMPT = `你是"社交回声"的破冰文案助理。你需要为用户生成 3 条破冰开场白，分别对应 3 种语气：尊敬版(respect)、平和版(neutral)、随意版(casual)。

【严格遵守】
- 严禁"班味"、严禁说教、严禁工作汇报口吻
- 不要功利感（不要"请教""请教一下""麻烦您"等开头）
- 口语化、自然、像真人闲聊
- 每条不超过 50 个字
- 结构建议：[问候/感叹] + [回忆点 or 触发理由] + [自然延展] + [免压结尾]
- 免压结尾示例：不用专门回我啦 / 看到再说 / 有空再聊
- 直接输出 JSON：{"respect":"...","neutral":"...","casual":"..."}，不要任何额外文字`;

function buildUserPrompt(i: IcebreakerInput): string {
  const levelMap: Record<string, string> = {
    senior: "前辈/老师（语气需更得体）",
    bestie: "死党（可以放飞、玩梗）",
    casual: "泛泛之交（自然、不亲不疏）",
  };
  return `联系人姓名：${i.name}
关系类型：${levelMap[i.level] || "泛交"}
记忆锚点：${i.memory || "（无）"}
领域标签：${i.tags || "（无）"}
已 ${i.daysSilent} 天未联系
触发理由：${i.trigger}

请生成三种语气的破冰文案。`;
}

// Mock 模式：不依赖 LLM，用模板直接出三条
function mockGenerate(i: IcebreakerInput): IcebreakerOutput {
  const m = i.memory || "之前的事";
  const t = i.trigger;
  return {
    respect: `${i.name}好，刚看到${t}，让我想起当年${m}的时候，挺感慨的。不用专门回，看到就好~`,
    neutral: `${i.name}！${t}让我突然想起你，还记得${m}吗？最近怎么样，有空再聊。`,
    casual: `哈喽${i.name}，${t}你看了吗？瞬间脑子里冒出${m}的画面哈哈，有空唠两句。`,
  };
}

export async function generateIcebreakers(
  i: IcebreakerInput
): Promise<IcebreakerOutput> {
  const provider = process.env.LLM_PROVIDER || "mock";
  if (provider === "mock" || !process.env.OPENAI_API_KEY) {
    return mockGenerate(i);
  }
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    });
    const resp = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(i) },
      ],
    });
    const text = resp.choices[0]?.message?.content || "{}";
    const json = JSON.parse(text);
    return {
      respect: json.respect || "",
      neutral: json.neutral || "",
      casual: json.casual || "",
    };
  } catch (e) {
    console.error("[LLM] fallback to mock:", e);
    return mockGenerate(i);
  }
}
