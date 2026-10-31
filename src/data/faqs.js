export const FAQS = [
  {
    id: 'services',
    q: '丰科有限公司提供哪些服務？',
    a: '丰科提供手機 App 開發（代表案例：蔬食綠洲 VegMap）、網頁平台設計（WBC 2026 台灣情報站）、資訊系統建置（蔬食綠洲 VegMap），以及 AI 應用與流程自動化（新聞漫畫 NewsToComic、蔬食知識庫）。另提供 Google Play 封閉測試與正式版權限申請協助，以及 PHP 漏洞 PHP2Shell 的檢測與修復協助。',
  },
  {
    id: 'location',
    q: '丰科有限公司在哪裡？',
    a: '公司位於新北市中和區中原二街28號18樓；聯絡以 Email（app@fun-tech.vip）或 LINE（ID：fun-tech.vip）為主。',
  },
  {
    id: 'tech',
    q: '你們主要使用哪些技術？',
    a: '依服務與案例實際使用的技術包括：Swift/Kotlin、Flutter、React/Next.js、Node.js/Python、Firebase、PostgreSQL、Cloudflare R2、Cloud Run/Vercel。',
  },
  {
    id: 'play-permission',
    q: '可以協助 Google Play 封閉測試與正式版權限申請嗎？',
    a: '可以。我們協助新開發者完成 Google Play 封閉測試與正式版權限申請，涵蓋封閉測試規劃、測試者管理與回饋彙整、文件準備到審核通過。',
  },
  {
    id: 'php2shell',
    q: '網站用 PHP 架設，會受 PHP2Shell 漏洞影響嗎？',
    a: '可能會。PHP2Shell（CVE-2026-109618、CVE-2026-109619）是 PHP 核心引擎的漏洞，問題不在網站程式本身。PHP 官方指出，所有處理網頁請求的 PHP 安裝都有風險（包括 PHP-FPM、Apache mod_php、php-cgi），因此 WordPress、Drupal、Joomla 等以 PHP 架設的網站都可能受影響；攻擊者無需登入即可能在伺服器上執行程式碼，且已出現實際攻擊。修補方式是升級至 2026 年 10 月 21 日釋出的官方修補版（8.5.12、8.4.27、8.3.36、8.2.35），或安裝作業系統、主機商已修補的套件；PHP 官方已不再為 8.1 以前的版本釋出更新，請向主機商確認是否有回補修正，否則需規劃升級；修補前伺服器上的金鑰、Token 與 API Key 也應一併更換。丰科提供檢測、升級與金鑰輪替協助，請來信 app@fun-tech.vip 或加 LINE（ID：fun-tech.vip）。',
  },
  {
    id: 'ai-automation',
    q: '「AI 應用與流程自動化」實際上是做什麼？',
    a: '以新聞漫畫 NewsToComic 為例：從抓取新聞、AI 改寫劇本、生成三格圖到發布上線，串成可一鍵執行的自動化管線。',
  },
  {
    id: 'ai-quality',
    q: 'AI 產生的內容品質怎麼把關？',
    a: '以蔬食知識庫為例：發佈條件由程式強制檢查免責聲明、審閱日期、SEO 標題與摘要，以及至少兩筆引用來源，缺一不可。',
  },
  {
    id: 'portfolio',
    q: '有哪些已上線、可以實際體驗的作品？',
    a: '四個已上線案例：新聞漫畫 NewsToComic（https://www.news-to-comic.xyz/）、蔬食綠洲 VegMap（Google Play 與 App Store）、WBC 2026 台灣情報站（https://www.wbc-tw.club/）、蔬食知識庫（https://vegmap.app/）。',
  },
  {
    id: 'contact',
    q: '如何聯絡與洽談？',
    a: '請來信 app@fun-tech.vip，或加 LINE（ID：fun-tech.vip），說明需求、平台與期望時程。',
  },
];
