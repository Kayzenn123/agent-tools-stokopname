// Lapisan C — TEKS: scramble/decode ala papan flip untuk [data-scramble].
// Scramble berjalan per text-node (child element seperti span.num dipertahankan)
// dan elemen scramble memakai white-space:nowrap agar glyph acak tidak
// menyebabkan wrap → layout shift (temuan CLS 0,238).
import { motionAllowed } from './util.js';

const GLYPHS = '█▓▒░<>/\\|01';
const done = new WeakSet();

export function scramble(el) {
  if (done.has(el)) return;
  done.add(el);
  if (!motionAllowed()) return;
  const nodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (n.nodeValue.trim()) nodes.push(n);
  }
  if (!nodes.length) return;
  const finals = nodes.map((x) => x.nodeValue);
  const frames = 12;
  let f = 0;
  const tick = () => {
    f++;
    const p = f / frames;
    nodes.forEach((node, i) => {
      const final = finals[i];
      const cut = Math.floor(final.length * p);
      let out = final.slice(0, cut);
      for (let k = cut; k < final.length; k++) {
        out += final[k] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      node.nodeValue = out;
    });
    if (f < frames) requestAnimationFrame(tick);
    else nodes.forEach((node, i) => { node.nodeValue = finals[i]; });
  };
  tick();
}

export function initText() {
  const t0 = Date.now();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { scramble(e.target); io.unobserve(e.target); }
    }
  }, { threshold: 0.4 });

  const scan = (root = document) =>
    root.querySelectorAll('[data-scramble]').forEach((el) => io.observe(el));
  scan();

  // kartu papan di-render ulang oleh board.js → scramble elemen barunya,
  // TAPI lewati pass awal (0-2,5 dtk): HTML SSR sudah identik, scramble hanya
  // menggerakkan kotak angka (CLS) tanpa nilai tambah.
  const bento = document.getElementById('bento');
  const mo = bento ? new MutationObserver(() => {
    bento.querySelectorAll('[data-scramble]').forEach((el) => {
      if (done.has(el)) return;
      if (Date.now() - t0 < 2500) { done.add(el); return; }
      scramble(el);
    });
  }) : null;
  mo?.observe(bento, { childList: true });

  return () => { io.disconnect(); mo?.disconnect(); };
}
