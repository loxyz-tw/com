import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-scroll';
import {
  FaMobileAlt,
  FaGlobe,
  FaCog,
  FaRobot,
  FaEnvelope,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

import newstocomicCover640 from './images/projects/newstocomic-cover-640.webp';
import newstocomicCover1280 from './images/projects/newstocomic-cover-1280.webp';
import newstocomicFull from './images/projects/newstocomic-full.webp';
import vegmapCover640 from './images/projects/vegmap-cover-640.webp';
import vegmapCover1280 from './images/projects/vegmap-cover-1280.webp';
import vegmapFull1 from './images/projects/vegmap-full-1.webp';
import vegmapFull2 from './images/projects/vegmap-full-2.webp';
import vegmapFull3 from './images/projects/vegmap-full-3.webp';
import vegmapFull4 from './images/projects/vegmap-full-4.webp';
import wbcCover640 from './images/projects/wbc-cover-640.webp';
import wbcCover1280 from './images/projects/wbc-cover-1280.webp';
import wbcFull1 from './images/projects/wbc-full-1.webp';
import wbcFull2 from './images/projects/wbc-full-2.webp';
import vegblogCover640 from './images/projects/vegblog-cover-640.webp';
import vegblogCover1280 from './images/projects/vegblog-cover-1280.webp';
import vegblogFull1 from './images/projects/vegblog-full-1.webp';
import vegblogFull2 from './images/projects/vegblog-full-2.webp';

const PROJECT_COVER_SIZES =
  '(min-width: 1200px) 536px, (min-width: 768px) calc((100vw - 120px) / 2), calc(100vw - 88px)';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxProject, setLightboxProject] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lightboxTriggerRef = useRef(null);
  const lightboxDialogRef = useRef(null);
  const lightboxCloseBtnRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openLightbox = (project, triggerEl) => {
    lightboxTriggerRef.current = triggerEl;
    setLightboxIndex(0);
    setLightboxProject(project);
  };

  const closeLightbox = useCallback(() => {
    setLightboxProject(null);
    setLightboxIndex(0);
    const trigger = lightboxTriggerRef.current;
    if (trigger && typeof trigger.focus === 'function') {
      trigger.focus();
    }
    lightboxTriggerRef.current = null;
  }, []);

  // 粒子背景生成
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 6}s`,
    },
  }));

  // 專案數據
  const projects = [
    {
      id: 1,
      anchor: 'project-newstocomic',
      title: '新聞漫畫 NewsToComic',
      category: 'AI · 自動化',
      description:
        '從抓取新聞、AI 改寫劇本、生成三格圖到發布上線，串成一條可一鍵執行的自動化管線，端到端產出一則漫畫約 20 秒。',
      services: ['AI 應用與流程自動化', '網頁平台設計'],
      technologies: ['Python', 'Gemini', 'ComfyUI', 'Next.js', 'Cloudflare R2'],
      cover: {
        src: newstocomicCover640,
        srcSet: `${newstocomicCover640} 640w, ${newstocomicCover1280} 1280w`,
      },
      links: [{ label: '查看專案', url: 'https://www.news-to-comic.xyz/' }],
      alt: '新聞漫畫專案畫面：兩支手機展示由新聞自動生成的三格漫畫',
      lightbox: [
        {
          src: newstocomicFull,
          alt: '由尼泊爾洪災新聞自動生成的三格漫畫',
        },
      ],
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
      cover: {
        src: vegmapCover640,
        srcSet: `${vegmapCover640} 640w, ${vegmapCover1280} 1280w`,
      },
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
      lightbox: [
        { src: vegmapFull1, alt: '蔬食綠洲 App 畫面：地圖瀏覽' },
        { src: vegmapFull2, alt: '蔬食綠洲 App 畫面：店家詳情' },
        { src: vegmapFull3, alt: '蔬食綠洲 App 畫面：共編功能' },
        { src: vegmapFull4, alt: '蔬食綠洲 App 畫面：功能一覽' },
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
      cover: {
        src: wbcCover640,
        srcSet: `${wbcCover640} 640w, ${wbcCover1280} 1280w`,
      },
      links: [{ label: '查看專案', url: 'https://www.wbc-tw.club/' }],
      alt: 'WBC 2026 台灣情報站畫面：Pool C 五隊戰力雷達比較',
      lightbox: [
        {
          src: wbcFull1,
          alt: 'Pool C 五隊戰力雷達圖，比較日本、台灣、南韓、澳洲、捷克六項能力',
        },
        {
          src: wbcFull2,
          alt: '焦點球星頁面：全壘打王、打擊王、三振王排行',
        },
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
      cover: {
        src: vegblogCover640,
        srcSet: `${vegblogCover640} 640w, ${vegblogCover1280} 1280w`,
      },
      links: [{ label: '查看專案', url: 'https://vegmap.app/' }],
      alt: '蔬食知識庫網站畫面：四個內容分類與最新文章列表',
      lightbox: [
        {
          src: vegblogFull1,
          alt: '蔬食知識庫首頁：營養指南、保健評析、空汙議題、生活實踐四個分類與最新文章',
        },
        {
          src: vegblogFull2,
          alt: '蔬食知識庫文章內頁：內文與風險提醒段落',
        },
      ],
    },
  ];

  // SPA 深連結：首屏渲染後再依 hash 捲動（原生 hash scroll 時目標節點尚不存在）
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;
      document.getElementById(id)?.scrollIntoView();
    };
    const timer = window.setTimeout(scrollToHash, 50);
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  useEffect(() => {
    if (!lightboxProject) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      lightboxCloseBtnRef.current?.focus();
    }, 0);

    const getFocusable = () => {
      const root = lightboxDialogRef.current;
      if (!root) return [];
      return [
        ...root.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
        return;
      }

      const images = lightboxProject.lightbox;
      if (images.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        // VegMap 用橫向滑動；WBC（2 張）用前後切換 + 左右鍵
        if (images.length === 2) {
          event.preventDefault();
          setLightboxIndex((current) => {
            if (event.key === 'ArrowLeft') {
              return (current - 1 + images.length) % images.length;
            }
            return (current + 1) % images.length;
          });
        }
      }

      if (event.key === 'Tab') {
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxProject, closeLightbox]);

  return (
    <div className="font-body bg-tech-dark text-tech-text page-load">
      {/* 導航欄 */}
      <nav className="fixed top-0 w-full bg-tech-darker/80 backdrop-blur-md shadow-lg z-50 border-b border-tech-cyan/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-tech-cyan text-glow">
            丰科有限公司
          </h1>
          
          {/* 桌面版選單 */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="home" 
              smooth={true} 
              duration={500} 
              className="nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
            >
              首頁
            </Link>
            <Link 
              to="about" 
              smooth={true} 
              duration={500} 
              className="nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
            >
              關於我們
            </Link>
            <Link 
              to="services" 
              smooth={true} 
              duration={500} 
              className="nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
            >
              服務
            </Link>
            <Link 
              to="portfolio" 
              smooth={true} 
              duration={500} 
              className="nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
            >
              專案成果
            </Link>
            <Link 
              to="contact" 
              smooth={true} 
              duration={500} 
              className="nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
            >
              聯絡我們
            </Link>
          </div>

          {/* 手機版選單按鈕 */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-tech-cyan focus:outline-none"
            aria-label="選單"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 手機版選單 */}
        {mobileMenuOpen && (
          <div className="md:hidden mobile-menu-enter bg-tech-darker/95 backdrop-blur-md border-t border-tech-cyan/20">
            <div className="px-6 py-4 space-y-4">
              <Link 
                to="home" 
                smooth={true} 
                duration={500} 
                onClick={toggleMobileMenu}
                className="block nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
              >
                首頁
              </Link>
              <Link 
                to="about" 
                smooth={true} 
                duration={500} 
                onClick={toggleMobileMenu}
                className="block nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
              >
                關於我們
              </Link>
              <Link 
                to="services" 
                smooth={true} 
                duration={500} 
                onClick={toggleMobileMenu}
                className="block nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
              >
                服務
              </Link>
              <Link 
                to="portfolio" 
                smooth={true} 
                duration={500} 
                onClick={toggleMobileMenu}
                className="block nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
              >
                專案成果
              </Link>
              <Link 
                to="contact" 
                smooth={true} 
                duration={500} 
                onClick={toggleMobileMenu}
                className="block nav-link text-tech-text hover:text-tech-cyan cursor-pointer transition-colors"
              >
                聯絡我們
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero 區塊 */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        {/* 粒子背景 */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={particle.style}
            />
          ))}
        </div>
        
        {/* 漸層覆蓋 */}
        <div className="gradient-overlay" />

        <div className="text-center max-w-5xl mx-auto px-6 relative z-10" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-tech-cyan text-glow mb-4">
            丰科有限公司
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-tech-text mb-6">
            專業 App、網站與 AI 應用開發
          </h2>
          <p className="mt-4 text-lg md:text-xl text-tech-text/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            我們致力於將創新想法轉化為現實，提供從概念到上線的完整開發服務
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="services" 
              smooth={true} 
              duration={500}
              className="px-8 py-4 bg-tech-cyan text-tech-dark font-bold rounded-lg glow-effect hover:bg-tech-purple transition-all duration-300 button-click"
            >
              了解更多
            </Link>
            <Link 
              to="contact" 
              smooth={true} 
              duration={500}
              className="px-8 py-4 bg-transparent border-2 border-tech-cyan text-tech-cyan font-bold rounded-lg hover:bg-tech-cyan/10 transition-all duration-300 button-click"
            >
              聯絡我們
            </Link>
          </div>
        </div>

        {/* 滾動指示器 */}
        <div className="scroll-indicator" />
      </section>

      {/* 分隔線 */}
      <div className="section-divider" />

      {/* 關於我們區塊 */}
      <section id="about" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 
            className="text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow text-center mb-12"
            data-aos="fade-up"
          >
            關於我們
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* 數據展示 */}
            <div className="text-center" data-aos="fade-up" data-aos-delay="0">
              <div className="text-5xl font-heading font-bold text-tech-cyan text-glow mb-2 count-animate">
                50+
              </div>
              <div className="text-tech-text text-lg">完成專案</div>
            </div>
            <div className="text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="text-5xl font-heading font-bold text-tech-cyan text-glow mb-2 count-animate">
                10+
              </div>
              <div className="text-tech-text text-lg">合作客戶</div>
            </div>
            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="text-5xl font-heading font-bold text-tech-cyan text-glow mb-2 count-animate">
                10+
              </div>
              <div className="text-tech-text text-lg">團隊開發年資</div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center" data-aos="fade-in">
            <p className="text-lg md:text-xl text-tech-text leading-relaxed mb-6">
              我們的團隊擁有豐富的經驗，專注於提供創新解決方案，滿足客戶需求。
              <br />
              從行動應用開發到 AI 技術整合，我們致力於將您的想法轉化為現實。
            </p>
            <p className="text-lg md:text-xl text-tech-text leading-relaxed">
              我們相信技術應該服務於人，每個專案都經過精心設計與開發，
              <br />
              確保品質、效能與使用者體驗的完美平衡。
            </p>
          </div>
        </div>
      </section>

      {/* 分隔線 */}
      <div className="section-divider" />

      {/* 服務區塊 */}
      <section id="services" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 
            className="text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow text-center mb-12"
            data-aos="fade-up"
          >
            服務項目
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* 服務卡片 1 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 card-expand relative overflow-hidden h-full flex flex-col"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="relative z-10 flex flex-col flex-1">
                <div className="w-16 h-16 bg-tech-cyan/20 rounded-full flex items-center justify-center mb-6 icon-rotate">
                  <FaMobileAlt className="text-3xl text-tech-cyan" />
                </div>
                <h3 className="text-2xl font-body font-semibold text-tech-cyan mb-4">
                  手機 App 開發
                </h3>
                <p className="text-tech-text leading-relaxed mb-4">
                  提供 iOS 和 Android 原生及跨平台應用開發服務，打造流暢的使用者體驗。
                </p>
                <div className="mt-4 pt-4 border-t border-tech-cyan/20">
                  <p className="text-sm text-tech-text/80">
                    • Swift / Kotlin 原生開發<br />
                    • Flutter 跨平台開發<br />
                    • App Store / Google Play 上架服務
                  </p>
                </div>
                <p className="mt-auto pt-6 text-sm text-tech-text/80">
                  代表案例：
                  <a href="#project-vegmap" className="text-tech-cyan hover:text-tech-purple underline transition-colors">
                    蔬食綠洲 VegMap
                  </a>
                </p>
              </div>
            </div>

            {/* 服務卡片 2 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 card-expand relative overflow-hidden h-full flex flex-col"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="relative z-10 flex flex-col flex-1">
                <div className="w-16 h-16 bg-tech-cyan/20 rounded-full flex items-center justify-center mb-6 icon-rotate">
                  <FaGlobe className="text-3xl text-tech-cyan" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                  網頁平台設計
                </h3>
                <p className="text-tech-text leading-relaxed mb-4">
                  響應式網頁設計與開發，建立現代化、高效能的網路平台。
                </p>
                <div className="mt-4 pt-4 border-t border-tech-cyan/20">
                  <p className="text-sm text-tech-text/80">
                    • React / Vue.js 前端開發<br />
                    • Node.js / Python 後端開發<br />
                    • 雲端部署與 DevOps 服務
                  </p>
                </div>
                <p className="mt-auto pt-6 text-sm text-tech-text/80">
                  代表案例：
                  <a href="#project-wbc" className="text-tech-cyan hover:text-tech-purple underline transition-colors">
                    WBC 2026 台灣情報站
                  </a>
                </p>
              </div>
            </div>

            {/* 服務卡片 3 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 card-expand relative overflow-hidden h-full flex flex-col"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="relative z-10 flex flex-col flex-1">
                <div className="w-16 h-16 bg-tech-cyan/20 rounded-full flex items-center justify-center mb-6 icon-rotate">
                  <FaCog className="text-3xl text-tech-cyan" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                  資訊系統建置
                </h3>
                <p className="text-tech-text leading-relaxed mb-4">
                  客製化資訊系統開發，協助企業數位轉型與流程優化。
                </p>
                <div className="mt-4 pt-4 border-t border-tech-cyan/20">
                  <p className="text-sm text-tech-text/80">
                    • ERP / CRM 系統開發<br />
                    • 資料庫設計與優化<br />
                    • API 整合與系統維護
                  </p>
                </div>
                <p className="mt-auto pt-6 text-sm text-tech-text/80">
                  代表案例：
                  <a href="#project-vegmap" className="text-tech-cyan hover:text-tech-purple underline transition-colors">
                    蔬食綠洲 VegMap
                  </a>
                </p>
              </div>
            </div>

            {/* 服務卡片 4 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 card-expand relative overflow-hidden h-full flex flex-col"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="relative z-10 flex flex-col flex-1">
                <div className="w-16 h-16 bg-tech-cyan/20 rounded-full flex items-center justify-center mb-6 icon-rotate">
                  <FaRobot className="text-3xl text-tech-cyan" />
                </div>
                <h3 className="text-2xl font-body font-semibold text-tech-cyan mb-4">
                  AI 應用與流程自動化
                </h3>
                <p className="text-tech-text leading-relaxed mb-4">
                  將生成式 AI 與既有流程接起來，打造可一鍵執行、具備排程能力的自動化管線。
                </p>
                <div className="mt-4 pt-4 border-t border-tech-cyan/20">
                  <p className="text-sm text-tech-text/80">
                    • 生成式 AI 內容工作流<br />
                    • 排程、資料管線與成本控管<br />
                    • 語音辨識與模型整合
                  </p>
                </div>
                <p className="mt-auto pt-6 text-sm text-tech-text/80">
                  代表案例：
                  <a href="#project-newstocomic" className="text-tech-cyan hover:text-tech-purple underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan">
                    新聞漫畫 NewsToComic
                  </a>
                  、
                  <a href="#project-vegblog" className="text-tech-cyan hover:text-tech-purple underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan">
                    蔬食知識庫
                  </a>
                </p>
              </div>
            </div>

            {/* 特殊服務卡片 */}
            <div 
              className="md:col-span-2 bg-gradient-to-r from-tech-cyan/20 to-tech-purple/20 border-glow rounded-lg p-8 card-expand"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 className="text-2xl font-body font-semibold text-tech-cyan mb-4">
                協助申請安卓 App 正式版權限
              </h3>
              <p className="text-tech-text leading-relaxed">
                我們協助新開發者完成 Google Play 封閉測試與正式版權限申請，從封閉測試規劃、測試者管理與回饋彙整，到文件準備與審核通過提供全程協助。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 分隔線 */}
      <div className="section-divider" />

      {/* 專案成果區塊 */}
      <section id="portfolio" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 
            className="text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow text-center mb-4"
            data-aos="fade-up"
          >
            專案成果
          </h2>
          <p 
            className="text-center text-tech-text/80 mb-12 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            我們的專案涵蓋 AI 自動化內容生產、雙平台行動應用，以及短交期的內容型網站。
            以下四個案例都已實際上線，歡迎直接點開來看。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {projects.map((project, index) => (
              <div
                key={project.id}
                id={project.anchor}
                className="scroll-mt-24 h-full"
              >
                <div
                  className="project-card bg-tech-darker border-glow rounded-lg overflow-hidden h-full flex flex-col"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <button
                    type="button"
                    className="aspect-[4/3] overflow-hidden w-full block p-0 border-0 bg-transparent cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan"
                    onClick={(event) => openLightbox(project, event.currentTarget)}
                    aria-label={`查看${project.title}完整畫面`}
                  >
                    <img
                      src={project.cover.src}
                      srcSet={project.cover.srcSet}
                      sizes={PROJECT_COVER_SIZES}
                      width={640}
                      height={480}
                      loading="lazy"
                      decoding="async"
                      alt={project.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-2">
                      <span className="text-xs text-tech-purple font-semibold">{project.category}</span>
                    </div>
                    <h3 className="text-xl font-body font-semibold text-tech-cyan mb-2">
                      {project.title}
                    </h3>
                    <p className="text-tech-text text-sm mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-4">
                      {project.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-tech-cyan hover:text-tech-purple transition-colors underline"
                        >
                          {link.label}
                          <FaExternalLinkAlt className="text-xs" aria-hidden="true" />
                        </a>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <p className="text-xs text-tech-text/60 mb-1">對應服務</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.services.map((service) => (
                          <span key={service} className="service-tag">
                            {service}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 分隔線 */}
      <div className="section-divider" />

      {/* 聯絡我們區塊 */}
      <section id="contact" className="py-24 md:py-32 bg-tech-darker">
        <div className="max-w-4xl mx-auto px-6">
          <h2 
            className="text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow text-center mb-4"
            data-aos="fade-up"
          >
            聯絡我們
          </h2>
          <p 
            className="text-center text-lg md:text-xl text-tech-text mb-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            歡迎隨時聯絡我們進行合作洽談
          </p>
          
          <div 
            className="bg-tech-dark border-glow rounded-lg p-8 md:p-12"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FaEnvelope className="text-2xl text-tech-cyan mt-1 flex-shrink-0" />
                <div>
                  <p className="text-tech-text mb-1">
                    <span className="text-tech-cyan font-semibold">Email:</span>
                  </p>
                  <a 
                    href="mailto:app@fun-tech.vip" 
                    className="text-tech-cyan hover:text-tech-purple transition-colors underline text-lg"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    app@fun-tech.vip
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 頁尾 */}
      <footer className="bg-tech-darker border-t border-tech-cyan/20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-tech-cyan font-heading font-bold text-lg mb-2">
            丰科有限公司 Fun Tech CO
          </p>
          <div className="flex items-center justify-center gap-2 text-tech-text mb-2">
            <FaMapMarkerAlt className="text-tech-cyan flex-shrink-0" />
            <span>新北市中和區中原二街28號18樓</span>
          </div>
          <p className="text-tech-text/70 text-sm">
            © {new Date().getFullYear()} 丰科有限公司
          </p>
        </div>
      </footer>

      {lightboxProject &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-tech-dark/90 flex items-center justify-center p-0 md:p-6"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeLightbox();
              }
            }}
          >
            <div
              ref={lightboxDialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${lightboxProject.title}完整畫面`}
              className={`relative w-full md:w-full md:max-w-5xl bg-tech-darker border border-tech-cyan/30 md:rounded-lg shadow-2xl flex flex-col overflow-hidden ${
                lightboxProject.lightbox.length === 2
                  ? 'h-auto max-h-[100dvh] md:max-h-[90dvh]'
                  : 'h-full md:h-[90vh]'
              }`}
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-tech-cyan/20 shrink-0">
                <p className="text-tech-cyan font-semibold truncate">{lightboxProject.title}</p>
                <button
                  ref={lightboxCloseBtnRef}
                  type="button"
                  onClick={closeLightbox}
                  className="text-tech-text hover:text-tech-cyan p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan"
                  aria-label="關閉預覽"
                >
                  <FaTimes className="text-xl" aria-hidden="true" />
                </button>
              </div>

              {lightboxProject.lightbox.length === 1 && (
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  <div className="h-full overflow-y-auto p-4">
                    <img
                      src={lightboxProject.lightbox[0].src}
                      alt={lightboxProject.lightbox[0].alt}
                      className="block mx-auto max-w-full h-auto"
                    />
                  </div>
                </div>
              )}

              {lightboxProject.lightbox.length > 2 && (
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  <div className="h-full overflow-x-auto snap-x snap-mandatory flex gap-4 p-4 items-center">
                    {lightboxProject.lightbox.map((image) => (
                      <div
                        key={image.src}
                        className="snap-center shrink-0 w-[min(80vw,360px)] h-full flex items-center justify-center"
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="max-h-full w-auto object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lightboxProject.lightbox.length === 2 && (
                <>
                  <div className="relative p-3 md:p-4">
                    <img
                      src={lightboxProject.lightbox[lightboxIndex].src}
                      alt={lightboxProject.lightbox[lightboxIndex].alt}
                      className="block mx-auto max-w-full h-auto"
                    />
                    <button
                      type="button"
                      className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-tech-dark/70 backdrop-blur text-tech-cyan hover:text-tech-purple hover:bg-tech-dark/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-tech-darker"
                      aria-label="上一張"
                      onClick={() =>
                        setLightboxIndex(
                          (current) =>
                            (current - 1 + lightboxProject.lightbox.length) %
                            lightboxProject.lightbox.length
                        )
                      }
                    >
                      <FaChevronLeft className="text-xl" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-tech-dark/70 backdrop-blur text-tech-cyan hover:text-tech-purple hover:bg-tech-dark/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-tech-darker"
                      aria-label="下一張"
                      onClick={() =>
                        setLightboxIndex(
                          (current) => (current + 1) % lightboxProject.lightbox.length
                        )
                      }
                    >
                      <FaChevronRight className="text-xl" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="md:hidden flex items-center justify-center gap-6 px-4 py-3 border-t border-tech-cyan/20 shrink-0">
                    <button
                      type="button"
                      className="flex w-11 h-11 items-center justify-center rounded-full bg-tech-dark/70 backdrop-blur text-tech-cyan hover:text-tech-purple hover:bg-tech-dark/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan"
                      aria-label="上一張"
                      onClick={() =>
                        setLightboxIndex(
                          (current) =>
                            (current - 1 + lightboxProject.lightbox.length) %
                            lightboxProject.lightbox.length
                        )
                      }
                    >
                      <FaChevronLeft className="text-xl" aria-hidden="true" />
                    </button>
                    <span className="text-tech-text/80 text-sm tabular-nums min-w-[3rem] text-center">
                      {lightboxIndex + 1} / {lightboxProject.lightbox.length}
                    </span>
                    <button
                      type="button"
                      className="flex w-11 h-11 items-center justify-center rounded-full bg-tech-dark/70 backdrop-blur text-tech-cyan hover:text-tech-purple hover:bg-tech-dark/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan"
                      aria-label="下一張"
                      onClick={() =>
                        setLightboxIndex(
                          (current) => (current + 1) % lightboxProject.lightbox.length
                        )
                      }
                    >
                      <FaChevronRight className="text-xl" aria-hidden="true" />
                    </button>
                  </div>

                  <p className="hidden md:block text-center text-tech-text/70 text-sm pb-3 shrink-0">
                    {lightboxIndex + 1} / {lightboxProject.lightbox.length}
                  </p>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
