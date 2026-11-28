#!/usr/bin/env node
/* Builds assets/data/karmic-previews.json from karmic-reports/final/*.md.
   The file is PUBLIC on purpose: it holds only the section titles, a one-line hook and a short opening excerpt
   (the free teaser shown before payment) taken word for word from the real report text, plus the map
   birth-date triad -> report code. The full texts are served by the karmic-api function from the private table karmic_content.
   Usage: node scripts/build-karmic-previews.js */
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "..");
const dir = path.join(root, "karmic-reports", "final");
const out = path.join(root, "assets", "data", "karmic-previews.json");

const ds = n => String(n).split("").reduce((a, c) => a + Number(c), 0);
const red = v => { let n = Math.abs(Math.trunc(v)); while (n > 22) n = ds(n); return n || 22; };

/* every triad a birth date can produce (same rule as matrix-method-adapter.js and the SQL function karmic_triad) */
function reachableTriads() {
  const seen = new Set();
  for (let y = 1900; y <= 2100; y++) for (let m = 1; m <= 12; m++) {
    const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
    for (let d = 1; d <= dim; d++) {
      const A = red(d), B = red(m), C = red(ds(y)), D = red(A + B + C), E = red(A + B + C + D), D2 = red(D + E), D3 = red(D + D2);
      seen.add([D, D3, D2].join("-"));
    }
  }
  return [...seen].sort();
}

function parse(md) {
  const sections = []; const intro = []; let cur = null, para = [], list = [];
  const flush = () => { if (!cur) { if (para.length) intro.push(para.join(" ")); para = []; list = []; return; } if (para.length) cur.blocks.push({ t: "p", text: para.join(" ") }); if (list.length) cur.blocks.push({ t: "ul", items: list }); para = []; list = []; };
  let tagline = "";
  for (const raw of md.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (/^# /.test(line)) continue;
    if (/^شفرة:/.test(line) && !tagline) { tagline = line.replace(/^شفرة:\s*/, ""); continue; }
    if (/^## /.test(line)) { flush(); cur = { title: line.slice(3).trim(), blocks: [] }; sections.push(cur); continue; }
    if (/^### /.test(line)) { flush(); continue; }
    if (/^[-*] /.test(line)) { if (para.length && cur) { cur.blocks.push({ t: "p", text: para.join(" ") }); para = []; } list.push(line.slice(2).trim()); continue; }
    if (line === "") { flush(); continue; }
    if (list.length && cur) { cur.blocks.push({ t: "ul", items: list }); list = []; }
    para.push(line);
  }
  flush();
  return { tagline, intro, sections };
}

const plain = s => s.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
/* a short opening excerpt: whole sentences up to ~14 words, never more than 34, always left open with an ellipsis */
function excerpt(text, min, max) {
  const parts = plain(text).match(/[^.؟!؛…]+[.؟!؛…]?/g) || [plain(text)];
  let out = "", words = 0;
  for (const p of parts) {
    const seg = p.trim(), n = seg.split(" ").length;
    if (out && words + n > max) break;
    out += (out ? " " : "") + seg; words += n;
    if (words >= min) break;
  }
  let w = out.split(" ");
  if (w.length > max) out = w.slice(0, max).join(" ");
  out = out.replace(/[.؛،\s]+$/, "");
  return /[؟!]$/.test(out) ? out : out + "…";
}
function hook(text) {
  const w = plain(text).replace(/[.؟!؛،…]+$/, "").split(" ");
  return w.slice(0, 7).join(" ") + (w.length > 7 ? "…" : "");
}
function pick(section) {
  const firstP = section.blocks.find(b => b.t === "p" && plain(b.text).length >= 60);
  const firstUl = section.blocks.find(b => b.t === "ul");
  if (/أسئلة/.test(section.title) && firstUl) return firstUl.items[0];
  if (firstP) return firstP.text;
  if (firstUl) return firstUl.items[0];
  const any = section.blocks.find(b => b.t === "p");
  return any ? any.text : "";
}

const reports = {};
for (const f of fs.readdirSync(dir).filter(f => /^karmic-tail-.+\.md$/.test(f)).sort()) {
  const code = f.replace(/^karmic-tail-/, "").replace(/\.md$/, "");
  const r = parse(fs.readFileSync(path.join(dir, f), "utf8"));
  reports[code] = {
    tagline: r.tagline,
    opening: r.intro.length ? plain(r.intro[0]) : "",
    sections: r.sections.map(s => { const base = pick(s); return { title: s.title, hook: hook(base), excerpt: excerpt(base, 14, 34) }; })
  };
}

const triads = {};
for (const t of reachableTriads()) {
  const rev = t.split("-").reverse().join("-");
  triads[t] = reports[t] ? t : reports[rev] ? rev : null;
}
const missing = Object.keys(triads).filter(t => !triads[t]);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ version: 1, note: "public free previews only; full texts are private (karmic-api)", triads, reports }, null, 1));
console.log("reports:", Object.keys(reports).length, "| triads:", Object.keys(triads).length, "| triads without a report:", missing.join(" ") || "none");
console.log("wrote", path.relative(root, out), Math.round(fs.statSync(out).size / 1024) + "KB");
