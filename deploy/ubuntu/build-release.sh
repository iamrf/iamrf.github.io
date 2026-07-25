#!/usr/bin/env bash
# Create a release tarball from dist/ for offline transfer.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
npm ci
npm test
npm run build
OUT="${1:-portfolio-release.tar.gz}"
tar -czf "$OUT" -C dist .
ls -lh "$OUT"
