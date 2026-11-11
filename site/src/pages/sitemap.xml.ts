import type { APIRoute } from 'astro';

/**
 * 中英入口主页、双语学术页与中文求职页。
 * 入口主页两种语言互为翻译；学术页两种语言互为翻译；求职页仅中文。
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://www.mapletech.top');
  const abs = (p: string) => new URL(p, base).href;

  const homeAlternates = `
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${abs('/')}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${abs('/en/')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs('/')}"/>`;
  const academicAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${abs('/academic/')}"/>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${abs('/academic/zh/')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs('/academic/')}"/>`;

  const pages = [
    { path: '/', priority: '1.0', alternates: homeAlternates },
    { path: '/en/', priority: '1.0', alternates: homeAlternates },
    { path: '/academic/', priority: '0.9', alternates: academicAlternates, lastmod: '2026-11-11' },
    { path: '/academic/zh/', priority: '0.9', alternates: academicAlternates, lastmod: '2026-11-11' },
    { path: '/career/', priority: '0.9', alternates: '' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (p) => `  <url>
    <loc>${abs(p.path)}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>${p.alternates}
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
