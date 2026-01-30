import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { FaMobileAlt, FaGlobe, FaCog, FaMicrophone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
      title: 'AI 生成式模型',
      category: 'AI',
      description: 'Text-to-Image 與 Text-to-Video 生成應用',
      technologies: ['文生圖', '文生影', '生成式AI'],
      gradient: 'from-tech-cyan/30 to-tech-purple/30',
    },
    {
      id: 2,
      title: '行動購物 App',
      category: 'App',
      description: '支援原生與跨平台開發的電商解決方案',
      technologies: ['Android', 'iOS', 'Flutter'],
      gradient: 'from-tech-purple/30 to-tech-cyan/30',
    },
    {
      id: 3,
      title: '企業管理系統',
      category: 'Web',
      description: '客製化資訊系統平台',
      technologies: ['React', 'Python', 'PostgreSQL'],
      gradient: 'from-tech-cyan/30 to-tech-purple/30',
    },
  ];

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
      <section id="about" className="min-h-screen flex items-center justify-center py-20">
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
              <div className="text-tech-text text-lg">年經驗</div>
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
      <section id="services" className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 
            className="text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow text-center mb-12"
            data-aos="fade-up"
          >
            服務項目
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 服務卡片 1 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 card-expand relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="0"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-tech-cyan/20 rounded-full flex items-center justify-center mb-6 icon-rotate">
                  <FaMobileAlt className="text-3xl text-tech-cyan" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                  手機 App 開發
                </h3>
                <p className="text-tech-text leading-relaxed mb-4">
                  提供 iOS 和 Android 原生及跨平台應用開發服務，打造流暢的使用者體驗。
                </p>
                {hoveredCard === 1 && (
                  <div className="mt-4 pt-4 border-t border-tech-cyan/20">
                    <p className="text-sm text-tech-text/80">
                      • Swift / Kotlin 原生開發<br />
                      • Flutter 跨平台開發<br />
                      • App Store / Google Play 上架服務
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 服務卡片 2 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 card-expand relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="100"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-tech-cyan/20 rounded-full flex items-center justify-center mb-6 icon-rotate">
                  <FaGlobe className="text-3xl text-tech-cyan" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                  網頁平台設計
                </h3>
                <p className="text-tech-text leading-relaxed mb-4">
                  響應式網頁設計與開發，建立現代化、高效能的網路平台。
                </p>
                {hoveredCard === 2 && (
                  <div className="mt-4 pt-4 border-t border-tech-cyan/20">
                    <p className="text-sm text-tech-text/80">
                      • React / Vue.js 前端開發<br />
                      • Node.js / Python 後端開發<br />
                      • 雲端部署與 DevOps 服務
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 服務卡片 3 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 card-expand relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="200"
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-tech-cyan/20 rounded-full flex items-center justify-center mb-6 icon-rotate">
                  <FaCog className="text-3xl text-tech-cyan" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                  資訊系統建置
                </h3>
                <p className="text-tech-text leading-relaxed mb-4">
                  客製化資訊系統開發，協助企業數位轉型與流程優化。
                </p>
                {hoveredCard === 3 && (
                  <div className="mt-4 pt-4 border-t border-tech-cyan/20">
                    <p className="text-sm text-tech-text/80">
                      • ERP / CRM 系統開發<br />
                      • 資料庫設計與優化<br />
                      • API 整合與系統維護
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 服務卡片 4 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 card-expand relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="300"
              onMouseEnter={() => setHoveredCard(4)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-tech-cyan/20 rounded-full flex items-center justify-center mb-6 icon-rotate">
                  <FaMicrophone className="text-3xl text-tech-cyan" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                  語音 AI 模型應用
                </h3>
                <p className="text-tech-text leading-relaxed mb-4">
                  整合語音辨識與 AI 技術，開發智能語音助手與相關應用。
                </p>
                {hoveredCard === 4 && (
                  <div className="mt-4 pt-4 border-t border-tech-cyan/20">
                    <p className="text-sm text-tech-text/80">
                      • 語音辨識與合成<br />
                      • 自然語言處理 (NLP)<br />
                      • 機器學習模型整合
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 特殊服務卡片 */}
            <div 
              className="md:col-span-2 bg-gradient-to-r from-tech-cyan/20 to-tech-purple/20 border-glow rounded-lg p-8 card-expand"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                協助申請安卓 App 正式版權限
              </h3>
              <p className="text-tech-text leading-relaxed">
                我們協助新開發者申請 Android App 正式版權限流程，包含完成 20 人封測及 14 天測試期，以符合上架要求。
                從文件準備到審核通過，我們提供全程協助服務。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 分隔線 */}
      <div className="section-divider" />

      {/* 專案成果區塊 */}
      <section id="portfolio" className="min-h-screen flex items-center justify-center py-20">
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
            我們的專案涵蓋電子商務平台、語音助手和多款手機應用程式。
            每個專案都經過精心設計與開發，確保品質與使用者體驗。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="project-card bg-tech-darker border-glow rounded-lg overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* 專案截圖佔位符 */}
                <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                  <div className="text-6xl text-tech-cyan/50 font-heading font-bold">
                    {project.title.charAt(0)}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-tech-purple font-semibold">{project.category}</span>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-tech-cyan mb-2">
                    {project.title}
                  </h3>
                  <p className="text-tech-text text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* 技術標籤 */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">
                        {tech}
                      </span>
                    ))}
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
      <section id="contact" className="min-h-screen flex items-center justify-center py-20 bg-tech-darker">
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
              
              <div className="flex items-start space-x-4">
                <FaEnvelope className="text-2xl text-tech-cyan mt-1 flex-shrink-0" />
                <div>
                  <p className="text-tech-text mb-1">
                    <span className="text-tech-cyan font-semibold">Email:</span>
                  </p>
                  <a 
                    href="mailto:loxyz.tw@gmail.com" 
                    className="text-tech-cyan hover:text-tech-purple transition-colors underline text-lg"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    loxyz.tw@gmail.com
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
            © 2025 丰科有限公司
          </p>
        </div>
      </footer>
    </div>
  );
}
