// 把 Vue / Vue Router 运行库内联到 single-source.html 中，输出为单文件 HTML
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.dirname(__filename);
const OUT = path.resolve(ROOT, "../../社交回声-中保真.html");

const tpl   = fs.readFileSync(path.join(ROOT, "single-source.html"), "utf8");
const vue   = fs.readFileSync(path.join(ROOT, "node_modules/vue/dist/vue.global.prod.js"), "utf8");
const router= fs.readFileSync(path.join(ROOT, "node_modules/vue-router/dist/vue-router.global.prod.js"), "utf8");

const final = tpl
  .replace("__VUE_RUNTIME__", () => "\n" + vue + "\n")
  .replace("__VUE_ROUTER_RUNTIME__", () => "\n" + router + "\n");

fs.writeFileSync(OUT, final, "utf8");
const kb = (Buffer.byteLength(final) / 1024).toFixed(1);
console.log(`✅ 已生成: ${OUT}  (${kb} KB)`);
