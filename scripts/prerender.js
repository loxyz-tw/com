const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { createStaticServer } = require('./static-server');

const SITE_ORIGIN = 'https://fun-tech.vip';
const BUILD_INDEX = path.join(__dirname, '..', 'build', 'index.html');
const CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome';

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

function selfCheck(html) {
  if (html.includes('aos-init') || html.includes('aos-animate')) {
    throw new Error('prerender HTML still contains aos-init or aos-animate');
  }
  if (!html.includes('section id="contact"') && !html.includes("section id='contact'")) {
    throw new Error('prerender HTML missing section id="contact"');
  }
  const h1Count = (html.match(/<h1/g) || []).length;
  if (h1Count !== 1) {
    throw new Error(`prerender HTML must contain exactly one <h1, found ${h1Count}`);
  }
  const rootMatch = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/i);
  const rootHtml = rootMatch ? rootMatch[1] : '';
  if (rootHtml.length <= 5000) {
    throw new Error(`#root content length must be > 5000, got ${rootHtml.length}`);
  }
}

async function main() {
  let serverHandle;
  let browser;
  const firstPassErrors = [];
  const hydrationErrors = [];

  try {
    serverHandle = await createStaticServer(
      path.join(__dirname, '..', 'build'),
      0,
      '127.0.0.1'
    );
    const { port } = serverHandle;
    const url = `http://127.0.0.1:${port}/`;

    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await attachLocalRewrite(page, port);
    attachFirstPassListeners(page, firstPassErrors);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector('#root section#contact', { timeout: 30000 });

    const html = await page.evaluate(() => {
      document.querySelectorAll('.aos-init, .aos-animate').forEach((el) => {
        el.classList.remove('aos-init', 'aos-animate');
      });
      const body = document.body;
      body.removeAttribute('data-aos-easing');
      body.removeAttribute('data-aos-duration');
      body.removeAttribute('data-aos-delay');
      return '<!doctype html>' + document.documentElement.outerHTML;
    });

    selfCheck(html);
    fs.writeFileSync(BUILD_INDEX, html);

    if (firstPassErrors.length > 0) {
      throw new Error(
        `prerender first pass errors:\n${firstPassErrors.join('\n')}`
      );
    }

    const hydratePage = await browser.newPage();
    await hydratePage.setViewport({ width: 1280, height: 800 });
    await attachLocalRewrite(hydratePage, port);
    attachHydrationListeners(hydratePage, hydrationErrors);

    await hydratePage.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (hydrationErrors.length > 0) {
      throw new Error(
        `prerender hydration errors:\n${hydrationErrors.join('\n')}`
      );
    }

    console.log('prerender: wrote build/index.html and verified hydration');
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
