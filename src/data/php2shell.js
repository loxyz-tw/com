import { NAME_ZH, SITE_URL } from './site';

export const PHP2SHELL_PATH = '/services/php2shell/';
export const PHP2SHELL_URL = `${SITE_URL}${PHP2SHELL_PATH}`;
export const PHP2SHELL_OG_IMAGE = `${SITE_URL}/og-php2shell.png`;
export const PHP2SHELL_H1 = 'PHP2Shell 漏洞修復協助';
export const PHP2SHELL_TITLE = `${PHP2SHELL_H1}｜${NAME_ZH}`;
export const PHP2SHELL_DESCRIPTION =
  'PHP2Shell（CVE-2026-109618、CVE-2026-109619）是 PHP 核心引擎的重大漏洞，已遭實際攻擊。丰科協助檢測主機 PHP 版本、更新至已修補版本、輪替可能外洩的金鑰，並檢查入侵跡象。';

export const PHP2SHELL_SUMMARY =
  'PHP2Shell（CVE-2026-109618、CVE-2026-109619）是 PHP 核心引擎的重大漏洞，CVSS v4.0 評分 9.2，攻擊者無需登入即可能在伺服器上執行程式碼，且已被列入美國 CISA 已知遭利用漏洞清單。WordPress、Drupal、Joomla 等以 PHP 架設的網站都可能受影響，唯一完整的解法是更新到已修補的 PHP。';

export const PHP2SHELL_IMPACT =
  'PHP 官方指出所有處理網頁請求的 PHP 安裝都有風險，包括 PHP-FPM、Apache mod_php、php-cgi、FrankenPHP、LiteSpeed，其中 mod_php 風險最高；漏洞在 PHP 核心，網站程式本身寫得再安全也無法單靠程式碼防護。';

export const PHP2SHELL_REMEDIATION = [
  '升級至 2026 年 10 月 21 日釋出的官方修補版：8.5.12、8.4.27、8.3.36、8.2.35；或安裝作業系統／主機商已修補的套件（發行版回補時 php -v 顯示的版本號可能不變，要看套件版本）。',
  '8.1 以前：PHP 官方不再釋出更新；部分發行版／LTS 廠商提供回補，官方也為 7.4 / 8.0 / 8.1 提供最小原始碼回補，但仍建議規劃升級到受支援版本。',
  '暫時性緩解措施只能降低部分攻擊路徑，不能取代更新。',
];

export const PHP2SHELL_STEPS = [
  '盤點所有對外主機的 PHP 版本、套件來源與執行方式',
  '優先更新對外網站',
  '舊版 PHP 確認廠商回補或規劃遷移',
  '修補前記憶體可能已被讀取，輪替伺服器上的金鑰、Token、API Key',
  '檢查入侵跡象（異常檔案、帳號、排程）',
];

export const PHP2SHELL_HELP = [
  '主機 PHP 版本與執行環境曝險檢測',
  '升級至修補版本或套用主機商修補，舊版 PHP 規劃遷移',
  '輪替可能外洩的金鑰、Token 與 API Key',
  '修補後驗證與入侵跡象檢查',
];

export const PHP2SHELL_REFERENCES = [
  {
    label: 'PHP 官方安全公告',
    href: 'https://www.php.net/archive/2026.php#2026-10-21-5',
  },
  {
    label: 'PHP 8.4.27 release',
    href: 'https://github.com/php/php-src/releases/tag/php-8.4.27',
  },
  {
    label: '加拿大網路安全中心 AL26-026',
    href: 'https://cyber.gc.ca/en/alerts-advisories/al26-026-critical-vulnerabilities-impacting-php-cve-2026-109618-cve-2026-109619',
  },
  {
    label: 'Varonis',
    href: 'https://www.varonis.com/blog/php2shell',
  },
];

export const PHP2SHELL_DISCLAIMER =
  '本頁資訊整理自 PHP 官方公告與公開報導，請以官方公告為準。';
