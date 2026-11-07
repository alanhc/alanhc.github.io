#!/usr/bin/env bash
#
# 本機 build + 部署到 gh-pages 分支。
#
# 為什麼存在：GitHub Actions 因帳號 billing 被鎖而無法執行，
# 所以 .github/workflows/pages.yaml 的自動部署路徑暫時失效。
# 這個腳本在本機（Mac mini）重現該 workflow 的 build 與兩道 gate，
# 再把產出推上 gh-pages 讓 Pages 的 legacy 模式吃到。
#
# 前提：Pages 的 source 必須設成 legacy / gh-pages，否則推了也不會生效：
#   gh api -X PUT repos/alanhc/alanhc.github.io/pages \
#     -f build_type=legacy -f 'source[branch]=gh-pages' -f 'source[path]=/'
#
# billing 解開後請改回 Actions 並停用這個腳本：
#   gh api -X PUT repos/alanhc/alanhc.github.io/pages -f build_type=workflow
#
# 用法：scripts/deploy-gh-pages.sh [--dry-run]

set -euo pipefail

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# workflow 用 HUGO_VERSION 這個唯一來源，這裡照抽，避免版本漂移。
HUGO_VERSION=$(grep -oE 'HUGO_VERSION: *[0-9]+\.[0-9]+\.[0-9]+' \
  .github/workflows/pages.yaml | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')

say() { printf '\n==> %s\n' "$1"; }
die() { printf '\nERROR: %s\n' "$1" >&2; exit 1; }

# --- 前置檢查 ---------------------------------------------------------
say "檢查工具鏈（目標 Hugo ${HUGO_VERSION}）"

command -v hugo >/dev/null || die "找不到 hugo。Mac mini 上安裝：brew install hugo"
command -v go   >/dev/null || die "找不到 go。安裝：brew install go"
command -v git  >/dev/null || die "找不到 git"

local_hugo=$(hugo version | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | head -1 | tr -d v)
if [[ "$local_hugo" != "$HUGO_VERSION" ]]; then
  printf 'WARNING: 本機 Hugo %s 與 CI 指定的 %s 不同。\n' "$local_hugo" "$HUGO_VERSION"
  printf '         版本不同可能產出不一樣的 HTML。建議對齊後再部署。\n'
  read -rp '仍要繼續？[y/N] ' reply
  [[ "$reply" == [yY] ]] || exit 1
fi

# hextra 是 submodule，忘記 init 會 build 出沒套 theme 的站。
if [[ ! -f themes/hextra/go.mod ]]; then
  say "初始化 theme submodule"
  git submodule update --init --recursive
fi

# 乾淨的 worktree 才能保證推上去的內容等於某個 commit。
if [[ -n "$(git status --porcelain)" ]]; then
  die "worktree 不乾淨。請先 commit 或 stash，否則無法對應部署內容到 commit。"
fi

say "同步 main"
git checkout main
git pull --ff-only

SRC_COMMIT=$(git rev-parse --short HEAD)

# --- Build ------------------------------------------------------------
# 旗標與 workflow 一致。baseURL 直接用 hugo.yaml 的值
# （https://alanhc.github.io/），不走 configure-pages 的 output。
say "建置（--gc --minify --panicOnWarning）"
rm -rf public
HUGO_ENVIRONMENT=production HUGO_ENV=production \
  hugo --gc --minify --panicOnWarning

# --- Gate 1: preflight ------------------------------------------------
say "Gate 1/2：preflight"
./scripts/preflight.sh ./public

# --- Gate 2: 內部連結 --------------------------------------------------
# 偏好 lychee（CI 跑的就是這支）；沒裝就用 scripts/linkcheck.py 代班。
# 這道 gate 一定要有人跑：之前這裡在找不到 lychee 時只印警告就跳過，
# 於是在沒裝 lychee 的機器上 gate 2 實際上是空的，壞連結會直接上線。
say "Gate 2/2：內部連結"
if command -v lychee >/dev/null; then
  echo "使用 lychee --offline"
  lychee --offline --no-progress --root-dir "$(pwd)/public" './public/**/*.html'
elif command -v python3 >/dev/null; then
  echo "找不到 lychee，改用 scripts/linkcheck.py（安裝 lychee 可與 CI 完全一致：brew install lychee）"
  python3 -I ./scripts/linkcheck.py ./public
else
  die "連結檢查無法執行：lychee 與 python3 都找不到。
  → 安裝任一個：brew install lychee  或  brew install python3
    這道 gate 不會自動跳過，否則壞連結會無聲上線。"
fi

if (( DRY_RUN )); then
  say "--dry-run：建置與 gate 都通過，未推送。產出在 ./public"
  exit 0
fi

# --- 部署 -------------------------------------------------------------
# 用獨立 worktree，不動當前工作目錄的分支。
say "部署到 gh-pages"

WORKTREE=$(mktemp -d)
cleanup() { git worktree remove --force "$WORKTREE" 2>/dev/null || true; }
trap cleanup EXIT

git fetch origin gh-pages 2>/dev/null || true
if git rev-parse --verify origin/gh-pages >/dev/null 2>&1; then
  git worktree add "$WORKTREE" gh-pages 2>/dev/null \
    || git worktree add -B gh-pages "$WORKTREE" origin/gh-pages
else
  git worktree add --detach "$WORKTREE"
  git -C "$WORKTREE" checkout --orphan gh-pages
fi

# gh-pages 上還有 2025-06 的舊站內容，必須整個清掉而不是疊上去，
# 否則舊檔案會跟新產出混在一起。保留 .git 與 CNAME。
find "$WORKTREE" -mindepth 1 -maxdepth 1 \
  ! -name .git ! -name CNAME -exec rm -rf {} +

cp -R public/. "$WORKTREE"/

# Pages 的 legacy 模式預設會跑 Jekyll，會吃掉底線開頭的目錄。
touch "$WORKTREE/.nojekyll"

git -C "$WORKTREE" add -A
if git -C "$WORKTREE" diff --cached --quiet; then
  say "產出與 gh-pages 現況相同，無需部署"
  exit 0
fi

git -C "$WORKTREE" commit -m "Deploy site from ${SRC_COMMIT}

Built locally with Hugo ${local_hugo} because GitHub Actions is
unavailable while the account is billing-locked."
git -C "$WORKTREE" push origin gh-pages

say "完成。來源 commit ${SRC_COMMIT} 已部署到 gh-pages"
echo "幾分鐘後確認：https://alanhc.github.io/"
