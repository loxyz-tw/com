const path = require('path');
const puppeteer = require('puppeteer-core');
const { createStaticServer } = require('./static-server');

const CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome';
const OUT_PATH = path.join(__dirname, '..', 'public', 'og-image.png');

async function main() {
  let serverHandle;
  let browser;
  try {
    serverHandle = await createStaticServer(__dirname, 0, '127.0.0.1');
    const url = `http://127.0.0.1:${serverHandle.port}/og-template.html`;

    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    const fontsOk = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        noto: document.fonts.check('700 40px "Noto Sans TC"'),
        orbitron: document.fonts.check('700 40px "Orbitron"'),
      };
    });

    if (!fontsOk.noto || !fontsOk.orbitron) {
      throw new Error(
        `OG fonts not loaded: Noto Sans TC=${fontsOk.noto} Orbitron=${fontsOk.orbitron}`
      );
    }

    await page.screenshot({ path: OUT_PATH, type: 'png' });
    console.log('wrote', OUT_PATH);
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
