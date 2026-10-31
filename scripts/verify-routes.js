const fs = require('fs');
const path = require('path');
const { createStaticServer } = require('./static-server');

const BUILD = path.join(__dirname, '..', 'build');
const HOME_TITLE = '丰科有限公司 Fun Tech CO｜App、網站與 AI 應用開發';
const SERVICE_TITLE = 'PHP2Shell 漏洞修復協助｜丰科有限公司';
const HOME_CANONICAL = 'https://fun-tech.vip/';
const SERVICE_CANONICAL = 'https://fun-tech.vip/services/php2shell/';

const FILES = [
  {
    file: 'index.html',
    title: HOME_TITLE,
    canonical: HOME_CANONICAL,
  },
  {
    file: 'services/php2shell/index.html',
    title: SERVICE_TITLE,
    canonical: SERVICE_CANONICAL,
  },
];

const SERVED_PATHS = [
  '/services/php2shell/',
  '/services/php2shell',
  '/services/php2shell/index.html',
];

function fail(msg) {
  console.error('verify-routes FAIL:', msg);
  process.exitCode = 1;
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

function checkFile(spec) {
  const filePath = path.join(BUILD, spec.file);
  if (!fs.existsSync(filePath)) {
    fail(`missing ${spec.file}`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) {
    fail(`${spec.file} h1 count ${h1Count}, expected 1`);
  }
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : null;
  if (title !== spec.title) {
    fail(`${spec.file} title ${JSON.stringify(title)}, expected ${JSON.stringify(spec.title)}`);
  }
  const hrefs = canonicalHrefs(html);
  if (hrefs.length !== 1 || hrefs[0] !== spec.canonical) {
    fail(
      `${spec.file} canonical ${JSON.stringify(hrefs)}, expected ${JSON.stringify([spec.canonical])}`
    );
  }
}

async function checkServed(port, urlPath) {
  const url = `http://127.0.0.1:${port}${urlPath}`;
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  } catch (err) {
    fail(`${urlPath} fetch failed: ${err && err.message ? err.message : err}`);
    return;
  }
  if (res.status !== 200) {
    fail(`${urlPath} status ${res.status}`);
    await res.text().catch(() => {});
    return;
  }
  let body;
  try {
    body = await res.text();
  } catch (err) {
    fail(`${urlPath} read failed: ${err && err.message ? err.message : err}`);
    return;
  }
  const needle = `<title>${SERVICE_TITLE}</title>`;
  if (!body.includes(needle)) {
    const titleMatch = body.match(/<title>([^<]*)<\/title>/i);
    fail(
      `${urlPath} title ${titleMatch ? JSON.stringify(titleMatch[1]) : 'missing'}`
    );
  }
}

async function main() {
  FILES.forEach(checkFile);

  const server = await createStaticServer(BUILD, 0, '127.0.0.1');
  try {
    for (const urlPath of SERVED_PATHS) {
      await checkServed(server.port, urlPath);
    }
  } finally {
    await server.close();
  }

  if (process.exitCode) {
    console.error('verify-routes: failed');
  } else {
    console.log('verify-routes: all checks passed');
  }
}

main().catch((err) => {
  console.error(err && err.message ? err.message : err);
  process.exitCode = 1;
});
