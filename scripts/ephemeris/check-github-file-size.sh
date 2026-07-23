#!/usr/bin/env bash
set -euo pipefail

limit=$((100 * 1024 * 1024))
if git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectsize) %(objectname) %(rest)' | awk -v limit="$limit" '
  $1 == "blob" && $2 >= limit { print; oversized = 1 }
  END { exit oversized }
'; then
  echo "All reachable Git blobs are below GitHub's 100 MiB limit."
else
  echo "Found reachable blob(s) at or above GitHub's 100 MiB limit." >&2
  exit 1
fi
