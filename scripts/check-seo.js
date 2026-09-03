const fs = require('fs');
const path = require('path');

const BUILD = path.join(__dirname, '..', 'build');
const SITE = 'https://fun-tech.vip';

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

const html = read('index.html');
const robots = read('robots.txt');
const sitemap = read('sitemap.xml');
const cname = read('CNAME').trim();

const h1Count = (html.match(/<h1/g) || []).length;
if (h1Count !== 1) fail(`<h1 count must be 1, got ${h1Count}`);

if (html.includes('aos-init') || html.includes('aos-animate')) {
  fail('HTML still contains aos-init or aos-animate');
}

const rootMatch = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/i);
const rootHtml = rootMatch ? rootMatch[1] : '';
if (rootHtml.length <= 5000) fail(`#root content length must be > 5000, got ${rootHtml.length}`);
if (!rootHtml.includes('id="contact"')) fail('#root missing id="contact"');
if (!rootHtml.includes('id="faq"')) fail('#root missing id="faq"');

const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
if (!titleMatch) fail('missing <title>');
if (titleMatch[1].length > 60) fail(`title length ${titleMatch[1].length} > 60`);

const description = metaContent(html, 'name', 'description');
if (!description) fail('missing meta description');
if (description.length < 50 || description.length > 160) {
  fail(`description length ${description.length} not in 50-160`);
}

const canonicalCount = (
  html.match(/rel="canonical" href="https:\/\/fun-tech\.vip\/"/g) || []
).length;
if (canonicalCount !== 1) fail(`canonical count must be 1, got ${canonicalCount}`);

const ogImage = metaContent(html, 'property', 'og:image');
if (ogImage !== `${SITE}/og-image.png`) fail(`og:image is ${ogImage}`);
for (const key of ['og:title', 'og:description', 'og:url']) {
  if (!metaContent(html, 'property', key)) fail(`missing ${key}`);
}
if (metaContent(html, 'name', 'twitter:card') !== 'summary_large_image') {
  fail('twitter:card must be summary_large_image');
}
if (!metaContent(html, 'name', 'twitter:image')) fail('missing twitter:image');

const ldBlocks = [
  ...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
  ),
];
if (ldBlocks.length < 1) fail('no JSON-LD blocks');

let graph;
try {
  const parsedBlocks = ldBlocks.map((m) => JSON.parse(m[1]));
  const withGraph = parsedBlocks.find((b) => Array.isArray(b['@graph']));
  if (!withGraph) fail('no @graph in JSON-LD');
  graph = withGraph['@graph'];
} catch (err) {
  fail(`JSON-LD parse error: ${err.message}`);
}

const types = ['Organization', 'WebSite', 'WebPage', 'FAQPage', 'ItemList'];
types.forEach((type) => {
  if (collectByType(graph, type).length < 1) fail(`@graph missing ${type}`);
});

const services = collectByType(graph, 'Service');
if (services.length !== 4) fail(`Service count must be 4, got ${services.length}`);

const itemList = collectByType(graph, 'ItemList')[0];
const listItems = (itemList.itemListElement || []).filter(
  (n) => n['@type'] === 'ListItem'
);
if (listItems.length !== 4) fail(`ListItem count must be 4, got ${listItems.length}`);
listItems.forEach((item, i) => {
  if (typeof item.position !== 'number') fail(`ListItem ${i} missing position`);
});

const org = collectByType(graph, 'Organization')[0];
const logoUrl =
  org.logo && typeof org.logo === 'object' ? org.logo.url : null;
if (!logoUrl || !String(logoUrl).startsWith(`${SITE}/`)) {
  fail(`Organization.logo.url must start with ${SITE}/`);
}

const faqPage = collectByType(graph, 'FAQPage')[0];
const mainEntity = faqPage.mainEntity || [];
const detailsCount = (html.match(/<details/g) || []).length;
if (mainEntity.length !== detailsCount) {
  fail(
    `FAQPage.mainEntity.length (${mainEntity.length}) !== <details count (${detailsCount})`
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
    fail(`FAQ Question.name not found in HTML (index ${i}): ${name}`);
  }
  if (!answer || !plainHtml.includes(normalizeSpace(answer))) {
    fail(`FAQ acceptedAnswer.text not found in HTML (index ${i})`);
  }
});

const ids = graph.map((n) => n['@id']).filter(Boolean);
const unique = new Set(ids);
if (unique.size !== ids.length) fail('@graph @id values are not unique');

const refs = [];
graph.forEach((node) => walkRefs(node, refs));
refs.forEach((ref) => {
  if (!unique.has(ref)) fail(`unresolved @id reference: ${ref}`);
});

const webpage = collectByType(graph, 'WebPage')[0];
const lastmodMatch = sitemap.match(/<lastmod>([^<]+)<\/lastmod>/);
if (!lastmodMatch) fail('sitemap missing lastmod');
const lastmod = lastmodMatch[1];
if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) fail(`lastmod format invalid: ${lastmod}`);
if (webpage.dateModified !== lastmod) {
  fail(
    `WebPage.dateModified (${webpage.dateModified}) !== sitemap lastmod (${lastmod})`
  );
}

if (!robots.includes('Sitemap: https://fun-tech.vip/sitemap.xml')) {
  fail('robots.txt missing Sitemap line');
}

if (cname !== 'fun-tech.vip') fail(`CNAME is "${cname}", expected fun-tech.vip`);

console.log('check-seo: all assertions passed');
