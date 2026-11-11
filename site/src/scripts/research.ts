/** Progressive enhancement: every research question is readable without JavaScript. */
class ResearchExplorer extends HTMLElement {
  connectedCallback() {
    if (this.dataset.enhanced) return;
    const tabs = [...this.querySelectorAll<HTMLButtonElement>('[data-research-tab]')];
    const panels = [...this.querySelectorAll<HTMLElement>('[data-research-panel]')];
    const tablist = this.querySelector<HTMLElement>('[role="tablist"]');
    if (!tabs.length || !tablist || panels.length !== tabs.length) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const select = (id: string, animate = false) => {
      this.dataset.direction = id;
      tabs.forEach(tab => {
        const selected = tab.dataset.researchTab === id;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(panel => {
        const selected = panel.dataset.researchPanel === id;
        panel.getAnimations().forEach(animation => animation.cancel());
        panel.hidden = !selected;
        panel.inert = !selected;
        if (selected && animate && !reducedMotion.matches) {
          panel.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
        }
      });
    };
    panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `research-tab-${panel.dataset.researchPanel}`);
      panel.tabIndex = 0;
    });
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab.dataset.researchTab!, true));
      tab.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[next].focus();
        select(tabs[next].dataset.researchTab!, true);
      });
    });
    this.dataset.enhanced = 'true';
    select(tabs[0].dataset.researchTab!);
    tablist.hidden = false;
  }
}
if (!customElements.get('research-explorer')) customElements.define('research-explorer', ResearchExplorer);
