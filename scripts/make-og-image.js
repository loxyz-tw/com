const path = require('path');
const puppeteer = require('puppeteer-core');
const { createStaticServer } = require('./static-server');

const CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// 名稱 → 模板與輸出；`npm run og-image` 產生全部，`npm run og-image -- php2shell` 只產生指定的
const TARGETS = {
  home: { template: 'og-template.html', out: 'og-image.png' },
  php2shell: { template: 'og-php2shell-template.html', out: 'og-php2shell.png' },
};

async function main() {
  let serverHandle;
  let browser;
  try {
    const names = process.argv.slice(2);
    const unknown = names.filter((name) => !TARGETS[name]);
    if (unknown.length > 0) {
      throw new Error(`unknown OG target: ${unknown.join(', ')} (known: ${Object.keys(TARGETS).join(', ')})`);
    }
    const selected = names.length > 0 ? names : Object.keys(TARGETS);

    serverHandle = await createStaticServer(__dirname, 0, '127.0.0.1');

    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

    for (const name of selected) {
      const { template, out } = TARGETS[name];
      const url = `http://127.0.0.1:${serverHandle.port}/${template}`;
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
          `OG fonts not loaded (${template}): Noto Sans TC=${fontsOk.noto} Orbitron=${fontsOk.orbitron}`
        );
      }

      const outPath = path.join(PUBLIC_DIR, out);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log('wrote', outPath);
    }
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
