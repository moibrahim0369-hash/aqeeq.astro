/* يتأكد أن index.html الحالي هو ناتج index.src.html بالضبط (لا تعديل يدوي على index.html). */
const fs = require("fs"), cp = require("child_process"), path = require("path");
const root = path.resolve(__dirname, "..");
const before = fs.readFileSync(path.join(root, "index.html"), "utf8");
cp.execFileSync("node", [path.join(root, "scripts/build-assets.js")], { stdio: "pipe" });
const after = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (before !== after) { console.error("FAIL: index.html غير متزامن مع index.src.html — شغّل: node scripts/build-assets.js"); process.exit(1); }
console.log("PASS build is in sync");
