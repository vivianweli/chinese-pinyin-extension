#!/bin/bash
# Builds a clean ZIP for Chrome Web Store upload: ./dist/chinese-pinyin-helper-v<version>.zip
# Only the files Chrome needs at runtime (plus LICENSE/NOTICE for CC-CEDICT attribution) are included.
set -euo pipefail

cd "$(dirname "$0")/.."

VERSION=$(python3 -c "import json; print(json.load(open('manifest.json'))['version'])")
OUTPUT="dist/chinese-pinyin-helper-v${VERSION}.zip"

mkdir -p dist
rm -f "$OUTPUT"

zip -X "$OUTPUT" \
  manifest.json background.js \
  content.js \
  dictionary.js \
  popup.html popup.css popup.js \
  icons/icon-16.png icons/icon-48.png icons/icon-128.png \
  LICENSE NOTICE

echo "Packaged: $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"
unzip -l "$OUTPUT"
