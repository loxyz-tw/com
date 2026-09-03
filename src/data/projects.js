export const PROJECTS = [
  {
    id: 1,
    anchor: 'project-newstocomic',
    title: '新聞漫畫 NewsToComic',
    category: 'AI · 自動化',
    description:
      '從抓取新聞、AI 改寫劇本、生成三格圖到發布上線，串成一條可一鍵執行的自動化管線，端到端產出一則漫畫約 20 秒。',
    services: ['AI 應用與流程自動化', '網頁平台設計'],
    technologies: ['Python', 'Gemini', 'ComfyUI', 'Next.js', 'Cloudflare R2'],
    links: [{ label: '查看專案', url: 'https://www.news-to-comic.xyz/' }],
    alt: '新聞漫畫專案畫面：兩支手機展示由新聞自動生成的三格漫畫',
    lightboxLayout: 'scroll',
    lightboxAlts: ['由尼泊爾洪災新聞自動生成的三格漫畫'],
  },
  {
    id: 2,
    anchor: 'project-vegmap',
    title: '蔬食綠洲 VegMap',
    category: 'App · 雙平台',
    description:
      '社群共建的蔬食餐廳地圖。從 App、審核後台、Google Maps 解析到照片同步管線全套自建，同時上架 App Store 與 Google Play，雙平台合計 1000+ 下載。',
    services: ['手機 App 開發', '資訊系統建置'],
    technologies: ['Flutter', 'Firebase', 'Cloudflare R2', 'Next.js', 'Google Maps'],
    links: [
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.ccveg.app&hl=zh_TW',
      },
      {
        label: 'App Store',
        url: 'https://apps.apple.com/tw/app/id6758656462',
      },
    ],
    alt: '蔬食綠洲 App 畫面：三支手機展示蔬食地圖、店家詳情與共編功能',
    lightboxLayout: 'swipe',
    lightboxAlts: [
      '蔬食綠洲 App 畫面：地圖瀏覽',
      '蔬食綠洲 App 畫面：店家詳情',
      '蔬食綠洲 App 畫面：共編功能',
      '蔬食綠洲 App 畫面：功能一覽',
    ],
  },
  {
    id: 3,
    anchor: 'project-wbc',
    title: 'WBC 2026 台灣情報站',
    category: 'Web · 2026 年賽事專案',
    description:
      '把 20 支國家隊的賽程、比分、中華隊陣容與複雜賽制，全部換算成台灣時間、翻成台灣球迷看得懂的內容。一天內完成並趕在開賽前上線，小組賽期間每日多次更新比分。',
    services: ['網頁平台設計'],
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind', 'Vercel'],
    links: [{ label: '查看專案', url: 'https://www.wbc-tw.club/' }],
    alt: 'WBC 2026 台灣情報站畫面：Pool C 五隊戰力雷達比較',
    lightboxLayout: 'fit',
    lightboxAlts: [
      'Pool C 五隊戰力雷達圖，比較日本、台灣、南韓、澳洲、捷克六項能力',
      '焦點球星頁面：全壘打王、打擊王、三振王排行',
    ],
  },
  {
    id: 4,
    anchor: 'project-vegblog',
    title: '蔬食知識庫',
    category: 'Web · 內容平台',
    description:
      '以證據為本的素食營養知識站。AI 輔助生成初稿，但不能直接上線——發佈條件由程式強制把關：免責聲明、審閱日期、SEO 標題與摘要，以及至少兩筆引用來源缺一不可，內文的引用編號也不得超過實際登錄的來源數。',
    services: ['AI 應用與流程自動化', '網頁平台設計'],
    technologies: ['Next.js 14', 'PostgreSQL', 'Prisma', 'Cloud Run', 'Cloudflare R2'],
    links: [{ label: '查看專案', url: 'https://vegmap.app/' }],
    alt: '蔬食知識庫網站首屏：站名、以證據為本的素食營養與生活指南標題與行動按鈕',
    lightboxLayout: 'scroll',
    lightboxAlts: [
      '蔬食知識庫首屏：站名、以證據為本的素食營養與生活指南標題與行動按鈕',
      '蔬食知識庫最新文章區：六篇文章卡片，副標註明每篇附參考來源與審閱紀錄',
    ],
  },
];
