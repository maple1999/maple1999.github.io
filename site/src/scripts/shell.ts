/** 入口主页与求职页共用的页面外壳行为：主题切换、导航滚动态。学术页的 Base.astro 自带同样逻辑，此处不复用以免改动学术页。 */
const root = document.documentElement;

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
});

const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.setAttribute('data-scrolled', String(window.scrollY > 24));
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
