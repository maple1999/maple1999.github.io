// @ts-check
import { defineConfig } from 'astro/config';

/**
 * 正式站点部署于 TXyun；环境变量可用于本地或隔离预览：
 *
 *   SITE_URL   本次构建的站点地址（影响 canonical / hreflang / OG / sitemap）
 *   NOINDEX    设为 '1' 时输出 noindex，用于镜像站，避免与主站重复收录
 *
 * 默认地址为已备案的正式域名，不再发布到 GitHub Pages。
 */
const SITE_URL = process.env.SITE_URL || 'https://www.mapletech.top';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  compressHTML: true,
});
