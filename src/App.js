import React from 'react';
import { Link } from 'react-scroll';

export default function App() {
  return (
    <div className="font-sans">
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">開發同學會工作室</h1>
          <div>
            <Link to="home" smooth={true} duration={500} className="mx-4 cursor-pointer">首頁</Link>
            <Link to="about" smooth={true} duration={500} className="mx-4 cursor-pointer">關於我們</Link>
            <Link to="services" smooth={true} duration={500} className="mx-4 cursor-pointer">服務</Link>
            <Link to="portfolio" smooth={true} duration={500} className="mx-4 cursor-pointer">專案成果</Link>
            <Link to="contact" smooth={true} duration={500} className="mx-4 cursor-pointer">聯絡我們</Link>
          </div>
        </div>
      </nav>

      <section id="home" className="h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-blue-900">歡迎來到我們的官網！</h2>
          <p className="mt-4 text-lg text-blue-800">我們專注於開發 App、網站與 AI 應用。</p>
        </div>
      </section>

      <section id="about" className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-gray-800">關於我們</h2>
          <p className="mt-4 text-lg text-gray-600">
            我們的團隊擁有豐富的經驗，專注於提供創新解決方案，滿足客戶需求。
          </p>
        </div>
      </section>

      <section id="services" className="h-screen bg-white flex items-center justify-center">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-800">服務項目</h2>
          <ul className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">協助申請安卓 App 正式版權限</h3>
              <p className="text-gray-700">
                我們協助新開發者申請 Android App 正式版權限流程，包含完成 20人封測及 14天測試期，以符合上架要求。
              </p>
            </div>
          </div>
            <li>📱 手機 App 開發</li>
            <li>🌐 網頁平台設計</li>
            <li>🛠️ 資訊系統建置</li>
            <li>🗣️ 語音 AI 模型應用</li>
          </ul>
        </div>
      </section>

      <section id="portfolio" className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-gray-800">專案成果</h2>
          <p className="mt-4 text-lg text-gray-600">
            我們的專案涵蓋電子商務平台、語音助手和多款手機應用程式。
          </p>
        </div>
      </section>

      <section id="contact" className="h-screen bg-white flex items-center justify-center">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-gray-800">聯絡我們</h2>
          <p className="mt-4 text-lg text-gray-600">歡迎隨時聯絡我們進行合作洽談。</p>
          <p className="mt-6 text-lg">
            📧 Email: <a href="mailto:loxyz.tw@gmail.com" className="text-blue-900 hover:underline"  target="_blank" rel="noopener noreferrer">
              loxyz.tw@gmail.com
              </a>
          </p>
        </div>
      </section>
    </div>
  );
}
