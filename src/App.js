import React, { useState } from 'react';
import { Link } from 'react-scroll';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="font-body bg-tech-dark text-tech-text">
      {/* 導航欄 */}
      <nav className="fixed top-0 w-full bg-tech-darker/80 backdrop-blur-md shadow-lg z-50 border-b border-tech-cyan/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-tech-cyan text-glow">
            開發同學會工作室
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
      <section id="home" className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center max-w-4xl mx-auto px-6" data-aos="fade-up">
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-tech-cyan text-glow mb-6">
            歡迎來到我們的官網！
          </h2>
          <p className="mt-4 text-xl md:text-2xl text-tech-text mb-8">
            我們專注於開發 App、網站與 AI 應用
          </p>
          <Link 
            to="services" 
            smooth={true} 
            duration={500}
            className="inline-block px-8 py-3 bg-tech-cyan text-tech-dark font-bold rounded-lg glow-effect hover:bg-tech-purple transition-all duration-300"
          >
            了解更多
          </Link>
        </div>
      </section>

      {/* 關於我們區塊 */}
      <section id="about" className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow mb-8">
            關於我們
          </h2>
          <p className="mt-4 text-lg md:text-xl text-tech-text leading-relaxed">
            我們的團隊擁有豐富的經驗，專注於提供創新解決方案，滿足客戶需求。
            從行動應用開發到 AI 技術整合，我們致力於將您的想法轉化為現實。
          </p>
        </div>
      </section>

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
              className="bg-tech-darker border-glow rounded-lg p-8 hover:scale-105 transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                手機 App 開發
              </h3>
              <p className="text-tech-text leading-relaxed">
                提供 iOS 和 Android 原生及跨平台應用開發服務，打造流暢的使用者體驗。
              </p>
            </div>

            {/* 服務卡片 2 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 hover:scale-105 transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                網頁平台設計
              </h3>
              <p className="text-tech-text leading-relaxed">
                響應式網頁設計與開發，建立現代化、高效能的網路平台。
              </p>
            </div>

            {/* 服務卡片 3 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 hover:scale-105 transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                資訊系統建置
              </h3>
              <p className="text-tech-text leading-relaxed">
                客製化資訊系統開發，協助企業數位轉型與流程優化。
              </p>
            </div>

            {/* 服務卡片 4 */}
            <div 
              className="bg-tech-darker border-glow rounded-lg p-8 hover:scale-105 transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="text-4xl mb-4">🗣️</div>
              <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                語音 AI 模型應用
              </h3>
              <p className="text-tech-text leading-relaxed">
                整合語音辨識與 AI 技術，開發智能語音助手與相關應用。
              </p>
            </div>

            {/* 特殊服務卡片 */}
            <div 
              className="md:col-span-2 bg-gradient-to-r from-tech-cyan/20 to-tech-purple/20 border-glow rounded-lg p-8 hover:scale-105 transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h3 className="text-2xl font-heading font-semibold text-tech-cyan mb-4">
                協助申請安卓 App 正式版權限
              </h3>
              <p className="text-tech-text leading-relaxed">
                我們協助新開發者申請 Android App 正式版權限流程，包含完成 20 人封測及 14 天測試期，以符合上架要求。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 專案成果區塊 */}
      <section id="portfolio" className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow mb-8">
            專案成果
          </h2>
          <p className="mt-4 text-lg md:text-xl text-tech-text leading-relaxed">
            我們的專案涵蓋電子商務平台、語音助手和多款手機應用程式。
            每個專案都經過精心設計與開發，確保品質與使用者體驗。
          </p>
        </div>
      </section>

      {/* 聯絡我們區塊 */}
      <section id="contact" className="min-h-screen flex items-center justify-center py-20 bg-tech-darker">
        <div className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow mb-8">
            聯絡我們
          </h2>
          <p className="mt-4 text-lg md:text-xl text-tech-text mb-8">
            歡迎隨時聯絡我們進行合作洽談
          </p>
          <div className="bg-tech-dark border-glow rounded-lg p-8 text-left">
            <div className="space-y-4">
              <p className="text-lg md:text-xl text-tech-text">
                <span className="text-tech-cyan font-semibold">📧 Email:</span>{' '}
                <a 
                  href="mailto:loxyz.tw@gmail.com" 
                  className="text-tech-cyan hover:text-tech-purple transition-colors underline"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  loxyz.tw@gmail.com
                </a>
              </p>
              <p className="text-lg md:text-xl text-tech-text">
                <span className="text-tech-cyan font-semibold">📧 Email:</span>{' '}
                <a 
                  href="mailto:app@roylo.xyz" 
                  className="text-tech-cyan hover:text-tech-purple transition-colors underline"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  app@roylo.xyz
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
