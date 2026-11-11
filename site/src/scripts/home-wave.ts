/**
 * 入口主页右侧的波浪线：Canvas 绘制，波长沿 x 轴渐变（呼应“周期自适应”的研究主题），
 * 波峰处打点，整体缓慢流动；鼠标靠近时局部振幅放大、波形向指针弯曲，离开后平滑复原。
 * 首次进入时从左到右“画出来”。尊重 reduced-motion（只画一帧、不响应指针），
 * 页面不可见或滚出视口时暂停。
 */
const canvas = document.getElementById('home-wave') as HTMLCanvasElement | null;

if (canvas) {
  const ctx = canvas.getContext('2d', { alpha: true })!;
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let running = false;
  let visible = true;
  let start = performance.now();
  /** 指针影响：目标值与当前值（缓动），位置也做缓动，避免抖动 */
  let pointerTarget = 0;
  let pointer = 0;
  let px = 0;
  let py = 0;
  let targetX = 0;
  let targetY = 0;

  const WAVES = [
    { yBase: 0.42, amp: 0.13, p0: 0.09, grow: 1.35, speed: 0.10, width: 1.4, alpha: 0.85, tone: 0, dots: true },
    { yBase: 0.62, amp: 0.10, p0: 0.12, grow: 0.95, speed: -0.075, width: 1.1, alpha: 0.6, tone: 1, dots: false },
  ];

  let colors = ['#f0b429', '#4fd1c5'];
  const readColors = () => {
    const cs = getComputedStyle(root);
    colors = [cs.getPropertyValue('--gold').trim() || '#f0b429', cs.getPropertyValue('--teal').trim() || '#4fd1c5'];
  };
  readColors();
  new MutationObserver(() => { readColors(); if (!running) draw(performance.now()); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

  const draw = (now: number) => {
    const time = (now - start) / 1000;
    const live = !reducedMotion.matches;
    // 每帧重读偏好：即使系统设置变化没有触发 change 事件，下一帧也会停在静态模式
    const mode = live ? 'live' : 'static';
    if (canvas.dataset.mode !== mode) canvas.dataset.mode = mode;
    // 入场：前 2.2 秒从左到右画出；静态模式直接完整显示
    const progress = live ? easeOut(time / 2.2) : 1;
    if (live) {
      pointer += (pointerTarget - pointer) * 0.08;
      px += (targetX - px) * 0.16;
      py += (targetY - py) * 0.16;
    } else {
      pointer = 0;
      pointerTarget = 0;
    }
    const sigma = Math.max(70, w * 0.09);
    ctx.clearRect(0, 0, w, h);
    const step = 2;
    const limit = w * progress;

    for (const wave of WAVES) {
      const color = colors[wave.tone];
      const baseY = h * wave.yBase;
      const amp = h * wave.amp;
      let phase = (live ? time : 0) * wave.speed * Math.PI * 2;
      let prevY = baseY;
      let rising = false;
      const peaks: { x: number; y: number; g: number }[] = [];

      ctx.beginPath();
      for (let x = 0; x <= limit; x += step) {
        const u = x / w;
        // 波长沿 x 逐渐变化 → 周期自适应
        const lambda = w * wave.p0 * (0.5 + wave.grow * u);
        phase += (step / lambda) * Math.PI * 2;
        // 指针影响：高斯窗内振幅放大、基线向指针弯曲
        const d = x - px;
        const g = pointer * Math.exp(-(d * d) / (2 * sigma * sigma));
        const localAmp = amp * (1 + 1.6 * g);
        const bend = (py - baseY) * 0.45 * g;
        const y = baseY + bend + Math.sin(phase) * localAmp;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        // 屏幕坐标下的局部极小值 = 视觉波峰
        if (y > prevY && rising) peaks.push({ x: x - step, y: prevY, g });
        rising = y < prevY;
        prevY = y;
      }
      ctx.strokeStyle = color;
      ctx.globalAlpha = wave.alpha;
      ctx.lineWidth = wave.width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();

      if (wave.dots) {
        ctx.fillStyle = color;
        for (const peak of peaks) {
          ctx.globalAlpha = wave.alpha * (0.7 + 0.3 * peak.g);
          ctx.beginPath();
          ctx.arc(peak.x, peak.y, wave.width * (1.4 + 1.8 * peak.g), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 画笔头：入场过程中在最前端点一个亮点
    if (progress < 1) {
      ctx.globalAlpha = 0.9 * (1 - progress);
      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.arc(limit, h * WAVES[0].yBase, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (live && running) raf = requestAnimationFrame(draw);
    else running = false;
  };

  const play = () => {
    if (running || reducedMotion.matches || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(draw);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  const syncMode = () => {
    if (reducedMotion.matches) {
      pause();
      draw(performance.now());
    } else {
      start = performance.now();
      play();
    }
  };

  // 指针：画布本身不接收事件（不遮挡下方链接），从窗口事件换算到画布坐标
  const setPointer = (active: boolean) => {
    pointerTarget = active ? 1 : 0;
    canvas.dataset.pointer = String(active);
  };
  window.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const margin = 40;
    const inside = x > -margin && x < rect.width + margin && y > -margin && y < rect.height + margin;
    if (inside) {
      targetX = x;
      targetY = y;
      if (pointerTarget !== 1) { px = x; py = y; }
      setPointer(true);
    } else if (pointerTarget !== 0) {
      setPointer(false);
    }
  }, { passive: true });
  document.addEventListener('pointerout', (event) => { if (!event.relatedTarget) setPointer(false); });

  resize();
  canvas.dataset.pointer = 'false';
  syncMode();
  reducedMotion.addEventListener('change', syncMode);
  window.addEventListener('resize', () => { resize(); if (!running) draw(performance.now()); }, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) play(); else pause(); }, { threshold: 0 }).observe(canvas);
}
