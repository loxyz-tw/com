# fun-tech.vip SEO / AEO / GEO 執行計畫

狀態：v5（2026-09-03，Codex 四輪審核後定稿）
基準：`master` HEAD `6e58e73`。本檔目前未追蹤，將與實作一起 commit。
範圍：`master` 分支原始碼。發佈另走 `/deploy` 流程，需 Roy 明確同意。

---

## 0. 現況診斷（已實測，非推測）

| 項目 | 現況 | 影響 |
|---|---|---|
| 線上 HTML | `curl https://fun-tech.vip/` 回來的 `<div id="root">` 是**空的**，所有內容靠 JS 渲染 | Google 與 Bing 會渲染 JS，索引沒問題。但多數 LLM 抓取器（GPTBot、ClaudeBot、PerplexityBot 等）**不執行 JS**，拿到的是空殼；分享預覽、非 JS 環境亦然。Prerender 的價值是：首次 HTML 就有完整內容、涵蓋不執行 JS 的抓取器、降低索引不確定性 |
| `sitemap.xml` | 404 | Search Console / Bing 無法提交 |
| `robots.txt` | 只有 `User-agent: * / Disallow:`，無 `Sitemap:` 行 | 可抓，但缺 sitemap 指引 |
| 結構化資料 (JSON-LD) | 無 | 無 Organization 實體訊號，引擎無法確認「丰科是誰、在哪、做什麼」 |
| Open Graph / Twitter Card | 無（`grep -c og:` = 0） | 分享到 LINE / FB / X / Slack 沒有預覽卡 |
| canonical / `meta robots` | 無 | 該補 |
| `<h1>` | **兩個**（導覽列品牌名 + Hero 標題） | 語意重複 |
| 首屏 LCP 元素 | Hero `<h1>` 掛 `data-aos`，AOS 初始化前 `opacity:0` | LCP 被 JS 拖慢 |
| 內容 | 「關於我們」是空泛套話，沒有可被引用的實體陳述 | AI 引擎需要**可直接引用的事實句** |
| FAQ | 無 | AEO 最直接的著力點缺席 |
| 網域 | `www` → apex 301、HTTPS、`public/CNAME` 皆正常 | 無需動 |
| 粒子背景 | `Math.random()` 在 render 期間產生 | 改成 hydration 前必須先處理 |
| AOS 初始化 | `src/index.js` 在 render **之前**呼叫 `AOS.init()`，會直接改 DOM class | hydration 前改 DOM 會造成 mismatch |
| 頁尾年份 | `new Date().getFullYear()` | 跨年後 prerender HTML 與 client 不一致 |

## 1. 目標與名詞界定

- **SEO**：Google / Bing 索引與排名。可量化：Search Console 收錄、Lighthouse SEO ≥ 95、分享預覽卡正常。
- **AEO（Answer Engine Optimization）**：讓 Google AI Overviews、Bing Copilot、Perplexity 能抽出精確答案。手段：可見 FAQ、答案先行的段落、明確實體陳述。
- **GEO（Generative Engine Optimization）**：讓 ChatGPT、Claude、Gemini、Perplexity 生成回答時知道並引用丰科。手段：抓取器不執行 JS 也拿得到內容、統一的實體命名、可驗證的數據與**真實的**日期、站外一致性。

三者共用的地基：**首次 HTML 就要有完整內容**。Phase 1 是 prerender。

## 2. 決策事項

| # | 決策 | 結論 | 理由 / Codex 意見處理 |
|---|---|---|---|
| D1 | Prerender 方式 | 自寫 `scripts/prerender.js`，`puppeteer-core` + 系統 Chrome（`/usr/bin/google-chrome`），`PUPPETEER_EXECUTABLE_PATH` 可覆寫 | `react-snap` 停更且不相容 Node ≥17。機器已有 Chrome。**補**：`package-lock.json` 會變動，列入清單；靜態 server 要回正確 MIME、擋路徑穿越、設 timeout、`finally` 關閉 browser 與 server |
| D2 | 單頁 vs 多路由 | 本輪維持單頁 + hash 錨點；**服務落地頁（`/services/*`）與案例頁列為下一輪 Phase 4，明確排程** | hash 錨點不是獨立可索引頁面；服務型搜尋流量要靠落地頁。本輪先把資料抽離與地基做對，Phase 4 不用重做 |
| D3 | AI 爬蟲政策 | 允許全部；`robots.txt` 只保留 `User-agent: *` / `Allow: /` + `Sitemap:`，**不逐一列 AI bot** | `*` 已涵蓋，逐列只是政策說明且名單易過期（Codex 指出 `anthropic-ai` 已非現行名稱）。以註解說明政策即可 |
| D4 | 結構化資料資料來源 | 由 React 渲染 `<script type="application/ld+json">`，資料集中在 `src/data/*.js`（ESM，只給 webpack）；**Node 腳本一律不 import `src/data/`**，驗收只解析 build 後的 HTML | `package.json` 無 `"type":"module"`，Node 不能直接讀 ESM src。llms.txt 手寫維護 |
| D5 | OG 圖 | 同一套 puppeteer 從 `scripts/og-template.html` 截 1200×630 → `public/og-image.png`，PNG 進 git，一次性指令 `npm run og-image` | **補**：等 `document.fonts.ready`，並以 `document.fonts.check()` 確認 Noto Sans TC 與 Orbitron 已載入，否則 exit 1。補 `twitter:image:alt` |
| D6 | 不捏造的事實 | 結構化資料不填電話、統編、成立年份、`sameAs`、評分、價格。FAQ 只寫 repo 內既有陳述可支撐的內容；**「全台遠端合作」「標準流程」兩題不寫**，程式化發佈把關只限定蔬食知識庫案例 | 錯誤事實比沒有更糟 |
| D7 | Hydration 策略 | `src/index.js`：`root.hasChildNodes()` → `hydrateRoot`，否則 `createRoot`。**前提**：先消除 §3 Phase 1 列出的所有非決定性 render 來源，hydration warning 視為 bug，不視為「React 會自己修好」 | Codex：必須先消除 mismatch 來源 |
| D8 | 日期語意 | `dateModified`、畫面「最後更新」、sitemap `lastmod` 三者**都用同一個手動維護的常數** `CONTENT_UPDATED_AT`（`src/data/site.js`），改內容才改它；**不用 build 時間** | build 時間不是內容更新日期，Google 會忽略不可信的 lastmod |
| D9 | Organization 型別 | 只用 `Organization`，**不用 `ProfessionalService`/`LocalBusiness`** | LocalBusiness 要有實體接待或到府服務；目前無法證明。Google Business Profile 同理列為「符合資格才做」 |
| D10 | FAQPage schema | 保留可見 FAQ（`<details>`），`FAQPage` 標記**保留但標示為低成本附帶項**，不預期 Google rich result | Google 已移除一般網站 FAQ rich result；AEO/其他引擎仍可能讀 |
| D11 | llms.txt | 只做一份短版 `public/llms.txt`，標示實驗性；**不做 llms-full.txt** | Google 表明不採用；短版成本低、給其他引擎用 |

## 3. 分階段工作項

### Phase 1 — 地基：Prerender + Hydration（P0）

1. `npm i -D puppeteer-core`（`package.json` + `package-lock.json` 變動）。
2. `scripts/static-server.js`：可被 require 的最小靜態伺服器（Node 內建 `http`/`fs`/`path`），供 prerender 與驗收共用。要求：以 `path.resolve` 檢查解析後路徑仍在 root 內（擋 `..`）、副檔名→MIME 對照表（html/js/css/json/xml/txt/png/webp/ico/svg/woff2）、找不到回 404、回傳 `{ server, port, close() }`。prerender 用時綁 `127.0.0.1`；CLI 用法 `node scripts/static-server.js build 5050` 綁 `0.0.0.0`，讓手機從區網驗證。
3. `scripts/prerender.js`：
   - 起 static server（隨機埠）→ `puppeteer-core.launch({ executablePath, headless: 'new', args: ['--no-sandbox'] })`，viewport 1280×800。
   - 註冊 `page.on('pageerror')` 與 `page.on('console')`（type `error`），任一觸發即記錄並最後 exit 1。
   - `page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })`，再 `waitForSelector('#root section#contact')`。
   - `page.evaluate`：移除所有元素上的 `aos-init` 與 `aos-animate` class；移除 `<body>` 上 AOS 加的 `data-aos-easing`/`data-aos-duration`/`data-aos-delay` 屬性。
   - 取 `document.documentElement.outerHTML`，前綴 `<!doctype html>`，覆寫 `build/index.html`。
   - 自檢：輸出 HTML 內不得含 `aos-init`/`aos-animate`、必含 `section id="contact"`、`<h1` 恰一個、`#root` 內容長度 > 5000。
   - **第二趟 hydration 驗證**：寫回 `build/index.html` 後，開新分頁重新載入同一 URL（這次 `#root` 非空，走 `hydrateRoot`）。監聽 `pageerror`（React 18 production 的可復原 hydration 錯誤走 `reportError`，會以 pageerror 浮現，訊息含 `Minified React error #418/#423/#425`）與 `console` 的 `error`/`warning`（比對 `/hydrat|did not match|Minified React error/i`），任一命中即 exit 1。等 `networkidle0` 後再多等 1 秒收尾。
   - `finally` 關 browser 與 server；任何失敗 `process.exit(1)`，**不能靜默退回空殼 HTML**。
4. `package.json` scripts：Phase 1 先設 `"postbuild": "node scripts/prerender.js"`；`check-seo.js` 到 Phase 3d 完成後才串進 postbuild（避免 Phase 1 驗收依賴尚不存在的資產）。
5. `src/index.js`：
   - 移除頂層 `AOS.init()`；改在 `App` 內 `useEffect`。AOS 2.3.4 的 `init()` 每次都會新增 resize/scroll listener 與 MutationObserver 且無 cleanup，React 18 StrictMode 開發版會重跑 effect，因此用 module 層級旗標保護：第一次 `AOS.init({ duration: 1000, once: true, offset: 100 })`，之後只 `AOS.refreshHard()`。
   - `const container = document.getElementById('root'); container.hasChildNodes() ? hydrateRoot(container, <App/>) : createRoot(container).render(<App/>)`。保留 `React.StrictMode`。
6. 消除非決定性 render：
   - 粒子：`useMemo` + 固定種子 mulberry32 PRNG（seed 常數），server/client 一致。
   - 頁尾年份：改用 `site.js` 的 `COPYRIGHT_YEAR` 常數（`2026`），不呼叫 `Date`。
   - 檢查 `App` 首次 render 路徑無 `window`/`document`/`Date`/`Math.random` 存取（`useEffect` 內不算）。`createPortal` 只在 lightbox 開啟時執行，安全。
7. Hero 首屏容器移除 `data-aos`，沿用既有 `page-load` CSS 淡入。其餘區塊 AOS 照舊。

**驗收**：
```bash
CI=true npm run build                       # ESLint warning 視為錯誤；Phase 1 的 postbuild 只有 prerender
CI=true npm test -- --watchAll=false        # passWithNoTests，確認 jest 環境沒被弄壞
test "$(cat build/CNAME)" = "fun-tech.vip"
```
Phase 1 的 `<h1>` 恰一個、無 `aos-init`/`aos-animate`、`#root` 非空、hydration 無錯誤，由 `prerender.js` 自檢保證（上面第 3 點）；`check-seo.js` 在 Phase 3d 再重複斷言一次。
接著 `node scripts/static-server.js build 5050`，用 Chrome 自動化確認：console 無 error / 無 hydration 相關訊息（`Hydration failed`、`did not match`）、導覽捲動可用、lightbox 可開關（證明 React 已接上）、AOS 進場動畫在前景分頁仍會跑。

### Phase 2 — 中繼標籤、robots、sitemap、llms.txt、OG 圖（P0，機械性）

`public/index.html`：
- `<title>`：`丰科有限公司 Fun Tech CO｜App、網站與 AI 應用開發`
- `<meta name="description">`：70–90 字，例：「丰科有限公司位於新北市中和區，提供 iOS/Android App、網站平台、資訊系統與生成式 AI 流程自動化開發，並協助 Google Play 正式版權限申請。四個已上線案例可直接體驗。」
- `<link rel="canonical" href="https://fun-tech.vip/">`
- `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">`
- Open Graph：`og:type=website`、`og:locale=zh_TW`、`og:site_name`、`og:title`、`og:description`、`og:url=https://fun-tech.vip/`、`og:image=https://fun-tech.vip/og-image.png`（絕對 URL）、`og:image:width=1200`、`og:image:height=630`、`og:image:alt`
- Twitter：`twitter:card=summary_large_image`、`twitter:title`、`twitter:description`、`twitter:image`、`twitter:image:alt`
- `theme-color` 改 `#0a0a0f`
- `<noscript>` 改繁中，內含公司名、地點、服務、Email 的純文字摘要。

`public/robots.txt`：
```
# 本站歡迎搜尋引擎與 AI 搜尋/生成引擎抓取（GPTBot、OAI-SearchBot、ClaudeBot、
# Claude-SearchBot、PerplexityBot、Google-Extended 等皆適用下列規則）。
User-agent: *
Allow: /

Sitemap: https://fun-tech.vip/sitemap.xml
```

`public/sitemap.xml`：單一 `<url>`，`<loc>https://fun-tech.vip/</loc>`，`<lastmod>` 手動維護、值 = `CONTENT_UPDATED_AT`（`check-seo.js` 會核對兩者一致）。不寫 `changefreq`/`priority`。

`public/llms.txt`（短版、實驗性）：H1 站名、blockquote 一句摘要、`## 服務`（4 條）、`## 案例`（4 條含外連）、`## 聯絡`。頂端註解「內容需與 src/data/ 同步」。

`public/og-image.png`：`scripts/make-og-image.js` 載入 `scripts/og-template.html`（深色底 `#0a0a0f`、品牌名 Orbitron、副標 Noto Sans TC、網址；`scripts/` 在 Tailwind 掃描範圍外，直接寫 hex），viewport 1200×630、`deviceScaleFactor 1`，等 `document.fonts.ready` 並 `document.fonts.check('700 40px "Noto Sans TC"')` 與 Orbitron 皆為 true 才截圖，否則 exit 1。`package.json` 加 `"og-image": "node scripts/make-og-image.js"`。

**驗收**（Phase 2 只用下列 shell 指令；`check-seo.js` 的 head/JSON-LD 斷言到 Phase 3d 建立後再一併跑）：
```bash
CI=true npm run build                       # 先重新 build，避免驗到 Phase 1 的舊產物
test -s build/og-image.png && file build/og-image.png | grep -q '1200 x 630'
test -s build/robots.txt && grep -q '^Sitemap: https://fun-tech.vip/sitemap.xml$' build/robots.txt
test -s build/llms.txt
test "$(grep -c 'rel="canonical" href="https://fun-tech.vip/"' build/index.html)" -eq 1
test "$(grep -c 'property="og:image" content="https://fun-tech.vip/og-image.png"' build/index.html)" -eq 1
grep -q 'name="twitter:card" content="summary_large_image"' build/index.html
grep -q '<lastmod>2026-09-03</lastmod>' build/sitemap.xml
```

### Phase 3 — 結構化資料 + AEO 內容（P1）

**3a. 資料抽離（ESM，只給 webpack）**
- `src/data/site.js`：`SITE_URL`、中文名、英文名、`alternateName`、Email、地址拆欄位（streetAddress「中原二街28號18樓」、addressLocality「中和區」、addressRegion「新北市」、postalCode 不填、addressCountry「TW」）、`CONTENT_UPDATED_AT = '2026-09-03'`、`COPYRIGHT_YEAR = 2026`、服務清單（4 項，含 slug/name/description/serviceType）、`knowsAbout` 技術清單。
- `src/data/projects.js`：四個案例的純文字欄位（id、anchor、title、category、description、services、technologies、links、alt、lightboxLayout、lightbox 的 alt 陣列）。圖片 import 留在 `App.js`，以 `id` 合併。
- `src/data/faqs.js`：`{ id, q, a }` 陣列。

**3b. `src/seo/StructuredData.js`**
`@graph` 一份，`dangerouslySetInnerHTML` 輸出，放 `App` 最外層。所有節點都有 `@id`：
- `Organization`（`https://fun-tech.vip/#organization`）：`name`、`alternateName: ["Fun Tech CO"]`、`url`、`logo`（`ImageObject`，`@id: #logo`，`url` 與 `contentUrl` 皆絕對 URL `https://fun-tech.vip/logo512-v2.png`，`width/height 512`）、`email`、`address`（`PostalAddress`）、`knowsAbout`。**不填** `areaServed`（等同宣稱服務範圍，無依據）、`contactPoint`（Email 已在 `email` 欄位，不另立 customer support 節點）、telephone、foundingDate、sameAs。
- `WebSite`（`#website`）：`name`、`url`、`inLanguage: "zh-TW"`、`publisher → #organization`。
- `WebPage`（`#webpage`）：`url`、`name`、`description`、`isPartOf → #website`、`about → #organization`、`inLanguage`、`dateModified: CONTENT_UPDATED_AT`、`primaryImageOfPage`（`ImageObject`，og-image 絕對 URL，1200×630）。
- `Service` ×4（`#service-<slug>`）：`serviceType`、`name`、`description`、`provider → #organization`、`url: https://fun-tech.vip/#services`。不填 `areaServed`。「協助申請安卓 App 正式版權限」併入手機 App 開發的 description，不另立節點。
- `ItemList`（`#portfolio`）：`itemListElement` 為 4 個 `ListItem`（含 `position`），`item` 一律 `CreativeWork`（`#project-<anchor>`）：`name`、`description`、`url`（第一個對外連結）、`sameAs`（VegMap 的第二個商店連結）、`creator → #organization`、`keywords`（technologies 以逗號串）。不用 `SoftwareApplication`（無價格/評分，不捏造）。
- `FAQPage`（`#faq`）：`mainEntity` = `faqs.js` 逐筆 `Question`/`acceptedAnswer.Answer`，`text` 與畫面**逐字相同**（同一資料來源保證）。

**3c. 內容改寫（AEO）**
- 導覽列品牌名 `<h1>` → `<a href="#home"><span>丰科有限公司</span></a>`，全頁只留 Hero 一個 `<h1>`。
- Hero `<h2>` 改為「新北中和的 App、網站與 AI 應用開發團隊」。
- 「關於我們」第一段改為可引用定義句：「丰科有限公司（Fun Tech CO）是位於新北市中和區的軟體開發公司，提供 iOS/Android App、網站平台、客製化資訊系統與生成式 AI 流程自動化開發。已上線案例包含蔬食綠洲 VegMap（雙平台合計 1000+ 下載）、WBC 2026 台灣情報站、新聞漫畫 NewsToComic 與蔬食知識庫。」第二段保留既有「技術服務於人」語意但收斂為兩句。
- 新增 `<section id="faq">`「常見問題」，位於「專案成果」與「聯絡我們」之間；導覽列（桌面與手機）加「常見問題」。用原生 `<details><summary>`，樣式套 tailwind token，**預設全部展開**（`open`），使用者可收合；不用 JS 隱藏內容。題目與答案骨幹（實作可潤飾語句，**不得新增未列事實**）：
  1. 丰科有限公司提供哪些服務？→ 四項服務一句話各帶一個案例；另提供 Google Play 封閉測試與正式版權限申請協助。
  2. 丰科有限公司在哪裡？→ 新北市中和區中原二街28號18樓；聯絡以 Email 為主。
  3. 你們主要使用哪些技術？→ 依服務卡片與案例 technologies 列出：Swift/Kotlin、Flutter、React/Next.js、Node.js/Python、Firebase、PostgreSQL、Cloudflare R2、Cloud Run/Vercel。
  4. 可以協助 Google Play 封閉測試與正式版權限申請嗎？→ 可以；封閉測試規劃、測試者管理與回饋彙整、文件準備到審核通過（既有卡片文案）。
  5. 「AI 應用與流程自動化」實際上是做什麼？→ 以 NewsToComic 為例：抓新聞→AI 改寫劇本→生成三格圖→發布上線，串成可一鍵執行的自動化管線。**FAQ 不寫「約 20 秒」**（案例卡片既有文案保留不動，該數字待 Roy 確認有實測依據後再決定是否放進 FAQ）。
  6. AI 產生的內容品質怎麼把關？→ **以蔬食知識庫為例**（限定該案例）：發佈條件由程式強制檢查免責聲明、審閱日期、SEO 標題與摘要、至少兩筆引用來源。
  7. 有哪些已上線、可以實際體驗的作品？→ 四個案例名稱與連結。
  8. 如何聯絡與洽談？→ Email `app@fun-tech.vip`，來信說明需求、平台與期望時程。
- 專案成果區標題下方加可見文字「內容最後更新：2026 年 9 月」（來自 `CONTENT_UPDATED_AT`）。
- 頁尾地址與 Email 用 `<address>` 包。

**3d. `scripts/check-seo.js`**（僅 Node 內建模組，讀 `build/index.html`、`build/sitemap.xml`、`build/robots.txt`、`build/CNAME`；任一失敗印出原因並 exit 1）：
- `<h1` 出現次數 **=== 1**
- 不含 `aos-init`、`aos-animate`
- `<div id="root">` 內有內容（長度 > 5000 字元且含 `id="contact"`、`id="faq"`）
- `<title>` 長度 ≤ 60；`meta[name=description]` 長度 50–160
- `link[rel=canonical][href="https://fun-tech.vip/"]` 恰一個
- `meta[property="og:image"]` 內容 **=== `https://fun-tech.vip/og-image.png`**；`og:title`、`og:description`、`og:url`、`twitter:card=summary_large_image`、`twitter:image` 皆存在
- 所有 `<script type="application/ld+json">` 可 `JSON.parse`；`@graph` 含 `Organization`、`WebSite`、`WebPage`、`FAQPage`、`ItemList`，且 `Service` 節點數 === 4、`ListItem` 數 === 4 並帶 `position`
- `Organization.logo.url` 以 `https://fun-tech.vip/` 開頭
- `FAQPage.mainEntity.length` === HTML 中 `<details` 數；每個 `Question.name` **與** `acceptedAnswer.text` 皆能在 HTML（去標籤、正規化空白後）中找到
- `@graph` 內所有 `@id` 唯一；所有形如 `{"@id": "..."}` 的引用（`publisher`、`isPartOf`、`about`、`provider`、`creator`）都能解析到 graph 內的節點
- `WebPage.dateModified` === `sitemap.xml` 的 `<lastmod>`，且格式 `YYYY-MM-DD`
- `robots.txt` 含 `Sitemap: https://fun-tech.vip/sitemap.xml`
- `CNAME` 內容 === `fun-tech.vip`

### Phase 4 — 多路由（下一輪，本輪不做）

服務落地頁 `/services/<slug>` ×4、案例頁 `/portfolio/<slug>` ×4、`/faq`；各自 title/description/H1/canonical/`BreadcrumbList`；prerender 逐路由輸出 `build/<route>/index.html`，`404.html` 複製 `index.html` 做 fallback；sitemap 多 URL。本輪的 `src/data/` 抽離就是為此鋪路。

### Phase 5 — 站外（Roy 手動，發佈後）

1. Google Search Console：驗證網域、提交 sitemap、「網址檢查」看抓到的 HTML 有內容。
2. Bing Webmaster Tools：從 Search Console 匯入；Bing 索引餵 Copilot 與 ChatGPT 搜尋。
3. Google Business Profile：**僅在中和地址確實可接待客戶或有到府服務時**建立；純線上業務不符資格，不要硬建。
4. 四個案例站的頁尾或「關於」加回連 `fun-tech.vip`。
5. 兩週後用 ChatGPT / Perplexity / Gemini 問「新北中和 App 開發公司」「丰科有限公司」，記錄基準。

## 4. 實作分工與順序（給 grok）

順序：Phase 1 → 2 → 3（3a → 3b → 3c → 3d）。每個 Phase 結束跑該 Phase 驗收，不通過不進下一階段。Phase 4/5 不在本輪。

檔案變動清單：
- 新增：`scripts/static-server.js`、`scripts/prerender.js`、`scripts/check-seo.js`、`scripts/og-template.html`、`scripts/make-og-image.js`、`src/data/site.js`、`src/data/projects.js`、`src/data/faqs.js`、`src/seo/StructuredData.js`、`public/sitemap.xml`、`public/llms.txt`、`public/og-image.png`、`docs/seo-aeo-geo-plan.md`（本檔）
- 修改：`package.json`、`package-lock.json`、`public/index.html`、`public/robots.txt`、`src/index.js`、`src/App.js`、`PROJECT.md`（新增「SEO 資產維護」一節：改內容要同步改 `CONTENT_UPDATED_AT` 與 `sitemap.xml` 的 lastmod、`llms.txt`；prerender/check-seo 失敗即 build 失敗；OG 圖重產指令；hydration 規則：首次 render 不得用 Date/Math.random/window）
- 不動：`public/CNAME`、`tailwind.config.js`、圖片資產、`src/index.css`（除非 FAQ 樣式確需新增 class，且只加不改）

限制：
- 介面文案繁體中文；顏色用 tailwind token（`scripts/` 內 HTML 除外）。
- 不引入 UI 框架或 router；新增依賴只允許 `puppeteer-core`（devDependency）。
- 不捏造任何公司事實（D6）。
- 完成後 commit 到 `master`（可分多個 commit，每個 Phase 一個），**不要 push、不要 `npm run deploy`**。
- 不要展開子 agent。

## 5. 我方驗收（Claude 執行）

1. `git status --short` 無未追蹤殘留；`git diff --stat 6e58e73..HEAD` 對照第 4 節清單，無越界改動。
2. `CI=true npm run build` 與 `CI=true npm test -- --watchAll=false` 成功。
3. `node scripts/static-server.js build 5050`，Chrome 自動化：首屏截圖、console 無 error 且無 hydration 訊息、點導覽「常見問題」會捲動、開關一個 lightbox、FAQ `<details>` 可收合再展開、靜態資源（`/og-image.png`、`/sitemap.xml`、`/robots.txt`、`/llms.txt`）皆 200 且 MIME 正確。
4. `curl` 本地 `index.html`，逐項確認 `<head>` 與 JSON-LD 內的事實（地址、Email、案例連結、日期）。
5. 手機版：保持第 3 步的 `node scripts/static-server.js build 5050`（綁 `0.0.0.0`）不關，請 Roy 用手機開 `http://192.168.50.173:5050` 看 FAQ 區與導覽列；這是 production build 加 prerender 的真實狀態，比 dev server 更接近上線。
6. Lighthouse（Chrome DevTools）SEO ≥ 95、Performance 不低於改動前；由我或 Roy 手動跑，非阻塞。
7. 通過後回報 Roy，附 Phase 5 清單與需 Roy 確認的文案（FAQ 全文、關於我們定義句、logo 是否可作正式識別）。
