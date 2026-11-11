import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';

const executablePath = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(existsSync);
assert(executablePath, '缺少可用于检查的浏览器');
console.log('启动独立无头浏览器');
const browser = await puppeteer.launch({ executablePath, headless: true, pipe: true });
console.log('浏览器已启动');
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const base = process.argv[2] || 'http://127.0.0.1:4323';
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const noOverflow = async (label) => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label} 横向溢出`);
const theme = () => page.evaluate(() => document.documentElement.dataset.theme);
const state = () => page.evaluate(() => ({
  active: document.documentElement.dataset.role,
  visible: [...document.querySelectorAll('[data-role-panel]')].filter((panel) => getComputedStyle(panel).display !== 'none').map((panel) => panel.dataset.rolePanel),
  tabs: [...document.querySelectorAll('[role=tab]')].filter((tab) => tab.getAttribute('aria-selected') === 'true').map((tab) => tab.dataset.roleTab),
  resume: document.querySelector('[data-resume]').getAttribute('href'),
  navHref: document.querySelector('.nav-link[data-section="projects"]').getAttribute('href'),
  compact: document.querySelector('#career-switch').dataset.compact,
  overflow: document.documentElement.scrollWidth > innerWidth,
}));
const checkRole = async (role) => {
  const current = await state();
  assert.equal(current.active, role);
  assert.deepEqual(current.visible, [role]);
  assert.deepEqual(current.tabs, [role]);
  assert(current.resume.includes(role === 'vision' ? 'Vision_Engineer' : 'Product_Manager'));
  assert.equal(current.navHref, `#${role}-projects`);
  assert.equal(current.overflow, false);
};
/** 面板内容是否正在做切换动画（排除首屏状态点等常驻动画） */
const contentAnimating = () => page.evaluate(() => document.getAnimations().some((animation) => animation.effect?.target?.closest('#career-content')));
/** 关键指标是否完成计数（显示的是目标值） */
const metricsSettled = () => page.evaluate(() => [...document.querySelectorAll('[data-role-panel]:not([hidden]) .career-metric-number')].every((element) => element.textContent === element.dataset.value));
try {
  await page.setViewport({ width: 1440, height: 1000 });
  mkdirSync('.shots', { recursive: true });
  await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
  await pause(900);
  assert.equal(await page.$eval('html', (element) => element.lang), 'zh-CN');
  assert.equal(await page.$$eval('.home-choice', (cards) => cards.length), 2);
  assert.equal(await theme(), 'dark');
  // 波浪线：Canvas 持续绘制、随指针变化；减少动态效果时只画一帧
  const waveState = () => page.$eval('#home-wave', (canvas) => ({ mode: canvas.dataset.mode, pointer: canvas.dataset.pointer, width: canvas.width, height: canvas.height }));
  const waveFrame = () => page.$eval('#home-wave', (canvas) => canvas.toDataURL());
  const wave = await waveState();
  assert.equal(wave.mode, 'live', '波浪线未进入动态模式');
  assert(wave.width > 0 && wave.height > 0, '波浪线画布没有尺寸');
  assert.equal(wave.pointer, 'false');
  const frameA = await waveFrame();
  await pause(2600);
  const frameB = await waveFrame();
  assert.notEqual(frameA, frameB, '波浪线没有持续动画');
  const waveBox = await page.$eval('#home-wave', (canvas) => { const r = canvas.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  await page.mouse.move(waveBox.x + waveBox.w * 0.7, waveBox.y + waveBox.h * 0.5);
  await pause(120);
  assert.equal((await waveState()).pointer, 'true', '指针进入波浪线区域后未激活交互');
  await page.mouse.move(20, 980);
  await pause(120);
  assert.equal((await waveState()).pointer, 'false', '指针离开波浪线区域后未复原');
  // 减少动态效果：以该偏好打开页面时只画一帧，也不响应指针
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.reload({ waitUntil: 'networkidle0' });
  await pause(300);
  assert.equal((await waveState()).mode, 'static', '减少动态效果下波浪线仍为动态模式');
  const staticA = await waveFrame();
  await page.mouse.move(waveBox.x + waveBox.w * 0.7, waveBox.y + waveBox.h * 0.5);
  await pause(600);
  assert.equal(await waveFrame(), staticA, '减少动态效果下波浪线仍在变化');
  assert.equal((await waveState()).pointer, 'false', '减少动态效果下仍响应指针');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.reload({ waitUntil: 'networkidle0' });
  await pause(300);
  assert.equal((await waveState()).mode, 'live');
  await page.mouse.move(20, 980);
  for (const path of ['/', '/en/', '/career/', '/academic/zh/']) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle0' });
    const icp = await page.$eval('.footer-icp a', (a) => ({ text: a.textContent.trim(), href: a.href }));
    assert.deepEqual(icp, { text: '豫ICP备2026043356号-1', href: 'https://beian.miit.gov.cn/' }, `${path} 备案号错误`);
  }
  await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
  await pause(900);
  await page.screenshot({ path: '.shots/home-desktop.png' });
  for (const width of [320, 390, 768]) {
    await page.setViewport({ width, height: 844 });
    await noOverflow(`入口主页 ${width}`);
    if (width === 390) await page.screenshot({ path: '.shots/home-mobile.png', fullPage: true });
  }
  await page.setViewport({ width: 1440, height: 1000 });
  // 英文入口：语言切换、翻译关系与主题共享
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('#lang-toggle')]);
  assert.equal(new URL(page.url()).pathname, '/en/');
  assert.equal(await page.$eval('html', (element) => element.lang), 'en');
  assert.equal(await page.$$eval('.home-choice', (cards) => cards.length), 2);
  await pause(900);
  await page.screenshot({ path: '.shots/home-en-desktop.png' });
  await page.click('#theme-toggle');
  assert.equal(await theme(), 'light');
  await pause(700);
  await page.screenshot({ path: '.shots/home-en-light.png' });
  await page.setViewport({ width: 390, height: 844 });
  await noOverflow('英文入口主页 390');
  await page.setViewport({ width: 1440, height: 1000 });
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('#lang-toggle')]);
  assert.equal(new URL(page.url()).pathname, '/');
  assert.equal(await theme(), 'light', '主题未跨页面保持');
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('.home-academic .home-choice-main')]);
  assert.equal(new URL(page.url()).pathname, '/academic/');
  assert.equal(await page.$eval('html', (element) => element.lang), 'en');
  assert.equal(await theme(), 'light', '学术页未沿用入口主页主题');
  await page.click('#theme-toggle');
  assert.equal(await theme(), 'dark');
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('#lang-toggle')]);
  assert.equal(new URL(page.url()).pathname, '/academic/zh/');
  assert.equal(await page.$eval('html', (element) => element.lang), 'zh-CN');
  await page.setViewport({ width: 390, height: 844 });
  await noOverflow('学术页 390');
  await page.screenshot({ path: '.shots/academic-mobile.png' });
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('.brand')]);
  assert.equal(new URL(page.url()).pathname, '/');
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('.home-career .home-choice-main')]);
  assert.equal(new URL(page.url()).pathname, '/career/');
  assert.equal(await theme(), 'dark');
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('.career-brand')]);
  assert.equal(new URL(page.url()).pathname, '/');
  await page.goto(`${base}/zh/?from=legacy#publications`, { waitUntil: 'networkidle0' });
  assert.equal(new URL(page.url()).pathname, '/academic/zh/');
  assert.equal(new URL(page.url()).hash, '#publications');
  assert.equal(new URL(page.url()).search, '?from=legacy');
  await page.goto(`${base}/#research`, { waitUntil: 'networkidle0' });
  assert.equal(new URL(page.url()).pathname, '/');
  assert.equal(new URL(page.url()).hash, '#research');
  assert.equal(await page.$$eval('.home-choice', (cards) => cards.length), 2);
  await page.goto(`${base}/#top`, { waitUntil: 'networkidle0' });
  assert.equal(new URL(page.url()).pathname, '/');
  assert.equal(await page.$$eval('.home-choice', (cards) => cards.length), 2);
  await page.setViewport({ width: 1440, height: 1000 });
  console.log('中英入口主页、主题跨页保持、学术中英切换、返回主页与旧地址兼容检查通过');

  await page.goto(`${base}/career/`, { waitUntil: 'networkidle0' });
  console.log('页面已加载');
  await checkRole('product');
  await page.click('#tab-vision');
  await pause(220);
  assert(await contentAnimating(), '切换没有产生动画');
  assert.equal(await metricsSettled(), false, '指标没有计数动画');
  await pause(1100);
  await checkRole('vision');
  assert.equal(await metricsSettled(), true, '指标计数未到达目标值');
  console.log('首次切换通过');
  assert(new URL(page.url()).searchParams.get('role') === 'vision');
  await page.click('#tab-product');
  await pause(35);
  await page.click('#tab-vision');
  await pause(900);
  await checkRole('vision');
  await page.focus('#tab-vision');
  await page.keyboard.press('Home');
  await pause(900);
  await checkRole('product');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'tab-product');
  await page.keyboard.press('ArrowRight');
  await pause(900);
  await checkRole('vision');
  await page.goBack();
  await pause(900);
  await checkRole('product');
  await page.reload({ waitUntil: 'networkidle0' });
  await checkRole('product');
  // 章节导航跟随当前岗位面板；滚过首屏后切换器收缩为紧凑态，从紧凑态切换回到新岗位首屏
  const switchGeometry = () => page.evaluate(() => {
    const outer = document.querySelector('#career-switch');
    const button = document.querySelector('#tab-product');
    const head = button.querySelector('.career-tab-head');
    const b = button.getBoundingClientRect();
    const h = head.getBoundingClientRect();
    return {
      outerHeight: outer.offsetHeight,
      contentTop: document.querySelector('#career-content').getBoundingClientRect().top + scrollY,
      headTopGap: h.top - b.top,
      headBottomGap: b.bottom - h.bottom,
    };
  });
  const expanded = await switchGeometry();
  await page.click('.nav-link[data-section="projects"]');
  // 等平滑滚动越过阈值进入紧凑态，之后收起过程中状态不得来回振荡
  let waited = 0;
  while ((await state()).compact !== 'true' && waited < 2000) { await pause(50); waited += 50; }
  const samples = [];
  for (let i = 0; i < 8; i += 1) { samples.push((await state()).compact); await pause(80); }
  assert(samples.every((value) => value === 'true'), `收起过程中切换器状态振荡：${samples.join(',')}`);
  assert.equal(await page.evaluate(() => location.hash), '#product-projects');
  const compacted = await switchGeometry();
  assert(Math.abs(compacted.outerHeight - expanded.outerHeight) <= 1, '收起后切换器占位高度变化，会引起布局跳动');
  assert(Math.abs(compacted.contentTop - expanded.contentTop) <= 0.6, `收起后正文位置发生偏移：${expanded.contentTop} → ${compacted.contentTop}`);
  assert(Math.abs(compacted.headTopGap - compacted.headBottomGap) <= 1.5, `紧凑态文字上下边距不一致：${compacted.headTopGap} / ${compacted.headBottomGap}`);
  await page.click('#tab-vision');
  await pause(1000);
  await checkRole('vision');
  assert(await page.evaluate(() => window.scrollY) < 900, '紧凑态切换后未回到新岗位首屏');
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause(900);
  assert.equal((await state()).compact, 'false', '回到顶部后切换器未展开');
  const reexpanded = await switchGeometry();
  assert(Math.abs(reexpanded.headTopGap - reexpanded.headBottomGap) > 1.5 || reexpanded.headBottomGap > reexpanded.headTopGap, '展开态未恢复亮点内容');
  await page.click('#tab-product');
  await pause(1000);
  await checkRole('product');
  await page.screenshot({ path: '.shots/career-product-desktop.png', fullPage: false });
  await page.screenshot({ path: '.shots/career-product-full.png', fullPage: true });
  await page.goto(`${base}/career/?role=vision`, { waitUntil: 'networkidle0' });
  await checkRole('vision');
  await pause(900);
  await page.screenshot({ path: '.shots/career-vision-desktop.png', fullPage: false });
  await page.screenshot({ path: '.shots/career-vision-full.png', fullPage: true });
  await page.click('#theme-toggle');
  assert.equal(await theme(), 'light');
  await pause(700);
  await page.screenshot({ path: '.shots/career-vision-light.png', fullPage: false });
  await page.click('#theme-toggle');
  await pause(500);
  for (const width of [320, 390, 768]) {
    await page.setViewport({ width, height: 844 });
    await checkRole('vision');
    await page.click('#tab-product');
    await pause(900);
    await checkRole('product');
    await page.click('#tab-vision');
    await pause(900);
    await checkRole('vision');
    if (width === 390) {
      await page.screenshot({ path: '.shots/career-vision-mobile.png', fullPage: true });
      await page.screenshot({ path: '.shots/career-vision-mobile-fold.png', fullPage: false });
    }
  }
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.click('#tab-product');
  await checkRole('product');
  assert.equal(await contentAnimating(), false, '减少动态效果下仍有切换动画');
  assert.equal(await metricsSettled(), true, '减少动态效果下指标仍在计数');
  for (const route of ['/cv/Shizhao_Gao_Product_Manager_ZH.pdf', '/cv/Shizhao_Gao_Vision_Engineer_ZH.pdf']) {
    const response = await fetch(base + route);
    const result = [response.status, (await response.text()).slice(0, 5)];
    assert.deepEqual(result, [200, '%PDF-']);
  }
  assert.deepEqual(errors, []);
  console.log('交互检查通过：动画、快速反向切换、键盘、历史导航、章节导航、直达链接、主题切换、320/390/768 手机平板、减少动态效果及双简历下载。');
} finally { await browser.close(); }
