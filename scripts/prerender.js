const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { createStaticServer } = require('./static-server');

const SITE_ORIGIN = 'https://fun-tech.vip';
const BUILD = path.join(__dirname, '..', 'build');
const BUILD_INDEX = path.join(BUILD, 'index.html');
const CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome';

// title / canonical 手寫，不 import src/data。check-seo.js 另以 HTML 交叉驗證。
const HOME_TITLE = '丰科有限公司 Fun Tech CO｜App、網站與 AI 應用開發';
const HOME_CANONICAL = 'https://fun-tech.vip/';
const SERVICE_TITLE = 'PHP2Shell 漏洞修復協助｜丰科有限公司';
const SERVICE_CANONICAL = 'https://fun-tech.vip/services/php2shell/';

const ROUTES = [
  {
    path: '/',
    outFile: BUILD_INDEX,
    waitSelector: '#root section#contact',
    expectTitle: HOME_TITLE,
    expectCanonical: HOME_CANONICAL,
    minRootLength: 5000,
    requireFaq: true,
    hydratePaths: ['/'],
  },
  {
    path: '/services/php2shell/',
    outFile: path.join(BUILD, 'services', 'php2shell', 'index.html'),
    waitSelector: '#root section#contact',
    expectTitle: SERVICE_TITLE,
    expectCanonical: SERVICE_CANONICAL,
    minRootLength: 3000,
    requireFaq: false,
    hydratePaths: [
      '/services/php2shell/',
      '/services/php2shell',
      '/services/php2shell/index.html',
    ],
  },
];

function rewriteToLocal(url, port) {
  if (url.startsWith(SITE_ORIGIN + '/') || url === SITE_ORIGIN) {
    return url.replace(SITE_ORIGIN, `http://127.0.0.1:${port}`);
  }
  return url;
}

async function attachLocalRewrite(page, port) {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const rewritten = rewriteToLocal(req.url(), port);
    if (rewritten !== req.url()) {
      req.continue({ url: rewritten }).catch(() => {
        req.abort().catch(() => {});
      });
    } else {
      req.continue().catch(() => {});
    }
  });
}

function attachFirstPassListeners(page, errors) {
  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err && err.message ? err.message : err}`);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`console.error: ${msg.text()}`);
    }
  });
}

function attachHydrationListeners(page, errors) {
  page.on('pageerror', (err) => {
    const text = err && err.message ? err.message : String(err);
    errors.push(`hydration pageerror: ${text}`);
  });
  page.on('console', (msg) => {
    const type = msg.type();
    if (type !== 'error' && type !== 'warning') return;
    const text = msg.text();
    if (/hydrat|did not match|Minified React error/i.test(text)) {
      errors.push(`hydration console.${type}: ${text}`);
    }
  });
}

function canonicalHrefs(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  const hrefs = [];
  tags.forEach((tag) => {
    if (!/\brel="canonical"/.test(tag)) return;
    const href = tag.match(/\bhref="([^"]*)"/);
    hrefs.push(href ? href[1] : '');
  });
  return hrefs;
}

function selfCheck(html, route) {
  if (html.includes('aos-init') || html.includes('aos-animate')) {
    throw new Error('prerender HTML still contains aos-init or aos-animate');
  }
  if (!html.includes('section id="contact"') && !html.includes("section id='contact'")) {
    throw new Error('prerender HTML missing section id="contact"');
  }
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) {
    throw new Error(`prerender HTML must contain exactly one <h1, found ${h1Count}`);
  }
  const rootMatch = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/i);
  const rootHtml = rootMatch ? rootMatch[1] : '';
  if (rootHtml.length <= route.minRootLength) {
    throw new Error(
      `#root content length must be > ${route.minRootLength}, got ${rootHtml.length}`
    );
  }
  if (route.requireFaq && !rootHtml.includes('id="faq"')) {
    throw new Error('prerender HTML missing id="faq"');
  }
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '';
  if (title !== route.expectTitle) {
    throw new Error(`prerender title ${JSON.stringify(title)}`);
  }
  const hrefs = canonicalHrefs(html);
  if (hrefs.length !== 1 || hrefs[0] !== route.expectCanonical) {
    throw new Error(`prerender canonical ${JSON.stringify(hrefs)}`);
  }
}

async function captureHtml(page) {
  return page.evaluate(() => {
    document.querySelectorAll('.aos-init, .aos-animate').forEach((el) => {
      el.classList.remove('aos-init', 'aos-animate');
    });
    const body = document.body;
    body.removeAttribute('data-aos-easing');
    body.removeAttribute('data-aos-duration');
    body.removeAttribute('data-aos-delay');
    return '<!doctype html>' + document.documentElement.outerHTML;
  });
}

async function renderRoute(browser, port, route, templateHtml) {
  if (route.outFile !== BUILD_INDEX) {
    fs.mkdirSync(path.dirname(route.outFile), { recursive: true });
    fs.writeFileSync(route.outFile, templateHtml);
  }

  const page = await browser.newPage();
  const errors = [];
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await attachLocalRewrite(page, port);
    attachFirstPassListeners(page, errors);
    await page.goto(`http://127.0.0.1:${port}${route.path}`, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    await page.waitForSelector(route.waitSelector, { timeout: 30000 });
    try {
      await page.waitForFunction(
        (title, canonical) => {
          const link = document.querySelector('link[rel="canonical"]');
          return document.title === title && !!link && link.href === canonical;
        },
        { timeout: 30000 },
        route.expectTitle,
        route.expectCanonical
      );
    } catch (err) {
      const state = await page.evaluate(() => {
        const link = document.querySelector('link[rel="canonical"]');
        return {
          title: document.title,
          canonical: link ? link.href : null,
        };
      });
      throw new Error(
        `prerender head not ready for ${route.path}: ${JSON.stringify(state)}; ${err.message}`
      );
    }

    const html = await captureHtml(page);
    selfCheck(html, route);
    fs.writeFileSync(route.outFile, html);

    if (errors.length > 0) {
      throw new Error(
        `prerender first pass errors at ${route.path}:\n${errors.join('\n')}`
      );
    }
  } finally {
    await page.close().catch(() => {});
  }
}

async function verifyHydration(browser, port, urlPath) {
  const page = await browser.newPage();
  const errors = [];
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await attachLocalRewrite(page, port);
    attachHydrationListeners(page, errors);
    await page.goto(`http://127.0.0.1:${port}${urlPath}`, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (errors.length > 0) {
      throw new Error(
        `prerender hydration errors at ${urlPath}:\n${errors.join('\n')}`
      );
    }
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  let serverHandle;
  let browser;

  try {
    if (!fs.existsSync(BUILD_INDEX)) {
      throw new Error('missing build/index.html');
    }
    const templateHtml = fs.readFileSync(BUILD_INDEX, 'utf8');

    serverHandle = await createStaticServer(BUILD, 0, '127.0.0.1');
    const { port } = serverHandle;

    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox'],
    });

    for (const route of ROUTES) {
      await renderRoute(browser, port, route, templateHtml);
    }

    for (const route of ROUTES) {
      for (const hydratePath of route.hydratePaths) {
        await verifyHydration(browser, port, hydratePath);
      }
    }

    console.log(
      'prerender: wrote build/index.html and build/services/php2shell/index.html and verified hydration'
    );
  } catch (err) {
    console.error(err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    if (serverHandle) {
      await serverHandle.close().catch(() => {});
    }
    if (process.exitCode === 1) {
      process.exit(1);
    }
  }
}

main();
