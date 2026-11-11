/** 检查实际构建产物的页面关系、资源及求职简历，发布前运行。 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const origin = process.env.SITE_URL || 'https://www.mapletech.top';
const isNoindex = process.env.NOINDEX === '1';
const abs = (pathname) => new URL(pathname, origin).href;
const pages = [['/', 'zh-CN'], ['/en/', 'en'], ['/academic/', 'en'], ['/academic/zh/', 'zh-CN'], ['/career/', 'zh-CN']];
const read = (file) => readFileSync(file, 'utf8');
const resourceFile = (pathname) => {
  const file = resolve(dist, `.${decodeURIComponent(pathname)}`);
  assert(file === dist || file.startsWith(dist + '/') || file.startsWith(dist + '\\'), `资源越界：${pathname}`);
  return existsSync(file) && statSync(file).isDirectory() ? resolve(file, 'index.html') : file;
};
/** 页面 <head> 中声明的 hreflang 目标地址 */
const alternates = (html) => [...html.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)"/g)].map((match) => match[1]);

for (const [pathname, lang] of pages) {
  const html = read(resourceFile(pathname));
  assert(!/AAAI/i.test(html), `${pathname} 不得公开投稿会议关联`);
  assert(!/href="\/letters\//.test(html), `${pathname} 不得公开推荐信链接`);
  assert(html.includes(`<html lang="${lang}"`), `${pathname} 语言错误`);
  assert(html.includes(`rel="canonical" href="${abs(pathname)}"`), `${pathname} canonical 错误`);
  assert.equal(/name="robots" content="noindex/.test(html), isNoindex, `${pathname} 收录参数错误`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${pathname} 主标题数量错误`);
  assert.equal((html.match(/data-visit-tracker/g) || []).length, 1, `${pathname} 访问统计脚本数量错误`);
  assert(html.includes('data-visit-notice'), `${pathname} 缺少访问统计说明`);
  assert(html.includes('id="theme-toggle"'), `${pathname} 缺少主题切换`);
  assert(html.includes('豫ICP备2026043356号-1') && html.includes('href="https://beian.miit.gov.cn/"'), `${pathname} 页脚缺少备案号或工信部链接`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"<>]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    const url = new URL(href, new URL(pathname, origin));
    if (url.origin !== new URL(origin).origin || !['http:', 'https:'].includes(url.protocol)) continue;
    const file = resourceFile(url.pathname);
    assert(existsSync(file), `${pathname} 资源不存在：${href}`);
    if (url.hash && file.endsWith('.html')) {
      assert(read(file).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${pathname} 锚点不存在：${href}`);
    }
  }
}

for (const file of readdirSync(resolve(dist, '_astro')).filter((file) => file.endsWith('.css'))) {
  for (const match of read(resolve(dist, '_astro', file)).matchAll(/url\(["']?(\/[^"')]+)["']?\)/g)) {
    assert(existsSync(resourceFile(match[1])), `样式资源不存在：${match[1]}`);
  }
}

// 入口主页：中英互为翻译，但不与学术页声明翻译关系；不自动跳转；波浪线为 Canvas 并带无 JS 回退。
for (const [pathname, needle] of [['/', '学术主页'], ['/en/', 'Academic profile']]) {
  const html = read(resourceFile(pathname));
  assert(html.includes(needle) && html.includes('href="/academic/"') && html.includes('href="/academic/zh/"'), `${pathname} 入口主页内容错误`);
  assert.deepEqual(new Set(alternates(html)), new Set([abs('/'), abs('/en/')]), `${pathname} 翻译关系错误`);
  assert(!html.includes('location.replace') && !html.includes('http-equiv="refresh"'), `${pathname} 不得自动跳转学术页`);
  assert(html.includes('id="home-wave"') && /<noscript>\s*<svg class="home-wave"/.test(html), `${pathname} 波浪线缺少 Canvas 或无 JS 回退`);
}
for (const [pathname] of pages) {
  const html = read(resourceFile(pathname));
  assert(!html.includes('Astro 静态生成') && !html.includes('Statically generated'), `${pathname} 页脚仍提及 Astro 静态生成`);
}
const home = read(resourceFile('/'));
for (const name of ['Recommendation_Jun_Li.pdf', 'Recommendation_Qiming_Li.pdf']) {
  assert(!existsSync(resolve(dist, 'letters', name)), `完整推荐信不得发布：${name}`);
}
assert(home.includes('href="/en/"') && read(resourceFile('/en/')).includes('href="/"'), '入口主页缺少语言切换');
for (const path of ['/academic/', '/academic/zh/']) {
  const html = read(resourceFile(path));
  assert.deepEqual(new Set(alternates(html)), new Set([abs('/academic/'), abs('/academic/zh/')]), `${path} 翻译关系错误`);
  assert(html.includes('class="brand" href="/"'), '学术页缺少返回总主页入口');
  assert(!html.includes('href="/career/"'), '学术页不应链接求职页');
}
const legacy = read(resourceFile('/zh/'));
assert(legacy.includes(`rel="canonical" href="${abs('/academic/zh/')}"`) && legacy.includes('location.search + location.hash'), '旧中文地址未保留跳转与片段');

const career = read(resourceFile('/career/'));
assert(career.includes('gsz199911@163.com'), '求职邮箱错误');
assert(!/href="\/academic\/[^"]*"/.test(career), '求职页不应链接学术页');
assert(career.includes('开发中') && career.includes('Mock'), '求职项目状态缺失');
assert.equal(alternates(career).length, 0, '中文求职页不应关联英文或学术页作为翻译');
assert(career.includes('Nano-TCC') && career.includes('16.5 ms') && career.includes('TensorRT'), '视觉算法岗位缺少端侧部署成果');
assert(career.includes('为什么是我') && career.includes('岗位匹配'), '求职页缺少个人优势或岗位匹配对照');
const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const [pathname, filename] of [['/academic/', 'Shizhao_Gao_CV_EN.pdf'], ['/academic/zh/', 'Shizhao_Gao_CV_ZH.pdf']]) {
  assert.equal(hash(resolve(dist, `cv/${filename}`)), hash(resolve(root, `public/cv/${filename}`)), `${pathname} 学术简历构建副本不一致`);
  assert(read(resourceFile(pathname)).includes(`href="/cv/${filename}"`), `${pathname} 学术简历语言映射错误`);
}
for (const [role, filename] of [['product', 'Shizhao_Gao_Product_Manager_ZH.pdf'], ['vision', 'Shizhao_Gao_Vision_Engineer_ZH.pdf']]) {
  assert.equal(hash(resolve(dist, `cv/${filename}`)), hash(resolve(root, `public/cv/${filename}`)), '简历构建副本不一致');
  assert(career.includes(`id="tab-${role}"`) && career.includes(`aria-controls="panel-${role}"`), `${role} 页签关系错误`);
  assert(career.includes(`data-resume-url="/cv/${filename}"`), `${role} 简历映射错误`);
  for (const section of ['strengths', 'fit', 'experience', 'projects', 'background', 'contact']) assert(career.includes(`id="${role}-${section}"`), `${role} 缺少 ${section} 章节`);
}
const ids = [...career.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, '求职页存在重复 ID');
assert(career.includes('0.129') && career.includes('0.098') && career.includes('18.0%') && career.includes('收益未迁移'), '算法成果或适用边界缺失');

const sitemap = read(resolve(dist, 'sitemap.xml'));
for (const [pathname] of pages) assert(sitemap.includes(`<loc>${abs(pathname)}</loc>`), `sitemap 缺少 ${pathname}`);
const entryOf = (pathname) => sitemap.match(new RegExp(`<url>\\s*<loc>${abs(pathname).replaceAll('.', '\\.')}</loc>[\\s\\S]*?</url>`))?.[0];
assert(entryOf('/career/') && !entryOf('/career/').includes('xhtml:link'), '求职页 sitemap 翻译关系错误');
for (const pathname of ['/', '/en/']) {
  const entry = entryOf(pathname);
  assert(entry && entry.includes(`href="${abs('/en/')}"`) && !entry.includes('/academic/'), `${pathname} sitemap 翻译关系错误`);
}
assert(!sitemap.includes(`<loc>${abs('/zh/')}</loc>`), '旧中文地址不应收录进 sitemap');
assert(read(resolve(dist, 'robots.txt')).includes(isNoindex ? 'Disallow: /' : `Sitemap: ${abs('/sitemap.xml')}`));
assert(existsSync(resolve(dist, '404.html')), '缺少 404 页面');
console.log('构建校验通过：中英入口主页、双语学术页、求职页（含端侧部署成果）、旧地址兼容、站内链接、SEO 与双简历。');
