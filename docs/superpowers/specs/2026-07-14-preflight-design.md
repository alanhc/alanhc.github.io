# Preflight 檢查設計

日期：2026-07-14
狀態：已核可，待實作

## 背景

2026-07-14 有一批 Hugo 設定修正在推上去之前沒有被任何機制擋下來，其中兩個是真的 bug：

1. **taxonomies 覆蓋預設**。`hugo.yaml` 定義了自訂的 `taxonomies` 區塊卻只列 `author`，這會**取代**（而非擴充）Hugo 的預設 taxonomy，導致內建的 `tag` 消失、全站文章的 tag 連結失效。建置頁數從 483 掉到 235，`/tags/` 下 123 個標籤頁整個不見。
2. **menu weight 被截斷**。Hugo 的 menu `weight` 是整數型別，YAML 裡寫的 `1.5` / `2.5` 會被截斷成 `1` / `2`。當 Home 的 weight 從 `1.5` 改成 `2`，就跟 CV 截斷後的 `2` 打平，Hugo 改用字母序 tie-break，「CV」排到「Home」前面，選單順序無聲無息地錯掉。

**這兩個 bug 的共同點是：`hugo build` 完全成功，exit code 0，零警告。** 這是本設計最重要的前提 —— 一個只確認「build 有沒有過」的檢查，對這兩個 bug 完全無效。檢查必須對**建置產出的內容**做斷言。

另一個相關問題是版本飄移。Hugo 版本號目前在三個檔案各寫一份（`.github/workflows/pages.yaml`、`netlify.toml`、`.devcontainer/devcontainer.json`，現在都是 0.147.7），而開發者本機是 0.159.1 —— 該版本移除了 `.Site.Author`，而 hextra v0.9.7 的 `list.rss.xml` 還在用，所以本機根本 build 不起來。這代表本機驗證不可信，檢查必須在跟 CI 相同的環境跑。

## 目標與非目標

**目標**：讓上述兩類 bug 在部署前被擋下來，且不因內容更新而產生假警報。

**非目標**：
- 不做本機 hook（pre-commit / pre-push）。已明確決定只在 CI 跑。
- 不做外部連結檢查。第三方網站掛掉或擋爬蟲會造成假紅燈。
- 不修 hextra 與新版 Hugo 的相容性問題。那是獨立的升級工作。
- 不刪除任何既有檔案或設定。

## 架構

檢查邏輯放在 `scripts/preflight.sh`（純 bash，零外部依賴），由**現有的** `pages.yaml` 呼叫，插在 `upload-artifact` 之前。script 負責檢查 1～3：其中版本一致性與 menu lint 讀的是 repo 內的設定檔，只有產出斷言需要建置結果，因此 script 以建置輸出目錄為參數（預設 `./public`）。檢查 4 由 lychee 以獨立 step 執行。

```
pages.yaml
  - Build with Hugo        ← 加上 --panicOnWarning
  - Preflight              ← 新增，scripts/preflight.sh ./public
  - Link check (lychee)    ← 新增
  - Upload artifact        ← 檢查全過才會到這
  - Deploy
```

**為什麼擋在 upload 之前**：GitHub Pages 在 artifact 沒上傳時不會部署，線上維持舊版。所以「檢查失敗」的後果是「這次改動不上線」，而不是「站台壞掉」。這讓 CI-only 的風險可以接受。

**為什麼是 script 而不是 inline YAML**：邏輯進版控、可 review、可單獨測試，將來若想在本機或其他 CI 跑不用重寫。

**為什麼只 build 一次**：沿用 deploy workflow 既有的 build 產出做斷言，不另開 workflow 重 build。站台小（約 3 秒），但沒必要浪費。

## 檢查項目

### 1. Hugo 版本一致性

從三個檔案抽出版本號比對，不一致即失敗：

| 檔案 | 欄位 |
|------|------|
| `.github/workflows/pages.yaml` | `HUGO_VERSION: 0.147.7` |
| `netlify.toml` | `HUGO_VERSION = "0.147.7"` |
| `.devcontainer/devcontainer.json` | hugo feature 的 `"version": "0.147.7"` |

不需要 build，所以排在最前面、最快失敗。防止未來升級時只改到其中一兩處。

### 2. 建置產出斷言

唯一能擋下 taxonomies bug 的檢查。兩層：

**關鍵路徑必須存在**：`index.html`、`blog/index.html`、`projects/index.html`、`docs/index.html`、`tags/index.html`。

**數量下限**（括號內為 2026-07-14 實測值）：

| 項目 | 下限 | 現值 |
|------|------|------|
| tag 頁數（`tags/*/`） | 100 | 123 |
| blog 文章數（`blog/*/`） | 180 | 214 |
| 總 HTML 頁數 | 300 | 350 |

用下限而非精確值，是為了讓新增文章不必改 script。內容只會成長不會萎縮，所以這些數字實務上幾乎不用維護；而 483→235 那種崩塌一定會被擋住（taxonomies 壞掉時 `tags/` 會整個消失，任何下限都能捕捉）。

### 3. menu weight lint

在 `hugo.yaml` 上抓小數 weight（比對 `weight:` 後面帶小數點的值），有就失敗，並在訊息中說明 Hugo 會截斷成整數、造成 tie-break 排序錯亂。

這項是靜態設定檢查，不需要建置產出，成本近乎零，精準對應本次的排序 regression。

### 4. 內部死連結

用 `lychee --offline`（Rust，有官方 GitHub Action）掃 `public/`。`--offline` 只驗證本地檔案、不發出任何網路請求，因此不會因為外部網站掛掉而假紅燈。

刻意不自己用 bash 寫：相對路徑、錨點、fragment 的正確處理很容易寫出假警報，不值得重造輪子。作為 preflight step 之後的獨立 step，一樣擋在 upload 之前。

## 失敗行為

每項檢查失敗時印出**具體壞了什麼與預期值**，而非只回傳 exit 1。例如：

```
FAIL: tag 頁數 12，低於下限 100
  → 通常代表 hugo.yaml 的 taxonomies 區塊漏掉 tag，
    自訂 taxonomies 會取代而非擴充 Hugo 預設值。
```

script 跑完所有檢查再一次回報全部失敗項，不在第一個失敗就中斷 —— 一次看到所有問題比修一個發現還有一個好。

## 驗證方式

實作完成後，必須證明 preflight 真的能擋下它要擋的東西，而不只是「綠燈」：

1. 暫時把 `hugo.yaml` 的 `tag: tags` 拿掉 → preflight 必須失敗，且訊息指向 taxonomies。
2. 暫時把某個 menu weight 改成 `2.5` → weight lint 必須失敗。
3. 暫時把 `netlify.toml` 的版本改成別的 → 版本一致性檢查必須失敗。
4. 還原後 → 全部通過。

每項驗證後都必須還原檔案。

## 未決事項

無。下限數字（100/180/300）、lychee 的選用、以及不額外增加檢查項目，皆已確認。
