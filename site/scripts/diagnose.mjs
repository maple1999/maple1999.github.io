import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4323';
const exe = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);

const browser = await puppeteer.launch({ executablePath: exe, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => logs.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));

await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 800));

const before = await page.evaluate(() => ({
  scripts: document.querySelectorAll('script').length,
  reveal: document.querySelectorAll('.reveal').length,
  visible: document.querySelectorAll('.reveal.is-visible').length,
  ioSupported: 'IntersectionObserver' in window,
}));

await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 500));
});

const after = await page.evaluate(() => {
  const el = document.querySelector('.research-card');
  const cs = el ? getComputedStyle(el) : null;
  return {
    visible: document.querySelectorAll('.reveal.is-visible').length,
    sampleOpacity: cs?.opacity,
    sampleTransform: cs?.transform,
  };
});

console.log('BEFORE', before);
console.log('AFTER ', after);
console.log('--- console output ---');
console.log(logs.length ? logs.join('\n') : '(none)');

await browser.close();
