/** Browser regression checks for the bilingual academic portfolio. */
import assert from 'node:assert/strict';
import { existsSync, mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
const executablePath = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(existsSync);
assert(executablePath);
const base = process.argv[2] || 'http://localhost:4321';
const widths = process.argv[3] ? [Number(process.argv[3])] : [1440, 768, 375, 320];
const out = '.shots/academic';
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: true, pipe: true });
const errors = [];
try {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  page.on('pageerror', error => errors.push(error.message));
  await page.setRequestInterception(true);
  page.on('request', request => request.url().includes('/_visit') ? request.respond({ status: 204 }) : request.continue());
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const width of widths) {
    await page.setViewport({ width, height: 1000 });
    for (const lang of ['en', 'zh']) for (const theme of ['dark', 'light']) {
      await page.evaluateOnNewDocument(value => localStorage.setItem('theme', value), theme);
      const path = lang === 'en' ? '/academic/' : '/academic/zh/';
      assert.equal((await page.goto(base + path, { waitUntil: 'networkidle0' })).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.$$eval('h1', els => els.length), 1);
      const ids = await page.$$eval('[id]', els => els.map(el => el.id));
      assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs');
      const body = await page.$eval('main', el => el.innerText);
      assert(!/AAAI|CCF-A|JCR Q1|Sole student author/.test(body));
      assert.equal(await page.$$eval('a[href^="/letters/"]', els => els.length), 0);
      assert.equal(await page.$$eval('main select, main [role="tablist"]', els => els.length), 0);
      assert.equal(await page.$$eval('.research-highlight', els => els.filter(el => el.checkVisibility()).length), 3);
      assert.equal(await page.$$eval('.background-details[open]', els => els.length), 0);
      assert(await page.$eval('#project-test-time-scaling', el => el.innerText.includes('+2.11') && el.innerText.includes('72.23')));
      assert(await page.$eval('#project-test-time-scaling', el => el.innerText.includes('Query-Axis Scaling') && /sharing scope/i.test(el.innerText)));
      assert.equal(await page.$$eval('.query-answers > span', els => els.length), 3);
      assert(await page.$eval('.shared-encoding', el => /Encode once|编码一次/.test(el.innerText)));
      assert(await page.$eval('#project-frame-sufficiency', el => el.innerText.includes('18.0') && el.innerText.includes('LLaVA')));
      assert(await page.$eval('#publications', el => /Second author|第二作者/.test(el.innerText)));
      assert(await page.$('a[href="https://github.com/maple1999/frame-sufficiency-video-vlms"]'));
      if (lang === 'en') assert((await page.$eval('#interests', el => el.innerText)).split(/\s+/).length < 250);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow: ${lang} ${width} ${theme}`);
      assert.equal(await page.$eval('.intro-copy', el => parseFloat(getComputedStyle(el).fontSize) >= 16), true);
      if ([1440, 375].includes(width)) {
        await page.screenshot({ path: `${out}/${lang}-${width}-${theme}-top.png` });
        await page.$eval('#highlights', el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
        await page.screenshot({ path: `${out}/${lang}-${width}-${theme}-highlights.png` });
        await page.$eval('#project-period-adaptive', el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
        await page.screenshot({ path: `${out}/${lang}-${width}-${theme}-temporal.png` });
      }
      await page.$eval('#project-period-adaptive summary', el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await page.focus('#project-period-adaptive summary');
      await page.keyboard.press('Enter');
      assert(await page.$eval('#project-period-adaptive details', el => el.open));
      await page.waitForFunction(() => [...document.querySelectorAll('#project-period-adaptive img')].every(img => img.complete && img.naturalWidth > 0));
      await page.$eval('.paper-toc [data-nav="interests"]', el => el.click());
      await page.waitForFunction(() => document.querySelector('[data-nav="interests"]').getAttribute('aria-current') === 'true');
      const navigation = await page.evaluate(() => {
        const sidebar = document.querySelector('.academic-sidebar').getBoundingClientRect();
        const link = document.querySelector('[data-nav="interests"]');
        const box = link.getBoundingClientRect();
        const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        return { top: sidebar.top, bottom: sidebar.bottom, clickable: hit === link || link.contains(hit) };
      });
      assert(Math.abs(navigation.top - (width > 1100 ? 105 : 64)) < 2, 'Section navigation must remain sticky after scrolling');
      assert(navigation.bottom <= 1000 && navigation.clickable, 'Current section link must remain visible and clickable');
      if ([1440, 375].includes(width)) await page.screenshot({ path: `${out}/${lang}-${width}-${theme}-sticky.png` });
      await page.click('#lang-toggle');
      await page.waitForFunction(expected => document.documentElement.lang === expected && location.hash === '#interests', {}, lang === 'en' ? 'zh-CN' : 'en');
      console.log(`PASS ${lang} ${width} ${theme}`);
    }
  }
  await page.goto(base + '/academic/#engineering', { waitUntil: 'networkidle0' });
  assert(await page.$eval('#engineering', el => el.closest('details').open), 'Legacy deep link should open background');
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  assert(await page.$$eval('main details', els => els.every(el => el.open)));
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  await page.setJavaScriptEnabled(false);
  await page.goto(base + '/academic/', { waitUntil: 'networkidle0' });
  assert.equal(await page.$$eval('.research-highlight', els => els.filter(el => el.checkVisibility()).length), 3);
  const resources = await page.$$eval('main a[href], main img[src]', els => els.map(el => el.getAttribute('href') || el.getAttribute('src')).filter(url => url.startsWith('/') && !url.startsWith('//')));
  for (const path of new Set(resources)) assert.equal(await page.evaluate(async url => (await fetch(url, { method: 'HEAD' })).status, base + path), 200, path);
  for (const name of ['Recommendation_Jun_Li.pdf', 'Recommendation_Qiming_Li.pdf']) assert.equal(await page.evaluate(async url => (await fetch(url, { method: 'HEAD' })).status, base + '/letters/' + name), 404);
  assert.deepEqual(errors, []);
  console.log('PASS no-JS, keyboard, deep links, print, images/CV links, retired letters, browser errors');
} finally { await browser.close(); }
