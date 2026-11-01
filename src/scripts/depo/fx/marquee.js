// Lapisan B — MARQUEE: 2 band pengumuman peron, arah berlawanan,
// kecepatan + skew mengikuti velocity scroll, tombol jeda, drag inertia via input.js.
import { motionAllowed } from './util.js';

const bands = [];

export function initMarquee() {
  bands.length = 0;
  document.querySelectorAll('.marquee-band').forEach((band) => {
    const chunk = band.querySelector('.mq-chunk');
    if (!chunk) return;
    // duplikasi 3x agar loop mulus di semua viewport
    band.innerHTML = '';
    for (let i = 0; i < 3; i++) band.appendChild(chunk.cloneNode(true));
    const st = {
      el: band, dir: band.dataset.dir === 'rev' ? -1 : 1,
      x: 0, w: 0, paused: !motionAllowed(), skew: 0, manual: 0,
    };
    bands.push(st);
    requestAnimationFrame(() => { st.w = band.querySelector('.mq-chunk').offsetWidth || 600; });
  });

  let lastY = window.scrollY, raf = 0, vel = 0;
  let anyVisible = true;
  const vio = new IntersectionObserver((entries) => {
    anyVisible = entries.some((e) => e.isIntersecting);
  }, { threshold: 0 });
  document.querySelectorAll('.peron').forEach((el) => vio.observe(el));

  const loop = () => {
    raf = requestAnimationFrame(loop);
    // hemat: tidak ada kerja sama sekali saat strip di luar viewport / tab hidden
    if (document.hidden || !anyVisible) return;
    const y = window.scrollY;
    vel = vel * 0.9 + (y - lastY) * 0.1;
    lastY = y;
    for (const st of bands) {
      if (!st.paused) {
        st.x -= (0.7 + Math.min(Math.abs(vel) * 0.06, 6)) * st.dir;
        if (st.w > 0) {
          if (st.x <= -st.w) st.x += st.w;
          if (st.x >= 0) st.x -= st.w;
        }
      }
      const targetSkew = Math.max(-14, Math.min(14, vel * 0.5)) * st.dir;
      st.skew += (targetSkew - st.skew) * 0.12;
      st.el.style.transform = `translate3d(${st.x + st.manual}px,0,0) skewX(${st.skew}deg)`;
    }
  };
  raf = requestAnimationFrame(loop);

  const btn = document.getElementById('btn-marquee');
  const syncBtn = () => {
    const anyRunning = bands.some((b) => !b.paused);
    btn?.setAttribute('aria-pressed', String(!anyRunning));
    btn?.setAttribute('aria-label', anyRunning ? 'Jeda pengumuman' : 'Jalankan pengumuman');
  };
  const onToggle = () => {
    const to = !bands.every((b) => b.paused);
    bands.forEach((b) => { b.paused = to; });
    syncBtn();
  };
  btn?.addEventListener('click', onToggle);
  syncBtn();

  return () => {
    cancelAnimationFrame(raf);
    vio.disconnect();
    btn?.removeEventListener('click', onToggle);
    bands.forEach((b) => { b.el.style.transform = ''; });
    bands.length = 0;
  };
}

/** dipakai input.js untuk drag inertia */
export function marqueeBands() { return bands; }
export function setMarqueePaused(paused) {
  bands.forEach((b) => { b.paused = paused; });
}
