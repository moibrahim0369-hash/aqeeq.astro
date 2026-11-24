#!/usr/bin/env node
/* يبني index.html من index.src.html: يدمج ملفات CSS/JS المتجاورة بنفس الترتيب تمامًا
   (لا يغيّر الـCascade ولا ترتيب التنفيذ) ويضيف رقم إصدار تلقائي من محتوى الملفات.
   الاستخدام:  node scripts/build-assets.js        (التعديل يتم في index.src.html والملفات الأصلية) */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const root = path.resolve(__dirname, "..");
const SRC = path.join(root, "index.src.html"), OUT = path.join(root, "index.html");
const DIST = path.join(root, "assets", "dist");
const KEEP = 4; // عدد الإصدارات السابقة المحفوظة (لمن يحمل صفحة قديمة من الكاش)
const rd = f => fs.readFileSync(path.join(root, f), "utf8");
const hash = s => crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
const clean = u => u.split("?")[0];
/* LOCK: index.html is now the source of truth (restored from 5d82897 + Saju on 2026-11-24).
   index.src.html is stale and rebuilding from it silently drops stylesheets and hand-patched bundles.
   Refuse unless the caller knowingly sets AQ_ALLOW_STALE_SRC_BUILD=1. */
if (!process.env.AQ_ALLOW_STALE_SRC_BUILD) {
  console.error("build-assets.js is LOCKED: index.html is the source of truth, index.src.html is stale. See README_LOCK.md.");
  process.exit(1);
}
fs.mkdirSync(DIST, { recursive: true });
let html = rd("index.src.html");
const written = [];

/* ---------- CSS ---------- */
function minCss(css) {
  return css.replace(/@charset\s+"[^"]*";?/gi, "")
    .replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\/\*[\s\S]*?\*\/|\s+/g, (m, str) => str ? str : (m.charAt(0) === "/" ? "" : " "))
    .replace(/\s*([{};,])\s*/g, "$1").replace(/;}/g, "}").trim();
}
function fixUrls(css, file) {
  const dir = path.posix.dirname(file);
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
    if (/^(data:|https?:|\/|#)/.test(u)) return m;
    const abs = path.posix.normalize(path.posix.join(dir, u));
    return "url(" + q + path.posix.relative("assets/dist", abs) + q + ")";
  });
}
const linkRe = /<link\b[^>]*>/g;
function bundleCss(n) {
  const tags = [...html.matchAll(linkRe)].filter(m => /rel="stylesheet"/.test(m[0]) && !/media=|onload=/.test(m[0]) && /href="(?!https?:)[^"]+"/.test(m[0]));
  const runs = []; let cur = [];
  tags.forEach(m => { const last = cur[cur.length - 1]; if (last && /^\s*$/.test(html.slice(last.index + last[0].length, m.index))) cur.push(m); else { if (cur.length) runs.push(cur); cur = [m]; } });
  if (cur.length) runs.push(cur);
  const multi = runs.filter(r => r.length > 1);
  multi.slice().reverse().forEach(run => { const n = multi.indexOf(run) + 1;
    const parts = run.map(m => { const f = clean(m[0].match(/href="([^"]+)"/)[1]); return `.aqsrc{--f:${f}}` + minCss(fixUrls(rd(f), f)); });
    const css = parts.join("\n"), name = `aq-bundle-css${n}-${hash(css)}.css`;
    fs.writeFileSync(path.join(DIST, name), css); written.push(name);
    const first = run[0], lastT = run[run.length - 1];
    html = html.slice(0, first.index) + `<link href="assets/dist/${name}" rel="stylesheet"/>` + html.slice(lastT.index + lastT[0].length);
  });
}
/* ---------- JS ---------- */
const scrRe = /<script\b([^>]*)><\/script>/g;
const strictFirst = js => /^(?:\s|\/\*[\s\S]*?\*\/|\/\/[^\n]*\n)*['"]use strict['"]/.test(js);
function joinJs(files) { return files.map(f => `/* ${f} */\n` + rd(f).replace(/^\uFEFF/, "")).join("\n;\n"); }
function bundleJs() {
  const all = [...html.matchAll(scrRe)].map(m => { const a = m[1], src = (a.match(/\ssrc="([^"]+)"/) || [])[1]; return { m, a, src, defer: /\sdefer\b/.test(a), odd: /\sasync\b|type=|nomodule|integrity|crossorigin/.test(a) }; }).filter(x => x.src);
  all.forEach(x => { x.ok = !/^https?:/.test(x.src) && !x.odd && fs.existsSync(path.join(root, clean(x.src))) && !strictFirst(rd(clean(x.src))); });
  const edits = []; let idx = 0;
  /* غير المؤجلة: الأجزاء المتجاورة فقط (أي سكربت/وسم بينها يقطع الدمج) */
  let cur = [];
  const flush = () => { if (cur.length > 1) edits.push({ run: cur, defer: false }); cur = []; };
  all.filter(x => !x.defer).forEach(x => { const l = cur[cur.length - 1]; if (x.ok && l && /^\s*$/.test(html.slice(l.m.index + l.m[0].length, x.m.index))) cur.push(x); else { flush(); cur = x.ok ? [x] : []; } }); flush();
  /* المؤجلة: تعمل بعد التحليل بترتيب الظهور، فيُدمج المتتالي منها فقط (سكربت مستثنى بينها يقطع التسلسل) */
  cur = [];
  all.filter(x => x.defer).forEach(x => { if (x.ok) cur.push(x); else flush2(); }); flush2();
  function flush2() { if (cur.length > 1) edits.push({ run: cur, defer: true }); cur = []; }
  const repl = [];
  edits.forEach(e => {
    const js = joinJs(e.run.map(x => clean(x.src))), name = `aq-bundle-${e.defer ? "defer" : "js" + (++idx)}-${hash(js)}.js`;
    fs.writeFileSync(path.join(DIST, name), js); written.push(name);
    e.run.forEach((x, i) => repl.push({ s: x.m.index, e: x.m.index + x.m[0].length, t: i ? "" : `<script${e.defer ? " defer" : ""} src="assets/dist/${name}"></script>` }));
  });
  repl.sort((a, b) => b.s - a.s).forEach(r => { html = html.slice(0, r.s) + r.t + html.slice(r.e); });
}
bundleCss(); bundleJs();
fs.writeFileSync(OUT, html);
/* تنظيف الإصدارات القديمة: نحتفظ بآخر KEEP إصدارات */
const mf = path.join(DIST, "manifest.json");
let hist = []; try { hist = JSON.parse(fs.readFileSync(mf, "utf8")); } catch (e) {}
if (!hist.length || JSON.stringify(hist[0]) !== JSON.stringify(written)) hist.unshift(written);
hist = hist.slice(0, KEEP);
const keep = new Set(hist.flat().concat("manifest.json"));
fs.readdirSync(DIST).forEach(f => { if (!keep.has(f)) fs.unlinkSync(path.join(DIST, f)); });
fs.writeFileSync(mf, JSON.stringify(hist));
console.log("built:", written.join(", "));
