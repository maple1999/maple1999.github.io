/**
 * 两个岗位，一个地址：确定性状态、可打断的动效、键盘可达的页签、章节高亮、
 * 吸顶切换器的紧凑态与关键指标计数。
 *
 * 切换动效分三段：
 *   1. 切换器高亮块立即滑向目标岗位（CSS transition，由 data-role-target 驱动）；
 *   2. 当前内容朝离开方向短暂退场；
 *   3. 提交新岗位后，首屏文案、档案卡、指标与各章节按方向依次入场，指标数字从 0 计数到位。
 * 快速连续点击时，用序号令牌丢弃过期的中间态。
 */
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-role-tab]'));
const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-role-panel]'));
const content = document.querySelector<HTMLElement>('#career-content')!;
const switcher = document.querySelector<HTMLElement>('#career-switch')!;
const bar = switcher.querySelector<HTMLElement>('.career-switch-bar')!;
const sentinel = document.querySelector<HTMLElement>('.career-switch-sentinel')!;
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link[data-section]'));
const announcement = document.querySelector<HTMLElement>('#career-announcement')!;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let active = '';
let requested = '';
let sequence = 0;
let animations: Animation[] = [];
let spy: IntersectionObserver | null = null;

const fromURL = () => (new URLSearchParams(location.search).get('role') === 'vision' ? 'vision' : 'product');
const labelOf = (role: string) => tabs.find((tab) => tab.dataset.roleTab === role)!.querySelector('strong')!.textContent!;
const canAnimate = () => !reducedMotion.matches && typeof content.animate === 'function';

function stopAnimations() {
  animations.forEach((animation) => animation.cancel());
  animations = [];
}

/** 章节高亮只关注当前岗位面板内的章节。 */
function watchSections(panel: HTMLElement) {
  spy?.disconnect();
  navLinks.forEach((link) => link.removeAttribute('aria-current'));
  if (!('IntersectionObserver' in window)) return;
  const sections = navLinks
    .map((link) => panel.querySelector<HTMLElement>(`#${active}-${link.dataset.section}`))
    .filter((section): section is HTMLElement => !!section);
  spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach((link) => link.setAttribute('aria-current', String(`${active}-${link.dataset.section}` === entry.target.id)));
      }
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
  );
  sections.forEach((section) => spy!.observe(section));
}

/** 关键指标从 0 计数到目标值；非数字开头的值（如 CVPR、Gold）保持原样。 */
function countUp(panel: HTMLElement, token: number) {
  panel.querySelectorAll<HTMLElement>('.career-metric-number').forEach((element) => {
    const target = element.dataset.value!;
    const match = target.match(/^([\d,]*\.?\d+)(.*)$/);
    if (!match) return;
    const digits = match[1];
    const value = parseFloat(digits.replace(/,/g, ''));
    const decimals = (digits.split('.')[1] || '').length;
    const grouped = digits.includes(',');
    const suffix = match[2];
    const format = (current: number) => (grouped
      ? current.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : current.toFixed(decimals)) + suffix;
    const start = performance.now();
    const duration = 900;
    element.textContent = format(0);
    const tick = (now: number) => {
      if (token !== sequence) { element.textContent = target; return; }
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = progress < 1 ? format(value * eased) : target;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function enter(panel: HTMLElement, direction: number, token: number) {
  if (!canAnimate()) return;
  const groups = [
    panel.querySelectorAll<HTMLElement>('.career-hero-copy > *'),
    panel.querySelectorAll<HTMLElement>('.career-profile, .career-hero .metrics'),
    panel.querySelectorAll<HTMLElement>('.section'),
  ];
  let index = 0;
  for (const group of groups) {
    group.forEach((element) => {
      const entry = element.animate(
        [
          { opacity: 0, transform: `translate3d(${direction * 28}px, 12px, 0)` },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        { duration: 640, delay: Math.min(index * 45, 300), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
      );
      animations.push(entry);
      index += 1;
    });
  }
  countUp(panel, token);
}

function commit(role: string, updateHistory: boolean) {
  active = role;
  document.documentElement.dataset.role = role;
  tabs.forEach((tab) => {
    const selected = tab.dataset.roleTab === role;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => { panel.hidden = panel.dataset.rolePanel !== role; });
  const panel = panels.find((item) => !item.hidden)!;
  document.querySelectorAll<HTMLAnchorElement>('[data-resume]').forEach((link) => {
    link.href = panel.dataset.resumeUrl!;
    link.setAttribute('aria-label', `下载${labelOf(role)}简历`);
  });
  navLinks.forEach((link) => { link.href = `#${role}-${link.dataset.section}`; });
  if (updateHistory) {
    const url = new URL(location.href);
    url.searchParams.set('role', role);
    url.hash = '';
    history.pushState({ role }, '', url);
  }
  watchSections(panel);
  return panel;
}

async function select(role: string, updateHistory = true) {
  if (role === requested) return;
  requested = role;
  const token = ++sequence;
  stopAnimations();
  const direction = role === 'vision' ? 1 : -1;
  // 高亮块立即出发；随后当前内容朝离开方向退场。
  document.documentElement.dataset.roleTarget = role;
  if (active && canAnimate()) {
    const exit = content.animate(
      [
        { opacity: 1, transform: 'translateX(0) scale(1)' },
        { opacity: 0, transform: `translateX(${-direction * 22}px) scale(.992)` },
      ],
      { duration: 170, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' },
    );
    animations.push(exit);
    await exit.finished.catch(() => {});
    if (token !== sequence) return;
  }
  stopAnimations();
  const panel = commit(role, updateHistory);
  // 从吸顶切换器发起的切换回到新岗位的首屏。
  const top = content.getBoundingClientRect().top;
  const offset = bar.getBoundingClientRect().bottom;
  if (updateHistory && top < offset - 24) window.scrollTo({ top: window.scrollY + top - offset, behavior: 'instant' as ScrollBehavior });
  enter(panel, direction, token);
  announcement.textContent = `已切换至${labelOf(role)}，内容与简历下载已更新。`;
}

const initialPanel = commit(fromURL(), false);
requested = active;
document.documentElement.dataset.roleTarget = active;
if (canAnimate()) countUp(initialPanel, sequence);

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => { void select(tab.dataset.roleTab!); });
  tab.addEventListener('keydown', (event) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[next].focus();
    void select(tabs[next].dataset.roleTab!);
  });
});
window.addEventListener('popstate', () => { void select(fromURL(), false); });
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) stopAnimations(); });

// 切换器滚过导航栏后收缩为紧凑态：只保留岗位名与简历按钮。
// 外层吸顶盒的高度固定为展开高度，收起只发生在内部条上，文档流不变，
// 因此不会与浏览器的滚动锚定互相触发而抖动。
function reserveHeight() {
  const hadInstant = 'instant' in switcher.dataset;
  const compact = switcher.dataset.compact;
  switcher.dataset.instant = '';
  switcher.dataset.compact = 'false';
  switcher.style.minHeight = '';
  switcher.style.minHeight = `${bar.getBoundingClientRect().height}px`;
  switcher.dataset.compact = compact;
  void bar.offsetHeight;
  if (!hadInstant) delete switcher.dataset.instant;
}
switcher.dataset.instant = '';
reserveHeight();
let resizeFrame = 0;
window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(reserveHeight);
}, { passive: true });
document.fonts?.ready.then(reserveHeight);
if ('IntersectionObserver' in window) {
  const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
  let settled = false;
  new IntersectionObserver(
    ([entry]) => {
      switcher.dataset.compact = String(!entry.isIntersecting);
      // 首次回调只设定初始状态，不播放折叠动画；之后由滚动触发的变化正常过渡。
      if (!settled) {
        settled = true;
        void bar.offsetHeight;
        requestAnimationFrame(() => { delete switcher.dataset.instant; });
      }
    },
    { rootMargin: `-${navHeight + 1}px 0px 0px 0px`, threshold: 0 },
  ).observe(sentinel);
} else {
  delete switcher.dataset.instant;
}
