# Preflight 檢查實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 CI 部署前擋下「build 成功但內容錯掉」的 Hugo 設定 bug。

**Architecture:** 新增 `scripts/preflight.sh`（純 bash、零依賴）做三項檢查（Hugo 版本一致性、建置產出斷言、menu weight lint），由現有的 `.github/workflows/pages.yaml` 在 `upload-artifact` **之前**呼叫；死連結檢查用 `lychee --offline` 作為獨立 step，同樣擋在 upload 之前。檢查失敗 → artifact 不上傳 → 不部署 → 線上維持舊版。

**Tech Stack:** bash、GitHub Actions、Hugo 0.147.7 (extended)、lycheeverse/lychee-action。

規格文件：`docs/superpowers/specs/2026-07-14-preflight-design.md`

## Global Constraints

- **不刪除任何既有檔案或設定。** 驗證過程中所有「故意弄壞」的改動都必須還原。
- 檢查失敗時必須印出**具體壞了什麼與預期值**，不可只回傳 exit 1。
- `preflight.sh` 跑完所有檢查才回報，不在第一個失敗就中斷。
- 純 bash，不新增執行期依賴（lychee 例外，且它只存在於 CI workflow，不進 script）。
- 數量下限：tag 頁 ≥ **100**（現值 123）、blog 文章 ≥ **180**（現值 214）、總 HTML ≥ **300**（現值 350）。
- Hugo 版本號的三個來源：`.github/workflows/pages.yaml`、`netlify.toml`、`.devcontainer/devcontainer.json`（現值皆 0.147.7）。
- 本機 Hugo 是 0.159.1，**無法建置本站**（hextra v0.9.7 用了已被移除的 `.Site.Author`）。任何需要建置產出的驗證，必須用 Task 2 步驟 1 下載的 0.147.7。

---

## File Structure

| 檔案 | 責任 |
|------|------|
| `scripts/preflight.sh`（新增） | 三項檢查的全部邏輯。單一職責：斷言設定與建置產出的正確性。 |
| `.github/workflows/pages.yaml`（修改） | 只加三處：build 加 `--panicOnWarning`、preflight step、lychee step。不動既有結構。 |

---

### Task 1: preflight.sh 骨架 + Hugo 版本一致性檢查

**Files:**
- Create: `scripts/preflight.sh`

**Interfaces:**
- Consumes: 無（第一個 task）
- Produces: `fail <msg>` 函式（把訊息累積進 `FAILURES` 陣列）、`PUBLIC_DIR` 變數（建置輸出目錄，預設 `./public`）、`REPO_ROOT` 變數。Task 2、3 的檢查函式依賴這三者。script 對外介面：`scripts/preflight.sh [build-output-dir]`，全過 exit 0，任一失敗 exit 1。

- [ ] **Step 1: 先弄壞版本一致性，建立失敗條件**

```bash
cd /Users/alantseng/workspace/alanhc.github.io
sed -i '' 's/HUGO_VERSION = "0.147.7"/HUGO_VERSION = "0.999.0"/' netlify.toml
grep HUGO_VERSION netlify.toml
```

預期輸出：`HUGO_VERSION = "0.999.0"`

- [ ] **Step 2: 確認目前沒有任何東西擋得住**

```bash
ls scripts/preflight.sh
```

預期：`No such file or directory` —— 這證明失敗條件目前無人看守。

- [ ] **Step 3: 寫出 script 骨架與版本一致性檢查**

建立 `scripts/preflight.sh`：

```bash
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
```

然後加執行權限：

```bash
chmod +x scripts/preflight.sh
```

- [ ] **Step 4: 跑 script，確認它擋得住**

```bash
./scripts/preflight.sh; echo "exit=$?"
```

預期：exit=1，且訊息列出三處版本 `0.147.7 / 0.999.0 / 0.147.7`。

- [ ] **Step 5: 還原 netlify.toml，確認回到綠燈**

`netlify.toml` 此時除了我們故意改壞的那行之外沒有其他未提交改動，所以直接用 git 還原 —— 比 sed 改回去更可靠，而且 `git diff` 為空本身就是還原成功的證明。

```bash
git checkout -- netlify.toml
git diff --stat netlify.toml
./scripts/preflight.sh; echo "exit=$?"
```

預期：`git diff --stat` 無輸出（檔案已完全還原），script 印出「preflight 全數通過」且 exit=0。

**此時 `PUBLIC_DIR` 預設的 `./public` 若不存在，Task 2 的檢查尚未實作故不影響；本 task 只驗證版本檢查。**

- [ ] **Step 6: Commit**

```bash
git add scripts/preflight.sh
git commit -m "Add preflight script with Hugo version consistency check

The Hugo version is duplicated across the Pages workflow, netlify.toml
and the devcontainer, so an upgrade that misses one silently builds the
site with a different Hugo than it deploys with."
```

---

### Task 2: 建置產出斷言

**Files:**
- Modify: `scripts/preflight.sh`

**Interfaces:**
- Consumes: `fail`、`PUBLIC_DIR`（Task 1）
- Produces: `check_build_output()` 函式。

- [ ] **Step 1: 取得能建置本站的 Hugo（本機 0.159.1 不行）**

```bash
WORK=$(mktemp -d)
curl -sL -o "$WORK/hugo.tar.gz" \
  https://github.com/gohugoio/hugo/releases/download/v0.147.7/hugo_extended_0.147.7_darwin-universal.tar.gz
tar xzf "$WORK/hugo.tar.gz" -C "$WORK"
"$WORK/hugo" version
echo "WORK=$WORK"    # 後續步驟會用到，記下來
```

預期：印出 `hugo v0.147.7-... +extended`。
（非 macOS 請改用對應平台的 release 檔名。）

- [ ] **Step 2: 弄壞 taxonomies，產生一份壞掉的 build**

```bash
sed -i '' '/^  tag: tags$/d' hugo.yaml       # 重現原本的 bug（用 git 還原，不需備份）
"$WORK/hugo" --gc --minify --destination "$WORK/public-broken" 2>&1 | grep -E 'Pages|ERROR'
find "$WORK/public-broken/tags" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l
```

預期：Pages 約 235（而非 483），tags 目錄數為 `0`。
**注意 build 是成功的、沒有 ERROR** —— 這正是本檢查存在的理由。

- [ ] **Step 3: 確認現有的 preflight 抓不到這個 bug**

```bash
./scripts/preflight.sh "$WORK/public-broken"; echo "exit=$?"
```

預期：exit=0「全數通過」。版本檢查對這個 bug 無效，證明需要 Task 2 的檢查。

- [ ] **Step 4: 實作建置產出斷言**

在 `scripts/preflight.sh` 中，於 `check_hugo_version_consistency()` 函式**之後**、`# --- 執行 ---` 區塊**之前**插入：

```bash
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
```

並把執行區塊改成：

```bash
# --- 執行 ---------------------------------------------------------------
check_hugo_version_consistency
check_build_output
```

- [ ] **Step 5: 確認它擋得住壞掉的 build**

```bash
./scripts/preflight.sh "$WORK/public-broken"; echo "exit=$?"
```

預期：exit=1，訊息指出 `tag 頁數 0，低於下限 100`，並解釋 taxonomies 的成因。

- [ ] **Step 6: 還原 hugo.yaml，用正常 build 確認綠燈**

```bash
git checkout -- hugo.yaml
git diff --stat hugo.yaml                    # 必須無輸出
"$WORK/hugo" --gc --minify --destination "$WORK/public-good" 2>&1 | grep -E 'Pages|ERROR'
./scripts/preflight.sh "$WORK/public-good"; echo "exit=$?"
```

預期：`git diff --stat` 無輸出、Pages 約 483、script exit=0。

保留 `$WORK/public-good` —— Task 3 會用到（Task 3 步驟 1 也能自行重建）。

- [ ] **Step 7: Commit**

```bash
git add scripts/preflight.sh
git commit -m "Assert on build output in preflight

A taxonomies block that omits tag drops 248 pages and every tag link on
the site while Hugo still exits 0 with no warnings, so only an assertion
on what was actually produced catches it. Floors rather than exact counts,
so publishing a post does not require touching this script."
```

---

### Task 3: menu weight lint

**Files:**
- Modify: `scripts/preflight.sh`

**Interfaces:**
- Consumes: `fail`（Task 1）
- Produces: `check_menu_weights()` 函式。

- [ ] **Step 0: 確保有 Hugo 0.147.7 與一份正常 build**

本 task 若在新的 shell / 新的 agent 執行，Task 2 的 `$WORK` 不會留下來。以下指令無論接續或全新都能用（已存在就跳過重建）：

```bash
cd /Users/alantseng/workspace/alanhc.github.io
WORK="${WORK:-$(mktemp -d)}"
if [[ ! -x "$WORK/hugo" ]]; then
  curl -sL -o "$WORK/hugo.tar.gz" \
    https://github.com/gohugoio/hugo/releases/download/v0.147.7/hugo_extended_0.147.7_darwin-universal.tar.gz
  tar xzf "$WORK/hugo.tar.gz" -C "$WORK"
fi
if [[ ! -f "$WORK/public-good/index.html" ]]; then
  "$WORK/hugo" --gc --minify --destination "$WORK/public-good" 2>&1 | grep -E 'Pages|ERROR'
fi
echo "WORK=$WORK"
"$WORK/hugo" version
```

預期：印出 `hugo v0.147.7-... +extended`，且 `$WORK/public-good` 存在。

- [ ] **Step 1: 弄壞 menu weight，重現排序 regression**

```bash
sed -i '' 's/^      weight: 4$/      weight: 2.5/' hugo.yaml
grep -n 'weight: 2.5' hugo.yaml
```

預期：印出 CV 那一行的 `weight: 2.5`。

- [ ] **Step 2: 確認現有 preflight 抓不到**

```bash
./scripts/preflight.sh "$WORK/public-good"; echo "exit=$?"
```

預期：exit=0。前兩項檢查都對這個 bug 無效。

- [ ] **Step 3: 實作 weight lint**

在 `check_build_output()` **之後**、`# --- 執行 ---` **之前**插入：

```bash
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
}
```

執行區塊改成：

```bash
# --- 執行 ---------------------------------------------------------------
check_hugo_version_consistency
check_build_output
check_menu_weights
```

- [ ] **Step 4: 確認它擋得住**

```bash
./scripts/preflight.sh "$WORK/public-good"; echo "exit=$?"
```

預期：exit=1，訊息含 `weight: 2.5` 的行號與截斷的解釋。

- [ ] **Step 5: 還原並確認綠燈**

```bash
git checkout -- hugo.yaml
git diff --stat hugo.yaml                    # 必須無輸出
./scripts/preflight.sh "$WORK/public-good"; echo "exit=$?"
```

預期：無 diff、exit=0「preflight 全數通過」。

- [ ] **Step 6: Commit**

```bash
git add scripts/preflight.sh
git commit -m "Lint menu weights for truncation in preflight

Hugo truncates float menu weights to int, so 2.5 collides with 2 and the
tie breaks alphabetically -- which silently reordered the navbar in
1fb8d806 with a clean build."
```

---

### Task 4: 接進 deploy workflow

**Files:**
- Modify: `.github/workflows/pages.yaml`

**Interfaces:**
- Consumes: `scripts/preflight.sh`（Task 1–3）
- Produces: 無（workflow 是終端消費者）

- [ ] **Step 1: 加 `--panicOnWarning` 並插入 preflight step**

修改 `.github/workflows/pages.yaml`。把 `Build with Hugo` step 改成：

```yaml
      - name: Build with Hugo
        env:
          # For maximum backward compatibility with Hugo modules
          HUGO_ENVIRONMENT: production
          HUGO_ENV: production
        run: |
          hugo \
            --gc --minify --panicOnWarning \
            --baseURL "${{ steps.pages.outputs.base_url }}/"
```

並在 `Build with Hugo` 與 `Upload artifact` **之間**插入：

```yaml
      - name: Preflight
        run: ./scripts/preflight.sh ./public
```

`Upload artifact` step 本身不動。

- [ ] **Step 2: 確認 step 順序正確**

```bash
grep -n 'name: Build with Hugo\|name: Preflight\|name: Upload artifact\|panicOnWarning' .github/workflows/pages.yaml
```

預期：行號順序為 Build → panicOnWarning → Preflight → Upload artifact。順序錯了就等於沒擋。

- [ ] **Step 3: 確認 script 在 CI 有執行權限**

```bash
git ls-files -s scripts/preflight.sh
```

預期：mode `100755`（不是 `100644`）。若為 644：

```bash
chmod +x scripts/preflight.sh && git add scripts/preflight.sh
```

- [ ] **Step 4: Commit 並 push，觀察 CI**

```bash
git add .github/workflows/pages.yaml
git commit -m "Gate deploy on preflight

Runs before upload-artifact, so a failure means this change does not ship
rather than the live site breaking: Pages keeps serving the last good
build when no artifact is uploaded."
git push origin main
gh run watch
```

預期：workflow 綠燈，Preflight step 印出「preflight 全數通過」。

- [ ] **Step 5: 驗證閘門真的會擋（在分支上做，不碰 main）**

```bash
git checkout -b preflight-gate-test
sed -i '' '/^  tag: tags$/d' hugo.yaml
git commit -am "TEMP: break taxonomies to prove the gate works"
git push origin preflight-gate-test
```

到 GitHub Actions 手動觸發此分支的 workflow（`workflow_dispatch`），預期 **Preflight step 失敗、Upload artifact 不執行**。

確認後還原：

```bash
git checkout main
git branch -D preflight-gate-test
git push origin --delete preflight-gate-test
```

（此步驟只刪除這個臨時測試分支，不動任何既有檔案或設定。若不想動遠端分支，可略過本步驟 —— Task 2、3 已在本機證明各檢查有效。）

---

### Task 5: lychee 內部死連結檢查

**Files:**
- Modify: `.github/workflows/pages.yaml`

**Interfaces:**
- Consumes: `./public`（build step 的產出）
- Produces: 無

- [ ] **Step 1: 插入 lychee step**

在 `Preflight` 與 `Upload artifact` **之間**插入：

```yaml
      - name: Check internal links
        uses: lycheeverse/lychee-action@v2
        with:
          # --offline 只驗證本地檔案、不發任何網路請求，
          # 所以外部網站掛掉不會造成假紅燈。
          args: --offline --no-progress --root-dir "$(pwd)/public" './public/**/*.html'
          fail: true
```

- [ ] **Step 2: Commit 並 push，實際觀察輸出**

```bash
git add .github/workflows/pages.yaml
git commit -m "Check internal links with lychee

--offline keeps this to local files only, so a third-party site going down
cannot fail our deploy."
git push origin main
gh run watch
```

- [ ] **Step 3: 分類結果（本步驟必做，勿跳過）**

這是本計畫唯一無法事先在本機驗證的檢查，第一次跑很可能出現假警報（錨點、相對路徑、`.pdf` 之類的非 HTML 資產）。檢視 lychee 的輸出並分類：

- **真的死連結** → 修內容，不要改檢查設定。
- **假警報** → 新增 `.lycheeignore`（一行一個 pattern）：

```bash
cat > .lycheeignore <<'EOF'
# 一行一個 pattern，僅列真正的假警報。
# 每個項目都要註明為什麼它是假警報。
EOF
git add .lycheeignore
git commit -m "Ignore known lychee false positives"
git push origin main
```

若假警報多到難以收斂，回頭跟使用者確認是否保留這項檢查 —— 一個長期紅燈的檢查比沒有檢查更糟，因為它會訓練大家忽略紅燈。

- [ ] **Step 4: 確認最終 step 順序**

```bash
grep -n 'name: Build with Hugo\|name: Preflight\|name: Check internal links\|name: Upload artifact' .github/workflows/pages.yaml
```

預期順序：Build → Preflight → Check internal links → Upload artifact。

- [ ] **Step 5: 確認全部還原乾淨**

```bash
git status --short
```

預期：無任何非預期的修改；`hugo.yaml`、`netlify.toml` 與驗證前完全一致。

---

## 完成標準

- [ ] `scripts/preflight.sh` 三項檢查皆已用「故意弄壞 → 確認擋下 → 還原 → 確認綠燈」證明有效。
- [ ] `pages.yaml` 的 Preflight 與 lychee step 都在 `upload-artifact` 之前。
- [ ] build step 有 `--panicOnWarning`。
- [ ] CI 綠燈。
- [ ] `git status` 乾淨，`hugo.yaml` / `netlify.toml` 未被驗證過程留下任何殘留改動。
