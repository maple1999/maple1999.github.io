import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
const executablePath = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(existsSync);
console.log('启动浏览器');
const browser = await puppeteer.launch({ executablePath, headless: true, pipe: true });
console.log('浏览器启动成功');
const page = await browser.newPage();
const events = [], errors = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
await page.setRequestInterception(true);
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => {
  const url = new URL(request.url());
  if (url.pathname === '/_visit') {
    events.push(Object.fromEntries(url.searchParams));
    return request.respond({ status: 204 });
  }
  return request.continue();
});
try {
  await page.goto('http://127.0.0.1:4323/', { waitUntil: 'networkidle0' });
  console.log('首页上报', events.length);
  const sid = events[0].sid;
  assert(events.some(e => e.p === '/' && e.e === 'start'));
  await pause(1200);
  await page.goto('http://127.0.0.1:4323/academic/?private=excluded', { waitUntil: 'networkidle0' });
  assert(events.some(e => e.p === '/academic/' && e.sid === sid));
  assert(events.some(e => e.p === '/' && Number(e.t) >= 1));
  assert(events.every(e => !e.p.includes('private')));
  await page.goto('http://127.0.0.1:4323/career/?role=product', { waitUntil: 'networkidle0' });
  console.log('跨页会话通过');
  await page.click('#tab-vision');
  await pause(1200);
  assert(events.some(e => e.p === '/career/?role=vision' && e.e === 'start'));
  await page.evaluate(() => document.addEventListener('click', e => { if (e.target.closest('a[download]')) e.preventDefault(); }));
  await page.click('#panel-vision a[download]');
  await pause(500);
  assert(events.some(e => e.e === 'download' && e.f === '/cv/Shizhao_Gao_Vision_Engineer_ZH.pdf'));
  const other = await browser.newPage();
  await other.bringToFront();
  await pause(2200);
  const hiddenEvent = events.filter(e => e.e === 'pause').at(-1);
  assert(hiddenEvent, '后台切换未上报');
  await page.bringToFront();
  await pause(500);
  const resumed = events.filter(e => e.e === 'resume').at(-1);
  assert(resumed, '回到前台未上报');
  assert(Number(resumed.t) - Number(hiddenEvent.t) <= 1, '后台时间计入停留');
  await other.close();
  await page.evaluate(() => {
    const old = JSON.parse(sessionStorage.getItem('mapletech-visit-v2'));
    old.last = Date.now() - 301000;
    sessionStorage.setItem('mapletech-visit-v2', JSON.stringify(old));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  assert.notEqual(events.at(-1).sid, sid);
  assert.deepEqual(errors, []);
  console.log('访问统计浏览器检查通过：跨页会话、可见计时、后台暂停、岗位切换、附件点击、敏感参数剔除与会话过期。');
} finally { await browser.close(); }
