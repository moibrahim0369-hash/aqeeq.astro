# Home/pages lock (2026-11-24)

`index.html` is the source of truth. It is the 5d82897 state (the version the owner approved) plus the Saju additions.
`index.src.html` is a stale snapshot: it lacks stylesheet links and hand-patched bundles that live in index.html and
`assets/dist/aq-bundle-css2-2b2664e18c.css` / `aq-bundle-css3-7209da45fe.css`.
Rebuilding from it (commit a83d651) broke the live site, so `scripts/build-assets.js` now refuses to run.
Edit `index.html` directly. Run `bash tests/check-index-lock.sh` before every push.
