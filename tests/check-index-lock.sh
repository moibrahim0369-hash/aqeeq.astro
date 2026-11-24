#!/bin/bash
# Fails if index.html lost the stylesheets/bundles of the approved state.
cd "$(dirname "$0")/.." || exit 1
ok=1
for k in aq-bundle-css2-2b2664e18c.css aq-bundle-css3-7209da45fe.css matrix-compact-glass.css natal-input-sample.css matrix-field-clarity.css vedic-input-clarity.css home-final-embedded.css astro-extra-inputs.css saju-matrix.css karmic-input.css karmic-input.js 'href="#saju"'; do
  grep -q -F -- "$k" index.html || { echo "MISSING in index.html: $k"; ok=0; }
done
for f in assets/dist/aq-bundle-css2-2b2664e18c.css assets/dist/aq-bundle-css3-7209da45fe.css; do [ -f $f ] || { echo "MISSING file $f"; ok=0; }; done
[ $ok = 1 ] && echo "index lock OK" || exit 1
