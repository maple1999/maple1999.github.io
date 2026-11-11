class PaperExperiments extends HTMLElement {
  connectedCallback() {
    if (this.dataset.enhanced) return;
    const tabs = [...this.querySelectorAll<HTMLButtonElement>('[data-study-tab]')];
    const panels = [...this.querySelectorAll<HTMLElement>('[data-study]')];
    const tablist = this.querySelector<HTMLElement>('[role="tablist"]');
    if (!tablist || tabs.length !== panels.length) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const select = (id: string, animate = true) => {
      tabs.forEach(tab => {
        const active = tab.dataset.studyTab === id;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => {
        const active = panel.dataset.study === id;
        panel.getAnimations().forEach(animation => animation.cancel());
        panel.hidden = !active;
        panel.inert = !active;
        if (active && animate && !reduced.matches) panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220 });
      });
    };
    panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `study-tab-${panel.dataset.study}`);
      panel.tabIndex = 0;
    });
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab.dataset.studyTab!));
      tab.addEventListener('keydown', event => {
        let next: number;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[next].focus();
        select(tabs[next].dataset.studyTab!);
      });
    });
    this.dataset.enhanced = 'true';
    tablist.hidden = false;
    select(tabs[0].dataset.studyTab!, false);
  }
}
if (!customElements.get('paper-experiments')) customElements.define('paper-experiments', PaperExperiments);

// Links into the appendices open the relevant native disclosure before scrolling.
function revealTarget(hash: string) {
  let id: string;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  let details = target.closest('details');
  let opened = false;
  while (details) {
    if (!details.open) { details.open = true; opened = true; }
    details = details.parentElement?.closest('details') ?? null;
  }
  if (opened) target.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  if (opened || hash === '#research') requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
}
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (link && !event.defaultPrevented && !(event instanceof MouseEvent && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey))) revealTarget(link.hash);
});
window.addEventListener('hashchange', () => revealTarget(location.hash));
revealTarget(location.hash);

let printDisclosures: HTMLDetailsElement[] = [];
window.addEventListener('beforeprint', () => {
  printDisclosures = [...document.querySelectorAll<HTMLDetailsElement>('.paper-disclosure:not([open])')];
  printDisclosures.forEach(details => { details.open = true; });
});
window.addEventListener('afterprint', () => {
  printDisclosures.forEach(details => { details.open = false; });
  printDisclosures = [];
});
