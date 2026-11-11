/** Inject into build output only; academic layouts/content remain untouched. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const source = readFileSync(new URL('../src/scripts/visit.js', import.meta.url));
const name = `visit.${createHash('sha256').update(source).digest('hex').slice(0, 12)}.js`;
const dist = new URL('../dist/', import.meta.url);
writeFileSync(new URL(`_astro/${name}`, dist), source);
for (const path of ['index.html', 'en/index.html', 'academic/index.html', 'academic/zh/index.html', 'career/index.html']) {
  const file = new URL(path, dist);
  let html = readFileSync(file, 'utf8');
  const en = html.includes('<html lang="en"');
  const notice = en ? 'This site measures page visits, visible time and attachment clicks to improve its content.' : '本站统计站内页面访问、前台停留时长与附件点击，用于改进内容。';
  html = html.replace('</body>', `<p data-visit-notice style="margin:0 auto;padding:0 1.25rem 1.25rem;max-width:1200px;font-size:11px;line-height:1.7;color:var(--text-muted)">${notice}</p><script defer src="/_astro/${name}" data-visit-tracker></script></body>`);
  writeFileSync(file, html);
}
console.log('访问统计脚本已加入五个页面（不改学术源文件）。');
