// @ts-check
import { defineConfig } from 'astro/config';

/**
 * 同一份源码要发布到两个地方，靠环境变量区分：
 *
 *   SITE_URL   本次构建的站点地址（影响 canonical / hreflang / OG / sitemap）
 *   NOINDEX    设为 '1' 时输出 noindex，用于镜像站，避免与主站重复收录
 *
 * 默认值对应 GitHub Pages（当前主站）。
 * 腾讯云镜像由 scripts/deploy.mjs 覆盖这两个变量。
 */
const SITE_URL = process.env.SITE_URL || 'https://maple1999.github.io';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  compressHTML: true,
});
