import React, { useEffect, useRef, useState } from 'react';
import {
  FaCheck,
  FaCopy,
  FaEnvelope,
  FaExternalLinkAlt,
  FaLine,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import {
  ADDRESS_FULL,
  COPYRIGHT_YEAR,
  EMAIL,
  LINE_ID,
  LINE_URL,
} from '../data/site';
import {
  PHP2SHELL_DESCRIPTION,
  PHP2SHELL_DISCLAIMER,
  PHP2SHELL_H1,
  PHP2SHELL_HELP,
  PHP2SHELL_OG_IMAGE,
  PHP2SHELL_IMPACT,
  PHP2SHELL_REFERENCES,
  PHP2SHELL_REMEDIATION,
  PHP2SHELL_STEPS,
  PHP2SHELL_SUMMARY,
  PHP2SHELL_TITLE,
  PHP2SHELL_URL,
} from '../data/php2shell';
import Php2ShellStructuredData from '../seo/Php2ShellStructuredData';
import { copyText } from '../utils/copyText';

function setMetaContent(attr, name, content) {
  const el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.setAttribute('content', content);
}

export default function Php2ShellPage() {
  const [emailCopied, setEmailCopied] = useState(false);
  const emailCopiedTimerRef = useRef(null);

  useEffect(() => {
    document.title = PHP2SHELL_TITLE;
    setMetaContent('name', 'description', PHP2SHELL_DESCRIPTION);
    setMetaContent('property', 'og:title', PHP2SHELL_TITLE);
    setMetaContent('property', 'og:description', PHP2SHELL_DESCRIPTION);
    setMetaContent('property', 'og:url', PHP2SHELL_URL);
    setMetaContent('property', 'og:image', PHP2SHELL_OG_IMAGE);
    setMetaContent('property', 'og:image:alt', PHP2SHELL_TITLE);
    setMetaContent('name', 'twitter:title', PHP2SHELL_TITLE);
    setMetaContent('name', 'twitter:description', PHP2SHELL_DESCRIPTION);
    setMetaContent('name', 'twitter:image', PHP2SHELL_OG_IMAGE);
    setMetaContent('name', 'twitter:image:alt', PHP2SHELL_TITLE);
    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', PHP2SHELL_URL);
  }, []);

  useEffect(() => () => window.clearTimeout(emailCopiedTimerRef.current), []);

  const copyEmail = async () => {
    const ok = await copyText(EMAIL);
    if (!ok) return;
    setEmailCopied(true);
    window.clearTimeout(emailCopiedTimerRef.current);
    emailCopiedTimerRef.current = window.setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="font-body bg-tech-dark text-tech-text page-load">
      <Php2ShellStructuredData />
      <nav className="fixed top-0 w-full bg-tech-darker/80 backdrop-blur-md shadow-lg z-50 border-b border-tech-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
          <a href="/" className="text-lg sm:text-2xl font-heading font-bold text-tech-cyan text-glow">
            <span>丰科有限公司</span>
          </a>
          <div className="flex items-center gap-4 sm:gap-8 shrink-0">
            <a
              href="/"
              className="nav-link text-sm sm:text-base text-tech-text hover:text-tech-cyan whitespace-nowrap transition-colors"
            >
              回首頁
            </a>
            <a
              href="#contact"
              className="nav-link text-sm sm:text-base text-tech-text hover:text-tech-cyan whitespace-nowrap transition-colors"
            >
              聯絡我們
            </a>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-12 md:pt-32">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow mb-6">
            {PHP2SHELL_H1}
          </h1>
          <p className="text-lg md:text-xl text-tech-text leading-relaxed">
            {PHP2SHELL_SUMMARY}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="px-6 py-3 bg-tech-cyan text-tech-dark font-bold rounded-lg glow-effect hover:bg-tech-purple transition-all duration-300 button-click"
            >
              Email 聯絡
            </a>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-tech-cyan text-tech-cyan font-bold rounded-lg hover:bg-tech-cyan/10 transition-all duration-300 button-click"
            >
              <FaLine className="text-xl" aria-hidden="true" />
              LINE 聯絡
            </a>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-tech-cyan text-glow mb-6">
            影響範圍
          </h2>
          <p className="text-tech-text leading-relaxed">{PHP2SHELL_IMPACT}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-tech-cyan text-glow mb-6">
            如何修補
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-tech-text leading-relaxed">
            {PHP2SHELL_REMEDIATION.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-tech-cyan text-glow mb-6">
            建議處理步驟
          </h2>
          <ol className="list-decimal pl-6 space-y-3 text-tech-text leading-relaxed">
            {PHP2SHELL_STEPS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-tech-cyan text-glow mb-6">
            丰科可以協助
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-tech-text leading-relaxed">
            {PHP2SHELL_HELP.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 py-24 md:py-32 bg-tech-darker">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-tech-cyan text-glow text-center mb-12">
            聯絡我們
          </h2>
          <div className="bg-tech-dark border-glow rounded-lg p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FaEnvelope className="text-2xl text-tech-cyan mt-1 flex-shrink-0" />
                <div>
                  <p className="text-tech-text mb-1">
                    <span className="text-tech-cyan font-semibold">Email:</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${EMAIL}`}
                      className="text-tech-cyan hover:text-tech-purple transition-colors underline text-lg"
                    >
                      {EMAIL}
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-sm border border-tech-cyan/40 rounded-md text-tech-cyan hover:bg-tech-cyan/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan"
                      aria-label={emailCopied ? '已複製 Email' : '複製 Email'}
                    >
                      {emailCopied ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />}
                      <span>{emailCopied ? '已複製' : '複製'}</span>
                    </button>
                    <span className="sr-only" aria-live="polite">{emailCopied ? 'Email 已複製到剪貼簿' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <FaLine className="text-2xl text-tech-cyan mt-1 flex-shrink-0" />
                <div>
                  <p className="text-tech-text mb-1">
                    <span className="text-tech-cyan font-semibold">LINE:</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-tech-text text-lg">{`ID：${LINE_ID}`}</span>
                    <a
                      href={LINE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-sm border border-tech-cyan/40 rounded-md text-tech-cyan hover:bg-tech-cyan/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan"
                    >
                      加入好友
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-tech-cyan text-glow mb-6">
            參考資料
          </h2>
          <ul className="space-y-3">
            {PHP2SHELL_REFERENCES.map((ref) => (
              <li key={ref.href}>
                <a
                  href={ref.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-tech-cyan hover:text-tech-purple transition-colors underline"
                >
                  {ref.label}
                  <FaExternalLinkAlt className="text-xs" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-tech-text/70 leading-relaxed">
            {PHP2SHELL_DISCLAIMER}
          </p>
        </div>
      </section>

      <footer className="bg-tech-darker border-t border-tech-cyan/20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-tech-cyan font-heading font-bold text-lg mb-2">
            丰科有限公司 Fun Tech CO
          </p>
          <address className="not-italic">
            <div className="flex items-center justify-center gap-2 text-tech-text mb-2">
              <FaMapMarkerAlt className="text-tech-cyan flex-shrink-0" />
              <span>{ADDRESS_FULL}</span>
            </div>
            <p className="mb-2">
              <a
                href={`mailto:${EMAIL}`}
                className="text-tech-cyan hover:text-tech-purple transition-colors underline"
              >
                {EMAIL}
              </a>
            </p>
          </address>
          <p className="text-tech-text/70 text-sm">
            {`© ${COPYRIGHT_YEAR} 丰科有限公司`}
          </p>
        </div>
      </footer>
    </div>
  );
}
