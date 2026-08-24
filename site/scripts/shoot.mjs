/**
 * 截图脚本 —— 用本机已装的 Chrome 驱动 puppeteer-core，
 * 先滚一遍触发所有滚动渐显，再回到顶部整页截图。
 *
 *   node scripts/shoot.mjs <baseUrl> <outDir>
 */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4323';
const OUT = process.argv[3] ?? '../.shots';

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const executablePath = CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error('No Chrome/Edge found.');
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

const TARGETS = [
  { name: 'en-dark', url: '/', theme: 'dark', w: 1440, h: 900 },
  { name: 'en-light', url: '/', theme: 'light', w: 1440, h: 900 },
  { name: 'zh-dark', url: '/zh/', theme: 'dark', w: 1440, h: 900 },
  { name: 'mobile-en', url: '/', theme: 'dark', w: 390, h: 844 },
];

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu', '--font-render-hinting=none'],
});

for (const tgt of TARGETS) {
  const page = await browser.newPage();
  await page.setViewport({ width: tgt.w, height: tgt.h, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument((theme) => {
    try { localStorage.setItem('theme', theme); } catch {}
  }, tgt.theme);

  await page.goto(BASE + tgt.url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts?.ready);

  // 让所有滚动渐显进入终态，截到的是页面settled后的样子
  await page.evaluate(async () => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.hero-in').forEach((el) => {
      el.style.opacity = '1';
      el.style.animation = 'none';
    });
    // 整页截图不会触发懒加载，先全部转成 eager
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.loading = 'eager';
    });
    await new Promise((r) => setTimeout(r, 400));
  });

  // 等所有图片解码完成，避免截到空白占位
  await page.evaluate(() =>
    Promise.all(
      [...document.images].filter((i) => !i.complete).map((i) => i.decode().catch(() => {})),
    ),
  );

  const path = `${OUT}/${tgt.name}.png`;
  await page.screenshot({ path, fullPage: true });
  const { width, height } = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.body.scrollHeight,
  }));
  console.log(`${tgt.name.padEnd(11)} ${width}x${height}  → ${path}`);

  // 横向溢出检查
  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return [...document.querySelectorAll('*')]
      .filter((el) => el.getBoundingClientRect().right > vw + 1)
      .slice(0, 6)
      .map((el) => el.tagName + '.' + (el.className?.toString().split(' ')[0] || ''));
  });
  if (overflow.length) console.log(`  ⚠ horizontal overflow: ${overflow.join(', ')}`);

  await page.close();
}

await browser.close();
