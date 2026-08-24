import type { L } from '../data/profile';

export type Lang = 'en' | 'zh';

/** 取出当前语言的文本。传字符串则原样返回。 */
export function t(value: L | string | null | undefined, lang: Lang): string {
  if (value == null) return '';
  return typeof value === 'string' ? value : value[lang];
}

/** 另一种语言 */
export const other = (lang: Lang): Lang => (lang === 'en' ? 'zh' : 'en');

/** 生成对应语言的站内路径 */
export const path = (lang: Lang, hash = ''): string =>
  (lang === 'en' ? '/' : '/zh/') + (hash ? `#${hash}` : '');
