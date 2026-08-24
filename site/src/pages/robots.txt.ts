import type { APIRoute } from 'astro';

/**
 * 主站开放收录；镜像站（NOINDEX=1）整站禁止抓取，
 * 避免与主站构成重复内容。
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://maple1999.github.io');
  const noindex = process.env.NOINDEX === '1';

  const body = noindex
    ? `# 本站为镜像，正式站点见 canonical 指向的地址
User-agent: *
Disallow: /
`
    : `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', base).href}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
