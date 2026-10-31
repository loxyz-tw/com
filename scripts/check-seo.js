const fs = require('fs');
const path = require('path');

const BUILD = path.join(__dirname, '..', 'build');
const SITE = 'https://fun-tech.vip';
const HOME_TITLE = '丰科有限公司 Fun Tech CO｜App、網站與 AI 應用開發';
const SERVICE_TITLE = 'PHP2Shell 漏洞修復協助｜丰科有限公司';
const HOME_URL = `${SITE}/`;
const SERVICE_URL = `${SITE}/services/php2shell/`;

const PAGES = [
  {
    file: 'index.html',
    url: HOME_URL,
    title: HOME_TITLE,
    minRootLength: 5000,
    ogImage: `${SITE}/og-image.png`,
    kind: 'home',
  },
  {
    file: 'services/php2shell/index.html',
    url: SERVICE_URL,
    title: SERVICE_TITLE,
    minRootLength: 3000,
    ogImage: `${SITE}/og-php2shell.png`,
    kind: 'service',
  },
];

function fail(msg) {
  console.error('check-seo FAIL:', msg);
  process.exit(1);
}

function read(name) {
  const file = path.join(BUILD, name);
  if (!fs.existsSync(file)) fail(`missing ${name}`);
  return fs.readFileSync(file, 'utf8');
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function normalizeSpace(s) {
  return decodeEntities(s).replace(/\s+/g, ' ').trim();
}

function stripTags(html) {
  return normalizeSpace(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' '));
}

function metaContent(html, attr, name) {
  const re = new RegExp(
    `<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"[^>]*>|<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"[^>]*>`,
    'i'
  );
  const m = html.match(re);
  return m ? m[1] || m[2] : null;
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

function collectByType(nodes, type) {
  return nodes.filter((n) => {
    const t = n['@type'];
    if (Array.isArray(t)) return t.includes(type);
    return t === type;
  });
}

function walkRefs(node, refs) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item) => walkRefs(item, refs));
    return;
  }
  const keys = Object.keys(node);
  if (keys.length === 1 && keys[0] === '@id' && typeof node['@id'] === 'string') {
    refs.push(node['@id']);
  }
  keys.forEach((key) => {
    if (key === '@id') return;
    walkRefs(node[key], refs);
  });
}

function parseSitemap(xml) {
  const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)];
  return blocks.map((block) => {
    const locMatch = block[1].match(/<loc>\s*([^<]+?)\s*<\/loc>/);
    const lastmodMatch = block[1].match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/);
    return {
      loc: locMatch ? locMatch[1].trim() : null,
      lastmod: lastmodMatch ? lastmodMatch[1].trim() : null,
    };
  });
}

function parseGraph(html, file) {
  const ldBlocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
    ),
  ];
  if (ldBlocks.length < 1) fail(`${file} no JSON-LD blocks`);
  try {
    const parsedBlocks = ldBlocks.map((m) => JSON.parse(m[1]));
    const withGraph = parsedBlocks.find((b) => Array.isArray(b['@graph']));
    if (!withGraph) fail(`${file} no @graph in JSON-LD`);
    return withGraph['@graph'];
  } catch (err) {
    fail(`${file} JSON-LD parse error: ${err.message}`);
  }
}

function assertIds(graph, file) {
  const ids = graph.map((n) => n['@id']).filter(Boolean);
  const unique = new Set(ids);
  if (unique.size !== ids.length) fail(`${file} @graph @id values are not unique`);
  const refs = [];
  graph.forEach((node) => walkRefs(node, refs));
  refs.forEach((ref) => {
    if (!unique.has(ref)) fail(`${file} unresolved @id reference: ${ref}`);
  });
}

function checkPage(html, page, sitemapEntries) {
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) fail(`${page.file} <h1 count must be 1, got ${h1Count}`);

  if (html.includes('aos-init') || html.includes('aos-animate')) {
    fail(`${page.file} HTML still contains aos-init or aos-animate`);
  }

  const rootMatch = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/i);
  const rootHtml = rootMatch ? rootMatch[1] : '';
  if (rootHtml.length <= page.minRootLength) {
    fail(
      `${page.file} #root content length must be > ${page.minRootLength}, got ${rootHtml.length}`
    );
  }
  if (!rootHtml.includes('id="contact"')) fail(`${page.file} #root missing id="contact"`);
  if (page.kind === 'home' && !rootHtml.includes('id="faq"')) {
    fail(`${page.file} #root missing id="faq"`);
  }

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch) fail(`${page.file} missing <title>`);
  if (titleMatch[1].length > 60) {
    fail(`${page.file} title length ${titleMatch[1].length} > 60`);
  }
  if (titleMatch[1] !== page.title) {
    fail(`${page.file} title ${JSON.stringify(titleMatch[1])}`);
  }

  const description = metaContent(html, 'name', 'description');
  if (!description) fail(`${page.file} missing meta description`);
  if (description.length < 50 || description.length > 160) {
    fail(`${page.file} description length ${description.length} not in 50-160`);
  }

  const hrefs = canonicalHrefs(html);
  if (hrefs.length !== 1 || hrefs[0] !== page.url) {
    fail(`${page.file} canonical ${JSON.stringify(hrefs)}, expected ${page.url}`);
  }

  const ogImage = metaContent(html, 'property', 'og:image');
  if (ogImage !== page.ogImage) fail(`${page.file} og:image is ${ogImage}, expected ${page.ogImage}`);
  const twitterImage = metaContent(html, 'name', 'twitter:image');
  if (twitterImage !== page.ogImage) {
    fail(`${page.file} twitter:image is ${twitterImage}, expected ${page.ogImage}`);
  }
  const ogImageFile = path.join(BUILD, page.ogImage.slice(SITE.length + 1));
  if (!fs.existsSync(ogImageFile)) fail(`${page.file} og:image file missing in build: ${ogImageFile}`);
  const expectShare = [
    ['property', 'og:title', page.title],
    ['name', 'twitter:title', page.title],
    ['property', 'og:image:alt', page.title],
    ['name', 'twitter:image:alt', page.title],
    ['property', 'og:description', description],
    ['name', 'twitter:description', description],
  ];
  expectShare.forEach(([attr, key, expected]) => {
    const actual = metaContent(html, attr, key);
    if (actual !== expected) {
      fail(`${page.file} ${key} is ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  });
  const ogUrl = metaContent(html, 'property', 'og:url');
  if (ogUrl !== page.url) fail(`${page.file} og:url is ${ogUrl}, expected ${page.url}`);
  if (metaContent(html, 'name', 'twitter:card') !== 'summary_large_image') {
    fail(`${page.file} twitter:card must be summary_large_image`);
  }

  const graph = parseGraph(html, page.file);
  assertIds(graph, page.file);

  const webpages = collectByType(graph, 'WebPage');
  if (webpages.length < 1) fail(`${page.file} @graph missing WebPage`);
  const entry = sitemapEntries.find((item) => item.loc === page.url);
  if (!entry) fail(`${page.file} sitemap missing loc ${page.url}`);
  if (webpages[0].dateModified !== entry.lastmod) {
    fail(
      `${page.file} WebPage.dateModified (${webpages[0].dateModified}) !== sitemap lastmod (${entry.lastmod})`
    );
  }

  if (page.kind === 'home') {
    ['Organization', 'WebSite', 'FAQPage', 'ItemList'].forEach((type) => {
      if (collectByType(graph, type).length < 1) fail(`${page.file} @graph missing ${type}`);
    });

    const services = collectByType(graph, 'Service');
    if (services.length !== 4) {
      fail(`${page.file} Service count must be 4, got ${services.length}`);
    }

    const itemList = collectByType(graph, 'ItemList')[0];
    const listItems = (itemList.itemListElement || []).filter(
      (n) => n['@type'] === 'ListItem'
    );
    if (listItems.length !== 4) {
      fail(`${page.file} ListItem count must be 4, got ${listItems.length}`);
    }
    listItems.forEach((item, i) => {
      if (typeof item.position !== 'number') {
        fail(`${page.file} ListItem ${i} missing position`);
      }
    });

    const org = collectByType(graph, 'Organization')[0];
    const logoUrl = org.logo && typeof org.logo === 'object' ? org.logo.url : null;
    if (!logoUrl || !String(logoUrl).startsWith(`${SITE}/`)) {
      fail(`${page.file} Organization.logo.url must start with ${SITE}/`);
    }

    const faqPage = collectByType(graph, 'FAQPage')[0];
    const mainEntity = faqPage.mainEntity || [];
    const detailsCount = (html.match(/<details/g) || []).length;
    if (mainEntity.length !== detailsCount) {
      fail(
        `${page.file} FAQPage.mainEntity.length (${mainEntity.length}) !== <details count (${detailsCount})`
      );
    }

    const plainHtml = stripTags(html);
    mainEntity.forEach((q, i) => {
      const name = q && q.name;
      const answer =
        q && q.acceptedAnswer && q.acceptedAnswer.text
          ? q.acceptedAnswer.text
          : null;
      if (!name || !plainHtml.includes(normalizeSpace(name))) {
        fail(`${page.file} FAQ Question.name not found in HTML (index ${i}): ${name}`);
      }
      if (!answer || !plainHtml.includes(normalizeSpace(answer))) {
        fail(`${page.file} FAQ acceptedAnswer.text not found in HTML (index ${i})`);
      }
    });
  }

  if (page.kind === 'service') {
    if (collectByType(graph, 'Organization').length < 1) {
      fail(`${page.file} @graph missing Organization`);
    }
    const crumbs = collectByType(graph, 'BreadcrumbList');
    if (crumbs.length !== 1) {
      fail(`${page.file} BreadcrumbList count must be 1, got ${crumbs.length}`);
    }
    const crumbItems = (crumbs[0].itemListElement || []).filter(
      (n) => n['@type'] === 'ListItem'
    );
    if (crumbItems.length !== 2) {
      fail(`${page.file} BreadcrumbList ListItem count must be 2, got ${crumbItems.length}`);
    }
    const expectedCrumbs = [HOME_URL, page.url];
    crumbItems.forEach((crumb, i) => {
      if (crumb.position !== i + 1) {
        fail(`${page.file} BreadcrumbList item ${i} position is ${crumb.position}, expected ${i + 1}`);
      }
      if (typeof crumb.name !== 'string' || !crumb.name.trim()) {
        fail(`${page.file} BreadcrumbList item ${i} missing name`);
      }
      if (crumb.item !== expectedCrumbs[i]) {
        fail(`${page.file} BreadcrumbList item ${i} is ${crumb.item}, expected ${expectedCrumbs[i]}`);
      }
    });
    const services = collectByType(graph, 'Service');
    if (services.length !== 1) {
      fail(`${page.file} Service count must be 1, got ${services.length}`);
    }
  }
}

const robots = read('robots.txt');
const sitemap = read('sitemap.xml');
const cname = read('CNAME').trim();
const sitemapEntries = parseSitemap(sitemap);
const expectedLocs = [HOME_URL, SERVICE_URL];

if (sitemapEntries.length !== expectedLocs.length) {
  fail(`sitemap loc count must be ${expectedLocs.length}, got ${sitemapEntries.length}`);
}
expectedLocs.forEach((loc) => {
  if (!sitemapEntries.some((entry) => entry.loc === loc)) {
    fail(`sitemap missing loc ${loc}`);
  }
});
sitemapEntries.forEach((entry) => {
  if (!expectedLocs.includes(entry.loc)) fail(`sitemap unexpected loc ${entry.loc}`);
  if (!entry.lastmod || !/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod)) {
    fail(`lastmod format invalid: ${entry.lastmod}`);
  }
});

PAGES.forEach((page) => {
  checkPage(read(page.file), page, sitemapEntries);
});

if (!robots.includes('Sitemap: https://fun-tech.vip/sitemap.xml')) {
  fail('robots.txt missing Sitemap line');
}

if (cname !== 'fun-tech.vip') fail(`CNAME is "${cname}", expected fun-tech.vip`);

console.log('check-seo: all assertions passed');
