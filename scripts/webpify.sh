#!/usr/bin/env bash
#
# webpify.sh — convert images to repo-friendly WebP and remove the originals.
#
# Usage:  scripts/webpify.sh <image> [<image> ...]
#
# For each JPEG/PNG passed in, writes a sibling <name>.webp and deletes the
# source. Prints the before/after size so you can see the savings. Requires the
# `cwebp` encoder:  brew install webp
#
# Quality is tunable via the WEBP_QUALITY env var (1-100, default 80). 80 is
# visually indistinguishable from the original for photos while cutting size
# hard.

set -euo pipefail

QUALITY="${WEBP_QUALITY:-80}"

if ! command -v cwebp >/dev/null 2>&1; then
  echo "webpify: 'cwebp' not found. Install it with:  brew install webp" >&2
  exit 1
fi

if [ "$#" -eq 0 ]; then
  echo "webpify: no files given. Usage: scripts/webpify.sh <image> ..." >&2
  exit 1
fi

human() { # bytes -> human readable
  awk -v b="$1" 'BEGIN{ split("B KB MB GB",u); i=1; while(b>=1024 && i<4){b/=1024;i++} printf "%.0f%s", b, u[i] }'
}

for src in "$@"; do
  lc=$(printf '%s' "$src" | tr '[:upper:]' '[:lower:]')
  case "$lc" in
    *.jpg|*.jpeg|*.png) ;;
    *) echo "webpify: skipping non-JPEG/PNG file: $src" >&2; continue ;;
  esac

  if [ ! -f "$src" ]; then
    echo "webpify: file not found: $src" >&2
    continue
  fi

  dest="${src%.*}.webp"
  before=$(wc -c < "$src")

  # -q quality, -m 6 = slowest/best compression (fine, we do this once)
  cwebp -quiet -q "$QUALITY" -m 6 "$src" -o "$dest"

  after=$(wc -c < "$dest")
  rm -f "$src"

  echo "webpify: $src ($(human "$before")) -> $dest ($(human "$after"))"
done
