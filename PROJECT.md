# PROJECT.md

丰科官網的單一事實來源。所有 AI coding agent 的專案指示都以本檔為準——`CLAUDE.md`（Claude Code）與 `AGENTS.md`（其他 agent）只是指向這裡的入口，內容不要寫在那兩個檔裡，一律改這裡。

## 分支結構（最重要）

這個 repo 有兩個分支，用途完全不同：

- **`master`** — 真正的原始碼（`src/`、`public/`、`package.json`、`tailwind.config.js`）。
- **`gh-pages`** — `npm run deploy` 產生的 build 產物，由機器覆寫，GitHub Pages 從這裡供應網站。

**工作目錄預設簽出在 `gh-pages`。** 在這個狀態下編輯 `index.html`、`static/js/main.*.js`、`asset-manifest.json` 等檔案毫無意義——下次 deploy 會把整個目錄內容換成新的 `build/` 產物。

（補充：`gh-pages` 套件**預設不是 force-push**。它會 clone 遠端分支、清掉舊檔、複製新的 `build/`、在既有歷史上新增一個 commit，然後一般 push。分支歷史是保留的，只有加 `--no-history` 才會 force。）

要改任何東西，先切分支並安裝依賴：

```bash
git checkout master
npm install       # 這台機器上可能還沒裝過
```

只有在檢查「線上實際跑的是什麼」時才留在 `gh-pages`，而且不要改動。

## 專案

丰科有限公司（Fun Tech CO）形象官網。Create React App + Tailwind，單頁式，正式站 https://fun-tech.vip。
網站絕大部分內容集中在 `src/App.js`（約 570 行）。

## 指令

```bash
npm start         # 本地預覽 http://localhost:3000
npm run build     # 輸出到 ./build（build/ 在 master 上被 gitignore）
npm run deploy    # 先 build，再 gh-pages -d build 推上 gh-pages 分支
```

沒有獨立的 lint script；ESLint 由 react-scripts 內建執行（`eslintConfig: react-app`）。也沒有 prettier / editorconfig，格式沿用檔案現有風格即可。

## 發佈

- **發佈前一定要先問過 Roy。** 這是對外動作，`npm run deploy` 會直接改動正式站。
- 發佈前先 `npm start` 本地看過改動。
- **`public/CNAME` 必須存在且內容為 `fun-tech.vip`。** 它會被複製進 build，自訂網域靠它；掉了網站會斷線（過去已經出過一次事故）。CNAME 要放在 `public/`，不是只放 repo 根目錄。
- 沒有 CI，deploy 是從本機手動跑的。沒有任何 `.env` 或環境變數需求。

## 樣式

用 `tailwind.config.js` 定義的 token，不要寫死 hex：

- 顏色：`tech-dark` `#0a0a0f`、`tech-darker` `#12121a`、`tech-cyan` `#00d4ff`、`tech-purple` `#7c3aed`、`tech-text` `#e4e4e7`
- 字型：`font-heading`（Orbitron，英數標題）、`font-body`（Noto Sans TC，中文內文）

Tailwind 的 `content` 只掃 `./src/**/*.{html,js,jsx}`——寫在 `src/` 之外的 class 會被 purge 掉。

介面文案一律繁體中文，`<html lang="zh-TW">`。

## 視覺驗證

改動任何 UI（`src/App.js`、`src/index.css`、`src/App.css`、Tailwind 設定）之後，不要只靠讀 code 判斷結果，必須實際看畫面。

做法：背景啟動 `npm start`，等 compile 成功，用 Chrome 自動化開 `http://localhost:3000` 截圖確認。截圖是針對特定 tab 抓取，不受視窗焦點或遮擋影響，所以 Roy 可以同時用其他螢幕工作，不必把畫面讓出來。唯一限制是不要動到 agent 正在操作的那個分頁。

檢查要涵蓋改動影響到的區塊；改到 layout 時一併看窄寬度（手機版）。

確認完把 dev server 關掉，不要留背景 process。

### 這台機器上的實測限制（2026-08-29 踩過，別重踩）

Chrome 自動化在這裡有三個坑，會讓你以為程式壞了、其實是量測環境的問題：

1. **改不了視窗寬度。** `resize_window` 會回成功但 `outerWidth` 不動（視窗管理員擋掉），**手機版寬度無法用自動化驗證**。手機版一律請 Roy 用手機開 `http://192.168.50.173:3000` 實測。
2. **背景分頁會被節流。** AOS 進場動畫（`data-aos`）不會觸發，卡片會是透明的；`scroll-behavior: smooth` 的平滑捲動也不會跑，等 5 秒還在原地是正常的，要等 10 秒以上或注入 `html{scroll-behavior:auto}` 才測得準。曾因此誤判「深連結壞掉」與「封面圖沒載入」，兩次都是假警報。
3. **視窗尺寸與截圖區域會飄。** 同一個 session 內出現過 1568×783 → 960×419 的變化，也出現過截圖右側被裁掉。**版面正確性優先用 JS 量測座標**（`getBoundingClientRect`）而非目視截圖。

**要交付給 Roy 看的截圖，直接請他用 Chrome DevTools 的整頁截圖**（`Ctrl+Shift+P` → `Capture full size screenshot`），比 agent 截的乾淨可靠。

**但整頁截圖不等於好素材**：放進 lightbox 或作品集的圖，要的是「看得清楚、自成一體的區塊」，把整頁縮進小視窗反而更看不清。

## 測試

本專案沒有自動化測試。驗證改動請走「視覺驗證」那一節。
