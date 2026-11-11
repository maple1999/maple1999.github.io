/* First-party, per-tab session summaries. No cross-site browsing or form data. */
(() => {
  if (window.__mapletechVisit) return;
  window.__mapletechVisit = true;
  const allowed = new Set(['/', '/en/', '/academic/', '/academic/zh/', '/career/']);
  const normalize = (path) => path.replace(/index\.html$/, '').replace(/\/?$/, '/');
  if (!allowed.has(normalize(location.pathname))) return;
  const key = 'mapletech-visit-v2';
  const idle = 300000;
  const uuid = () => crypto.randomUUID().replaceAll('-', '');
  let memory;
  function session() {
    try { memory = JSON.parse(sessionStorage.getItem(key) || 'null') || memory; } catch {}
    if (!memory || !/^[a-f0-9]{32}$/.test(memory.id) || Date.now() - memory.last >= idle) memory = { id: uuid(), last: Date.now() };
    return memory;
  }
  function route() {
    const path = normalize(location.pathname);
    if (path !== '/career/') return path;
    const role = document.documentElement.dataset.role || new URLSearchParams(location.search).get('role');
    return path + '?role=' + (role === 'vision' ? 'vision' : 'product');
  }
  let sid = session().id;
  let page = uuid(), path = route(), seconds = 0, seq = 0;
  let last = performance.now(), visible = document.visibilityState === 'visible';
  function accrue() {
    const now = performance.now();
    // Long suspended timers (device sleep) must not count hours as reading time.
    if (visible) seconds += Math.min(30, Math.max(0, (now - last) / 1000));
    last = now;
  }
  function send(kind, attachment = '') {
    accrue();
    const current = session();
    if (current.id !== sid) { sid = current.id; page = uuid(); seconds = 0; seq = 0; }
    current.last = Date.now();
    try { sessionStorage.setItem(key, JSON.stringify(current)); } catch {}
    const params = new URLSearchParams({ v: '2', sid, pid: page, n: String(++seq), p: path, t: String(Math.floor(seconds)), e: kind });
    if (attachment) params.set('f', attachment);
    const url = '/_visit?' + params;
    try {
      if (navigator.sendBeacon?.(url, '')) return;
    } catch {}
    fetch(url, { method: 'POST', keepalive: true, credentials: 'same-origin', cache: 'no-store' }).catch(() => {});
  }
  send('start');
  setInterval(() => { if (visible) send('tick'); }, 15000);
  document.addEventListener('visibilitychange', () => {
    accrue();
    visible = document.visibilityState === 'visible';
    send(visible ? 'resume' : 'pause');
  });
  addEventListener('pagehide', () => { accrue(); visible = false; send('end'); });
  addEventListener('pageshow', (event) => { if (event.persisted) { last = performance.now(); visible = document.visibilityState === 'visible'; send('resume'); } });
  function changedRoute() {
    const next = route();
    if (next === path) return;
    send('end');
    path = next; page = uuid(); seconds = 0; seq = 0; last = performance.now();
    send('start');
  }
  new MutationObserver(changedRoute).observe(document.documentElement, { attributes: true, attributeFilter: ['data-role'] });
  addEventListener('popstate', changedRoute);
  function attachmentClick(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin === location.origin && /^\/(cv|letters)\/[^/]+\.pdf$/i.test(url.pathname)) send('download', url.pathname);
  }
  document.addEventListener('click', attachmentClick, { capture: true });
  document.addEventListener('auxclick', attachmentClick, { capture: true });
})();
