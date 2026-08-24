import type { APIRoute } from 'astro';

/**
 * sitemap 随构建目标变化（GitHub Pages / 腾讯云镜像地址不同），
 * 所以用端点动态生成，而不是写死在 public/ 里。
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://maple1999.github.io');
  const abs = (p: string) => new URL(p, base).href;

  const pages = [
    { path: '/', priority: '1.0' },
    { path: '/zh/', priority: '0.9' },
  ];

  const alternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${abs('/')}"/>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${abs('/zh/')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs('/')}"/>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (p) => `  <url>
    <loc>${abs(p.path)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>${alternates}
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
