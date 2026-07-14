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

# --- Check 2: 建置產出斷言 ----------------------------------------------
# 用下限而非精確值：內容只會成長，所以這些數字幾乎不用維護，
# 但 taxonomies 壞掉那種崩塌（tags 直接歸零）一定擋得住。
MIN_TAG_PAGES=100      # 2026-07-14 實測 123
MIN_BLOG_POSTS=180     # 2026-07-14 實測 214
MIN_TOTAL_HTML=300     # 2026-07-14 實測 350

count_dirs() {
  find "$1" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' '
}

check_build_output() {
  if [[ ! -d "$PUBLIC_DIR" ]]; then
    fail "建置產出：找不到目錄 ${PUBLIC_DIR}
  → 請先建置，或用參數指定輸出目錄：scripts/preflight.sh <dir>"
    return
  fi

  local p
  for p in index.html blog/index.html projects/index.html \
           docs/index.html tags/index.html; do
    [[ -f "$PUBLIC_DIR/$p" ]] || fail "建置產出：缺少關鍵頁面 ${p}"
  done

  local tags blog total
  tags=$(count_dirs "$PUBLIC_DIR/tags")
  blog=$(count_dirs "$PUBLIC_DIR/blog")
  total=$(find "$PUBLIC_DIR" -name '*.html' -type f | wc -l | tr -d ' ')

  if (( tags < MIN_TAG_PAGES )); then
    fail "建置產出：tag 頁數 ${tags}，低於下限 ${MIN_TAG_PAGES}
  → 通常代表 hugo.yaml 的 taxonomies 區塊漏了 tag。
    自訂 taxonomies 會「取代」而非「擴充」Hugo 預設值，
    所以 tag 必須明確列出，否則全站文章的 tag 連結都會失效。"
  fi

  if (( blog < MIN_BLOG_POSTS )); then
    fail "建置產出：blog 文章數 ${blog}，低於下限 ${MIN_BLOG_POSTS}"
  fi

  if (( total < MIN_TOTAL_HTML )); then
    fail "建置產出：總 HTML 頁數 ${total}，低於下限 ${MIN_TOTAL_HTML}"
  fi
}

# --- Check 3: menu weight 必須是整數 ------------------------------------
# Hugo 的 menu weight 是 int，YAML 寫 2.5 會被截斷成 2，
# 跟另一個 weight 2 的項目打平後改用字母序 tie-break，順序就無聲錯掉。
check_menu_weights() {
  local hits
  # 開頭的 [^#]* 讓被註解掉的 weight 不會誤判。
  hits=$(grep -nE '^[^#]*weight: *[0-9]+\.[0-9]+' hugo.yaml)

  if [[ -n "$hits" ]]; then
    fail "menu weight：發現小數 weight
${hits}
  → Hugo 的 menu weight 是整數，小數會被截斷（2.5 → 2）。
    截斷後若與其他項目同值，Hugo 改用名稱字母序決定順序，
    選單會在 build 成功的情況下無聲錯掉。請改用整數。"
  fi

  # 只抓 menu: 區塊（到下一個頂層 key 為止），避免其他區塊剛好出現
  # weight: 欄位時誤判成選單項目。
  local menu_block
  menu_block=$(awk '/^menu:/ { in_menu=1; next } /^[^ #]/ { in_menu=0 } in_menu' hugo.yaml)

  # 同樣用 [^#]* 排除被註解掉的 weight，小數與整數都收（小數已截斷成整數比對）。
  local weights dup_weights
  weights=$(printf '%s\n' "$menu_block" \
    | grep -oE '^[^#]*weight: *[0-9]+' \
    | grep -oE '[0-9]+$')
  dup_weights=$(printf '%s\n' "$weights" | sort -n | uniq -d)

  if [[ -n "$dup_weights" ]]; then
    local w
    while IFS= read -r w; do
      [[ -z "$w" ]] && continue
      fail "menu weight：weight ${w} 被多個選單項目重複使用
  → 小數截斷或手動打錯數字都可能造成兩個項目的 weight 打平，
    Hugo 這時改用名稱字母序決定順序，選單會在 build 成功的情況下無聲重排。
    請確認 menu.main 底下每個項目的 weight 都不重複。"
    done <<< "$dup_weights"
  fi
}

# --- 執行 ---------------------------------------------------------------
check_hugo_version_consistency
check_build_output
check_menu_weights

if (( ${#FAILURES[@]} > 0 )); then
  echo "preflight 失敗（${#FAILURES[@]} 項）：" >&2
  printf '\n  FAIL: %s\n' "${FAILURES[@]}" >&2
  exit 1
fi

echo "preflight 全數通過"
