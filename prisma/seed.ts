import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = [
  {
    name: "陈学长",
    avatar: "🧑‍🎓",
    level: "senior",
    memory: "毕设导师组里带过我，研究脑机接口",
    tags: "科研,前辈",
    daysAgo: 120,
    moment: "新论文 accepted，感谢实验室的小伙伴！",
  },
  {
    name: "林晓棠",
    avatar: "🌸",
    level: "bestie",
    memory: "一起熬夜写过 MySQL 大作业的队友",
    tags: "旧友,大学",
    daysAgo: 95,
    moment: "今天的咖啡有点苦，像我赶 ddl 的人生。",
  },
  {
    name: "Kevin",
    avatar: "🎮",
    level: "bestie",
    memory: "周末固定开黑搭子，国服韦恩",
    tags: "游戏,死党",
    daysAgo: 18,
    moment: "新赛季出了，谁跟我五黑！",
  },
  {
    name: "周老师",
    avatar: "👔",
    level: "senior",
    memory: "实习时的 mentor，分享过很多产品方法论",
    tags: "职场,前辈",
    daysAgo: 200,
    moment: "推荐一篇关于大模型 Agent 综述的好文。",
  },
  {
    name: "小鱼",
    avatar: "🐟",
    level: "casual",
    memory: "去年行业大会上聊过一次脑机接口",
    tags: "泛交,行业",
    daysAgo: 150,
    moment: "初雪了，城市突然变得很安静。",
  },
  {
    name: "阿哲",
    avatar: "🎸",
    level: "casual",
    memory: "民谣音乐节上认识，互留微信后再没说过话",
    tags: "泛交",
    daysAgo: 300,
    moment: "新歌 demo 录完了，emo 中。",
  },
  {
    name: "Tina",
    avatar: "💼",
    level: "senior",
    memory: "校招面试官，后来加了好友",
    tags: "职场,前辈",
    daysAgo: 75,
    moment: "招人ing，欢迎推荐做产品的同学。",
  },
  {
    name: "大白",
    avatar: "🐻",
    level: "bestie",
    memory: "高中同桌，互相抄过物理作业",
    tags: "旧友,死党",
    daysAgo: 40,
    moment: "回了趟老家，老妈做的红烧肉永远天花板。",
  },
];

async function main() {
  console.log("🧹 清空旧数据...");
  await prisma.icebreaker.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.moment.deleteMany();
  await prisma.contact.deleteMany();

  for (const s of seed) {
    const lastContact = new Date(Date.now() - s.daysAgo * 86400000);
    const c = await prisma.contact.create({
      data: {
        name: s.name,
        avatar: s.avatar,
        level: s.level,
        memory: s.memory,
        tags: s.tags,
        lastContact,
      },
    });
    await prisma.moment.create({
      data: {
        contactId: c.id,
        content: s.moment,
        createdAt: new Date(Date.now() - Math.random() * 7 * 86400000),
      },
    });
  }
  console.log("✅ 已注入", seed.length, "个虚拟联系人");
}

main().finally(() => prisma.$disconnect());
