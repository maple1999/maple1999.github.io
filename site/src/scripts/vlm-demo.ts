/** Illustrative state transitions only; benchmark results stay in the project copy. */
class VlmDemo extends HTMLElement {
  private lifecycle?: AbortController;
  private observer?: IntersectionObserver;
  private timer?: ReturnType<typeof setTimeout>;

  connectedCallback() {
    if (this.lifecycle) return;
    this.lifecycle = new AbortController();
    const { signal } = this.lifecycle;
    const query = this.dataset.mode === 'query';
    const en = this.dataset.language === 'en';
    // Autoplay the steps for every visitor; CSS removes motion effects when requested.
    let playing = true;
    let visible = false;
    let printing = false;
    let stage = 0;
    let scope = 3;
    let route = 'uncertain';
    let beforePrint = 0;
    const labels = [...this.querySelectorAll<HTMLElement>('[data-step-labels] > span')].map(el => el.textContent || '');
    const play = this.querySelector<HTMLButtonElement>('[data-play]')!;
    const reader = this.querySelector<HTMLElement>('.demo-step-reader')!;
    const caption = this.querySelector<HTMLElement>('[data-step-caption]')!;
    const stopTimer = () => { clearTimeout(this.timer); this.timer = undefined; };
    const schedule = () => {
      stopTimer();
      const running = playing && visible && !document.hidden && !printing;
      this.dataset.running = String(running);
      play.textContent = playing ? this.dataset.pauseLabel! : this.dataset.playLabel!;
      play.setAttribute('aria-pressed', String(playing));
      if (running) this.timer = setTimeout(() => { stage = (stage + 1) % 4; render(); schedule(); }, stage === 3 ? 3200 : 2200);
    };
    const render = (manual = false) => {
      this.dataset.stage = String(stage);
      this.dataset.scope = String(scope);
      this.dataset.route = route;
      reader.setAttribute('aria-live', manual ? 'polite' : 'off');
      this.querySelector('[data-step-number]')!.textContent = `0${stage + 1} / 04`;
      caption.textContent = labels[stage];
      this.querySelectorAll<HTMLElement>('[data-node]').forEach(node => {
        const n = Number(node.dataset.node);
        node.dataset.state = n === stage ? 'active' : n < stage ? 'done' : 'waiting';
      });
      this.querySelectorAll<HTMLElement>('[data-connector]').forEach(node => node.dataset.lit = String(stage >= Number(node.dataset.connector)));
      this.querySelectorAll<HTMLElement>('[data-progress]').forEach(node => node.dataset.lit = String(stage >= Number(node.dataset.progress)));
      if (query) {
        // Representative evidence patterns, not recorded model selections.
        const evidence = scope === 1 ? [1, 3] : scope === 2 ? [1, 3, 6] : [1, 3, 5, 6];
        this.querySelectorAll<HTMLElement>('[data-frame]').forEach(node => node.classList.toggle('selected', stage >= 1 && evidence.includes(Number(node.dataset.frame))));
        this.querySelectorAll<HTMLElement>('[data-question]').forEach(node => node.dataset.inScope = String(Number(node.dataset.question) <= scope));
        this.querySelectorAll<HTMLButtonElement>('[data-scope-choice]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.scopeChoice) === scope)));
      } else {
        this.querySelectorAll<HTMLElement>('[data-branch]').forEach(node => node.dataset.selected = String(stage >= 2 && node.dataset.branch === route));
        this.querySelectorAll<HTMLButtonElement>('[data-route-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.routeChoice === route)));
        this.querySelector('[data-routing-output]')!.textContent = route === 'confident'
          ? (en ? 'Answer from the initial context' : '基于初始上下文回答')
          : (en ? 'Answer with additional context' : '结合更多上下文回答');
      }
    };
    play.addEventListener('click', () => { playing = !playing; schedule(); }, { signal });
    this.querySelector('[data-next]')!.addEventListener('click', () => { playing = false; stage = (stage + 1) % 4; render(true); schedule(); }, { signal });
    this.querySelectorAll<HTMLButtonElement>('[data-scope-choice], [data-route-choice]').forEach(button => {
      button.addEventListener('click', () => {
        if (button.dataset.scopeChoice) scope = Number(button.dataset.scopeChoice);
        if (button.dataset.routeChoice) route = button.dataset.routeChoice;
        // Keep a manually paused demo paused; replay a running demo from its start.
        stage = playing ? 0 : stage;
        render(true);
        schedule();
      }, { signal });
    });
    document.addEventListener('visibilitychange', schedule, { signal });
    window.addEventListener('pagehide', stopTimer, { signal });
    window.addEventListener('pageshow', schedule, { signal });
    window.addEventListener('beforeprint', () => { beforePrint = stage; printing = true; stage = 3; render(); schedule(); }, { signal });
    window.addEventListener('afterprint', () => { printing = false; stage = beforePrint; render(); schedule(); }, { signal });
    this.observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0 });
    this.observer.observe(this);
    this.dataset.enhanced = 'true';
    this.querySelectorAll<HTMLElement>('[data-controls]').forEach(el => el.hidden = false);
    render();
    schedule();
  }

  disconnectedCallback() {
    clearTimeout(this.timer);
    this.observer?.disconnect();
    this.lifecycle?.abort();
    this.lifecycle = undefined;
    delete this.dataset.enhanced;
  }
}
if (!customElements.get('vlm-demo')) customElements.define('vlm-demo', VlmDemo);
