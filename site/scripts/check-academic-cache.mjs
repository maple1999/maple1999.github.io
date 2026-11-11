/** Verify public HTML matches this build across URL variants and request headers. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://www.mapletech.top';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const expected = {
  en: hash(readFileSync(resolve(root, 'dist/academic/index.html'))),
  zh: hash(readFileSync(resolve(root, 'dist/academic/zh/index.html'))),
};
const cases = [
  ['/academic/', 'en'], ['/academic', 'en'], ['/academic/index.html', 'en'],
  ['/academic/?utm_source=chatgpt.com', 'en'], ['/academic/?v=20261110-141851', 'en'],
  ['/academic/zh/', 'zh'], ['/academic/zh/index.html', 'zh'],
  ['/academic/', 'en', { 'User-Agent': 'Googlebot/2.1' }],
  ['/academic/?utm_source=chatgpt.com', 'en', { 'User-Agent': 'ChatGPT-User/1.0' }],
  ['/academic/', 'en', { 'If-None-Match': '"6af327d2-1012b"' }],
];
const report = [];
for (const [path, lang, headers] of cases) {
  const response = await fetch(origin + path, {
    headers: { 'User-Agent': 'mapletech-cache-audit', ...headers },
    redirect: 'follow', signal: AbortSignal.timeout(20000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  const html = bytes.toString('utf8');
  const result = {
    path, requestHeaders: headers || {}, status: response.status,
    sha256: hash(bytes), matchesBuild: hash(bytes) === expected[lang],
    oldContent: /AAAI|data-nav="(?:methodology|experiments)"/.test(html),
    queryAxis: html.includes('Query-Axis Scaling'),
    cache: Object.fromEntries(['cache-control', 'etag', 'last-modified', 'age', 'via', 'x-cache'].filter(key => response.headers.has(key)).map(key => [key, response.headers.get(key)])),
  };
  report.push(result);
  console.log(`${result.status} ${path} matchesBuild=${result.matchesBuild} oldContent=${result.oldContent} cache=${result.cache['cache-control']}`);
}
mkdirSync(resolve(root, '.shots'), { recursive: true });
writeFileSync(resolve(root, '.shots/academic-cache-audit.json'), JSON.stringify({ checkedAt: new Date().toISOString(), expected, report }, null, 2));
for (const row of report) {
  assert.equal(row.status, 200, row.path);
  assert(row.matchesBuild && row.queryAxis && !row.oldContent, `Unexpected HTML: ${row.path}`);
  assert(row.cache['cache-control']?.includes('no-cache'), `Missing revalidation: ${row.path}`);
}
console.log('PASS public HTML, URL variants, crawler headers, retired ETag, and cache policy');
