#!/usr/bin/env bash
#
# Preflight checks for the Hugo site.
#
# Every check here asserts on config or on build output, never on the build
# merely exiting successfully: the two bugs this guards against both built
# with exit code 0 and zero warnings. See
# docs/superpowers/specs/2026-07-14-preflight-design.md
#
# Usage: scripts/preflight.sh [build-output-dir]    (default: ./public)

# No -e: every check must run so one invocation reports every problem.
set -uo pipefail

PUBLIC_DIR="${1:-./public}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT" || exit 1

FAILURES=()

fail() { FAILURES+=("$1"); }

# --- Check 1: Hugo 版本一致性 ------------------------------------------
# 版本號在三個檔案各寫一份，升級時很容易只改到一兩處。
check_hugo_version_consistency() {
  local pages netlify devcontainer

  pages=$(grep -oE 'HUGO_VERSION: *[0-9]+\.[0-9]+\.[0-9]+' \
    .github/workflows/pages.yaml | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
  netlify=$(grep -oE 'HUGO_VERSION *= *"[0-9]+\.[0-9]+\.[0-9]+"' \
    netlify.toml | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
  # node feature 沒有版本號，所以要先框住 hugo feature 再抽。
  devcontainer=$(grep -A3 'features/hugo' .devcontainer/devcontainer.json \
    | grep -oE '"version" *: *"[0-9]+\.[0-9]+\.[0-9]+"' \
    | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')

  if [[ -z "$pages" || -z "$netlify" || -z "$devcontainer" ]]; then
    fail "Hugo 版本一致性：有來源抽不到版本號
      pages.yaml='${pages}' netlify.toml='${netlify}' devcontainer.json='${devcontainer}'
  → 檔案格式可能變了，請同步更新 scripts/preflight.sh 的抽取規則。"
    return
  fi

  if [[ "$pages" != "$netlify" || "$pages" != "$devcontainer" ]]; then
    fail "Hugo 版本一致性：三處版本不一致
      .github/workflows/pages.yaml     ${pages}
      netlify.toml                     ${netlify}
      .devcontainer/devcontainer.json  ${devcontainer}
  → 升級 Hugo 時這三處必須一起改。"
  fi
}

# --- 執行 ---------------------------------------------------------------
check_hugo_version_consistency

if (( ${#FAILURES[@]} > 0 )); then
  echo "preflight 失敗（${#FAILURES[@]} 項）：" >&2
  printf '\n  FAIL: %s\n' "${FAILURES[@]}" >&2
  exit 1
fi

echo "preflight 全數通過"
