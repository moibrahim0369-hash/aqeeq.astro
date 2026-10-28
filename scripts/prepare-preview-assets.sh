#!/bin/sh
set -eu
# Stage only repository working-tree files for preview static assets.
# Never copy Git internals, Wrangler temp files, dependencies, or the staging folder.
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
STAGE="$ROOT/.preview-assets"
rm -rf "$STAGE"
mkdir -p "$STAGE"
find "$ROOT" -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.wrangler' \
  ! -name 'node_modules' \
  ! -name '.preview-assets' \
  ! -name '.github' \
  ! -name 'tests' \
  ! -name 'docs' \
  ! -name 'scripts' \
  ! -name 'wrangler.preview.jsonc' \
  ! -name 'wrangler.preview.app.jsonc' \
  ! -name 'wrangler.preview.astro.jsonc' \
  ! -name '.gitignore' \
  -exec cp -R {} "$STAGE/" \;
if find "$STAGE" -path '*/.git/*' -print -quit | grep -q .; then
  echo "Refusing preview: .git files found in staged assets" >&2
  exit 1
fi
printf 'Preview assets staged without .git, .wrangler, or node_modules.\n'
